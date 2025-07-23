'use client';

import { useState, useEffect } from 'react'

export default function RouteSearchBar({ searchTerm, setSearchTerm, routes, onSelectSuggestion }){
    const [suggestions, setSuggestions]=useState([]);

    useEffect(()=>{
        if(!searchTerm){
            setSuggestions([]);
            return;
        }

        const matches= routes.filter(route => route.name.toLowerCase().include(searchTerm.toLowerCase())
    );
    setSuggestions(matches.slice(0, 5)); // maximum of five suggestions
    }, [searchTerm, routes]);

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
                setSuggestions([]);
              }}
            >
              {route.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
    

}