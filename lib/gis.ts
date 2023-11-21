export async function reverseGeocode(
  {
    lat,
    lng,
  }: {
    lat: number;
    lng: number;
  },
  apiKey: string,
) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

  try {
    const response = await fetch(url).then((r) => r.json());
    if (response.data.status === "OK") {
      return response.data.results;
    } else {
      throw new Error(
        "Geocoding API returned an error: " + response.data.status,
      );
    }
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

export async function geocode(address: string, apiKey: string) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address,
  )}&key=${apiKey}`;

  try {
    const response = await fetch(url).then((r) => r.json());
    if (response.status === "OK") {
      console.log('response: ', response)
      return response.results
    } else {
      throw new Error("Geocoding API returned an error: " + response.status);
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}
