import type { TranslatedString } from './ServiceMap';

export type LinkedEventsTopic = {
  id: string;
  has_user_editable_resources: boolean;
  alt_labels: string[];
  created_time: string;
  last_modified_time: string;
  aggregate: boolean;
  deprecated: boolean;
  has_upcoming_events: boolean;
  n_events: number;
  image: null;
  data_source: string;
  publisher: string;
  replaced_by: null;
  name: TranslatedString;
};
