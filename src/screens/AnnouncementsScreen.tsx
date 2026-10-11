import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import axios from 'axios';

type Announcement = {
  id: number;
  title: string;
  description: string;
};

export default function AnnouncementsScreen() {
  const [announcements, setAnnouncements] = useState<Announcement[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<Announcement[]>('http://10.55.46.97:8000/api/announcements')
      .then((response) => {
        setAnnouncements(response.data);
      })
      .catch((requestError: unknown) => {
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Failed to load announcements.',
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <View>
      {loading && <View style={styles.stateCard}><ActivityIndicator color="#f20f53" accessibilityLabel="Loading offers" /><Text style={styles.stateText}>Checking today’s specials…</Text></View>}
      {!loading && !error && announcements?.length === 0 && (
        <View style={styles.stateCard}><Text style={styles.stateText}>No special offers right now. Check back soon!</Text></View>
      )}
      {announcements?.map((announcement, index) => (
        <View key={announcement.id} style={styles.card}>
          <View style={styles.icon}><Text style={styles.iconText}>{index === 0 ? '✦' : '♡'}</Text></View>
          <View style={styles.copy}>
            <Text style={styles.offerLabel}>A LITTLE TREAT</Text>
            <Text style={styles.title}>{announcement.title}</Text>
            <Text style={styles.description}>{announcement.description}</Text>
          </View>
        </View>
      ))}
      {error && <View style={styles.errorCard}><Text style={styles.errorTitle}>Offers unavailable</Text><Text style={styles.errorText}>{error}</Text></View>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ecebed',
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: '#fff0f4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: '#f20f53',
    fontSize: 20,
    fontWeight: '800',
  },
  copy: {
    flex: 1,
    marginLeft: 13,
  },
  offerLabel: {
    color: '#cf1048',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  title: {
    color: '#28262d',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 4,
  },
  description: {
    color: '#85818a',
    fontSize: 12,
    lineHeight: 18,
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
    textAlign: 'center',
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
