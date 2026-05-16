import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, TextInput, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Typography, Radii, Spacing } from '../constants/theme';
import { MenuCard } from '../components/MenuCard';
import { useApp } from '../context/AppContext';
import { MENU_ITEMS, MENU_CATEGORIES } from '../constants/data';

const CATEGORY_LABELS = {
  '1': 'الكل', '2': 'قهوة ساخنة', '3': 'كولد برو',
  '4': 'معجنات', '5': 'سموذي', '6': 'متجر',
};

export function MenuScreen({ navigation }) {
  const { addToCart, colors, isDark } = useApp();
  const C = colors;

  const [activeCategory, setActiveCategory] = useState('1');
  const [search, setSearch]                 = useState('');
  const [priceFilter, setPriceFilter]       = useState(null);
  const [dietFilter, setDietFilter]         = useState(null);

  const searchScale = useRef(new Animated.Value(1)).current;

  const filtered = MENU_ITEMS.filter((item) => {
    const matchCat    = activeCategory === '1' || item.category === MENU_CATEGORIES.find((c) => c.id === activeCategory)?.name;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchDiet   = !dietFilter || item.tags.includes(dietFilter);
    return matchCat && matchSearch && matchDiet;
  }).sort((a, b) => {
    if (priceFilter === 'low')  return a.price - b.price;
    if (priceFilter === 'high') return b.price - a.price;
    return 0;
  });

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
          <Text style={[styles.title, { color: C.secondary }]}>قائمة الطلبات</Text>
          <View style={[styles.countBadge, { backgroundColor: isDark ? 'rgba(197,163,109,0.12)' : 'rgba(139,99,50,0.09)' }]}>
            <Text style={[styles.countText, { color: C.primary }]}>{MENU_ITEMS.length}</Text>
          </View>
        </View>

        {/* ── Search bar ── */}
        <Animated.View style={[styles.searchOuter, {
          backgroundColor: isDark ? 'rgba(197,163,109,0.04)' : 'rgba(139,99,50,0.03)',
          borderColor:      isDark ? 'rgba(197,163,109,0.14)' : 'rgba(139,99,50,0.12)',
        }, { transform: [{ scale: searchScale }] }]}>
          <Feather name="search" size={15} color={C.textMuted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="ابحث عن مشروبات، طعام..."
            placeholderTextColor={isDark ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.28)'}
            style={[styles.searchInput, { color: C.secondary }]}
            textAlign="right"
            onFocus={() => Animated.spring(searchScale, { toValue: 1.01, damping: 14, stiffness: 300, useNativeDriver: true }).start()}
            onBlur={() =>  Animated.spring(searchScale, { toValue: 1,    damping: 12, stiffness: 260, useNativeDriver: true }).start()}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Feather name="x" size={14} color={C.textMuted} />
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* ── Category pills ── */}
        <FlatList
          data={MENU_CATEGORIES}
          keyExtractor={(c) => c.id}
          horizontal
          inverted
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catList}
          renderItem={({ item }) => {
            const isActive = activeCategory === item.id;
            return (
              <TouchableOpacity
                onPress={() => setActiveCategory(item.id)}
                style={[
                  styles.catChip,
                  {
                    backgroundColor: isActive ? C.primary : (isDark ? 'rgba(197,163,109,0.07)' : 'rgba(139,99,50,0.06)'),
                    borderColor:     isActive ? C.primary : (isDark ? 'rgba(197,163,109,0.18)' : 'rgba(139,99,50,0.14)'),
                  },
                ]}
                activeOpacity={0.8}
              >
                <Feather
                  name={item.icon}
                  size={13}
                  color={isActive ? (isDark ? '#0A0805' : '#FFF') : C.primary}
                />
                <Text style={[
                  styles.catLabel,
                  { color: isActive ? (isDark ? '#0A0805' : '#FFF') : C.textMuted },
                  isActive && { fontWeight: Typography.bold },
                ]}>
                  {CATEGORY_LABELS[item.id] || item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />

        {/* ── Filter chips ── */}
        <View style={styles.filterRow}>
          {[
            { key: 'low',        label: 'الأرخص أولاً',  type: 'price' },
            { key: 'high',       label: 'الأغلى أولاً',  type: 'price' },
            { key: 'Vegan',      label: 'نباتي',          type: 'diet'  },
            { key: 'Zero Sugar', label: 'بدون سكر',       type: 'diet'  },
          ].map((f) => {
            const isActive = f.type === 'price' ? priceFilter === f.key : dietFilter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                onPress={() => {
                  if (f.type === 'price') setPriceFilter(priceFilter === f.key ? null : f.key);
                  else setDietFilter(dietFilter === f.key ? null : f.key);
                }}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isActive ? 'rgba(197,163,109,0.15)' : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'),
                    borderColor:     isActive ? C.primary : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'),
                  },
                ]}
              >
                <Text style={[styles.filterText, { color: isActive ? C.primary : C.textMuted }]}>{f.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Results ── */}
        <View style={styles.resultsRow}>
          <Text style={[styles.resultsText, { color: C.textMuted }]}>{filtered.length} نتيجة</Text>
        </View>

        {/* ── Items grid ── */}
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <MenuCard
              item={item}
              horizontal
              onPress={() => navigation.navigate('ItemDetail', { item })}
              onAddToCart={addToCart}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Feather name="coffee" size={44} color={C.textMuted} style={{ marginBottom: 14 }} />
              <Text style={[styles.emptyText, { color: C.textMuted }]}>لا توجد نتائج</Text>
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
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
  countBadge: {
    borderRadius: Radii.pill, paddingHorizontal: 10, paddingVertical: 4,
  },
  countText: { fontSize: Typography.xs, fontWeight: Typography.bold, letterSpacing: 1 },

  searchOuter: {
    marginHorizontal: Spacing.lg, marginBottom: Spacing.sm,
    borderRadius: Radii.xl, borderWidth: 1.5,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 12, gap: 10,
  },
  searchInput: { flex: 1, fontSize: Typography.base },

  catList:  { paddingHorizontal: Spacing.lg, gap: 8, paddingBottom: 12 },
  catChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: Radii.pill, borderWidth: 1.5,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  catLabel: { fontSize: Typography.sm, fontWeight: Typography.medium },

  filterRow: {
    flexDirection: 'row', gap: 8, flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg, marginBottom: 10,
  },
  filterChip: {
    borderRadius: Radii.pill, borderWidth: 1,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  filterText: { fontSize: Typography.xs, fontWeight: Typography.medium },

  resultsRow:  { paddingHorizontal: Spacing.lg, marginBottom: 6 },
  resultsText: { fontSize: Typography.xs, letterSpacing: 0.5 },

  list:  { paddingHorizontal: Spacing.lg, paddingBottom: 40 },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: Typography.base },
});
