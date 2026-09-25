import { eventsBaseUrl, hobbiesBaseUrl } from '../enum/PublicUrls';
import { BloatingTargetGroups } from '../enum/TargetGroups';
import type EventsResponse from '../types/EventsResponse';
import type FilterSettings from '../types/FilterSettings';
import type OptionType from '../types/OptionType';
import type Topic from '../types/Topic';

// Everything one embed needs to run, resolved from its root element and its own entry in
// drupalSettings. Reading it here rather than in the store is what lets several embeds coexist.
export type EventsAppConfig = {
  baseUrl: string;
  eventListTitle?: string;
  eventsPublicUrl: string;
  hobbiesPublicUrl: string;
  // Derived from the paragraph configuration, the starting point for every search.
  initialParams: URLSearchParams;
  // The query string, for the one embed that owns it.
  initialQuery: URLSearchParams;
  initialUrl: string;
  // Paragraph id, or the synthetic key used by programmatic embeds.
  instanceId: string;
  locations: OptionType[];
  ownsPageUrl: boolean;
  settings: FilterSettings;
  topics: Topic[];
  useFixtures: EventsResponse | false;
};

export type ReadConfigContext = {
  // Position in document order; the first embed owns the query string.
  index: number;
  search: string;
};

type Places = (typeof drupalSettings.helfi_events.data)[string]['places'];

const transformLocations = (locations?: Places): OptionType[] =>
  Object.values(locations ?? {})
    .filter((location) => location.id && location.name?.[drupalSettings.path.currentLanguage])
    .map((location) => ({ value: location.id, label: location.name[drupalSettings.path.currentLanguage] }));

export const readEventListConfig = (
  element: HTMLElement,
  { index, search }: ReadConfigContext,
): EventsAppConfig | null => {
  const instanceId = element.dataset?.paragraphId;

  if (!instanceId) {
    console.warn('Paragraph id not found in source HTML', { element });
    return null;
  }

  const settings = drupalSettings.helfi_events?.data?.[instanceId];

  if (!settings) {
    console.warn('Event list settings not found', { instanceId });
    return null;
  }

  const eventsApiUrl = settings.events_api_url;

  if (!eventsApiUrl) {
    console.warn('Event list is missing its API url', { instanceId });
    return null;
  }

  const useFixtures = settings.use_fixtures;
  const eventListTitle = settings.field_event_list_title;
  const eventsPublicUrl = settings.events_public_url || eventsBaseUrl;
  const hobbiesPublicUrl = settings.hobbies_public_url || hobbiesBaseUrl;

  const filterSettings: FilterSettings = {
    eventCount: Number(settings.field_event_count),
    eventListType: settings.event_list_type,
    layout: settings.event_list_layout || 'default',
    hideHeading: settings.hideHeading,
    hidePagination: settings.hidePagination,
    removeBloatingEvents: settings.removeBloatingEvents,
    showFreeFilter: settings.field_free_events,
    showLanguageFilter: settings.field_language,
    showLocation: settings.field_event_location,
    showRemoteFilter: settings.field_remote_events,
    showTimeFilter: settings.field_event_time,
    showTopicsFilter: settings.field_filter_keywords?.length > 0,
    useCrossInstitutionalStudiesForm: settings.useCrossInstitutionalStudiesForm,
    useFullLocationFilter: settings.useFullLocationFilter,
    useFullTopicsFilter: settings.useFullTopicsFilter,
    useLocationSearch: settings.useLocationSearch,
    useSearchBar: settings.field_search_term,
    useTargetGroupFilter: settings.useTargetGroupFilter,
  };
  const locations = transformLocations(settings.places);
  const topics: Topic[] = settings.field_filter_keywords?.map((topic) => ({
    value: topic.id,
    label: topic.name.charAt(0).toUpperCase() + topic.name.slice(1),
  }));

  let baseUrl = eventsApiUrl;
  let initialParams = new URLSearchParams();

  const hasQuery = eventsApiUrl.indexOf('?') !== -1;
  if (hasQuery) {
    const [url, queryString] = eventsApiUrl.split('?');
    baseUrl = url;
    initialParams = new URLSearchParams(queryString);

    if (filterSettings.eventCount) {
      initialParams.set('page_size', filterSettings.eventCount.toString());
    }

    if (filterSettings.showLanguageFilter) {
      initialParams.delete('language');
    }

    if (filterSettings.removeBloatingEvents) {
      initialParams.set('keyword!', BloatingTargetGroups.join(','));
    }
  }

  const ownsPageUrl = index === 0;

  return {
    baseUrl,
    eventListTitle,
    eventsPublicUrl,
    hobbiesPublicUrl,
    initialParams,
    initialQuery: new URLSearchParams(ownsPageUrl ? search : ''),
    initialUrl: eventsApiUrl,
    instanceId,
    locations,
    ownsPageUrl,
    settings: filterSettings,
    topics,
    useFixtures,
  };
};
