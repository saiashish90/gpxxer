import { LocationObject } from 'expo-location';
import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { trackingMapStyles } from '../styles/trackingMapStyles';

interface TrackingMapProps {
  currentLocation: LocationObject | null;
  trackPoints: Array<{
    latitude: number;
    longitude: number;
    timestamp: number;
  }>;
  isTracking: boolean;
}

export default function TrackingMap({ 
  currentLocation, 
  trackPoints, 
  isTracking 
}: TrackingMapProps) {
  const mapRef = useRef<MapView>(null);

  // Auto-center map on current location when it updates
  useEffect(() => {
    if (currentLocation && mapRef.current && isTracking) {
      mapRef.current.animateToRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [currentLocation, isTracking]);

  // Create polyline coordinates from track points
  const polylineCoordinates = trackPoints.map(point => ({
    latitude: point.latitude,
    longitude: point.longitude,
  }));

  return (
    <View style={trackingMapStyles.container}>
      <MapView
        ref={mapRef}
        style={trackingMapStyles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        initialRegion={{
          latitude: currentLocation?.coords.latitude || 37.78825,
          longitude: currentLocation?.coords.longitude || -122.4324,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {/* Current location marker */}
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
            }}
            title="Current Location"
            description={`Speed: ${currentLocation.coords.speed ? (currentLocation.coords.speed * 3.6).toFixed(1) : 'N/A'} km/h`}
            pinColor="#007AFF"
          />
        )}

        {/* Track path polyline */}
        {trackPoints.length > 1 && (
          <Polyline
            coordinates={polylineCoordinates}
            strokeColor="#007AFF"
            strokeWidth={3}
            lineDashPattern={[1]}
          />
        )}
      </MapView>
    </View>
  );
}

 