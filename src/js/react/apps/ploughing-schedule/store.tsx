import { atom } from 'jotai';

import type SearchParams from './types/SearchParams';

export const configurationsAtom = atom(() => {
  const proxyUrl = drupalSettings?.helfi_react_search.elastic_proxy_url;

  return {
    baseUrl: proxyUrl,
    index: 'street_data',
  };
});

export const paramsAtom = atom<SearchParams>({});
export const stagedParamsAtom = atom<SearchParams>({});
export const updateParamsAtom = atom(null, (_get, set, params: SearchParams) => {
  set(stagedParamsAtom, { ...params });
  set(paramsAtom, { ...params });
});

export default configurationsAtom;
