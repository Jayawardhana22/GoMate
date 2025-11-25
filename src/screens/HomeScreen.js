import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from '../components/Icon';

import { fetchTransportData, setSearchQuery } from '../store/transportSlice';
import TransportCard from '../components/TransportCard';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import { colors } from '../utils/colors';

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { items, loading, searchQuery } = useSelector((state) => state.transport);
  const { isDarkMode } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.auth);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await dispatch(fetchTransportData()).unwrap();
    } catch (error) {
      console.error('Failed to load transport data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const filteredItems = items.filter((item) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.greetingContainer}>
        <Text style={[styles.greeting, isDarkMode && styles.textDark]}>
          Hello, {user?.firstName || 'Traveler'}! 👋
        </Text>
        <Text style={[styles.subGreeting, isDarkMode && styles.textLight]}>
          Check live transport status
        </Text>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={(text) => dispatch(setSearchQuery(text))}
        placeholder="Search transport lines..."
        isDarkMode={isDarkMode}
      />

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, isDarkMode && styles.statCardDark]}>
          <Icon name="activity" size={24} color={colors.primary} />
          <Text style={[styles.statNumber, isDarkMode && styles.textDark]}>
            {items.length}
          </Text>
          <Text style={[styles.statLabel, isDarkMode && styles.textLight]}>
            Active Lines
          </Text>
        </View>

        <View style={[styles.statCard, isDarkMode && styles.statCardDark]}>
          <Icon name="clock" size={24} color={colors.success} />
          <Text style={[styles.statNumber, isDarkMode && styles.textDark]}>
            {items.filter(i => 
              i.lineStatuses?.[0]?.statusSeverityDescription?.includes('Good')
            ).length}
          </Text>
          <Text style={[styles.statLabel, isDarkMode && styles.textLight]}>
            On Time
          </Text>
        </View>

        <View style={[styles.statCard, isDarkMode && styles.statCardDark]}>
          <Icon name="alert-circle" size={24} color={colors.warning} />
          <Text style={[styles.statNumber, isDarkMode && styles.textDark]}>
            {items.filter(i => 
              i.lineStatuses?.[0]?.statusSeverityDescription?.includes('Delay') ||
              i.lineStatuses?.[0]?.statusSeverityDescription?.includes('Minor')
            ).length}
          </Text>
          <Text style={[styles.statLabel, isDarkMode && styles.textLight]}>
            Delayed
          </Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, isDarkMode && styles.textDark]}>
        Live Transport Status
      </Text>
    </View>
  );

  if (loading && items.length === 0) {
    return <LoadingSpinner isDarkMode={isDarkMode} />;
  }

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <FlatList
        ListHeaderComponent={renderHeader}
        data={filteredItems}
        renderItem={({ item }) => (
          <TransportCard
            item={item}
            onPress={() => navigation.navigate('Details', { item })}
            isDarkMode={isDarkMode}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="search"
            title="No transport lines found"
            subtitle="Try a different search term"
            isDarkMode={isDarkMode}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBg,
  },
  containerDark: {
    backgroundColor: colors.darkBg,
  },
  listContent: {
    padding: 16,
  },
  headerContainer: {
    marginBottom: 20,
  },
  greetingContainer: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statCardDark: {
    backgroundColor: colors.darkCard,
    borderColor: colors.darkBorder,
    borderWidth: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  textDark: {
    color: colors.textDark,
  },
  textLight: {
    color: colors.textLight,
  },
});