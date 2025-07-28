'use client';

import { useState, useEffect } from 'react';
import InteractiveMap from './InteractiveMap';
import RouteList from './RouteList';
import RouteSearchBar from './RouteSearchBar';
import { useRoutes } from '../hooks/useRoutes.js';

export default function RouteMapSection() {
  const { 
    routes, 
    selectedRoute, 
    loadingRoutes, 
    searchTerm,
    filteredRoutes,
    setSearchTerm,
    handleRouteSelect,
    handleSearchSuggestion 
  } = useRoutes({
    autoSelectFirst: true,
    showSuccessToast: false
  });

  // For home page, show featured routes or all if no featured routes
  const displayRoutes = searchTerm 
    ? filteredRoutes 
    : routes.filter(route => route.featured).length > 0 
      ? routes.filter(route => route.featured)
      : routes;

  if (loadingRoutes) {
    return (
      <section className="w-full min-h-screen py-12 md:py-24 bg-gradient-to-br from-blue-150 via-purple-150 to-pink-150">
        <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p>Loading routes...</p>
          </div>
        </div>
      </section>
    );
  }

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

        <RouteSearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          routes={routes}
          onSelectSuggestion={handleSearchSuggestion}
        />

        <div className="flex flex-col lg:flex-row gap-8 w-full min-h-[500px]">
          {/* Route Cards Section */}
          <div className="flex-[2]">
            <RouteList
              routes={displayRoutes}
              selectedRoute={selectedRoute}
              onSelectRoute={handleRouteSelect}
            />
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