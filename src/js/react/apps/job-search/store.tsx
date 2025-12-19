/** biome-ignore-all lint/suspicious/noExplicitAny: @todo UHF-12501 */
import { atom } from 'jotai';

declare const ELASTIC_DEV_URL: string | undefined;
import type Result from '@/types/Result';
import CustomIds from './enum/CustomTermIds';
import { getAreaInfo } from './helpers/Areas';
import { getLanguageLabel } from './helpers/Language';
import { sortOptions } from './helpers/Options';
import { paramsFromSelections } from './helpers/Params';
import type AggregationItem from './types/AggregationItem';
import type OptionType from './types/OptionType';
import type Term from './types/Term';
import type URLParams from './types/URLParams';
import SearchComponents from './enum/SearchComponents';

// Make maps out of bucket responses
const bucketToMap = (bucket: AggregationItem[]) => {
  const result = new Map();

  bucket.forEach((item) => {
    if (item?.unique?.value) {
      result.set(item.key, item.unique.value);
    } else {
      result.set(item.key, item.doc_count);
    }
  });

  return result;
};

const arrayParams = [
  SearchComponents.TASK_AREAS,
  SearchComponents.EMPLOYMENT,
  SearchComponents.AREA_FILTER,
];

const getParams = (searchParams: URLSearchParams) => {
  const params: { [k: string]: any } = {};
  const entries = searchParams.entries();
  let result = entries.next();

  while (!result.done) {
    const [key, value] = result.value;

    if (!value) {
      result = entries.next();
      continue;
    }

    let parsedValue: string | string[];

    if (arrayParams.includes(key)) {
      parsedValue = value.toString().includes(',')
        ? value.toString().split(',')
        : [value];
    } else {
      parsedValue = value;
    }
    const existing = params[key];

    if (Array.isArray(parsedValue)) {
      const existingValues = Array.isArray(existing)
        ? existing
        : (existing ?? []);
      params[key] = [...existingValues, ...parsedValue];

      result = entries.next();
      continue;
    }

    const updatedValue = Array.isArray(existing)
      ? [...existing, parsedValue]
      : existing
        ? [existing, parsedValue]
        : parsedValue;
    params[key] = updatedValue;

    result = entries.next();
  }

  return params;
};

const defaultSearchState = {
  [SearchComponents.AREA_FILTER]: [] as OptionType[],
  [SearchComponents.EMPLOYMENT]: [] as OptionType[],
  [SearchComponents.KEYWORD]: '',
  [SearchComponents.TASK_AREAS]: [] as OptionType[],
  [SearchComponents.EMPLOYMENT_RELATIONSHIP]: [] as OptionType[],
  [SearchComponents.CONTINUOUS]: false,
  [SearchComponents.INTERNSHIPS]: false,
  [SearchComponents.LANGUAGE]: [] as OptionType[],
  [SearchComponents.SUMMER_JOBS]: false,
  [SearchComponents.YOUTH_SUMMER_JOBS]: false,
};

export const searchStateAtom =
  atom<typeof defaultSearchState>(defaultSearchState);
export const submittedStateAtom =
  atom<typeof defaultSearchState>(defaultSearchState);

export const submitStateAtom = atom(null, (get, set) => {
  const searchState = get(searchStateAtom);
  const submittedState = get(submittedStateAtom);
  const newState = { ...searchState, page: '1' };

  if (JSON.stringify(newState) !== JSON.stringify(submittedState)) {
    set(submittedStateAtom, newState);
  }
});

export const setStateValueAtom = atom(
  null,
  (
    get,
    set,
    payload: {
      key: keyof typeof defaultSearchState;
      value: string | OptionType[] | boolean;
    },
  ) => {
    const searchState = get(searchStateAtom) || defaultSearchState;
    const newState = { ...searchState, [payload.key]: payload.value };

    set(searchStateAtom, newState);
  },
);

export const urlAtom = atom<URLParams>(
  getParams(new URLSearchParams(window.location.search)),
);

