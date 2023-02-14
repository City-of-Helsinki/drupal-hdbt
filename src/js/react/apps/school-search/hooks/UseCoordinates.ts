import useSWR from 'swr';
import { useAtomValue } from 'jotai';
import GlobalSettings from '../enum/GlobalSettings';
import { paramsAtom } from '../store';

const getCoordsUrl = (address: string) => {
  const { coordinatesBaseUrl } = GlobalSettings; 
  const url = new URL(coordinatesBaseUrl);
  const params = new URLSearchParams(url.search);
  params.set('q', address);
  url.search = params.toString();

  return url.toString();
};

const UseCoordinates = () => {  
  const { address } = useAtomValue(paramsAtom);

  const fetcher = () => {
    if (!address) {
      return [];
    }

    return fetch(getCoordsUrl(address)).then((res) => res.json());
  };

  const { data, error, isLoading } = useSWR(address, fetcher, {
    revalidateOnFocus: false
  });
  
  if (!data || !data.results || error) {
    return {
      coordinates: [],
    };
  }

  const [lon, lat] = data.results[0].location.coordinates;
  return {
    coordinates: [lat, lon],
    isLoading
  };
};

export default UseCoordinates;
