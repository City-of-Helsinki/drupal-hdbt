import { atom } from 'jotai';
import GlobalSettings from './enum/GlobalSettings';

export const configurationsAtom = atom(async() => {
  const proxyUrl = drupalSettings?.helfi_react_search.elastic_proxy_url;

  return {
    baseUrl: proxyUrl
  };
});

const initializeAddressQuery = () => {
  const { serviceMapUrl } = GlobalSettings;

  const baseUrl = new URL(serviceMapUrl);
  return baseUrl.toString();
};

export const addressQueryAtom = atom<string>(initializeAddressQuery());

export const updateAddressQueryAtom = atom(
  null,
  (get, set, address: string) => {
    const current = get(addressQueryAtom);
    const url = new URL(current);
    const params = new URLSearchParams(url.search);
    params.set('address', address);
    url.search = params.toString();

    set(addressQueryAtom, url.toString());
  }
);

export default configurationsAtom;
