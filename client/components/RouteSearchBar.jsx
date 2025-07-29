// handles search input and suggestions

'use client';

import { useState, useEffect, useMemo } from 'react' 

export default function RouteSearchBar({ searchTerm, setSearchTerm, routes, onSelectSuggestion }){
    const [suggestions, setSuggestions] = useState([]);

   const filteredSuggestion = useMemo(() => { 
     if (!searchTerm.trim()) return [];
     
     return routes.filter(route => 
       route.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
       route.route_name?.toLowerCase().includes(searchTerm.toLowerCase()) // Fallback
     ).slice(0, 5); // Limit suggestions
   }, [routes, searchTerm]);

   // Update suggestions when filteredSuggestions changes
   useEffect(() => {
     setSuggestions(filteredSuggestion);
   }, [filteredSuggestion]);

    return(
        <div className="relative mb-6">
      <input
        type="text"
        placeholder="Search a route..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 w-full border rounded"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border w-full rounded shadow mt-1 max-h-48 overflow-y-auto">
        {suggestions.map((route) => (
  <li
    key={route.id}
    className="p-2 hover:bg-purple-100 cursor-pointer text-sm"
    onClick={() => {
      onSelectSuggestion(route);
      setSuggestions([]); // Clear suggestions after selection
    }}
  >
    {route.name || route.route_name || 'Unnamed Route'}
  </li>
))}
        </ul>
      )}
    </div>
  );
}