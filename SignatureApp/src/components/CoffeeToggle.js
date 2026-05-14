import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Animated, StyleSheet, View } from 'react-native';
import { Colors } from '../constants/theme';

const TRACK_W = 50;
const TRACK_H = 28;
const THUMB_SIZE = 22;
const THUMB_TRAVEL = TRACK_W - THUMB_SIZE - 4;

export function CoffeeToggle({ value, onValueChange }) {
  const translateX = useRef(new Animated.Value(value ? THUMB_TRAVEL : 2)).current;
  const trackColor  = useRef(new Animated.Value(value ? 1 : 0)).current;
  const thumbScale  = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: value ? THUMB_TRAVEL : 2,
        damping: 14, stiffness: 280, useNativeDriver: true,
      }),
      Animated.timing(trackColor, {
        toValue: value ? 1 : 0, duration: 220, useNativeDriver: false,
      }),
    ]).start();
  }, [value]);

  const bgColor = trackColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,255,255,0.12)', Colors.primary],
  });

  const borderColor = trackColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,255,255,0.18)', Colors.primary],
  });

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(thumbScale, { toValue: 0.85, duration: 80, useNativeDriver: true }),
      Animated.spring(thumbScale, { toValue: 1, damping: 10, stiffness: 300, useNativeDriver: true }),
    ]).start();
    onValueChange && onValueChange(!value);
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={1}>
      <Animated.View style={[styles.track, { backgroundColor: bgColor, borderColor }]}>
        <Animated.View style={[
          styles.thumb,
          {
            transform: [{ translateX }, { scale: thumbScale }],
            backgroundColor: value ? Colors.background : 'rgba(255,255,255,0.6)',
            shadowColor: Colors.primary,
            shadowOpacity: value ? 0.6 : 0,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 0 },
            elevation: value ? 4 : 0,
          },
        ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TRACK_W,
    height: TRACK_H,
    borderRadius: TRACK_H / 2,
    borderWidth: 1.5,
    justifyContent: 'center',
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
  },
});
