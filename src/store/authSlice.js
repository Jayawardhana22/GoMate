import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../api/transportApi';

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const data = await authApi.login(username, password);
     
      // --- FIX STARTS HERE ---
     
      // 1. DummyJSON returns 'accessToken', not 'token'.
      // We check for both just to be safe.
      const token = data.accessToken || data.token;
     
      if (token) {
        await AsyncStorage.setItem('userToken', token);
      } else {
        console.warn('No access token found in response');
      }
      // 2. Save User Data
      await AsyncStorage.setItem('userData', JSON.stringify(data));
     
      // --- FIX ENDS HERE ---
      return data;
    } catch (error) {
      console.error('Redux Error:', error); // Log the actual error
      return rejectWithValue(error.response?.data || error.message || 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      AsyncStorage.multiRemove(['userToken', 'userData']);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;   