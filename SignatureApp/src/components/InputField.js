import React, { useRef } from 'react';
import { View, TextInput, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Typography, Radii } from '../constants/theme';
import { useApp } from '../context/AppContext';

export function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize = 'none',
  rightElement,
  rightIcon,
  onRightIconPress,
  error,
  multiline,
  numberOfLines,
  rtl = true,
}) {
  const { colors, isDark } = useApp();
  const C = colors;
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    Animated.timing(borderAnim, { toValue: 1, duration: 250, useNativeDriver: false }).start();
  };
  const handleBlur = () => {
    Animated.timing(borderAnim, { toValue: 0, duration: 250, useNativeDriver: false }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      isDark ? 'rgba(197,163,109,0.12)' : 'rgba(139,99,50,0.12)',
      isDark ? 'rgba(197,163,109,0.55)' : 'rgba(139,99,50,0.50)',
    ],
  });

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text style={[styles.label, { color: C.textMuted }, rtl && styles.labelRtl]}>{label}</Text>
      )}
      <Animated.View
        style={[
          styles.outerShell,
          {
            borderColor,
            backgroundColor: isDark ? 'rgba(197,163,109,0.04)' : 'rgba(139,99,50,0.03)',
          },
        ]}
      >
        <View
          style={[
            styles.innerCore,
            { backgroundColor: isDark ? C.surfaceBg : '#FFFFFF' },
            error && { borderWidth: 1, borderColor: '#E53935' },
          ]}
        >
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={isDark ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.28)'}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            onFocus={handleFocus}
            onBlur={handleBlur}
            textAlign={rtl ? 'right' : 'left'}
            style={[styles.input, { color: C.secondary }, multiline && styles.multiline]}
            multiline={multiline}
            numberOfLines={numberOfLines}
          />
          {rightIcon && (
            <TouchableOpacity onPress={onRightIconPress} style={styles.rightIconBtn}>
              <Feather name={rightIcon} size={18} color={C.textMuted} />
            </TouchableOpacity>
          )}
          {rightElement && (
            <View style={styles.rightElement}>{rightElement}</View>
          )}
        </View>
      </Animated.View>
      {error && <Text style={[styles.error, rtl && styles.errorRtl]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    color: Colors.textMuted,
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  labelRtl: {
    textAlign: 'right',
  },
  outerShell: {
    borderRadius: Radii.lg,
    borderWidth: 1.5,
    padding: 2,
  },
  innerCore: {
    borderRadius: Radii.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  innerCoreError: {
    borderWidth: 1,
    borderColor: '#E53935',
  },
  input: {
    flex: 1,
    fontSize: Typography.base,
    paddingVertical: 14,
    fontWeight: Typography.regular,
  },
  multiline: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  rightElement: { paddingLeft: 8 },
  rightIconBtn: { paddingHorizontal: 10, paddingVertical: 4 },
  error: {
    color: '#E53935',
    fontSize: Typography.xs,
    marginTop: 6,
    marginLeft: 4,
  },
  errorRtl: {
    textAlign: 'right',
    marginLeft: 0,
    marginRight: 4,
  },
});
