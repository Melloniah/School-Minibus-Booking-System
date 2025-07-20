'use client';

import { GoogleMap, LoadScript, Marker, Polyline, InfoWindow } from '@react-google-maps/api';
import { useState, useRef, useEffect } from 'react';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 1.2860, // Kencom fallback center
  lng: 36.8257,
};

export default function InteractiveMap({ selectedRoute }) {
  const mapRef = useRef(null);
  const [activeStopIndex, setActiveStopIndex] = useState(null);

  const onLoad = (map) => {
    mapRef.current = map;
  };

  useEffect(() => {
    if (selectedRoute && selectedRoute.coordinates.length > 0 && mapRef.current) {
      const bounds = new window.google.maps.LatLngBounds();
      selectedRoute.coordinates.forEach(coord => bounds.extend(coord));
      mapRef.current.fitBounds(bounds);
    }
  }, [selectedRoute]);

  const polylineOptions = {
    strokeColor: '#8b5cf6',
    strokeOpacity: 1,
    strokeWeight: 4,
    icons: [
      {
        icon: {
          path: 'M 0,-1 0,1',
          strokeOpacity: 1,
          scale: 4,
        },
        offset: '0',
        repeat: '20px',
      },
    ],
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        onLoad={onLoad}
      >
        {selectedRoute && selectedRoute.coordinates.length > 0 && (
          <>
            <Polyline path={selectedRoute.coordinates} options={polylineOptions} />

            {selectedRoute.coordinates.map((coord, idx) => (
              <Marker
                key={idx}
                position={coord}
                onClick={() => setActiveStopIndex(idx)}
              />
            ))}

            {activeStopIndex !== null && (
              <InfoWindow
                position={selectedRoute.coordinates[activeStopIndex]}
                onCloseClick={() => setActiveStopIndex(null)}
              >
                <div>{selectedRoute.stops[activeStopIndex] || `Stop ${activeStopIndex + 1}`}</div>
              </InfoWindow>
            )}
          </>
        )}
      </GoogleMap>
    </LoadScript>
  );
}
