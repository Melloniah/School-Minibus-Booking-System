'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Users, DollarSign } from 'lucide-react';

// BookingForm Component
const BookingForm = ({ selectedRoute, onBookingSubmit }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    seatsBooked: 1,
    bookingDate: '',
    busId: '',
    userId: 1 // This would come from authentication context or session
  });
  
  const [availableBuses, setAvailableBuses] = useState([]);
  const [priceEstimate, setPriceEstimate] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch buses for selected route
  useEffect(() => {
    const fetchBuses = async () => {
      if (selectedRoute) {
        try {
          // In Next.js 13+, you'd call your API route
          const response = await fetch(`/api/routes/${selectedRoute.id}/buses`);
          if (response.ok) {
            const buses = await response.json();
            setAvailableBuses(buses);
          } else {
            // Fallback to mock data for demo
            const mockBuses = [
              { id: 1, name: 'Bus A-001', capacity: 30, operator: 'City Express' },
              { id: 2, name: 'Bus B-002', capacity: 25, operator: 'Metro Lines' },
              { id: 3, name: 'Bus C-003', capacity: 35, operator: 'Quick Transit' }
            ];
            setAvailableBuses(mockBuses);
          }
        } catch (error) {
          console.error('Error fetching buses:', error);
          // Fallback to mock data
          const mockBuses = [
            { id: 1, name: 'Bus A-001', capacity: 30, operator: 'City Express' },
            { id: 2, name: 'Bus B-002', capacity: 25, operator: 'Metro Lines' },
            { id: 3, name: 'Bus C-003', capacity: 35, operator: 'Quick Transit' }
          ];
          setAvailableBuses(mockBuses);
        }
      }
    };

    fetchBuses();
  }, [selectedRoute]);

  // Calculate price based on distance between stops
  useEffect(() => {
    if (formData.pickupLocation && formData.dropoffLocation && selectedRoute) {
      const pickupIndex = selectedRoute.stops.indexOf(formData.pickupLocation);
      const dropoffIndex = selectedRoute.stops.indexOf(formData.dropoffLocation);
      
      if (pickupIndex !== -1 && dropoffIndex !== -1) {
        const distance = Math.abs(dropoffIndex - pickupIndex);
        const basePrice = 50; // Base price in KES
        const pricePerStop = 25;
        const totalPrice = (basePrice + (distance * pricePerStop)) * formData.seatsBooked;
        setPriceEstimate(totalPrice);
      }
    }
  }, [formData.pickupLocation, formData.dropoffLocation, formData.seatsBooked, selectedRoute]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const bookingData = {
        user_id: formData.userId,
        bus_id: parseInt(formData.busId),
        pickup_location: formData.pickupLocation,
        dropoff_location: formData.dropoffLocation,
        seats_booked: parseInt(formData.seatsBooked),
        booking_date: formData.bookingDate,
        price: priceEstimate
      };

      // Call Next.js API route
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Booking successful:', result);
        
        if (onBookingSubmit) {
          onBookingSubmit(bookingData);
        }
        
        // Clear the form after successful booking
        setFormData({
          pickupLocation: '',
          dropoffLocation: '',
          seatsBooked: 1,
          bookingDate: '',
          busId: '',
          userId: formData.userId
        });
        
        // Show success message
        alert('Booking submitted successfully!');
        
        // Optional: Navigate to confirmation page
        // router.push(`/booking-confirmation/${result.booking_id}`);
        
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Booking failed');
      }
      
    } catch (error) {
      console.error('Booking failed:', error);
      alert(`Booking failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedRoute) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-gray-500">
          <MapPin className="mx-auto mb-2" size={48} />
          <p className="text-lg">Please select a route to start booking</p>
        </div>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const isFormValid = formData.pickupLocation && formData.dropoffLocation && formData.busId && formData.bookingDate && priceEstimate > 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Book Your Trip
        </h3>
        <div className="flex items-center text-gray-600 mb-2">
          <span className="text-2xl mr-2">{selectedRoute.emoji}</span>
          <span className="font-medium">{selectedRoute.name}</span>
        </div>
        <p className="text-sm text-gray-500">{selectedRoute.description}</p>
      </div>

      <div className="space-y-4">
        {/* Pickup Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MapPin className="inline w-4 h-4 mr-1" />
            Pickup Location
          </label>
          <select
            name="pickupLocation"
            value={formData.pickupLocation}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select pickup stop</option>
            {selectedRoute.stops.map((stop, index) => (
              <option key={index} value={stop}>{stop}</option>
            ))}
          </select>
        </div>

        {/* Dropoff Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MapPin className="inline w-4 h-4 mr-1" />
            Dropoff Location
          </label>
          <select
            name="dropoffLocation"
            value={formData.dropoffLocation}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select dropoff stop</option>
            {selectedRoute.stops
              .filter(stop => stop !== formData.pickupLocation)
              .map((stop, index) => (
                <option key={index} value={stop}>{stop}</option>
              ))}
          </select>
        </div>

        {/* Bus Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Bus
          </label>
          <select
            name="busId"
            value={formData.busId}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose a bus</option>
            {availableBuses.map(bus => (
              <option key={bus.id} value={bus.id}>
                {bus.name} - {bus.operator} (Capacity: {bus.capacity})
              </option>
            ))}
          </select>
        </div>

        {/* Number of Seats */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Users className="inline w-4 h-4 mr-1" />
            Number of Seats
          </label>
          <select
            name="seatsBooked"
            value={formData.seatsBooked}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num} seat{num > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>

        {/* Booking Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Calendar className="inline w-4 h-4 mr-1" />
            Travel Date
          </label>
          <input
            type="date"
            name="bookingDate"
            value={formData.bookingDate}
            onChange={handleInputChange}
            min={today}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Price Estimate */}
        {priceEstimate > 0 && (
          <div className="bg-blue-50 p-3 rounded-md">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                <DollarSign className="inline w-4 h-4 mr-1" />
                Total Cost:
              </span>
              <span className="text-lg font-bold text-blue-600">
                KES {priceEstimate.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading || !isFormValid}
          className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
            loading || !isFormValid
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            'Book Now'
          )}
        </button>
      </div>
    </div>
  );
};

// RouteBookingPage Component (Main Page Component)
const RouteBookingPage = () => {
  const [selectedRoute, setSelectedRoute] = useState(null);
  
  // This would typically come from your lib/routes.js file
  const routes = [
    {
      id: 1,
      name: "Thika Road",
      featured: true,
      description: "From Kasarani via Muthaiga to Moi Avenue Primary",
      emoji: "🚐",
      stops: ["Kasarani", "Muthaiga", "Globe/CBD Entrance", "Moi Avenue Primary"]
    },
    {
      id: 2,
      name: "Mombasa Road",
      featured: true,
      description: "From Syokimau via South B to Moi Avenue Primary",
      emoji: "🚌",
      stops: ["Syokimau", "Cabanas", "South B", "Moi Avenue Primary"]
    },
    {
      id: 3,
      name: "Waiyaki Way",
      description: "From Kikuyu via Uthiru and Westlands to Moi Avenue Primary",
      emoji: "🚎",
      stops: ["Kikuyu", "Uthiru", "Westlands", "Moi Avenue Primary"]
    },
    {
      id: 4,
      name: "Jogoo Road",
      featured: true,
      description: "From Donholm via Jericho to Moi Avenue Primary",
      emoji: "🚐",
      stops: ["Donholm", "Jericho", "City Stadium / Muthurwa", "Moi Avenue Primary"]
    },
    {
      id: 5,
      name: "Kilimani",
      featured: true,
      description: "From Adams Arcade via Yaya Centre to Moi Avenue Primary",
      emoji: "🚌",
      stops: ["Adams Arcade", "Yaya Centre", "Kileleshwa", "Moi Avenue Primary"]
    },
    {
      id: 6,
      name: "Parklands Area",
      description: "From Parklands area to Moi Avenue Primary",
      emoji: "🚎",
      stops: ["Westlands", "Parklands", "Moi Avenue Primary"]
    }
  ];

  const handleBookingSubmit = (bookingData) => {
    console.log('Booking submitted:', bookingData);
    // Additional client-side logic after successful booking
  };

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gray-50">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Bus Journey</h1>
        <p className="text-gray-600">Select a route and book your seats for a comfortable journey</p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Route Selection */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Available Routes</h2>
          <div className="space-y-4">
            {routes.map(route => (
              <div
                key={route.id}
                onClick={() => setSelectedRoute(route)}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedRoute?.id === route.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">{route.emoji}</span>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">{route.name}</h3>
                    {route.featured && (
                      <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full mt-1">
                        Popular Route
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{route.description}</p>
                <div className="text-xs text-gray-500">
                  <span className="font-medium">Stops:</span> {route.stops.join(' → ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Form */}
        <div>
          <BookingForm
            selectedRoute={selectedRoute}
            onBookingSubmit={handleBookingSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default RouteBookingPage;