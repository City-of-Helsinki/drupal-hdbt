type AdditionalFilters = {
  grades_1_6: boolean;
  grades_7_9: boolean;
  finnish_education: boolean;
  swedish_education: boolean;
};

type ImageOverride = {
  picture_url_override: {
    alt: string,
    photographer: string,
    title: string,
    url: string
  }
};

export type School = {
  _language: string,
  additional_filters: AdditionalFilters[];
  address: string[],
  id: string[],
  latitude: string[],
  longitude: string[],
  name: string[],
  name_override?: string[],
  picture_url?: string[],
  media_as_objects?: ImageOverride[],
  summary_processed?: string[],
  url: string[]
};