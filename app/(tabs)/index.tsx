import { Ionicons } from '@expo/vector-icons';
import { Alert, Button, Text, TouchableOpacity, View } from "react-native";
import GpsStatsCard from "../../components/GpsStatsCard";
import { useLocation } from "../../hooks/useLocation";
import { homeStyles } from "../../styles/homeStyles";

export default function HomeScreen() {
  const { 
    location, 
    permission, 
    speed,
    journeyAverageSpeed,
    journeyStartTime,
    isTracking,
    requestPermission, 
    startTracking,
    stopTracking
  } = useLocation();

  const handleStartTracking = async (frequency: '1hz' | '10hz') => {
    try {
      await startTracking(frequency);
    } catch (error) {
      Alert.alert('Error', 'Failed to start tracking');
    }
  };

  const handleStopTracking = () => {
    stopTracking();
  };

  return (  
    <View style={homeStyles.container}>
      {permission !== 'granted' ? (
        <View style={homeStyles.permissionContainer}>
          <Text style={homeStyles.permissionText}>
            Location permission is required for bike tracking
          </Text>
          <Button title="Grant Location Permission" onPress={requestPermission} />
        </View>
      ) : (
        <>
          {/* Tracking Controls - Always visible when permission granted */}
          <View style={homeStyles.trackingControls}>
            <Text style={homeStyles.trackingTitle}>Bike Tracking</Text>
            {!isTracking ? (
              <View style={homeStyles.startButtons}>
                <TouchableOpacity 
                  style={[homeStyles.trackingButton, homeStyles.startButton]} 
                  onPress={() => handleStartTracking('1hz')}
                >
                  <Ionicons name="play" size={20} color="white" />
                  <Text style={homeStyles.buttonText}>Start 1Hz Tracking</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[homeStyles.trackingButton, homeStyles.startButton]} 
                  onPress={() => handleStartTracking('10hz')}
                >
                  <Ionicons name="flash" size={20} color="white" />
                  <Text style={homeStyles.buttonText}>Start 10Hz Tracking</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={[homeStyles.trackingButton, homeStyles.stopButton]} 
                onPress={handleStopTracking}
              >
                <Ionicons name="stop" size={20} color="white" />
                <Text style={homeStyles.buttonText}>Stop Tracking</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* GPS Stats Card */}
          <GpsStatsCard 
            location={location}
            speed={speed}
            journeyAverageSpeed={journeyAverageSpeed}
            journeyStartTime={journeyStartTime}
            isTracking={isTracking}
          />
        </>
      )}
    </View>
  );
}



