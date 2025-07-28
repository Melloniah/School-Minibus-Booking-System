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
      })
        .then((res) => res.json())
        .then((data) => setSuggestions(data.places || []))
        .catch((err) => console.error('Error fetching places:', err));
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (place) => {
    setQuery(place.text);
    setSuggestions([]);
    onSelect(place.text);
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
