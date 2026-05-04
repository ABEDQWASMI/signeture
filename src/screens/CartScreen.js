import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Typography, Radii, Spacing, Shadows } from '../constants/theme';
import { GoldButton } from '../components/GoldButton';
import { useApp } from '../context/AppContext';

export function CartScreen({ navigation }) {
  const { cart, updateQty, removeFromCart, cartTotal, addToCart } = useApp();

  if (cart.length === 0) {
    return (
      <View style={styles.root}>
        <SafeAreaView style={styles.empty}>
          <View style={styles.emptyIconWrap}>
            <Feather name="shopping-bag" size={40} color={Colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>سلة التسوق فارغة</Text>
          <Text style={styles.emptySub}>أضف بعض العناصر للبدء</Text>
          <GoldButton
            title="تصفح القائمة"
            onPress={() => navigation.navigate('Menu')}
            style={{ marginTop: 24 }}
            icon="→"
          />
        </SafeAreaView>
      </View>
    );
  }

  const tax = cartTotal * 0.08;
  const delivery = 2.99;
  const grandTotal = cartTotal + tax + delivery;

  return (
    <View style={styles.root}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.title}>سلة التسوق</Text>
          <View style={styles.eyebrow}>
            <Text style={styles.eyebrowText}>{cart.reduce((s, c) => s + c.qty, 0)} صنف</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Cart items */}
          {cart.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <View style={styles.cartItemInner}>
                <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                  {item.selectedSize && (
                    <Text style={styles.itemMeta}>{item.selectedSize} · {item.selectedMilk}</Text>
                  )}
                  {item.selectedExtras && item.selectedExtras.length > 0 && (
                    <Text style={styles.itemExtras} numberOfLines={1}>
                      +{item.selectedExtras.join(', ')}
                    </Text>
                  )}
                  <Text style={styles.itemPrice}>{(item.price * item.qty).toFixed(2)}ر</Text>
                </View>
                <View style={styles.qtyControl}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateQty(item.id, item.qty - 1)}
                  >
                    <Text style={styles.qtyBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyNum}>{item.qty}</Text>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateQty(item.id, item.qty + 1)}
                  >
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}

          {/* Delivery type */}
          <Text style={styles.sectionLabel}>خيار التوصيل</Text>
          <View style={styles.deliveryOptions}>
            {[
              { icon: 'bike',   label: 'عادي',   time: '30–45 دقيقة', cost: '2.99ر' },
              { icon: 'zap',   label: 'سريع',   time: '15–20 دقيقة', cost: '4.99ر' },
            ].map((d, i) => (
              <TouchableOpacity
                key={d.label}
                style={[styles.deliveryOption, i === 0 && styles.deliveryOptionActive]}
                activeOpacity={0.8}
              >
                <View style={styles.deliveryIconWrap}>
                  <Feather name={d.icon} size={18} color={i === 0 ? Colors.background : Colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.deliveryLabel, i === 0 && { color: Colors.background }]}>{d.label}</Text>
                  <Text style={[styles.deliveryTime, i === 0 && { color: 'rgba(0,0,0,0.6)' }]}>{d.time}</Text>
                </View>
                <Text style={[styles.deliveryCost, i === 0 && { color: Colors.background }]}>{d.cost}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Coupon code */}
          <TouchableOpacity style={styles.couponRow} onPress={() => navigation.navigate('Coupons')}>
            <Feather name="chevron-left" size={18} color={Colors.primary} />
            <Text style={styles.couponText}>استخدام كوبون أو مكافأة</Text>
            <View style={styles.couponIconWrap}>
              <Feather name="tag" size={16} color={Colors.primary} />
            </View>
          </TouchableOpacity>

          {/* Order summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>ملخص الطلب</Text>
            {[
              { label: 'المجموع الجزئي', value: `${cartTotal.toFixed(2)}ر` },
              { label: 'الضريبة (8%)',  value: `${tax.toFixed(2)}ر` },
              { label: 'التوصيل',           value: `${delivery.toFixed(2)}ر` },
            ].map((r) => (
              <View key={r.label} style={styles.summaryRow}>
                <Text style={styles.summaryValue}>{r.value}</Text>
                <Text style={styles.summaryLabel}>{r.label}</Text>
              </View>
            ))}
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalValue}>{grandTotal.toFixed(2)}ر</Text>
              <Text style={styles.totalLabel}>الإجمالي</Text>
            </View>
          </View>

          <GoldButton
            title={`تأكيد الطلب · ${grandTotal.toFixed(2)}ر`}
            onPress={() => navigation.navigate('TrackOrder')}
            icon="→"
            size="lg"
            style={{ marginBottom: 32 }}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  emptyIconWrap: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: { color: Colors.secondary, fontSize: Typography.xl, fontWeight: Typography.bold, marginBottom: 8 },
  emptySub: { color: Colors.textMuted, fontSize: Typography.base },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.sm,
  },
  title: { color: Colors.secondary, fontSize: Typography['2xl'], fontWeight: Typography.bold, letterSpacing: Typography.tight },
  eyebrow: {
    backgroundColor: 'rgba(197,163,109,0.12)', borderRadius: Radii.pill,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  eyebrowText: { color: Colors.primary, fontSize: Typography.xs, letterSpacing: Typography.widest, fontWeight: Typography.medium },
  scroll: { padding: Spacing.lg },
  cartItem: {
    borderRadius: Radii.xl, borderWidth: 1,
    borderColor: Colors.cardBorder, padding: 2, marginBottom: 10, ...Shadows.subtle,
  },
  cartItemInner: {
    backgroundColor: Colors.surfaceBg, borderRadius: Radii.lg,
    flexDirection: 'row', alignItems: 'center', padding: 12, gap: 12,
  },
  itemImage: { width: 64, height: 64, borderRadius: Radii.md },
  itemInfo: { flex: 1 },
  itemName: { color: Colors.secondary, fontSize: Typography.base, fontWeight: Typography.semibold, marginBottom: 2 },
  itemMeta: { color: Colors.textMuted, fontSize: Typography.xs, marginBottom: 2 },
  itemExtras: { color: Colors.textSubtle, fontSize: Typography.xs, marginBottom: 4 },
  itemPrice: { color: Colors.primary, fontSize: Typography.base, fontWeight: Typography.bold },
  qtyControl: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.cardBg, borderRadius: Radii.pill,
    borderWidth: 1, borderColor: Colors.cardBorder, overflow: 'hidden',
  },
  qtyBtn: { width: 34, height: 36, alignItems: 'center', justifyContent: 'center' },
  qtyBtnText: { color: Colors.primary, fontSize: 18, fontWeight: Typography.light },
  qtyNum: { color: Colors.secondary, fontSize: Typography.sm, fontWeight: Typography.bold, minWidth: 24, textAlign: 'center' },
  sectionLabel: { color: Colors.secondary, fontSize: Typography.sm, fontWeight: Typography.semibold, letterSpacing: Typography.wide, textTransform: 'uppercase', marginBottom: 10, marginTop: 8 },
  deliveryOptions: { gap: 8, marginBottom: 14 },
  deliveryOption: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.surfaceBg, borderRadius: Radii.xl,
    borderWidth: 1, borderColor: Colors.cardBorder, padding: 14,
  },
  deliveryOptionActive: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  deliveryIconWrap: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(197,163,109,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  deliveryLabel: { color: Colors.secondary, fontSize: Typography.sm, fontWeight: Typography.semibold },
  deliveryTime: { color: Colors.textMuted, fontSize: Typography.xs, marginTop: 2 },
  deliveryCost: { color: Colors.primary, fontSize: Typography.sm, fontWeight: Typography.bold },
  couponRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.surfaceBg, borderRadius: Radii.xl,
    borderWidth: 1, borderColor: 'rgba(197,163,109,0.2)',
    padding: 14, marginBottom: 14,
  },
  couponIconWrap: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(197,163,109,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  couponText: { flex: 1, color: Colors.primary, fontSize: Typography.sm, fontWeight: Typography.medium, textAlign: 'right' },
  summaryCard: {
    backgroundColor: Colors.surfaceBg, borderRadius: Radii.xl,
    borderWidth: 1, borderColor: Colors.cardBorder,
    padding: 16, marginBottom: 16,
  },
  summaryTitle: { color: Colors.secondary, fontSize: Typography.base, fontWeight: Typography.bold, marginBottom: 14 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { color: Colors.textMuted, fontSize: Typography.sm },
  summaryValue: { color: Colors.secondary, fontSize: Typography.sm },
  summaryDivider: { height: 1, backgroundColor: Colors.cardBorder, marginVertical: 12 },
  totalLabel: { color: Colors.secondary, fontSize: Typography.md, fontWeight: Typography.bold },
  totalValue: { color: Colors.primary, fontSize: Typography.lg, fontWeight: Typography.black },
});
