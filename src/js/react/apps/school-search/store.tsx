import { atom } from 'jotai';
import GlobalSettings from './enum/GlobalSettings';
import SearchParams from './types/SearchParams';

export const configurationsAtom = atom(async() => {
  const proxyUrl = drupalSettings?.helfi_react_search.elastic_proxy_url;

  return {
    baseUrl: proxyUrl
  };
});

const initializeAddressQuery = () => {
  const { coordinatesBaseUrl } = GlobalSettings;

  const baseUrl = new URL(coordinatesBaseUrl);
  return {
    address: null,
    coordsUrl: baseUrl.toString()
  };
};

type addressQueries = {
  address: string|null;
  coordsUrl: string;
};
export const addressQueriesAtom = atom<addressQueries>(initializeAddressQuery());
export const updateAddressQueriesAtom = atom(
  null,
  (get, set, address: string) => {
    const current = get(addressQueriesAtom);
    const url = new URL(current.coordsUrl);
    const params = new URLSearchParams(url.search);
    params.set('q', address);
    url.search = params.toString();

    set(addressQueriesAtom, {
      address,
      coordsUrl: url.toString()
    });
  }
);

export const paramsAtom = atom<SearchParams>({});
export const updateParamsAtom = atom(null, (get, set, params: SearchParams) => {
  if (params.keyword) {
    set(updateAddressQueriesAtom, params.keyword);
  }

  set(paramsAtom, params);
});

export default configurationsAtom;
