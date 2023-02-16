import GlobalSettings from '../enum/GlobalSettings';

export const getCoordsUrl = (address: string) => {
  const { coordinatesBaseUrl } = GlobalSettings; 
  const url = new URL(coordinatesBaseUrl);
  const params = new URLSearchParams(url.search);
  params.set('q', address);
  url.search = params.toString();

  return url.toString();
};

export const getLocationsUrl = (lat: number|undefined, lon: number|undefined) => {
  const { locationsBaseUrl } = GlobalSettings;

  const url = new URL(locationsBaseUrl);
  const params = new URLSearchParams(url.search);

  if (lat && lon) {
    params.set('lon', lon.toString());
    params.set('lat', lat.toString());
  }

  url.search = params.toString();

  return url.toString();
};

export const parseCoordinates = (data: any) => {
  const [lon, lat]: number[] = data.results[0].location.coordinates; 
  return [lat, lon];
};
