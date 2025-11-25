import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from '../components/Icon';

import { colors } from '../utils/colors';

export default function SearchBar({ value, onChangeText, placeholder, isDarkMode }) {
  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <Icon name="search" size={20} color={colors.textLight} />
      <TextInput
        style={[styles.input, isDarkMode && styles.inputDark]}
        placeholder={placeholder || 'Search...'}
        placeholderTextColor={colors.textLight}
        value={value}
        onChangeText={onChangeText}
      />
      {value.length > 0 && (
        <Icon
          name="x" 
          size={20} 
          color={colors.textLight} 
          onPress={() => onChangeText('')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  containerDark: {
    backgroundColor: colors.darkCard,
    borderColor: colors.darkBorder,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: colors.textPrimary,
  },
  inputDark: {
    color: colors.textDark,
  },
});