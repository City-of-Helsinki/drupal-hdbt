import { atom } from 'jotai';

import { AGGREGATIONS } from './query/queries';
import Settings from './enum/Settings';
import IndexFields from './enum/IndexFields';
import useAggregations from './hooks/useAggregations';
import type URLParams from './types/URLParams';
import type OptionType from './types/OptionType';
import useTimeoutFetch from '@/react/common/hooks/useTimeoutFetch';

type configurations = {
  error: Error|null,
  aggs: any
};

const getParams = (searchParams: URLSearchParams) => {
  const params: { [k: string]: any } = {};
  const entries = searchParams.entries();
  let result = entries.next();

  while (!result.done) {
    const [key, value] = result.value;

    if (!value) {
      result = entries.next();
    }
    else {
      const existing = params[key];
      if (existing) {
        const updatedValue = Array.isArray(existing) ? [...existing, value] : [existing, value];
        params[key] = updatedValue;
      } else {
        params[key] = [value];
      }

      result = entries.next();
    }
  }

  return params;
};

export const urlAtom = atom<URLParams>(getParams(new URLSearchParams(window.location.search)));

export const urlUpdateAtom = atom(null, (get, set, values: URLParams) => {
  // set atom value
  values.page = values.page || '1';
  set(urlAtom, values);

  // Set new params to window.location
  const newUrl = new URL(window.location.toString());
  const newParams = new URLSearchParams();

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

export const setPageAtom = atom(null, (get, set, page: string) => {
  const url = get(urlAtom);
  set(urlUpdateAtom, { ...url, page });
});

export const pageAtom = atom((get) => Number(get(urlAtom)?.page) || 1);

export const configurationsAtom = atom(async(): Promise<configurations> => {
  const proxyUrl = drupalSettings?.helfi_react_search.elastic_proxy_url;
  const url: string | undefined = proxyUrl;

  const body = JSON.stringify(AGGREGATIONS);

  return useTimeoutFetch(`${url}/${Settings.INDEX}/_search`, {
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
        aggs: {}
      };
    }

    return {
      error: null,
      aggs: aggregations
    };
  })
  .catch(error => ({
    error,
    aggs: {}
  }));
});

export const titleAtom = atom('');

export const districtsAtom = atom(async (get) => {
  const { error, aggs } = await get(configurationsAtom);

  if (error) {
    return [];
  }

  const options: OptionType[] = useAggregations(aggs, IndexFields.FIELD_PROJECT_DISTRICT_TITLE, 'districts_for_filters');
  return options;
});
export const districtSelectionAtom = atom<OptionType[]>([] as OptionType[]);

export const themesAtom = atom(async (get) => {
  const { error, aggs } = await get(configurationsAtom);

  if (error) {
    return [];
  }

  const options: OptionType[] = useAggregations(aggs, IndexFields.FIELD_PROJECT_THEME_NAME, 'project_theme_taxonomy_terms');
  return options;
});
export const themeSelectionAtom = atom<OptionType[]>([] as OptionType[]);

export const phasesAtom = atom(async (get) => {
  const { error, aggs } = await get(configurationsAtom);

  if (error) {
    return [];
  }

  const options: OptionType[] = useAggregations(aggs, IndexFields.FIELD_PROJECT_PHASE_NAME, 'project_phase_taxonomy_terms');
  return options;
});
export const phaseSelectionAtom = atom<OptionType[]>([] as OptionType[]);

export const typesAtom = atom(async (get) => {
  const { error, aggs } = await get(configurationsAtom);

  if (error) {
    return [];
  }

  const options: OptionType[] = useAggregations(aggs, IndexFields.FIELD_PROJECT_TYPE_NAME, 'project_type_taxonomy_terms');
  return options;
});
export const typeSelectionAtom = atom<OptionType[]>([] as OptionType[]);

export const resetFormAtom = atom(null, (get, set) => {
  set(titleAtom, '');
  set(districtSelectionAtom, []);
  set(themeSelectionAtom, []);
  set(phaseSelectionAtom, []);
  set(typeSelectionAtom, []);
  set(urlUpdateAtom, {});
});
