import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, Animated, Easing, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Colors, DarkColors, LightColors, Typography, Radii, Spacing, Shadows } from '../constants/theme';
import { MenuCard } from '../components/MenuCard';
import { useApp } from '../context/AppContext';
import { MENU_ITEMS, REWARDS_TIERS } from '../constants/data';

// ─── Cubic-bezier easing (no linear/ease-in-out) ─────────────────────────
const SPRING_FAST   = { damping: 14, stiffness: 300, useNativeDriver: true };
const SPRING_SMOOTH = { damping: 10, stiffness: 200, useNativeDriver: true };
const EASE_OUT      = Easing.bezier(0.22, 1, 0.36, 1);
const EASE_EXPO     = Easing.bezier(0.16, 1, 0.3, 1);

// ─── Staggered fade-up entrance ──────────────────────────────────────────
function useFadeUp(delay = 0) {
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(28)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity,    { toValue: 1, duration: 700, delay, easing: EASE_EXPO, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 700, delay, easing: EASE_EXPO, useNativeDriver: true }),
    ]).start();
  }, []);
  return { opacity, transform: [{ translateY }] };
}

// ─── Icon button with spring press ───────────────────────────────────────
function IconBtn({ name, onPress, badge, colors, isDark }) {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={() => Animated.spring(scale, { toValue: 0.88, ...SPRING_FAST }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1,    ...SPRING_SMOOTH }).start()}
        activeOpacity={1}
        style={[
          styles.iconBtn,
          {
            backgroundColor: isDark ? 'rgba(197,163,109,0.08)' : 'rgba(139,99,50,0.07)',
            borderColor:      isDark ? 'rgba(197,163,109,0.18)' : 'rgba(139,99,50,0.15)',
          },
        ]}
      >
        <Feather name={name} size={18} color={colors.secondary} />
        {badge > 0 && (
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Text style={[styles.badgeText, { color: isDark ? '#0A0805' : '#FFFFFF' }]}>{badge}</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Quick action pill ────────────────────────────────────────────────────
function QuickBtn({ iconName, label, onPress, colors, isDark }) {
  const scale = useRef(new Animated.Value(1)).current;
  const glow  = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 0.90, ...SPRING_FAST }),
      Animated.timing(glow, { toValue: 1, duration: 150, useNativeDriver: false }),
    ]).start();
  };
  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, ...SPRING_SMOOTH }),
      Animated.timing(glow, { toValue: 0, duration: 200, useNativeDriver: false }),
    ]).start();
    onPress?.();
  };

  const bgColor = glow.interpolate({
    inputRange: [0, 1],
    outputRange: isDark
      ? ['rgba(197,163,109,0.08)', 'rgba(197,163,109,0.22)']
      : ['rgba(139,99,50,0.07)',   'rgba(139,99,50,0.18)'],
  });
  const borderColor = glow.interpolate({
    inputRange: [0, 1],
    outputRange: isDark
      ? ['rgba(197,163,109,0.16)', 'rgba(197,163,109,0.45)']
      : ['rgba(139,99,50,0.14)',   'rgba(139,99,50,0.40)'],
  });

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={styles.quickBtn}
      >
        <Animated.View style={[styles.quickBtnIcon, { backgroundColor: bgColor, borderColor }]}>
          <Feather name={iconName} size={20} color={colors.primary} />
        </Animated.View>
        <Text style={[styles.quickBtnLabel, { color: colors.textMuted }]}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── New Arrival card ────────────────────────────────────────────────────
