import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import axios from 'axios';

type Customer = {
  id: number;
  name: string;
  email: string;
  address: string;
};

export default function CustomersScreen() {
  const [customers, setCustomers] = useState<Customer[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<Customer[]>('http://10.55.46.97:8000/api/customers')
      .then((response) => {
        setCustomers(response.data);
      })
      .catch((requestError: unknown) => {
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Failed to load customers.',
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <View>
      {loading && <View style={styles.stateCard}><ActivityIndicator color="#f20f53" accessibilityLabel="Loading guests" /><Text style={styles.stateText}>Welcoming our guests…</Text></View>}
      {!loading && !error && customers?.length === 0 && (
        <View style={styles.stateCard}><Text style={styles.stateText}>No guest profiles yet.</Text></View>
      )}
      {customers?.map((customer) => (
        <View key={customer.id} style={styles.card}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {customer.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}
            </Text>
          </View>
          <View style={styles.details}>
            <Text style={styles.name}>{customer.name}</Text>
            <Text style={styles.email}>{customer.email}</Text>
            <Text style={styles.address}>⌖  {customer.address}</Text>
          </View>
        </View>
      ))}
      {error && <View style={styles.errorCard}><Text style={styles.errorTitle}>Guest list unavailable</Text><Text style={styles.errorText}>{error}</Text></View>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 15,
    marginBottom: 11,
    borderWidth: 1,
    borderColor: '#ecebed',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 17,
    backgroundColor: '#f20f53',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14,
  },
  details: {
    flex: 1,
    marginLeft: 13,
  },
  name: {
    color: '#28262d',
    fontSize: 14,
    fontWeight: '800',
  },
  email: {
    color: '#85818a',
    fontSize: 11,
    marginTop: 4,
  },
  address: {
    color: '#aaa6ad',
    fontSize: 10,
    marginTop: 5,
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
