import { atom } from 'jotai';

import { AGGREGATIONS } from './helpers/FeatureQuery';
import SearchParams from './types/SearchParams';
import type OptionType from './types/OptionType';
import AppSettings from './enum/AppSettings';
import ontologyDetailsIdsToLang from './enum/LanguageEducationMap';

type configurations = {
  error: Error|null,
  aggs: any
  baseUrl: string;
};

export const configurationsAtom = atom(async(): Promise<configurations> => {
  const proxyUrl = drupalSettings?.helfi_react_search.elastic_proxy_url;
  const { index } = AppSettings;

  const body = JSON.stringify(AGGREGATIONS);

  return fetch(`${proxyUrl}/${index}/_search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  })
  .then(res => res.json())
  .then(json => {
    const aggregations = json?.aggregations;

    if (!aggregations) {
      return {
        error: new Error(
          'Initialization failed.'
        ),
        aggs: {},
        baseUrl: proxyUrl
      };
    }

    return {
      error: null,
      aggs: aggregations,
      baseUrl: proxyUrl
    };
  })
  .catch(error => ({
    error,
    aggs: {},
    baseUrl: proxyUrl
  }));

});

export const a1Atom = atom(async (get) => {
  const { error, aggs: { ontologywordIds } } = await get(configurationsAtom);

  if (error) {
    return [];
  }

  const a1options = ontologywordIds?.buckets.reduce((acc: any, currentItem: any) => {
    if ((currentItem.key >= 15 && currentItem.key <= 26) && ontologyDetailsIdsToLang[currentItem.key]) {
      acc.push({ label: ontologyDetailsIdsToLang[currentItem.key], value: currentItem.key });
    }

    return acc;
  }, []);

  return a1options;
});
export const a1SelectionAtom = atom<OptionType[]>([] as OptionType[]);

export const a2Atom = atom(async (get) => {
  const { error, aggs: { ontologywordIds } } = await get(configurationsAtom);

  if (error) {
    return [];
  }

  const a2options = ontologywordIds?.buckets.reduce((acc: any, currentItem: any) => {
    if ((currentItem.key >= 27 && currentItem.key <= 38) && ontologyDetailsIdsToLang[currentItem.key]) {
      acc.push({ label: ontologyDetailsIdsToLang[currentItem.key], value: currentItem.key });
    }
    return acc;
  }, []);

  return a2options;
});
export const a2SelectionAtom = atom<OptionType[]>([] as OptionType[]);

export const b1Atom = atom(async (get) => {
  const { error, aggs: { ontologywordIds } } = await get(configurationsAtom);

  if (error) {
    return [];
  }

  const b1options = ontologywordIds?.buckets.reduce((acc: any, currentItem: any) => {
    if ((currentItem.key >= 101 && currentItem.key <= 112) && ontologyDetailsIdsToLang[currentItem.key]) {
      acc.push({ label: ontologyDetailsIdsToLang[currentItem.key], value: currentItem.key });
    }
    return acc;
  }, []);

  return b1options;
});
export const b1SelectionAtom = atom<OptionType[]>([] as OptionType[]);

export const b2Atom = atom(async (get) => {
  const { error, aggs: { ontologywordIds } } = await get(configurationsAtom);

  if (error) {
    return [];
  }

  const b2options = ontologywordIds?.buckets.reduce((acc: any, currentItem: any) => {
    if ((currentItem.key >= 113 && currentItem.key <= 124) && ontologyDetailsIdsToLang[currentItem.key]) {
      acc.push({ label: ontologyDetailsIdsToLang[currentItem.key], value: currentItem.key });
    }
    return acc;
  }, []);

  return b2options;
});
export const b2SelectionAtom = atom<OptionType[]>([] as OptionType[]);

export const weightedEducationAtom = atom(async (get) => {
  const { error, aggs: { ontologywordClarifications } } = await get(configurationsAtom);

  if (error) {
    return [];
  }

  const weightedOptions = ontologywordClarifications?.buckets.reduce((acc: any, currentItem: any) => {
    acc.push({ label: currentItem.key, value: currentItem.key });
    return acc;
  }, []);

  return weightedOptions;
});
export const weightedEducationSelectionAtom = atom<OptionType[]>([] as OptionType[]);

export const bilingualEducationAtom = atom(async (get) => {
  const { error, aggs: { ontologywordIds } } = await get(configurationsAtom);

  if (error) {
    return [];
  }

  const bilingualOptions = ontologywordIds?.buckets.reduce((acc: any, currentItem: any) => {
    if ((currentItem.key >= 293 && currentItem.key <= 911) && ontologyDetailsIdsToLang[currentItem.key]) {
      acc.push({ label: ontologyDetailsIdsToLang[currentItem.key], value: currentItem.key });
    }
    return acc;
  }, []);

  return bilingualOptions;
});
export const bilingualEducationSelectionAtom = atom<OptionType[]>([] as OptionType[]);

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
});

export default configurationsAtom;
