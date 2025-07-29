import { useState, useEffect } from 'react';

export default function LocationSearch({ onSelect }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!query) return;
      fetch('api/autocomplete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: query }),
        credentials: 'include' 
      })
        .then((res) => res.json())
        .then((data) => setSuggestions(data.places || []))
        console.log('Places returned:', data.places)
        .catch((err) => console.error('Error fetching places:', err));
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);
  
// changed auto search to use autocomplete for place and geocode for lat
  const handleSelect = async (place) => {
  setQuery(place.text);
  setSuggestions([]);

  try {
    const res = await fetch('/api/geocode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ place_id: place.place_id }),
    });

    const data = await res.json();

    onSelect({
      name: data.name_location,
      latitude: data.latitude,
      longitude: data.longitude,
    });
  } catch (error) {
    console.error('Error fetching geocode data:', error);
  }
};


  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search for a place..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border rounded w-full max-h-40 overflow-y-auto">
          {suggestions.map((place, index) => (
            <li
              key={index}
              onClick={() => handleSelect(place)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {place.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
