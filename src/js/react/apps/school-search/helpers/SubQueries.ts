import GlobalSettings from '../enum/GlobalSettings';

export const getAddressUrls = (address: string) => {
  const { addressBaseUrl } = GlobalSettings;
  const languages = ['fi', 'sv'];

  // Servicemap's search API works only with one language, distinct urls is needed to get both lang data
  const urls = languages.map((language: string) => {
    const url = new URL(addressBaseUrl);
    const params = new URLSearchParams(url.search);
    params.set('q', address);
    params.set('language', language);
    url.search = params.toString();

    return url.toString();
  });

  return urls;
};

export const getAddresses = (urls: string[]) => {
  const promises = urls.map(async (url: string) => fetch(url).then((res) => res.json()));

  return Promise.all(promises);
};

export const parseCoordinates = (addressData: any) => {
  const addresses = addressData.filter((address: any) => address.results.length);
  const [lon, lat]: number[] = addresses[0].results[0].location.coordinates;
  return [lat, lon];
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


