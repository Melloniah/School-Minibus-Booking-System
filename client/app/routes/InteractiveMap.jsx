"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Utility: create a simple emoji-based map marker icon
const createIcon = (emoji) =>
  L.divIcon({
    html: `<div style="font-size: 24px">${emoji}</div>`,
    className: "custom-icon",
  });

export default function InteractiveMap({ selectedRoute }) {
  // Default center: Moi Avenue Primary School
  const center = [-1.2841, 36.8235];

  // All route coordinates end at Moi Avenue Primary
  const routeCoordinates = {
    1: [
      [-1.3541, 36.8995], // Syokimau
      [-1.3204, 36.8500], // South B
      [-1.3010, 36.8345], // Upper Hill
      [-1.2841, 36.8235], // Moi Avenue Primary
    ],
    2: [
      [-1.2220, 36.9005], // Kasarani
      [-1.2543, 36.8650], // Muthaiga
      [-1.2740, 36.8190], // Globe/CBD
      [-1.2841, 36.8235], // Moi Avenue Primary
    ],
    3: [
      [-1.2646, 36.6582], // Kikuyu
      [-1.2663, 36.7384], // Uthiru
      [-1.2645, 36.8011], // Westlands
      [-1.2841, 36.8235], // Moi Avenue Primary
    ],
    4: [
      [-1.2931, 36.8960], // Donholm
      [-1.2904, 36.8659], // Jericho
      [-1.2856, 36.8333], // City Stadium
      [-1.2841, 36.8235], // Moi Avenue Primary
    ],
    5: [
      [-1.3065, 36.7762], // Adams Arcade
      [-1.3003, 36.7893], // Yaya Centre
      [-1.2871, 36.7864], // Kileleshwa
      [-1.2841, 36.8235], // Moi Avenue Primary
    ],
    6: [
      [-1.2645, 36.8011], // Westlands
      [-1.2656, 36.8133], // Parklands
      [-1.2750, 36.8001], // Riverside
      [-1.2841, 36.8235], // Moi Avenue Primary
    ],
  };

  // Get coordinates for the selected route, or empty array if none selected
  const location = selectedRoute ? routeCoordinates[selectedRoute.id] : [];

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={false}
      className="h-full w-full rounded-lg"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Place Markers for each stop */}
      {location.map((point, index) => (
        <Marker
          key={index}
          position={point}
          icon={createIcon(selectedRoute?.emoji || "🚌")}
        >
          <Popup>{selectedRoute?.stops?.[index] || `Stop ${index + 1}`}</Popup>
        </Marker>
      ))}

      {/* Draw the route line if there are multiple stops */}
      {location.length > 1 && <Polyline positions={location} color="purple" />}
    </MapContainer>
  );
}
