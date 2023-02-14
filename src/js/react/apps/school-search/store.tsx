import { atom } from 'jotai';
import GlobalSettings from './enum/GlobalSettings';
import SearchParams from './types/SearchParams';
import UseCoordinates from './hooks/UseCoordinates';

export const configurationsAtom = atom(() => {
  const proxyUrl = drupalSettings?.helfi_react_search.elastic_proxy_url;

  return {
    baseUrl: proxyUrl
  };
});

export const paramsAtom = atom<SearchParams>({});
export const updatePageAtom = atom(null, (get, set, page: number) => {
  const params = get(paramsAtom);
  set(paramsAtom, {...params, page});
});

export default configurationsAtom;
