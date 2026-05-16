import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, TextInput, Image, Animated, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Typography, Radii, Spacing, Shadows } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { MENU_ITEMS, MENU_CATEGORIES } from '../constants/data';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = (SCREEN_W - Spacing.lg * 2 - 14) / 2;

const CATEGORY_LABELS = {
  '1': 'الكل', '2': 'قهوة ساخنة', '3': 'كولد برو',
  '4': 'معجنات', '5': 'سموذي', '6': 'متجر',
};

// ─── Grid card (inspo: 2-col with image + price badge) ───────────────────
function GridCard({ item, onPress, onAddToCart, C, isDark }) {
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <Animated.View style={[styles.gridCard, { transform: [{ scale }] }]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={() => Animated.spring(scale, { toValue: 0.96, damping: 14, stiffness: 300, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1,    damping: 12, stiffness: 260, useNativeDriver: true }).start()}
        activeOpacity={1}
        style={[styles.gridCardInner, {
          backgroundColor: C.cardBg,
          borderColor:     C.cardBorder,
        }]}
      >
        {/* Image */}
        <View style={styles.gridImgWrap}>
          <Image source={{ uri: item.image }} style={styles.gridImg} resizeMode="cover" />
          {/* Price badge (top-right) */}
          <View style={[styles.priceBadge, {
            backgroundColor: isDark ? 'rgba(10,8,5,0.80)' : 'rgba(255,255,255,0.92)',
            borderColor:      isDark ? 'rgba(197,163,109,0.25)' : 'rgba(139,99,50,0.18)',
          }]}>
            <Text style={[styles.priceBadgeText, { color: C.primary }]}>{item.price.toFixed(2)}ر</Text>
          </View>
          {/* Tags */}
          {item.tags.length > 0 && (
            <View style={styles.gridTags}>
              {item.tags.slice(0, 2).map((tag) => (
                <View key={tag} style={[styles.gridTag, {
                  backgroundColor: isDark ? 'rgba(10,8,5,0.75)' : 'rgba(0,0,0,0.60)',
                }]}>
                  <Text style={styles.gridTagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.gridInfo}>
          <Text style={[styles.gridName, { color: C.secondary }]} numberOfLines={2}>{item.name}</Text>
          <View style={styles.gridMeta}>
            <Text style={[styles.gridRating, { color: C.primary }]}>★ {item.rating}</Text>
            <Text style={[styles.gridReviews, { color: C.textMuted }]}>({item.reviews.toLocaleString()})</Text>
          </View>
        </View>

        {/* Add button */}
        <TouchableOpacity
          onPress={() => onAddToCart(item)}
          style={[styles.gridAddBtn, { backgroundColor: C.primary }]}
        >
          <Feather name="plus" size={16} color={isDark ? '#0A0805' : '#FFF'} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────
export function MenuScreen({ navigation }) {
  const { addToCart, colors, isDark } = useApp();
  const C = colors;

  const [activeCategory, setActiveCategory] = useState('1');
  const [search, setSearch]                 = useState('');

  const filtered = MENU_ITEMS.filter((item) => {
    const matchCat    = activeCategory === '1' || item.category === MENU_CATEGORIES.find((c) => c.id === activeCategory)?.name;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
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
          <Text style={[styles.title, { color: C.secondary }]}>القائمة</Text>
          <View style={[styles.countBadge, {
            backgroundColor: isDark ? 'rgba(197,163,109,0.12)' : 'rgba(139,99,50,0.09)',
          }]}>
            <Text style={[styles.countText, { color: C.primary }]}>{filtered.length}</Text>
          </View>
        </View>

        {/* ── Search bar ── */}
        <View style={[styles.searchBar, {
          backgroundColor: isDark ? 'rgba(197,163,109,0.05)' : 'rgba(139,99,50,0.04)',
          borderColor:      isDark ? 'rgba(197,163,109,0.14)' : 'rgba(139,99,50,0.12)',
        }]}>
          <Feather name="search" size={16} color={C.textMuted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="ابحث عن مشروبات، طعام..."
            placeholderTextColor={isDark ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.28)'}
            style={[styles.searchInput, { color: C.secondary }]}
            textAlign="right"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Feather name="x" size={14} color={C.textMuted} />
            </TouchableOpacity>
          )}
        </View>

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
                  {
                    color: isActive ? (isDark ? '#0A0805' : '#FFF') : C.textMuted,
                    fontWeight: isActive ? Typography.bold : Typography.medium,
                  },
                ]}>
                  {CATEGORY_LABELS[item.id] || item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />

        {/* ── 2-Column Grid ── */}
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.id}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.gridList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <GridCard
              item={item}
              onPress={() => navigation.navigate('ItemDetail', { item })}
              onAddToCart={addToCart}
              C={C}
              isDark={isDark}
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
    fontWeight: Typography.bold, letterSpacing: -0.5, textAlign: 'center',
  },
  countBadge: { borderRadius: Radii.pill, paddingHorizontal: 10, paddingVertical: 4 },
  countText:  { fontSize: Typography.xs, fontWeight: Typography.bold, letterSpacing: 1 },

  searchBar: {
    marginHorizontal: Spacing.lg, marginBottom: 12,
    borderRadius: Radii.xl, borderWidth: 1.5,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 12, gap: 10,
  },
  searchInput: { flex: 1, fontSize: Typography.base },

  catList: { paddingHorizontal: Spacing.lg, gap: 8, paddingBottom: 14 },
  catChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: Radii.pill, borderWidth: 1.5,
    paddingHorizontal: 14, paddingVertical: 9,
  },
  catLabel: { fontSize: Typography.sm },

  // Grid
  gridList: { paddingHorizontal: Spacing.lg, paddingBottom: 100 },
  gridRow:  { justifyContent: 'space-between', marginBottom: 14 },

  gridCard: { width: CARD_W },
  gridCardInner: {
    borderRadius: Radii.xl, borderWidth: 1,
    overflow: 'hidden',
  },
  gridImgWrap: { width: '100%', height: CARD_W * 0.9, position: 'relative' },
  gridImg:     { width: '100%', height: '100%' },

  priceBadge: {
    position: 'absolute', top: 10, right: 10,
    borderRadius: Radii.pill, borderWidth: 1,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  priceBadgeText: { fontSize: Typography.xs, fontWeight: Typography.bold },

  gridTags: {
    position: 'absolute', top: 10, left: 10,
    flexDirection: 'row', gap: 4,
  },
  gridTag: { borderRadius: Radii.sm, paddingHorizontal: 6, paddingVertical: 2 },
  gridTagText: {
    color: '#FFF', fontSize: 8, fontWeight: Typography.bold,
    letterSpacing: 0.8, textTransform: 'uppercase',
  },

  gridInfo: { padding: 12 },
  gridName: {
    fontSize: Typography.sm, fontWeight: Typography.bold,
    marginBottom: 6, textAlign: 'right', lineHeight: 18,
  },
  gridMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, justifyContent: 'flex-end' },
  gridRating:  { fontSize: Typography.xs, fontWeight: Typography.bold },
  gridReviews: { fontSize: 10 },

  gridAddBtn: {
    position: 'absolute', bottom: 12, left: 12,
    width: 34, height: 34, borderRadius: 17,
    alignItems: 'center', justifyContent: 'center',
    ...Shadows.gold,
  },

  empty:     { alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: Typography.base },
});
