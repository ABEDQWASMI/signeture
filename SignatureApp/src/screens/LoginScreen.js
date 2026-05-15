import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, KeyboardAvoidingView, Platform,
  Animated, Easing, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, AntDesign, FontAwesome } from '@expo/vector-icons';
import { Colors, Typography, Radii, Spacing } from '../constants/theme';
import { GoldButton } from '../components/GoldButton';
import { InputField } from '../components/InputField';
import { useApp } from '../context/AppContext';

const EASE = Easing.bezier(0.22, 1, 0.36, 1);

// ─── Social button with correct brand icons ───────────────────────────────
function SocialBtn({ provider, onPress, colors, isDark }) {
  const scale = useRef(new Animated.Value(1)).current;

  const config = {
    apple:    { icon: <AntDesign name="apple1"   size={16} color={isDark ? '#F2EDE4' : '#1A1208'} />, label: 'Apple' },
    google:   { icon: <AntDesign name="google"   size={15} color="#EA4335" />,                        label: 'Google' },
    facebook: { icon: <FontAwesome name="facebook" size={15} color="#1877F2" />,                      label: 'Facebook' },
  };
  const { icon, label } = config[provider];

  return (
    <Animated.View style={{ flex: 1, transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={() => Animated.spring(scale, { toValue: 0.95, damping: 14, stiffness: 300, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1,    damping: 12, stiffness: 260, useNativeDriver: true }).start()}
        activeOpacity={1}
        style={[
          styles.socialBtn,
          {
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
            borderColor:      isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.09)',
          },
        ]}
      >
        {icon}
        <Text style={[styles.socialLabel, { color: isDark ? '#C8BFB3' : '#555555' }]}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────
export function LoginScreen({ navigation }) {
  const { login, colors, isDark } = useApp();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState({});

  const logoAnim   = useRef(new Animated.Value(0)).current;
  const cardAnim   = useRef(new Animated.Value(0)).current;
  const footerAnim = useRef(new Animated.Value(0)).current;
  const logoY      = useRef(new Animated.Value(32)).current;
  const cardY      = useRef(new Animated.Value(32)).current;
  const footerY    = useRef(new Animated.Value(20)).current;

  // Subtle logo pulse glow
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (opacity, y, delay) =>
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 750, delay, easing: EASE, useNativeDriver: true }),
        Animated.timing(y,       { toValue: 0, duration: 750, delay, easing: EASE, useNativeDriver: true }),
      ]);
    Animated.stagger(100, [
      animate(logoAnim, logoY, 0),
      animate(cardAnim, cardY, 0),
      animate(footerAnim, footerY, 0),
    ]).start();

    // Logo glow loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 2500, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
        Animated.timing(glow, { toValue: 0, duration: 2500, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
      ])
    ).start();
  }, []);

  const glowOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0, 0.35] });

  const handleLogin = async () => {
    const errs = {};
    if (!email.trim()) errs.email = 'البريد الإلكتروني مطلوب';
    if (!password)     errs.password = 'كلمة المرور مطلوبة';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try { await login(email, password); }
    catch { setErrors({ general: 'بيانات غير صحيحة' }); }
    setLoading(false);
  };

  const C = colors;

  return (
    <View style={[styles.root, { backgroundColor: C.background }]}>

      {/* Background radial glow */}
      <LinearGradient
        colors={
          isDark
            ? ['rgba(197,163,109,0.14)', 'transparent']
            : ['rgba(197,163,109,0.10)', 'transparent']
        }
        style={styles.bgGlow}
        start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 0.6 }}
        pointerEvents="none"
      />

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >

            {/* ── Logo & headline ── */}
            <Animated.View
              style={[styles.logoWrap, { opacity: logoAnim, transform: [{ translateY: logoY }] }]}
            >
              {/* Logo with glow ring */}
              <View style={styles.logoGlowWrap}>
                <Animated.View
                  style={[
                    styles.logoGlowRing,
                    { opacity: glowOpacity, backgroundColor: isDark ? 'rgba(197,163,109,0.3)' : 'rgba(139,99,50,0.2)' },
                  ]}
                />
                {/* Outer bezel */}
                <View style={[
                  styles.logoOuter,
                  {
                    backgroundColor: isDark ? 'rgba(197,163,109,0.08)' : 'rgba(139,99,50,0.06)',
                    borderColor:      isDark ? 'rgba(197,163,109,0.22)' : 'rgba(139,99,50,0.18)',
                  },
                ]}>
                  {/* Inner core */}
                  <View style={[
                    styles.logoInner,
                    { backgroundColor: isDark ? '#1A1408' : '#FFFFFF' },
                  ]}>
                    <Image
                      source={require('../../assets/logo.png')}
                      style={styles.logoImg}
                      resizeMode="contain"
                    />
                  </View>
                </View>
              </View>

              {/* Eyebrow tag */}
              <View style={[
                styles.eyebrow,
                {
                  backgroundColor: isDark ? 'rgba(197,163,109,0.12)' : 'rgba(139,99,50,0.08)',
                  borderColor:      isDark ? 'rgba(197,163,109,0.25)' : 'rgba(139,99,50,0.18)',
                },
              ]}>
                <View style={[styles.eyebrowDot, { backgroundColor: C.primary }]} />
                <Text style={[styles.eyebrowText, { color: C.primary }]}>SIGNATURE COFFEEHOUSE</Text>
              </View>

              <Text style={[styles.headline, { color: C.secondary }]}>
                أهلاً{'\n'}بعودتك
              </Text>
              <Text style={[styles.sub, { color: C.textMuted }]}>سجّل دخولك للمتابعة</Text>
            </Animated.View>

            {/* ── Form card (double-bezel) ── */}
            <Animated.View
              style={[styles.cardShell, { opacity: cardAnim, transform: [{ translateY: cardY }] }]}
            >
              {/* Outer bezel */}
              <View style={[
                styles.cardOuter,
                {
                  backgroundColor: isDark ? 'rgba(197,163,109,0.04)' : 'rgba(139,99,50,0.03)',
                  borderColor:      isDark ? 'rgba(197,163,109,0.14)' : 'rgba(139,99,50,0.10)',
                },
              ]}>
                {/* Inner core */}
                <View style={[styles.cardInner, { backgroundColor: C.cardBg }]}>

                  {/* Error banner */}
                  {errors.general && (
                    <View style={[styles.errorBanner, { backgroundColor: isDark ? 'rgba(229,57,53,0.12)' : '#FEE', borderColor: isDark ? 'rgba(229,57,53,0.25)' : '#FCC' }]}>
                      <Feather name="alert-circle" size={14} color="#E53935" />
                      <Text style={styles.errorBannerText}>{errors.general}</Text>
                    </View>
                  )}

                  {/* Email */}
                  <Text style={[styles.fieldLabel, { color: C.textMuted }]}>
                    البريد الإلكتروني أو رقم الهاتف
                  </Text>
                  <InputField
                    placeholder="hello@signature.co"
                    value={email}
                    onChangeText={(t) => { setEmail(t); setErrors((e) => ({ ...e, email: null })); }}
                    keyboardType="email-address"
                    error={errors.email}
                  />

                  {/* Password row */}
                  <View style={styles.pwRow}>
                    <Text style={[styles.fieldLabel, { color: C.textMuted }]}>كلمة المرور</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                      <Text style={[styles.forgotLink, { color: C.primary }]}>نسيت كلمة المرور؟</Text>
                    </TouchableOpacity>
                  </View>
                  <InputField
                    placeholder="••••••••"
                    value={password}
                    onChangeText={(t) => { setPassword(t); setErrors((e) => ({ ...e, password: null })); }}
                    secureTextEntry={!showPw}
                    error={errors.password}
                    rightIcon={showPw ? 'eye-off' : 'eye'}
                    onRightIconPress={() => setShowPw((v) => !v)}
                  />

                  {/* Login button */}
                  <GoldButton
                    title="تسجيل الدخول"
                    onPress={handleLogin}
                    loading={loading}
                    icon="arrow-right"
                    style={{ marginTop: 8 }}
                  />

                  {/* Divider */}
                  <View style={styles.dividerRow}>
                    <View style={[styles.dividerLine, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#E8E3DC' }]} />
                    <Text style={[styles.dividerText, { color: C.textMuted }]}>أو تابع بـ</Text>
                    <View style={[styles.dividerLine, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#E8E3DC' }]} />
                  </View>

                  {/* Social buttons */}
                  <View style={styles.socialRow}>
                    <SocialBtn provider="apple"    onPress={() => {}} colors={C} isDark={isDark} />
                    <SocialBtn provider="google"   onPress={() => {}} colors={C} isDark={isDark} />
                    <SocialBtn provider="facebook" onPress={() => {}} colors={C} isDark={isDark} />
                  </View>

                  {/* Browse as guest */}
                  <TouchableOpacity
                    style={[
                      styles.browseBtn,
                      {
                        backgroundColor: isDark ? 'rgba(197,163,109,0.06)' : 'rgba(139,99,50,0.04)',
                        borderColor:      isDark ? 'rgba(197,163,109,0.22)' : 'rgba(139,99,50,0.18)',
                      },
                    ]}
                    onPress={() => login({ id: 'guest', name: 'Guest', isGuest: true })}
                    activeOpacity={0.8}
                  >
                    <Feather name="map" size={14} color={C.primary} />
                    <Text style={[styles.browseBtnText, { color: C.primary }]}>تصفّح كزائر</Text>
                    <Feather name="chevron-left" size={14} color={C.primary} />
                  </TouchableOpacity>

                </View>
              </View>
            </Animated.View>

            {/* ── Footer ── */}
            <Animated.View
              style={[styles.footer, { opacity: footerAnim, transform: [{ translateY: footerY }] }]}
            >
              <Text style={[styles.footerText, { color: C.textMuted }]}>ليس لديك حساب؟ </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={[styles.footerLink, { color: C.primary }]}>أنشئ حساباً</Text>
              </TouchableOpacity>
            </Animated.View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1 },
  bgGlow: { position: 'absolute', top: 0, left: 0, right: 0, height: 320 },
  scroll: { paddingHorizontal: 20, paddingBottom: 48 },

  // ── Logo section ──
  logoWrap: { alignItems: 'center', paddingTop: 52, paddingBottom: 36 },
  logoGlowWrap: { position: 'relative', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  logoGlowRing: {
    position: 'absolute',
    width: 130, height: 130, borderRadius: 65,
  },
  logoOuter: {
    width: 100, height: 100, borderRadius: 30,
    borderWidth: 1.5, padding: 4,
  },
  logoInner: {
    flex: 1, borderRadius: 26,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  logoImg: { width: 72, height: 72 },

  // Eyebrow
  eyebrow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderWidth: 1, borderRadius: 100,
    paddingHorizontal: 12, paddingVertical: 5,
    marginBottom: 18,
  },
  eyebrowDot: { width: 5, height: 5, borderRadius: 2.5 },
  eyebrowText: { fontSize: 9, fontWeight: '700', letterSpacing: 3 },

  headline: {
    fontSize: 44, fontWeight: '800',
    lineHeight: 52, textAlign: 'center',
    marginBottom: 10, letterSpacing: -0.5,
  },
  sub: { fontSize: 15, textAlign: 'center' },

  // ── Card double-bezel ──
  cardShell: { marginBottom: 24 },
  cardOuter: {
    borderRadius: 24, borderWidth: 1.5, padding: 3,
    shadowColor: '#C5A36D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12, shadowRadius: 20,
    elevation: 4,
  },
  cardInner: {
    borderRadius: 21, padding: 22,
  },

  // Error
  errorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderRadius: 12, borderWidth: 1,
    padding: 12, marginBottom: 16,
  },
  errorBannerText: { color: '#E53935', fontSize: 13, flex: 1, textAlign: 'right' },

  // Fields
  fieldLabel: {
    fontSize: 12, marginBottom: 6,
    textAlign: 'right', letterSpacing: 0.3, fontWeight: '500',
  },
  pwRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginTop: 14,
  },
  forgotLink: { fontSize: 12, fontWeight: '600' },

  // Divider
  dividerRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, marginVertical: 20,
  },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 12 },

  // Social
  socialRow:  { flexDirection: 'row', gap: 8, marginBottom: 14 },
  socialBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 7, borderWidth: 1, borderRadius: 14, paddingVertical: 13,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  socialLabel: { fontSize: 13, fontWeight: '500' },

  // Browse guest
  browseBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 7, paddingVertical: 13,
    borderRadius: 14, borderWidth: 1,
  },
  browseBtnText: { fontSize: 13, fontWeight: '600' },

  // Footer
  footer: {
    flexDirection: 'row', justifyContent: 'center',
    alignItems: 'center', paddingBottom: 8,
  },
  footerText: { fontSize: 14 },
  footerLink: { fontSize: 14, fontWeight: '600' },
});
