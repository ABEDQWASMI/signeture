import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Animated, Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Colors, Typography, Radii, Spacing, Shadows } from '../constants/theme';
import { GoldButton } from '../components/GoldButton';
import { CoffeeToggle } from '../components/CoffeeToggle';
import { useApp } from '../context/AppContext';
import { RECENT_ORDERS, REWARDS_TIERS } from '../constants/data';

// ─── Animated entrance helper ─────────────────────────────────────────────
function useFadeUp(delay = 0) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1, duration: 550, delay,
        easing: Easing.bezier(0.22, 1, 0.36, 1), useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0, duration: 550, delay,
        easing: Easing.bezier(0.22, 1, 0.36, 1), useNativeDriver: true,
      }),
    ]).start();
  }, []);
  return { opacity, transform: [{ translateY }] };
}

// ─── Stat pill ────────────────────────────────────────────────────────────
function StatPill({ num, label, color, delay }) {
  const scale = useRef(new Animated.Value(0.7)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, damping: 12, stiffness: 200, delay, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
    ]).start();
  }, []);
  return (
    <Animated.View style={[styles.statPill, { opacity, transform: [{ scale }] }]}>
      <Text style={[styles.statNum, { color }]}>{num}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
}

// ─── Menu row ────────────────────────────────────────────────────────────
function MenuRow({ icon, label, onPress, isLast, colors }) {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[
          styles.menuRow,
          !isLast && { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
        ]}
        onPress={onPress}
        onPressIn={() =>
          Animated.spring(scale, { toValue: 0.97, damping: 14, stiffness: 300, useNativeDriver: true }).start()
        }
        onPressOut={() =>
          Animated.spring(scale, { toValue: 1, damping: 12, stiffness: 260, useNativeDriver: true }).start()
        }
        activeOpacity={1}
      >
        <Feather name="chevron-left" size={15} color="rgba(255,255,255,0.25)" />
        <Text style={[styles.menuLabel, { color: colors.secondary }]}>{label}</Text>
        <View style={styles.menuIconWrap}>
          <Feather name={icon} size={16} color={Colors.primary} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────
export function ProfileScreen({ navigation }) {
  const { user, logout, stars, isDark, toggleTheme, colors } = useApp();
  const [notifications, setNotifications] = useState(true);
  const [promotions, setPromotions] = useState(true);
  const [biometric, setBiometric] = useState(false);

  const currentTier =
    REWARDS_TIERS.find((t) => stars >= t.min && stars <= t.max) || REWARDS_TIERS[1];
  const nextTier = REWARDS_TIERS[REWARDS_TIERS.indexOf(currentTier) + 1];
  const progress = nextTier
    ? ((stars - currentTier.min) / (nextTier.min - currentTier.min)) * 100
    : 100;

  // Avatar animations
  const avatarScale = useRef(new Animated.Value(0.5)).current;
  const avatarOpacity = useRef(new Animated.Value(0)).current;
  const ringRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(avatarScale, {
        toValue: 1, damping: 10, stiffness: 160, useNativeDriver: true,
      }),
      Animated.timing(avatarOpacity, {
        toValue: 1, duration: 600, useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.timing(ringRotate, {
        toValue: 1, duration: 8000, easing: Easing.linear, useNativeDriver: true,
      })
    ).start();
  }, []);

  const ringRotateDeg = ringRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const heroAnim     = useFadeUp(0);
  const statsAnim    = useFadeUp(120);
  const rewardAnim   = useFadeUp(200);
  const settingsAnim = useFadeUp(280);

  const MENU_SECTIONS = [
    {
      title: 'الحساب',
      items: [
        { icon: 'user',         label: 'تعديل الملف الشخصي' },
        { icon: 'map-pin',      label: 'العناوين المحفوظة' },
        { icon: 'credit-card',  label: 'طرق الدفع' },
        { icon: 'link',         label: 'حسابات التواصل الاجتماعي' },
      ],
    },
    {
      title: 'طلباتي',
      items: [
        { icon: 'package',      label: 'سجل الطلبات' },
        { icon: 'heart',        label: 'المفضلات' },
        { icon: 'shopping-bag', label: 'المشتريات' },
      ],
    },
    {
      title: 'الدعم',
      items: [
        { icon: 'message-circle', label: 'الدردشة المباشرة', screen: 'Chat' },
        { icon: 'help-circle',    label: 'مركز المساعدة',    screen: 'Help' },
      ],
    },
  ];

  const initials =
    user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'G';

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* ── Hero ── */}
          <Animated.View style={[styles.heroSection, heroAnim]}>
            <View style={styles.glowBlob1} />
            <View style={styles.glowBlob2} />

            {/* Top bar */}
            <View style={styles.heroHeader}>
              <TouchableOpacity
                style={[
                  styles.iconBtn,
                  { borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
                ]}
                onPress={() => navigation.goBack()}
              >
                <Feather name="chevron-right" size={20} color={colors.secondary} />
              </TouchableOpacity>
              <Text style={[styles.heroTitle, { color: colors.secondary }]}>الملف الشخصي</Text>
              <TouchableOpacity
                style={[
                  styles.iconBtn,
                  { borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
                ]}
              >
                <Feather name="settings" size={18} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {/* Avatar with spinning ring */}
            <Animated.View
              style={[
                styles.avatarContainer,
                { opacity: avatarOpacity, transform: [{ scale: avatarScale }] },
              ]}
            >
              {/* Spinning dots ring */}
              <Animated.View
                style={[styles.spinRing, { transform: [{ rotate: ringRotateDeg }] }]}
              >
                {[...Array(12)].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.ringDot,
                      {
                        transform: [{ rotate: `${i * 30}deg` }, { translateY: -52 }],
                        opacity: i % 3 === 0 ? 1 : 0.3,
                      },
                    ]}
                  />
                ))}
              </Animated.View>

              {/* Gold gradient ring + avatar */}
              <LinearGradient
                colors={[Colors.primary, Colors.primaryLight, Colors.primary]}
                style={styles.avatarRing}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={[styles.avatarInner, { backgroundColor: colors.cardBg }]}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
              </LinearGradient>

              {/* Tier badge floating below */}
              <View
                style={[
                  styles.tierBadge,
                  {
                    borderColor: currentTier.color,
                    backgroundColor: `${currentTier.color}18`,
                  },
                ]}
              >
                <Text style={[styles.tierBadgeText, { color: currentTier.color }]}>
                  ◆ {currentTier.name}
                </Text>
              </View>
            </Animated.View>

            <Text style={[styles.profileName, { color: colors.secondary }]}>
              {user?.name || 'زائر'}
            </Text>
            <Text style={[styles.profileEmail, { color: colors.textMuted }]}>
              {user?.email || 'guest@signature.co'}
            </Text>

            <TouchableOpacity style={styles.editBtn} activeOpacity={0.8}>
              <Feather name="edit-2" size={13} color={Colors.primary} />
              <Text style={styles.editBtnText}>تعديل الملف</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* ── Stats ── */}
          <Animated.View style={[styles.statsRow, statsAnim]}>
            <StatPill num={stars}  label="نجوم"    color={Colors.primary}   delay={120} />
            <View style={styles.statDivider} />
            <StatPill num="12"     label="طلبات"   color={colors.secondary} delay={180} />
            <View style={styles.statDivider} />
            <StatPill num="3"      label="كوبونات" color="#4CAF50"          delay={240} />
          </Animated.View>

          {/* ── Rewards Card ── */}
          <Animated.View style={rewardAnim}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Rewards')}
              activeOpacity={0.88}
            >
              <LinearGradient
                colors={['#2A1E0A', '#1A1200']}
                style={styles.rewardCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.rewardCardLeft}>
                  <View style={styles.rewardEyebrow}>
                    <Text style={styles.rewardEyebrowText}>SIGNATURE REWARDS</Text>
                  </View>
                  <Text style={[styles.rewardTierText, { color: currentTier.color }]}>
                    ◆ عضو {currentTier.name}
                  </Text>
                  {nextTier && (
                    <Text style={styles.rewardNextText}>
                      {nextTier.min - stars} نجمة للوصول إلى{' '}
                      <Text style={{ color: nextTier.color }}>{nextTier.name}</Text>
                    </Text>
                  )}
                </View>
                <View style={styles.rewardCardRight}>
                  <Text style={styles.rewardStarsNum}>{stars}</Text>
                  <Text style={styles.rewardStarsLabel}>★ نجمة</Text>
                </View>
              </LinearGradient>
              <View style={styles.rewardProgressTrack}>
                <View
                  style={[
                    styles.rewardProgressFill,
                    { width: `${Math.min(progress, 100)}%` },
                  ]}
                />
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* ── Recent Orders + Settings + Menus ── */}
          <Animated.View style={settingsAnim}>

            {/* Orders */}
            <View style={styles.sectionHeader}>
              <TouchableOpacity>
                <Text style={styles.seeAll}>عرض الكل</Text>
              </TouchableOpacity>
              <Text style={[styles.sectionTitle, { color: colors.secondary }]}>آخر الطلبات</Text>
            </View>

            {RECENT_ORDERS.slice(0, 2).map((order) => (
              <View
                key={order.id}
                style={[
                  styles.orderCard,
                  { backgroundColor: colors.cardBg, borderColor: colors.cardBorder },
                ]}
              >
                <View style={styles.orderTop}>
                  <View style={styles.orderStatusBadge}>
                    <View style={styles.orderStatusDot} />
                    <Text style={styles.orderStatusText}>{order.status}</Text>
                  </View>
                  <Text style={[styles.orderId, { color: colors.secondary }]}>{order.id}</Text>
                </View>
                <Text
                  style={[styles.orderItems, { color: colors.textMuted }]}
                  numberOfLines={1}
                >
                  {order.items.join(' · ')}
                </Text>
                <View style={styles.orderBottom}>
                  <Text style={[styles.orderStars, { color: Colors.primary }]}>
                    +{order.stars} ★
                  </Text>
                  <Text style={[styles.orderTotal, { color: colors.secondary }]}>
                    {order.total.toFixed(2)}ر
                  </Text>
                  <Text style={[styles.orderDate, { color: colors.textMuted }]}>
                    {order.date}
                  </Text>
                </View>
              </View>
            ))}

            {/* Preferences / Toggles */}
            <Text
              style={[styles.sectionTitle, { color: colors.secondary, marginTop: Spacing.md }]}
            >
              التفضيلات
            </Text>
            <View
              style={[
                styles.settingsCard,
                { backgroundColor: colors.cardBg, borderColor: colors.cardBorder },
              ]}
            >
              {[
                {
                  label: 'الوضع الفاتح',
                  value: !isDark,
                  onChange: () => toggleTheme(),
                  icon: isDark ? 'sun' : 'moon',
                },
                {
                  label: 'الإشعارات',
                  value: notifications,
                  onChange: (v) => setNotifications(v),
                  icon: 'bell',
                },
                {
                  label: 'العروض والخصومات',
                  value: promotions,
                  onChange: (v) => setPromotions(v),
                  icon: 'tag',
                },
                {
                  label: 'تسجيل الدخول بالبصمة',
                  value: biometric,
                  onChange: (v) => setBiometric(v),
                  icon: 'shield',
                },
              ].map((s, i, arr) => (
                <View
                  key={s.label}
                  style={[
                    styles.settingRow,
                    i < arr.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: isDark
                        ? 'rgba(255,255,255,0.06)'
                        : 'rgba(0,0,0,0.06)',
                    },
                  ]}
                >
                  <CoffeeToggle value={s.value} onValueChange={s.onChange} />
                  <View style={styles.settingLabelWrap}>
                    <Text style={[styles.settingLabel, { color: colors.secondary }]}>
                      {s.label}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.settingIconWrap,
                      {
                        backgroundColor: isDark
                          ? 'rgba(197,163,109,0.1)'
                          : 'rgba(197,163,109,0.15)',
                      },
                    ]}
                  >
                    <Feather name={s.icon} size={15} color={Colors.primary} />
                  </View>
                </View>
              ))}
            </View>

            {/* Menu sections */}
            {MENU_SECTIONS.map((section) => (
              <View key={section.title}>
                <Text style={[styles.sectionTitle, { color: colors.secondary }]}>
                  {section.title}
                </Text>
                <View
                  style={[
                    styles.menuCard,
                    { backgroundColor: colors.cardBg, borderColor: colors.cardBorder },
                  ]}
                >
                  {section.items.map((item, i) => (
                    <MenuRow
                      key={item.label}
                      icon={item.icon}
                      label={item.label}
                      onPress={() => item.screen && navigation.navigate(item.screen)}
                      isLast={i === section.items.length - 1}
                      colors={colors}
                    />
                  ))}
                </View>
              </View>
            ))}

            <GoldButton
              title="تسجيل الخروج"
              variant="outline"
              onPress={logout}
              style={{ marginTop: 8, marginBottom: 40 }}
            />
          </Animated.View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingBottom: 20 },

  // ── Hero ──
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    overflow: 'hidden',
  },
  glowBlob1: {
    position: 'absolute', top: -60, right: -60,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(197,163,109,0.08)',
  },
  glowBlob2: {
    position: 'absolute', top: 40, left: -80,
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(197,163,109,0.05)',
  },
  heroHeader: {
    width: '100%', flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center',
    paddingTop: Spacing.md, marginBottom: Spacing.xl,
  },
  heroTitle: {
    fontSize: Typography.lg, fontWeight: Typography.bold, letterSpacing: 0.5,
  },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  avatarContainer: {
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 20, width: 130, height: 130,
  },
  spinRing: {
    position: 'absolute', width: 120, height: 120,
    alignItems: 'center', justifyContent: 'center',
  },
  ringDot: {
    position: 'absolute', width: 5, height: 5,
    borderRadius: 2.5, backgroundColor: Colors.primary,
  },
  avatarRing: {
    width: 96, height: 96, borderRadius: 48,
    padding: 3, alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.5, shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 }, elevation: 8,
  },
  avatarInner: {
    width: 88, height: 88, borderRadius: 44,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: {
    color: Colors.primary, fontSize: 30,
    fontWeight: Typography.black, letterSpacing: 2,
  },
  tierBadge: {
    position: 'absolute', bottom: -10,
    borderWidth: 1, borderRadius: Radii.pill,
    paddingHorizontal: 12, paddingVertical: 4,
  },
  tierBadgeText: { fontSize: 11, fontWeight: Typography.bold },
  profileName: {
    fontSize: Typography['2xl'], fontWeight: Typography.black,
    letterSpacing: -0.5, marginTop: 16, marginBottom: 4,
  },
  profileEmail: { fontSize: Typography.sm, marginBottom: 16 },
  editBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderWidth: 1, borderColor: 'rgba(197,163,109,0.4)',
    borderRadius: Radii.pill, paddingHorizontal: 16, paddingVertical: 8,
  },
  editBtnText: {
    color: Colors.primary, fontSize: Typography.sm, fontWeight: Typography.semibold,
  },

  // ── Stats ──
  statsRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginHorizontal: Spacing.lg, marginBottom: Spacing.lg,
    borderRadius: Radii.xl, borderWidth: 1,
    borderColor: 'rgba(197,163,109,0.2)',
    backgroundColor: 'rgba(197,163,109,0.05)',
    paddingVertical: 18,
  },
  statPill: { flex: 1, alignItems: 'center' },
  statNum: {
    fontSize: Typography['2xl'], fontWeight: Typography.black, marginBottom: 2,
  },
  statLabel: { color: Colors.textMuted, fontSize: Typography.xs, letterSpacing: 1 },
  statDivider: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.08)' },

  // ── Reward card ──
  rewardCard: {
    marginHorizontal: Spacing.lg, borderRadius: Radii.xl,
    padding: Spacing.lg, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderColor: 'rgba(197,163,109,0.25)',
  },
  rewardCardLeft: { flex: 1 },
  rewardEyebrow: {
    backgroundColor: 'rgba(197,163,109,0.15)', borderRadius: Radii.pill,
    paddingHorizontal: 10, paddingVertical: 3,
    alignSelf: 'flex-end', marginBottom: 6,
  },
  rewardEyebrowText: {
    color: Colors.primary, fontSize: 8, letterSpacing: 3, fontWeight: Typography.bold,
  },
  rewardTierText: {
    fontSize: Typography.md, fontWeight: Typography.bold,
    textAlign: 'right', marginBottom: 4,
  },
  rewardNextText: { color: Colors.textMuted, fontSize: Typography.xs, textAlign: 'right' },
  rewardCardRight: { alignItems: 'center', paddingLeft: 16 },
  rewardStarsNum: {
    color: Colors.primary, fontSize: 38,
    fontWeight: Typography.black, letterSpacing: -2,
  },
  rewardStarsLabel: {
    color: Colors.primaryLight, fontSize: Typography.sm, fontWeight: Typography.medium,
  },
  rewardProgressTrack: {
    marginHorizontal: Spacing.lg, height: 4,
    backgroundColor: 'rgba(197,163,109,0.15)',
    borderBottomLeftRadius: Radii.sm, borderBottomRightRadius: Radii.sm,
    overflow: 'hidden', marginBottom: Spacing.lg,
  },
  rewardProgressFill: { height: '100%', backgroundColor: Colors.primary },

  // ── Section header ──
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: Spacing.lg, marginBottom: 10,
  },
  sectionTitle: {
    fontSize: Typography.base, fontWeight: Typography.bold,
    textAlign: 'right', paddingHorizontal: Spacing.lg,
    marginBottom: 10, marginTop: 4,
  },
  seeAll: { color: Colors.primary, fontSize: Typography.sm, fontWeight: Typography.medium },

  // ── Orders ──
  orderCard: {
    marginHorizontal: Spacing.lg, borderRadius: Radii.xl,
    borderWidth: 1, padding: 14, marginBottom: 10,
  },
  orderTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 6,
  },
  orderId: { fontSize: Typography.sm, fontWeight: Typography.bold },
  orderStatusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(76,175,80,0.12)', borderRadius: Radii.pill,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  orderStatusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4CAF50' },
  orderStatusText: { color: '#4CAF50', fontSize: 11, fontWeight: Typography.semibold },
  orderItems: { fontSize: Typography.sm, marginBottom: 10, textAlign: 'right' },
  orderBottom: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  orderDate: { flex: 1, fontSize: Typography.xs },
  orderTotal: { fontSize: Typography.sm, fontWeight: Typography.bold },
  orderStars: { fontSize: Typography.xs, fontWeight: Typography.bold },

  // ── Settings ──
  settingsCard: {
    marginHorizontal: Spacing.lg, borderRadius: Radii.xl,
    borderWidth: 1, overflow: 'hidden', marginBottom: Spacing.lg,
  },
  settingRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14, gap: 12,
  },
  settingLabelWrap: { flex: 1 },
  settingLabel: {
    fontSize: Typography.base, fontWeight: Typography.medium, textAlign: 'right',
  },
  settingIconWrap: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },

  // ── Menu sections ──
  menuCard: {
    marginHorizontal: Spacing.lg, borderRadius: Radii.xl,
    borderWidth: 1, overflow: 'hidden', marginBottom: Spacing.lg,
  },
  menuRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 16, gap: 12,
  },
  menuIconWrap: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(197,163,109,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  menuLabel: {
    flex: 1, fontSize: Typography.base, textAlign: 'right', fontWeight: Typography.medium,
  },
});
