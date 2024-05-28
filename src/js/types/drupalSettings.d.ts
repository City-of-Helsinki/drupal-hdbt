declare namespace drupalSettings {
  const path: {
    currentLanguage: 'fi' | 'en' | 'sv';
  };
  const helfi_events: {
    baseUrl: string;
    imagePlaceholder: string;
    data: {
      [key: string]: {
        events_api_url: string,
        events_public_url: string,
        field_event_list_title: string,
        field_event_location: boolean,
        field_event_time: boolean,
        field_free_events: boolean,
        field_remote_events: boolean,
        field_event_count: string,
        field_filter_keywords: {
          id: string,
          name: string,
        }[],
        places: {
          [key:string]: {
            id: string,
            name: {
              [key: string]: string
            }
          }
        },
        use_fixtures: boolean
      }
    }
  };
  const helfi_react_search: {
    cookie_privacy_url: string;
    elastic_proxy_url: string;
    sentry_dsn_react: string;
  };
  const helfi_rekry_job_search: {
    results_page_path: string;
  };
  const helfi_news_archive: {
    elastic_proxy_url: string;
    feed_base_url: string;
  };
}
