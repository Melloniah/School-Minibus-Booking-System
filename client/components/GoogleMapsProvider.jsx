'use client';

import { LoadScript } from '@react-google-maps/api';
import { createContext, useContext } from 'react';

const GoogleMapsContext = createContext({});

const libraries = ['places', 'geometry'];

export function GoogleMapsProvider({ children }) {
  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE';

  if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'YOUR_API_KEY_HERE') {
    return (
      <GoogleMapsContext.Provider value={{ isLoaded: false, loadError: 'API key missing' }}>
        {children}
      </GoogleMapsContext.Provider>
    );
  }

  return (
    <LoadScript
      googleMapsApiKey={GOOGLE_MAPS_API_KEY}
      libraries={libraries}
      loadingElement={<div>Loading Maps...</div>}
    >
      <GoogleMapsContext.Provider value={{ isLoaded: true, loadError: null }}>
        {children}
      </GoogleMapsContext.Provider>
    </LoadScript>
  );
}

export function useGoogleMaps() {
  return useContext(GoogleMapsContext);
}