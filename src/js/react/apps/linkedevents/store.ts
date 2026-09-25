/** biome-ignore-all lint/suspicious/noImplicitAnyLet: @todo UHF-12501 */
// Nothing here may read `window`, `document` or `drupalSettings` at module scope: a page can hold
// several embeds, each with its own store, so every initial value has to come from `configAtom`.
import { atom, createStore } from 'jotai';
import { atomWithDefault, unwrap } from 'jotai/utils';
import { endOfDay, startOfDay, toLocalISO } from '@/react/common/helpers/dateUtils';
import { getAddressCoordinates } from '@/react/common/helpers/ServiceMap';
import ApiKeys from './enum/ApiKeys';
import { HOME_ADDRESS_PARAM } from './enum/QueryParams';
import type { EventsAppConfig } from './helpers/ReadEventListConfig';
import type { EventTypeOption } from './types/EventTypeOption';
import type FormErrors from './types/FormErrors';
import type OptionType from './types/OptionType';
import type Topic from './types/Topic';

interface Options {
  [key: string]: string | undefined;
}

export const configAtom = atom<EventsAppConfig | null>(null);

export const createEventsStore = (config: EventsAppConfig) => {
  const store = createStore();
  store.set(configAtom, config);

  return store;
};

export const instanceIdAtom = atom((get) => get(configAtom)?.instanceId ?? '');

export const initialQueryAtom = atom((get) => get(configAtom)?.initialQuery ?? new URLSearchParams());

// The query string, and page-wide elements such as the Helsinki near you breadcrumb, need a
// single owner when a page holds several embeds.
export const ownsPageUrlAtom = atom((get) => get(configAtom)?.ownsPageUrl ?? false);

declare const LINKED_EVENTS_DEV_URL: string | undefined;

// Create derivates for set/get parts of data
export const baseUrlAtom = atom((get) => {
  const devUrl = typeof LINKED_EVENTS_DEV_URL !== 'undefined' ? LINKED_EVENTS_DEV_URL : null;

  return devUrl || get(configAtom)?.baseUrl;
});

export const initialUrlAtom = atom((get) => {
  const baseUrl = get(baseUrlAtom);
  const initialParams = new URLSearchParams(get(initialParamsAtom));

  return `${baseUrl}?${initialParams.toString()}`;
});

export const loadableInitialUrlAtom = unwrap(initialUrlAtom);

export const initialParamsAtom = atom((get) => get(configAtom)?.initialParams || new URLSearchParams());

export const locationAtom = atom((get) => get(configAtom)?.locations || []);

export const topicsAtom = atom((get) => get(configAtom)?.topics || []);

export const titleAtom = atom((get) => get(configAtom)?.eventListTitle);

export const eventsPublicUrl = atom((get) => get(configAtom)?.eventsPublicUrl);

export const hobbiesPublicUrl = atom((get) => get(configAtom)?.hobbiesPublicUrl);

export const settingsAtom = atom(
  (get) =>
    get(configAtom)?.settings || {
      eventCount: 5,
      eventListType: 'events',
      layout: 'default',
      hideHeading: true,
      hidePagination: false,
      removeBloatingEvents: false,
      showFreeFilter: false,
      showLanguageFilter: false,
      showLocation: false,
      showRemoteFilter: false,
      showTimeFilter: false,
      showTopicsFilter: false,
      topics: [],
      useCrossInstitutionalStudiesForm: false,
      useFullLocationFilter: false,
      useFullTopicsFilter: false,
      useLocationSearch: false,
      useSearchBar: false,
      useTargetGroupFilter: false,
    },
);

export const useFixturesAtom = atom((get) => get(configAtom)?.useFixtures ?? false);

export const pageAtom = atom<number>(1);
export const locationSelectionAtom = atom<OptionType[]>([] as OptionType[]);
export const topicSelectionAtom = atom<Topic[]>([]);
export const searchKeywordAtom = atom<string>('');

