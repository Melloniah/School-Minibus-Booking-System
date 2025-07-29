import React from 'react';

// BookingsTable component to display a list of bookings
function BookingsTable({ bookings }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-10">
      <h2 className="text-xl font-semibold text-indigo-700 mb-4">All Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-gray-600">No bookings found.</p>
      ) : (
        <div className="overflow-x-auto"> {/* Enable horizontal scrolling for small screens */}
          <table className="min-w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 uppercase">
              <tr>
                <th className="px-4 py-3 border-b border-gray-200">User ID</th>
                <th className="px-4 py-3 border-b border-gray-200">Bus ID</th>
                <th className="px-4 py-3 border-b border-gray-200">Pickup</th>
                <th className="px-4 py-3 border-b border-gray-200">Dropoff</th>
                <th className="px-4 py-3 border-b border-gray-200 text-center">Seats</th>
                <th className="px-4 py-3 border-b border-gray-200 text-right">Price</th>
                <th className="px-4 py-3 border-b border-gray-200">Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-4 py-3">{b.user_id}</td>
                  <td className="px-4 py-3">{b.bus_id}</td>
                  <td className="px-4 py-3">{b.pickup_location}</td>
                  <td className="px-4 py-3">{b.dropoff_location}</td>
                  <td className="px-4 py-3 text-center">{b.seats_booked}</td>
                  <td className="px-4 py-3 text-right">KES {b.price}</td>
                  <td className="px-4 py-3">{b.booking_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default BookingsTable;
