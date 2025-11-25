import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import Icon from '../components/Icon'; // <--- Using Custom Icon Component

import { toggleFavorite } from '../store/transportSlice';
import { colors } from '../utils/colors';
import { getStatusColor } from '../utils/helpers';

export default function DetailsScreen({ route, navigation }) {
  const { item } = route.params;
  const dispatch = useDispatch();
  const { favorites } = useSelector((state) => state.transport);
  const { isDarkMode } = useSelector((state) => state.theme);

  const isFavorite = favorites.some((fav) => fav.id === item.id);
  const statusInfo = item.lineStatuses?.[0] || {};
  const statusColor = getStatusColor(statusInfo.statusSeverityDescription);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => dispatch(toggleFavorite(item))}
          style={styles.headerButton}
        >
          {/* FIX: Changed Feather to Icon */}
          <Icon
            name="heart"
            size={24}
            color={isFavorite ? colors.error : colors.white}
            fill={isFavorite ? colors.error : 'transparent'}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, isFavorite]);

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Gradient */}
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{item.name}</Text>
            <Text style={styles.headerSubtitle}>
              {item.modeName?.toUpperCase()} LINE
            </Text>
          </View>
        </LinearGradient>

        {/* Content */}
        <View style={styles.content}>
          {/* Status Card */}
          <View style={[styles.card, isDarkMode && styles.cardDark]}>
            <View style={styles.cardHeader}>
              <Icon name="activity" size={24} color={colors.primary} />
              <Text style={[styles.cardTitle, isDarkMode && styles.textDark]}>
                Current Status
              </Text>
            </View>

            <View
              style={[
                styles.statusBadgeLarge,
                { backgroundColor: `${statusColor}15` },
              ]}
            >
              <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
              <Text style={[styles.statusTextLarge, { color: statusColor }]}>
                {statusInfo.statusSeverityDescription || 'Unknown Status'}
              </Text>
            </View>

            {statusInfo.reason && (
              <View style={styles.reasonContainer}>
                <Icon name="info" size={16} color={colors.textLight} />
                <Text style={[styles.reasonText, isDarkMode && styles.textLight]}>
                  {statusInfo.reason}
                </Text>
              </View>
            )}
          </View>

          {/* Details Card */}
          <View style={[styles.card, isDarkMode && styles.cardDark]}>
            <View style={styles.cardHeader}>
              <Icon name="list" size={24} color={colors.primary} />
              <Text style={[styles.cardTitle, isDarkMode && styles.textDark]}>
                Line Details
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Icon name="map-pin" size={20} color={colors.textLight} />
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, isDarkMode && styles.textLight]}>
                  Mode
                </Text>
                <Text style={[styles.detailValue, isDarkMode && styles.textDark]}>
                  {item.modeName?.charAt(0).toUpperCase() + item.modeName?.slice(1)}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Icon name="tag" size={20} color={colors.textLight} />
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, isDarkMode && styles.textLight]}>
                  Line ID
                </Text>
                <Text style={[styles.detailValue, isDarkMode && styles.textDark]}>
                  {item.id}
                </Text>
              </View>
            </View>

            {statusInfo.validityPeriods?.[0] && (
              <View style={styles.detailRow}>
                <Icon name="calendar" size={20} color={colors.textLight} />
                <View style={styles.detailContent}>
                  <Text style={[styles.detailLabel, isDarkMode && styles.textLight]}>
                    Valid From
                  </Text>
                  <Text style={[styles.detailValue, isDarkMode && styles.textDark]}>
                    {new Date(
                      statusInfo.validityPeriods[0].fromDate
                    ).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
            onPress={() => dispatch(toggleFavorite(item))}
          >
            {/* FIX: Changed Feather to Icon */}
            <Icon
              name="heart"
              size={20}
              color={isFavorite ? colors.white : colors.primary}
              fill={isFavorite ? colors.white : 'transparent'}
            />
            <Text
              style={[
                styles.favoriteButtonText,
                isFavorite && styles.favoriteButtonTextActive,
              ]}
            >
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  header: {
    padding: 24,
    paddingTop: 40,
    paddingBottom: 60,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  headerButton: {
    marginRight: 16,
    padding: 4,
  },
  content: {
    padding: 16,
    marginTop: -40,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardDark: {
    backgroundColor: colors.darkCard,
    borderColor: colors.darkBorder,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginLeft: 12,
  },
  statusBadgeLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  statusTextLarge: {
    fontSize: 16,
    fontWeight: '600',
  },
  reasonContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
    padding: 12,
    backgroundColor: colors.lightBg,
    borderRadius: 8,
  },
  reasonText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightBg,
  },
  detailContent: {
    flex: 1,
    marginLeft: 16,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  favoriteButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  favoriteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 8,
  },
  favoriteButtonTextActive: {
    color: colors.white,
  },
  textDark: {
    color: colors.textDark,
  },
  textLight: {
    color: colors.textLight,
  },
});