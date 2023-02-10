import useSWR from 'swr';
import GlobalSettings from '../enum/GlobalSettings';

const getCoordsUrl = (address: string) => {
  const { coordinatesBaseUrl } = GlobalSettings; 
  const url = new URL(coordinatesBaseUrl);
  const params = new URLSearchParams(url.search);
  params.set('q', address);
  url.search = params.toString();

  return url.toString();
};

const UseCoordinates = (address?: string): number[]|null => {  
  const fetcher = () => {
    if (!address) {
      return null;
    }

    return fetch(getCoordsUrl(address)).then((res) => res.json());
  };

  const { data, error } = useSWR(address, fetcher, {
    revalidateOnFocus: false
  });
  
  if (!data || error) {
    return null;
  }

  const [lon, lat] = data.results[0].location.coordinates;
  return [lat, lon];
};

export default UseCoordinates;