function NewArrivalCard({ item, colors, isDark, onPress, onAddToCart }) {
  const scale       = useRef(new Animated.Value(1)).current;
  const imgScale    = useRef(new Animated.Value(1)).current;
  const btnScale    = useRef(new Animated.Value(1)).current;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={() => {
          Animated.parallel([
            Animated.spring(scale,    { toValue: 0.96, ...SPRING_FAST }),
            Animated.spring(imgScale, { toValue: 1.06, ...SPRING_SMOOTH }),
          ]).start();
        }}
        onPressOut={() => {
          Animated.parallel([
            Animated.spring(scale,    { toValue: 1, ...SPRING_SMOOTH }),
            Animated.spring(imgScale, { toValue: 1, ...SPRING_SMOOTH }),
          ]).start();
        }}
        activeOpacity={1}
        style={[
          styles.newCard,
          {
            backgroundColor: colors.cardBg,
            borderColor:      colors.cardBorder,
            shadowColor:      isDark ? '#C5A36D' : '#8B6332',
            shadowOpacity:    isDark ? 0.12 : 0.06,
            shadowRadius:     20,
            shadowOffset:     { width: 0, height: 8 },
            elevation:        6,
          },
        ]}
      >
        {/* Image with zoom */}
        <View style={styles.newCardImageWrap}>
          <Animated.View style={{ transform: [{ scale: imgScale }], flex: 1 }}>
            <Image source={{ uri: item.image }} style={styles.newCardImage} resizeMode="cover" />
          </Animated.View>
          <LinearGradient
            colors={['transparent', isDark ? 'rgba(10,8,5,0.55)' : 'rgba(0,0,0,0.25)']}
            style={styles.newCardOverlay}
          />
          {/* Tag pills */}
          <View style={styles.newCardTags}>
            {item.tags.slice(0, 2).map((tag) => (
              <View
                key={tag}
                style={[
                  styles.newCardTag,
                  { backgroundColor: isDark ? 'rgba(10,8,5,0.72)' : 'rgba(0,0,0,0.55)' },
                ]}
              >
                <Text style={styles.newCardTagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Content */}
        <View style={styles.newCardContent}>
          <Text style={[styles.newCardName, { color: colors.secondary }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.newCardDesc, { color: colors.textMuted }]} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.newCardFooter}>
            {/* Add button */}
            <Animated.View style={{ transform: [{ scale: btnScale }] }}>
              <TouchableOpacity
                onPress={() => {
                  Animated.sequence([
                    Animated.timing(btnScale, { toValue: 0.82, duration: 90, useNativeDriver: true }),
                    Animated.spring(btnScale, { toValue: 1, ...SPRING_FAST }),
                  ]).start();
                  onAddToCart?.(item);
                }}
                style={[styles.newCardAddBtn, { backgroundColor: colors.primary, ...Shadows.gold }]}
              >
                <Feather name="plus" size={15} color={isDark ? '#0A0805' : '#FFFFFF'} />
              </TouchableOpacity>
            </Animated.View>
            <View style={styles.newCardPriceRow}>
              <Text style={[styles.newCardPrice, { color: colors.primary }]}>
                {item.price.toFixed(2)}ر
              </Text>
              <View style={styles.newCardRating}>
                <Text style={{ color: colors.primary, fontSize: 11 }}>★</Text>
                <Text style={[styles.newCardRatingText, { color: colors.textMuted }]}>
                  {item.rating}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────
export function HomeScreen({ navigation }) {
  const { user, stars, cartCount, addToCart, notifications, colors, isDark, toggleTheme } = useApp();

  const featured   = MENU_ITEMS.filter((i) => i.isFeatured);
  const newArrivals = MENU_ITEMS.filter((i) => i.isNew);
  const currentTier = REWARDS_TIERS.find((t) => stars >= t.min && stars <= t.max) || REWARDS_TIERS[1];
  const nextTier    = REWARDS_TIERS[REWARDS_TIERS.indexOf(currentTier) + 1];
  const progress    = nextTier
    ? ((stars - currentTier.min) / (nextTier.min - currentTier.min)) * 100
    : 100;

  const scrollY = useRef(new Animated.Value(0)).current;

  // Parallax header glow
  const glowTranslate = scrollY.interpolate({
    inputRange: [0, 160], outputRange: [0, -60], extrapolate: 'clamp',
  });
  const glowOpacity = scrollY.interpolate({
    inputRange: [0, 100], outputRange: [1, 0], extrapolate: 'clamp',
  });

  // Floating reward card
  const floatAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 3200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 3200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const floatY = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -7] });

  // Shimmer loop
  const shimmer = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 2400, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 2400, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const shimmerOpacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.72, 1] });

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
  const heroAnim     = useFadeUp(0);
  const rewardAnim   = useFadeUp(100);
  const quickAnim    = useFadeUp(200);
  const couponAnim   = useFadeUp(280);
  const featuredAnim = useFadeUp(360);

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? 'صباح الخير' : hour < 17 ? 'مساء الخير' : 'مساء النور';

  // Derived theme tokens
  const C = colors;

  return (
    <View style={[styles.root, { backgroundColor: C.background }]}>

      {/* ── Background hero glow ── */}
      <Animated.View
        style={[
          styles.heroBg,
          { opacity: glowOpacity, transform: [{ translateY: glowTranslate }] },
        ]}
        pointerEvents="none"
      >
        <LinearGradient
          colors={
            isDark
              ? ['rgba(197,163,109,0.22)', 'rgba(197,163,109,0.06)', 'transparent']
              : ['rgba(197,163,109,0.16)', 'rgba(253,250,245,0.0)',  'transparent']
          }
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }}
        />
        {/* Second radial accent blob */}
        <LinearGradient
          colors={
            isDark
              ? ['rgba(232,201,122,0.10)', 'transparent']
              : ['rgba(197,163,109,0.12)', 'transparent']
          }
          style={[StyleSheet.absoluteFill, { left: '40%', width: '80%' }]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {/* ══════════════════════════════════════
            HERO SECTION — Premium editorial header
        ══════════════════════════════════════ */}
        <SafeAreaView edges={['top']}>
          <Animated.View style={[styles.hero, heroAnim]}>

            {/* ── Top bar ── */}
            <View style={styles.topBar}>
              {/* Left: action icons */}
              <View style={styles.topBarLeft}>
                <Animated.View style={{ transform: [{ rotate: themeRotate }] }}>
                  <IconBtn
                    name={isDark ? 'sun' : 'moon'}
                    onPress={handleThemeToggle}
                    colors={C} isDark={isDark}
                  />
                </Animated.View>
                <IconBtn
                  name="shopping-bag"
                  onPress={() => navigation.navigate('Cart')}
                  badge={cartCount}
                  colors={C} isDark={isDark}
                />
                <IconBtn
                  name="bell"
                  onPress={() => navigation.navigate('Profile')}
                  badge={notifications}
                  colors={C} isDark={isDark}
                />
              </View>

              {/* Right: greeting */}
              <View style={styles.topBarRight}>
                <Text style={[styles.greetingText, { color: C.textMuted }]}>{greeting}</Text>
                <Text style={[styles.nameText, { color: C.secondary }]}>
                  {user?.name || 'زائر'}
                </Text>
              </View>
            </View>

            {/* ── Hero headline block ── */}
            <View style={styles.heroHeadline}>
              {/* Eyebrow tag */}
              <View style={[
                styles.eyebrowTag,
                {
                  backgroundColor: isDark ? 'rgba(197,163,109,0.12)' : 'rgba(139,99,50,0.08)',
                  borderColor:      isDark ? 'rgba(197,163,109,0.28)' : 'rgba(139,99,50,0.20)',
                },
              ]}
              >
                <View style={[styles.eyebrowDot, { backgroundColor: C.primary }]} />
                <Text style={[styles.eyebrowText, { color: C.primary }]}>
                  SIGNATURE COFFEEHOUSE
                </Text>
              </View>

              {/* Main headline — large, editorial */}
              <Text style={[styles.heroTitle, { color: C.secondary }]}>
                قهوتك{'\n'}
                <Text style={{ color: C.primary }}>الآن</Text>
              </Text>

              {/* Sub-copy */}
              <Text style={[styles.heroSub, { color: C.textMuted }]}>
                اطلب من أي مكان · توصيل خلال ٢٠ دقيقة
              </Text>

              {/* CTA row */}
              <View style={styles.heroCTARow}>
                {/* Primary CTA — pill button-in-button */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('Menu')}
                  activeOpacity={0.88}
                  style={[
                    styles.ctaPrimary,
                    { backgroundColor: C.primary, ...Shadows.gold },
                  ]}
                >
                  <Text style={[styles.ctaPrimaryText, { color: isDark ? '#0A0805' : '#FFFFFF' }]}>
                    اطلب الآن
                  </Text>
                  {/* Nested icon circle */}
                  <View style={[
                    styles.ctaIconCircle,
                    { backgroundColor: isDark ? 'rgba(10,8,5,0.20)' : 'rgba(255,255,255,0.25)' },
                  ]}
                  >
                    <Feather name="arrow-left" size={14} color={isDark ? '#0A0805' : '#FFFFFF'} />
                  </View>
                </TouchableOpacity>

                {/* Secondary CTA — ghost pill */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('Menu')}
                  activeOpacity={0.85}
                  style={[
                    styles.ctaSecondary,
                    {
                      borderColor: isDark ? 'rgba(197,163,109,0.30)' : 'rgba(139,99,50,0.22)',
                    },
                  ]}
                >
                  <Text style={[styles.ctaSecondaryText, { color: C.primary }]}>القائمة</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* ── Bento stats strip ── */}
            <View style={styles.statsStrip}>
              {[
                { value: `${stars}`, unit: '★', label: 'نجومك' },
                { value: '٢٠',      unit: 'د',  label: 'توصيل' },
                { value: '٣',       unit: '',   label: 'كوبونات' },
              ].map((stat, i) => (
                <React.Fragment key={stat.label}>
                  {i > 0 && (
                    <View style={[styles.statDivider, { backgroundColor: isDark ? 'rgba(197,163,109,0.15)' : 'rgba(139,99,50,0.12)' }]} />
                  )}
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: C.secondary }]}>
                      {stat.value}
                      <Text style={{ color: C.primary, fontSize: 14 }}>{stat.unit}</Text>
                    </Text>
                    <Text style={[styles.statLabel, { color: C.textMuted }]}>{stat.label}</Text>
                  </View>
                </React.Fragment>
              ))}
            </View>

          </Animated.View>
        </SafeAreaView>

        {/* ══════════════════════════════════════
            REWARDS CARD — Floating dark card
        ══════════════════════════════════════ */}
        <Animated.View
          style={[
            styles.rewardOuter,
            rewardAnim,
            { transform: [{ translateY: floatY }] },
          ]}
        >
          {/* Outer shell — double-bezel */}
          <View style={[
            styles.rewardShell,
            {
              backgroundColor: isDark ? 'rgba(197,163,109,0.06)' : 'rgba(139,99,50,0.05)',
              borderColor:      isDark ? 'rgba(197,163,109,0.20)' : 'rgba(139,99,50,0.16)',
            },
          ]}
          >
            <Animated.View style={{ opacity: shimmerOpacity }}>
              <LinearGradient
                colors={isDark
                  ? ['#2C1E0A', '#1A1200', '#0E0900']
                  : ['#4A3015', '#3A2410', '#2C1C08']}
                style={styles.rewardInner}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              >
                {/* Top row */}
                <View style={styles.rewardTop}>
                  <TouchableOpacity
                    style={styles.rewardViewBtn}
                    onPress={() => navigation.navigate('Rewards')}
                  >
                    <Feather name="chevron-left" size={13} color={DarkColors.primary} />
                    <Text style={styles.rewardViewBtnText}>عرض</Text>
                  </TouchableOpacity>
                  <View style={styles.rewardTopRight}>
                    <View style={styles.rewardEyebrow}>
                      <Text style={styles.rewardEyebrowText}>SIGNATURE REWARDS</Text>
                    </View>
                    <Text style={[styles.rewardTierText, { color: currentTier.color }]}>
                      ◆ عضو {currentTier.name}
                    </Text>
                  </View>
                </View>

                {/* Stars */}
                <View style={styles.starsRow}>
                  <Text style={styles.starsSuffix}>نجمة ★</Text>
                  <Text style={styles.starsNum}>{stars}</Text>
                </View>

                {/* Progress */}
                {nextTier && (
                  <View>
                    <View style={styles.progressTrack}>
                      <View style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]} />
                    </View>
                    <Text style={styles.progressLabel}>
                      <Text style={{ color: nextTier.color }}>{nextTier.name}</Text>
                      {'  '}للوصول إلى {nextTier.min - stars} نجمة
                    </Text>
                  </View>
                )}
              </LinearGradient>
            </Animated.View>
          </View>
        </Animated.View>

        {/* ══════════════════════════════════════
            QUICK ACTIONS
        ══════════════════════════════════════ */}
        <Animated.View style={[styles.quickActions, quickAnim]}>
          <QuickBtn iconName="message-circle" label="الدردشة"   onPress={() => navigation.navigate('Chat')}    colors={C} isDark={isDark} />
          <QuickBtn iconName="map-pin"        label="الفروع"    onPress={() => {}}                             colors={C} isDark={isDark} />
          <QuickBtn iconName="tag"            label="الكوبونات" onPress={() => navigation.navigate('Coupons')} colors={C} isDark={isDark} />
          <QuickBtn iconName="package"        label="اطلب الآن" onPress={() => navigation.navigate('Menu')}   colors={C} isDark={isDark} />
        </Animated.View>

        {/* ══════════════════════════════════════
            COUPON BANNER
        ══════════════════════════════════════ */}
        <Animated.View style={couponAnim}>
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
              <Feather name="chevron-left" size={18} color="rgba(255,255,255,0.45)" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* ══════════════════════════════════════
            FEATURED — "مختارات اليوم"
        ══════════════════════════════════════ */}
        <Animated.View style={featuredAnim}>
          <View style={styles.sectionHeader}>
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
            contentContainerStyle={styles.featuredList}
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
        <View style={[
          styles.deliveryCard,
          {
            backgroundColor: C.cardBg,
            borderColor:      C.cardBorder,
          },
        ]}
        >
          <View style={styles.deliveryCardInner}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Menu')}
              activeOpacity={0.88}
              style={[styles.orderNowBtn, { backgroundColor: C.primary, ...Shadows.gold }]}
            >
              <Text style={[styles.orderNowText, { color: isDark ? '#0A0805' : '#FFFFFF' }]}>
                اطلب الآن
              </Text>
            </TouchableOpacity>
            <View style={styles.deliveryRight}>
              <Text style={[styles.deliveryTitle, { color: C.secondary }]}>توصيل سريع</Text>
              <View style={styles.etaRow}>
                <Feather name="zap" size={12} color={C.primary} />
                <Text style={[styles.deliveryEta, { color: C.primary }]}> ١٨–٢٥ دقيقة</Text>
              </View>
              <Text style={[styles.deliverySub, { color: C.textMuted }]}>بناءً على عنوانك المحفوظ</Text>
            </View>
          </View>
        </View>

        {/* ══════════════════════════════════════
            NEW ARRIVALS — "وصل حديثاً"
        ══════════════════════════════════════ */}
        <View style={[styles.sectionHeader, { marginTop: Spacing.md }]}>
          <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
            <Text style={[styles.seeAll, { color: C.primary }]}>عرض الكل</Text>
          </TouchableOpacity>
          <Text style={[styles.sectionTitle, { color: C.secondary }]}>وصل حديثاً</Text>
        </View>

        <FlatList
          data={newArrivals}
          keyExtractor={(i) => i.id}
          horizontal
          inverted
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: Spacing.lg, gap: 14, marginBottom: Spacing.lg }}
          renderItem={({ item }) => (
            <NewArrivalCard
              item={item}
              colors={C}
              isDark={isDark}
              onPress={() => navigation.navigate('ItemDetail', { item })}
              onAddToCart={addToCart}
            />
          )}
        />

        <View style={{ height: 100 }} />
      </Animated.ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root:   { flex: 1 },
  scroll: { paddingHorizontal: Spacing.lg },

  // ── Background glow ──
  heroBg: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 320,
    pointerEvents: 'none',
  },

  // ── Hero ──
  hero: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
  },

  // Top bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Spacing.lg,
  },
  topBarLeft:  { flexDirection: 'row', gap: 10 },
  topBarRight: { alignItems: 'flex-end' },
  greetingText: {
    fontSize: Typography.xs, letterSpacing: 1.5, marginBottom: 2, textAlign: 'right',
  },
  nameText: {
    fontSize: Typography.xl, fontWeight: Typography.black,
    letterSpacing: Typography.tight, textAlign: 'right',
  },

  iconBtn: {
    width: 42, height: 42, borderRadius: 21,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  badge: {
    position: 'absolute', top: -3, right: -3,
    minWidth: 17, height: 17, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3,
  },
  badgeText: { fontSize: 9, fontWeight: Typography.bold },

  // Hero headline
  heroHeadline: { marginBottom: Spacing.lg },

  eyebrowTag: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    alignSelf: 'flex-end',
    borderWidth: 1, borderRadius: Radii.pill,
    paddingHorizontal: 12, paddingVertical: 5, marginBottom: 16,
  },
  eyebrowDot:  { width: 5, height: 5, borderRadius: 3 },
  eyebrowText: { fontSize: 9, letterSpacing: 2.5, fontWeight: Typography.semibold },

  heroTitle: {
    fontSize: 52, fontWeight: Typography.black,
    lineHeight: 58, textAlign: 'right', letterSpacing: -1.5,
    marginBottom: 12,
  },
  heroSub: {
    fontSize: Typography.sm, textAlign: 'right',
    letterSpacing: 0.3, marginBottom: 24, lineHeight: 20,
  },

  // CTA row
  heroCTARow: {
    flexDirection: 'row', justifyContent: 'flex-end',
    alignItems: 'center', gap: 12,
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
    borderRadius: Radii.xl, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(197,163,109,0.14)',
    backgroundColor: 'rgba(197,163,109,0.04)',
    paddingVertical: 14,
  },
  statItem:    { flex: 1, alignItems: 'center' },
  statValue:   { fontSize: Typography['2xl'], fontWeight: Typography.black, letterSpacing: -1 },
  statLabel:   { fontSize: Typography.xs, letterSpacing: 1, marginTop: 2 },
  statDivider: { width: 1, height: 32 },

  // ── Reward card ──
  rewardOuter: { marginBottom: Spacing.lg },
  rewardShell: {
    borderRadius: Radii['2xl'], borderWidth: 1, padding: 2,
  },
  rewardInner: { borderRadius: Radii.xl - 2, padding: Spacing.lg },
  rewardTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 10,
  },
  rewardTopRight: { alignItems: 'flex-end' },
  rewardEyebrow: {
    backgroundColor: 'rgba(197,163,109,0.18)', borderRadius: Radii.pill,
    paddingHorizontal: 10, paddingVertical: 3, marginBottom: 5,
  },
  rewardEyebrowText: {
    color: '#C5A36D', fontSize: 8, letterSpacing: 3, fontWeight: Typography.bold,
  },
  rewardTierText: { fontSize: Typography.md, fontWeight: Typography.bold, textAlign: 'right' },
  rewardViewBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(197,163,109,0.16)', borderRadius: Radii.pill,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  rewardViewBtnText: { color: '#C5A36D', fontSize: Typography.sm, fontWeight: Typography.semibold },
  starsRow: {
    flexDirection: 'row', alignItems: 'baseline',
    justifyContent: 'flex-end', marginBottom: 14,
  },
  starsNum: {
    color: '#C5A36D', fontSize: Typography['4xl'],
    fontWeight: Typography.black, letterSpacing: -2,
  },
  starsSuffix: { color: '#D4B98A', fontSize: Typography.lg, fontWeight: Typography.medium },
  progressTrack: {
    height: 4, backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 2, marginBottom: 7, overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#C5A36D', borderRadius: 2 },
  progressLabel: { color: 'rgba(255,255,255,0.45)', fontSize: Typography.xs, textAlign: 'right' },

  // ── Quick actions ──
  quickActions: {
    flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.lg,
  },
  quickBtn:      { alignItems: 'center', gap: 8 },
  quickBtnIcon: {
    width: 58, height: 58, borderRadius: Radii.lg,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  quickBtnLabel: { fontSize: Typography.xs, fontWeight: Typography.medium },

  // ── Coupon banner ──
  couponBanner: { borderRadius: Radii.xl, overflow: 'hidden', marginBottom: Spacing.lg },
  couponBannerInner: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, gap: 12,
  },
  couponIconWrap: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(197,163,109,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  couponTitle: {
    color: '#F2EDE4', fontSize: Typography.base,
    fontWeight: Typography.semibold, textAlign: 'right',
  },
  couponSub: {
    color: 'rgba(242,237,228,0.6)', fontSize: Typography.xs,
    marginTop: 2, textAlign: 'right',
  },

  // ── Section headers ──
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 14,
  },
  sectionTitle: {
    fontSize: Typography.lg, fontWeight: Typography.bold, textAlign: 'right',
  },
  seeAll: { fontSize: Typography.sm, fontWeight: Typography.medium },
  featuredList: { paddingRight: Spacing.lg, gap: 12, marginBottom: Spacing.lg },

  // ── Delivery card ──
  deliveryCard: {
    borderRadius: Radii.xl, borderWidth: 1, padding: 2, marginBottom: Spacing.lg,
  },
  deliveryCardInner: {
    borderRadius: Radii.lg, padding: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  deliveryRight:  { flex: 1, alignItems: 'flex-end' },
  deliveryTitle:  { fontSize: Typography.md, fontWeight: Typography.bold, marginBottom: 4, textAlign: 'right' },
  etaRow:         { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  deliveryEta:    { fontSize: Typography.sm, fontWeight: Typography.semibold },
  deliverySub:    { fontSize: Typography.xs, textAlign: 'right' },
  orderNowBtn: {
    borderRadius: Radii.pill, paddingHorizontal: 20, paddingVertical: 12,
  },
  orderNowText: { fontSize: Typography.sm, fontWeight: Typography.bold, letterSpacing: 0.4 },

  // ── New arrivals ──
  newCard: {
    width: 220, borderRadius: Radii.xl, borderWidth: 1, overflow: 'hidden',
  },
  newCardImageWrap: { width: '100%', height: 132, overflow: 'hidden' },
  newCardImage:     { width: '100%', height: '100%' },
  newCardOverlay:   { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  newCardTags: {
    position: 'absolute', top: 10, left: 10,
    flexDirection: 'row', gap: 6,
  },
  newCardTag: { borderRadius: Radii.sm, paddingHorizontal: 8, paddingVertical: 3 },
  newCardTagText: {
    color: '#FFF', fontSize: 9, fontWeight: Typography.bold,
    letterSpacing: 1, textTransform: 'uppercase',
  },
  newCardContent: { padding: 14 },
  newCardName: {
    fontSize: Typography.base, fontWeight: Typography.bold,
    marginBottom: 4, textAlign: 'right',
  },
  newCardDesc: {
    fontSize: Typography.xs, marginBottom: 10,
    textAlign: 'right', lineHeight: 16,
  },
  newCardFooter: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  newCardPriceRow: { alignItems: 'flex-end' },
  newCardPrice:    { fontSize: Typography.md, fontWeight: Typography.bold },
  newCardRating:   { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  newCardRatingText: { fontSize: 10 },
  newCardAddBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
});
