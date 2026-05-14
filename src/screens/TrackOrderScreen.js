import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Colors, Typography, Radii, Spacing, Shadows } from '../constants/theme';
import { GoldButton } from '../components/GoldButton';

const STEPS = [
  { id: 1, label: 'تم استلام الطلب',  icon: 'check-circle', desc: 'تم تأكيد طلبك' },
  { id: 2, label: 'جاري التحضير',     icon: 'coffee',       desc: 'يقوم الباريستا بتحضير طلبك' },
  { id: 3, label: 'فحص الجودة',     icon: 'shield',       desc: 'فحص جودة نهائي' },
  { id: 4, label: 'في طريقه إليك',  icon: 'truck',        desc: 'السائق في الطريق' },
  { id: 5, label: 'تم التسليم',       icon: 'home',         desc: 'استمتع بطلبك!' },
];

export function TrackOrderScreen({ navigation }) {
  const [currentStep, setCurrentStep] = useState(2);
  const [eta, setEta] = useState(22);

  // Simulate progress
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((s) => {
        if (s >= 5) { clearInterval(timer); return 5; }
        return s + 1;
      });
      setEta((e) => Math.max(0, e - 5));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const orderId = 'ORD-8899';

  return (
    <View style={styles.root}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
              <Feather name="arrow-right" size={18} color={Colors.primary} />
            </TouchableOpacity>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text style={styles.title}>تتبع الطلب</Text>
              <Text style={styles.orderId}>{orderId}</Text>
            </View>
          </View>

          {/* ETA card */}
          <View style={styles.etaOuter}>
            <LinearGradient
              colors={['#2A1E0A', '#1A1200']}
              style={styles.etaInner}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            >
              <View style={styles.etaTop}>
                <View>
                  <Text style={styles.etaLabel}>وقت الوصول المتوقع</Text>
                  <View style={styles.etaRow}>
                    <Text style={styles.etaNum}>{eta}</Text>
                    <Text style={styles.etaSuffix}> دقيقة</Text>
                  </View>
                </View>
                <View style={styles.etaStatus}>
                  <View style={styles.etaDot} />
                  <Text style={styles.etaStatusText}>
                    {currentStep >= 5 ? 'تم التسليم!' : 'في الطريق'}
                  </Text>
                </View>
              </View>

              {/* Map placeholder */}
              <View style={styles.mapPlaceholder}>
                <View style={styles.mapPinRow}>
                  <Feather name="map-pin" size={16} color={Colors.primary} />
                  <Text style={styles.mapText}> تتبع مباشر</Text>
                </View>
                <Text style={styles.mapSub}>شارع الملك فهد، الرياض</Text>
                <View style={styles.mapDots}>
                  {[...Array(5)].map((_, i) => (
                    <View
                      key={i}
                      style={[styles.mapDot, i < currentStep && styles.mapDotActive]}
                    />
                  ))}
                </View>
                <View style={styles.mapRider}>
                  <Feather name="truck" size={18} color={Colors.primary} />
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Rider info */}
          <View style={styles.riderCard}>
            <View style={styles.riderAvatar}>
              <Text style={styles.riderAvatarText}>MK</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.riderName}>محمد خ.
