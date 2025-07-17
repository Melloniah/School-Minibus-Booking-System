
"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";

// Utility to create marker icon
const createIcon = (emoji) =>
  L.divIcon({
    html: `<div style="font-size: 24px">${emoji}</div>`,
    className: "custom-icon",
  });

  export default function InteractiveMap ({selectedRoute}){
    const center = [1.2841, 36.8205] // moi avenue primary as the center

        const routeCoordinates = {
  1: [
    [-1.3541, 36.8995], // Syokimau (Mombasa Rd)
    [-1.3204, 36.8500], // South B
    [-1.3010, 36.8345], // Upper Hill
    [-1.2841, 36.8235], // Moi Avenue Primary
  ],
  2: [
    [-1.2220, 36.9005], // Kasarani (Thika Rd)
    [-1.2543, 36.8650], // Muthaiga
    [-1.2740, 36.8190], // Globe/CBD entrance
    [-1.2841, 36.8235], // Moi Avenue Primary
  ],
  3: [
    [-1.2646, 36.6582], // Kikuyu (Waiyaki Way)
    [-1.2663, 36.7384], // Uthiru
    [-1.2645, 36.8011], // Westlands
    [-1.2841, 36.8235], // Moi Avenue Primary
  ],
  4: [
    [-1.2931, 36.8960], // Donholm (Jogoo Rd)
    [-1.2904, 36.8659], // Jericho
    [-1.2856, 36.8333], // City Stadium / Muthurwa
    [-1.2841, 36.8235], // Moi Avenue Primary
  ],
  5: [
    [-1.3065, 36.7762], // Adams Arcade (Ngong Rd)
    [-1.3003, 36.7893], // Yaya Centre
    [-1.2871, 36.7864], // Kileleshwa
    [-1.2841, 36.8235], // Moi Avenue Primary
  ],
  6: [
    [-1.2645, 36.8011], // Westlands
    [-1.2656, 36.8133], // Parklands
    [-1.2750, 36.8001], // Riverside
    [-1.2841, 36.8235], // Moi Avenue Primary
  ]

    }

    const location= selectedRoute? routeCoordinates[selectedRoute.id]: [];

    return (
        <MapContainer center={center} zoom={14} scrollWheelZoom={false} className="h-full w-full rounded-lg">
              <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
     

      {location.map((point, index)=>(
        <Marker key={index} position={point} icon={createIcon(selectedRoute?.emoji || "📍")}>

            <Popup>
                  {selectedRoute?.stops[index] || "Stop"}
            </Popup>
        </Marker>
      ))}
      {location.length > 1 && (
        <Polyline positions={coords} color="purple"/>
      )}
 /</MapContainer>
    );
  }
