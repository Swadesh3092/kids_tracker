import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing } from '../theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface Props {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
}

const RIPPLE_ON_DARK = { color: 'rgba(255, 255, 255, 0.3)' };
const RIPPLE_ON_LIGHT = { color: 'rgba(91, 70, 64, 0.15)' };

export function Button({ label, onPress, variant = 'primary', disabled, loading }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      android_ripple={variant === 'ghost' ? RIPPLE_ON_LIGHT : RIPPLE_ON_DARK}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        variant === 'danger' && styles.danger,
        (disabled || loading) && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'ghost' ? colors.primaryDeep : colors.white} />
      ) : (
        <Text
          style={[
            styles.label,
            variant === 'ghost' && { color: colors.primaryDeep },
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    alignSelf: 'stretch',
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.primaryDeep,
  },
  secondary: {
    backgroundColor: colors.secondaryDeep,
  },
  ghost: {
    backgroundColor: colors.primarySoft,
  },
  danger: {
    backgroundColor: colors.dangerDeep,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
  label: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
