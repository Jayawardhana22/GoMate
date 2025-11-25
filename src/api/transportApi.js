import axios from 'axios';
import { API_CONFIG } from '../utils/constants';

// Define endpoints
export const endpoints = {
  // Transport for London API
  lineStatus: (mode) => `/Line/Mode/${mode}/Status`,
  
  // DummyJSON for auth
  login: 'https://dummyjson.com/auth/login',
};

// Create axios instance
const tflApi = axios.create({
  baseURL: API_CONFIG.TFL_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
});

// --- ADDED MOCK DATA HERE ---
const MOCK_DATA = [
  {
    id: 'central',
    name: 'Central',
    modeName: 'tube',
    lineStatuses: [{ statusSeverityDescription: 'Good Service' }]
  },
  {
    id: 'bakerloo',
    name: 'Bakerloo',
    modeName: 'tube',
    lineStatuses: [{ 
      statusSeverityDescription: 'Minor Delays', 
      reason: 'Minor delays between Elephant & Castle and Queen\'s Park due to signal failure.' 
    }]
  },
  {
    id: 'victoria',
    name: 'Victoria',
    modeName: 'tube',
    lineStatuses: [{ statusSeverityDescription: 'Good Service' }]
  },
  {
    id: 'jubilee',
    name: 'Jubilee',
    modeName: 'tube',
    lineStatuses: [{ statusSeverityDescription: 'Good Service' }]
  },
  {
    id: '73',
    name: '73',
    modeName: 'bus',
    lineStatuses: [{ statusSeverityDescription: 'Good Service' }]
  },
  {
    id: '390',
    name: '390',
    modeName: 'bus',
    lineStatuses: [{ statusSeverityDescription: 'Good Service' }]
  },
  {
    id: 'elizabeth',
    name: 'Elizabeth Line',
    modeName: 'train',
    lineStatuses: [{ statusSeverityDescription: 'Good Service' }]
  }
];

export const transportApi = {
  getLineStatus: async (mode = 'tube,bus,train') => {
    try {
      console.log('Fetching live data...');
      const response = await tflApi.get(endpoints.lineStatus(mode));
      return response.data;
    } catch (error) {
      // If the API fails (400 error), use Mock Data automatically
      console.warn('API Request failed, loading Mock Data instead:', error.message);
      return MOCK_DATA;
    }
  },
};

export const authApi = {
  login: async (username, password) => {
    try {
      console.log('Attempting login with:', username);
      const response = await axios.post(
        endpoints.login, 
        {
          username: username,
          password: password,
        },
        {
          headers: { 'Content-Type': 'application/json' } 
        }
      );
      return response.data;
    } catch (error) {
      console.error('Login API Error:', error.response?.data || error.message);
      throw error;
    }
  },
};