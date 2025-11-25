import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../utils/colors';

export default function LoadingSpinner({ isDarkMode }) {
  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.lightBg,
  },
  containerDark: {
    backgroundColor: colors.darkBg,
  },
});