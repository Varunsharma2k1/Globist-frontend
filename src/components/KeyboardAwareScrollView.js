import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, Keyboard, Platform, ScrollView, TextInput } from 'react-native';

const GAP_ABOVE_KEYBOARD = 16;

/**
 * A ScrollView that keeps whatever field you're typing in right above the
 * keyboard (like WhatsApp / Instagram forms). Drop-in replacement for
 * ScrollView; no per-field wiring and no KeyboardAvoidingView needed.
 *
 * How: when the keyboard opens it adds the keyboard's height as bottom
 * padding (so there's room to scroll), finds the focused TextInput, measures
 * where it really is on screen and scrolls just enough to lift it above the
 * keyboard. Tapping another field while the keyboard is open does the same.
 */
export default function KeyboardAwareScrollView({
  children,
  contentContainerStyle,
  onScroll,
  extraGap = GAP_ABOVE_KEYBOARD,
  ...rest
}) {
  const scrollRef = useRef(null);
  const scrollY = useRef(0);
  const keyboardTop = useRef(null); // screen Y where the keyboard starts, null when hidden
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const revealFocused = useCallback(() => {
    const input = TextInput.State.currentlyFocusedInput?.();
    const kbTop = keyboardTop.current;
    if (!input || kbTop == null || !scrollRef.current) return;
    input.measureInWindow((x, y, width, height) => {
      const fieldBottom = y + height + extraGap;
      const overlap = fieldBottom - kbTop;
      if (overlap > 0) {
        scrollRef.current?.scrollTo({ y: scrollY.current + overlap, animated: true });
      } else if (y < 0) {
        scrollRef.current?.scrollTo({
          y: Math.max(0, scrollY.current + y - extraGap),
          animated: true,
        });
      }
    });
  }, [extraGap]);

  useEffect(() => {
    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const show = Keyboard.addListener(showEvt, (e) => {
      const { height, screenY } = e.endCoordinates;
      const windowH = Dimensions.get('window').height;
      keyboardTop.current = screenY && screenY < windowH ? screenY : windowH - height;
      setKeyboardHeight(height);
      // Wait for the padding to apply and the keyboard animation to settle.
      setTimeout(revealFocused, Platform.OS === 'ios' ? 280 : 80);
    });
    const hide = Keyboard.addListener(hideEvt, () => {
      keyboardTop.current = null;
      setKeyboardHeight(0);
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, [revealFocused]);

  const handleScroll = (e) => {
    scrollY.current = e.nativeEvent.contentOffset.y;
    onScroll?.(e);
  };

  // Switching fields while the keyboard is already open.
  const handleTouchEnd = () => {
    if (keyboardTop.current != null) setTimeout(revealFocused, 120);
  };

  return (
    <ScrollView
      ref={scrollRef}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
      scrollEventThrottle={16}
      {...rest}
      onScroll={handleScroll}
      onTouchEnd={handleTouchEnd}
      contentContainerStyle={[
        contentContainerStyle,
        keyboardHeight ? { paddingBottom: keyboardHeight + extraGap } : null,
      ]}
    >
      {children}
    </ScrollView>
  );
}
