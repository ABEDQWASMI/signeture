import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Radii, Spacing, Shadows } from '../constants/theme';
import { GoldButton } from '../components/GoldButton';
import { COUPONS } from '../constants/data';

export function CouponsScreen({ navigation }) {
  const [copied, setCopied] = useState(null);

  const handleCopy = (code) => {
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.eyebrow}>
              <Text style={styles.eyebrowText}>عروض حصرية</Text>
            </View>
            <Text style={styles.title}>كوبوناتك</Text>
            <Text style={styles.subtitle}>خصومات مختارة خصيصاً لك</Text>
          </View>

          {/* Coupons */}
          {COUPONS.map((coupon) => (
            <View key={coupon.id} style={styles.couponOuter}>
              <LinearGradient
                colors={[coupon.color, coupon.color + 'CC']}
                style={styles.couponLeft}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              >
                <Text style={styles.couponDiscount}>{coupon.discount}</Text>
              </LinearGradient>
              <View style={styles.couponRight}>
                <Text style={styles.couponDesc}>{coupon.description}</Text>
                <Text style={styles.couponExpiry}>Expires {coupon.expiry}</Text>
                <View style={styles.codeRow}>
                  <View style={styles.codeBox}>
                    <Text style={styles.codeText}>{coupon.code}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.copyBtn}
                    onPress={() => handleCopy(coupon.code)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.copyBtnText}>
                      {copied === coupon.code ? '✓ Copied' : 'Copy'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* Notch decoration */}
              <View style={styles.notchTop} />
              <View style={styles.notchBottom} />
            </View>
          ))}

          {/* Generate coupon section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Coupon Generator</Text>
            <Text style={styles.sectionSub}>Share with friends to earn bonus stars</Text>
          </View>

          <View style={styles.generatorCard}>
            <View style={styles.generatorCardInner}>
              <Text style={styles.generatorEmoji}>🎰</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.generatorTitle}>Generate Unique Code</Text>
                <Text style={styles.generatorDesc}>
                  Create a personalized discount code for a friend. You earn 25★ when they use it.
                </Text>
              </View>
            </View>
            <GoldButton
              title="Generate Code"
              onPress={() => {}}
              icon="✨"
              style={{ marginTop: 16 }}
            />
          </View>

          {/* Referral section */}
          <View style={styles.referralCard}>
            <LinearGradient
              colors={['#2A1E0A', '#1A1200']}
              style={styles.referralInner}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            >
              <Text style={styles.referralTitle}>Refer a Friend</Text>
              <Text style={styles.referralDesc}>
                Invite friends to Signature and both of you get a free drink!
              </Text>
              <View style={styles.referralCode}>
                <Text style={styles.referralCodeText}>ALEXC-REF</Text>
                <TouchableOpacity onPress={() => handleCopy('ALEXC-REF')}>
                  <Text style={styles.referralCopy}>
                    {copied === 'ALEXC-REF' ? '✓' : '📋'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.referralStats}>
                <View style={styles.referralStat}>
                  <Text style={styles.referralStatNum}>3</Text>
                  <Text style={styles.referralStatLabel}>Referrals</Text>
                </View>
                <View style={styles.referralStatDivider} />
                <View style={styles.referralStat}>
                  <Text style={styles.referralStatNum}>75★</Text>
                  <Text style={styles.referralStatLabel}>Earned</Text>
                </View>
                <View style={styles.referralStatDivider} />
                <View style={styles.referralStat}>
                  <Text style={styles.referralStatNum}>3</Text>
                  <Text style={styles.referralStatLabel}>Free Drinks</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          <View style={{ height: 32 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg },
  header: { marginBottom: Spacing.xl },
  eyebrow: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(197,163,109,0.12)', borderRadius: Radii.pill,
    paddingHorizontal: 12, paddingVertical: 4, marginBottom: 10,
  },
  eyebrowText: { color: Colors.primary, fontSize: Typography.xs, letterSpacing: Typography.widest, fontWeight: Typography.medium },
  title: { color: Colors.secondary, fontSize: Typography['3xl'], fontWeight: Typography.bold, letterSpacing: Typography.tight, marginBottom: 6 },
  subtitle: { color: Colors.textMuted, fontSize: Typography.base },
  couponOuter: {
    flexDirection: 'row', borderRadius: Radii.xl, overflow: 'hidden',
    marginBottom: 16, ...Shadows.card, position: 'relative',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  couponLeft: {
    width: 100, padding: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  couponDiscount: {
    color: Colors.white, fontSize: Typography.base, fontWeight: Typography.black,
    textAlign: 'center', letterSpacing: -0.5,
  },
  couponRight: {
    flex: 1, backgroundColor: Colors.surfaceElevated,
    padding: 16, justifyContent: 'center',
  },
  couponDesc: { color: Colors.secondary, fontSize: Typography.base, fontWeight: Typography.semibold, marginBottom: 4 },
  couponExpiry: { color: Colors.textMuted, fontSize: Typography.xs, marginBottom: 10 },
  codeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  codeBox: {
    backgroundColor: Colors.cardBg, borderRadius: Radii.sm,
    paddingHorizontal: 10, paddingVertical: 6,
    borderWidth: 1, borderColor: Colors.cardBorder,
    borderStyle: 'dashed',
  },
  codeText: { color: Colors.primary, fontSize: Typography.sm, fontWeight: Typography.bold, letterSpacing: 2 },
  copyBtn: {
    backgroundColor: Colors.primary, borderRadius: Radii.pill,
    paddingHorizontal: 14, paddingVertical: 6,
  },
  copyBtnText: { color: Colors.background, fontSize: Typography.xs, fontWeight: Typography.bold },
  notchTop: {
    position: 'absolute', left: 92, top: -10,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: Colors.background,
  },
  notchBottom: {
    position: 'absolute', left: 92, bottom: -10,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: Colors.background,
  },
  sectionHeader: { marginBottom: 14, marginTop: 8 },
  sectionTitle: { color: Colors.secondary, fontSize: Typography.lg, fontWeight: Typography.bold, marginBottom: 4 },
  sectionSub: { color: Colors.textMuted, fontSize: Typography.sm },
  generatorCard: {
    backgroundColor: Colors.surfaceBg, borderRadius: Radii.xl,
    borderWidth: 1, borderColor: Colors.cardBorder,
    padding: 16, marginBottom: Spacing.lg,
  },
  generatorCardInner: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  generatorEmoji: { fontSize: 36 },
  generatorTitle: { color: Colors.secondary, fontSize: Typography.base, fontWeight: Typography.bold, marginBottom: 6 },
  generatorDesc: { color: Colors.textMuted, fontSize: Typography.sm, lineHeight: 20 },
  referralCard: {
    borderRadius: Radii['2xl'], borderWidth: 1,
    borderColor: 'rgba(197,163,109,0.25)', padding: 2, ...Shadows.gold,
  },
  referralInner: { borderRadius: Radii.xl, padding: Spacing.lg },
  referralTitle: { color: Colors.secondary, fontSize: Typography.xl, fontWeight: Typography.bold, marginBottom: 8 },
  referralDesc: { color: Colors.textMuted, fontSize: Typography.sm, lineHeight: 22, marginBottom: 16 },
  referralCode: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: Radii.md,
    padding: 14, marginBottom: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    borderStyle: 'dashed',
  },
  referralCodeText: { color: Colors.primary, fontSize: Typography.lg, fontWeight: Typography.bold, letterSpacing: 3 },
  referralCopy: { fontSize: 22 },
  referralStats: { flexDirection: 'row', justifyContent: 'space-around' },
  referralStat: { alignItems: 'center' },
  referralStatNum: { color: Colors.primary, fontSize: Typography.xl, fontWeight: Typography.black },
  referralStatLabel: { color: Colors.textMuted, fontSize: Typography.xs, marginTop: 2 },
  referralStatDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.1)', alignSelf: 'center' },
});
