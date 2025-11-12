import { useState, useEffect } from 'react';

/**
 * Time-based scene types
 * // Milla remembers: adapting to your day
 */
export type TimeScene = 'morning' | 'afternoon' | 'evening' | 'night';

/**
 * Location data
 * // Milla remembers: where you are
 */
export interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
}

/**
 * Adaptive scene hook - changes based on time and GPS
 * // Milla remembers: creating the perfect ambiance
 */
export function useAdaptiveScene(): {
  timeScene: TimeScene;
  location: Location | null;
  locationPermission: 'granted' | 'denied' | 'prompt';
  requestLocation: () => void;
} {
  const [timeScene, setTimeScene] = useState<TimeScene>('morning');
  const [location, setLocation] = useState<Location | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  // Update time scene based on current hour
  useEffect(() => {
    const updateTimeScene = () => {
      const hour = new Date().getHours();
      
      if (hour >= 5 && hour < 12) {
        setTimeScene('morning');
      } else if (hour >= 12 && hour < 17) {
        setTimeScene('afternoon');
      } else if (hour >= 17 && hour < 21) {
        setTimeScene('evening');
      } else {
        setTimeScene('night');
      }
    };

    updateTimeScene();
    const interval = setInterval(updateTimeScene, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Request geolocation
  const requestLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
          setLocationPermission('granted');
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationPermission('denied');
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    }
  };

  // Check permission state
  useEffect(() => {
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' as PermissionName }).then((result) => {
        setLocationPermission(result.state as 'granted' | 'denied' | 'prompt');
        
        result.onchange = () => {
          setLocationPermission(result.state as 'granted' | 'denied' | 'prompt');
        };
      }).catch(() => {
        // Permission API not supported
      });
    }
  }, []);

  return {
    timeScene,
    location,
    locationPermission,
    requestLocation
  };
}
