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
}
