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
        places: {
          [key:string]: {
            id: string,
            name: {
              [key: string]: string
            }
          }
        }
      }
    }
  };
  const helfi_react_search: {
    elastic_proxy_url: string
  };
  const helfi_school_search: {
    cookie_privacy_url: string;
  };
  const helfi_rekry_job_search: {
    elastic_proxy_url: string;
    results_page_path: string;
  };
  const helfi_kymp_district_project_search: {
    elastic_proxy_url: string;
  };
}
