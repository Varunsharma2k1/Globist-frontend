import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SendHorizontal, BadgeCheck } from 'lucide-react-native';
import Header from '../../../components/Header';
import { useTheme } from '../../../hooks/useTheme';
import { useChat } from '../../../hooks/useChat';
import { SPACING } from '../../../theme';
import { getStyles } from '../styles';
import MessageBubble from '../components/MessageBubble';
import { getMessages, startConversation } from '../../../api/chat';

const PAGE = 30;
const sameId = (a, b) => String(a) === String(b);

/**
 * One 1:1 thread. Route params, either:
 *   { conversation }            — opened from the inbox
 *   { userId | agencyId, title } — opened from a profile; finds or creates it
 *
 * Messages are kept newest-first for an inverted FlatList. Sends are
 * optimistic: a bubble with the client id shows immediately and is replaced
 * by the server copy (matched on clientId) when it's acknowledged or arrives
 * over the socket — whichever comes first.
 */
export default function ChatThreadScreen({ route, navigation }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const insets = useSafeAreaInsets();
  const chat = useChat();
  const { userId, subscribe, sendMessage, markRead, sendTyping, typing, online, connected } = chat;

  const params = route.params || {};
  const [conversation, setConversation] = useState(params.conversation || null);
  const [startError, setStartError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [text, setText] = useState('');
  const typingSent = useRef(false);
  const typingTimer = useRef(null);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    const ios = Platform.OS === 'ios';
    const show = Keyboard.addListener(ios ? 'keyboardWillShow' : 'keyboardDidShow', () =>
      setKeyboardOpen(true)
    );
    const hide = Keyboard.addListener(ios ? 'keyboardWillHide' : 'keyboardDidHide', () =>
      setKeyboardOpen(false)
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const conversationId = conversation?._id ? String(conversation._id) : null;
  const live = chat.conversations.find((c) => sameId(c._id, conversationId));
  const other = live?.other || conversation?.other;
  const otherLastReadAt = live?.otherLastReadAt || conversation?.otherLastReadAt;

  // Resolve the conversation when opened from a profile.
  useEffect(() => {
    if (conversation) return;
    let alive = true;
    startConversation({ userId: params.userId, agencyId: params.agencyId })
      .then((c) => {
        if (!alive) return;
        setConversation(c);
        chat.upsertConversation(c);
      })
      .catch((e) => alive && setStartError(e?.response?.data?.message || 'Could not open chat'));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadLatest = useCallback(async () => {
    if (!conversationId) return;
    try {
      const res = await getMessages(conversationId, { limit: PAGE });
      setMessages((prev) => {
        const pending = prev.filter((m) => m.status);
        const fetched = res.messages.slice().reverse();
        const ids = new Set(fetched.map((m) => m.clientId).filter(Boolean));
        return [...pending.filter((p) => !ids.has(p.clientId)), ...fetched];
      });
      setHasMore(res.hasMore);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    loadLatest();
  }, [loadLatest]);

  useEffect(() => {
    if (conversationId) markRead(conversationId);
  }, [conversationId, markRead]);

  useEffect(() => {
    if (other?._id) chat.queryPresence([String(other._id)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [other?._id, connected]);

  // Live events for this thread.
  useEffect(() => {
    if (!conversationId) return undefined;
    return subscribe((evt) => {
      if (evt.type === 'reconnect') return loadLatest();
      if (evt.type !== 'message' || !sameId(evt.message.conversation, conversationId)) return;
      const m = evt.message;
      setMessages((prev) => {
        if (prev.some((x) => sameId(x._id, m._id))) return prev;
        const i = m.clientId ? prev.findIndex((x) => x.clientId === m.clientId && x.status) : -1;
        if (i >= 0) {
          const next = prev.slice();
          next[i] = m;
          return next;
        }
        return [m, ...prev];
      });
      if (!sameId(m.sender, userId)) markRead(conversationId);
    });
  }, [conversationId, subscribe, loadLatest, markRead, userId]);

  const loadOlder = async () => {
    if (!hasMore || loadingOlder || !messages.length) return;
    const oldest = messages[messages.length - 1];
    setLoadingOlder(true);
    try {
      const res = await getMessages(conversationId, { before: oldest.createdAt, limit: PAGE });
      setMessages((prev) => [...prev, ...res.messages.slice().reverse()]);
      setHasMore(res.hasMore);
    } finally {
      setLoadingOlder(false);
    }
  };

  const deliver = async (pending) => {
    try {
      const saved = await sendMessage(conversationId, pending.text, pending.clientId);
      setMessages((prev) => {
        // The socket echo may already have swapped it in.
        if (prev.some((x) => sameId(x._id, saved._id))) {
          return prev.filter((x) => !(x.clientId === pending.clientId && x.status));
        }
        return prev.map((x) => (x.clientId === pending.clientId && x.status ? saved : x));
      });
    } catch {
      setMessages((prev) =>
        prev.map((x) =>
          x.clientId === pending.clientId && x.status ? { ...x, status: 'failed' } : x
        )
      );
    }
  };

  const onSend = () => {
    const body = text.trim();
    if (!body || !conversationId) return;
    const clientId = chat.newClientId();
    const pending = {
      _id: clientId,
      clientId,
      text: body,
      sender: userId,
      createdAt: new Date().toISOString(),
      status: 'sending',
    };
    setMessages((prev) => [pending, ...prev]);
    setText('');
    stopTyping();
    deliver(pending);
  };

  const retry = (m) => {
    setMessages((prev) =>
      prev.map((x) => (x.clientId === m.clientId ? { ...x, status: 'sending' } : x))
    );
    deliver(m);
  };

  const stopTyping = () => {
    clearTimeout(typingTimer.current);
    if (typingSent.current && conversationId) sendTyping(conversationId, false);
    typingSent.current = false;
  };

  const onChangeText = (value) => {
    setText(value);
    if (!conversationId) return;
    if (!typingSent.current && value) {
      sendTyping(conversationId, true);
      typingSent.current = true;
    }
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(stopTyping, 2500);
  };

  useEffect(() => () => stopTyping(), []); // eslint-disable-line react-hooks/exhaustive-deps

  // Last of my sent messages the other person has read -> "Seen".
  const seenId = useMemo(() => {
    if (!otherLastReadAt) return null;
    const t = new Date(otherLastReadAt).getTime();
    const m = messages.find(
      (x) => !x.status && sameId(x.sender, userId) && new Date(x.createdAt).getTime() <= t
    );
    return m ? String(m._id) : null;
  }, [messages, otherLastReadAt, userId]);

  const renderItem = ({ item, index }) => (
    <MessageBubble
      message={item}
      older={messages[index + 1]}
      mine={sameId(item.sender, userId)}
      seen={String(item._id) === seenId}
      onRetry={retry}
      styles={styles}
    />
  );

  const isOnline = other?._id && online[String(other._id)];
  const subtitle = typing[conversationId]
    ? 'typing…'
    : isOnline
      ? 'online'
      : !connected
        ? 'connecting…'
        : null;

  const title = other?.name || params.title || 'Chat';

  // Tap the name -> their profile (agency page for agency chats).
  const agencyRef = live?.agency || conversation?.agency;
  const openProfile = agencyRef?._id
    ? () => navigation.push('AgencyProfile', { agency: agencyRef })
    : other?._id
      ? () => navigation.push('CreatorProfile', { creator: other })
      : undefined;

  return (
    <View style={styles.container}>
      <Header
        title={title}
        onBack={() => navigation.goBack()}
        onPressTitle={openProfile}
        rightElement={other?.isVerified ? <BadgeCheck size={18} color={colors.verified} /> : null}
      />
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      {startError ? (
        <View style={styles.center}>
          <Text style={styles.empty}>{startError}</Text>
        </View>
      ) : (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          // Android is always edge-to-edge on this SDK, so the window no longer
          // resizes for the keyboard; pad on both platforms. No vertical offset: this
          // view's own position already includes the header, so adding one left a
          // header-sized gap above the keyboard.
          behavior="padding"
        >
          {loading || !conversationId ? (
            <View style={styles.center}>
              <ActivityIndicator color={colors.ink} />
            </View>
          ) : !messages.length ? (
            // Outside the inverted list, so it can't render upside down.
            <View style={styles.center}>
              <Text style={styles.empty}>Say hi to {title} 👋</Text>
            </View>
          ) : (
            <FlatList
              inverted
              data={messages}
              keyExtractor={(m) => String(m._id)}
              renderItem={renderItem}
              contentContainerStyle={styles.list}
              onEndReached={loadOlder}
              onEndReachedThreshold={0.3}
              keyboardShouldPersistTaps="handled"
              ListFooterComponent={
                loadingOlder ? (
                  <ActivityIndicator style={{ margin: SPACING.md }} color={colors.ink} />
                ) : null
              }
            />
          )}

          <View
            style={[
              styles.composer,
              // Breathing room above the home indicator / screen edge; tighter with the keyboard up.
              {
                paddingBottom: keyboardOpen
                  ? SPACING.sm
                  : Math.max(insets.bottom + SPACING.sm, SPACING.lg),
              },
            ]}
          >
            <TextInput
              style={styles.input}
              value={text}
              onChangeText={onChangeText}
              placeholder="Message…"
              placeholderTextColor={colors.textMuted}
              multiline
              maxLength={4000}
            />
            <TouchableOpacity
              onPress={onSend}
              disabled={!text.trim() || !conversationId}
              style={[styles.sendBtn, (!text.trim() || !conversationId) && { opacity: 0.4 }]}
              accessibilityLabel="Send message"
            >
              <SendHorizontal size={18} color={colors.ink} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}
