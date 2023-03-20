import { atom } from 'jotai';
import GlobalSettings from './enum/GlobalSettings';
import SearchParams from './types/SearchParams';

export const configurationsAtom = atom(() => {
  const proxyUrl = drupalSettings?.helfi_react_search.elastic_proxy_url;

  return {
    baseUrl: proxyUrl
  };
});

export const paramsAtom = atom<SearchParams>({});
export const stagedParamsAtom = atom<SearchParams>({});
export const updateParamsAtom = atom(null, (get, set, params: SearchParams) => {
  const urlSearchParams: {[key: string]: string} = {};
  Object.keys(params).forEach((key: string) => {
    if (key === 'query') {
      return;
    }

    urlSearchParams[key as string] = String(params[key as keyof SearchParams]);
  });
  const query = new URLSearchParams(urlSearchParams).toString();
  set(stagedParamsAtom, { ...params, query});
  set(paramsAtom, {...params, query});

  console.log(params, query);
});

export default configurationsAtom;
