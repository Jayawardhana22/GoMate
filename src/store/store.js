import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import transportReducer from './transportSlice';
import themeReducer from './themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transport: transportReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});