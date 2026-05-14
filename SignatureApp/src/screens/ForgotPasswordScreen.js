import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Colors, Typography, Radii, Spacing, Shadows } from '../constants/theme';
import { GoldButton } from '../components/GoldButton';
import { InputField } from '../components/InputField';

export function ForgotPasswordScreen({ navigation }) {
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=new password, 4=done
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    if (step < 4) setStep(step + 1);
  };

  const steps = [
    { num: 1, label: 'البريد' },
    { num: 2, label: 'التحقق' },
    { num: 3, label: 'التغيير' },
  ];

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[Colors.background, '#0A0800', Colors.background]}
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
              <Feather name="arrow-right" size={18} color={Colors.primary} />
              <Text style={styles.backText}>رجوع لتسجيل الدخول</Text>
            </TouchableOpacity>

            {/* Lock icon */}
            <View style={styles.iconArea}>
              <View style={styles.iconRing}>
                <Feather name={step === 4 ? 'check-circle' : 'lock'} size={32} color={Colors.primary} />
              </View>
            </View>

            {/* Step indicator */}
            {step < 4 && (
              <View style={styles.stepRow}>
                {steps.map((s, i) => (
                  <React.Fragment key={s.num}>
                    <View style={styles.stepItem}>
                      <View style={[styles.stepDot, step >= s.num && styles.stepDotActive]}>
                        {step > s.num
                          ? <Feather name="check" size={12} color={Colors.background} />
                          : <Text style={[styles.stepNum, step >= s.num && styles.stepNumActive]}>{s.num}</Text>
                        }
                      </View>
                      <Text style={[styles.stepLabel, step >= s.num && styles.stepLabelActive]}>{s.label}</Text>
                    </View>
                    {i < steps.length - 1 && (
                      <View style={[styles.stepLine, step > s.num && styles.stepLineActive]} />
                    )}
                  </React.Fragment>
                ))}
              </View>
            )}

            {/* Card */}
            <View style={styles.outerShell}>
              <View style={styles.innerCore}>
                {step === 1 && (
                  <>
                    <Text style={styles.heading}>نسيت كلمة المرور؟</Text>
                    <Text style={styles.subheading}>
                      أدخل بريدك وسنرسل لك رمز التحقق.
                    </Text>
                    <InputField
                      label="البريد الإلكتروني"
                      value={email}
                      onChangeText={setEmail}
                      placeholder="hello@signature.co"
                      keyboardType="email-address"
                    />
                    <GoldButton title="Send Code" onPress={handleNext} loading={loading} icon="→" />
                  </>
                )}

                {step === 2 && (
                  <>
                    <Text style={styles.heading}>Check your inbox</Text>
                    <Text style={styles.subheading}>
                      We sent a 6-digit code to{'\n'}<Text style={styles.emailHighlight}>{email}</Text>
                    </Text>
                    <InputField
                      label="Verification Code"
                      value={otp}
                      onChangeText={setOtp}
                      placeholder="000000"
                      keyboardType="number-pad"
                    />
                    <GoldButton title="Verify Code" onPress={handleNext} loading={loading} icon="→" />
                    <TouchableOpacity style={styles.resendRow}>
                      <Text style={styles.resendText}>Didn't receive it? <Text style={styles.resendLink}>Resend</Text></Text>
                    </TouchableOpacity>
                  </>
                )}

                {step === 3 && (
                  <>
                    <Text style={styles.heading}>كلمة مرور جديدة</Text>
                    <Text style={styles.subheading}>اختر كلمة مرور قوية لحسابك.</Text>
                    <InputField
                      label="كلمة المرور الجديدة"
                      value={newPw}
                      onChangeText={setNewPw}
                      placeholder="••••••••"
                      secureTextEntry
                      rtl
                    />
                    <InputField
                      label="تأكيد كلمة المرور"
                      value={confirmPw}
                      onChangeText={setConfirmPw}
                      placeholder="••••••••"
                      secureTextEntry
                      rtl
                    />
                    <GoldButton title="تغيير كلمة المرور" onPress={handleNext} loading={loading} icon="→" />
                  </>
                )}

                {step === 4 && (
                  <>
                    <Text style={styles.heading}>تم تغيير كلمة المرور!</Text>
                    <Text style={styles.subheading}>
                      تم تحديث كلمة مرورك. يمكنك الآن تسجيل الدخول ببياناتك الجديدة.
                    </Text>
                    <GoldButton
                      title="العودة لتسجيل الدخول"
                      onPress={() => navigation.navigate('Login')}
                      icon="→"
                      style={{ marginTop: 8 }}
                    />
                  </>
                )}
              </View>
            </View>

          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1, padding: Spacing.lg, paddingTop: Spacing.md },
  back: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: Spacing.lg },
  backText: { color: Colors.primary, fontSize: Typography.sm, fontWeight: Typography.medium },
  iconArea: { alignItems: 'center', marginBottom: Spacing.lg },
  iconRing: {
    width: 90, height: 90, borderRadius: 45,
    borderWidth: 2, borderColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(197,163,109,0.08)',
    ...Shadows.gold,
  },
  iconEmoji: { fontSize: 40 },
  stepRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', marginBottom: Spacing.xl, gap: 0,
  },
  stepItem: { alignItems: 'center', gap: 6 },
  stepDot: {
    width: 36, height: 36, borderRadius: 18,
    borderWidth: 2, borderColor: Colors.cardBorder,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.cardBg,
  },
  stepDotActive: { borderColor: Colors.primary, backgroundColor: 'rgba(197,163,109,0.15)' },
  stepNum: { color: Colors.textMuted, fontSize: Typography.sm, fontWeight: Typography.semibold },
  stepNumActive: { color: Colors.primary },
  stepLabel: { color: Colors.textMuted, fontSize: Typography.xs, letterSpacing: 1 },
  stepLabelActive: { color: Colors.primary },
  stepLine: { width: 40, height: 2, backgroundColor: Colors.cardBorder, marginBottom: 20, marginHorizontal: 4 },
  stepLineActive: { backgroundColor: Colors.primary },
  outerShell: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: Radii['2xl'], borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    padding: 3, ...Shadows.card,
  },
  innerCore: { backgroundColor: Colors.surfaceBg, borderRadius: Radii.xl, padding: Spacing.lg },
  heading: {
    color: Colors.secondary, fontSize: Typography['2xl'],
    fontWeight: Typography.bold, letterSpacing: Typography.tight, marginBottom: 8,
  },
  subheading: { color: Colors.textMuted, fontSize: Typography.base, lineHeight: 24, marginBottom: Spacing.lg },
  emailHighlight: { color: Colors.primary, fontWeight: Typography.semibold },
  resendRow: { alignItems: 'center', marginTop: 14 },
  resendText: { color: Colors.textMuted, fontSize: Typography.sm },
  resendLink: { color: Colors.primary, fontWeight: Typography.medium },
});
