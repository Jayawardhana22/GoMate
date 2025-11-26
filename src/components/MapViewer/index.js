import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps'; // Import UrlTile
import Icon from '../Icon';
import { colors } from '../../utils/colors';

export default function MapViewer({ stationName, stationLat, stationLng, busLat, busLng }) {
  // 1. Force Convert Strings to Numbers
  const sLat = parseFloat(stationLat);
  const sLng = parseFloat(stationLng);
  const bLat = busLat ? parseFloat(busLat) : null;
  const bLng = busLng ? parseFloat(busLng) : null;

  if (isNaN(sLat) || isNaN(sLng)) {
    return (
      <View style={styles.errorContainer}>
        <Text>Loading Map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        mapType="none" // <--- CRITICAL: Turns off Google's blank map
        initialRegion={{
          latitude: sLat,
          longitude: sLng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {/* This loads OpenStreetMap instead of Google */}
        <UrlTile
          urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        />

        {/* Station Marker */}
        <Marker coordinate={{ latitude: sLat, longitude: sLng }} title={stationName}>
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Icon name="map-pin" size={16} color="#FFF" />
          </View>
        </Marker>

        {/* Bus Marker */}
        {bLat && bLng && (
          <Marker coordinate={{ latitude: bLat, longitude: bLng }} title="Bus">
             <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
               <Icon name="zap" size={14} color="#FFF" />
             </View>
          </Marker>
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 350,
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
    backgroundColor: '#e1e1e1',
  },
  map: { flex: 1 },
  errorContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  badge: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFF',
  },
});