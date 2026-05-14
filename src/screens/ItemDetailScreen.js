import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Image, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Colors, Typography, Radii, Spacing, Shadows } from '../constants/theme';
import { GoldButton } from '../components/GoldButton';
import { useApp } from '../context/AppContext';

const SIZES  = ['صغير', 'وسط', 'كبير'];
const MILKS  = ['كامل', 'شوفان', 'لوز', 'صويا', 'جوز هند'];
const EXTRAS = ['جرعة إضافية', 'شراب الفانيليا', 'كراميل كاراميل', 'رغوة الشوفان'];

export function ItemDetailScreen({ route, navigation }) {
  const { item } = route.params;
  const { addToCart } = useApp();
  const [selectedSize, setSelectedSize] = useState('Medium');
  const [selectedMilk, setSelectedMilk] = useState('Oat');
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);

  const toggleExtra = (e) =>
    setSelectedExtras((prev) =>
      prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]
    );

  const extraCost = selectedExtras.length * 0.75;
  const sizeCost = selectedSize === 'Large' ? 0.75 : selectedSize === 'Small' ? -0.50 : 0;
  const total = ((item.price + extraCost + sizeCost) * qty).toFixed(2);

  const handleAdd = () => {
    addToCart({ ...item, selectedSize, selectedMilk, selectedExtras }, qty);
    navigation.goBack();
  };

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero image */}
        <View style={styles.heroWrapper}>
          <Image source={{ uri: item.image }} style={styles.hero} resizeMode="cover" />
          <LinearGradient
            colors={['transparent', Colors.background]}
            style={styles.heroGrad}
          />
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-right" size={20} color={Colors.secondary} />
          </TouchableOpacity>
          {/* Tags */}
          <View style={styles.tagRow}>
            {item.tags.map((t) => (
              <View key={t} style={styles.tag}>
                <Text style={styles.tagText}>{t}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.star}>★</Text>
            <Text style={styles.rating}>{item.rating}</Text>
            <Text style={styles.reviews}>({item.reviews.toLocaleString()} تقييم)</Text>
            <View style={styles.dot} />
            <Text style={styles.calories}>{item.calories} cal</Text>
          </View>
          <Text style={styles.desc}>{item.description}</Text>

          {/* Size selector */}
          <Text style={styles.optionLabel}>الحجم</Text>
          <View style={styles.optionRow}>
            {SIZES.map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.optionChip, selectedSize === s && styles.optionChipActive]}
                onPress={() => setSelectedSize(s)}
              >
                <Text style={[styles.optionText, selectedSize === s && styles.optionTextActive]}>{s}</Text>
                {s === 'صغير' && <Text style={styles.optionSub}>-0.50ر</Text>}
                {s === 'كبير' && <Text style={styles.optionSub}>+0.75ر</Text>}
              </TouchableOpacity>
            ))}
          </View>

          {/* Milk selector */}
          <Text style={styles.optionLabel}>نوع الحليب</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
            <View style={styles.optionRowH}>
              {MILKS.map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.optionChip, selectedMilk === m && styles.optionChipActive]}
                  onPress={() => setSelectedMilk(m)}
                >
                  <Text style={[styles.optionText, selectedMilk === m && styles.optionTextActive]}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Extras */}
          <Text style={styles.optionLabel}>إضافات <Text style={styles.optionSub}>(+0.75ر لكل)</Text></Text>
          <View style={styles.extrasGrid}>
            {EXTRAS.map((e) => (
              <TouchableOpacity
                key={e}
                style={[styles.extraChip, selectedExtras.includes(e) && styles.extraChipActive]}
                onPress={() => toggleExtra(e)}
              >
                {selectedExtras.includes(e) && <Feather name="check" size={12} color={Colors.background} style={{ marginRight: 4 }} />}
                <Text style={[styles.extraText, selectedExtras.includes(e) && styles.extraTextActive]}>{e}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Rate this item */}
          <Text style={styles.optionLabel}>قيّم هذا المنتج</Text>
          <View style={styles.rateRow}>
            {[1, 2, 3, 4, 5].map((s) => (
              <TouchableOpacity key={s} onPress={() => setRating(s)}>
                <Text style={[styles.rateStar, s <= rating && styles.rateStarActive]}>★</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Qty + Add to cart */}
          <View style={styles.cartRow}>
            <View style={styles.qtyControl}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQty(Math.max(1, qty - 1))}
              >
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyNum}>{qty}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQty(qty + 1)}
              >
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>

            <GoldButton
              title={`أضف للسلة  ${total}ر`}
              onPress={handleAdd}
              style={{ flex: 1 }}
              icon="→"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  heroWrapper: { position: 'relative', height: 320 },
  hero: { width: '100%', height: 320 },
  heroGrad: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 160 },
  backBtn: {
    position: 'absolute', top: 52, left: 20,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  tagRow: { position: 'absolute', bottom: 20, left: 20, flexDirection: 'row', gap: 6 },
  tag: { backgroundColor: Colors.primary, borderRadius: Radii.pill, paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { color: Colors.background, fontSize: Typography.xs, fontWeight: Typography.bold, letterSpacing: 1, textTransform: 'uppercase' },
  content: { padding: Spacing.lg },
  name: { color: Colors.secondary, fontSize: Typography['2xl'], fontWeight: Typography.bold, letterSpacing: Typography.tight, marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  star: { color: Colors.primary, fontSize: Typography.sm },
  rating: { color: Colors.secondary, fontSize: Typography.sm, fontWeight: Typography.semibold },
  reviews: { color: Colors.textMuted, fontSize: Typography.sm },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: Colors.textSubtle, marginHorizontal: 4 },
  calories: { color: Colors.textMuted, fontSize: Typography.sm },
  desc: { color: Colors.textMuted, fontSize: Typography.base, lineHeight: 24, marginBottom: Spacing.lg },
  optionLabel: { color: Colors.secondary, fontSize: Typography.sm, fontWeight: Typography.semibold, letterSpacing: Typography.wide, textTransform: 'uppercase', marginBottom: 10 },
  optionRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  optionRowH: { flexDirection: 'row', gap: 8 },
  optionChip: {
    flex: 1, alignItems: 'center', paddingVertical: 12,
    backgroundColor: Colors.cardBg, borderRadius: Radii.md,
    borderWidth: 1, borderColor: Colors.cardBorder,
  },
  optionChipActive: { backgroundColor: 'rgba(197,163,109,0.15)', borderColor: Colors.primary },
  optionText: { color: Colors.textMuted, fontSize: Typography.sm, fontWeight: Typography.medium },
  optionTextActive: { color: Colors.primary, fontWeight: Typography.bold },
  optionSub: { color: Colors.textSubtle, fontSize: Typography.xs, marginTop: 2 },
  extrasGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  extraChip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.cardBg, borderRadius: Radii.pill,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: Colors.cardBorder,
  },
  extraChipActive: { backgroundColor: 'rgba(197,163,109,0.12)', borderColor: Colors.primary },
  extraText: { color: Colors.textMuted, fontSize: Typography.sm },
  extraTextActive: { color: Colors.primary },
  rateRow: { flexDirection: 'row', gap: 8, marginBottom: Spacing.lg },
  rateStar: { color: Colors.textSubtle, fontSize: 28 },
  rateStarActive: { color: Colors.primary },
  cartRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 },
  qtyControl: {
    flexDirection: 'row', alignItems: 'center', gap: 0,
    backgroundColor: Colors.cardBg, borderRadius: Radii.pill,
    borderWidth: 1, borderColor: Colors.cardBorder, overflow: 'hidden',
  },
  qtyBtn: { width: 44, height: 50, alignItems: 'center', justifyContent: 'center' },
  qtyBtnText: { color: Colors.primary, fontSize: 22, fontWeight: Typography.light },
  qtyNum: { color: Colors.secondary, fontSize: Typography.md, fontWeight: Typography.bold, minWidth: 32, textAlign: 'center' },
});
