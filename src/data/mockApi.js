// Simulating an API response for Travel/Transport
export const TRANSPORT_DATA = [
  {
    id: '1',
    title: 'Colombo to Kandy Express',
    type: 'Train',
    status: 'On Time',
    image: 'https://images.unsplash.com/photo-1535535112387-56ffe8db21ff?q=80&w=1000&auto=format&fit=crop',
    description: 'Scenic train ride through the hill country. Duration: 3.5 Hours.',
    price: 'LKR 1500',
    time: '10:30 AM'
  },
  {
    id: '2',
    title: 'Southern Expressway Bus',
    type: 'Bus',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1000&auto=format&fit=crop',
    description: 'Luxury AC bus from Makumbura to Galle. Duration: 1.5 Hours.',
    price: 'LKR 1100',
    time: '02:00 PM'
  },
  {
    id: '3',
    title: 'Ella Odyssey',
    type: 'Train',
    status: 'Popular',
    image: 'https://images.unsplash.com/photo-1590629709606-31e6e4727998?q=80&w=1000&auto=format&fit=crop',
    description: 'Premium tourist train with observation deck.',
    price: 'LKR 4000',
    time: '06:00 AM'
  },
  {
    id: '4',
    title: 'Colombo City Tour',
    type: 'Taxi',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1622568220168-5b5c2d50748e?q=80&w=1000&auto=format&fit=crop',
    description: 'Private taxi for a full day city tour.',
    price: 'LKR 8000',
    time: 'Flexible'
  }
];

// Simulate Async API Call
export const fetchTransportData = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(TRANSPORT_DATA), 1000); // 1 second delay
  });
};