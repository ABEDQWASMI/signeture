import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, FlatList, Animated, Easing, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Icon from '../components/Icon';
import { Colors, Typography, Radii, Spacing, Shadows } from '../constants/theme';
import { MenuCard } from '../components/MenuCard';
import { useApp } from '../context/AppContext';
import { MENU_ITEMS, COUPONS, REWARDS_TIERS } from '../constants/data';

// ─── Animated entrance helper ─────────────────────────────────────────────
function useFadeUp(delay = 0) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1, duration: 700, delay,
        easing: Easing.bezier(0.32, 0.72, 0, 1), useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0, duration: 700, delay,
        easing: Easing.bezier(0.32, 0.72, 0, 1), useNativeDriver: true,
      }),
    ]).start();
  }, []);
  return { opacity, transform: [{ translateY }] };
}

// ─── Hook for scroll-triggered animations ────────────────────────────────
function useScrollTrigger(triggerRef) {
  const scale = useRef(new Animated.Value(0.95)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const handleScroll = () => {
    if (triggerRef?.current) {
      triggerRef.current.measureInWindow((x, y, width, height) => {
        const screenHeight = 800;
        if (y < screenHeight && y > -height) {
          Animated.parallel([
            Animated.timing(opacity, {
              toValue: 1, duration: 500, useNativeDriver: true,
            }),
            Animated.spring(scale, {
              toValue: 1, damping: 8, stiffness: 120, useNativeDriver: true,
            }),
          ]).start();
        }
      });
    }
  };

  return { scale, opacity, handleScroll };
}

// ─── Enhanced Quick action button with complex animations ────────────────
function QuickBtn({ iconName, label, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const rotateSpin = useRef(new Animated.Value(0)).current;
  const bgOpacity = useRef(new Animated.Value(0.05)).current;

  const handlePress = () => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 0.88, damping: 14, stiffness: 280, useNativeDriver: true }),
      Animated.timing(rotateSpin, {
        toValue: 1, duration: 400, easing: Easing.bezier(0.32, 0.72, 0, 1), useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, damping: 10, stiffness: 300, useNativeDriver: true }),
        Animated.timing(rotateSpin, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    });
    onPress?.();
  };

  const spinInterpolate = rotateSpin.interpolate({
    inputRange: [0, 1], outputRange: ['0deg', '10deg'],
  });

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={() => {
          Animated.parallel([
            Animated.timing(bgOpacity, { toValue: 0.12, duration: 150, useNativeDriver: true }),
          ]).start();
        }}
        onPressOut={() => {
          Animated.timing(bgOpacity, { toValue: 0.05, duration: 150, useNativeDriver: true }).start();
        }}
        activeOpacity={1}
        style={styles.quickBtn}
      >
        <Animated.View style={[
          styles.quickBtnIcon,
          {
            transform: [{ rotate: spinInterpolate }],
            opacity: Animated.add(bgOpacity, 0.95),
          },
        ]}
        >
          <Icon name={iconName} size={22} color={Colors.primary} />
        </Animated.View>
        <Text style={styles.quickBtnLabel}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────