export const startDateAtom = atom<Date | undefined>(undefined);
export const endDateAtom = atom<Date | undefined>(undefined);
export const endDisabledAtom = atom<boolean>(false);

const getIsoTime = (date: Date, key: string) => {
  if (!date) {
    return undefined;
  }
  return key === 'start' ? toLocalISO(startOfDay(date)) : toLocalISO(endOfDay(date));
};

const getDateParams = (dates: { start?: Date; end?: Date }) => {
  const dateParams: { start?: string; end?: string } = {};

  (['end', 'start'] as const).forEach((key) => {
    if (dates[key]) {
      dateParams[key] = getIsoTime(dates[key], key);
    } else {
      dateParams[key] = undefined;
    }
  });

  return dateParams;
};

export const setEndDisabledAtom = atom(null, (get, set, disabled: boolean) => {
  const start = get(startDateAtom);
  const end = get(endDateAtom);

  const dates: { start?: Date; end?: Date } = { start };

  if (disabled) {
    dates.end = start;
  } else {
    dates.end = end;
  }

  const dateParams = getDateParams(dates);
  set(updateParamsAtom, dateParams);
  set(endDisabledAtom, disabled);
});

export const updateDateAtom = atom(null, (get, set, date: Date | undefined, key: string) => {
  const endDisabled = get(endDisabledAtom);
  const dateAtom = key === 'start' ? startDateAtom : endDateAtom;
  const dates: { start?: Date; end?: Date } = {
    start: key === 'start' ? date : get(startDateAtom),
    end: key === 'end' ? date : get(endDateAtom),
  };

  if (key === 'start' && endDisabled) {
    dates.end = date;
  }

  const dateParams = getDateParams(dates);

  set(dateAtom, date);
  set(updateParamsAtom, dateParams);
});

export const updateDatesAtom = atom(null, (_get, set, dates: { start?: Date; end?: Date }) => {
  const dateParams = getDateParams(dates);

  set(startDateAtom, dates.start);
  set(endDateAtom, dates.end);
  set(updateParamsAtom, dateParams);
});

export const formErrorsAtom = atom<FormErrors>({
  invalidEndDate: false,
  invalidStartDate: false,
  invalidAddress: false,
});

export const freeFilterAtom = atom<boolean>(false);
export const remoteFilterAtom = atom<boolean>(false);
export const addressInitializationRunAtom = atom<boolean>(false);

// Selections held in HDS storage are not jotai state, so resetting the form has to signal the
// filter components.
export const clearSignalAtom = atom<number>(0);
export const clearFilterSignalAtom = atom<{ key: string } | null>(null);

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
  set(searchKeywordAtom, '');
  set(formErrorsAtom, { invalidEndDate: false, invalidStartDate: false, invalidAddress: false });

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

  set(clearSignalAtom, (count) => count + 1);
});

export const submittedParamsAtom = atomWithDefault<URLSearchParams>(
  (get) => new URLSearchParams(get(initialParamsAtom)),
);

