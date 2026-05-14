import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ScrollView, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Typography, Radii, Spacing, Shadows } from '../constants/theme';
import { MenuCard } from '../components/MenuCard';
import { useApp } from '../context/AppContext';
import { MENU_ITEMS, MENU_CATEGORIES } from '../constants/data';

export function MenuScreen({ navigation }) {
  const { addToCart } = useApp();
  const [activeCategory, setActiveCategory] = useState('1');
  const [search, setSearch] = useState('');
  const [priceFilter, setPriceFilter] = useState(null); // null | 'low' | 'high'
  const [dietFilter, setDietFilter] = useState(null); // null | 'Vegan' | 'Zero Sugar'

  const filtered = MENU_ITEMS.filter((item) => {
    const matchCat = activeCategory === '1' || item.category === MENU_CATEGORIES.find((c) => c.id === activeCategory)?.name;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchDiet = !dietFilter || item.tags.includes(dietFilter);
    return matchCat && matchSearch && matchDiet;
  }).sort((a, b) => {
    if (priceFilter === 'low') return a.price - b.price;
    if (priceFilter === 'high') return b.price - a.price;
    return 0;
  });

  return (
    <View style={styles.root}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>قائمة الطلبات</Text>
          <View style={styles.eyebrow}>
            <Text style={styles.eyebrowText}>{MENU_ITEMS.length} صنف</Text>
          </View>
        </View>

        {/* Search bar */}
        <View style={styles.searchOuter}>
          <View style={styles.searchInner}>
            <Feather name="search" size={16} color={Colors.textSubtle} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="ابحث عن مشروبات، طعام..."
              placeholderTextColor={Colors.textSubtle}
              style={styles.searchInput}
              textAlign="right"
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Feather name="x" size={14} color={Colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Categories */}
        <FlatList
          data={MENU_CATEGORIES}
          keyExtractor={(c) => c.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catList}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setActiveCategory(item.id)}
              style={[styles.catChip, activeCategory === item.id && styles.catChipActive]}
              activeOpacity={0.8}
            >
              <Feather name={item.icon} size={14} color={activeCategory === item.id ? Colors.background : Colors.primary} />
              <Text style={[styles.catLabel, activeCategory === item.id && styles.catLabelActive]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* Filters */}
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Filter:</Text>
          {['low', 'high'].map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setPriceFilter(priceFilter === f ? null : f)}
              style={[styles.filterChip, priceFilter === f && styles.filterChipActive]}
            >
              <Text style={[styles.filterText, priceFilter === f && styles.filterTextActive]}>
                {f === 'low' ? '$ Low–High' : '$ High–Low'}
              </Text>
            </TouchableOpacity>
          ))}
          {['Vegan', 'Zero Sugar'].map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setDietFilter(dietFilter === f ? null : f)}
              style={[styles.filterChip, dietFilter === f && styles.filterChipActive]}
            >
              <Text style={[styles.filterText, dietFilter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Results count */}
        <View style={styles.resultsRow}>
          <Text style={styles.resultsText}>{filtered.length} results</Text>
        </View>

        {/* Items list */}
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
              <Text style={styles.emptyEmoji}>☕</Text>
              <Text style={styles.emptyText}>No items match your filters</Text>
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
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
  searchOuter: {
    marginHorizontal: Spacing.lg, marginBottom: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: Radii.xl, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)', padding: 2,
  },
  searchInner: {
    backgroundColor: Colors.surfaceBg, borderRadius: Radii.lg,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 12, gap: 10,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, color: Colors.secondary, fontSize: Typography.base },
  clearSearch: { color: Colors.textMuted, fontSize: 14 },
  catList: { paddingHorizontal: Spacing.lg, gap: 8, paddingBottom: 12 },
  catChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.cardBg, borderRadius: Radii.pill,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: Colors.cardBorder,
  },
  catChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  catIcon: { fontSize: 14 },
  catLabel: { color: Colors.textMuted, fontSize: Typography.sm, fontWeight: Typography.medium },
  catLabelActive: { color: Colors.background, fontWeight: Typography.bold },
  filterRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: Spacing.lg, marginBottom: 10, flexWrap: 'wrap',
  },
  filterLabel: { color: Colors.textMuted, fontSize: Typography.xs, letterSpacing: 1 },
  filterChip: {
    backgroundColor: Colors.cardBg, borderRadius: Radii.pill,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: Colors.cardBorder,
  },
  filterChipActive: { backgroundColor: 'rgba(197,163,109,0.15)', borderColor: Colors.primary },
  filterText: { color: Colors.textMuted, fontSize: Typography.xs },
  filterTextActive: { color: Colors.primary, fontWeight: Typography.semibold },
  resultsRow: { paddingHorizontal: Spacing.lg, marginBottom: 8 },
  resultsText: { color: Colors.textSubtle, fontSize: Typography.xs },
  list: { paddingHorizontal: Spacing.lg, paddingBottom: 32 },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: Colors.textMuted, fontSize: Typography.base },
});
