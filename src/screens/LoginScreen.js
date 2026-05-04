import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, KeyboardAvoidingView, Platform,
  Animated, Easing, Dimensions, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Colors, Typography, Radii, Spacing, Shadows } from '../constants/theme';
import { GoldButton } from '../components/GoldButton';
import { InputField } from '../components/InputField';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');
const GOLD = Colors.primary;

// ─── Logo component using actual image ─────────────────────────────────────
function BeanLogo() {
  return (
    <Image
      source={require('../../assets/logo.png')}
      style={{ width: 90, height: 90, borderRadius: 45 }}
      resizeMode="contain"
    />
  );
}

// ─── Social pill button ────────────────────────────────────────────────────
function SocialBtn({ iconName, label, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <Animated.View style={{ flex: 1, transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={() => Animated.spring(scale, { toValue: 0.95, damping: 16, stiffness: 300, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1, damping: 14, stiffness: 260, useNativeDriver: true }).start()}
        activeOpacity={1}
        style={social.btn}
      >
        <Feather name={iconName} size={16} color={Colors.secondary} />
        <Text style={social.label}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
const social = StyleSheet.create({
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 7, backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: Radii.md, paddingVertical: 12,
  },
  label: {
    color: Colors.secondary, fontSize: Typography.xs,
    fontWeight: Typography.medium,
  },
});

// ─── Main screen ──────────────────────────────────────────────────────────
export function LoginScreen({ navigation }) {
  const { login } = useApp();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState({});

  // Staggered entrance animations
  const logoOpacity   = useRef(new Animated.Value(0)).current;
  const logoY         = useRef(new Animated.Value(24)).current;
  const cardOpacity   = useRef(new Animated.Value(0)).current;
  const cardY         = useRef(new Animated.Value(24)).current;
  const footerOpacity = useRef(new Animated.Value(0)).current;
  const footerY       = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    const ease = Easing.bezier(0.22, 1, 0.36, 1);
    const run = (opacity, y, delay) => Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 700, delay, easing: ease, useNativeDriver: true }),
      Animated.timing(y,       { toValue: 0, duration: 700, delay, easing: ease, useNativeDriver: true }),
    ]);
    Animated.parallel([
      run(logoOpacity,   logoY,   100),
      run(cardOpacity,   cardY,   260),
      run(footerOpacity, footerY, 420),
    ]).start();
  }, []);

  const logoAnim   = { opacity: logoOpacity,   transform: [{ translateY: logoY }] };
  const cardAnim   = { opacity: cardOpacity,   transform: [{ translateY: cardY }] };
  const footerAnim = { opacity: footerOpacity, transform: [{ translateY: footerY }] };

  const validate = () => {
    const e = {};
    if (!email.includes('@')) e.email = 'أدخل بريداً إلكترونياً صحيحاً';
    if (password.length < 6)  e.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    login({ name: 'أحمد', email, avatar: null, tier: 'Gold', stars: 342 });
    setLoading(false);
  };

  const handleGuest = () => {
    login({ name: 'زائر', email: 'guest@signature.co', avatar: null, tier: 'Bronze', stars: 0, isGuest: true });
  };

  return (
    <View style={styles.root}>
      {/* Background */}
      <LinearGradient
        colors={['#0D0900', '#000000', '#000000']}
        style={StyleSheet.absoluteFill}
      />
      {/* Ambient glow */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >

            {/* ── Logo area ── */}
            <Animated.View style={[styles.logoArea, logoAnim]}>
              <BeanLogo />
              <Text style={styles.brand}>SIGNATURE</Text>
              <View style={styles.eyebrowPill}>
                <Text style={styles.eyebrowText}>COFFEE & MORE</Text>
              </View>
            </Animated.View>

            {/* ── Card ── */}
            <Animated.View style={[styles.outerShell, cardAnim]}>
              <View style={styles.innerCore}>

                <Text style={styles.heading}>أهلاً بعودتك</Text>
                <Text style={styles.subheading}>سجّل دخولك للمتابعة</Text>

                <InputField
                  label="البريد الإلكتروني أو رقم الهاتف"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="hello@signature.co"
                  keyboardType="email-address"
                  error={errors.email}
                  rtl
                />
                <InputField
                  label="كلمة المرور"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  secureTextEntry={!showPw}
                  error={errors.password}
                  rtl
                  rightElement={
                    <TouchableOpacity onPress={() => setShowPw(!showPw)} style={{ padding: 4 }}>
                      <Feather
                        name={showPw ? 'eye-off' : 'eye'}
                        size={16}
                        color={Colors.textMuted}
                      />
                    </TouchableOpacity>
                  }
                />

                <TouchableOpacity
                  onPress={() => navigation.navigate('ForgotPassword')}
                  style={styles.forgotRow}
                >
                  <Text style={styles.forgotText}>نسيت كلمة المرور؟</Text>
                </TouchableOpacity>

                <GoldButton
                  title="تسجيل الدخول"
                  onPress={handleLogin}
                  loading={loading}
                  icon="→"
                  style={{ marginTop: 8 }}
                />

                {/* Divider */}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>أو تابع بـ</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Social buttons */}
                <View style={styles.socialRow}>
                  <SocialBtn iconName="smartphone" label="Apple" />
                  <SocialBtn iconName="globe" label="Google" />
                  <SocialBtn iconName="facebook" label="Facebook" />
                </View>

                {/* Guest button */}
                <TouchableOpacity onPress={handleGuest} style={styles.guestBtn} activeOpacity={0.75}>
                  <Feather name="user" size={15} color={Colors.textMuted} />
                  <Text style={styles.guestText}>تصفّح كزائر</Text>
                  <Feather name="chevron-left" size={14} color={Colors.textMuted} />
                </TouchableOpacity>

              </View>
            </Animated.View>

            {/* ── Footer ── */}
            <Animated.View style={[styles.signupRow, footerAnim]}>
              <Text style={styles.signupText}>ليس لديك حساب؟ </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.signupLink}>أنشئ حساباً</Text>
              </TouchableOpacity>
            </Animated.View>

          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  glowTop: {
    position: 'absolute', top: -100, alignSelf: 'center',
    width: 280, height: 280, borderRadius: 140,
    backgroundColor: Colors.primary, opacity: 0.07,
  },
  glowBottom: {
    position: 'absolute', bottom: -80, right: -60,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: Colors.primary, opacity: 0.04,
  },

  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
  },

  logoArea: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    marginTop: Spacing.md,
  },
  brand: {
    color: Colors.primary,
    fontSize: Typography['2xl'],
    fontWeight: Typography.black,
    letterSpacing: 8,
    marginTop: 14,
    marginBottom: 6,
  },
  eyebrowPill: {
    backgroundColor: 'rgba(197,163,109,0.1)',
    borderRadius: Radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(197,163,109,0.2)',
  },
  eyebrowText: {
    color: Colors.primary,
    fontSize: 9,
    letterSpacing: 4,
    fontWeight: Typography.medium,
  },

  outerShell: {
    backgroundColor: 'rgba(255,255,255,0.035)',
    borderRadius: Radii['2xl'],
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    padding: 3,
    marginBottom: Spacing.lg,
  },
  innerCore: {
    backgroundColor: '#0E0E0E',
    borderRadius: 33,
    padding: Spacing.lg,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.025,
    shadowRadius: 0,
  },

  heading: {
    color: Colors.secondary,
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    marginBottom: 4,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  subheading: {
    color: Colors.textMuted,
    fontSize: Typography.base,
    marginBottom: Spacing.lg,
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  forgotRow: { alignItems: 'flex-start', marginTop: -8, marginBottom: 16 },
  forgotText: {
    color: Colors.primary,
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
  },

  divider: {
    flexDirection: 'row', alignItems: 'center',
    marginVertical: 20, gap: 10,
  },
  dividerLine: {
    flex: 1, height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  dividerText: {
    color: Colors.textMuted,
    fontSize: Typography.xs,
    letterSpacing: 1,
  },

  socialRow: { flexDirection: 'row', gap: 8, marginBottom: 4 },

  guestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 18,
    paddingVertical: 13,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  guestText: {
    color: Colors.textMuted,
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    letterSpacing: 0.5,
  },

  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: Spacing.xl,
  },
  signupText: { color: Colors.textMuted, fontSize: Typography.sm },
  signupLink: {
    color: Colors.primary,
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
  },
});
