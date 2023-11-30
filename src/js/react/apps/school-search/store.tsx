import { atom } from 'jotai';

import { AGGREGATIONS } from './helpers/FeatureQuery';
import SearchParams from './types/SearchParams';
import type OptionType from './types/OptionType';
import GlobalSettings from './enum/GlobalSettings';

type configurations = {
  error: Error|null,
  aggs: any
  baseUrl: string;
};

export const configurationsAtom = atom(async(): Promise<configurations> => {
  const proxyUrl = drupalSettings?.helfi_react_search.elastic_proxy_url;
  const { index } = GlobalSettings;

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

  const context = 'TPR Ontologyword details schools';

  const a1IdsToLang: any = {
    15: Drupal.t('English', {}, { context }),
    16: Drupal.t('Spanish', {}, { context }),
    17: Drupal.t('Hebrew', {}, { context }),
    18: Drupal.t('Italian', {}, { context }),
    19: Drupal.t('Chinese', {}, { context }),
    20: Drupal.t('Latin', {}, { context }),
    21: Drupal.t('French', {}, { context }),
    22: Drupal.t('Swedish', {}, { context }),
    23: Drupal.t('German', {}, { context }),
    24: Drupal.t('Finnish', {}, { context }),
    25: Drupal.t('Russian', {}, { context }),
    26: Drupal.t('Estonian', {}, { context })
  };

  const a1options = ontologywordIds?.buckets.reduce((acc: any, currentItem: any) => {
    if (a1IdsToLang[currentItem.key]) {
      acc.push({ label: a1IdsToLang[currentItem.key], value: currentItem.key });
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

  const context = 'TPR Ontologyword details schools';

  const a2IdsToLang: any = {
    27: Drupal.t('English', {}, { context }),
    28: Drupal.t('Spanish', {}, { context }),
    29: Drupal.t('Hebrew', {}, { context }),
    30: Drupal.t('Italian', {}, { context }),
    31: Drupal.t('Chinese', {}, { context }),
    32: Drupal.t('Latin', {}, { context }),
    33: Drupal.t('French', {}, { context }),
    34: Drupal.t('Swedish', {}, { context }),
    35: Drupal.t('German', {}, { context }),
    36: Drupal.t('Finnish', {}, { context }),
    37: Drupal.t('Russian', {}, { context }),
    38: Drupal.t('Estonian', {}, { context }),
  };

  const a2options = ontologywordIds?.buckets.reduce((acc: any, currentItem: any) => {
    if (a2IdsToLang[currentItem.key]) {
      acc.push({ label: a2IdsToLang[currentItem.key], value: currentItem.key });
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

  const context = 'TPR Ontologyword details schools';

  const b1IdsToLang: any = {
    101: Drupal.t('English', {}, { context }),
    102: Drupal.t('Spanish', {}, { context }),
    103: Drupal.t('Hebrew', {}, { context }),
    104: Drupal.t('Italian', {}, { context }),
    105: Drupal.t('Chinese', {}, { context }),
    106: Drupal.t('Latin', {}, { context }),
    107: Drupal.t('French', {}, { context }),
    108: Drupal.t('Swedish', {}, { context }),
    109: Drupal.t('German', {}, { context }),
    110: Drupal.t('Finnish', {}, { context }),
    111: Drupal.t('Russian', {}, { context }),
    112: Drupal.t('Estonian', {}, { context })
  };

  const b1options = ontologywordIds?.buckets.reduce((acc: any, currentItem: any) => {
    if (b1IdsToLang[currentItem.key]) {
      acc.push({ label: b1IdsToLang[currentItem.key], value: currentItem.key });
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

  const context = 'TPR Ontologyword details schools';

  const b2IdsToLang: any = {
    113: Drupal.t('English', {}, { context }),
    114: Drupal.t('Spanish', {}, { context }),
    115: Drupal.t('Hebrew', {}, { context }),
    116: Drupal.t('Italian', {}, { context }),
    117: Drupal.t('Chinese', {}, { context }),
    118: Drupal.t('Latin', {}, { context }),
    119: Drupal.t('French', {}, { context }),
    120: Drupal.t('Swedish', {}, { context }),
    121: Drupal.t('German', {}, { context }),
    122: Drupal.t('Finnish', {}, { context }),
    123: Drupal.t('Russian', {}, { context }),
    124: Drupal.t('Estonian', {}, { context })
  };

  const b2options = ontologywordIds?.buckets.reduce((acc: any, currentItem: any) => {
    if (b2IdsToLang[currentItem.key]) {
      acc.push({ label: b2IdsToLang[currentItem.key], value: currentItem.key });
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

  const woptions = ontologywordClarifications?.buckets.reduce((acc: any, currentItem: any) => {
    acc.push({ label: currentItem.key, value: currentItem.key });
    return acc;
  }, []);

  return woptions;
});
export const weightedEducationSelectionAtom = atom<OptionType[]>([] as OptionType[]);

export const bilingualEducationAtom = atom(async (get) => {
  const { error, aggs: { ontologywordIds } } = await get(configurationsAtom);

  if (error) {
    return [];
  }

  const context = 'TPR Ontologyword details schools';

  const bilingualIdsToLang: any = {
    293: Drupal.t('Language immersion (English)', {}, { context }),
    295: Drupal.t('Language immersion (Swedish)', {}, { context }),
    297: Drupal.t('Language immersion (German)', {}, { context }),
    904: Drupal.t('Finnish-English', {}, { context }),
    905: Drupal.t('Finnish-Chinese', {}, { context }),
    906: Drupal.t('Finnish-Spanish', {}, { context }),
    907: Drupal.t('Finnish-Northern Sami', {}, { context }),
    908: Drupal.t('Finnish-Estonian', {}, { context }),
    909: Drupal.t('Finnish-Russian', {}, { context }),
    910: Drupal.t('Language-enriched education (Finnish-English)', {}, { context }),
    911: Drupal.t('Language-enriched education (Finnish-Russian)', {}, { context })
  };

  const bilingualOptions = ontologywordIds?.buckets.reduce((acc: any, currentItem: any) => {
    if (bilingualIdsToLang[currentItem.key]) {
      acc.push({ label: bilingualIdsToLang[currentItem.key], value: currentItem.key });
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
