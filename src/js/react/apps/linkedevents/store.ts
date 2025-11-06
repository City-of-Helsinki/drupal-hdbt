/** biome-ignore-all lint/suspicious/noImplicitAnyLet: @todo UHF-12066 */
import { atom } from 'jotai';
import { loadable } from 'jotai/utils';
import type { DateTime } from 'luxon';
import useAddressToCoordsQuery from '@/react/common/hooks/useAddressToCoordsQuery';
import ApiKeys from './enum/ApiKeys';
import ROOT_ID from './enum/RootId';
import { BloatingTargetGroups } from './enum/TargetGroups';
import type { EventTypeOption } from './types/EventTypeOption';
import type FilterSettings from './types/FilterSettings';
import type FormErrors from './types/FormErrors';
import type OptionType from './types/OptionType';
import type Topic from './types/Topic';

const queryStringParams = new URLSearchParams(window.location.search);

interface Options {
  [key: string]: string;
}

// Transform locations from API response to options
// biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12066
const transformLocations = (locations: any = null) => {
  if (!locations) {
    return [];
  }

  const { currentLanguage } = drupalSettings.path;
  const locationOptions: OptionType[] = [];

  const keys = Object.keys(locations);
  keys.forEach((id: string) => {
    const location = locations[id];
    if (location.id && location.name && location.name[currentLanguage]) {
      locationOptions.push({
        value: location.id,
        label: location.name[currentLanguage],
      });
    }
  });

  return locationOptions;
};

export const hobbiesPublicUrl = 'https://harrastukset.hel.fi';

const getInitialSettings = () => {
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
  const eventsPublicUrl =
    settings?.events_public_url || 'https://tapahtumat.hel.fi';

  const filterSettings: FilterSettings = {
    eventCount: Number(settings?.field_event_count),
    eventListType: settings?.event_list_type,
    showFreeFilter: settings?.field_free_events,
    hideHeading: settings?.hideHeading,
    showLanguageFilter: settings?.field_language,
    showLocation: settings?.field_event_location,
    showRemoteFilter: settings?.field_remote_events,
    showTimeFilter: settings?.field_event_time,
    showTopicsFilter: settings?.field_filter_keywords?.length > 0,
    hidePagination: settings?.hidePagination,
    removeBloatingEvents: settings?.removeBloatingEvents,
    useFullLocationFilter: settings?.useFullLocationFilter,
    useFullTopicsFilter: settings?.useFullTopicsFilter,
    useLocationSearch: settings?.useLocationSearch,
    useTargetGroupFilter: settings?.useTargetGroupFilter,
  };
  const locations = transformLocations(settings?.places);
  const topics: Topic[] = settings?.field_filter_keywords?.map((topic) => ({
    value: topic.id,
    label: topic.name.charAt(0).toUpperCase() + topic.name.slice(1),
  }));

  let baseUrl;
  let initialParams;

  const hasQuery = eventsApiUrl.indexOf('?') !== -1;
  if (hasQuery) {
    const [url, queryString] = eventsApiUrl.split('?');
    baseUrl = url;
    initialParams = new URLSearchParams(queryString);
  } else {
    baseUrl = eventsApiUrl;
  }

  if (initialParams && filterSettings.eventCount) {
    initialParams.set('page_size', filterSettings.eventCount.toString());
  }

  if (initialParams && filterSettings.showLanguageFilter) {
    initialParams.delete('language');
  }

  if (initialParams && filterSettings.removeBloatingEvents) {
    initialParams.set('keyword!', BloatingTargetGroups.join(','));
  }

  return {
    baseUrl,
    eventListTitle,
    eventsPublicUrl,
    initialParams,
    initialUrl: eventsApiUrl,
    locations,
    settings: filterSettings,
    topics,
    useFixtures,
  };
};
const initialSettings = getInitialSettings();
if (!initialSettings) {
  throw new Error('Failed to initialize settings');
}
// Store all needed data to 'master' atom
const baseAtom = atom(initialSettings);

// Create derivates for set/get parts of data
export const baseUrlAtom = atom((get) => get(baseAtom)?.baseUrl);

export const initialUrlAtom = atom((get) => {
  const baseUrl = get(baseAtom)?.baseUrl;
  const initialParams = new URLSearchParams(get(initialParamsAtom));

  return `${baseUrl}?${initialParams.toString()}`;
});

export const initialParamsAtom = atom(
  (get) => get(baseAtom)?.initialParams || new URLSearchParams(),
);

export const locationAtom = atom((get) => get(baseAtom)?.locations || []);

export const topicsAtom = atom((get) => get(baseAtom)?.topics || []);

export const titleAtom = atom((get) => get(baseAtom)?.eventListTitle);

export const eventsPublicUrl = atom((get) => get(baseAtom)?.eventsPublicUrl);

export const settingsAtom = atom(
  (get) =>
    get(baseAtom)?.settings || {
      eventCount: 3,
      eventListType: 'events',
      showFreeFilter: false,
      hideHeading: true,
      showLanguageFilter: false,
      showLocation: false,
      showRemoteFilter: false,
      showTimeFilter: false,
      showTopicsFilter: false,
      hidePagination: false,
      topics: [],
      removeBloatingEvents: false,
      useFullLocationFilter: false,
      useFullTopicsFilter: false,
      useLocationSearch: false,
      useTargetGroupFilter: false,
    },
);

export const useFixturesAtom = atom<object | false>(
  (get) => get(baseAtom)?.useFixtures,
);

