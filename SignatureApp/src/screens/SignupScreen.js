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
import { useApp } from '../context/AppContext';

export function SignupScreen({ navigation }) {
  const { login } = useApp();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'الاسم مطلوب';
    if (!form.email.includes('@')) e.email = 'أدخل بريداً إلكترونياً صحيحاً';
    if (form.password.length < 6) e.password = 'يجب أن تكون 6 أحرف على الأقل';
    if (form.password !== form.confirm) e.confirm = 'كلمتا المرور غير متطابقتين';
    if (!agreed) e.terms = 'يجب الموافقة على الشروط';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    login({ name: form.name, email: form.email, avatar: null, tier: 'Green', stars: 0 });
    setLoading(false);
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#1A1200', Colors.background, Colors.background]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.glow} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

            {/* Header */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
              <Feather name="arrow-right" size={20} color={Colors.primary} />
              <Text style={styles.backText}>رجوع</Text>
            </TouchableOpacity>

            <View style={styles.header}>
              <View style={styles.eyebrow}>
                <Text style={styles.eyebrowText}>انضم إلى العائلة</Text>
              </View>
              <Text style={styles.heading}>إنشاء حساب</Text>
              <Text style={styles.subheading}>ابدأ بجمع المكافآت من اليوم الأول</Text>
            </View>

            {/* Tier preview */}
            <View style={styles.tierCard}>
              <View style={styles.tierIconWrap}>
                <Feather name="star" size={20} color="#4CAF50" />
              </View>
              <View>
                <Text style={styles.tierTitle}>عضو Green — مجاني</Text>
                <Text style={styles.tierDesc}>اكسب نجمة لكل ريال · مشروب مجاني في يوم ميلادك</Text>
              </View>
            </View>

            {/* Form card */}
            <View style={styles.outerShell}>
              <View style={styles.innerCore}>
                <InputField label="الاسم الكامل" value={form.name} onChangeText={set('name')} placeholder="محمد أحمد" autoCapitalize="words" error={errors.name} rtl />
                <InputField label="البريد الإلكتروني" value={form.email} onChangeText={set('email')} placeholder="hello@signature.co" keyboardType="email-address" error={errors.email} rtl />
                <InputField label="رقم الهاتف (اختياري)" value={form.phone} onChangeText={set('phone')} placeholder="+966 5x xxx xxxx" keyboardType="phone-pad" rtl />
                <InputField label="كلمة المرور" value={form.password} onChangeText={set('password')} placeholder="••••••••" secureTextEntry error={errors.password} rtl />
                <InputField label="تأكيد كلمة المرور" value={form.confirm} onChangeText={set('confirm')} placeholder="••••••••" secureTextEntry error={errors.confirm} rtl />

                {/* Terms */}
                <TouchableOpacity style={styles.termsRow} onPress={() => setAgreed(!agreed)} activeOpacity={0.8}>
                  <Text style={styles.termsText}>
                    <Text style={styles.termsLink}>سياسة الخصوصية</Text>
                    {' '}و{' '}
                    <Text style={styles.termsLink}>شروط الخدمة</Text>
                    {' '}أوافق على
                  </Text>
                  <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                    {agreed && <Feather name="check" size={12} color={Colors.background} />}
                  </View>
                </TouchableOpacity>
                {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}

                <GoldButton
                  title="إنشاء الحساب"
                  onPress={handleSignup}
                  loading={loading}
                  icon="→"
                  style={{ marginTop: 12 }}
                />

                {/* Social signup */}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>أو سجّل بـ</Text>
                  <View style={styles.dividerLine} />
                </View>

                <View style={styles.socialRow}>
                  <TouchableOpacity style={styles.socialBtn} activeOpacity={0.8}>
                    <Feather name="smartphone" size={15} color={Colors.secondary} />
                    <Text style={styles.socialBtnText}>Apple</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.socialBtn} activeOpacity={0.8}>
                    <Feather name="globe" size={15} color={Colors.secondary} />
                    <Text style={styles.socialBtnText}>Google</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>لديك حساب بالفعل؟; </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>تسجيل الدخول</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  glow: {
    position: 'absolute', top: -60, right: -60,
    width: 250, height: 250, borderRadius: 125,
    backgroundColor: Colors.primary, opacity: 0.06,
  },
  scroll: { flexGrow: 1, padding: Spacing.lg, paddingTop: Spacing.md },
  back: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: Spacing.md },
  backText: { color: Colors.primary, fontSize: Typography.sm, fontWeight: Typography.medium },
  header: { marginBottom: Spacing.lg },
  eyebrow: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(197,163,109,0.12)',
    borderRadius: Radii.pill,
    paddingHorizontal: 12, paddingVertical: 4,
    marginBottom: 10,
  },
  eyebrowText: { color: Colors.primary, fontSize: Typography.xs, letterSpacing: Typography.widest, fontWeight: Typography.medium },
  heading: { color: Colors.secondary, fontSize: Typography['3xl'], fontWeight: Typography.bold, letterSpacing: Typography.tight, marginBottom: 6 },
  subheading: { color: Colors.textMuted, fontSize: Typography.base },
  tierCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: 'rgba(76,175,80,0.1)',
    borderRadius: Radii.lg, borderWidth: 1,
    borderColor: 'rgba(76,175,80,0.25)',
    padding: 14, marginBottom: Spacing.lg,
  },
  tierIconWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(76,175,80,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  tierTitle: { color: Colors.secondary, fontSize: Typography.sm, fontWeight: Typography.semibold },
  tierDesc: { color: Colors.textMuted, fontSize: Typography.xs, marginTop: 2 },
  outerShell: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: Radii['2xl'], borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    padding: 3, marginBottom: Spacing.lg, ...Shadows.card,
  },
  innerCore: {
    backgroundColor: Colors.surfaceBg, borderRadius: Radii.xl, padding: Spacing.lg,
  },
  termsRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 4 },
  checkbox: {
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 1.5, borderColor: Colors.textSubtle,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 1,
  },
  checkboxChecked: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  checkmark: { color: Colors.background, fontSize: 13, fontWeight: Typography.bold },
  termsText: { flex: 1, color: Colors.textMuted, fontSize: Typography.sm, lineHeight: 20 },
  termsLink: { color: Colors.primary, fontWeight: Typography.medium },
  errorText: { color: Colors.error, fontSize: Typography.xs, marginTop: 4, marginBottom: 8 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20, gap: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.cardBorder },
  dividerText: { color: Colors.textMuted, fontSize: Typography.xs, letterSpacing: 1 },
  socialRow: { flexDirection: 'row', gap: 8 },
  socialBtn: {
    flex: 1, backgroundColor: Colors.cardBg,
    borderWidth: 1, borderColor: Colors.cardBorder,
    borderRadius: Radii.md, paddingVertical: 12, alignItems: 'center',
  },
  socialBtnText: { color: Colors.secondary, fontSize: Typography.xs, fontWeight: Typography.medium },
  loginRow: { flexDirection: 'row', justifyContent: 'center', paddingBottom: Spacing.xl },
  loginText: { color: Colors.textMuted, fontSize: Typography.sm },
  loginLink: { color: Colors.primary, fontSize: Typography.sm, fontWeight: Typography.semibold },
});
