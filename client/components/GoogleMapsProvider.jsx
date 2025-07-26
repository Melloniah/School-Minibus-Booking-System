
'use client';

import { LoadScript } from '@react-google-maps/api';

export default function GoogleMapsProvider({ children }) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      {children}
    </LoadScript>
  );
}