export const pageAtom = atom<number>(1);

export const locationSelectionAtom = atom<OptionType[]>([] as OptionType[]);

export const topicSelectionAtom = atom<Topic[]>([]);

export const startDateAtom = atom<DateTime | undefined>(undefined);
export const endDateAtom = atom<DateTime | undefined>(undefined);
export const endDisabledAtom = atom<boolean>(false);

const getIsoTime = (date: DateTime, key: string) => {
  if (!date) {
    return undefined;
  }
  return key === 'start'
    ? date.startOf('day').toISO()
    : date.endOf('day').toISO();
};

const getDateParams = (dates: { start?: DateTime; end?: DateTime }) => {
  const dateParams: { start?: string; end?: string } = {};

  (['end', 'start'] as const).forEach((key) => {
    if (dates[key]) {
      // biome-ignore lint/style/noNonNullAssertion: @todo UHF-12066
      dateParams[key] = getIsoTime(dates[key]!, key);
    } else {
      dateParams[key] = undefined;
    }
  });

  return dateParams;
};

export const setEndDisabledAtom = atom(null, (get, set, disabled: boolean) => {
  const start = get(startDateAtom);
  const end = get(endDateAtom);

  const dates: { start?: DateTime; end?: DateTime } = {
    start,
  };

  if (disabled) {
    dates.end = start;
  } else {
    dates.end = end;
  }

  const dateParams = getDateParams(dates);
  set(updateParamsAtom, dateParams);
  set(endDisabledAtom, disabled);
});

export const updateDateAtom = atom(
  null,
  (get, set, date: DateTime | undefined, key: string) => {
    const endDisabled = get(endDisabledAtom);
    const dateAtom = key === 'start' ? startDateAtom : endDateAtom;
    const dates = {
      [key]: date,
    };

    if (key === 'start' && endDisabled) {
      dates.end = date;
    }

    const dateParams = getDateParams(dates);

    set(dateAtom, date);
    set(updateParamsAtom, dateParams);
  },
);

export const formErrorsAtom = atom<FormErrors>({
  invalidEndDate: false,
  invalidStartDate: false,
});

export const freeFilterAtom = atom<boolean>(false);
export const remoteFilterAtom = atom<boolean>(false);

export const resetFormAtom = atom(null, (get, set) => {
  set(locationSelectionAtom, []);
  set(topicSelectionAtom, []);
  set(languageAtom, []);
  set(startDateAtom, undefined);
  set(endDateAtom, undefined);
  set(remoteFilterAtom, false);
  set(freeFilterAtom, false);
  set(targetGroupsAtom, []);
  set(eventTypeAtom, []);
  set(pageAtom, 1);

  const newParams = new URLSearchParams(get(initialParamsAtom));
  const currentParams = new URLSearchParams(get(submittedParamsAtom));

  [ApiKeys.COORDINATES, ApiKeys.RADIUS].forEach((key) => {
    const param = currentParams.get(key);
    if (param) {
      newParams.set(key, param);
    }
  });

  set(paramsAtom, newParams);
  set(submittedParamsAtom, newParams);

  const clearEvent = new Event('eventsearch-clear');
  window.dispatchEvent(clearEvent);
});

export const submittedParamsAtom = atom<URLSearchParams>(
  new URLSearchParams(initialSettings.initialParams),
);

export const updateUrlAtom = atom(null, async (get, set) => {
  const address = get(addressAtom);
  const stagedParams = new URLSearchParams(get(paramsAtom));

  const coordinates = await useAddressToCoordsQuery(address);
  if (coordinates?.length) {
    stagedParams.set(ApiKeys.COORDINATES, coordinates.slice(0, 2).join(','));
    stagedParams.set(ApiKeys.RADIUS, '2000');

    const [, , addressName] = coordinates;
    set(addressAtom, addressName);
  }

  set(pageAtom, 1);
  set(submittedParamsAtom, stagedParams);
});

export const urlAtom = atom(async (get) => {
  const submittedParams = get(submittedParamsAtom);
  const baseUrl = get(baseUrlAtom);

  return `${baseUrl}?${submittedParams.toString()}`;
});

export const loadableUrlAtom = loadable(urlAtom);

export const paramsAtom = atom(
  new URLSearchParams(initialSettings.initialParams),
);

export const updatePageParamAtom = atom(null, (get, set, page: number) => {
  const submittedParams = new URLSearchParams(get(submittedParamsAtom));

  submittedParams.set('page', page.toString());
  set(submittedParamsAtom, submittedParams);
});

export const resetParamAtom = atom(null, (get, set, option: string) => {
  const initialParams = new URLSearchParams(get(initialParamsAtom));
  const params = new URLSearchParams(get(paramsAtom));
  const skipParams = [ApiKeys.COORDINATES, ApiKeys.RADIUS];

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
  const params = new URLSearchParams(get(paramsAtom));
  Object.keys(options).forEach((option: string) => {
    if (Object.values(ApiKeys).indexOf(option) !== -1) {
      options[option] === undefined
        ? params.delete(option)
        : params.set(option, options[option]);
    }
  });
  set(paramsAtom, params);
});

// Strore address input. Converted to coordinates during form submit.
export const addressAtom = atom<string | undefined | null>(
  queryStringParams.get('address'),
);

export const languageAtom = atom<OptionType[]>([]);

export const eventTypeAtom = atom<EventTypeOption[]>([]);

export const targetGroupsAtom = atom<OptionType[]>([]);

export const initializedAtom = atom<boolean>(false);
