import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import axios from 'axios';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: string;
};

function getProductEmoji(name: string) {
  const normalizedName = name.toLowerCase();

  if (normalizedName.includes('burger')) return '🍔';
  if (normalizedName.includes('fries')) return '🍟';
  if (normalizedName.includes('drink')) return '🥤';
  if (normalizedName.includes('chicken')) return '🍗';
  if (normalizedName.includes('salad')) return '🥗';

  return '🍽️';
}

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<Product[]>('http://10.55.46.97:8000/api/products')
      .then((response) => {
        setProducts(response.data);
      })
      .catch((requestError: unknown) => {
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Failed to load products.',
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const cartCount = Object.values(quantities).reduce((total, quantity) => total + quantity, 0);
  const cartTotal = useMemo(
    () =>
      (products ?? []).reduce(
        (total, product) => total + product.price * (quantities[product.id] ?? 0),
        0,
      ),
    [products, quantities],
  );

  const updateQuantity = (productId: number, change: number) => {
    setQuantities((current) => {
      const nextQuantity = Math.max(0, (current[productId] ?? 0) + change);

      return {
        ...current,
        [productId]: nextQuantity,
      };
    });
  };

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categories}
      >
        <View style={styles.categorySelected}><Text style={styles.categorySelectedText}>All items</Text></View>
        <View style={styles.category}><Text style={styles.categoryText}>Made fresh</Text></View>
        <View style={styles.category}><Text style={styles.categoryText}>Customer favourites</Text></View>
      </ScrollView>

      {loading && (
        <View style={styles.stateCard}>
          <ActivityIndicator color="#f20f53" accessibilityLabel="Loading products" />
          <Text style={styles.stateText}>Fresh picks coming right up…</Text>
        </View>
      )}
      {!loading && !error && products?.length === 0 && (
        <View style={styles.stateCard}>
          <Text style={styles.stateText}>No menu items available.</Text>
        </View>
      )}
      <View style={styles.grid}>
        {products?.map((product, index) => {
          const quantity = quantities[product.id] ?? 0;

          return (
            <View key={product.id} style={styles.card}>
              <View style={[styles.foodImage, index % 2 === 1 && styles.foodImageAlt]}>
                <Text style={styles.productEmoji}>{getProductEmoji(product.name)}</Text>
                <View style={styles.favourite}><Text style={styles.favouriteText}>♡</Text></View>
                <View style={styles.availableBadge}>
                  <View style={styles.availableDot} />
                  <Text style={styles.availableText}>{product.status}</Text>
                </View>
              </View>
              <View style={styles.productInfo}>
                <Text numberOfLines={1} style={styles.name}>{product.name}</Text>
                <Text numberOfLines={2} style={styles.description}>{product.description}</Text>
                <View style={styles.bottomRow}>
                  <View>
                    <Text style={styles.priceLabel}>PRICE</Text>
                    <Text style={styles.price}>₱{Number(product.price).toFixed(2)}</Text>
                  </View>
                  {quantity === 0 ? (
                    <TouchableOpacity
                      accessibilityRole="button"
                      accessibilityLabel={`Add ${product.name} to cart`}
                      onPress={() => updateQuantity(product.id, 1)}
                      style={styles.addButton}
                    >
                      <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.quantityControl}>
                      <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityLabel={`Remove one ${product.name}`}
                        onPress={() => updateQuantity(product.id, -1)}
                        style={styles.quantityButton}
                      >
                        <Text style={styles.quantityButtonText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.quantityValue}>{quantity}</Text>
                      <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityLabel={`Add one ${product.name}`}
                        onPress={() => updateQuantity(product.id, 1)}
                        style={styles.quantityButtonActive}
                      >
                        <Text style={styles.quantityButtonActiveText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {error && (
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>Menu unavailable</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      {cartCount > 0 && (
        <TouchableOpacity accessibilityRole="button" style={styles.cartBar}>
          <View style={styles.cartCount}><Text style={styles.cartCountText}>{cartCount}</Text></View>
          <Text style={styles.cartLabel}>View your order</Text>
          <Text style={styles.cartTotal}>₱{cartTotal.toFixed(2)}  ›</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  categories: {
    gap: 8,
    paddingBottom: 15,
  },
  category: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ecebed',
  },
  categorySelected: {
    backgroundColor: '#f20f53',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  categoryText: {
    color: '#77737b',
    fontWeight: '700',
    fontSize: 10,
  },
  categorySelectedText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48.5%',
    backgroundColor: '#ffffff',
    borderRadius: 19,
    marginBottom: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ecebed',
    shadowColor: '#27232b',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  foodImage: {
    height: 112,
    borderRadius: 14,
    backgroundColor: '#ffe4eb',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  foodImageAlt: {
    backgroundColor: '#e8eee8',
  },
  productEmoji: {
    fontSize: 52,
  },
  favourite: {
    position: 'absolute',
    right: 8,
    top: 7,
    width: 25,
    height: 25,
    backgroundColor: '#ffffff',
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favouriteText: {
    color: '#f20f53',
    fontSize: 17,
    lineHeight: 20,
  },
  availableBadge: {
    position: 'absolute',
    left: 7,
    bottom: 7,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  availableDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#6b9b60',
    marginRight: 4,
  },
  availableText: {
    color: '#5a6c56',
    fontSize: 8,
    fontWeight: '700',
  },
  productInfo: {
    paddingHorizontal: 4,
    paddingTop: 10,
    paddingBottom: 3,
  },
  name: {
    color: '#28262d',
    fontSize: 13,
    fontWeight: '800',
  },
  description: {
    color: '#89858d',
    fontSize: 10,
    lineHeight: 14,
    marginTop: 3,
    minHeight: 28,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 9,
  },
  priceLabel: {
    color: '#aaa6ad',
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 1,
  },
  price: {
    color: '#f20f53',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  addButton: {
    width: 29,
    height: 29,
    borderRadius: 15,
    backgroundColor: '#f20f53',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 22,
    lineHeight: 25,
    fontWeight: '500',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  quantityButton: {
    width: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: '#f1f0f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    color: '#59565e',
    fontSize: 16,
    lineHeight: 20,
  },
  quantityValue: {
    minWidth: 13,
    textAlign: 'center',
    color: '#28262d',
    fontSize: 11,
    fontWeight: '800',
  },
  quantityButtonActive: {
    width: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: '#f20f53',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonActiveText: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 20,
  },
  stateCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ecebed',
  },
  stateText: {
    color: '#77737b',
    fontSize: 13,
    marginTop: 10,
  },
  errorCard: {
    backgroundColor: '#fff0f4',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f5c3d0',
    padding: 16,
  },
  errorTitle: {
    color: '#b30b3d',
    fontSize: 14,
    fontWeight: '800',
  },
  errorText: {
    color: '#98596a',
    fontSize: 12,
    marginTop: 5,
  },
  cartBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f20f53',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginTop: 2,
    marginBottom: 8,
  },
  cartCount: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartCountText: {
    color: '#f20f53',
    fontSize: 11,
    fontWeight: '800',
  },
  cartLabel: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
    flex: 1,
    marginLeft: 9,
  },
  cartTotal: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
});
