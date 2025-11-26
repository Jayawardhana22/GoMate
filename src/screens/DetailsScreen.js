import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import Icon from '../components/Icon';

import { toggleFavorite, fetchArrivals, clearArrivals } from '../store/transportSlice';
import { colors } from '../utils/colors';
import { getStatusColor } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';

export default function DetailsScreen({ route, navigation }) {
  const { item } = route.params;
  const dispatch = useDispatch();
  
  // REMOVED 'map' from state
  const [activeTab, setActiveTab] = useState('status'); 
  
  const { favorites, arrivals, arrivalsLoading } = useSelector((state) => state.transport);
  const { isDarkMode } = useSelector((state) => state.theme);

  const isFavorite = favorites.some((fav) => fav.id === item.id);
  const statusInfo = item.lineStatuses?.[0] || {};
  const statusColor = getStatusColor(statusInfo.statusSeverityDescription);

  useEffect(() => {
    if (activeTab === 'arrivals') {
      dispatch(fetchArrivals(item.id));
    }
  }, [activeTab]);

  useEffect(() => {
    return () => dispatch(clearArrivals());
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    return mins === 0 ? 'Due' : `${mins} min`;
  };

  const renderTabs = () => (
    <View style={[styles.tabContainer, isDarkMode && styles.tabContainerDark]}>
      {/* REMOVED 'map' from this list */}
      {['status', 'arrivals'].map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[
            styles.tab,
            activeTab === tab && styles.activeTab,
            activeTab === tab && { backgroundColor: `${colors.primary}15` }
          ]}
          onPress={() => setActiveTab(tab)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === tab && styles.activeTabText,
              isDarkMode && activeTab !== tab && styles.textLight
            ]}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderStatusView = () => (
    <View style={styles.content}>
      <View style={[styles.card, isDarkMode && styles.cardDark]}>
        <View style={styles.cardHeader}>
          <Icon name="activity" size={24} color={colors.primary} />
          <Text style={[styles.cardTitle, isDarkMode && styles.textDark]}>
            Current Status
          </Text>
        </View>

        <View style={[styles.statusBadgeLarge, { backgroundColor: `${statusColor}15` }]}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusTextLarge, { color: statusColor }]}>
            {statusInfo.statusSeverityDescription || 'Unknown Status'}
          </Text>
        </View>

        {statusInfo.reason && (
          <View style={[styles.reasonContainer, isDarkMode && { backgroundColor: colors.darkBg }]}>
            <Icon name="info" size={16} color={colors.textLight} />
            <Text style={[styles.reasonText, isDarkMode && styles.textLight]}>
              {statusInfo.reason}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderArrivalsView = () => {
    if (arrivalsLoading) return <LoadingSpinner isDarkMode={isDarkMode} />;
    
    if (arrivals.length === 0) {
      return (
        <View style={styles.emptyState}>
           <Icon name="clock" size={48} color={colors.textLight} />
           <Text style={[styles.emptyText, isDarkMode && styles.textLight]}>No upcoming arrivals</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={arrivals}
        keyExtractor={(item, index) => item.id + index}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={arrivalsLoading} onRefresh={() => dispatch(fetchArrivals(item.id))} />
        }
        renderItem={({ item }) => (
          <View style={[styles.arrivalCard, isDarkMode && styles.cardDark]}>
            <View style={styles.arrivalLeft}>
              <View style={[styles.lineNumberBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.lineNumberText}>{item.lineName}</Text>
              </View>
              <View style={styles.arrivalInfo}>
                <Text style={[styles.destinationText, isDarkMode && styles.textDark]}>
                  {item.destinationName}
                </Text>
                <Text style={styles.platformText}>{item.platformName}</Text>
              </View>
            </View>
            <View style={styles.arrivalRight}>
              <Text style={styles.timeText}>{formatTime(item.timeToStation)}</Text>
              <Icon name="activity" size={14} color={colors.success} />
            </View>
          </View>
        )}
      />
    );
  };

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      {/* Header */}
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
           <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.headerTitle}>{item.name}</Text>
            <TouchableOpacity
              onPress={() => dispatch(toggleFavorite(item))}
              style={{ marginLeft: 12, padding: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 50 }}
            >
              <Icon
                name="heart"
                size={24}
                color={isFavorite ? colors.error : colors.white}
                fill={isFavorite ? colors.error : 'none'}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerSubtitle}>
            {item.modeName?.toUpperCase()} LINE
          </Text>
        </View>
      </LinearGradient>

      {/* Tabs */}
      {renderTabs()}

      {/* Content */}
      <View style={styles.mainContent}>
        {activeTab === 'status' && <ScrollView>{renderStatusView()}</ScrollView>}
        {activeTab === 'arrivals' && renderArrivalsView()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.lightBg },
  containerDark: { backgroundColor: colors.darkBg },
  header: { padding: 24, paddingTop: 20, paddingBottom: 30 },
  headerContent: { alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: colors.white },
  headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.9)', fontWeight: '500' },
  
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: 6,
    margin: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  tabContainerDark: { backgroundColor: colors.darkCard },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  activeTab: { backgroundColor: colors.lightBg },
  tabText: { fontWeight: '600', color: colors.textSecondary },
  activeTabText: { color: colors.primary },
  textLight: { color: colors.textLight },
  
  mainContent: { flex: 1 },
  content: { padding: 16 },
  
  card: {
    backgroundColor: colors.white, borderRadius: 16, padding: 20, marginBottom: 16,
    elevation: 2, shadowColor: colors.black, shadowOpacity: 0.1, shadowRadius: 8,
  },
  cardDark: { backgroundColor: colors.darkCard, borderWidth: 1, borderColor: colors.darkBorder },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginLeft: 12 },
  textDark: { color: colors.textDark },
  
  statusBadgeLarge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12 },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  statusTextLarge: { fontSize: 16, fontWeight: '600' },
  reasonContainer: { flexDirection: 'row', marginTop: 16, padding: 12, backgroundColor: colors.lightBg, borderRadius: 8 },
  reasonText: { flex: 1, marginLeft: 8, fontSize: 14, color: colors.textSecondary, lineHeight: 20 },

  listContent: { padding: 16 },
  arrivalCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.white, padding: 16, borderRadius: 12, marginBottom: 12,
    elevation: 1, shadowColor: '#000', shadowOpacity: 0.05,
  },
  arrivalLeft: { flexDirection: 'row', alignItems: 'center' },
  lineNumberBadge: { width: 45, height: 35, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  lineNumberText: { color: colors.white, fontWeight: 'bold' },
  arrivalInfo: { justifyContent: 'center' },
  destinationText: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  platformText: { fontSize: 12, color: colors.textSecondary },
  arrivalRight: { alignItems: 'flex-end' },
  timeText: { fontSize: 18, fontWeight: 'bold', color: colors.primary, marginBottom: 4 },
  
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyText: { marginTop: 16, color: colors.textSecondary },
});