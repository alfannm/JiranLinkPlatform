import { Capacitor } from '@capacitor/core';

interface LocationResult {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface HMSLocationPlugin {
  getCurrentLocation(): Promise<LocationResult>;
}

export const HMSLocation = {
  async getCurrentLocation(): Promise<LocationResult> {
    if (Capacitor.isNativePlatform()) {
      // Use HMS Location on native platform (Huawei devices)
      const { HMSLocation } = Capacitor.Plugins as any;
      return await HMSLocation.getCurrentLocation();
    } else {
      // Fallback for web development/testing
      return new Promise((resolve, reject) => {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
              });
            },
            (error) => {
              reject(new Error(`Geolocation error: ${error.message}`));
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            }
          );
        } else {
          reject(new Error('Geolocation not supported in this browser'));
        }
      });
    }
  },

  // Helper function to calculate distance between two coordinates (in km)
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  },
};

// District coordinates for Malaysia (approximate city centers)
export const districtCoordinates: Record<string, { lat: number; lon: number }> = {
  'Kuala Lumpur': { lat: 3.139, lon: 101.6869 },
  'Petaling Jaya': { lat: 3.1073, lon: 101.6067 },
  'Shah Alam': { lat: 3.0733, lon: 101.5185 },
  'Subang Jaya': { lat: 3.0436, lon: 101.5874 },
  'Klang': { lat: 3.0454, lon: 101.4450 },
  'Johor Bahru': { lat: 1.4927, lon: 103.7414 },
  'Penang': { lat: 5.4141, lon: 100.3288 },
  'Ipoh': { lat: 4.5975, lon: 101.0901 },
  'Kota Kinabalu': { lat: 5.9804, lon: 116.0735 },
  'Kuching': { lat: 1.5535, lon: 110.3593 },
};

export const findNearestDistrict = async (): Promise<string | null> => {
  try {
    const location = await HMSLocation.getCurrentLocation();
    let nearestDistrict = null;
    let minDistance = Infinity;

    Object.entries(districtCoordinates).forEach(([district, coords]) => {
      const distance = HMSLocation.calculateDistance(
        location.latitude,
        location.longitude,
        coords.lat,
        coords.lon
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestDistrict = district;
      }
    });

    return nearestDistrict;
  } catch (error) {
    console.error('Error finding nearest district:', error);
    return null;
  }
};
