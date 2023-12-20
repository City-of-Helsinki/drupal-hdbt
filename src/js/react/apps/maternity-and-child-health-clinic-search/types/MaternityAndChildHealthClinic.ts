type ImageOverride = {
  picture_url_override: {
    alt: string,
    photographer: string,
    title: string,
    url: string
  }
};

export type MaternityAndChildHealthClinic = {
  _language: string,
  address: string[],
  id: string[],
  latitude: string[],
  longitude: string[],
  name: string[],
  name_override?: string[],
  picture_url?: string[],
  provided_languages: string,
  media_as_objects?: ImageOverride[],
  summary_processed?: string[],
  url: string[]
};
