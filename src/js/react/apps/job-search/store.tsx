import { atom } from 'jotai';

import {Option} from 'hds-react';
import type Result from '@/types/Result';
import CustomIds from './enum/CustomTermIds';
import { getLanguageLabel } from './helpers/Language';
import sortOptions from './helpers/Options';
import { AGGREGATIONS, EMPLOYMENT_FILTER_OPTIONS, LANGUAGE_OPTIONS, PROMOTED_IDS, TASK_AREA_OPTIONS } from './query/queries';
import type OptionType from './types/OptionType';
import Global from './enum/Global';
import type Term from './types/Term';
import type URLParams from './types/URLParams';
import AggregationItem from './types/AggregationItem';
import { getAreaInfo } from './helpers/Areas';
import useTimeoutFetch from '@/react/common/hooks/useTimeoutFetch';

// Make maps out of bucket responses
const bucketToMap = (bucket: AggregationItem[]) => {
  const result = new Map();

  bucket.forEach(item => {
    if (item?.unique?.value) {
      result.set(item.key, item.unique.value);
    }
    else {
      result.set(item.key, item.doc_count);
    }
  });

  return result;
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

export const keywordAtom = atom('');

export const setPageAtom = atom(null, (get, set, page: string) => {
  const url = get(urlAtom);
  set(urlUpdateAtom, { ...url, page });
});

export const pageAtom = atom((get) => Number(get(urlAtom)?.page) || 1);

type configurations = {
  error: Error|null,
  taskAreaOptions: any,
  taskAreas: any,
  employment: any,
  employmentOptions: any,
  employmentSearchIds: any,
  employmentType: any,
  languages: any,
  promoted: any
};

export const configurationsAtom = atom(async(): Promise<configurations> => {
  const proxyUrl = drupalSettings?.helfi_react_search?.elastic_proxy_url;
  const { index } = Global;
  const url: string | undefined = proxyUrl;
  const ndjsonHeader = '{}';

  const body =
    `${ndjsonHeader
    }\n${
    JSON.stringify(AGGREGATIONS)
    }\n${
    ndjsonHeader
    }\n${
    JSON.stringify(TASK_AREA_OPTIONS)
    }\n${
    ndjsonHeader
    }\n${
    JSON.stringify(EMPLOYMENT_FILTER_OPTIONS)
    }\n${
    ndjsonHeader
    }\n${
    JSON.stringify(LANGUAGE_OPTIONS)
    }\n${
    ndjsonHeader
    }\n${
    JSON.stringify(PROMOTED_IDS)
    }\n`;

  return useTimeoutFetch(`${url}/${index}/_msearch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-ndjson',
    },
    body,
  })
  .then(res => res.json())
  .then(json => {
    const responses = json?.responses;

    if (!responses || !Array.isArray(responses)) {
      return {
        error: new Error(
          `Initialization failed. Expected responses to be an array of data but got ${typeof responses}`
        ),
        taskAreaOptions: [],
        taskAreas: [],
        employment: [],
        employmentOptions: [],
        employmentSearchIds: [],
        employmentType: [],
        languages: [],
        promoted: [],
      };
    }

    const [aggs, taskAreas, employmentOptions, languages, promoted] = responses;

    return {
      error: null,
      taskAreaOptions: taskAreas?.hits?.hits || [],
      taskAreas: aggs?.aggregations?.occupations?.buckets || [],
      employment: aggs?.aggregations?.employment?.buckets || [],
      employmentOptions: employmentOptions?.hits?.hits || [],
      employmentSearchIds: aggs?.aggregations?.employment_search_id?.buckets || [],
      employmentType: aggs?.aggregations?.employment_type?.buckets || [],
      languages: languages?.aggregations?.languages?.buckets || [],
      promoted: promoted?.aggregations?.promoted?.buckets || [],
    };
  })
  .catch(error => ({
    error,
    taskAreaOptions: [],
    taskAreas: [],
    employment: [],
    employmentOptions: [],
    employmentSearchIds: [],
    employmentType: [],
    languages: [],
    promoted: [],
  }));
});

export const taskAreasAtom = atom(async (get) => {
  const { error, taskAreaOptions, taskAreas } = await get(configurationsAtom);

  if (error) {
    return [];
  }

  const aggs = bucketToMap(taskAreas);

  return taskAreaOptions
    .map((option: Result<Term>) => {
      const count = aggs.get(option._source.field_external_id[0]) || 0;
      const {name} = option._source;

      return {
        count,
        label: `${name} (${count})`,
        simpleLabel: name,
        value: option._source.field_external_id[0],
      };
    })
    .sort((a: OptionType, b: OptionType) => sortOptions(a, b));
});
export const taskAreasSelectionAtom = atom<OptionType[]>([] as OptionType[]);

export const employmentAtom = atom(async(get) => {
  const { error, employment, employmentOptions, employmentType } = await get(configurationsAtom);

  if (error) {
    return [];
  }

  const combinedAggs = bucketToMap(employment.concat(employmentType));

  const visibleOptions = employmentOptions.filter(
    (term: Result<Term>) =>
      term._source?.field_search_id?.[0] &&
      ![CustomIds.PERMANENT_SERVICE, CustomIds.FIXED_SERVICE].includes(term._source.field_search_id[0])
  );

  const options =  visibleOptions
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
          (optionTerm: Result<Term>) => optionTerm._source?.field_search_id?.[0] === CustomIds.PERMANENT_SERVICE
        )?._source.tid[0];
        additionalValue = permanentService;
        count = (combinedAggs.get(tid) || 0) + (combinedAggs.get(permanentService) || 0);
        label = `${Drupal.t('Permanent', {}, {context: 'Employment filter value'})} (${count})`;
        simpleLabel = Drupal.t('Permanent contract and service employment', {}, {context: 'Employment filter selection value'});
      }
      else if (customId.toString() === CustomIds.FIXED_CONTRACTUAL) {
        const fixedService = employmentOptions.find(
          (optionTerm: Result<Term>) => optionTerm._source?.field_search_id?.[0] === CustomIds.FIXED_SERVICE
        )?._source.tid[0];
        additionalValue = fixedService;
        count = (combinedAggs.get(tid) || 0) + (combinedAggs.get(fixedService) || 0);
        label = `${Drupal.t('Fixed-term', {}, { context: 'Employment filter value'})} (${count})`;
        simpleLabel = Drupal.t('Fixed-term contract and service employment', {}, { context: 'Employment filter selection value'});
      }
      else {
        count = combinedAggs.get(tid) || 0;
        label = `${term._source.name} (${count})`;
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
export const employmentSelectionAtom = atom<OptionType[]>([] as OptionType[]);

export const languagesAtom = atom(async(get) => {
  const { error, languages } = await get(configurationsAtom);

  if (error) {
    return [];
  }

  const languageMap = bucketToMap(languages);
  const languageOptions = ['fi', 'sv', 'en'];

  return languageOptions.map((langcode: string) => ({
    label: `${getLanguageLabel(langcode)} (${languageMap.get(langcode) || 0})`,
    simpleLabel: langcode,
    value: langcode,
  }));
});
export const languageSelectionAtom = atom<OptionType[] | Option[] | null>(null);

export const continuousAtom = atom<boolean>(false);
export const internshipAtom = atom<boolean>(false);
export const summerJobsAtom = atom<boolean>(false);
export const youthSummerJobsAtom = atom<boolean>(false);

export const resetFormAtom = atom(null, (get, set) => {
  set(areaFilterSelectionAtom, []);
  set(taskAreasSelectionAtom, []);
  set(keywordAtom, '');
  set(continuousAtom, false);
  set(internshipAtom, false);
  set(summerJobsAtom, false);
  set(youthSummerJobsAtom, false);
  set(employmentSelectionAtom, []);
  set(urlUpdateAtom, {});
  set(languageSelectionAtom, null);
});

export const areaFilterAtom = atom(
  getAreaInfo.map((item: any) => (
    {
      label: item.label,
      value: item.key,
    }
  )
));

export const areaFilterSelectionAtom = atom<OptionType[]>([] as OptionType[]);

export const monitorSubmittedAtom = atom(false);
