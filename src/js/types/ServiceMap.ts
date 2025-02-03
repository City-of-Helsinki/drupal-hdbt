export type TranslatedName = {
  fi?: string;
  sv?: string;
  en?: string;
}

export type ServiceMapAddress = {
  object_type: string;
  name: TranslatedName;
  number?: number;
  number_end?: number;
  letter: string;
  modified_at: string;
  municipality: {
    id: string;
    name: TranslatedName;
  }
  street: {
    name: TranslatedName;
  }
  location: {
    type: string;
    coordinates: [number, number];
  }
};

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
  name: TranslatedName;
  parent: number;
  municipality: string;
}

export type ServiceMapResponse<T> = {
  count: number;
  next: string|null;
  previous: string|null;
  results: T[];
};
