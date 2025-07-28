export async function POST(req) {
  const body = await req.json();
  const input = body.input;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const response = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey
    },
    body: JSON.stringify({
      input,
      languageCode: 'en',
      locationBias: {
        circle: {
          center: { latitude: -11.7, longitude: 27.4 }, // Kanina region
          radius: 50000.0
        }
      }
    })
  });

  const data = await response.json();
  return Response.json({ places: data.suggestions || [] });
}