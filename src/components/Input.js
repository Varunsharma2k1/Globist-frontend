import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { RADIUS, SPACING, FONTS } from '../theme';
import { useTheme } from '../hooks/useTheme';

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  multiline,
  leftIcon,
  rightIcon,
  onRightIconPress,
  onSubmitEditing,
  returnKeyType,
  onFocus,
  onBlur,
  autoCapitalize,
  autoCorrect,
  autoComplete,
  textContentType,
  style,
}) {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
      <View style={styles.inputWrap}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.surfaceMuted, color: colors.text },
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
            multiline && styles.multiline,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          onSubmitEditing={onSubmitEditing}
          returnKeyType={returnKeyType}
          onFocus={onFocus}
          onBlur={onBlur}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          autoComplete={autoComplete}
          textContentType={textContentType}
        />
        {rightIcon && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontFamily: FONTS.semibold,
    fontSize: 13,
    marginBottom: SPACING.xs,
  },
  inputWrap: {
    justifyContent: 'center',
  },
  input: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    fontFamily: FONTS.body,
    fontSize: 15,
  },
  inputWithLeftIcon: {
    paddingLeft: 44,
  },
  inputWithRightIcon: {
    paddingRight: 44,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  leftIcon: {
    position: 'absolute',
    left: SPACING.md,
    zIndex: 1,
  },
  rightIcon: {
    position: 'absolute',
    right: SPACING.md,
    zIndex: 1,
  },
});
