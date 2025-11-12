export type TranslatedString = { en?: string; fi?: string; sv?: string };

export type ServiceMapAddress = {
  letter: string;
  location: { type: string; coordinates: [number, number] };
  modified_at: string;
  name: TranslatedString;
  number_end?: number;
  number?: number;
  municipality: { id: string; name: TranslatedString };
  object_type: string;
  street: { name: TranslatedString };
};

export type ServiceMapPlace = {
  address_country: null;
  address_locality: TranslatedString;
  address_region: null;
  contact_type: null;
  created_time: null;
  custom_data: null;
  data_source: string;
  deleted: boolean;
  description: null;
  divisions: AdministrativeDivision[];
  email: string;
  has_upcoming_events: boolean;
  has_user_editable_resources: boolean;
  id: string;
  image: number;
  info_url: TranslatedString;
  last_modified_time: string;
  n_events: number;
  name: TranslatedString;
  parent: null;
  position: TranslatedString;
  post_office_box_num: null;
  postal_code: string;
  publisher: string;
  replaced_by: null;
  street_address: TranslatedString;
  telephone: TranslatedString;
};

export type AdministrativeDivision = {
  end: string;
  // biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12501
  extra: any;
  id: number;
  modified_at: string;
  municipality: string;
  name: TranslatedString;
  ocd_id: string;
  origin_id: string;
  parent: number;
  service_point_id: string;
  start: string;
  type: string;
  units: number[];
};

export type ServiceMapResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};
