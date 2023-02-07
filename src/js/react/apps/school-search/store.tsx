import { atom } from 'jotai';

export const configurationsAtom = atom(async() => {
  const proxyUrl = drupalSettings?.helfi_react_search.elastic_proxy_url;

  return {
    baseUrl: proxyUrl
  };
});

export default configurationsAtom;
