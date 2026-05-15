import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, Animated, Easing, Image, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { DarkColors, Typography, Radii, Spacing, Shadows } from '../constants/theme';
import { MenuCard } from '../components/MenuCard';
import { useApp } from '../context/AppContext';
import { MENU_ITEMS, REWARDS_TIERS } from '../constants/data';

const { width: SCREEN_W } = Dimensions.get('window');

const SPRING_FAST   = { damping: 14, stiffness: 300, useNativeDriver: true };
const SPRING_SMOOTH = { damping: 10, stiffness: 200, useNativeDriver: true };
const EASE_EXPO     = Easing.bezier(0.16, 1, 0.3, 1);
const EASE_OUT      = Easing.bezier(0.22, 1, 0.36, 1);

function useFadeUp(delay = 0) {
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity,    { toValue: 1, duration: 650, delay, easing: EASE_EXPO, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 650, delay, easing: EASE_EXPO, useNativeDriver: true }),
    ]).start();
  }, []);
  return { opacity, transform: [{ translateY }] };
}

// ─── Circular progress ring drawn with animated arc ──────────────────────
function RewardRing({ progress, stars, tierColor, isDark, C }) {
  const animProg = useRef(new Animated.Value(0)).current;
  const pulse    = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(animProg, {
      toValue: progress / 100, duration: 1400,
      easing: EASE_EXPO, useNativeDriver: false,
    }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.06, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,    duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const SIZE  = 180;
  const THICK = 7;
  const R     = (SIZE - THICK) / 2;
  const CIRC  = 2 * Math.PI * R;

  // We fake the arc with a conic-like gradient overlay + a thin track circle
  // Since RN doesn't support SVG stroke-dasharray easily, we use 8 segment dots
  const DOTS = 36;

  return (
    <Animated.View style={[styles.ringWrap, { transform: [{ scale: pulse }] }]}>
      {/* Track ring */}
      <View style={[
        styles.ringTrack,
        {
          width: SIZE, height: SIZE, borderRadius: SIZE / 2,
          borderWidth: THICK,
          borderColor: isDark ? 'rgba(197,163,109,0.14)' : 'rgba(139,99,50,0.12)',
        },
      ]} />

      {/* Progress dots */}
      {Array.from({ length: DOTS }).map((_, i) => {
        const angle = (i / DOTS) * 360 - 90;
        const filled = (i / DOTS) <= (progress / 100);
        const rad = (angle * Math.PI) / 180;
        const cx = SIZE / 2 + (R) * Math.cos(rad) - 3;
        const cy = SIZE / 2 + (R) * Math.sin(rad) - 3;
        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: cx, top: cy,
              width: 5, height: 5, borderRadius: 3,
              backgroundColor: filled
                ? (i % 3 === 0 ? tierColor : `${tierColor}BB`)
                : (isDark ? 'rgba(197,163,109,0.10)' : 'rgba(139,99,50,0.08)'),
            }}
          />
        );
      })}

      {/* Center content */}
      <View style={styles.ringCenter}>
        {/* Coffee cup illustration placeholder */}
        <View style={[
          styles.cupWrap,
          {
            backgroundColor: isDark ? 'rgba(197,163,109,0.08)' : 'rgba(139,99,50,0.06)',
            borderColor:      isDark ? 'rgba(197,163,109,0.20)' : 'rgba(139,99,50,0.15)',
          },
        ]}>
          <Feather name="coffee" size={36} color={tierColor} />
        </View>

        {/* Stars count */}
        <Text style={[styles.ringStars, { color: C.secondary }]}>{stars}</Text>
        <Text style={[styles.ringStarsLabel, { color: tierColor }]}>★ نجمة</Text>
      </View>
    </Animated.View>
  );
}

