type FilterSettings = {
  eventCount: number;
  eventListType: 'hobbies' | 'events' | 'events_and_hobbies';
  hideHeading: boolean;
  hidePagination: boolean;
  removeBloatingEvents: boolean;
  showFreeFilter: boolean;
  showLanguageFilter: boolean;
  showLocation: boolean;
  showRemoteFilter: boolean;
  showTimeFilter: boolean;
  showTopicsFilter: boolean;
  useCrossInstitutionalStudiesForm: boolean;
  useFullLocationFilter: boolean;
  useFullTopicsFilter: boolean;
  useLocationSearch: boolean;
  useTargetGroupFilter: boolean;
};

export default FilterSettings;
