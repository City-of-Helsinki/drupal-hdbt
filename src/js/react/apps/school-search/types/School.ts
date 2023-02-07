type imageOverride = {
  picture_url_override: {
    alt: string,
    photographer: string,
    title: string,
    url: string
  }
};

export type School = {
  _language: string,
  address: string[],
  name: string[],
  name_override?: string[],
  picture_url?: string[],
  media_as_objects?: imageOverride[],
  summary_processed?: string[],
  url: string[]
};