import React, { useRef } from 'react';
import { View, TextInput, Text, StyleSheet, Animated } from 'react-native';
import { Colors, Typography, Radii } from '../constants/theme';

export function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize = 'none',
  rightElement,
  error,
  multiline,
  numberOfLines,
  rtl = false,
}) {
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    Animated.timing(borderAnim, {
      toValue: 1, duration: 250, useNativeDriver: false,
    }).start();
  };
  const handleBlur = () => {
    Animated.timing(borderAnim, {
      toValue: 0, duration: 250, useNativeDriver: false,
    }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,255,255,0.06)', 'rgba(197,163,109,0.55)'],
  });

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text style={[styles.label, rtl && styles.labelRtl]}>{label}</Text>
      )}
      <Animated.View style={[styles.outerShell, { borderColor }]}>
        <View style={[styles.innerCore, error && styles.innerCoreError]}>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={Colors.textSubtle}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            onFocus={handleFocus}
            onBlur={handleBlur}
            textAlign={rtl ? 'right' : 'left'}
            style={[styles.input, multiline && styles.multiline]}
            multiline={multiline}
            numberOfLines={numberOfLines}
          />
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
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 2,
  },
  innerCore: {
    backgroundColor: Colors.surfaceBg,
    borderRadius: Radii.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  innerCoreError: {
    borderWidth: 1,
    borderColor: Colors.error,
  },
  input: {
    flex: 1,
    color: Colors.secondary,
    fontSize: Typography.base,
    paddingVertical: 14,
    fontWeight: Typography.regular,
  },
  multiline: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  rightElement: {
    paddingLeft: 8,
  },
  error: {
    color: Colors.error,
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
