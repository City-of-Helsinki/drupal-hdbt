import { atom } from 'jotai';

import type URLParams from './types/URLParams';
import NewsSearchParams from './helpers/NewsSearchParams';

const params = new NewsSearchParams(window.location.search);

const initialParams = params.toInitialValue();

export const urlAtom = atom<URLParams>(initialParams);

export const urlUpdateAtom = atom(null, (get, set, values: URLParams) => {
  // Set atom value
  values.page = values.page || 1;
  set(urlAtom, values);
  set(stagedParamsAtom, values);

  // Push new params to window.history
  const newUrl = new URL(window.location.toString());
  const newParams = new NewsSearchParams();

  // eslint-disable-next-line
  for (const key in values) {
    const value = values[key as keyof URLParams];

    if (value) {
      newParams.set(key, value.toString());
    } else {
      newParams.delete(key);
    }
  }

  newUrl.search = newParams.toString();
  window.history.pushState({}, '', newUrl);
});

export const stagedParamsAtom = atom<URLParams>(initialParams);

export const setPageAtom = atom(null, (get, set, page: number) => {
  const urlParams = get(urlAtom);
  set(urlUpdateAtom, { ...urlParams, page });
});