// ─── Circular product pill (Starbucks-style) ─────────────────────────────
function ProductPill({ item, onPress, isDark, C }) {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={() => Animated.spring(scale, { toValue: 0.92, ...SPRING_FAST }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1,    ...SPRING_SMOOTH }).start()}
        activeOpacity={1}
        style={styles.pill}
      >
        {/* Circle image */}
        <View style={[
          styles.pillImgWrap,
          {
            backgroundColor: isDark ? '#1A1408' : '#F5F0E8',
            borderColor:      isDark ? 'rgba(197,163,109,0.18)' : 'rgba(139,99,50,0.14)',
          },
        ]}>
          <Image source={{ uri: item.image }} style={styles.pillImg} resizeMode="cover" />
          {/* "جديد" badge */}
          {item.isNew && (
            <View style={[styles.pillBadge, { backgroundColor: C.primary }]}>
              <Text style={[styles.pillBadgeText, { color: isDark ? '#0A0805' : '#FFF' }]}>جديد</Text>
            </View>
          )}
        </View>
        <Text style={[styles.pillName, { color: C.secondary }]} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={[styles.pillPrice, { color: C.primary }]}>{item.price.toFixed(2)}ر</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Quick action pill ────────────────────────────────────────────────────
function QuickBtn({ iconName, label, onPress, C, isDark }) {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPressIn={() => Animated.spring(scale, { toValue: 0.90, ...SPRING_FAST }).start()}
        onPressOut={() => {
          Animated.spring(scale, { toValue: 1, ...SPRING_SMOOTH }).start();
          onPress?.();
        }}
        activeOpacity={1}
        style={styles.quickBtn}
      >
        <View style={[
          styles.quickBtnIcon,
          {
            backgroundColor: isDark ? 'rgba(197,163,109,0.08)' : 'rgba(139,99,50,0.07)',
            borderColor:      isDark ? 'rgba(197,163,109,0.18)' : 'rgba(139,99,50,0.14)',
          },
        ]}>
          <Feather name={iconName} size={20} color={C.primary} />
        </View>
        <Text style={[styles.quickBtnLabel, { color: C.textMuted }]}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────
export function HomeScreen({ navigation }) {
  const { user, stars, cartCount, addToCart, notifications, colors, isDark, toggleTheme } = useApp();
  const C = colors;

  const featured    = MENU_ITEMS.filter((i) => i.isFeatured);
  const newArrivals = MENU_ITEMS.filter((i) => i.isNew || i.isFeatured).slice(0, 6);
  const currentTier = REWARDS_TIERS.find((t) => stars >= t.min && stars <= t.max) || REWARDS_TIERS[1];
  const nextTier    = REWARDS_TIERS[REWARDS_TIERS.indexOf(currentTier) + 1];
  const progress    = nextTier
    ? ((stars - currentTier.min) / (nextTier.min - currentTier.min)) * 100
    : 100;

  const scrollY = useRef(new Animated.Value(0)).current;

  // Hero bg parallax
  const heroBgScale = scrollY.interpolate({
    inputRange: [-80, 0, 200], outputRange: [1.1, 1, 0.92], extrapolate: 'clamp',
  });
  const heroBgOpacity = scrollY.interpolate({
    inputRange: [0, 180], outputRange: [1, 0], extrapolate: 'clamp',
  });

  // Theme toggle spin
  const themeSpin = useRef(new Animated.Value(0)).current;
  const handleThemeToggle = () => {
    Animated.timing(themeSpin, {
      toValue: themeSpin._value + 1, duration: 500,
      easing: EASE_OUT, useNativeDriver: true,
    }).start();
    toggleTheme();
  };
  const themeRotate = themeSpin.interpolate({
    inputRange: [0, 1], outputRange: ['0deg', '180deg'],
  });

  // Staggered entrance
  const topBarAnim  = useFadeUp(0);
  const heroAnim    = useFadeUp(80);
  const ctaAnim     = useFadeUp(180);
  const pillsAnim   = useFadeUp(260);
  const rewardAnim  = useFadeUp(320);
  const quickAnim   = useFadeUp(400);
  const featAnim    = useFadeUp(460);

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? 'صباح الخير' : hour < 17 ? 'مساء الخير' : 'مساء النور';

  return (
    <View style={[styles.root, { backgroundColor: C.background }]}>

      {/* ── Full-bleed hero background gradient ── */}
      <Animated.View
        style={[
          styles.heroBgWrap,
          { opacity: heroBgOpacity, transform: [{ scale: heroBgScale }] },
        ]}
        pointerEvents="none"
      >
        <LinearGradient
          colors={isDark
            ? ['rgba(197,163,109,0.28)', 'rgba(197,163,109,0.08)', 'transparent']
            : ['rgba(197,163,109,0.18)', 'rgba(253,250,245,0.0)',  'transparent']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }}
        />
        {/* Side accent blob */}
        <LinearGradient
          colors={isDark
            ? ['rgba(232,201,122,0.14)', 'transparent']
            : ['rgba(197,163,109,0.10)', 'transparent']}
          style={[StyleSheet.absoluteFill, { left: '30%' }]}
          start={{ x: 0, y: 0.2 }} end={{ x: 1, y: 0.8 }}
        />
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <SafeAreaView edges={['top']}>

          {/* ══════════════════════════════════════
              TOP BAR — greeting left, icons right
          ══════════════════════════════════════ */}
          <Animated.View style={[styles.topBar, topBarAnim]}>
            {/* Left: greeting */}
            <View>
              <Text style={[styles.greetingText, { color: C.textMuted }]}>{greeting}</Text>
              <Text style={[styles.nameText, { color: C.secondary }]}>
                {user?.name || 'زائر'}
              </Text>
            </View>

            {/* Right: icon cluster */}
            <View style={styles.topBarIcons}>
              {/* Theme toggle */}
              <Animated.View style={{ transform: [{ rotate: themeRotate }] }}>
                <TouchableOpacity
                  onPress={handleThemeToggle}
                  style={[styles.iconBtn, {
                    backgroundColor: isDark ? 'rgba(197,163,109,0.08)' : 'rgba(139,99,50,0.07)',
                    borderColor:      isDark ? 'rgba(197,163,109,0.18)' : 'rgba(139,99,50,0.14)',
                  }]}
                >
                  <Feather name={isDark ? 'sun' : 'moon'} size={17} color={C.primary} />
                </TouchableOpacity>
              </Animated.View>

              {/* Cart */}
              <TouchableOpacity
                onPress={() => navigation.navigate('Cart')}
                style={[styles.iconBtn, {
                  backgroundColor: isDark ? 'rgba(197,163,109,0.08)' : 'rgba(139,99,50,0.07)',
                  borderColor:      isDark ? 'rgba(197,163,109,0.18)' : 'rgba(139,99,50,0.14)',
                }]}
              >
                <Feather name="shopping-bag" size={17} color={C.secondary} />
                {cartCount > 0 && (
                  <View style={[styles.badge, { backgroundColor: C.primary }]}>
                    <Text style={[styles.badgeText, { color: isDark ? '#0A0805' : '#FFF' }]}>{cartCount}</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Profile */}
              <TouchableOpacity
                onPress={() => navigation.navigate('Profile')}
                style={[styles.iconBtn, {
                  backgroundColor: isDark ? 'rgba(197,163,109,0.08)' : 'rgba(139,99,50,0.07)',
                  borderColor:      isDark ? 'rgba(197,163,109,0.18)' : 'rgba(139,99,50,0.14)',
                }]}
              >
                <Feather name="user" size={17} color={C.secondary} />
                {notifications > 0 && (
                  <View style={[styles.badge, { backgroundColor: C.primary }]}>
                    <Text style={[styles.badgeText, { color: isDark ? '#0A0805' : '#FFF' }]}>{notifications}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* ══════════════════════════════════════
              HERO — Centered reward ring + headline
              (Starbucks-style spatial composition)
          ══════════════════════════════════════ */}
          <Animated.View style={[styles.heroSection, heroAnim]}>

            {/* Eyebrow */}
            <View style={[styles.eyebrow, {
              backgroundColor: isDark ? 'rgba(197,163,109,0.10)' : 'rgba(139,99,50,0.07)',
              borderColor:      isDark ? 'rgba(197,163,109,0.25)' : 'rgba(139,99,50,0.18)',
            }]}>
              <View style={[styles.eyebrowDot, { backgroundColor: C.primary }]} />
              <Text style={[styles.eyebrowText, { color: C.primary }]}>SIGNATURE COFFEEHOUSE</Text>
            </View>

            {/* Centered reward ring — the hero visual */}
            <RewardRing
              progress={progress}
              stars={stars}
              tierColor={currentTier.color}
              isDark={isDark}
              C={C}
            />

            {/* Tier name below ring */}
            <View style={[styles.tierRow, {
              backgroundColor: isDark ? 'rgba(197,163,109,0.08)' : 'rgba(139,99,50,0.06)',
              borderColor:      isDark ? 'rgba(197,163,109,0.20)' : 'rgba(139,99,50,0.14)',
            }]}>
              <Text style={[styles.tierText, { color: currentTier.color }]}>◆ عضو {currentTier.name}</Text>
              {nextTier && (
                <Text style={[styles.tierNextText, { color: C.textMuted }]}>
                  {nextTier.min - stars} نجمة للوصول إلى{' '}
                  <Text style={{ color: nextTier.color }}>{nextTier.name}</Text>
                </Text>
              )}
            </View>

            {/* Headline */}
            <View style={styles.headlineWrap}>
              <Text style={[styles.heroTitle, { color: C.secondary }]}>
                قهوتك{' '}
                <Text style={{ color: C.primary }}>الآن</Text>
              </Text>
              <Text style={[styles.heroSub, { color: C.textMuted }]}>
                اطلب من أي مكان · توصيل خلال ٢٠ دقيقة
              </Text>
            </View>

          </Animated.View>

          {/* ══════════════════════════════════════
              CTA BUTTONS
          ══════════════════════════════════════ */}
          <Animated.View style={[styles.ctaRow, ctaAnim]}>
            {/* Primary */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Menu')}
              activeOpacity={0.88}
              style={[styles.ctaPrimary, { backgroundColor: C.primary }, Shadows.gold]}
            >
              <Text style={[styles.ctaPrimaryText, { color: isDark ? '#0A0805' : '#FFF' }]}>
                اطلب الآن
              </Text>
              <View style={[styles.ctaIconCircle, {
                backgroundColor: isDark ? 'rgba(10,8,5,0.20)' : 'rgba(255,255,255,0.25)',
              }]}>
                <Feather name="arrow-left" size={14} color={isDark ? '#0A0805' : '#FFF'} />
              </View>
            </TouchableOpacity>

            {/* Secondary */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Menu')}
              activeOpacity={0.85}
              style={[styles.ctaSecondary, {
                borderColor: isDark ? 'rgba(197,163,109,0.32)' : 'rgba(139,99,50,0.24)',
              }]}
            >
              <Text style={[styles.ctaSecondaryText, { color: C.primary }]}>القائمة</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* ══════════════════════════════════════
              STATS STRIP
          ══════════════════════════════════════ */}
          <Animated.View style={[styles.statsStrip, ctaAnim, {
            borderColor: isDark ? 'rgba(197,163,109,0.12)' : 'rgba(139,99,50,0.10)',
            backgroundColor: isDark ? 'rgba(197,163,109,0.04)' : 'rgba(139,99,50,0.03)',
          }]}>
            {[
              { value: `${stars}`, unit: '★', label: 'نجومك' },
              { value: '٢٠',      unit: 'د',  label: 'توصيل' },
              { value: '٣',       unit: '',   label: 'كوبونات' },
            ].map((stat, i) => (
              <React.Fragment key={stat.label}>
                {i > 0 && (
                  <View style={[styles.statDivider, {
                    backgroundColor: isDark ? 'rgba(197,163,109,0.14)' : 'rgba(139,99,50,0.10)',
                  }]} />
                )}
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: C.secondary }]}>
                    {stat.value}
                    <Text style={{ color: C.primary, fontSize: 13 }}>{stat.unit}</Text>
                  </Text>
                  <Text style={[styles.statLabel, { color: C.textMuted }]}>{stat.label}</Text>
                </View>
              </React.Fragment>
            ))}
          </Animated.View>

        </SafeAreaView>

        {/* ══════════════════════════════════════
            "جرّبت هذه؟" — Circular product pills
            (Starbucks "Have you tried these?" row)
        ══════════════════════════════════════ */}
        <Animated.View style={pillsAnim}>
          <View style={[styles.sectionHeader, { paddingHorizontal: Spacing.lg }]}>
            <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
              <Text style={[styles.seeAll, { color: C.primary }]}>عرض الكل</Text>
            </TouchableOpacity>
            <Text style={[styles.sectionTitle, { color: C.secondary }]}>جرّبت هذه؟</Text>
          </View>

          <FlatList
            data={newArrivals}
            keyExtractor={(i) => i.id}
            horizontal
            inverted
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: Spacing.lg, gap: 16, paddingBottom: 4 }}
            renderItem={({ item }) => (
              <ProductPill
                item={item}
                onPress={() => navigation.navigate('ItemDetail', { item })}
                isDark={isDark}
                C={C}
              />
            )}
          />
        </Animated.View>

        {/* ══════════════════════════════════════
            REWARDS CARD — Compact inline version
        ══════════════════════════════════════ */}
        <Animated.View style={[rewardAnim, { paddingHorizontal: Spacing.lg, marginTop: Spacing.lg }]}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Rewards')}
            activeOpacity={0.88}
          >
            <LinearGradient
              colors={isDark ? ['#2C1E0A', '#1A1200', '#0E0900'] : ['#4A3015', '#3A2410', '#2C1C08']}
              style={[styles.rewardCard, { borderColor: isDark ? 'rgba(197,163,109,0.22)' : 'rgba(197,163,109,0.30)' }]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            >
              {/* Left: info */}
              <View style={{ flex: 1 }}>
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
                {/* Mini progress bar */}
                <View style={styles.rewardProgressTrack}>
                  <Animated.View
                    style={[styles.rewardProgressFill, {
                      width: `${Math.min(progress, 100)}%`,
                      backgroundColor: currentTier.color,
                    }]}
                  />
                </View>
              </View>

              {/* Right: big stars number */}
              <View style={styles.rewardRight}>
                <Text style={styles.rewardStarsNum}>{stars}</Text>
                <Text style={styles.rewardStarsLabel}>★ نجمة</Text>
              </View>

              {/* Arrow */}
              <View style={styles.rewardArrow}>
                <Feather name="chevron-left" size={16} color="rgba(197,163,109,0.6)" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* ══════════════════════════════════════
            QUICK ACTIONS
        ══════════════════════════════════════ */}
        <Animated.View style={[styles.quickActions, quickAnim]}>
          <QuickBtn iconName="message-circle" label="الدردشة"   onPress={() => navigation.navigate('Chat')}    C={C} isDark={isDark} />
          <QuickBtn iconName="map-pin"        label="الفروع"    onPress={() => {}}                             C={C} isDark={isDark} />
          <QuickBtn iconName="tag"            label="الكوبونات" onPress={() => navigation.navigate('Coupons')} C={C} isDark={isDark} />
          <QuickBtn iconName="package"        label="اطلب الآن" onPress={() => navigation.navigate('Menu')}   C={C} isDark={isDark} />
        </Animated.View>

        {/* ══════════════════════════════════════
            COUPON BANNER
        ══════════════════════════════════════ */}
        <Animated.View style={[{ paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg }, quickAnim]}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Coupons')}
            activeOpacity={0.88}
            style={styles.couponBanner}
          >
            <LinearGradient
              colors={isDark ? ['#3D2B1F', '#5A3D2A'] : ['#5A3D2A', '#7A5038']}
              style={styles.couponBannerInner}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            >
              <View style={styles.couponIconWrap}>
                <Feather name="gift" size={20} color="#C5A36D" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.couponTitle}>لديك 3 كوبونات نشطة</Text>
                <Text style={styles.couponSub}>اضغط لعرض خصوماتك واسترداد المكافآت</Text>
              </View>
              <Feather name="chevron-left" size={18} color="rgba(255,255,255,0.4)" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* ══════════════════════════════════════
            FEATURED — مختارات اليوم
        ══════════════════════════════════════ */}
        <Animated.View style={featAnim}>
          <View style={[styles.sectionHeader, { paddingHorizontal: Spacing.lg }]}>
            <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
              <Text style={[styles.seeAll, { color: C.primary }]}>عرض الكل</Text>
            </TouchableOpacity>
            <Text style={[styles.sectionTitle, { color: C.secondary }]}>مختارات اليوم</Text>
          </View>

          <FlatList
            data={featured}
            keyExtractor={(i) => i.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: Spacing.lg, gap: 14, paddingBottom: Spacing.md }}
            renderItem={({ item }) => (
              <MenuCard
                item={item}
                onPress={() => navigation.navigate('ItemDetail', { item })}
                onAddToCart={addToCart}
              />
            )}
          />
        </Animated.View>

        {/* ══════════════════════════════════════
            DELIVERY BANNER
        ══════════════════════════════════════ */}
        <View style={[styles.deliveryCard, {
          marginHorizontal: Spacing.lg,
          backgroundColor: C.cardBg,
          borderColor:     C.cardBorder,
        }]}>
          <View style={styles.deliveryInner}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Menu')}
              style={[styles.orderNowBtn, { backgroundColor: C.primary }, Shadows.gold]}
            >
              <Text style={[styles.orderNowText, { color: isDark ? '#0A0805' : '#FFF' }]}>اطلب الآن</Text>
            </TouchableOpacity>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text style={[styles.deliveryTitle, { color: C.secondary }]}>توصيل سريع</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Feather name="zap" size={12} color={C.primary} />
                <Text style={[styles.deliveryEta, { color: C.primary }]}>١٨–٢٥ دقيقة</Text>
              </View>
              <Text style={[styles.deliverySub, { color: C.textMuted }]}>بناءً على عنوانك المحفوظ</Text>
            </View>
          </View>
        </View>

      </Animated.ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────
