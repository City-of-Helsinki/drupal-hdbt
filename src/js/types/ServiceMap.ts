export type TranslatedString = {
  fi?: string;
  sv?: string;
  en?: string;
}

export type ServiceMapAddress = {
  object_type: string;
  name: TranslatedString;
  number?: number;
  number_end?: number;
  letter: string;
  modified_at: string;
  municipality: {
    id: string;
    name: TranslatedString;
  }
  street: {
    name: TranslatedString;
  }
  location: {
    type: string;
    coordinates: [number, number];
  }
};

export type ServiceMapPlace = {
  id: string;
  has_user_editable_resources: boolean;
  data_source: string;
  publisher: string;
  divisions: AdministrativeDivision[];
  created_time: null;
  last_modified_time: string;
  custom_data: null;
  email: string;
  contact_type: null;
  address_region: null;
  postal_code: string;
  post_office_box_num: null;
  address_country: null;
  deleted: boolean;
  has_upcoming_events: boolean;
  n_events: number;
  image: number;
  parent: null;
  replaced_by: null;
  position: TranslatedString;
  address_locality: TranslatedString;
  description: null;
  info_url: TranslatedString;
  name: TranslatedString;
  street_address: TranslatedString;
  telephone: TranslatedString;
}

export type AdministrativeDivision = {
  id: number;
  origin_id: string;
  ocd_id: string;
  service_point_id: string;
  units: number[];
  start: string;
  end: string;
  modified_at: string;
  extra: any;
  type: string;
  name: TranslatedString;
  parent: number;
  municipality: string;
}

export type ServiceMapResponse<T> = {
  count: number;
  next: string|null;
  previous: string|null;
  results: T[];
};
