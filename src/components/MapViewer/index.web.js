import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from '../Icon'; // Adjust path
import { colors } from '../../utils/colors'; // Adjust path

export default function MapViewer() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Icon name="map" size={48} color={colors.textLight} />
        <Text style={styles.title}>Map not available on Web</Text>
        <Text style={styles.subtitle}>
          Please use the mobile app to view live bus tracking.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    height: 300, 
    backgroundColor: '#F3F4F6', 
    borderRadius: 16, 
    justifyContent: 'center', 
    alignItems: 'center',
    margin: 16
  },
  content: { alignItems: 'center' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#374151', marginTop: 12 },
  subtitle: { fontSize: 14, color: '#9CA3AF', marginTop: 4 },
});