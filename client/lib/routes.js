// client/lib/routes.js

export const routes = [
  {
    id: 1,
    name: "Thika Road",
    description: "From Kasarani via Muthaiga to Moi Avenue Primary",
    emoji: "🚐",
    stops: [
      "Kasarani",
      "Muthaiga",
      "Globe/CBD Entrance",
      "Moi Avenue Primary"
    ],
    coordinates: [
      { lat: -1.2220, lng: 36.9005 },  // Kasarani (Thika Rd)
      { lat: -1.2543, lng: 36.8650 },  // Muthaiga
      { lat: -1.2740, lng: 36.8190 },  // Globe/CBD entrance
      { lat: -1.2841, lng: 36.8235 },  // Moi Avenue Primary (reference)
    ],
  },
  {
    id: 2,
    name: "Mombasa Road",
    description: "From Syokimau via South B to Moi Avenue Primary",
    emoji: "🚌",
    stops: [
      "Syokimau",
      "Cabanas",
      "South B",
      "Moi Avenue Primary"
    ],
    coordinates: [
      { lat: -1.3541, lng: 36.8995 },  // Syokimau (Mombasa Rd)
       { lat: -1.3321, lng: 36.8892 },  // Cabanas
      { lat: -1.3204, lng: 36.8500 },  // South B
      { lat: -1.2841, lng: 36.8235 },  // Moi Avenue Primary
    ],
  },
  {
    id: 3,
    name: "Waiyaki Way",
    description: "From Kikuyu via Uthiru and Westlands to Moi Avenue Primary",
    emoji: "🚎",
    stops: [
      "Kikuyu",
      "Uthiru",
      "Westlands",
      "Moi Avenue Primary"
    ],
    coordinates: [
      { lat: -1.2646, lng: 36.6582 },  // Kikuyu (Waiyaki Way)
      { lat: -1.2663, lng: 36.7384 },  // Uthiru
      { lat: -1.2645, lng: 36.8011 },  // Westlands
      { lat: -1.2841, lng: 36.8235 },  // Moi Avenue Primary
    ],
  },
  {
    id: 4,
    name: "Jogoo Road",
    description: "From Donholm via Jericho to Moi Avenue Primary",
    emoji: "🚐",
    stops: [
      "Donholm",
      "Jericho",
      "City Stadium / Muthurwa",
      "Moi Avenue Primary"
    ],
    coordinates: [
      { lat: -1.2931, lng: 36.8960 },  // Donholm (Jogoo Rd)
      { lat: -1.2904, lng: 36.8659 },  // Jericho
      { lat: -1.2856, lng: 36.8333 },  // City Stadium / Muthurwa
      { lat: -1.2841, lng: 36.8235 },  // Moi Avenue Primary
    ],
  },
  {
    id: 5,
    name: "Kilimani",
    description: "From Adams Arcade via Yaya Centre to Moi Avenue Primary",
    emoji: "🚌",
    stops: [
      "Adams Arcade",
      "Yaya Centre",
      "Kileleshwa",
      "Moi Avenue Primary"
    ],
    coordinates: [
      { lat: -1.3065, lng: 36.7762 },  // Adams Arcade (Ngong Rd)
      { lat: -1.3003, lng: 36.7893 },  // Yaya Centre
      { lat: -1.2871, lng: 36.7864 },  // Kileleshwa
      { lat: -1.2841, lng: 36.8235 },  // Moi Avenue Primary
    ],
  },
  {
    id: 6,
    name: "Parklands Area",
    description: "From Parlands area to Moi Avenue Primary",
    emoji: "🚎",
    stops: [

      "Westlands",
      "Parklands",
      "Moi Avenue Primary"
    ],
    coordinates: [
      { lat: -1.2645, lng: 36.8011 },  // Westlands
      { lat: -1.2656, lng: 36.8133 },  // Parklands
      { lat: -1.2841, lng: 36.8235 },  // Moi Avenue Primary
    ],
  },
];
