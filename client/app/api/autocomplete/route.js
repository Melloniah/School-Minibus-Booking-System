export async function POST(req) {
  const body = await req.json();
  const input = body.input;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    input
  )}&key=${apiKey}&components=country:ke`;

  const res = await fetch(url);
  const data = await res.json();

  return Response.json({
    places: data.predictions.map((p) => ({
      text: p.description,
      place_id: p.place_id, // Important for fetching coordinates
    })),
  });
}

