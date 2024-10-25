// app/location/my-location/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Compass, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import GPSReminder from './GpsReminder';


// Define the structure of location data we'll receive from the browser's Geolocation API
interface LocationData {
  latitude: number;        // Latitude in degrees
  longitude: number;       // Longitude in degrees
  accuracy: number;        // Accuracy of the position in meters
  altitude: number | null; // Altitude in meters (if available)
  heading: number | null;  // Direction of travel in degrees (if available)
  speed: number | null;    // Speed in meters per second (if available)
  timestamp: number;       // Timestamp when the position was acquired
}

// Define a fixed target location (Dhaka in this case)
const TARGET_LOCATION = {
  latitude: 23.8041,
  longitude: 90.4152,
  name: "Dhaka"
};

export default function MyLocationPage() {
  // State management using React hooks
  const [location, setLocation] = useState<LocationData | null>(null);    // Stores current location
  const [error, setError] = useState<string | null>(null);               // Stores any error messages
  const [isTracking, setIsTracking] = useState(false);                   // Tracks if we're actively getting location
  const [watchId, setWatchId] = useState<number | null>(null);           // Stores the ID for the location watcher
  const [distance, setDistance] = useState<number | null>(null);         // Stores distance to target
  const [bearing, setBearing] = useState<number | null>(null);           // Stores bearing to target

  // Haversine formula to calculate the great-circle distance between two points on Earth
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Earth's radius in kilometers
    // Convert degrees to radians
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    // Haversine formula
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Returns distance in kilometers
  };

  // Calculate the initial bearing from point 1 to point 2
  const calculateBearing = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    // Convert degrees to radians
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const λ1 = (lon1 * Math.PI) / 180;
    const λ2 = (lon2 * Math.PI) / 180;

    // Calculate bearing
    const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
    const x =
      Math.cos(φ1) * Math.sin(φ2) -
      Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
    const θ = Math.atan2(y, x);

    // Convert radians to degrees and normalize to 0-360°
    return ((θ * 180) / Math.PI + 360) % 360;
  };

  // Start tracking the user's location
  const startTracking = () => {
    // Check if browser supports geolocation
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsTracking(true);
    // Watch the user's position continuously
    const id = navigator.geolocation.watchPosition(
      (position) => {
        // Success callback - received new position
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp,
        };
        setLocation(newLocation);

        // Calculate new distance to target location
        const dist = calculateDistance(
          newLocation.latitude,
          newLocation.longitude,
          TARGET_LOCATION.latitude,
          TARGET_LOCATION.longitude
        );
        setDistance(dist);

        // Calculate new bearing to target location
        const bear = calculateBearing(
          newLocation.latitude,
          newLocation.longitude,
          TARGET_LOCATION.latitude,
          TARGET_LOCATION.longitude
        );
        setBearing(bear);

        setError(null);
      },
      (error) => {
        // Error callback
        setError(error.message);
        setIsTracking(false);
      },
      {
        enableHighAccuracy: true, // Request high accuracy (uses more battery)
        timeout: 5000,           // Time to wait for position
        maximumAge: 0            // Don't use cached positions
      }
    );

    setWatchId(id);
  };

  // Stop tracking the user's location
  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsTracking(false);
  };

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  // Convert speed from meters/second to kilometers/hour
  const formatSpeed = (speedInMetersPerSecond: number | null): string => {
    if (speedInMetersPerSecond === null) return 'N/A';
    const speedInKmH = (speedInMetersPerSecond * 3.6).toFixed(1);
    return `${speedInKmH} km/h`;
  };

  // Format timestamp to local time string
  const getFormattedTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString();
  };

  // Convert bearing angle to cardinal direction (N, NE, E, SE, etc.)
  const getDirectionFromBearing = (bearing: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(bearing / 45) % 8;
    return directions[index];
  };


  return (
    <div className="container mx-auto p-4 space-y-6 mt-20">
      <h1 className="text-3xl font-bold">My Location Tracker</h1>
      <GPSReminder />

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={isTracking ? stopTracking : startTracking}
        variant={isTracking ? "destructive" : "default"}
        className="w-full md:w-auto"
      >
        {isTracking ? 'Stop Tracking' : 'Start Tracking'}
      </Button>

      {location && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5" />
                Distance to {TARGET_LOCATION.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">
                    {distance !== null ? `${distance.toFixed(2)} km` : 'Calculating...'}
                  </span>
                  <span className="text-muted-foreground">
                    {bearing !== null && `Direction: ${getDirectionFromBearing(bearing)} (${Math.round(bearing)}°)`}
                  </span>
                </div>
                <Separator />
                <p className="text-sm text-muted-foreground">
                  Target coordinates: {TARGET_LOCATION.latitude}°N, {TARGET_LOCATION.longitude}°E
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Your Position
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Latitude:</span>
                  <span className="font-mono">{location.latitude.toFixed(6)}°</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Longitude:</span>
                  <span className="font-mono">{location.longitude.toFixed(6)}°</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Accuracy:</span>
                  <span>±{Math.round(location.accuracy)} meters</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Movement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Speed:</span>
                  <span>{formatSpeed(location.speed)}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Heading:</span>
                  <span>
                    {location.heading ? `${Math.round(location.heading)}°` : 'N/A'}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Last Update:</span>
                  <span>{getFormattedTime(location.timestamp)}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Compass className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const url = `https://www.google.com/maps/dir/${location.latitude},${location.longitude}/${TARGET_LOCATION.latitude},${TARGET_LOCATION.longitude}`;
                    window.open(url, '_blank');
                  }}
                >
                  Get Directions to Target
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
                    window.open(url, '_blank');
                  }}
                >
                  Open Your Location
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}