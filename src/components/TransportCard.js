import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from '../components/Icon';

import { colors } from '../utils/colors';
import { getStatusColor, getTransportIcon } from '../utils/helpers';

export default function TransportCard({ item, onPress, isDarkMode }) {
  const statusInfo = item.lineStatuses?.[0] || {};
  const statusColor = getStatusColor(statusInfo.statusSeverityDescription);
  
  return (
    <TouchableOpacity
      style={[styles.card, isDarkMode && styles.cardDark]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}20` }]}>
          <Icon 
            name={getTransportIcon(item.modeName)} 
            size={24} 
            color={colors.primary} 
          />
        </View>
        
        <View style={styles.headerText}>
          <Text style={[styles.title, isDarkMode && styles.textDark]}>
            {item.name}
          </Text>
          <Text style={[styles.subtitle, isDarkMode && styles.textSecondary]}>
            {item.modeName?.toUpperCase()} LINE
          </Text>
        </View>
        
        <Icon name="chevron-right" size={24} color={colors.textLight} />
      </View>
      
      <View style={styles.statusContainer}>
        <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>
            {statusInfo.statusSeverityDescription || 'Unknown'}
          </Text>
        </View>
      </View>
      
      {statusInfo.reason && (
        <Text 
          style={[styles.reasonText, isDarkMode && styles.textSecondary]} 
          numberOfLines={2}
        >
          {statusInfo.reason}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
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
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  statusContainer: {
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  reasonText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 8,
    lineHeight: 18,
  },
  textDark: {
    color: colors.textDark,
  },
  textSecondary: {
    color: colors.textLight,
  },
});