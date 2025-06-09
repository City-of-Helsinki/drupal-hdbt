type FilterSettings = {
  eventCount: number;
  eventListType: 'hobbies' | 'events' | 'events_and_hobbies';
  hidePagination: boolean;
  showFreeFilter: boolean;
  hideHeading: boolean;
  showLanguageFilter: boolean;
  showLocation: boolean;
  showRemoteFilter: boolean;
  showTimeFilter: boolean;
  showTopicsFilter: boolean;
  useFullLocationFilter: boolean;
  useFullTopicsFilter: boolean;
  useLocationSearch: boolean;
};

export default FilterSettings;
