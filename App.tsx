import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import AnnouncementsScreen from './src/screens/AnnouncementsScreen';
import CustomersScreen from './src/screens/CustomersScreen';
import HomeScreen from './src/screens/HomeScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import ProductsScreen from './src/screens/ProductsScreen';
import StatsScreen from './src/screens/StatsScreen';

const screens = [
  { key: 'home', label: 'Overview', component: HomeScreen },
  { key: 'stats', label: 'Insights', component: StatsScreen },
  { key: 'products', label: 'Menu', component: ProductsScreen },
  { key: 'orders', label: 'Orders', component: OrdersScreen },
  { key: 'announcements', label: 'Offers', component: AnnouncementsScreen },
  { key: 'customers', label: 'Guests', component: CustomersScreen },
];

export default function App() {
  const [activeScreen, setActiveScreen] = useState('home');

  const activeTab = screens.find((screen) => screen.key === activeScreen) ?? screens[0];
  const ActiveComponent = activeTab.component;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.brandMark}>
          <Text style={styles.brandMarkText}>UR</Text>
        </View>
        <View style={styles.brandCopy}>
          <Text style={styles.brandName}>Uncle Rupert</Text>
          <Text style={styles.brandSubtitle}>KITCHEN &amp; GRILL</Text>
        </View>
        <View style={styles.openBadge}>
          <View style={styles.openDot} />
          <Text style={styles.openText}>OPEN</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        style={styles.tabsScroll}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabRow}
      >
        {screens.map((screen) => {
          const selected = activeScreen === screen.key;

          return (
            <TouchableOpacity
              key={screen.key}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => setActiveScreen(screen.key)}
              style={[styles.tab, selected && styles.tabSelected]}
            >
              <Text style={[styles.tabText, selected && styles.tabTextSelected]}>
                {screen.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView
        style={styles.mainScroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pageHeading}>
          <Text style={styles.eyebrow}>UNCLE RUPERT'S</Text>
          <Text style={styles.pageTitle}>{activeTab.label}</Text>
          <Text style={styles.pageSubtitle}>Good food, good mood.</Text>
        </View>
        <ActiveComponent />
        <Text style={styles.footer}>MADE FRESH. SERVED WITH HEART.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f2',
    paddingTop: 12,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 18,
  },
  brandMark: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#f20f53',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-4deg' }],
  },
  brandMarkText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -1,
    transform: [{ rotate: '4deg' }],
  },
  brandCopy: {
    marginLeft: 12,
    flex: 1,
  },
  brandName: {
    color: '#24232a',
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    marginTop: 2,
    color: '#85818a',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 2,
  },
  openBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff0f4',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  openDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#f20f53',
    marginRight: 6,
  },
  openText: {
    color: '#cf1048',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 8,
  },
  tabsScroll: {
    flexGrow: 0,
    flexShrink: 0,
    height: 54,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 18,
    backgroundColor: '#e9e9e7',
  },
  tabSelected: {
    backgroundColor: '#f20f53',
  },
  tabText: {
    color: '#68656a',
    fontWeight: '700',
    fontSize: 12,
  },
  tabTextSelected: {
    color: '#ffffff',
  },
  mainScroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 32,
  },
  pageHeading: {
    marginBottom: 19,
  },
  eyebrow: {
    color: '#f20f53',
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 5,
  },
  pageTitle: {
    color: '#24232a',
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    letterSpacing: -1,
  },
  pageSubtitle: {
    color: '#85818a',
    fontSize: 13,
    marginTop: 4,
  },
  footer: {
    textAlign: 'center',
    color: '#aaa7ad',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: 28,
  },
});
