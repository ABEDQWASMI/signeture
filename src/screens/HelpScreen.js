import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Typography, Radii, Spacing } from '../constants/theme';

import { FAQ_ITEMS } from '../constants/data';

const HELP_CATEGORIES = [
  { icon: 'package',      label: 'الطلبات',      desc: 'تتبع، تعديل، إلغاء' },
  { icon: 'credit-card',  label: 'المدفوعات',    desc: 'فواتير، استرداد، بطاقات' },
  { icon: 'award',        label: 'المكافآت',     desc: 'نجوم، مستويات، استرداد' },
  { icon: 'truck',        label: 'التوصيل',      desc: 'تتبع، تأخير، مناطق' },
  { icon: 'user',         label: 'الحساب',       desc: 'الملف الشخصي، الأمان' },
  { icon: 'smartphone',   label: 'مساعدة التطبيق', desc: 'أخطاء، ميزات، تحديثات' },
];

function FAQItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <TouchableOpacity
      style={styles.faqItem}
      onPress={() => setOpen(!open)}
      activeOpacity={0.85}
    >
      <View style={styles.faqHeader}>
        <Feather name={open ? 'minus' : 'plus'} size={16} color={Colors.primary} />
        <Text style={styles.faqQuestion}>{item.question}</Text>
      </View>
      {open && <Text style={styles.faqAnswer}>{item.answer}</Text>}
    </TouchableOpacity>
  );
}

export function HelpScreen({ navigation }) {
  return (
    <View style={styles.root}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.eyebrow}>
              <Text style={styles.eyebrowText}>مركز المساعدة</Text>
            </View>
            <Text style={styles.title}>كيف يمكننا مساعدتك؟</Text>
            <Text style={styles.subtitle}>ابحث عن إجابات أو تواصل مع فريقنا</Text>
          </View>

          {/* Search bar */}
          <View style={styles.searchOuter}>
            <View style={styles.searchInner}>
              <Feather name="search" size={16} color={Colors.textSubtle} />
              <Text style={styles.searchPlaceholder}>ابحث في مقالات المساعدة...</Text>
            </View>
          </View>

          {/* Categories */}
          <Text style={styles.sectionTitle}>تصفح المواضيع</Text>
          <View style={styles.categoriesGrid}>
            {HELP_CATEGORIES.map((cat) => (
              <TouchableOpacity key={cat.label} style={styles.catCard} activeOpacity={0.8}>
                <View style={styles.catCardInner}>
                  <View style={styles.catIconWrap}>
                    <Feather name={cat.icon} size={20} color={Colors.primary} />
                  </View>
                  <Text style={styles.catLabel}>{cat.label}</Text>
                  <Text style={styles.catDesc}>{cat.desc}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* FAQ */}
          <Text style={styles.sectionTitle}>أسئلة شائعة</Text>
          <View style={styles.faqContainer}>
            {FAQ_ITEMS.map((item) => (
              <FAQItem key={item.id} item={item} />
            ))}
          </View>

          {/* Contact */}
          <Text style={styles.sectionTitle}>لا تزال بحاجة مساعدة؟</Text>
          <View style={styles.contactGrid}>
            {[
              { icon: 'message-circle', label: 'دردشة مباشرة', desc: 'تحدث مع فريقنا', action: () => navigation.navigate('Chat') },
              { icon: 'mail',           label: 'راسلنا',    desc: 'support@signature.co',     action: () => {} },
              { icon: 'phone',          label: 'اتصل بنا',  desc: '+966 800 000 0000',         action: () => {} },
            ].map((c) => (
              <TouchableOpacity
                key={c.label}
                style={styles.contactCard}
                onPress={c.action}
                activeOpacity={0.8}
              >
                <View style={styles.contactCardInner}>
                  <View style={styles.contactIconWrap}>
                    <Feather name={c.icon} size={20} color={Colors.primary} />
                  </View>
                  <Text style={styles.contactLabel}>{c.label}</Text>
                  <Text style={styles.contactDesc}>{c.desc}</Text>
                </View>
              </TouchableOpacity>
            ))}
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
  header: { marginBottom: Spacing.lg },
  eyebrow: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(197,163,109,0.12)', borderRadius: Radii.pill,
    paddingHorizontal: 12, paddingVertical: 4, marginBottom: 10,
  },
  eyebrowText: { color: Colors.primary, fontSize: Typography.xs, letterSpacing: Typography.widest, fontWeight: Typography.medium },
  title: { color: Colors.secondary, fontSize: Typography['3xl'], fontWeight: Typography.bold, letterSpacing: Typography.tight, marginBottom: 6 },
  subtitle: { color: Colors.textMuted, fontSize: Typography.base },
  searchOuter: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: Radii.xl, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)', padding: 2, marginBottom: Spacing.xl,
  },
  searchInner: {
    backgroundColor: Colors.surfaceBg, borderRadius: Radii.lg,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 14, gap: 10,
  },
  searchIcon: { marginRight: 4 },
  searchPlaceholder: { color: Colors.textSubtle, fontSize: Typography.base },
  sectionTitle: { color: Colors.secondary, fontSize: Typography.lg, fontWeight: Typography.bold, marginBottom: 14, marginTop: 4 },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: Spacing.xl },
  catCard: {
    width: '47%',
    borderRadius: Radii.xl, borderWidth: 1,
    borderColor: Colors.cardBorder, padding: 2,
  },
  catCardInner: {
    backgroundColor: Colors.surfaceBg, borderRadius: Radii.lg,
    padding: 16,
  },
  catIconWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(197,163,109,0.1)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 10,
  },
  catLabel: { color: Colors.secondary, fontSize: Typography.base, fontWeight: Typography.semibold, marginBottom: 4 },
  catDesc: { color: Colors.textMuted, fontSize: Typography.xs },
  faqContainer: {
    backgroundColor: Colors.surfaceBg, borderRadius: Radii.xl,
    borderWidth: 1, borderColor: Colors.cardBorder,
    overflow: 'hidden', marginBottom: Spacing.xl,
  },
  faqItem: {
    padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.cardBorder,
  },
  faqHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  faqQuestion: { flex: 1, color: Colors.secondary, fontSize: Typography.base, fontWeight: Typography.medium, lineHeight: 22, textAlign: 'right' },
  faqAnswer: { color: Colors.textMuted, fontSize: Typography.sm, lineHeight: 22, marginTop: 10 },
  contactGrid: { flexDirection: 'row', gap: 10, marginBottom: Spacing.lg },
  contactCard: {
    flex: 1, borderRadius: Radii.xl, borderWidth: 1,
    borderColor: Colors.cardBorder, padding: 2,
  },
  contactCardInner: {
    backgroundColor: Colors.surfaceBg, borderRadius: Radii.lg,
    padding: 14, alignItems: 'center',
  },
  contactIconWrap: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(197,163,109,0.1)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 10,
  },
  contactLabel: { color: Colors.secondary, fontSize: Typography.sm, fontWeight: Typography.semibold, textAlign: 'center', marginBottom: 4 },
  contactDesc: { color: Colors.textMuted, fontSize: Typography.xs, textAlign: 'center' },
});
