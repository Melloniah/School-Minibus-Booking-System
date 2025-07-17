'use client';

import React from 'react';

export default function Booking() {
  return (
    <div className="min-h-screen px-6 py-12 bg-gray-50">
      <h1 className="text-3xl font-bold text-center text-purple-700 mb-8">
        Book a School Minibus Ride
      </h1>

      <form className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8 space-y-8">

        {/* Parent Info */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-purple-600">👨‍👩‍👧 Parent Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="border p-2 rounded" type="text" placeholder="Parent Name" required />
            <input className="border p-2 rounded" type="email" placeholder="Email Address" required />
            <input className="border p-2 rounded" type="tel" placeholder="Phone Number" required />
            <input className="border p-2 rounded" type="tel" placeholder="Emergency Contact (e.g. 0722 123456)" required />
          </div>
        </div>

        {/* Child Info */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-purple-600">🧒 Child Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="border p-2 rounded" type="text" placeholder="Child's Name" required />
            <input className="border p-2 rounded" type="number" placeholder="Child's Age" required />
          </div>
        </div>

        {/* Route & Schedule */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-purple-600">🚌 Route & Schedule</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="border p-2 rounded" type="text" placeholder="Preferred Route" required />
            <input className="border p-2 rounded" type="text" placeholder="Pickup Address" required />
            <input className="border p-2 rounded" type="date" placeholder="Preferred Start Date" required />
          </div>
        </div>

        {/* Special Instructions */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-purple-600">💬 Special Instructions</h2>
          <textarea
            className="w-full border p-3 rounded min-h-[120px]"
            placeholder="Tell us about any allergies, special needs, or fun facts about your child"
          />
        </div>

        {/* Security Message */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-sm text-purple-700">
          🛡️ <strong>Your Information is Super Safe!</strong> <br />
          We protect all family information with the highest security standards. Your data is never shared and is used only to provide the best service for your child! 💖
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded"
          >
            🚀 Submit Booking Request
          </button>
          <button
            type="button"
            className="border border-purple-400 text-purple-600 hover:bg-purple-100 font-semibold py-2 px-6 rounded"
          >
            Maybe Later
          </button>
        </div>
      </form>
    </div>
  );
}