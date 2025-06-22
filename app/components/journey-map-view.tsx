"use client"

import { useEffect, useState, memo } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap, InfoWindow } from '@vis.gl/react-google-maps';

const DAY_COLOR_SCHEMES = [
  { gradient: 'from-blue-500 to-cyan-500', arrow: 'border-t-blue-600' },
  { gradient: 'from-green-500 to-teal-500', arrow: 'border-t-green-600' },
  { gradient: 'from-purple-500 to-violet-500', arrow: 'border-t-purple-600' },
  { gradient: 'from-red-500 to-orange-500', arrow: 'border-t-red-600' },
  { gradient: 'from-pink-500 to-rose-500', arrow: 'border-t-pink-600' }
];

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
  description: string;
  day: number;
}

const CustomPin = memo(({ day, color, arrowColor }: { day: number, color: string, arrowColor: string }) => (
  <div className="relative">
    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${color} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
      {day}
    </div>
    <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 ${arrowColor}`}></div>
  </div>
));
CustomPin.displayName = 'CustomPin';

const MapController = ({ pins }: { pins: Pin[] }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || pins.length === 0) return;
    if (pins.length === 1) {
      map.setCenter(pins[0].position);
      map.setZoom(12);
      return;
    }
    const bounds = new window.google.maps.LatLngBounds();
    pins.forEach(pin => bounds.extend(pin.position));
    map.fitBounds(bounds, 100);
  }, [map, pins]);

  return null;
}

export default function JourneyMapView({ itinerary }: JourneyMapViewProps) {
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [hoveredPinKey, setHoveredPinKey] = useState<string | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    const geocodeLocations = async () => {
      if (!itinerary || !apiKey) return;
      setLoading(true);

      try {
        const destResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(itinerary.destination)}&key=${apiKey}`);
        const destData = await destResponse.json();
        if (destData.status === 'OK' && destData.results[0]) {
          setCenter(destData.results[0].geometry.location);
        }
      } catch (error) {
        console.error('Error geocoding destination:', error);
      }

      const locationsToGeocode: { name: string, searchableName: string, description: string, day: number }[] = [];
      itinerary.dailyItinerary.forEach((day: any) => {
        day.activities.forEach((act: any) => locationsToGeocode.push({ ...act, day: day.day }));
        day.restaurants.forEach((res: any) => locationsToGeocode.push({ ...res, day: day.day }));
      });
      
      const geocodedPins: Pin[] = [];
      for (const location of locationsToGeocode) {
        try {
          const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location.searchableName)}&key=${apiKey}`);
          const data = await response.json();
          if (data.status === 'OK' && data.results[0]) {
            geocodedPins.push({
              key: location.name,
              position: data.results[0].geometry.location,
              label: location.name,
              description: location.description,
              day: location.day,
            });
          }
        } catch (error) {
          console.error(`Error geocoding ${location.name}:`, error);
        }
      }

      setPins(geocodedPins);
      setLoading(false);
    };

    geocodeLocations();
  }, [itinerary, apiKey]);

  if (!apiKey) return <div className="p-4 text-center">Error: API key missing.</div>;
  if (loading || !center) return <div className="h-[500px] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  const hoveredPin = pins.find(p => p.key === hoveredPinKey);

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
          {pins.map((pin) => {
            const colorScheme = DAY_COLOR_SCHEMES[(pin.day - 1) % DAY_COLOR_SCHEMES.length];
            return (
              <AdvancedMarker
                key={pin.key}
                position={pin.position}
                onMouseEnter={() => setHoveredPinKey(pin.key)}
                onMouseLeave={() => setHoveredPinKey(null)}
              >
                <CustomPin day={pin.day} color={colorScheme.gradient} arrowColor={colorScheme.arrow} />
              </AdvancedMarker>
            );
          })}

          {hoveredPin && (
            <InfoWindow
              position={hoveredPin.position}
              pixelOffset={[0, -40]}
            >
              <div className="p-2 max-w-xs" onMouseEnter={() => setHoveredPinKey(hoveredPin.key)} onMouseLeave={() => setHoveredPinKey(null)}>
                <h3 className="font-bold text-base mb-1">{hoveredPin.label}</h3>
                <p className="text-sm text-gray-600">{hoveredPin.description}</p>
              </div>
            </InfoWindow>
          )}

          <MapController pins={pins} />
        </Map>
      </div>
    </APIProvider>
  );
} 