export function HomeScreen({ navigation }) {
  const { user, stars, cartCount, addToCart, notifications, colors, isDark, toggleTheme } = useApp();
  const featured = MENU_ITEMS.filter((i) => i.isFeatured);
  const newArrivals = MENU_ITEMS.filter((i) => i.isNew);
  const currentTier = REWARDS_TIERS.find((t) => stars >= t.min && stars <= t.max) || REWARDS_TIERS[1];
  const nextTier = REWARDS_TIERS[REWARDS_TIERS.indexOf(currentTier) + 1];
  const progress = nextTier
    ? ((stars - currentTier.min) / (nextTier.min - currentTier.min)) * 100
    : 100;

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerParallax = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -50],
  });

  // Scroll-triggered animations for sections
  const rewardScaleTrigger = useRef(null);
  const couponScaleTrigger = useRef(null);
  const deliveryScaleTrigger = useRef(null);

  const rewardAnimations = useScrollTrigger(rewardScaleTrigger);
  const couponAnimations = useScrollTrigger(couponScaleTrigger);
  const deliveryAnimations = useScrollTrigger(deliveryScaleTrigger);

  const handleScroll = () => {
    rewardAnimations.handleScroll();
    couponAnimations.handleScroll();
    deliveryAnimations.handleScroll();
  };

  const headerAnim   = useFadeUp(0);
  const rewardAnim   = useFadeUp(80);
  const quickAnim    = useFadeUp(160);
  const couponAnim   = useFadeUp(220);
  const featuredAnim = useFadeUp(300);

  // Shimmer on reward card
  const shimmer = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const shimmerOpacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] });

  // Floating animation for reward card
  const floatAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const floatTranslate = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'صباح الخير' : hour < 17 ? 'مساء الخير' : 'مساء النور';

  return (
    <View style={[styles.root, { backgroundColor: '#FFFFFF' }]}>
      {/* Ethereal Glass Background */}
      <LinearGradient
        colors={['rgba(197,163,109,0.08)', 'rgba(138,43,226,0.05)', 'transparent']}
        style={styles.glassBg}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      />
      <View style={styles.radialOrb1} />
      <View style={styles.radialOrb2} />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false, listener: () => handleScroll() }
        )}
      >

        {/* ── Header ── */}
        <SafeAreaView>
          <Animated.View style={[styles.header, headerAnim]}>
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={[styles.iconBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }]}
                onPress={toggleTheme}
              >
                <Icon name={isDark ? 'sun' : 'moon'} size={19} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.iconBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }]}
                onPress={() => navigation.navigate('Cart')}
              >
                <Icon name="shopping-bag" size={19} color={colors.secondary} />
                {cartCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{cartCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.iconBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }]}
                onPress={() => navigation.navigate('Profile')}
              >
                <Icon name="bell" size={19} color={colors.secondary} />
                {notifications > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{notifications}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.headerLeft}>
              <Text style={[styles.greeting, { color: colors.textMuted }]}>{greeting} ✦</Text>
              <Text style={[styles.name, { color: colors.secondary }]}>{user?.name || 'زائر'}</Text>
            </View>
          </Animated.View>
        </SafeAreaView>

        {/* ── Rewards Card ── */}
        <Animated.View
          ref={rewardScaleTrigger}
          style={[
            styles.rewardOuter,
            rewardAnim,
            {
              opacity: rewardAnimations.opacity,
              transform: [
                { scale: rewardAnimations.scale },
                { translateY: floatTranslate },
              ],
            },
          ]}
        >
          <Animated.View style={{ opacity: shimmerOpacity }}>
            <LinearGradient
              colors={['#2A1E0A', '#1A1200', '#0D0900']}
              style={styles.rewardInner}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            >
              <View style={styles.rewardTop}>
                <TouchableOpacity
                  style={styles.rewardDetailsBtn}
                  onPress={() => navigation.navigate('Rewards')}
                >
                  <Icon name="chevron-left" size={14} color={Colors.primary} />
                  <Text style={styles.rewardDetailsBtnText}>عرض</Text>
                </TouchableOpacity>
                <View>
                  <View style={styles.eyebrow}>
                    <Text style={styles.eyebrowText}>SIGNATURE REWARDS</Text>
                  </View>
                  <Text style={styles.rewardTier}>
                    <Text style={{ color: currentTier.color }}>◆ </Text>
                    عضو {currentTier.name}
                  </Text>
                </View>
              </View>

              <View style={styles.starsRow}>
                <Text style={styles.starsSuffix}>نجمة ★ </Text>
                <Text style={styles.starsNum}>{stars}</Text>
              </View>

              {nextTier && (
                <View>
                  <View style={styles.progressTrack}>
                    <Animated.View style={[styles.progressFill, { width: `${progress}%` }]} />
                  </View>
                  <Text style={styles.progressLabel}>
                    <Text style={{ color: nextTier.color }}>{nextTier.name}</Text>
                    {' '}للوصول إلى {nextTier.min - stars} نجمة أخرى
                  </Text>
                </View>
              )}
            </LinearGradient>
          </Animated.View>
        </Animated.View>

        {/* ── Quick Actions ── */}
        <Animated.View style={[styles.quickActions, quickAnim]}>
          <QuickBtn iconName="message-circle" label="الدردشة"   onPress={() => navigation.navigate('Chat')} />
          <QuickBtn iconName="map-pin"        label="الفروع"    onPress={() => navigation.navigate('Map')} />
          <QuickBtn iconName="tag"            label="الكوبونات" onPress={() => navigation.navigate('Coupons')} />
          <QuickBtn iconName="package"        label="اطلب الآن" onPress={() => navigation.navigate('Menu')} />
        </Animated.View>

        {/* ── Active Coupon Banner ── */}
        <Animated.View
          ref={couponScaleTrigger}
          style={[
            couponAnim,
            {
              opacity: couponAnimations.opacity,
              transform: [{ scale: couponAnimations.scale }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.couponBanner}
            onPress={() => navigation.navigate('Coupons')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#3D2B1F', '#5A3D2A']}
              style={styles.couponBannerInner}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            >
              <Icon name="chevron-left" size={22} color={Colors.primaryLight} />
              <View style={{ flex: 1 }}>
                <Text style={styles.couponBannerTitle}>لديك 3 كوبونات نشطة</Text>
                <Text style={styles.couponBannerSub}>اضغط لعرض خصوماتك واسترداد المكافآت</Text>
              </View>
              <View style={styles.couponIconWrap}>
                <Icon name="gift" size={22} color={Colors.primary} />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* ── Featured Items ── */}
        <Animated.View style={featuredAnim}>
          <View style={styles.sectionHeader}>
            <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
              <Text style={styles.seeAll}>عرض الكل</Text>
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>مختارات اليوم</Text>
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

        {/* ── Delivery Estimator ── */}
        <Animated.View
          ref={deliveryScaleTrigger}
          style={[
            {
              opacity: deliveryAnimations.opacity,
              transform: [{ scale: deliveryAnimations.scale }],
            },
          ]}
        >
          <View style={styles.deliveryCard}>
            <View style={styles.deliveryCardInner}>
              <TouchableOpacity
                style={styles.orderNowBtn}
                onPress={() => navigation.navigate('Menu')}
                activeOpacity={0.8}
              >
                <Text style={styles.orderNowText}>اطلب الآن</Text>
              </TouchableOpacity>
              <View style={styles.deliveryLeft}>
                <Text style={styles.deliveryTitle}>توصيل سريع</Text>
                <View style={styles.etaRow}>
                  <Icon name="zap" size={13} color={Colors.primary} />
                  <Text style={styles.deliveryEta}> ١٨–٢٥ دقيقة</Text>
                </View>
                <Text style={styles.deliverySub}>بناءً على عنوانك المحفوظ</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* ── New Arrivals (Horizontal carousel with large cards) ── */}
        <View style={[styles.sectionHeader, { marginTop: Spacing.md }]}>
          <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>عرض الكل</Text>
          </TouchableOpacity>
          <Text style={[styles.sectionTitle, { color: colors.secondary }]}>وصل حديثاً</Text>
        </View>

        <FlatList
          data={newArrivals}
          keyExtractor={(i) => i.id}
          horizontal
          inverted
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: Spacing.lg, gap: 14, marginBottom: Spacing.lg }}
          renderItem={({ item }) => (
            <NewArrivalCard item={item} colors={colors} onPress={() => navigation.navigate('ItemDetail', { item })} onAddToCart={addToCart} />
          )}
        />

        <View style={{ height: 100 }} />
      </Animated.ScrollView>
    </View>
  );
}

