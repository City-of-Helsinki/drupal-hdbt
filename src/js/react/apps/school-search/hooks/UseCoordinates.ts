import useSWR from 'swr';
import GlobalSettings from '../enum/GlobalSettings';

;

const getCoordsUrl = (address: string) => {
  const { coordinatesBaseUrl } = GlobalSettings; 
  const url = new URL(coordinatesBaseUrl);
  const params = new URLSearchParams(url.search);
  params.set('q', address);
  url.search = params.toString();

  return url.toString();
};

const parseCoordinates = (data: any) => {
  const [lon, lat]: number[] = data.results[0].location.coordinates; 
  return [lat, lon];
};

const UseCoordinates = (address: string|undefined) => {  
  const fetcher = () => {
    if (!address) {
      return null;
    }

    return fetch(getCoordsUrl(address)).then((res) => res.json());
  };

  const { data, isLoading, isValidating } = useSWR(address, fetcher, {
    revalidateOnFocus: false
  });

  if (!address) {
    return {
      coordinates: null,
      isLoading: false,
      isValidating: false,
      noResults: false
    };
  }

  let noResults = false;
  let coordinates = null;

  try {
    coordinates = parseCoordinates(data);
  }
  catch (e) {
    noResults = true;
  }

  return {
    coordinates,
    isLoading,
    isValidating,
    noResults
  };
};

export default UseCoordinates;
