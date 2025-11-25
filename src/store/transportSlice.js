import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { transportApi } from '../api/transportApi';

export const fetchTransportData = createAsyncThunk(
  'transport/fetchData',
  async (mode = 'tube,bus,train') => {
    const data = await transportApi.getLineStatus(mode);
    return data;
  }
);

const transportSlice = createSlice({
  name: 'transport',
  initialState: {
    items: [],
    favorites: [],
    loading: false,
    error: null,
    searchQuery: '',
  },
  reducers: {
    toggleFavorite: (state, action) => {
      const item = action.payload;
      const exists = state.favorites.find((fav) => fav.id === item.id);
      
      if (exists) {
        state.favorites = state.favorites.filter((fav) => fav.id !== item.id);
      } else {
        state.favorites.push(item);
      }
      
      // Persist to AsyncStorage
      AsyncStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
    loadFavorites: (state, action) => {
      state.favorites = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransportData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransportData.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTransportData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { toggleFavorite, loadFavorites, setSearchQuery } = transportSlice.actions;
export default transportSlice.reducer;