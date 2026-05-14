import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Colors, Typography, Radii, Spacing, Shadows } from '../constants/theme';
import { GoldButton } from '../components/GoldButton';
import { useApp } from '../context/AppContext';
import { REWARDS_TIERS } from '../constants/data';

const REDEEMABLE = [
  { id: 'r1', stars: 50,  reward: 'معجنات مجانية',   icon: 'coffee' },
  { id: 'r2', stars: 100, reward: 'مشروب صغير مجاني', icon: 'coffee' },
  { id: 'r3', stars: 150, reward: 'أي مشروب مجاني',  icon: 'award' },
  { id: 'r4', stars: 200, reward: 'وجبة كاملة مجانية',  icon: 'package' },
  { id: 'r5', stars: 400, reward: 'متجر Signature',    icon: 'shopping-bag' },
];

export function RewardsScreen({ navigation }) {
  const { stars } = useApp();
  const currentTier = REWARDS_TIERS.find((t) => stars >= t.min && stars <= t.max) || REWARDS_TIERS[1];
  const nextTier = REWARDS_TIERS[REWARDS_TIERS.indexOf(currentTier) + 1];
  const progress = nextTier
    ? ((stars - currentTier.min) / (nextTier.min - currentTier.min)) * 100
    : 100;

  return (
    <View style={styles.root}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.eyebrow}>
              <Text style={styles.eyebrowText}>برنامج الولاء</Text>
            </View>
            <Text style={styles.title}>مكافآت Signature</Text>
            <Text style={styles.subtitle}>اكسب نجوماً. افتح مزايا. استمتع أكثر.</Text>
          </View>

          {/* Stars card */}
          <View style={styles.starsOuter}>
            <LinearGradient
              colors={['#2A1E0A', '#1A1200', '#100C00']}
              style={styles.starsInner}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            >
              <View style={styles.starsTop}>
                <View>
                  <Text style={styles.starsLabel}>رصيدك</Text>
                  <View style={styles.starsRow}>
                    <Text style={styles.starsNum}>{stars}</Text>
                    <Text style={styles.starsSuffix}> ★</Text>
                  </View>
                </View>
                <View style={[styles.tierBadge, { backgroundColor: currentTier.color + '22', borderColor: currentTier.color }]}>
                  <Text style={[styles.tierBadgeText, { color: currentTier.color }]}>◆ {currentTier.name}</Text>
                </View>
              </View>

              {nextTier && (
                <>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${progress}%` }]} />
                  </View>
                  <Text style={styles.progressLabel}>
                    {nextTier.min - stars} نجمة للوصول إلى{' '}
                    <Text style={{ color: nextTier.color }}>{nextTier.name}</Text>
                  </Text>
                </>
              )}
            </LinearGradient>
          </View>

          {/* Tiers */}
          <Text style={styles.sectionTitle}>مستويات العضوية</Text>
          {REWARDS_TIERS.map((tier, i) => (
            <View
              key={tier.name}
              style={[
                styles.tierCard,
                currentTier.name === tier.name && styles.tierCardActive,
              ]}
            >
              <View style={styles.tierCardInner}>
                <View style={[styles.tierDot, { backgroundColor: tier.color }]} />
                <View style={{ flex: 1 }}>
                  <View style={styles.tierHeader}>
                    <Text style={styles.tierName}>{tier.name}</Text>
                    <Text style={styles.tierRange}>
                      {tier.min}–{tier.max === Infinity ? '∞' : tier.max} ★
                    </Text>
                  </View>
                  {tier.perks.map((p) => (
                    <View key={p} style={styles.perkRow}>
                      <Feather name="check" size={12} color={Colors.primary} />
                      <Text style={styles.perkText}>{p}</Text>
                    </View>
                  ))}
                </View>
                {currentTier.name === tier.name && (
                  <View style={styles.currentBadge}>
                    <Text style={styles.currentBadgeText}>مستواك</Text>
                  </View>
                )}
              </View>
            </View>
          ))}

          {/* Redeem */}
          <Text style={styles.sectionTitle}>استبدل النجوم</Text>
          {REDEEMABLE.map((r) => {
            const canRedeem = stars >= r.stars;
            return (
              <View key={r.id} style={[styles.redeemCard, !canRedeem && styles.redeemCardLocked]}>
                <View style={styles.redeemIconWrap}>
                  <Feather name={r.icon} size={20} color={canRedeem ? Colors.primary : Colors.textMuted} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.redeemReward}>{r.reward}</Text>
                  <Text style={styles.redeemCost}>{r.stars} ★ نجمة</Text>
                </View>
                <TouchableOpacity
                  style={[styles.redeemBtn, !canRedeem && styles.redeemBtnLocked]}
                  disabled={!canRedeem}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.redeemBtnText, !canRedeem && styles.redeemBtnTextLocked]}>
                    {canRedeem ? 'استبدل' : `تحتاج ${r.stars - stars} أخرى`}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}

          <View style={{ height: 32 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg },
  header: { marginBottom: Spacing.lg },
  eyebrow: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(197,163,109,0.12)', borderRadius: Radii.pill,
    paddingHorizontal: 12, paddingVertical: 4, marginBottom: 10,
  },
  eyebrowText: { color: Colors.primary, fontSize: Typography.xs, letterSpacing: Typography.widest, fontWeight: Typography.medium },
  title: { color: Colors.secondary, fontSize: Typography['3xl'], fontWeight: Typography.bold, letterSpacing: Typography.tight, marginBottom: 6 },
  subtitle: { color: Colors.textMuted, fontSize: Typography.base },
  starsOuter: {
    borderRadius: Radii['2xl'], borderWidth: 1,
    borderColor: 'rgba(197,163,109,0.3)', padding: 2,
    marginBottom: Spacing.xl, ...Shadows.gold,
  },
  starsInner: { borderRadius: Radii.xl, padding: Spacing.lg },
  starsTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  starsLabel: { color: Colors.textMuted, fontSize: Typography.sm, marginBottom: 4 },
  starsRow: { flexDirection: 'row', alignItems: 'baseline' },
  starsNum: { color: Colors.primary, fontSize: Typography['4xl'], fontWeight: Typography.black, letterSpacing: -2 },
  starsSuffix: { color: Colors.primaryLight, fontSize: Typography.xl, fontWeight: Typography.medium },
  tierBadge: {
    borderWidth: 1, borderRadius: Radii.pill,
    paddingHorizontal: 14, paddingVertical: 6,
  },
  tierBadgeText: { fontSize: Typography.sm, fontWeight: Typography.bold },
  progressTrack: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, marginBottom: 8, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 3 },
  progressLabel: { color: Colors.textMuted, fontSize: Typography.xs },
  sectionTitle: { color: Colors.secondary, fontSize: Typography.lg, fontWeight: Typography.bold, marginBottom: 14, marginTop: 4 },
  tierCard: {
    borderRadius: Radii.xl, borderWidth: 1,
    borderColor: Colors.cardBorder, padding: 2,
    marginBottom: 12,
  },
  tierCardActive: { borderColor: Colors.primary, ...Shadows.gold },
  tierCardInner: {
    backgroundColor: Colors.surfaceBg, borderRadius: Radii.lg,
    padding: 16, flexDirection: 'row', gap: 14, alignItems: 'flex-start',
  },
  tierDot: { width: 14, height: 14, borderRadius: 7, marginTop: 4 },
  tierHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  tierName: { color: Colors.secondary, fontSize: Typography.md, fontWeight: Typography.bold },
  tierRange: { color: Colors.textMuted, fontSize: Typography.sm },
  perkRow: { flexDirection: 'row', gap: 6, marginBottom: 4, alignItems: 'center' },
  perkText: { color: Colors.textMuted, fontSize: Typography.sm },
  currentBadge: {
    backgroundColor: 'rgba(197,163,109,0.15)', borderRadius: Radii.pill,
    paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start',
  },
  currentBadgeText: { color: Colors.primary, fontSize: Typography.xs, fontWeight: Typography.bold },
  redeemCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: Colors.surfaceBg, borderRadius: Radii.xl,
    borderWidth: 1, borderColor: Colors.cardBorder,
    padding: 16, marginBottom: 10,
  },
  redeemCardLocked: { opacity: 0.5 },
  redeemIconWrap: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(197,163,109,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  redeemReward: { color: Colors.secondary, fontSize: Typography.base, fontWeight: Typography.semibold },
  redeemCost: { color: Colors.primary, fontSize: Typography.sm, marginTop: 2 },
  redeemBtn: {
    backgroundColor: Colors.primary, borderRadius: Radii.pill,
    paddingHorizontal: 16, paddingVertical: 8, ...Shadows.gold,
  },
  redeemBtnLocked: { backgroundColor: Colors.cardBg, ...Shadows.subtle },
  redeemBtnText: { color: Colors.background, fontSize: Typography.xs, fontWeight: Typography.bold },
  redeemBtnTextLocked: { color: Colors.textMuted },
});
