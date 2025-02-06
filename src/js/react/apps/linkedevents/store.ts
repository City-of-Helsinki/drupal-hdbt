import { atom } from 'jotai';
import { DateTime } from 'luxon';

import ROOT_ID from './enum/RootId';
import FilterSettings from './types/FilterSettings';
import Location from './types/Location';
import OptionType from './types/OptionType';
import FormErrors from './types/FormErrors';
import ApiKeys from './enum/ApiKeys';
import Topic from './types/Topic';
import useAddressToCoordsQuery from '@/react/common/hooks/useAddressToCoordsQuery';

interface Options {
  [key: string]: string
}

// Transform locations from API response to options
const transformLocations = (locations: any = null) => {
  if (!locations) {
    return [];
  }

  const { currentLanguage } = drupalSettings.path;
  const locationOptions: Location[] = [];

  const keys = Object.keys(locations);
  keys.forEach((id: string) => {
    const location = locations[id];
    if (location.id && location.name && location.name[currentLanguage]) {
      locationOptions.push({
        value: location.id,
        label: location.name[currentLanguage]
      });
    }
  });

  return locationOptions;
};

const createBaseAtom = () => {
  const rootElement: HTMLElement | null = document.getElementById(ROOT_ID);
  const paragraphId = rootElement?.dataset?.paragraphId;

  if (!rootElement || !paragraphId) {
    console.warn('Paragraph id not found in source HTML');
    return;
  }

  const settings = drupalSettings.helfi_events?.data?.[paragraphId];
  const useFixtures = settings?.use_fixtures;
  const eventsApiUrl = settings?.events_api_url;
  const eventListTitle = settings?.field_event_list_title;
  const eventsPublicUrl = settings?.events_public_url || 'https://tapahtumat.hel.fi';

  const filterSettings: FilterSettings = {
    eventCount: Number(settings?.field_event_count),
    showFreeFilter: settings?.field_free_events,
    showLocation: settings?.field_event_location,
    showRemoteFilter: settings?.field_remote_events,
    showTimeFilter: settings?.field_event_time,
    showTopicsFilter: settings?.field_filter_keywords?.length > 0,
    useFullLocationFilter: settings?.useFullLocationFilter,
    useFullTopicsFilter: settings?.useFullTopicsFilter,
    useLocationSearch: settings?.useLocationSearch,
  };
  const locations = transformLocations(settings?.places);
  const topics: Topic[] = settings?.field_filter_keywords?.map(topic => ({
    value: topic.id,
    label: topic.name.charAt(0).toUpperCase() + topic.name.slice(1),
  }));

  let baseUrl;
  let initialParams;

  if (eventsApiUrl.indexOf('?') !== -1) {
    const [url, queryString] = eventsApiUrl.split('?');
    baseUrl = url;
    initialParams = new URLSearchParams(queryString);
  } else {
    baseUrl = eventsApiUrl;
    initialParams = new URLSearchParams();
  }

  if (filterSettings.eventCount) {
    initialParams.set('page_size', filterSettings.eventCount.toString());
  };

  return {
    settings: filterSettings,
    baseUrl,
    initialUrl: eventsApiUrl,
    initialParams,
    locations,
    topics,
    eventListTitle,
    eventsPublicUrl,
    useFixtures,
  };
};

// Store all needed data to 'master' atom
const baseAtom = atom(createBaseAtom());

// Create derivates for set/get parts of data
export const baseUrlAtom = atom(
  (get) => get(baseAtom)?.baseUrl
);

export const initialUrlAtom = atom(
  (get) => {
    const baseUrl = get(baseAtom)?.initialUrl;
    const initialParams = get(initialParamsAtom);

    return `${baseUrl}?${initialParams.toString()}`;
  }
);

export const initialParamsAtom = atom(
  (get) => get(baseAtom)?.initialParams || new URLSearchParams()
);

export const locationAtom = atom(
  (get) => get(baseAtom)?.locations
);

export const topicsAtom = atom(
  (get) => get(baseAtom)?.topics
);

export const titleAtom = atom(
  (get) => get(baseAtom)?.eventListTitle
);