export const urlUpdateAtom = atom(null, (_get, set, values: URLParams) => {
  values.page = values.page || '1';
  set(urlAtom, values);

  const newUrl = new URL(window.location.toString());
  newUrl.search = paramsFromSelections(values);
  window.history.pushState({}, '', newUrl);
});

export const getKeywordAtom = atom((get) => {
  const searchState = get(searchStateAtom);
  return searchState ? (searchState[SearchComponents.KEYWORD] as string) : '';
});

export const getTaskAreasAtom = atom((get) => {
  const searchState = get(searchStateAtom);
  return searchState
    ? (searchState[SearchComponents.TASK_AREAS] as OptionType[])
    : [];
});

export const getEmploymentAtom = atom((get) => {
  const searchState = get(searchStateAtom);
  return searchState
    ? (searchState[SearchComponents.EMPLOYMENT] as OptionType[])
    : [];
});

export const getLanguageAtom = atom((get) => {
  const searchState = get(searchStateAtom);
  return searchState[SearchComponents.LANGUAGE];
});

export const getAreaAtom = atom((get) => {
  const searchState = get(searchStateAtom);
  return searchState
    ? (searchState[SearchComponents.AREA_FILTER] as OptionType[])
    : [];
});

export const getCheckBoxValuesAtom = atom((get) => {
  const searchState = get(searchStateAtom);
  return [
    searchState ? (searchState[SearchComponents.CONTINUOUS] as boolean) : false,
    searchState
      ? (searchState[SearchComponents.INTERNSHIPS] as boolean)
      : false,
    searchState
      ? (searchState[SearchComponents.SUMMER_JOBS] as boolean)
      : false,
    searchState
      ? (searchState[SearchComponents.YOUTH_SUMMER_JOBS] as boolean)
      : false,
  ];
});

export const getPageAtom = atom((get) => {
  const submittedState = get(submittedStateAtom);

  return submittedState ? Number(submittedState[SearchComponents.PAGE]) : 1;
});

export const setPageAtom = atom(null, (get, set, page: string) => {
  const submittedState = get(submittedStateAtom) || defaultSearchState;
  const newState = { ...submittedState, [SearchComponents.PAGE]: page };

  set(submittedStateAtom, newState);
});

export const resetFormAtom = atom(null, (_get, set) => {
  set(searchStateAtom, defaultSearchState);
  set(submittedStateAtom, defaultSearchState);
});

export const hasChoicesAtom = atom((get) => {
  const submittedState = get(submittedStateAtom);

  if (!submittedState) {
    return false;
  }

  return Object.entries(submittedState).some(
    ([key, value]) =>
      key !== SearchComponents.PAGE &&
      key !== SearchComponents.ORDER &&
      ((Array.isArray(value) && value.length > 0) ||
        (typeof value === 'string' && value.trim() !== '') ||
        (typeof value === 'boolean' && value === true)),
  );
});

type configurations = {
  taskAreaOptions: any;
  taskAreas: any;
  employment: any;
  employmentOptions: any;
  employmentSearchIds: any;
  employmentType: any;
  languages: any;
  promoted: any;
};

export const configurationsAtom = atom<configurations | undefined>(undefined);

export const taskAreasAtom = atom(async (get) => {
  const configurations = get(configurationsAtom);

  if (!configurations) {
    return [];
  }

  const { taskAreaOptions, taskAreas } = configurations;

  const aggs = bucketToMap(taskAreas);

  return taskAreaOptions
    .map((option: Result<Term>) => {
      const count = aggs.get(option._source.field_external_id[0]) || 0;
      const { name } = option._source;

      return {
        count,
        label: `${name} (${count})`,
        simpleLabel: name,
        value: option._source.field_external_id[0],
      };
    })
    .sort((a: OptionType, b: OptionType) => sortOptions(a, b));
});

