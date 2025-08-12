export async function POST(req) {
  const body = await req.json();
  const place_id = body.place_id;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!place_id) {
    return Response.json({ error: 'place_id is required' }, { status: 400 });
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.result || !data.result.geometry) {
      return Response.json({ error: 'Invalid place_id or missing data' }, { status: 400 });
    }

    const location = data.result.geometry.location;

    return Response.json({
      name_location: data.result.name,
      latitude: location.lat,
      longitude: location.lng,
    });
  } catch (error) {
    return Response.json({ error: 'Server error', details: error.message }, { status: 500 });
  }
}
