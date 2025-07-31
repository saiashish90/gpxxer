import { Ionicons } from '@expo/vector-icons';
import { LocationObject } from "expo-location";
import { Text, View } from "react-native";
import { gpsStatsCardStyles } from "../styles/gpsStatsCardStyles";

interface GpsStatsCardProps {
  location: LocationObject | null;
  speed: number | null;
  journeyAverageSpeed: number | null;
  journeyStartTime: number | null;
  isTracking: boolean;
}

export default function GpsStatsCard({ 
  location, 
  speed, 
  journeyAverageSpeed, 
  journeyStartTime,
  isTracking
}: GpsStatsCardProps) {
  
  const formatSpeed = (speedMs: number | null): string => {
    if (speedMs === null) return '0.0';
    const kmh = speedMs * 3.6; // Convert m/s to km/h
    return kmh.toFixed(1);
  };



  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const formatJourneyStartTime = (timestamp: number | null): string => {
    if (timestamp === null) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <View style={gpsStatsCardStyles.container}>
      <View style={gpsStatsCardStyles.header}>
        <Ionicons name="bicycle" size={24} color="#007AFF" />
        <Text style={gpsStatsCardStyles.title}>Bike Tracker</Text>
        {isTracking && (
          <View style={gpsStatsCardStyles.trackingIndicator}>
            <Ionicons name="radio-button-on" size={12} color="#28a745" />
            <Text style={gpsStatsCardStyles.trackingText}>Tracking</Text>
          </View>
        )}
      </View>

      {location ? (
        <View style={gpsStatsCardStyles.content}>
          {/* Speed Section */}
          <View style={gpsStatsCardStyles.speedSection}>
            <Text style={gpsStatsCardStyles.speedLabel}>Current Speed</Text>
            <Text style={gpsStatsCardStyles.speedValue}>{formatSpeed(speed)} km/h</Text>
            {journeyAverageSpeed !== null && (
              <Text style={gpsStatsCardStyles.averageSpeed}>Journey Avg: {formatSpeed(journeyAverageSpeed)} km/h</Text>
            )}
          </View>



          {/* Location Details */}
          <View style={gpsStatsCardStyles.locationSection}>
            <View style={gpsStatsCardStyles.coordinateRow}>
              <Ionicons name="location" size={16} color="#666" />
              <Text style={gpsStatsCardStyles.coordinateText}>
                {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
              </Text>
            </View>
            
            <View style={gpsStatsCardStyles.detailRow}>
              <Text style={gpsStatsCardStyles.detailLabel}>Altitude:</Text>
              <Text style={gpsStatsCardStyles.detailValue}>
                {location.coords.altitude ? `${location.coords.altitude.toFixed(1)}m` : 'N/A'}
              </Text>
            </View>
            
            <View style={gpsStatsCardStyles.detailRow}>
              <Text style={gpsStatsCardStyles.detailLabel}>Accuracy:</Text>
              <Text style={gpsStatsCardStyles.detailValue}>
                {location.coords.accuracy ? `${location.coords.accuracy.toFixed(1)}m` : 'N/A'}
              </Text>
            </View>
            
            <View style={gpsStatsCardStyles.detailRow}>
              <Text style={gpsStatsCardStyles.detailLabel}>Heading:</Text>
              <Text style={gpsStatsCardStyles.detailValue}>
                {location.coords.heading ? `${location.coords.heading.toFixed(1)}°` : 'N/A'}
              </Text>
            </View>
            
            <View style={gpsStatsCardStyles.detailRow}>
              <Text style={gpsStatsCardStyles.detailLabel}>GPS Speed:</Text>
              <Text style={gpsStatsCardStyles.detailValue}>
                {location.coords.speed !== null ? `${formatSpeed(location.coords.speed)} km/h` : 'N/A'}
              </Text>
            </View>
            
            <View style={gpsStatsCardStyles.detailRow}>
              <Text style={gpsStatsCardStyles.detailLabel}>Updated:</Text>
              <Text style={gpsStatsCardStyles.detailValue}>{formatTime(location.timestamp)}</Text>
            </View>
            
            <View style={gpsStatsCardStyles.detailRow}>
              <Text style={gpsStatsCardStyles.detailLabel}>Journey Start:</Text>
              <Text style={gpsStatsCardStyles.detailValue}>{formatJourneyStartTime(journeyStartTime)}</Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={gpsStatsCardStyles.noLocation}>
          <Ionicons name="location-outline" size={48} color="#999" />
          <Text style={gpsStatsCardStyles.noLocationText}>
            {isTracking ? 'Getting location...' : 'Start tracking to see location data'}
          </Text>
        </View>
      )}
    </View>
  );
}



