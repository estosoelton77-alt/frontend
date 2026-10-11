import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import axios from 'axios';

type Order = {
  id: number;
  customer: string;
  product: string;
  quantity: number;
  total: number;
  status: string;
};

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<Order[]>('http://10.55.46.97:8000/api/orders')
      .then((response) => {
        setOrders(response.data);
      })
      .catch((requestError: unknown) => {
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Failed to load orders.',
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <View>
      {loading && (
        <View style={styles.stateCard}>
          <ActivityIndicator color="#f20f53" accessibilityLabel="Loading orders" />
          <Text style={styles.stateText}>Fetching your latest orders…</Text>
        </View>
      )}
      {!loading && !error && orders?.length === 0 && (
        <View style={styles.stateCard}>
          <Text style={styles.stateText}>No orders yet.</Text>
        </View>
      )}
      {orders?.map((order) => (
        <View key={order.id} style={styles.card}>
          <View style={styles.cardTop}>
            <View>
              <Text style={styles.orderLabel}>ORDER</Text>
              <Text style={styles.orderNumber}>#{String(order.id).padStart(4, '0')}</Text>
            </View>
            <View style={[
              styles.statusBadge,
              order.status.toLowerCase() === 'completed' ? styles.statusCompleted : styles.statusPending,
            ]}>
              <Text style={[
                styles.statusText,
                order.status.toLowerCase() === 'completed' ? styles.statusTextCompleted : styles.statusTextPending,
              ]}>
                {order.status}
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          <Text style={styles.customer}>{order.customer}</Text>
          <Text style={styles.productLine}>{order.product} <Text style={styles.quantity}>× {order.quantity}</Text></Text>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>ORDER TOTAL</Text>
            <Text style={styles.total}>₱{Number(order.total).toFixed(2)}</Text>
          </View>
        </View>
      ))}
      {error && (
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>Couldn’t load orders</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ecebed',
    shadowColor: '#27232b',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderLabel: {
    color: '#aaa6ad',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.7,
  },
  orderNumber: {
    color: '#28262d',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 3,
  },
  statusBadge: {
    borderRadius: 14,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  statusCompleted: {
    backgroundColor: '#e8f2e8',
  },
  statusPending: {
    backgroundColor: '#ffe4eb',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  statusTextCompleted: {
    color: '#52754d',
  },
  statusTextPending: {
    color: '#cf1048',
  },
  divider: {
    height: 1,
    backgroundColor: '#efedef',
    marginVertical: 14,
  },
  customer: {
    color: '#28262d',
    fontSize: 15,
    fontWeight: '700',
  },
  productLine: {
    color: '#77737b',
    fontSize: 13,
    marginTop: 5,
  },
  quantity: {
    color: '#aaa6ad',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  totalLabel: {
    color: '#aaa6ad',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  total: {
    color: '#f20f53',
    fontSize: 19,
    fontWeight: '800',
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
});
