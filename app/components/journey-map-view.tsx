"use client"

import { useEffect, useState } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';

interface JourneyMapViewProps {
  itinerary: any;
}

interface Pin {
  key: string;
  position: {
    lat: number;
    lng: number;
  };
  label: string;
}

const MapController = ({ pins }: { pins: Pin[] }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || pins.length === 0) {
      return;
    }

    if (pins.length === 1) {
      map.setCenter(pins[0].position);
      map.setZoom(12); // A reasonable zoom for a single point
      return;
    }

    const bounds = new window.google.maps.LatLngBounds();
    pins.forEach(pin => {
      bounds.extend(pin.position);
    });
    map.fitBounds(bounds, 100); // 100px padding
  }, [map, pins]);

  return null;
}

export default function JourneyMapView({ itinerary }: JourneyMapViewProps) {
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    const geocodeLocations = async () => {
      if (!itinerary || !apiKey) return;

      console.log("🗺️ Starting geocoding process...");
      setLoading(true);

      // 1. Geocode the primary destination to center the map
      try {
        const destResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(itinerary.destination)}&key=${apiKey}`);
        const destData = await destResponse.json();
        if (destData.status === 'OK' && destData.results[0]) {
          const location = destData.results[0].geometry.location;
          setCenter({ lat: location.lat, lng: location.lng });
          console.log(`✅ SUCCESS: Centered map on ${itinerary.destination}`, location);
        } else {
          console.warn(`⚠️ FAILURE: Could not geocode destination: ${itinerary.destination}. Status: ${destData.status}`);
        }
      } catch (error) {
        console.error('❌ ERROR: Exception while geocoding destination:', error);
      }

      // 2. Collect all locations to geocode from the itinerary
      const locationsToGeocode: { name: string, searchableName: string }[] = [];
      itinerary.dailyItinerary.forEach((day: any) => {
        day.activities.forEach((act: any) => locationsToGeocode.push({ name: act.name, searchableName: act.searchableName }));
        day.restaurants.forEach((res: any) => locationsToGeocode.push({ name: res.name, searchableName: res.searchableName }));
      });

      // 3. Geocode each location and create pins
      const geocodedPins: Pin[] = [];
      for (const location of locationsToGeocode) {
        try {
          const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location.searchableName)}&key=${apiKey}`);
          const data = await response.json();
          if (data.status === 'OK' && data.results[0]) {
            const coords = data.results[0].geometry.location;
            console.log(`✅ SUCCESS: Found coordinates for "${location.name}"`, coords);
            geocodedPins.push({
              key: location.name,
              position: { lat: coords.lat, lng: coords.lng },
              label: location.name,
            });
          } else {
            console.warn(`⚠️ FAILURE: Could not find "${location.name}" (searched for "${location.searchableName}"). Status: ${data.status}`);
          }
        } catch (error) {
          console.error(`❌ ERROR: Exception while geocoding "${location.name}":`, error);
        }
      }

      setPins(geocodedPins);
      console.log(`📍 Finished geocoding. Found ${geocodedPins.length} of ${locationsToGeocode.length} locations.`);
      setLoading(false);
    };

    geocodeLocations();
  }, [itinerary, apiKey]);

  if (!apiKey) {
    return <div className="p-4 text-center">Error: Google Maps API key is missing.</div>;
  }

  if (loading || !center) {
    return (
      <div className="h-[500px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-600">Locating points of interest on the map...</p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div style={{ height: '500px', width: '100%' }}>
        <Map
          defaultCenter={center}
          defaultZoom={6}
          gestureHandling={'greedy'}
          mapId="VIBEGO_MAP"
          disableDefaultUI={true}
        >
          {pins.map((pin) => (
            <AdvancedMarker
              key={pin.key}
              position={pin.position}
              title={pin.label}
            />
          ))}
          <MapController pins={pins} />
        </Map>
      </div>
    </APIProvider>
  );
} 