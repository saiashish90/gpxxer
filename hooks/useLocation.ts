import * as Location from 'expo-location';
import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";

export interface LocationData {
  location: Location.LocationObject | null;
  speed: number | null; // Speed in m/s from GPS
  journeyAverageSpeed: number | null; // Average speed of entire journey
  journeyStartTime: number | null; // Journey start timestamp
  trackPoints: Array<{
    latitude: number;
    longitude: number;
    timestamp: number;
  }>;
  isTracking: boolean;
}

export const useLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [permission, setPermission] = useState<Location.PermissionStatus | null>(null);
  const [locationSubscription, setLocationSubscription] = useState<Location.LocationSubscription | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [speed, setSpeed] = useState<number | null>(null);
  const [journeyAverageSpeed, setJourneyAverageSpeed] = useState<number | null>(null);
  const [journeyStartTimeState, setJourneyStartTimeState] = useState<number | null>(null);
  const [trackPoints, setTrackPoints] = useState<Array<{
    latitude: number;
    longitude: number;
    timestamp: number;
  }>>([]);
  
  // Refs for tracking calculations
  const previousLocation = useRef<Location.LocationObject | null>(null);
  const speedReadings = useRef<number[]>([]);
  const journeyStartTime = useRef<number>(0);

  useEffect(() => {
    checkPermission();
    
    // Cleanup subscription when component unmounts
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  const checkPermission = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    setPermission(status);
    
    if (status === 'granted') {
      // Don't auto-start tracking, let user control it
    }
  };

  const requestPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setPermission(status);
    
    if (status === 'granted') {
      // Don't auto-start tracking, let user control it
    } else {
      Alert.alert('Permission denied', 'Location permission is required for bike tracking');
    }
  };



  const updateJourneyAverageSpeed = (newSpeed: number) => {
    speedReadings.current.push(newSpeed);
    
    // Calculate average speed of entire journey
    const totalSpeed = speedReadings.current.reduce((sum, speed) => sum + speed, 0);
    const averageSpeed = totalSpeed / speedReadings.current.length;
    setJourneyAverageSpeed(averageSpeed);
  };

  const startLocationWatching = async (updateFrequency: '1hz' | '10hz' = '1hz') => {
    try {
      // Stop any existing subscription
      if (locationSubscription) {
        locationSubscription.remove();
      }
      
      const timeInterval = updateFrequency === '1hz' ? 1000 : 100; // 100ms for 10Hz, 1000ms for 1Hz
      
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation, // Best accuracy for navigation
          timeInterval: timeInterval,
          distanceInterval: 0, // Update on any movement
          mayShowUserSettingsDialog: true, // Allow user to enable high accuracy
        },
        (newLocation) => {
          const now = Date.now();
  
          setLocation(newLocation);
          
          // Use GPS speed data if available, otherwise calculate from position changes
          let currentSpeed = newLocation.coords.speed;

          if (currentSpeed) {
            setSpeed(currentSpeed);
          }
          
          if (isTracking && currentSpeed && currentSpeed > 0) {
            updateJourneyAverageSpeed(currentSpeed);
            
            // Add track point
            setTrackPoints(prev => [...prev, {
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude,
              timestamp: newLocation.timestamp,
            }]);
          }
          
          previousLocation.current = newLocation;
        }
      );
      
      setLocationSubscription(subscription);
    } catch (error) {
      Alert.alert('Error', 'Could not start location watching');
    }
  };

  const startTracking = async (updateFrequency: '1hz' | '10hz' = '1hz') => {
    setIsTracking(true);
    speedReadings.current = [];
    setSpeed(null);
    setJourneyAverageSpeed(null);
    setJourneyStartTimeState(null);
    setTrackPoints([]);
    previousLocation.current = null;
    const startTime = Date.now();
    journeyStartTime.current = startTime;
    setJourneyStartTimeState(startTime);
    await startLocationWatching(updateFrequency);
  };

  const stopTracking = () => {
    setIsTracking(false);
    if (locationSubscription) {
      locationSubscription.remove();
      setLocationSubscription(null);
    }
  };

  const getLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });
      setLocation(location);
    } catch (error) {
      Alert.alert('Error', 'Could not get location');
    }
  };

  return {
    location,
    permission,
    speed,
    journeyAverageSpeed,
    journeyStartTime: journeyStartTimeState,
    trackPoints,
    isTracking,
    requestPermission,
    startTracking,
    stopTracking,
    getLocation,
  };
}; 