</Text>
              <View style={styles.riderRating}>
                <Feather name="star" size={12} color={Colors.primary} />
                <Text style={styles.riderRatingText}> 4.9 · 1,204 توصيلة</Text>
              </View>
            </View>
            <View style={styles.riderActions}>
              <TouchableOpacity style={styles.riderBtn}>
                <Feather name="phone" size={16} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.riderBtn}>
                <Feather name="message-circle" size={16} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Steps */}
          <Text style={styles.sectionTitle}>تقدم الطلب</Text>
          <View style={styles.stepsCard}>
            {STEPS.map((step, i) => {
              const isActive = currentStep === step.id;
              const isDone = currentStep > step.id;
              return (
                <View key={step.id} style={styles.stepRow}>
                  {/* Connector */}
                  {i < STEPS.length - 1 && (
                    <View style={[styles.connector, isDone && styles.connectorDone]} />
                  )}
                  <View style={[
                    styles.stepDot,
                    isActive && styles.stepDotActive,
                    isDone && styles.stepDotDone,
                  ]}>
                    {isDone
                      ? <Feather name="check" size={14} color={Colors.background} />
                      : <Feather name={step.icon} size={14} color={isActive ? Colors.background : Colors.textMuted} />
                    }
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={[
                      styles.stepLabel,
                      (isActive || isDone) && styles.stepLabelActive,
                    ]}>
                      {step.label}
                    </Text>
                    <Text style={styles.stepDesc}>{step.desc}</Text>
                    {isActive && (
                      <View style={styles.activePill}>
                        <Text style={styles.activePillText}>جاري التنفيذ</Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          {currentStep >= 5 && (
            <GoldButton
              title="قيّم تجربتك"
              onPress={() => navigation.navigate('Home')}
              icon="→"
              style={{ marginBottom: 32 }}
            />
          )}

          <View style={{ height: 32 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: Spacing.lg },
  back: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.cardBg, borderWidth: 1,
    borderColor: Colors.cardBorder, alignItems: 'center', justifyContent: 'center',
  },
  backText: { color: Colors.secondary, fontSize: 20 },
  mapPinRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  title: { color: Colors.secondary, fontSize: Typography.xl, fontWeight: Typography.bold },
  orderId: { color: Colors.textMuted, fontSize: Typography.sm },
  etaOuter: {
    borderRadius: Radii['2xl'], borderWidth: 1,
    borderColor: 'rgba(197,163,109,0.3)', padding: 2,
    marginBottom: Spacing.lg, ...Shadows.gold,
  },
  etaInner: { borderRadius: Radii.xl, padding: Spacing.lg },
  etaTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  etaLabel: { color: Colors.textMuted, fontSize: Typography.sm, marginBottom: 4 },
  etaRow: { flexDirection: 'row', alignItems: 'baseline' },
  etaNum: { color: Colors.primary, fontSize: Typography['4xl'], fontWeight: Typography.black, letterSpacing: -2 },
  etaSuffix: { color: Colors.primaryLight, fontSize: Typography.xl },
  etaStatus: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(76,175,80,0.15)', borderRadius: Radii.pill, paddingHorizontal: 12, paddingVertical: 6 },
  etaDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.success },
  etaStatusText: { color: Colors.success, fontSize: Typography.sm, fontWeight: Typography.semibold },
  mapPlaceholder: {
    backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: Radii.lg,
    padding: 20, alignItems: 'center', borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)', position: 'relative',
  },
  mapText: { color: Colors.secondary, fontSize: Typography.base, fontWeight: Typography.semibold, marginBottom: 4 },
  mapSub: { color: Colors.textMuted, fontSize: Typography.sm, marginBottom: 16 },
  mapDots: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  mapDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.cardBorder },
  mapDotActive: { backgroundColor: Colors.primary },
  mapRider: { position: 'absolute', right: 40, bottom: 20, width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(197,163,109,0.15)', alignItems: 'center', justifyContent: 'center' },
  riderCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: Colors.surfaceBg, borderRadius: Radii.xl,
    borderWidth: 1, borderColor: Colors.cardBorder,
    padding: 16, marginBottom: Spacing.lg,
  },
  riderAvatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.primary,
  },
  riderAvatarText: { color: Colors.primary, fontSize: Typography.base, fontWeight: Typography.bold },
  riderName: { color: Colors.secondary, fontSize: Typography.base, fontWeight: Typography.semibold },
  riderRating: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  riderRatingText: { color: Colors.textMuted, fontSize: Typography.xs },
  riderActions: { flexDirection: 'row', gap: 8 },
  riderBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.cardBg, borderWidth: 1,
    borderColor: Colors.cardBorder, alignItems: 'center', justifyContent: 'center',
  },
  sectionTitle: { color: Colors.secondary, fontSize: Typography.lg, fontWeight: Typography.bold, marginBottom: 14 },
  stepsCard: {
    backgroundColor: Colors.surfaceBg, borderRadius: Radii.xl,
    borderWidth: 1, borderColor: Colors.cardBorder,
    padding: 20, marginBottom: Spacing.lg,
  },
  stepRow: { flexDirection: 'row', gap: 16, marginBottom: 24, position: 'relative' },
  connector: {
    position: 'absolute', left: 19, top: 40,
    width: 2, height: 28, backgroundColor: Colors.cardBorder,
  },
  connectorDone: { backgroundColor: Colors.primary },
  stepDot: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.cardBg, borderWidth: 2,
    borderColor: Colors.cardBorder, alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  stepDotActive: { borderColor: Colors.primary, backgroundColor: 'rgba(197,163,109,0.15)' },
  stepDotDone: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  stepContent: { flex: 1, paddingTop: 8 },
  stepLabel: { color: Colors.textMuted, fontSize: Typography.base, fontWeight: Typography.semibold },
  stepLabelActive: { color: Colors.secondary },
  stepDesc: { color: Colors.textSubtle, fontSize: Typography.xs, marginTop: 2 },
  activePill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(197,163,109,0.15)', borderRadius: Radii.pill,
    paddingHorizontal: 10, paddingVertical: 4, marginTop: 6,
  },
  activePillText: { color: Colors.primary, fontSize: Typography.xs, fontWeight: Typography.bold },
});
