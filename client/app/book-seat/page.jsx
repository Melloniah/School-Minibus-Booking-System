'use client';

import { useState } from 'react';
import BookingForm from '../../components/BookingForm';
import InteractiveMap from '../../components/InteractiveMap';

export default function BookSeatPage() {
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Handler to pass down to BookingForm so it can update selectedRoute here
  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen p-4 gap-6 max-w-7xl mx-auto">
      {/* Left: Booking Form */}
      <div className="lg:w-1/2 w-full">
        <h1 className="text-2xl font-bold mb-4">Book Your Seat</h1>
        <BookingForm onRouteSelect={handleRouteSelect} />
      </div>

       {/* Right: Interactive Map */}
      <div className="lg:w-1/2 w-full">
        <h2 className="text-xl font-semibold mb-4">Route Map</h2>
        <div className="h-[500px] lg:h-[600px] w-full rounded-lg overflow-hidden shadow-lg border">
          <InteractiveMap selectedRoute={selectedRoute} />
        </div>
      </div>
    </div>
  );
}
