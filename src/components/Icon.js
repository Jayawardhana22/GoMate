import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const iconMap = {
  'map': '🗺️',
  'user': '👤',
  'lock': '🔒',
  'heart': '❤️',
  'search': '🔍',
  'chevron-right': '›',
  'arrow-left': '←',
  'activity': '📊',
  'clock': '⏰',
  'alert-circle': '⚠️',
  'map-pin': '📍',
  'list': '📋',
  'tag': '🏷️',
  'calendar': '📅',
  'info': 'ℹ️',
  'inbox': '📥',
  'bell': '🔔',
  'help-circle': '❓',
  'file-text': '📄',
  'log-out': '🚪',
  'moon': '🌙',
  'eye': '👁️',
  'eye-off': '👁️',
  'mail': '✉️',
  'circle': '⭕',
  'zap': '⚡',
  'anchor': '⚓',
  'x': '✕',
};

export default function Icon({ name, size = 24, color = '#000', style, fill }) {
  const emoji = iconMap[name] || '•';
  
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.icon, { fontSize: size * 0.8 }]}>
        {emoji}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    textAlign: 'center',
  },
});