import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import axios from 'axios';

type OrderingStats = {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  monthlyRevenue: number;
};

export default function StatsScreen() {
  const [stats, setStats] = useState<OrderingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<OrderingStats>('http://10.55.46.97:8000/api/stats')
      .then((response) => {
        setStats(response.data);
      })
      .catch((requestError: unknown) => {
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Failed to load ordering statistics.',
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      {loading && <View style={styles.stateCard}><ActivityIndicator color="#f20f53" accessibilityLabel="Loading ordering statistics" /><Text style={styles.stateText}>Gathering today’s numbers…</Text></View>}
      {stats && (
        <>
          <View style={styles.revenueCard}>
            <Text style={styles.revenueLabel}>MONTHLY REVENUE</Text>
            <Text style={styles.revenueValue}>₱{stats.monthlyRevenue.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</Text>
            <Text style={styles.revenueNote}>A good month, made together.</Text>
            <Text style={styles.revenueDecoration}>₱</Text>
          </View>
          <View style={styles.grid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricIcon}>▦</Text>
              <Text style={styles.metricValue}>{stats.totalOrders}</Text>
              <Text style={styles.metricLabel}>TOTAL ORDERS</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricIcon}>♙</Text>
              <Text style={styles.metricValue}>{stats.totalCustomers}</Text>
              <Text style={styles.metricLabel}>HAPPY GUESTS</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricIcon}>✦</Text>
              <Text style={styles.metricValue}>{stats.totalProducts}</Text>
              <Text style={styles.metricLabel}>MENU ITEMS</Text>
            </View>
          </View>
        </>
      )}
      {!loading && !error && !stats && <View style={styles.stateCard}><Text style={styles.stateText}>No statistics available.</Text></View>}
      {error && <View style={styles.errorCard}><Text style={styles.errorTitle}>Insights unavailable</Text><Text style={styles.errorText}>{error}</Text></View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 13,
  },
  revenueCard: {
    backgroundColor: '#f20f53',
    borderRadius: 22,
    padding: 20,
    overflow: 'hidden',
  },
  revenueLabel: {
    color: '#ffcfdb',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.7,
  },
  revenueValue: {
    color: '#ffffff',
    fontSize: 29,
    fontWeight: '800',
    letterSpacing: -0.8,
    marginTop: 12,
  },
  revenueNote: {
    color: '#ffe1e9',
    fontSize: 11,
    marginTop: 6,
  },
  revenueDecoration: {
    position: 'absolute',
    right: 13,
    bottom: -28,
    color: '#df0c4b',
    fontSize: 108,
    fontWeight: '900',
  },
  grid: {
    flexDirection: 'row',
    gap: 9,
  },
  metricCard: {
    flex: 1,
    minHeight: 116,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ecebed',
    padding: 12,
    justifyContent: 'space-between',
  },
  metricIcon: {
    color: '#f20f53',
    fontSize: 17,
    fontWeight: '800',
  },
  metricValue: {
    color: '#28262d',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 6,
  },
  metricLabel: {
    color: '#85818a',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginTop: 4,
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
