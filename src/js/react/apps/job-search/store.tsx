/** biome-ignore-all lint/suspicious/noExplicitAny: @todo UHF-12501 */
import { atom } from 'jotai';

declare const ELASTIC_DEV_URL: string | undefined;
import type Result from '@/types/Result';
import CustomIds from './enum/CustomTermIds';
import { getAreaInfo } from './helpers/Areas';
import { getLanguageLabel } from './helpers/Language';
import { sortOptions } from './helpers/Options';
import type AggregationItem from './types/AggregationItem';
import type OptionType from './types/OptionType';
import type Term from './types/Term';
import SearchComponents from './enum/SearchComponents';
import { stateToURLParams } from '@/react/common/helpers/StateToURLParams';
import Global from './enum/Global';

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
  SearchComponents.LANGUAGE,
];

const booleanParams = [
  SearchComponents.CONTINUOUS,
  SearchComponents.INTERNSHIPS,
  SearchComponents.SUMMER_JOBS,
  SearchComponents.YOUTH_SUMMER_JOBS,
];

const getParams = () => {
  const searchParams = new URLSearchParams(window.location.search);
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
      parsedValue = value.toString().includes(',') ? value.toString().split(',') : [value];
    } else {
      parsedValue = value;
    }
    const existing = params[key];

    if (Array.isArray(parsedValue)) {
      const existingValues = Array.isArray(existing) ? existing : (existing ?? []);
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

const { sortOptions: selectableSortOptions } = Global;
const defaultSearchState = {
  [SearchComponents.AREA_FILTER]: [] as OptionType[],
  [SearchComponents.CONTINUOUS]: false,
  [SearchComponents.EMPLOYMENT_RELATIONSHIP]: [] as OptionType[],
  [SearchComponents.EMPLOYMENT]: [] as OptionType[],
  [SearchComponents.INTERNSHIPS]: false,
  [SearchComponents.KEYWORD]: '',
  [SearchComponents.LANGUAGE]: [] as OptionType[],
  [SearchComponents.PAGE]: '1',
  [SearchComponents.SUMMER_JOBS]: false,
  [SearchComponents.TASK_AREAS]: [] as OptionType[],
  [SearchComponents.YOUTH_SUMMER_JOBS]: false,
  [SearchComponents.ORDER]: selectableSortOptions.newestFirst,
};

export type SearchStateType = typeof defaultSearchState;

export const searchStateAtom = atom<typeof defaultSearchState>(defaultSearchState);
export const submittedStateAtom = atom<typeof defaultSearchState>(defaultSearchState);

export const submitStateAtom = atom(null, (get, set, directState: Partial<SearchStateType> | null = null) => {
  const searchState = get(searchStateAtom);
  const submittedState = get(submittedStateAtom);
  const stateToUse = directState ? ({ ...submittedState, ...directState } as SearchStateType) : searchState;
  const newState: SearchStateType = { ...stateToUse };

  if (directState?.[SearchComponents.PAGE] !== undefined) {
    newState[SearchComponents.PAGE] = directState[SearchComponents.PAGE] as string;
  } else {
    newState[SearchComponents.PAGE] = '1';
  }

  if (JSON.stringify(newState) !== JSON.stringify(submittedState)) {
    set(submittedStateAtom, newState);
    const params = stateToURLParams(newState);
    const url = new URL(window.location.href);
    url.search = params.toString();
    window.history.pushState({}, '', url);
  }
});

export const setStateValueAtom = atom(
  null,
  (get, set, payload: { key: keyof typeof defaultSearchState; value: string | OptionType[] | boolean }) => {
    const searchState = get(searchStateAtom) || defaultSearchState;
    const newState = { ...searchState, [payload.key]: payload.value };

    set(searchStateAtom, newState);
  },
);

export const getKeywordAtom = atom((get) => {
  const searchState = get(searchStateAtom);
  return searchState ? (searchState[SearchComponents.KEYWORD] as string) : '';
});

export const getTaskAreasAtom = atom((get) => {
  const searchState = get(searchStateAtom);
  return searchState ? (searchState[SearchComponents.TASK_AREAS] as OptionType[]) : [];
});

export const getEmploymentAtom = atom((get) => {
  const searchState = get(searchStateAtom);
  return searchState ? (searchState[SearchComponents.EMPLOYMENT] as OptionType[]) : [];
});

export const getLanguageAtom = atom((get) => {
  const searchState = get(searchStateAtom);
  return searchState[SearchComponents.LANGUAGE];
});

export const getAreaAtom = atom((get) => {
  const searchState = get(searchStateAtom);
  return searchState ? (searchState[SearchComponents.AREA_FILTER] as OptionType[]) : [];
});

export const getCheckBoxValuesAtom = atom((get) => {
  const searchState = get(searchStateAtom);
  return [
    searchState ? (searchState[SearchComponents.CONTINUOUS] as boolean) : false,
    searchState ? (searchState[SearchComponents.INTERNSHIPS] as boolean) : false,
    searchState ? (searchState[SearchComponents.SUMMER_JOBS] as boolean) : false,
    searchState ? (searchState[SearchComponents.YOUTH_SUMMER_JOBS] as boolean) : false,
  ];
});

export const getPageAtom = atom((get) => {
  const submittedState = get(submittedStateAtom);

  return submittedState ? Number(submittedState[SearchComponents.PAGE]) : 1;
});

export const setPageAtom = atom(null, (get, set, page: string) => {
  const intermediateState = get(searchStateAtom) || defaultSearchState;
  const newSearchState = { ...intermediateState, [SearchComponents.PAGE]: page };
  set(searchStateAtom, newSearchState);

  set(submitStateAtom, { [SearchComponents.PAGE]: page });
});

export const setSortAtom = atom(null, (get, set, sort: string) => {
  const intermediateState = get(searchStateAtom) || defaultSearchState;
  const newSearchState = { ...intermediateState, sort };
  set(searchStateAtom, newSearchState);

  set(submitStateAtom, {
    [SearchComponents.PAGE]: '1',
    [SearchComponents.ORDER]: sort,
  });
});

export const resetFormAtom = atom(null, (_get, set) => {
  set(searchStateAtom, defaultSearchState);
  set(submitStateAtom, defaultSearchState);
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

const transformTaskAreas = (taskAreas, taskAreaOptions) => {
  const aggs = bucketToMap(taskAreas);

  return taskAreaOptions
    .map((option: Result<Term>) => {
      const count = aggs.get(option._source.field_external_id[0]) || 0;
      const { name } = option._source;

      return { count, label: `${name} (${count})`, simpleLabel: name, value: option._source.field_external_id[0] };
    })
    .sort((a: OptionType, b: OptionType) => sortOptions(a, b));
};

const transformEmployment = (employment, employmentOptions, employmentType) => {
  const combinedAggs = bucketToMap(employment.concat(employmentType));

  const visibleOptions = employmentOptions.filter(
    (term: Result<Term>) =>
      term._source?.field_search_id?.[0] &&
      ![CustomIds.PERMANENT_SERVICE, CustomIds.FIXED_SERVICE].includes(term._source.field_search_id[0]),
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
          (optionTerm: Result<Term>) => optionTerm._source?.field_search_id?.[0] === CustomIds.PERMANENT_SERVICE,
        )?._source.tid[0];
        additionalValue = permanentService;
        count = (combinedAggs.get(tid) || 0) + (combinedAggs.get(permanentService) || 0);
        label = `${Drupal.t('Permanent', {}, { context: 'Employment filter value' })} (${count})`;
        simpleLabel = Drupal.t(
          'Permanent contract and service employment',
          {},
          { context: 'Employment filter selection value' },
        );
      } else if (customId.toString() === CustomIds.FIXED_CONTRACTUAL) {
        const fixedService = employmentOptions.find(
          (optionTerm: Result<Term>) => optionTerm._source?.field_search_id?.[0] === CustomIds.FIXED_SERVICE,
        )?._source.tid[0];
        additionalValue = fixedService;
        count = (combinedAggs.get(tid) || 0) + (combinedAggs.get(fixedService) || 0);
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

      return { count, label, simpleLabel, value: additionalValue ? [tid, additionalValue] : tid };
    })
    .sort((a: OptionType, b: OptionType) => sortOptions(a, b));
  return options;
};

const transformLanguages = (languages) => {
  const languageMap = bucketToMap(languages);
  const languageOptions = ['fi', 'sv', 'en'];

  return languageOptions.map((langcode: string) => ({
    label: `${getLanguageLabel(langcode)} (${languageMap.get(langcode) || 0})`,
    simpleLabel: langcode,
    value: langcode,
  }));
};

export const areaFilterAtom = atom<OptionType[]>([]);
export const employmentAtom = atom<OptionType[]>([]);
export const languagesAtom = atom<OptionType[]>([]);
export const taskAreasAtom = atom<OptionType[]>([]);

export const initializeSearchAtom = atom(null, (get, set, config: configurations) => {
  const initialState: SearchStateType = { ...defaultSearchState };
  const configurations = get(configurationsAtom);

  if (configurations) {
    return;
  }

  const taskAreas = transformTaskAreas(config.taskAreas, config.taskAreaOptions);
  set(taskAreasAtom, taskAreas);
  const employment = transformEmployment(config.employment, config.employmentOptions, config.employmentType);
  set(employmentAtom, employment);
  const languages = transformLanguages(config.languages);
  set(languagesAtom, languages);
  const areas = getAreaInfo.map((item: any) => ({ label: item.label, value: item.key }));
  set(areaFilterAtom, areas);

  const keysMap = new Map(
    Object.entries({
      [SearchComponents.AREA_FILTER]: areas,
      [SearchComponents.EMPLOYMENT]: employment,
      [SearchComponents.LANGUAGE]: languages,
      [SearchComponents.TASK_AREAS]: taskAreas,
    }),
  );
  const initialParams = getParams();

  const handleArrayParam = (key: string, value: string[]) => {
    const values = new Set<OptionType>();

    if (!keysMap.has(key)) {
      return values;
    }

    value.forEach((val: string) => {
      const options = keysMap.get(key) as OptionType[];
      const matchedOption = options.find((option: OptionType) =>
        Array.isArray(option.value)
          ? option.value.map((optionValue) => optionValue.toString()).includes(val)
          : option.value.toString() === val,
      );

      if (matchedOption) {
        values.add(matchedOption);
      }
    });

    initialState[key as keyof SearchStateType] = Array.from(values);
  };

  Object.keys(initialState).forEach((key) => {
    if (initialParams[key] && Array.isArray(initialParams[key])) {
      handleArrayParam(key, initialParams[key]);
      return;
    } else if (initialParams[key]) {
      if (booleanParams.includes(key)) {
        initialState[key as keyof SearchStateType] = initialParams[key] === 'true';
      } else {
        initialState[key as keyof SearchStateType] = initialParams[key];
      }
    }
  });
  set(searchStateAtom, initialState);
  set(submittedStateAtom, initialState);
  set(configurationsAtom, config);
});

export const getEmploymentSearchIdMap = atom((get) => {
  const configurations = get(configurationsAtom);

  if (!configurations?.employmentSearchIds) {
    return new Map();
  }

  const { employmentSearchIds } = configurations;
  return bucketToMap(employmentSearchIds);
});

export const monitorSubmittedAtom = atom(false);

const getElasticUrl = () => {
  const devUrl = typeof ELASTIC_DEV_URL !== 'undefined' ? ELASTIC_DEV_URL : '';

  return devUrl || drupalSettings?.helfi_react_search?.elastic_proxy_url || '';
};
export const getElasticUrlAtom = atom(getElasticUrl());
