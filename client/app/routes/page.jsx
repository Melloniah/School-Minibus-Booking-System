'use client';

import InteractiveMap from '../../components/InteractiveMap';
import RouteBookingForm from '../../components/RouteBookingForm';
import RouteList from '../../components/RouteList';
import RouteSearchBar from '../../components/RouteSearchBar';
import { useRoutes } from '../../hooks/useRoutes';

export default function RoutePage() {
  const { 
    routes, 
    selectedRoute, 
    loadingRoutes, 
    searchTerm,
    filteredRoutes,
    setSearchTerm,
    handleRouteSelect,
    handleSearchSuggestion,
    fetchRoutes 
  } = useRoutes({
    autoSelectFirst: true,
    showSuccessToast: true
  });

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
            Choose Your Route & Book Your Trip!
          </h2>
          <p className="mt-1 text-gray-700 max-w-md mx-auto text-sm sm:text-base">
            Select a route, view it on the map, and book your journey. ✨
          </p>
        </div>

        <RouteSearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          routes={routes}
          onSelectSuggestion={handleSearchSuggestion}
        />

        <div className="flex flex-col xl:flex-row gap-8 w-full min-h-[600px]">
          {/* Route Cards Section - Left */}
          <div className="flex-[2] max-h-[500px] overflow-y-auto">
            <RouteList
              routes={filteredRoutes}
              selectedRoute={selectedRoute}
              onSelectRoute={handleRouteSelect}
            />
          </div>

          {/* Map Section - Middle */}
          <div className="flex-[3] h-[400px] xl:h-auto xl:min-h-full rounded-lg shadow-xl overflow-hidden">
            <InteractiveMap
              apiKey={process.env.GOOGLE_MAPS_API_KEY}
              selectedRoute={selectedRoute}
            />
          </div>

          {/* Booking Form Section - Right */}
          <div className="flex-[2]">
            <RouteBookingForm selectedRoute={selectedRoute} />
          </div>
        </div>

        {/* Route Info Display */}
        {selectedRoute && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-purple-700 mb-4">Route Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Route Name:</p>
                <p className="text-gray-600 dark:text-gray-300">
                  {selectedRoute.route_name || selectedRoute.name}
                </p>
              </div>
              {selectedRoute.description && (
                <div>
                  <p className="font-semibold">Description:</p>
                  <p className="text-gray-600 dark:text-gray-300">{selectedRoute.description}</p>
                </div>
              )}
              {selectedRoute.distance && (
                <div>
                  <p className="font-semibold">Distance:</p>
                  <p className="text-gray-600 dark:text-gray-300">{selectedRoute.distance} km</p>
                </div>
              )}
              {selectedRoute.estimated_duration && (
                <div>
                  <p className="font-semibold">Estimated Duration:</p>
                  <p className="text-gray-600 dark:text-gray-300">{selectedRoute.estimated_duration} minutes</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* No Routes Available State */}
        {!loadingRoutes && routes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No routes are currently available.</p>
            <button
              onClick={fetchRoutes}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Refresh Routes
            </button>
          </div>
        )}
      </div>
    </section>
  );
}