const { StyleSheet } = require('react-native');

const styles = StyleSheet.create({
  root:   { flex: 1 },

  // Background glow
  heroBgWrap: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 480,
  },

  // Top bar
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm, paddingBottom: Spacing.md,
  },
  greetingText: { fontSize: Typography.xs, letterSpacing: 1.5, marginBottom: 2 },
  nameText: {
    fontSize: Typography.xl, fontWeight: Typography.black,
    letterSpacing: Typography.tight,
  },
  topBarIcons: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  badge: {
    position: 'absolute', top: -3, right: -3,
    minWidth: 17, height: 17, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3,
  },
  badgeText: { fontSize: 9, fontWeight: Typography.bold },

  // Hero section
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  eyebrow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderWidth: 1, borderRadius: Radii.pill,
    paddingHorizontal: 12, paddingVertical: 5,
    marginBottom: Spacing.lg,
  },
  eyebrowDot:  { width: 5, height: 5, borderRadius: 3 },
  eyebrowText: { fontSize: 9, letterSpacing: 2.8, fontWeight: Typography.semibold },

  // Reward ring
  ringWrap: {
    width: 180, height: 180,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  ringTrack: { position: 'absolute' },
  ringCenter: {
    position: 'absolute',
    alignItems: 'center', justifyContent: 'center',
  },
  cupWrap: {
    width: 76, height: 76, borderRadius: 38,
    borderWidth: 1.5, alignItems: 'center', justifyContent: 'center',
    marginBottom: 6,
  },
  ringStars: {
    fontSize: 28, fontWeight: Typography.black, letterSpacing: -1, lineHeight: 30,
  },
  ringStarsLabel: { fontSize: Typography.xs, fontWeight: Typography.semibold, letterSpacing: 1 },

  // Tier row
  tierRow: {
    alignItems: 'center', borderWidth: 1, borderRadius: Radii.pill,
    paddingHorizontal: 18, paddingVertical: 8,
    marginBottom: Spacing.lg, gap: 2,
  },
  tierText:     { fontSize: Typography.sm, fontWeight: Typography.bold },
  tierNextText: { fontSize: Typography.xs, textAlign: 'center' },

  // Headline
  headlineWrap: { alignItems: 'center' },
  heroTitle: {
    fontSize: 46, fontWeight: Typography.black,
    letterSpacing: -1.5, textAlign: 'center', marginBottom: 8,
  },
  heroSub: {
    fontSize: Typography.sm, textAlign: 'center',
    letterSpacing: 0.3, lineHeight: 20,
  },

  // CTA
  ctaRow: {
    flexDirection: 'row', justifyContent: 'center',
    alignItems: 'center', gap: 12,
    paddingHorizontal: Spacing.lg, marginBottom: Spacing.md,
  },
  ctaPrimary: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: Radii.pill, paddingLeft: 22, paddingRight: 6, paddingVertical: 6,
    gap: 10,
  },
  ctaPrimaryText: { fontSize: Typography.base, fontWeight: Typography.bold, letterSpacing: 0.3 },
  ctaIconCircle: {
    width: 34, height: 34, borderRadius: 17,
    alignItems: 'center', justifyContent: 'center',
  },
  ctaSecondary: {
    borderRadius: Radii.pill, borderWidth: 1.5,
    paddingHorizontal: 22, paddingVertical: 13,
  },
  ctaSecondaryText: { fontSize: Typography.base, fontWeight: Typography.semibold },

  // Stats strip
  statsStrip: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: Spacing.lg, borderRadius: Radii.xl,
    borderWidth: 1, paddingVertical: 14, marginBottom: Spacing.xl,
  },
  statItem:   { flex: 1, alignItems: 'center' },
  statValue:  { fontSize: Typography['2xl'], fontWeight: Typography.black, letterSpacing: -1 },
  statLabel:  { fontSize: Typography.xs, letterSpacing: 1, marginTop: 2 },
  statDivider:{ width: 1, height: 32 },

  // Product pills
  pill: { width: 88, alignItems: 'center' },
  pillImgWrap: {
    width: 76, height: 76, borderRadius: 38,
    borderWidth: 2, overflow: 'hidden',
    marginBottom: 8,
    shadowColor: '#000', shadowOpacity: 0.12,
    shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  pillImg: { width: '100%', height: '100%' },
  pillBadge: {
    position: 'absolute', bottom: 2, left: 0, right: 0,
    alignItems: 'center', paddingVertical: 2,
  },
  pillBadgeText: { fontSize: 8, fontWeight: Typography.bold, letterSpacing: 0.5 },
  pillName: {
    fontSize: 11, fontWeight: Typography.semibold,
    textAlign: 'center', lineHeight: 14, marginBottom: 3,
  },
  pillPrice: { fontSize: 11, fontWeight: Typography.bold },

  // Section headers
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 14,
  },
  sectionTitle: { fontSize: Typography.lg, fontWeight: Typography.bold, textAlign: 'right' },
  seeAll:       { fontSize: Typography.sm, fontWeight: Typography.medium },

  // Reward card
  rewardCard: {
    borderRadius: Radii.xl, borderWidth: 1,
    padding: Spacing.lg, flexDirection: 'row',
    alignItems: 'center', gap: 14,
  },
  rewardEyebrow: {
    backgroundColor: 'rgba(197,163,109,0.16)', borderRadius: Radii.pill,
    paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-end', marginBottom: 5,
  },
  rewardEyebrowText: { color: '#C5A36D', fontSize: 8, letterSpacing: 3, fontWeight: Typography.bold },
  rewardTierText:    { color: '#C5A36D', fontSize: Typography.md, fontWeight: Typography.bold, textAlign: 'right', marginBottom: 2 },
  rewardNextText:    { color: 'rgba(255,255,255,0.45)', fontSize: Typography.xs, textAlign: 'right', marginBottom: 8 },
  rewardProgressTrack: {
    height: 3, backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 2, overflow: 'hidden',
  },
  rewardProgressFill: { height: '100%', borderRadius: 2 },
  rewardRight: { alignItems: 'center' },
  rewardStarsNum: {
    color: '#C5A36D', fontSize: 36, fontWeight: Typography.black, letterSpacing: -1.5,
  },
  rewardStarsLabel: { color: '#D4B98A', fontSize: Typography.sm, fontWeight: Typography.medium },
  rewardArrow: { paddingLeft: 4 },

  // Quick actions
  quickActions: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg,
  },
  quickBtn:     { alignItems: 'center', gap: 8 },
  quickBtnIcon: {
    width: 58, height: 58, borderRadius: Radii.lg,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  quickBtnLabel: { fontSize: Typography.xs, fontWeight: Typography.medium },

  // Coupon
  couponBanner:      { borderRadius: Radii.xl, overflow: 'hidden' },
  couponBannerInner: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  couponIconWrap: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(197,163,109,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  couponTitle: { color: '#F2EDE4', fontSize: Typography.base, fontWeight: Typography.semibold, textAlign: 'right' },
  couponSub:   { color: 'rgba(242,237,228,0.6)', fontSize: Typography.xs, marginTop: 2, textAlign: 'right' },

  // Delivery card
  deliveryCard: {
    borderRadius: Radii.xl, borderWidth: 1,
    marginBottom: Spacing.lg, overflow: 'hidden',
  },
  deliveryInner: {
    padding: 16, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between', gap: 12,
  },
  orderNowBtn: {
    borderRadius: Radii.pill, paddingHorizontal: 20, paddingVertical: 12,
  },
  orderNowText: { fontSize: Typography.sm, fontWeight: Typography.bold, letterSpacing: 0.4 },
  deliveryTitle: { fontSize: Typography.md, fontWeight: Typography.bold, marginBottom: 3 },
  deliveryEta:   { fontSize: Typography.sm, fontWeight: Typography.semibold },
  deliverySub:   { fontSize: Typography.xs },
});
