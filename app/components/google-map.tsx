"use client"

import { useJsApiLoader, GoogleMap, MarkerF } from "@react-google-maps/api"

// IMPORTANT: You need to create a .env.local file in the root of your project
// and add your Google Maps API key to it.
//
// NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
//
// You can get an API key from the Google Cloud Console:
// https://console.cloud.google.com/google/maps-apis/overview

const containerStyle = {
  width: "100%",
  height: "100%",
}

interface GoogleMapComponentProps {
  mapLocations: {
    id: number
    name: string
    lat: number
    lng: number
    type: string
    day: number
  }[]
}

export default function GoogleMapComponent({ mapLocations }: GoogleMapComponentProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  })

  if (!isLoaded) {
    return <div>Loading Map...</div>
  }

  // Calculate the center of the map
  const center =
    mapLocations.length > 0
      ? mapLocations.reduce(
          (acc, loc) => {
            return {
              lat: acc.lat + loc.lat / mapLocations.length,
              lng: acc.lng + loc.lng / mapLocations.length,
            }
          },
          { lat: 0, lng: 0 }
        )
      : { lat: 35.7148, lng: 139.7967 } // Default center if no locations

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
      {mapLocations.map((location) => (
        <MarkerF key={location.id} position={{ lat: location.lat, lng: location.lng }} title={location.name} />
      ))}
    </GoogleMap>
  )
} 