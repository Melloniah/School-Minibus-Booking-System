'use client';

import { useState, useEffect } from 'react';
import InteractiveMap from './InteractiveMap';
import { routes } from '../lib/routes';

export default function RouteMapSection() {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const firstFeatured = routes.find(route => route.featured);
    setSelectedRoute(firstFeatured);
  }, []);

  const filteredRoutes = searchTerm
      ? routes.filter(route =>
          route.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      : routes.filter(route => route.featured);

  return (
  <section className="w-full min-h-screen py-12 md:py-24 bg-gradient-to-br from-blue-150 via-purple-150 to-pink-150">
  <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-6">
      <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
        Choose Your Child's Route!
      </h2>
      <p className="mt-1 text-gray-700 max-w-md mx-auto text-sm sm:text-base">
        Pick from safe, reliable routes covering the most stages in your area. ✨
      </p>
    </div>

    <input
      type="text"
      placeholder="Search a route..."
      className="mb-6 p-2 w-full border rounded"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />

   <div className="flex flex-col lg:flex-row gap-8 w-full min-h-[500px]">
  {/* Route Cards Section */}
  <div className="flex-[2] flex flex-col gap-4">
    <h3 className="text-lg font-bold text-left text-purple-700 mb-2">Popular Routes</h3>
    {filteredRoutes.length === 0 ? (
      <p className="text-center text-gray-500 text-sm">
        We currently do not offer services to that area.
      </p>
    ) : (
      filteredRoutes.map(route => (
        <div
          key={route.id}
          onClick={() => setSelectedRoute(route)}
          className={`cursor-pointer border-2 rounded-lg p-4 transition duration-200 ease-in-out transform' ${
            selectedRoute?.id === route.id
              ? 'border-purple-600 bg-purple-50 shadow-lg scale-102'
              : 'border-gray-300 bg-white scale-100'
          }`}
        >
          <div className="flex justify-between items-center mb-2 text-base font-semibold">
            <span className="text-xl">{route.emoji}</span>
            <span>{route.name}</span>
          </div>
          <div className="text-xs text-gray-600 mb-2">
            Stops: {route.stops.join(' → ')}
          </div>
          <div className={`mt-3 text-center rounded-md py-1 text-sm font-medium ${
            route.status === 'Full'
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 cursor-pointer'
          }`}>
            {route.status === 'Full' ? 'Route Full' : 'Select Route'}
          </div>
        </div>
      ))
    )}
  </div>
      {/* Map Section */}
  <div className="flex-[3] h-[400px] lg:h-auto lg:min-h-full rounded-lg shadow-xl overflow-hidden">
    <InteractiveMap
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      selectedRoute={selectedRoute}
    />
  </div>
</div>
  </div>
</section>

  );
}