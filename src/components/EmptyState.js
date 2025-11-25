import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from '../components/Icon';

import { colors } from '../utils/colors';

export default function EmptyState({ 
  icon = 'inbox', 
  title = 'No items found', 
  subtitle,
  isDarkMode 
}) {
  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}10` }]}>
        <Icon name={icon} size={48} color={colors.primary} />
      </View>
      <Text style={[styles.title, isDarkMode && styles.textDark]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, isDarkMode && styles.textLight]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  textDark: {
    color: colors.textDark,
  },
  textLight: {
    color: colors.textLight,
  },
});