import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import axios from 'axios';

type HealthResponse = {
  status: string;
  service: string;
  message: string;
};

export default function HomeScreen() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<HealthResponse>('http://10.55.46.97:8000/api/health')
      .then((response) => {
        setHealth(response.data);
      })
      .catch((requestError: unknown) => {
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Failed to load API status.',
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.welcomeCard}>
        <View style={styles.welcomeTop}>
          <Text style={styles.welcomeEyebrow}>UNCLE RUPERT'S KITCHEN</Text>
          <Text style={styles.welcomeEmoji}>🍔</Text>
        </View>
        <Text style={styles.welcomeTitle}>Welcome to{"\n"}your happy place.</Text>
        <Text style={styles.welcomeCopy}>Comfort food, made fresh and served with a smile.</Text>
        <View style={styles.welcomeAccent} />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Kitchen status</Text>
        <Text style={styles.liveLabel}>LIVE</Text>
      </View>
      <View style={styles.statusCard}>
        <View style={styles.statusIcon}><Text style={styles.statusEmoji}>✦</Text></View>
        <View style={styles.statusCopy}>
          <Text style={styles.statusTitle}>We’re ready for you</Text>
          <Text style={styles.statusDescription}>
            {health?.message ?? (loading ? 'Checking the kitchen…' : 'Kitchen status unavailable')}
          </Text>
        </View>
        {loading ? (
          <ActivityIndicator color="#f20f53" accessibilityLabel="Loading API status" />
        ) : (
          <View style={[styles.connectionDot, error ? styles.offlineDot : null]} />
        )}
      </View>
      {health && (
        <Text style={styles.serviceText}>
          {health.status === 'ok' ? 'CONNECTED' : health.status.toUpperCase()} · {health.service}
        </Text>
      )}
      {error && <Text style={styles.errorText}>Could not connect to the API: {error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  welcomeCard: {
    backgroundColor: '#f20f53',
    borderRadius: 22,
    padding: 21,
    overflow: 'hidden',
    minHeight: 190,
  },
  welcomeTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeEyebrow: {
    color: '#ffe0e9',
    fontWeight: '800',
    fontSize: 9,
    letterSpacing: 1.8,
  },
  welcomeEmoji: {
    fontSize: 28,
  },
  welcomeTitle: {
    color: '#ffffff',
    fontSize: 27,
    fontWeight: '800',
    letterSpacing: -0.7,
    lineHeight: 32,
    marginTop: 15,
  },
  welcomeCopy: {
    color: '#ffe1e9',
    fontSize: 12,
    marginTop: 8,
    maxWidth: 230,
    lineHeight: 18,
  },
  welcomeAccent: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 20,
    borderColor: '#e7134f',
    right: -32,
    bottom: -42,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  sectionTitle: {
    color: '#24232a',
    fontSize: 16,
    fontWeight: '800',
  },
  liveLabel: {
    color: '#85818a',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ecebed',
  },
  statusIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#fff0f4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusEmoji: {
    color: '#f20f53',
    fontSize: 20,
  },
  statusCopy: {
    flex: 1,
    marginLeft: 12,
  },
  statusTitle: {
    color: '#24232a',
    fontSize: 13,
    fontWeight: '800',
  },
  statusDescription: {
    color: '#85818a',
    fontSize: 11,
    marginTop: 4,
  },
  connectionDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#f20f53',
    marginLeft: 8,
  },
  offlineDot: {
    backgroundColor: '#88858b',
  },
  serviceText: {
    color: '#aaa7ad',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 9,
    letterSpacing: 1.2,
  },
  errorText: {
    color: '#b30b3d',
    backgroundColor: '#fff0f4',
    padding: 13,
    borderRadius: 14,
    fontSize: 12,
  },
});
