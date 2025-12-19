declare namespace drupalSettings {
  const path: { currentLanguage: 'fi' | 'en' | 'sv' };
  const helfi_events: {
    baseUrl: string;
    imagePlaceholder: string;
    data: {
      [key: string]: {
        event_list_type: 'events' | 'hobbies' | 'events_and_hobbies';
        events_api_url: string;
        events_public_url: string;
        field_event_list_title: string;
        field_event_location: boolean;
        field_event_time: boolean;
        field_event_count: string;
        field_free_events: boolean;
        field_language: boolean;
        field_remote_events: boolean;
        field_filter_keywords: { id: string; name: string }[];
        hidePagination: boolean;
        places: { [key: string]: { id: string; name: { [key: string]: string } } };
        hideHeading: boolean;
        removeBloatingEvents: boolean;
        use_fixtures: boolean;
        useFullLocationFilter: boolean;
        useFullTopicsFilter: boolean;
        useLocationSearch: boolean;
        useTargetGroupFilter: boolean;
      };
    };
    seeAllButtonOverride: string;
    seeAllNearYouLink: string;
    cardsWithBorders: boolean;
  };
  const helfi_react_search: { elastic_proxy_url: string; sentry_dsn_react: string; hakuvahti_url_set: boolean };
  const helfi_rekry_job_search: {
    results_page_path: string;
    hakuvahti_tos_checkbox_label: string;
    hakuvahti_tos_link_text: string;
    hakuvahti_tos_link_url: string;
  };
  const helfi_news_archive: {
    elastic_proxy_url: string;
    default_query?: string;
    max_results?: number;
    hide_form?: boolean;
    feed_base_url: string;
    cardsWithBorders: boolean;
  };
  const helfi_roadworks: {
    [key: string]: {
      cardsWithBorders: boolean;
      isShortList: boolean;
      roadworkCount: number;
      initialData: { lat?: string; lon?: string; q?: string };
      scrollToTarget: boolean;
    };
  };
  const hdbt_cookie_banner: { settingsPageUrl: string };
}
