import { atom } from 'jotai';
import NewsSearchParams from './helpers/NewsSearchParams';
import type URLParams from './types/URLParams';

type OptionType = { label: string; value: string };

const initialParamString = drupalSettings.helfi_news_archive.default_query ?? window.location.search;
const params = new NewsSearchParams(initialParamString);

const initialParams = params.toInitialValue();

export const urlAtom = atom<URLParams>(initialParams);

export const topicOptionsAtom = atom<OptionType[]>([]);
export const neighbourhoodOptionsAtom = atom<OptionType[]>([]);
export const groupOptionsAtom = atom<OptionType[]>([]);

export const urlUpdateAtom = atom(null, (_get, set, values: URLParams) => {
  // Set atom value
  values.page = values.page || 1;
  set(urlAtom, values);
  set(stagedParamsAtom, values);

  // Push new params to window.history
  const newUrl = new URL(window.location.toString());
  const newParams = new NewsSearchParams();

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

declare const ELASTIC_DEV_URL: string | undefined;
const getElasticUrl = () => {
  const devUrl = typeof ELASTIC_DEV_URL !== 'undefined' ? ELASTIC_DEV_URL : undefined;

  return devUrl || drupalSettings.helfi_news_archive.elastic_proxy_url;
};
export const getElasticUrlAtom = atom(getElasticUrl);
