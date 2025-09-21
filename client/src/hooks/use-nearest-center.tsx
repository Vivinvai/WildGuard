import { useState, useEffect } from "react";
import { wildlifeCentersData } from "@shared/schema";

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface NearestCenter {
  center: typeof wildlifeCentersData[0];
  distance: number;
}

interface UseNearestCenterResult {
  nearestCenter: NearestCenter | null;
  nearestRescueCenter: NearestCenter | null;
  userLocation: Coordinates | null;
  isLoading: boolean;
  error: string | null;
  getUserLocation: () => Promise<void>;
}

// Haversine formula to calculate distance between two coordinates in kilometers
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

export function useNearestCenter(): UseNearestCenterResult {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [nearestCenter, setNearestCenter] = useState<NearestCenter | null>(null);
  const [nearestRescueCenter, setNearestRescueCenter] = useState<NearestCenter | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUserLocation = async (): Promise<void> => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      return;
    }

    setIsLoading(true);
    setError(null);

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setUserLocation(coords);
          setIsLoading(false);
          resolve();
        },
        (error) => {
          let errorMessage = "Unable to retrieve your location";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied by user";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out";
              break;
          }
          setError(errorMessage);
          setIsLoading(false);
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  };

  const findNearestCenterByType = (centerType?: string): NearestCenter | null => {
    if (!userLocation) return null;

    const centers = centerType 
      ? wildlifeCentersData.filter(center => center.type === centerType)
      : wildlifeCentersData;
    
    if (centers.length === 0) return null;

    let nearest = centers[0];
    let minDistance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      nearest.latitude,
      nearest.longitude
    );

    // Find the closest center
    for (let i = 1; i < centers.length; i++) {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        centers[i].latitude,
        centers[i].longitude
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearest = centers[i];
      }
    }

    return {
      center: nearest,
      distance: Math.round(minDistance * 10) / 10 // Round to 1 decimal place
    };
  };


  // Update nearest centers when user location changes
  useEffect(() => {
    if (userLocation) {
      const nearest = findNearestCenterByType();
      const nearestRescue = findNearestCenterByType("rescue");
      setNearestCenter(nearest);
      setNearestRescueCenter(nearestRescue);
    }
  }, [userLocation]);

  return {
    nearestCenter,
    nearestRescueCenter,
    userLocation,
    isLoading,
    error,
    getUserLocation
  };
}