import { colors } from './colors';

export const getStatusColor = (status) => {
  const statusLower = status?.toLowerCase() || '';
  if (statusLower.includes('good') || statusLower.includes('service')) {
    return colors.success;
  } else if (statusLower.includes('minor') || statusLower.includes('delay')) {
    return colors.warning;
  } else if (statusLower.includes('severe') || statusLower.includes('suspended')) {
    return colors.error;
  }
  return colors.info;
};

export const getTransportIcon = (mode) => {
  const icons = {
    bus: 'activity',
    tube: 'circle',
    train: 'zap',
    ferry: 'anchor',
    default: 'map-pin',
  };
  return icons[mode?.toLowerCase()] || icons.default;
};

export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};