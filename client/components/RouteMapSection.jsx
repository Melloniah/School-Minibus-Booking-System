
"use client";

import { useState } from "react";
import InteractiveMap from "./InteractiveMap"; 
import { routes } from "../lib/routes";

export default function RouteMapSection() {
  const [selectedRoute, setSelectedRoute] = useState(null);

  return (
    <section
      id="routes"
      className="py-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Choose Your Child's Route! 
          </h2>
          <p className="mt-1 text-gray-700 max-w-md mx-auto text-sm sm:text-base">
            Pick from safe, reliable routes covering the most stages in your area. ✨
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Routes List */}
          <div className="lg:w-1/3 space-y-3 max-h-[320px] sm:max-h-[380px] overflow-y-auto pr-2">
            {routes.map((route) => (
              <div
                key={route.id}
                onClick={() => setSelectedRoute(route)}
                className={`cursor-pointer border-2 rounded-lg p-4 transition-transform duration-150 ease-in-out
                  ${
                    selectedRoute?.id === route.id
                      ? "border-purple-600 bg-purple-50 shadow"
                      : "border-gray-300 bg-white"
                  }
                `}
              >
                <div className="flex justify-between items-center mb-2 text-base font-semibold">
                  <span className="text-xl">{route.emoji}</span>
                  <span>{route.name}</span>
                </div>

                <div className="text-xs text-gray-600 mb-2">
                  Stops: {route.stops.join(" → ")}
                </div>

            

                <div
                  className={`mt-3 text-center rounded-md py-1 text-sm font-medium
                    ${
                      route.status === "Full"
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 cursor-pointer"
                    }
                  `}
                >
                  {route.status === "Full" ? "Route Full" : "Select Route"}
                </div>
              </div>
            ))}
          </div>

          {/* Map */}
          <div className="lg:w-2/3 h-[320px] sm:h-[380px] rounded-lg shadow overflow-hidden">
            <InteractiveMap selectedRoute={selectedRoute} />
          </div>
        </div>
      </div>
    </section>
  );
}
