import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Image, TouchableOpacity, Animated, Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Typography, Radii, Spacing, Shadows } from '../constants/theme';
import { useApp } from '../context/AppContext';

const SIZES  = [
  { key: 'صغير',  label: 'صغير',  price: -0.50, icon: 'S' },
  { key: 'وسط',   label: 'وسط',   price: 0,     icon: 'M' },
  { key: 'كبير',  label: 'كبير',  price: +0.75, icon: 'L' },
];
const MILKS  = ['كامل', 'شوفان', 'لوز', 'صويا', 'جوز هند'];
const EXTRAS = ['جرعة إضافية', 'فانيليا', 'كراميل', 'رغوة الشوفان'];

const EASE = Easing.bezier(0.22, 1, 0.36, 1);

export function ItemDetailScreen({ route, navigation }) {
  const { item } = route.params;
  const { addToCart, colors, isDark } = useApp();
  const C = colors;

  const [selectedSize,   setSelectedSize]   = useState('وسط');
  const [selectedMilk,   setSelectedMilk]   = useState('شوفان');
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [qty,            setQty]            = useState(1);
  const [rating,         setRating]         = useState(0);
  const [liked,          setLiked]          = useState(false);

  const heroScale  = useRef(new Animated.Value(1)).current;
  const fadeIn     = useRef(new Animated.Value(0)).current;
  const heartScale = useRef(new Animated.Value(1)).current;
  const btnScale   = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeIn, { toValue: 1, duration: 600, easing: EASE, useNativeDriver: true }).start();
  }, []);

  const toggleExtra = (e) =>
    setSelectedExtras((prev) =>
      prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]
    );

  const sizeCost  = SIZES.find((s) => s.key === selectedSize)?.price ?? 0;
  const extraCost = selectedExtras.length * 0.75;
  const unitPrice = item.price + sizeCost + extraCost;
  const total     = (unitPrice * qty).toFixed(2);

  const handleAdd = () => {
    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.94, duration: 80, useNativeDriver: true }),
      Animated.spring(btnScale, { toValue: 1, damping: 12, stiffness: 300, useNativeDriver: true }),
    ]).start();
    addToCart({ ...item, selectedSize, selectedMilk, selectedExtras }, qty);
    navigation.goBack();
  };

  const handleLike = () => {
    setLiked((v) => !v);
    Animated.sequence([
      Animated.spring(heartScale, { toValue: 1.4, damping: 10, stiffness: 300, useNativeDriver: true }),
      Animated.spring(heartScale, { toValue: 1,   damping: 12, stiffness: 260, useNativeDriver: true }),
    ]).start();
  };

  return (
    <View style={[styles.root, { backgroundColor: C.background }]}>

      {/* ── Hero image ── */}
      <View style={styles.heroWrap}>
        <Animated.View style={{ transform: [{ scale: heroScale }], flex: 1 }}>
          <Image source={{ uri: item.image }} style={styles.heroImg} resizeMode="cover" />
        </Animated.View>
        <LinearGradient
          colors={['transparent', C.background]}
          style={styles.heroGrad}
        />

        {/* Back button */}
        <TouchableOpacity
          style={[styles.navBtn, {
            backgroundColor: isDark ? 'rgba(10,8,5,0.65)' : 'rgba(255,255,255,0.80)',
            borderColor:      isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)',
          }]}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-right" size={19} color={C.secondary} />
        </TouchableOpacity>

        {/* Like button */}
        <Animated.View style={[styles.likeBtn, { transform: [{ scale: heartScale }] }]}>
          <TouchableOpacity
            onPress={handleLike}
            style={[styles.navBtn, {
              backgroundColor: isDark ? 'rgba(10,8,5,0.65)' : 'rgba(255,255,255,0.80)',
              borderColor:      isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)',
            }]}
          >
            <Feather name="heart" size={18} color={liked ? '#E53935' : C.secondary} />
          </TouchableOpacity>
        </Animated.View>

        {/* Tag pills */}
        <View style={styles.tagRow}>
          {item.tags.map((t) => (
            <View key={t} style={[styles.tag, { backgroundColor: C.primary }]}>
              <Text style={[styles.tagText, { color: isDark ? '#0A0805' : '#FFF' }]}>{t}</Text>
            </View>
          ))}
        </View>
      </View>

      <Animated.ScrollView
        style={{ opacity: fadeIn }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={styles.content}>

          {/* Title + meta */}
          <Text style={[styles.name, { color: C.secondary }]}>{item.name}</Text>
          <View style={styles.metaRow}>
            <View style={styles.ratingPill}>
              <Text style={[styles.ratingText, { color: C.primary }]}>★ {item.rating}</Text>
            </View>
            <Text style={[styles.reviews, { color: C.textMuted }]}>({item.reviews.toLocaleString()} تقييم)</Text>
            <View style={[styles.dot, { backgroundColor: C.textSubtle }]} />
            <Feather name="zap" size={12} color={C.textMuted} />
            <Text style={[styles.calories, { color: C.textMuted }]}>{item.calories} cal</Text>
          </View>
          <Text style={[styles.desc, { color: C.textMuted }]}>{item.description}</Text>

          {/* ── Size selector ── */}
          <Text style={[styles.sectionLabel, { color: C.secondary }]}>الحجم</Text>
          <View style={styles.sizeRow}>
            {SIZES.map((s) => {
              const isActive = selectedSize === s.key;
              return (
                <TouchableOpacity
                  key={s.key}
                  onPress={() => setSelectedSize(s.key)}
                  style={[
                    styles.sizeChip,
                    {
                      backgroundColor: isActive ? C.primary : (isDark ? 'rgba(197,163,109,0.07)' : 'rgba(139,99,50,0.05)'),
                      borderColor:     isActive ? C.primary : (isDark ? 'rgba(197,163,109,0.18)' : 'rgba(139,99,50,0.14)'),
                    },
                  ]}
                >
                  <Text style={[styles.sizeLetter, { color: isActive ? (isDark ? '#0A0805' : '#FFF') : C.primary }]}>
                    {s.icon}
                  </Text>
                  <Text style={[styles.sizeLabel, { color: isActive ? (isDark ? '#0A0805' : '#FFF') : C.secondary }]}>
                    {s.label}
                  </Text>
                  {s.price !== 0 && (
                    <Text style={[styles.sizePrice, { color: isActive ? (isDark ? 'rgba(10,8,5,0.6)' : 'rgba(255,255,255,0.7)') : C.textMuted }]}>
                      {s.price > 0 ? `+${s.price}` : s.price}ر
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ── Milk selector ── */}
          <Text style={[styles.sectionLabel, { color: C.secondary }]}>نوع الحليب</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.lg }}>
            <View style={styles.pillRow}>
              {MILKS.map((m) => {
                const isActive = selectedMilk === m;
                return (
                  <TouchableOpacity
                    key={m}
                    onPress={() => setSelectedMilk(m)}
                    style={[
                      styles.optionPill,
                      {
                        backgroundColor: isActive ? 'rgba(197,163,109,0.15)' : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'),
                        borderColor:     isActive ? C.primary : (isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)'),
                      },
                    ]}
                  >
                    <Text style={[styles.optionPillText, { color: isActive ? C.primary : C.textMuted }]}>{m}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* ── Extras ── */}
          <Text style={[styles.sectionLabel, { color: C.secondary }]}>
            إضافات <Text style={{ color: C.textMuted, fontWeight: Typography.regular }}>+0.75ر لكل</Text>
          </Text>
          <View style={styles.extrasGrid}>
            {EXTRAS.map((e) => {
              const isActive = selectedExtras.includes(e);
              return (
                <TouchableOpacity
                  key={e}
                  onPress={() => toggleExtra(e)}
                  style={[
                    styles.extraChip,
                    {
                      backgroundColor: isActive ? 'rgba(197,163,109,0.12)' : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'),
                      borderColor:     isActive ? C.primary : (isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)'),
                    },
                  ]}
                >
                  {isActive && <Feather name="check" size={11} color={C.primary} style={{ marginLeft: 4 }} />}
                  <Text style={[styles.extraText, { color: isActive ? C.primary : C.textMuted }]}>{e}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ── Rate ── */}
          <Text style={[styles.sectionLabel, { color: C.secondary }]}>قيّم هذا المنتج</Text>
          <View style={styles.rateRow}>
            {[1, 2, 3, 4, 5].map((s) => (
              <TouchableOpacity key={s} onPress={() => setRating(s)}>
                <Text style={[styles.rateStar, { color: s <= rating ? C.primary : (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)') }]}>★</Text>
              </TouchableOpacity>
            ))}
          </View>

        </View>
      </Animated.ScrollView>

      {/* ── Sticky bottom bar (inspo: "Add to bag $X.XX") ── */}
      <View style={[styles.bottomBar, {
        backgroundColor: C.background,
        borderTopColor:  isDark ? 'rgba(197,163,109,0.12)' : 'rgba(139,99,50,0.10)',
      }]}>
        {/* Qty control */}
        <View style={[styles.qtyControl, {
          backgroundColor: isDark ? 'rgba(197,163,109,0.08)' : 'rgba(139,99,50,0.07)',
          borderColor:      isDark ? 'rgba(197,163,109,0.20)' : 'rgba(139,99,50,0.16)',
        }]}>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(Math.max(1, qty - 1))}>
            <Feather name="minus" size={16} color={C.primary} />
          </TouchableOpacity>
          <Text style={[styles.qtyNum, { color: C.secondary }]}>{qty}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(qty + 1)}>
            <Feather name="plus" size={16} color={C.primary} />
          </TouchableOpacity>
        </View>

        {/* Add to bag button */}
        <Animated.View style={[{ flex: 1, transform: [{ scale: btnScale }] }]}>
          <TouchableOpacity
            onPress={handleAdd}
            style={[styles.addBtn, { backgroundColor: C.primary }, Shadows.gold]}
          >
            <Text style={[styles.addBtnText, { color: isDark ? '#0A0805' : '#FFF' }]}>
              أضف للسلة
            </Text>
            <View style={[styles.addBtnPrice, {
              backgroundColor: isDark ? 'rgba(10,8,5,0.20)' : 'rgba(255,255,255,0.25)',
            }]}>
              <Text style={[styles.addBtnPriceText, { color: isDark ? '#0A0805' : '#FFF' }]}>
                {total}ر
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  heroWrap: { height: 300, position: 'relative' },
  heroImg:  { width: '100%', height: '100%' },
  heroGrad: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 140 },

  navBtn: {
    width: 40, height: 40, borderRadius: 20,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  likeBtn: { position: 'absolute', top: 52, right: 20 },

  tagRow: { position: 'absolute', bottom: 20, left: 20, flexDirection: 'row', gap: 6 },
  tag:     { borderRadius: Radii.pill, paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { fontSize: Typography.xs, fontWeight: Typography.bold, letterSpacing: 1, textTransform: 'uppercase' },

  content: { padding: Spacing.lg },

  name: {
    fontSize: Typography['2xl'], fontWeight: Typography.bold,
    letterSpacing: -0.5, marginBottom: 8,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 },
  ratingPill: {
    backgroundColor: 'rgba(197,163,109,0.14)', borderRadius: Radii.pill,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  ratingText: { fontSize: Typography.xs, fontWeight: Typography.bold },
  reviews:    { fontSize: Typography.sm },
  dot:        { width: 3, height: 3, borderRadius: 2 },
  calories:   { fontSize: Typography.sm },
  desc:       { fontSize: Typography.base, lineHeight: 24, marginBottom: Spacing.lg },

  sectionLabel: {
    fontSize: Typography.sm, fontWeight: Typography.semibold,
    letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12,
  },

  sizeRow: { flexDirection: 'row', gap: 10, marginBottom: Spacing.lg },
  sizeChip: {
    flex: 1, alignItems: 'center', paddingVertical: 14,
    borderRadius: Radii.xl, borderWidth: 1.5, gap: 4,
  },
  sizeLetter: { fontSize: 18, fontWeight: Typography.black },
  sizeLabel:  { fontSize: Typography.xs, fontWeight: Typography.semibold },
  sizePrice:  { fontSize: 10 },

  pillRow:    { flexDirection: 'row', gap: 8 },
  optionPill: {
    borderRadius: Radii.pill, borderWidth: 1,
    paddingHorizontal: 16, paddingVertical: 9,
  },
  optionPillText: { fontSize: Typography.sm, fontWeight: Typography.medium },

  extrasGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Spacing.lg },
  extraChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderRadius: Radii.pill, borderWidth: 1,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  extraText: { fontSize: Typography.sm },

  rateRow: { flexDirection: 'row', gap: 10, marginBottom: Spacing.lg },
  rateStar: { fontSize: 28 },

  // ── Sticky bottom bar ──
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: Spacing.lg, paddingVertical: 14,
    paddingBottom: 28,
    borderTopWidth: 1,
  },
  qtyControl: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: Radii.pill, borderWidth: 1.5,
    overflow: 'hidden',
  },
  qtyBtn:  { width: 44, height: 50, alignItems: 'center', justifyContent: 'center' },
  qtyNum:  { fontSize: Typography.md, fontWeight: Typography.bold, minWidth: 28, textAlign: 'center' },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderRadius: Radii.pill, paddingLeft: 22, paddingRight: 6, paddingVertical: 6,
  },
  addBtnText: { fontSize: Typography.base, fontWeight: Typography.bold, letterSpacing: 0.3 },
  addBtnPrice: {
    borderRadius: Radii.pill, paddingHorizontal: 14, paddingVertical: 10,
  },
  addBtnPriceText: { fontSize: Typography.sm, fontWeight: Typography.black },
});
