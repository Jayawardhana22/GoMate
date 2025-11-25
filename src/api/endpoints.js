export const endpoints = {
  // Transport for London API
  lineStatus: (mode) => `/Line/Mode/${mode}/Status`,
  arrivals: (stopPoint) => `/StopPoint/${stopPoint}/Arrivals`,
  search: (query) => `/StopPoint/Search/${query}`,
  
  // DummyJSON for auth
  login: 'https://dummyjson.com/auth/login',
  users: 'https://dummyjson.com/users',
};