export const updateUrlAtom = atom(null, async (get, set, visibleParams: string[] | null = null) => {
  const address = get(addressAtom);
  const stagedParams = new URLSearchParams(get(paramsAtom));
  const currentErrors = get(formErrorsAtom);
  const addressInitializationRun = get(addressInitializationRunAtom);

  const ownsPageUrl = get(ownsPageUrlAtom);

  const removeHomeAddressParam = () => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete(HOME_ADDRESS_PARAM);
    window.history.pushState({}, '', currentUrl.toString());
  };

  // If user does an empty search, clear out url params
  if (addressInitializationRun) {
    const urlAddress = get(initialQueryAtom).get(HOME_ADDRESS_PARAM);
    if (urlAddress && address?.trim() === '') {
      removeHomeAddressParam();
      set(addressInitializationRunAtom, false);
    }
  }

  const coordinates = await getAddressCoordinates(address);
  if (coordinates?.length) {
    stagedParams.set(ApiKeys.COORDINATES, coordinates.slice(0, 2).join(','));
    stagedParams.set(ApiKeys.RADIUS, '2000');

    const [, , addressName] = coordinates;
    set(addressAtom, addressName);

    // If user searched a different address than the one from URL params, clean up the URL
    if (addressInitializationRun) {
      const urlAddress = get(initialQueryAtom).get(HOME_ADDRESS_PARAM);
      if (urlAddress !== addressName) {
        removeHomeAddressParam();
        set(addressInitializationRunAtom, false);
      }
    }

    // Clear address error if it was previously set
    if (currentErrors.invalidAddress) {
      set(formErrorsAtom, { ...currentErrors, invalidAddress: false });
    }

    // Update the Helsinki Near You breadcrumb if present.
    const breadcrumbLink = ownsPageUrl ? document.getElementById('hny-address-breadcrumb') : null;
    if (breadcrumbLink instanceof HTMLAnchorElement) {
      const url = new URL(breadcrumbLink.href);
      url.searchParams.set(HOME_ADDRESS_PARAM, addressName);
      breadcrumbLink.href = url.toString();
      breadcrumbLink.textContent = Drupal.t(
        'Results for @address',
        { '@address': addressName },
        { context: 'Helsinki near you' },
      );
    }
  } else if (address && address.trim() !== '') {
    set(formErrorsAtom, { ...currentErrors, invalidAddress: true });
    const clearedParams = new URLSearchParams(get(initialParamsAtom));
    set(submittedParamsAtom, clearedParams);
    return;
  }

  set(pageAtom, 1);
  set(submittedParamsAtom, stagedParams);

  if (visibleParams && ownsPageUrl) {
    const persistedParams = new URLSearchParams();
    visibleParams.forEach((param) => {
      const value = stagedParams.get(param);
      if (value) {
        persistedParams.set(param, value);
      }
    });

    const url = new URL(window.location.href);
    url.search = persistedParams.toString();
    window.history.pushState({}, '', url.toString());
  }
});

export const urlAtom = atom((get) => {
  const submittedParams = get(submittedParamsAtom);
  const baseUrl = get(baseUrlAtom);

  return `${baseUrl}?${submittedParams.toString()}`;
});

export const loadableUrlAtom = unwrap(urlAtom);

export const paramsAtom = atomWithDefault<URLSearchParams>((get) => new URLSearchParams(get(initialParamsAtom)));

export const updatePageParamAtom = atom(null, (get, set, page: number) => {
  const submittedParams = new URLSearchParams(get(submittedParamsAtom));

  submittedParams.set('page', page.toString());
  set(submittedParamsAtom, submittedParams);
});

export const resetParamAtom = atom(null, (get, set, option: string) => {
  const initialParams = new URLSearchParams(get(initialParamsAtom));
  const params = new URLSearchParams(get(paramsAtom));
  const skipParams = [ApiKeys.COORDINATES, ApiKeys.RADIUS];

  if (Object.values(ApiKeys).indexOf(option) !== -1 && skipParams.indexOf(option) === -1) {
    const initial = initialParams.get(option);
    initial ? params.set(option, initial) : params.delete(option);
    set(paramsAtom, params);
  }
});

export const updateParamsAtom = atom(null, (get, set, options: Options) => {
  const params = new URLSearchParams(get(paramsAtom));
  Object.keys(options).forEach((option: string) => {
    if (Object.values(ApiKeys).indexOf(option) !== -1) {
      options[option] === undefined ? params.delete(option) : params.set(option, options[option]);
    }
  });
  set(paramsAtom, params);
});

// Store address input. Converted to coordinates during form submit.
export const addressAtom = atomWithDefault<string | undefined | null>((get) =>
  get(initialQueryAtom).get(HOME_ADDRESS_PARAM),
);

export const languageAtom = atom<OptionType[]>([]);

export const eventTypeAtom = atom<EventTypeOption[]>([]);

export const targetGroupsAtom = atom<OptionType[]>([]);

export const initializedAtom = atom<boolean>(false);
