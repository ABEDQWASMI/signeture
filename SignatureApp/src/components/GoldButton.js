import React, { useRef } from 'react';
import {
  TouchableOpacity, Text, StyleSheet, View,
  ActivityIndicator, Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Typography, Radii, Shadows } from '../constants/theme';

export function GoldButton({
  title, onPress, variant = 'primary', size = 'md',
  loading = false, icon, style,
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const iconScale = useRef(new Animated.Value(1)).current;

  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const isGhost   = variant === 'ghost';

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 0.96, damping: 18, stiffness: 300, useNativeDriver: true }),
      Animated.spring(iconScale, { toValue: 1.15, damping: 14, stiffness: 260, useNativeDriver: true }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, damping: 14, stiffness: 260, useNativeDriver: true }),
      Animated.spring(iconScale, { toValue: 1, damping: 14, stiffness: 260, useNativeDriver: true }),
    ]).start();
  };

  const iconMap = { '→': 'arrow-right', '←': 'arrow-left', '+': 'plus', '✓': 'check', '✕': 'x' };
  const featherIcon = icon ? (iconMap[icon] || icon) : null;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={[
          styles.base,
          isPrimary && styles.primary,
          isOutline && styles.outline,
          isGhost   && styles.ghost,
          size === 'sm' && styles.sm,
          size === 'lg' && styles.lg,
          isPrimary && Shadows.gold,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={isPrimary ? Colors.background : Colors.primary} size="small" />
        ) : (
          <View style={styles.inner}>
            <Text style={[
              styles.label,
              isPrimary && styles.labelPrimary,
              isOutline && styles.labelOutline,
              isGhost   && styles.labelGhost,
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
                  color={isPrimary ? Colors.background : Colors.primary}
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
  primary: {
    backgroundColor: Colors.primary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  sm: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  lg: {
    paddingVertical: 18,
    paddingHorizontal: 36,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  label: {
    fontWeight: Typography.semibold,
    letterSpacing: Typography.wide,
    textTransform: 'uppercase',
  },
  labelPrimary: {
    color: Colors.background,
    fontSize: Typography.sm,
  },
  labelOutline: {
    color: Colors.primary,
    fontSize: Typography.sm,
  },
  labelGhost: {
    color: Colors.secondary,
    fontSize: Typography.sm,
  },
  labelSm: {
    fontSize: Typography.xs,
  },
  labelLg: {
    fontSize: Typography.base,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: Radii.pill,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCirclePrimary: {
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  iconText: {
    fontSize: 14,
    color: Colors.secondary,
  },
  iconTextPrimary: {
    color: Colors.background,
  },
});