export const eventsPublicUrl = atom(
  (get) => get(baseAtom)?.eventsPublicUrl
);

export const settingsAtom = atom(
  (get) => get(baseAtom)?.settings || {
    eventCount: 3,
    showFreeFilter: false,
    showLocation: false,
    showRemoteFilter: false,
    showTimeFilter: false,
    showTopicsFilter: false,
    topics: [],
    useFullLocationFilter: false,
    useFullTopicsFilter: false,
    useLocationSearch: false,
  }
);

export const useFixturesAtom = atom<object|false>(
  (get) => get(baseAtom)?.useFixtures
);

export const pageAtom = atom<number>(1);

export const urlAtom = atom<string|undefined>(undefined);

export const paramsAtom = atom(new URLSearchParams());

export const locationSelectionAtom = atom<OptionType[]>([] as OptionType[]);

export const topicSelectionAtom = atom<Topic[]>([]);

export const startDateAtom = atom<DateTime|undefined>(undefined);

export const endDateAtom = atom<DateTime|undefined>(undefined);

export const endDisabledAtom = atom<boolean>(false);

export const formErrorsAtom = atom<FormErrors>({
  invalidEndDate: false,
  invalidStartDate: false,
});

export const freeFilterAtom = atom<boolean>(false);

export const remoteFilterAtom = atom<boolean>(false);

export const resetFormAtom = atom(null, (get, set) => {
  set(locationSelectionAtom, []);
  set(topicSelectionAtom, []);
  set(startDateAtom, undefined);
  set(endDateAtom, undefined);
  set(endDisabledAtom, false);
  set(remoteFilterAtom, false);
  set(freeFilterAtom, false);
  set(pageAtom, 1);

  const newParams = new URLSearchParams(get(initialParamsAtom).toString());
  const currentParams = new URLSearchParams(new URL(get(urlAtom) || '').search);

  [ApiKeys.COORDINATES, ApiKeys.RADIUS].forEach((key) => {
    const param = currentParams.get(key);
    if (param) {
      newParams.set(key, param);
    }
  });

  const initialUrl = new URL(get(initialUrlAtom));
  initialUrl.search = newParams.toString();
  set(urlAtom, initialUrl.toString());

  const clearEvent = new Event('eventsearch-clear');
  window.dispatchEvent(clearEvent);
});

export const updateUrlAtom = atom(null, async(get, set) => {
  set(pageAtom, 1);
  const params = new URLSearchParams(get(paramsAtom));
  const address = get(addressAtom);
  const coordinates = await useAddressToCoordsQuery(address);

  if (coordinates && coordinates?.length) {
    params.set(ApiKeys.COORDINATES, coordinates.join(','));
    params.set(ApiKeys.RADIUS, '2000');
  }

  const baseUrl = get(baseUrlAtom);
  set(urlAtom, `${baseUrl}?${params.toString()}`);
});

export const updatePageParamAtom = atom(null, (get, set, page: number) => {
  const url = get(urlAtom) || get(initialUrlAtom);

  if (url) {
    const currentUrl = new URL(url);
    currentUrl.searchParams.set('page', page.toString());
    set(urlAtom, currentUrl.toString());
  }
});

export const resetParamAtom = atom(null, (get, set, option: string) => {
  const initialParams = get(initialParamsAtom);
  const params = get(paramsAtom);
  const skipParams = [
    ApiKeys.COORDINATES,
    ApiKeys.RADIUS,
  ];

  if (
    Object.values(ApiKeys).indexOf(option) !== -1 &&
    skipParams.indexOf(option) === -1
  ) {
    const initial = initialParams.get(option);
    initial ? params.set(option, initial) : params.delete(option);
    set(paramsAtom, params);
  }
});

export const updateParamsAtom = atom(null, (get, set, options: Options) => {
  const params = get(paramsAtom);
  Object.keys(options).forEach((option: string) => {
    if (Object.values(ApiKeys).indexOf(option) !== -1) {
      params.set(option, options[option]);
    }
  });
  set(paramsAtom, params);
});

// Strore address input. Converted to coordinates during form submit.
export const addressAtom = atom<string|undefined|null>(undefined);
