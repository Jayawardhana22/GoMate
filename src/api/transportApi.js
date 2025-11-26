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

// --- ADD MOCK ARRIVALS DATA ---
const MOCK_ARRIVALS = [
  { id: '1', lineName: '73', destinationName: 'Oxford Circus', timeToStation: 120, platformName: 'Stop A' }, // 120 seconds = 2 mins
  { id: '2', lineName: '73', destinationName: 'Victoria', timeToStation: 350, platformName: 'Stop A' },
  { id: '3', lineName: '390', destinationName: 'Archway', timeToStation: 600, platformName: 'Stop B' },
  { id: '4', lineName: '73', destinationName: 'Oxford Circus', timeToStation: 900, platformName: 'Stop A' },
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
  // NEW: Get Arrivals for a specific line/station
  getArrivals: async (lineId) => {
    try {
      // In a real app, you would fetch: /Line/{id}/Arrivals
      console.log(`Fetching arrivals for line ${lineId}...`);
     
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 800));
     
      // Return Mock Data randomized slightly for realism
      return MOCK_ARRIVALS.map(a => ({
        ...a,
        lineName: lineId.toUpperCase(), // Match the current line
        timeToStation: a.timeToStation + Math.floor(Math.random() * 60)
      })).sort((a, b) => a.timeToStation - b.timeToStation);
    } catch (error) {
      console.warn('Arrivals API failed', error);
      return [];
    }
  },
};

export const authApi = {
  login: async (username, password) => {
    try {
      console.log('API Requesting:', username); 
      
      const response = await axios.post(
        endpoints.login, 
        {
          username: username, // Use the real variable again
          password: password, // Use the real variable again
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