export const employmentAtom = atom(async (get) => {
  const configurations = get(configurationsAtom);

  if (!configurations) {
    return [];
  }

  const { employment, employmentOptions, employmentType } = configurations;

  const combinedAggs = bucketToMap(employment.concat(employmentType));

  const visibleOptions = employmentOptions.filter(
    (term: Result<Term>) =>
      term._source?.field_search_id?.[0] &&
      ![CustomIds.PERMANENT_SERVICE, CustomIds.FIXED_SERVICE].includes(
        term._source.field_search_id[0],
      ),
  );

  const options = visibleOptions
    // biome-ignore lint/suspicious/useIterableCallbackReturn: @todo UHF-12501
    .map((term: Result<Term>) => {
      const tid = term._source.tid[0];
      const customId = term._source.field_search_id?.[0];
      let count = 0;
      let additionalValue = null;
      let label = '';
      let simpleLabel = term._source.name;

      if (!customId) {
        return;
      }

      // Combine results for service / contractual employments
      if (customId.toString() === CustomIds.PERMANENT_CONTRACTUAL) {
        const permanentService = employmentOptions.find(
          (optionTerm: Result<Term>) =>
            optionTerm._source?.field_search_id?.[0] ===
            CustomIds.PERMANENT_SERVICE,
        )?._source.tid[0];
        additionalValue = permanentService;
        count =
          (combinedAggs.get(tid) || 0) +
          (combinedAggs.get(permanentService) || 0);
        label = `${Drupal.t('Permanent', {}, { context: 'Employment filter value' })} (${count})`;
        simpleLabel = Drupal.t(
          'Permanent contract and service employment',
          {},
          { context: 'Employment filter selection value' },
        );
      } else if (customId.toString() === CustomIds.FIXED_CONTRACTUAL) {
        const fixedService = employmentOptions.find(
          (optionTerm: Result<Term>) =>
            optionTerm._source?.field_search_id?.[0] ===
            CustomIds.FIXED_SERVICE,
        )?._source.tid[0];
        additionalValue = fixedService;
        count =
          (combinedAggs.get(tid) || 0) + (combinedAggs.get(fixedService) || 0);
        label = `${Drupal.t('Fixed-term', {}, { context: 'Employment filter value' })} (${count})`;
        simpleLabel = Drupal.t(
          'Fixed-term contract and service employment',
          {},
          { context: 'Employment filter selection value' },
        );
      } else {
        count = combinedAggs.get(tid) || 0;
        if (customId.toString() === CustomIds.ALTERNATION) {
          label = `${Drupal.t('Job alternation leave substitute for Helsinki residents', {}, { context: 'Employment filter value' })} (${count})`;
          simpleLabel = Drupal.t(
            'Job alternation leave substitute for Helsinki residents',
            {},
            { context: 'Employment filter value' },
          );
        } else {
          label = `${term._source.name} (${count})`;
        }
      }

      return {
        count,
        label,
        simpleLabel,
        value: additionalValue ? [tid, additionalValue] : tid,
      };
    })
    .sort((a: OptionType, b: OptionType) => sortOptions(a, b));
  return options;
});

export const getEmploymentSearchIdMap = atom((get) => {
  const configurations = get(configurationsAtom);

  if (!configurations?.employmentSearchIds) {
    return new Map();
  }

  const { employmentSearchIds } = configurations;
  return bucketToMap(employmentSearchIds);
});

export const languagesAtom = atom(async (get) => {
  const configurations = get(configurationsAtom);

  if (!configurations) {
    return [];
  }

  const { languages } = configurations;

  const languageMap = bucketToMap(languages);
  const languageOptions = ['fi', 'sv', 'en'];

  return languageOptions.map((langcode: string) => ({
    label: `${getLanguageLabel(langcode)} (${languageMap.get(langcode) || 0})`,
    simpleLabel: langcode,
    value: langcode,
  }));
});

export const areaFilterAtom = atom(
  getAreaInfo.map((item: any) => ({ label: item.label, value: item.key })),
);

export const areaFilterSelectionAtom = atom<OptionType[]>([] as OptionType[]);

export const monitorSubmittedAtom = atom(false);

const getElasticUrl = () => {
  const devUrl = typeof ELASTIC_DEV_URL !== 'undefined' ? ELASTIC_DEV_URL : '';

  return devUrl || drupalSettings?.helfi_react_search?.elastic_proxy_url || '';
};
export const getElasticUrlAtom = atom(getElasticUrl());
