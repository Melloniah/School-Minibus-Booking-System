
import { useState, useEffect } from 'react';

export default function LocationSearch() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!query) return;
      fetch('api/autocomplete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: query })
      })
        .then(res => res.json())
        .then(data => {
            setSuggestions(data.places || [])
            console.log(data.places)
        })
        .catch(err => console.error('Error fetching places:', err));
    }, 300); // debounce

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search for a place..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <ul>
        {suggestions.map((place, index) => (
          <li key={index}>{place.text}</li>
        ))}
      </ul>

    </div>
  );
}