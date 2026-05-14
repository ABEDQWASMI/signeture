import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, KeyboardAvoidingView, Platform,
  Animated, Easing, Dimensions, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../components/Icon';
import { Colors, Typography, Radii, Spacing } from '../constants/theme';
import { GoldButton } from '../components/GoldButton';
import { InputField } from '../components/InputField';
import { useApp } from '../context/AppContext';

const { width, height } = Dimensions.get('window');

function SocialBtn({ iconName, label, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <Animated.View style={{ flex: 1, transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={() => Animated.spring(scale, { toValue: 0.96, damping: 16, stiffness: 300, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1, damping: 14, stiffness: 260, useNativeDriver: true }).start()}
        activeOpacity={1}
        style={styles.socialBtn}
      >
        <Icon name={iconName} size={15} color={Colors.secondary} />
        <Text style={styles.socialLabel}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export function LoginScreen({ navigation }) {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const logoAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const footerAnim = useRef(new Animated.Value(0)).current;
  const logoY = useRef(new Animated.Value(30)).current;
  const cardY = useRef(new Animated.Value(30)).current;
  const footerY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const ease = Easing.bezier(0.22, 1, 0.36, 1);
    const animate = (opacity, y, delay) => Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 700, delay, easing: ease, useNativeDriver: true }),
      Animated.timing(y, { toValue: 0, duration: 700, delay, easing: ease, useNativeDriver: true }),
    ]);
    Animated.stagger(120, [animate(logoAnim, logoY, 0), animate(cardAnim, cardY, 0), animate(footerAnim, footerY, 0)]).start();
  }, []);

  const handleLogin = async () => {
    const errs = {};
    if (!email.trim()) errs.email = 'البريد الإلكتروني مطلوب';
    if (!password) errs.password = 'كلمة المرور مطلوبة';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try { await login(email, password); } catch { setErrors({ general: 'بيانات غير صحيحة' }); }
    setLoading(false);
  };

  return (
    <View style={styles.root}>
      {/* Background gradient blobs */}
      <View style={styles.blob1} />
      <View style={styles.blob2} />

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

            {/* Logo */}
            <Animated.View style={[styles.logoWrap, { opacity: logoAnim, transform: [{ translateY: logoY }] }]}>
              <View style={styles.logoOuter}>
                <View style={styles.logoInner}>
                  <Image source={require('../../assets/logo.png')} style={styles.logoImg} resizeMode="contain" />
                </View>
              </View>
              <View style={styles.eyebrow}>
                <Text style={styles.eyebrowText}>SIGNATURE COFFEEHOUSE</Text>
              </View>
              <Text style={styles.headline}>أهلاً{'\n'}بعودتك</Text>
              <Text style={styles.sub}>سجّل دخولك للمتابعة</Text>
            </Animated.View>

            {/* Card */}
            <Animated.View style={[styles.cardOuter, { opacity: cardAnim, transform: [{ translateY: cardY }] }]}>
              <View style={styles.cardInner}>
                {errors.general && (
                  <View style={styles.errorBanner}>
                    <Icon name="alert-circle" size={14} color="#E53935" />
                    <Text style={styles.errorBannerText}>{errors.general}</Text>
                  </View>
                )}

                <Text style={styles.fieldLabel}>البريد الإلكتروني أو رقم الهاتف</Text>
                <InputField
                  placeholder="hello@signature.co"
                  value={email}
                  onChangeText={t => { setEmail(t); setErrors(e => ({ ...e, email: null })); }}
                  keyboardType="email-address"
                  error={errors.email}
                />

                <View style={styles.pwRow}>
                  <Text style={styles.fieldLabel}>كلمة المرور</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                    <Text style={styles.forgotLink}>نسيت كلمة المرور؟</Text>
                  </TouchableOpacity>
                </View>
                <InputField
                  placeholder="••••••••"
                  value={password}
                  onChangeText={t => { setPassword(t); setErrors(e => ({ ...e, password: null })); }}
                  secureTextEntry={!showPw}
                  error={errors.password}
                  rightIcon={showPw ? 'eye-off' : 'eye'}
                  onRightIconPress={() => setShowPw(v => !v)}
                />

                <GoldButton title="تسجيل الدخول" onPress={handleLogin} loading={loading} icon="arrow-right" style={{ marginTop: 8 }} />

                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>أو تابع بـ</Text>
                  <View style={styles.dividerLine} />
                </View>

                <View style={styles.socialRow}>
                  <SocialBtn iconName="user" label="Apple" onPress={() => {}} />
                  <SocialBtn iconName="search" label="Google" onPress={() => {}} />
                  <SocialBtn iconName="share-2" label="Facebook" onPress={() => {}} />
                </View>

                <TouchableOpacity style={styles.browseBtn} onPress={() => navigation.navigate('MainTabs')}>
                  <Icon name="map" size={14} color={Colors.primary} />
                  <Text style={styles.browseBtnText}>تصفّح كزائر</Text>
                  <Icon name="chevron-right" size={14} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Footer */}
            <Animated.View style={[styles.footer, { opacity: footerAnim, transform: [{ translateY: footerY }] }]}>
              <Text style={styles.footerText}>ليس لديك حساب؟ </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.footerLink}>أنشئ حساباً</Text>
              </TouchableOpacity>
            </Animated.View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1E1C1C' },
  blob1: {
    position: 'absolute', top: -100, right: -80,
    width: 320, height: 320, borderRadius: 160,
    backgroundColor: 'rgba(0,112,74,0.08)',
  },
  blob2: {
    position: 'absolute', bottom: 100, left: -100,
    width: 260, height: 260, borderRadius: 130,
    backgroundColor: 'rgba(0,112,74,0.05)',
  },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  logoWrap: { alignItems: 'flex-end', paddingTop: 32, paddingBottom: 32 },
  logoOuter: {
    width: 88, height: 88, borderRadius: 28,
    backgroundColor: 'rgba(0,112,74,0.08)',
    borderWidth: 1, borderColor: 'rgba(0,112,74,0.15)',
    padding: 4, marginBottom: 20,
  },
  logoInner: {
    flex: 1, borderRadius: 24,
    backgroundColor: '#2B2928',
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  logoImg: { width: 64, height: 64 },
  eyebrow: {
    backgroundColor: 'rgba(0,112,74,0.1)',
    borderWidth: 1, borderColor: 'rgba(0,112,74,0.2)',
    borderRadius: 100, paddingHorizontal: 12, paddingVertical: 4,
    marginBottom: 16,
  },
  eyebrowText: { color: '#00704A', fontSize: 10, letterSpacing: 2, fontWeight: '600' },
  headline: {
    fontSize: 44, fontWeight: '800', color: '#F5F0E8',
    lineHeight: 52, textAlign: 'right', marginBottom: 8,
    letterSpacing: -0.5,
  },
  sub: { fontSize: 15, color: 'rgba(245,240,232,0.45)', textAlign: 'right' },
  cardOuter: {
    borderRadius: 28, backgroundColor: 'rgba(0,112,74,0.06)',
    borderWidth: 1, borderColor: 'rgba(0,112,74,0.12)',
    padding: 2, marginBottom: 24,
  },
  cardInner: {
    borderRadius: 26, backgroundColor: '#2B2928',
    padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4, shadowRadius: 40,
  },
  errorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(229,57,53,0.1)', borderRadius: 12,
    borderWidth: 1, borderColor: 'rgba(229,57,53,0.2)',
    padding: 12, marginBottom: 16,
  },
  errorBannerText: { color: '#E53935', fontSize: 13, flex: 1, textAlign: 'right' },
  fieldLabel: { color: 'rgba(245,240,232,0.5)', fontSize: 12, marginBottom: 6, textAlign: 'right', letterSpacing: 0.3 },
  pwRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  forgotLink: { color: '#00704A', fontSize: 12 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.07)' },
  dividerText: { color: 'rgba(245,240,232,0.35)', fontSize: 12 },
  socialRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  socialBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14, paddingVertical: 12,
  },
  socialLabel: { color: 'rgba(245,240,232,0.6)', fontSize: 13, fontWeight: '500' },
  browseBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 12,
    borderRadius: 14, borderWidth: 1, borderColor: 'rgba(0,112,74,0.15)',
    backgroundColor: 'rgba(0,112,74,0.05)',
  },
  browseBtnText: { color: '#00704A', fontSize: 13, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 8 },
  footerText: { color: 'rgba(245,240,232,0.4)', fontSize: 14 },
  footerLink: { color: '#00704A', fontSize: 14, fontWeight: '600' },
});