// ─── Enhanced New Arrival Card Component ────────────────────────────────
function NewArrivalCard({ item, colors, onPress, onAddToCart }) {
  const scale = useRef(new Animated.Value(1)).current;
  const imageScale = useRef(new Animated.Value(1)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const handleCardPress = () => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 0.96, damping: 14, stiffness: 300, useNativeDriver: true }),
    ]).start(() => {
      Animated.spring(scale, { toValue: 1, damping: 12, stiffness: 280, useNativeDriver: true }).start();
    });
    onPress?.();
  };

  const handleImageHover = () => {
    Animated.spring(imageScale, { toValue: 1.08, damping: 12, stiffness: 200, useNativeDriver: true }).start();
  };

  const handleImageLeave = () => {
    Animated.spring(imageScale, { toValue: 1, damping: 12, stiffness: 200, useNativeDriver: true }).start();
  };

  const handleAddPress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.85, duration: 100, useNativeDriver: true }),
      Animated.spring(buttonScale, { toValue: 1, damping: 10, stiffness: 300, useNativeDriver: true }),
    ]).start();
    onAddToCart?.(item);
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={handleCardPress}
        onPressIn={handleImageHover}
        onPressOut={handleImageLeave}
        activeOpacity={0.95}
        style={[styles.newCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
      >
        <Animated.View style={[
          styles.newCardImageWrap,
          { transform: [{ scale: imageScale }] },
        ]}
        >
          <Image
            source={{ uri: item.image }}
            style={styles.newCardImage}
            resizeMode="cover"
          />
          {/* Image overlay gradient */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)']}
            style={styles.newCardImageOverlay}
          />
          {/* Tags */}
          <View style={styles.newCardTags}>
            {item.tags.slice(0, 2).map((tag) => (
              <View key={tag} style={styles.newCardTag}>
                <Text style={styles.newCardTagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
        <View style={styles.newCardContent}>
          <Text style={[styles.newCardName, { color: colors.secondary }]} numberOfLines={1}>{item.name}</Text>
          <Text style={[styles.newCardDesc, { color: colors.textMuted }]} numberOfLines={2}>{item.description}</Text>
          <View style={styles.newCardFooter}>
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity
                onPress={handleAddPress}
                style={styles.newCardAddBtn}
              >
                <Icon name="plus" size={16} color={colors.background} />
              </TouchableOpacity>
            </Animated.View>
            <View style={styles.newCardPriceRow}>
              <Text style={[styles.newCardPrice, { color: colors.primary }]}>{item.price.toFixed(2)}ر</Text>
              <View style={styles.newCardRating}>
                <Text style={{ color: Colors.primary, fontSize: 12 }}>★</Text>
                <Text style={[styles.newCardRatingText, { color: colors.textMuted }]}>{item.rating} ({item.reviews.toLocaleString()})</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl * 3, paddingBottom: Spacing.xl * 2 },
  glassBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  radialOrb1: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
    shadowColor: '#8A2BE2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 50,
  },
  radialOrb2: {
    position: 'absolute',
    top: '60%',
    right: '15%',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(46, 204, 113, 0.08)',
    shadowColor: '#2ECC71',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 40,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl * 2,
  },
  headerLeft: { alignItems: 'flex-end' },
  headerRight: { flexDirection: 'row', gap: 10 },
  greeting: {
    color: Colors.textMuted,
    fontSize: Typography.sm,
    marginBottom: 2,
    textAlign: 'right',
  },
  name: {
    color: Colors.secondary,
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    letterSpacing: Typography.tight,
    textAlign: 'right',
  },
  iconBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  badge: {
    position: 'absolute', top: -2, right: -2,
    minWidth: 18, height: 18, borderRadius: 9,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: Colors.background, fontSize: 9, fontWeight: Typography.bold },

  rewardOuter: {
    borderRadius: Radii['3xl'],
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 3,
    marginBottom: Spacing.xl * 2,
    shadowColor: '#C5A36D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  rewardInner: {
    borderRadius: Radii['2xl'],
    backgroundColor: 'rgba(42, 30, 10, 0.95)',
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(197, 163, 109, 0.2)',
  },
  rewardTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 12,
  },
  eyebrow: {
    backgroundColor: 'rgba(197,163,109,0.15)',
    borderRadius: Radii.pill,
    paddingHorizontal: 10, paddingVertical: 3,
    alignSelf: 'flex-end', marginBottom: 6,
  },
  eyebrowText: {
    color: Colors.primary, fontSize: 9,
    letterSpacing: 3, fontWeight: Typography.medium,
  },
  rewardTier: {
    color: Colors.secondary,
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    textAlign: 'right',
  },
  rewardDetailsBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(197,163,109,0.15)',
    borderRadius: Radii.pill,
    paddingHorizontal: 14, paddingVertical: 7,
  },
  rewardDetailsBtnText: {
    color: Colors.primary, fontSize: Typography.sm, fontWeight: Typography.semibold,
  },
  starsRow: {
    flexDirection: 'row', alignItems: 'baseline',
    marginBottom: 14, justifyContent: 'flex-end',
  },
  starsNum: {
    color: Colors.primary, fontSize: Typography['4xl'],
    fontWeight: Typography.black, letterSpacing: -2,
  },
  starsSuffix: {
    color: Colors.primaryLight, fontSize: Typography.xl, fontWeight: Typography.medium,
  },
  progressTrack: {
    height: 5, backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3, marginBottom: 8, overflow: 'hidden',
  },
  progressFill: {
    height: '100%', backgroundColor: Colors.primary, borderRadius: 3,
  },
  progressLabel: {
    color: Colors.textMuted, fontSize: Typography.xs, textAlign: 'right',
  },

  quickActions: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginBottom: Spacing.xl * 2,
  },
  quickBtn: { alignItems: 'center', gap: 8 },
  quickBtnIcon: {
    width: 60, height: 60, borderRadius: Radii.lg,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  quickBtnLabel: {
    color: Colors.textMuted, fontSize: Typography.xs, fontWeight: Typography.medium,
  },

  couponBanner: {
    borderRadius: Radii['3xl'],
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 2,
    marginBottom: Spacing.xl * 2,
    overflow: 'hidden',
  },
  couponBannerInner: {
    borderRadius: Radii['2xl'],
    padding: 16,
    gap: 12,
  },
  couponBannerTitle: {
    color: Colors.secondary, fontSize: Typography.base,
    fontWeight: Typography.semibold, textAlign: 'right',
  },
  couponBannerSub: {
    color: Colors.textMuted, fontSize: Typography.xs,
    marginTop: 2, textAlign: 'right',
  },
  couponIconWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(197,163,109,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },

  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: Spacing.xl,
  },
  sectionTitle: {
    color: Colors.secondary, fontSize: Typography.lg,
    fontWeight: Typography.bold, textAlign: 'right',
  },
  seeAll: {
    color: Colors.primary, fontSize: Typography.sm, fontWeight: Typography.medium,
  },
  featuredList: { paddingRight: Spacing.lg, gap: 12, marginBottom: Spacing.xl * 2 },

  deliveryCard: {
    borderRadius: Radii['3xl'],
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 2,
    marginBottom: Spacing.xl * 2,
  },
  deliveryCardInner: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: Radii['2xl'],
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(197,163,109,0.15)',
  },
  deliveryLeft: { flex: 1, alignItems: 'flex-end' },
  deliveryTitle: {
    color: Colors.secondary, fontSize: Typography.md,
    fontWeight: Typography.bold, marginBottom: 4, textAlign: 'right',
  },
  etaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  deliveryEta: {
    color: Colors.primary, fontSize: Typography.sm, fontWeight: Typography.semibold,
  },
  deliverySub: {
    color: Colors.textMuted, fontSize: Typography.xs, textAlign: 'right',
  },
  orderNowBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radii.pill,
    paddingHorizontal: 18, paddingVertical: 10,
    ...Shadows.gold,
  },
  orderNowText: {
    color: Colors.background, fontSize: Typography.sm,
    fontWeight: Typography.bold, letterSpacing: 0.5,
  },

  newCard: {
    width: 220,
    borderRadius: Radii['2xl'],
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 2,
    overflow: 'hidden',
  },
  newCardImageWrap: {
    width: '100%',
    height: 130,
    backgroundColor: 'rgba(0,0,0,0.2)',
    overflow: 'hidden',
  },
  newCardImage: {
    width: '100%',
    height: '100%',
  },
  newCardImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  newCardTags: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    gap: 6,
  },
  newCardTag: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: Radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  newCardTagText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: Typography.bold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  newCardContent: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: Radii.xl,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  newCardName: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    marginBottom: 4,
    textAlign: 'right',
  },
  newCardDesc: {
    fontSize: Typography.xs,
    marginBottom: 10,
    textAlign: 'right',
    lineHeight: 16,
  },
  newCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newCardPriceRow: {
    alignItems: 'flex-end',
  },
  newCardPrice: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
  },
  newCardRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  newCardRatingText: {
    fontSize: 10,
  },
  newCardAddBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.gold,
  },
});
