import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Typography, Radii, Shadows } from '../constants/theme';

export function MenuCard({ item, onPress, onAddToCart, horizontal }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.88}
      style={[styles.outerShell, horizontal && styles.horizontal, Shadows.card]}
    >
      {/* Inner core */}
      <View style={styles.innerCore}>
        <View style={[styles.imageWrapper, horizontal && styles.imageWrapperH]}>
          <Image
            source={{ uri: item.image }}
            style={[styles.image, horizontal && styles.imageH]}
            resizeMode="cover"
          />
          {/* Tags */}
          <View style={styles.tagRow}>
            {item.tags.slice(0, 2).map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.content, horizontal && styles.contentH]}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>

          <View style={styles.ratingRow}>
            <Text style={styles.star}>★</Text>
            <Text style={styles.rating}>{item.rating}</Text>
            <Text style={styles.reviews}>({item.reviews.toLocaleString()})</Text>
          </View>

          <View style={styles.footer}>
            <View>
              <Text style={styles.price}>{item.price.toFixed(2)}ر</Text>
              {item.originalPrice && (
                <Text style={styles.originalPrice}>{item.originalPrice.toFixed(2)}ر</Text>
              )}
            </View>
            <TouchableOpacity
              onPress={() => onAddToCart && onAddToCart(item)}
              activeOpacity={0.8}
              style={styles.addBtn}
            >
              <Feather name="plus" size={16} color={Colors.background} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  outerShell: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    padding: 3,
    marginBottom: 16,
    width: 200,
  },
  horizontal: {
    width: '100%',
    flexDirection: 'row',
  },
  innerCore: {
    backgroundColor: Colors.cardBg,
    borderRadius: Radii.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  imageWrapper: {
    position: 'relative',
    height: 140,
  },
  imageWrapperH: {
    height: 'auto',
    width: 110,
    flexShrink: 0,
  },
  image: {
    width: '100%',
    height: 140,
  },
  imageH: {
    width: 110,
    height: '100%',
    minHeight: 120,
  },
  tagRow: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    gap: 4,
  },
  tag: {
    backgroundColor: Colors.primary,
    borderRadius: Radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: {
    color: Colors.background,
    fontSize: Typography.xs - 1,
    fontWeight: Typography.bold,
    letterSpacing: Typography.wide,
    textTransform: 'uppercase',
  },
  content: {
    padding: 12,
  },
  contentH: {
    flex: 1,
    padding: 14,
  },
  name: {
    color: Colors.secondary,
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    marginBottom: 4,
  },
  desc: {
    color: Colors.textMuted,
    fontSize: Typography.xs,
    lineHeight: 18,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 10,
  },
  star: {
    color: Colors.primary,
    fontSize: Typography.xs,
  },
  rating: {
    color: Colors.secondary,
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
  },
  reviews: {
    color: Colors.textMuted,
    fontSize: Typography.xs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    color: Colors.primary,
    fontSize: Typography.md,
    fontWeight: Typography.bold,
  },
  originalPrice: {
    color: Colors.textSubtle,
    fontSize: Typography.xs,
    textDecorationLine: 'line-through',
  },
  addBtn: {
    width: 34,
    height: 34,
    borderRadius: Radii.pill,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
});
