import React, { useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Image, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Typography, Radii, Spacing, Shadows } from '../constants/theme';
import { useApp } from '../context/AppContext';

function CartItem({ item, onIncrease, onDecrease, onRemove, C, isDark }) {
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <Animated.View style={[styles.cartItem, {
      backgroundColor: C.cardBg,
      borderColor:     C.cardBorder,
      transform: [{ scale }],
    }]}>
      <Image source={{ uri: item.image }} style={styles.itemImg} resizeMode="cover" />
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: C.secondary }]} numberOfLines={1}>{item.name}</Text>
        {item.selectedSize && (
          <Text style={[styles.itemMeta, { color: C.textMuted }]}>
            {item.selectedSize} · {item.selectedMilk}
          </Text>
        )}
        {item.selectedExtras?.length > 0 && (
          <Text style={[styles.itemExtras, { color: C.textMuted }]} numberOfLines={1}>
            + {item.selectedExtras.join(', ')}
          </Text>
        )}
        <Text style={[styles.itemPrice, { color: C.primary }]}>
          {(item.price * item.qty).toFixed(2)}ر
        </Text>
      </View>

      {/* Qty + remove */}
      <View style={styles.itemActions}>
        <TouchableOpacity onPress={onRemove} style={styles.removeBtn}>
          <Feather name="trash-2" size={14} color={isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)'} />
        </TouchableOpacity>
        <View style={[styles.qtyRow, {
          backgroundColor: isDark ? 'rgba(197,163,109,0.08)' : 'rgba(139,99,50,0.07)',
          borderColor:      isDark ? 'rgba(197,163,109,0.18)' : 'rgba(139,99,50,0.14)',
        }]}>
          <TouchableOpacity style={styles.qtyBtn} onPress={onDecrease}>
            <Feather name="minus" size={13} color={C.primary} />
          </TouchableOpacity>
          <Text style={[styles.qtyNum, { color: C.secondary }]}>{item.qty}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={onIncrease}>
            <Feather name="plus" size={13} color={C.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

export function CartScreen({ navigation }) {
  const { cart, updateQty, removeFromCart, cartTotal, colors, isDark } = useApp();
  const C = colors;

  const tax       = cartTotal * 0.08;
  const delivery  = 2.99;
  const grandTotal = cartTotal + tax + delivery;

  if (cart.length === 0) {
    return (
      <View style={[styles.root, { backgroundColor: C.background }]}>
        <SafeAreaView style={styles.emptyWrap}>
          <View style={[styles.emptyIconWrap, {
            backgroundColor: isDark ? 'rgba(197,163,109,0.08)' : 'rgba(139,99,50,0.06)',
            borderColor:      isDark ? 'rgba(197,163,109,0.18)' : 'rgba(139,99,50,0.14)',
          }]}>
            <Feather name="shopping-bag" size={36} color={C.primary} />
          </View>
          <Text style={[styles.emptyTitle, { color: C.secondary }]}>السلة فارغة</Text>
          <Text style={[styles.emptySub, { color: C.textMuted }]}>أضف بعض المنتجات للبدء</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Menu')}
            style={[styles.emptyBtn, { backgroundColor: C.primary }, Shadows.gold]}
          >
            <Text style={[styles.emptyBtnText, { color: isDark ? '#0A0805' : '#FFF' }]}>تصفح القائمة</Text>
            <Feather name="arrow-left" size={16} color={isDark ? '#0A0805' : '#FFF'} />
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: C.background }]}>
      <SafeAreaView style={{ flex: 1 }}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.backBtn, {
              backgroundColor: isDark ? 'rgba(197,163,109,0.08)' : 'rgba(139,99,50,0.07)',
              borderColor:      isDark ? 'rgba(197,163,109,0.18)' : 'rgba(139,99,50,0.14)',
            }]}
          >
            <Feather name="arrow-right" size={18} color={C.secondary} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: C.secondary }]}>سلة التسوق</Text>
          <View style={[styles.countBadge, {
            backgroundColor: isDark ? 'rgba(197,163,109,0.12)' : 'rgba(139,99,50,0.09)',
          }]}>
            <Text style={[styles.countText, { color: C.primary }]}>
              {cart.reduce((s, c) => s + c.qty, 0)}
            </Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* ── Cart items ── */}
          {cart.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onIncrease={() => updateQty(item.id, item.qty + 1)}
              onDecrease={() => updateQty(item.id, item.qty - 1)}
              onRemove={() => removeFromCart(item.id)}
              C={C}
              isDark={isDark}
            />
          ))}

          {/* ── Promo code ── */}
          <TouchableOpacity style={[styles.promoRow, {
            backgroundColor: isDark ? 'rgba(197,163,109,0.06)' : 'rgba(139,99,50,0.04)',
            borderColor:      isDark ? 'rgba(197,163,109,0.16)' : 'rgba(139,99,50,0.12)',
          }]}>
            <Feather name="tag" size={16} color={C.primary} />
            <Text style={[styles.promoText, { color: C.primary }]}>أضف كوبون خصم</Text>
            <Feather name="chevron-left" size={16} color={C.primary} />
          </TouchableOpacity>

          {/* ── Order summary ── */}
          <View style={[styles.summaryCard, {
            backgroundColor: isDark ? 'rgba(197,163,109,0.04)' : 'rgba(139,99,50,0.03)',
            borderColor:      isDark ? 'rgba(197,163,109,0.14)' : 'rgba(139,99,50,0.10)',
          }]}>
            <Text style={[styles.summaryTitle, { color: C.secondary }]}>ملخص الطلب</Text>

            {[
              { label: 'المجموع الفرعي', value: `${cartTotal.toFixed(2)}ر` },
              { label: 'رسوم التوصيل',  value: `${delivery.toFixed(2)}ر` },
              { label: 'الضريبة (8%)',   value: `${tax.toFixed(2)}ر` },
            ].map((row) => (
              <View key={row.label} style={styles.summaryRow}>
                <Text style={[styles.summaryValue, { color: C.secondary }]}>{row.value}</Text>
                <Text style={[styles.summaryLabel, { color: C.textMuted }]}>{row.label}</Text>
              </View>
            ))}

            <View style={[styles.summaryDivider, {
              backgroundColor: isDark ? 'rgba(197,163,109,0.12)' : 'rgba(139,99,50,0.10)',
            }]} />

            <View style={styles.summaryRow}>
              <Text style={[styles.totalValue, { color: C.primary }]}>{grandTotal.toFixed(2)}ر</Text>
              <Text style={[styles.totalLabel, { color: C.secondary }]}>الإجمالي</Text>
            </View>
          </View>

          {/* ── Delivery info ── */}
          <View style={[styles.deliveryInfo, {
            backgroundColor: C.cardBg, borderColor: C.cardBorder,
          }]}>
            <View style={styles.deliveryRow}>
              <Feather name="map-pin" size={14} color={C.primary} />
              <Text style={[styles.deliveryText, { color: C.textMuted }]}>يُوصَّل إلى عنوانك المحفوظ</Text>
            </View>
            <View style={styles.deliveryRow}>
              <Feather name="clock" size={14} color={C.primary} />
              <Text style={[styles.deliveryText, { color: C.textMuted }]}>١٨–٢٥ دقيقة</Text>
            </View>
          </View>

          <View style={{ height: 110 }} />
        </ScrollView>

        {/* ── Sticky checkout bar ── */}
        <View style={[styles.checkoutBar, {
          backgroundColor: C.background,
          borderTopColor:  isDark ? 'rgba(197,163,109,0.12)' : 'rgba(139,99,50,0.10)',
        }]}>
          <TouchableOpacity
            onPress={() => navigation.navigate('TrackOrder')}
            style={[styles.checkoutBtn, { backgroundColor: C.primary }, Shadows.gold]}
          >
            <Text style={[styles.checkoutBtnText, { color: isDark ? '#0A0805' : '#FFF' }]}>
              تأكيد الطلب
            </Text>
            <View style={[styles.checkoutPrice, {
              backgroundColor: isDark ? 'rgba(10,8,5,0.20)' : 'rgba(255,255,255,0.25)',
            }]}>
              <Text style={[styles.checkoutPriceText, { color: isDark ? '#0A0805' : '#FFF' }]}>
                {grandTotal.toFixed(2)}ر
              </Text>
            </View>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  // Empty state
  emptyWrap: {
    flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl,
  },
  emptyIconWrap: {
    width: 88, height: 88, borderRadius: 44,
    borderWidth: 1.5, alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  emptyTitle: { fontSize: Typography.xl, fontWeight: Typography.bold, marginBottom: 8 },
  emptySub:   { fontSize: Typography.base, textAlign: 'center', marginBottom: Spacing.xl },
  emptyBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderRadius: Radii.pill, paddingHorizontal: 28, paddingVertical: 14,
  },
  emptyBtnText: { fontSize: Typography.base, fontWeight: Typography.bold },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md, paddingBottom: Spacing.sm,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  title: {
    flex: 1, fontSize: Typography['2xl'],
    fontWeight: Typography.bold, letterSpacing: -0.5, textAlign: 'right',
  },
  countBadge: { borderRadius: Radii.pill, paddingHorizontal: 10, paddingVertical: 4 },
  countText:  { fontSize: Typography.xs, fontWeight: Typography.bold, letterSpacing: 1 },

  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm },

  // Cart item
  cartItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: Radii.xl, borderWidth: 1,
    padding: 12, marginBottom: 12,
  },
  itemImg:    { width: 72, height: 72, borderRadius: Radii.lg, backgroundColor: '#1A1408' },
  itemInfo:   { flex: 1 },
  itemName:   { fontSize: Typography.base, fontWeight: Typography.bold, marginBottom: 3 },
  itemMeta:   { fontSize: Typography.xs, marginBottom: 2 },
  itemExtras: { fontSize: Typography.xs, marginBottom: 4 },
  itemPrice:  { fontSize: Typography.md, fontWeight: Typography.bold },
  itemActions:{ alignItems: 'flex-end', gap: 8 },
  removeBtn:  { padding: 4 },
  qtyRow: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: Radii.pill, borderWidth: 1, overflow: 'hidden',
  },
  qtyBtn: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  qtyNum: { fontSize: Typography.sm, fontWeight: Typography.bold, minWidth: 22, textAlign: 'center' },

  // Promo
  promoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderRadius: Radii.xl, borderWidth: 1,
    paddingHorizontal: 16, paddingVertical: 14,
    marginBottom: Spacing.lg,
  },
  promoText: { flex: 1, fontSize: Typography.base, fontWeight: Typography.medium, textAlign: 'right' },

  // Summary
  summaryCard: {
    borderRadius: Radii.xl, borderWidth: 1,
    padding: Spacing.lg, marginBottom: Spacing.md,
  },
  summaryTitle: { fontSize: Typography.base, fontWeight: Typography.bold, textAlign: 'right', marginBottom: 14 },
  summaryRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  summaryLabel: { fontSize: Typography.sm },
  summaryValue: { fontSize: Typography.sm, fontWeight: Typography.semibold },
  summaryDivider: { height: 1, marginVertical: 10 },
  totalLabel: { fontSize: Typography.md, fontWeight: Typography.bold },
  totalValue: { fontSize: Typography.xl, fontWeight: Typography.black },

  // Delivery
  deliveryInfo: {
    borderRadius: Radii.xl, borderWidth: 1,
    padding: 14, gap: 8, marginBottom: Spacing.md,
  },
  deliveryRow:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  deliveryText: { fontSize: Typography.sm },

  // Checkout bar
  checkoutBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: Spacing.lg, paddingVertical: 14,
    paddingBottom: 28, borderTopWidth: 1,
  },
  checkoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderRadius: Radii.pill, paddingLeft: 24, paddingRight: 6, paddingVertical: 6,
  },
  checkoutBtnText:  { fontSize: Typography.base, fontWeight: Typography.bold, letterSpacing: 0.3 },
  checkoutPrice:    { borderRadius: Radii.pill, paddingHorizontal: 16, paddingVertical: 10 },
  checkoutPriceText:{ fontSize: Typography.sm, fontWeight: Typography.black },
});
