import React, { useRef } from 'react';
import {
  TouchableOpacity, Text, StyleSheet, View,
  ActivityIndicator, Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Typography, Radii, Shadows } from '../constants/theme';
import { useApp } from '../context/AppContext';

export function GoldButton({
  title, onPress, variant = 'primary', size = 'md',
  loading = false, icon, style,
}) {
  const { colors, isDark } = useApp();
  const C = colors;

  const scale     = useRef(new Animated.Value(1)).current;
  const iconScale = useRef(new Animated.Value(1)).current;

  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const isGhost   = variant === 'ghost';

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scale,     { toValue: 0.96, damping: 18, stiffness: 300, useNativeDriver: true }),
      Animated.spring(iconScale, { toValue: 1.15, damping: 14, stiffness: 260, useNativeDriver: true }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scale,     { toValue: 1, damping: 14, stiffness: 260, useNativeDriver: true }),
      Animated.spring(iconScale, { toValue: 1, damping: 14, stiffness: 260, useNativeDriver: true }),
    ]).start();
  };

  const iconMap   = { '→': 'arrow-right', '←': 'arrow-left', '+': 'plus', '✓': 'check', '✕': 'x' };
  const featherIcon = icon ? (iconMap[icon] || icon) : null;

  // Theme-aware text color
  const textColor = isPrimary
    ? (isDark ? '#0A0805' : '#FFFFFF')
    : isOutline
    ? C.primary
    : C.secondary;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={[
          styles.base,
          isPrimary && [{ backgroundColor: C.primary }, Shadows.gold],
          isOutline && [styles.outline, { borderColor: C.primary }],
          isGhost   && styles.ghost,
          size === 'sm' && styles.sm,
          size === 'lg' && styles.lg,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={textColor} size="small" />
        ) : (
          <View style={styles.inner}>
            <Text style={[
              styles.label,
              { color: textColor },
              size === 'sm' && styles.labelSm,
              size === 'lg' && styles.labelLg,
            ]}>
              {title}
            </Text>
            {featherIcon && (
              <Animated.View style={[
                styles.iconCircle,
                isPrimary && styles.iconCirclePrimary,
                { transform: [{ scale: iconScale }] },
              ]}>
                <Feather
                  name={featherIcon}
                  size={size === 'sm' ? 12 : size === 'lg' ? 16 : 14}
                  color={textColor}
                />
              </Animated.View>
            )}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  sm: { paddingVertical: 10, paddingHorizontal: 20 },
  lg: { paddingVertical: 18, paddingHorizontal: 36 },
  inner: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  label: {
    fontWeight: Typography.semibold,
    letterSpacing: Typography.wide,
    fontSize: Typography.sm,
    textTransform: 'uppercase',
  },
  labelSm: { fontSize: Typography.xs },
  labelLg: { fontSize: Typography.base },
  iconCircle: {
    width: 28, height: 28, borderRadius: Radii.pill,
    backgroundColor: 'rgba(0,0,0,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  iconCirclePrimary: { backgroundColor: 'rgba(0,0,0,0.20)' },
});
