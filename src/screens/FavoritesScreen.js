import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TransportCard from '../components/TransportCard';
import EmptyState from '../components/EmptyState';
import { loadFavorites } from '../store/transportSlice';
import { colors } from '../utils/colors';

export default function FavoritesScreen({ navigation }) {
  const dispatch = useDispatch();
  const { favorites } = useSelector((state) => state.transport);
  const { isDarkMode } = useSelector((state) => state.theme);

  useEffect(() => {
    loadFavoritesFromStorage();
  }, []);

  const loadFavoritesFromStorage = async () => {
    try {
      const stored = await AsyncStorage.getItem('favorites');
      if (stored) {
        dispatch(loadFavorites(JSON.parse(stored)));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      {favorites.length === 0 ? (
        <EmptyState
          icon="heart"
          title="No Favorites Yet"
          subtitle="Start adding your favorite transport lines!"
          isDarkMode={isDarkMode}
        />
      ) : (
        <FlatList
          data={favorites}
          renderItem={({ item }) => (
            <TransportCard
              item={item}
              onPress={() => navigation.navigate('Details', { item })}
              isDarkMode={isDarkMode}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
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
});