import { atom } from 'jotai';
import QueryBuilder from './utils/QueryBuilder';
import ROOT_ID from './enum/RootId';
import FilterSettings from './types/FilterSettings';
import Location from './types/Location';

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
  const eventsApiUrl = settings?.events_api_url;

  const filterSettings: FilterSettings = {
    showLocation: settings?.field_event_location,
    showTimeFilter: settings?.field_event_time,
    showFreeFilter: settings?.field_free_events,
    showRemoteFilter: settings?.field_remote_events,
    eventCount: Number(settings?.field_event_count)
  };
  const locations = transformLocations(settings?.places);

  const queryBuilder = QueryBuilder(eventsApiUrl);

  return {
    queryBuilder,
    settings: filterSettings,
    locations
  };
};

// Store all needed data to 'master' atom
const baseAtom = atom(createBaseAtom());

// Create derivates for set/get parts of data
export const queryBuilderAtom = atom(
  (get) => get(baseAtom)?.queryBuilder
);

export const locationsAtom = atom(
  (get) => get(baseAtom)?.locations
);

export const settingsAtom = atom(
  (get) => get(baseAtom)?.settings
);

export const pageAtom = atom(1);

export const urlAtom = atom<string|null>(null);
