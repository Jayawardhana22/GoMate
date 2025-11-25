import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const themeSlice = createSlice({
  name: 'theme',
  initialState: { isDarkMode: false },
  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
      AsyncStorage.setItem('darkMode', JSON.stringify(state.isDarkMode));
    },
    setTheme: (state, action) => {
      state.isDarkMode = action.payload;
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;