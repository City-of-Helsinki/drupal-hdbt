import { atom } from 'jotai';
import getParams from '@/react/common/helpers/UrlParams';
import type URLParams from './types/URLParams';
import NewsSearchParams from './helpers/NewsSearchParams';

const getParams = () => {
  const params = new NewsSearchParams(window.location.search);

  return params.toInitialValue();
}

export const urlAtom = atom<URLParams>(getParams());

export const urlUpdateAtom = atom(null, (get, set, values: URLParams) => {
  // Set atom value
  values.page = values.page || '1';
  set(urlAtom, values);

  // Push new params to window.history
  const newUrl = new URL(window.location.toString());
  const newParams = new NewsSearchParams();

  // eslint-disable-next-line
  for (const key in values) {
    const value = values[key as keyof URLParams];

    if (Array.isArray(value)) {
      value.forEach((option: string) => newParams.append(key, option));
    } else if (value) {
      newParams.set(key, value.toString());
    } else {
      newParams.delete(key);
    }
  }

  newUrl.search = newParams.toString();
  window.history.pushState({}, '', newUrl);
});
