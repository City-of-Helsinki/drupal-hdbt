import type { ImageOverride } from '@/types/ImageOverride';

type AdditionalFilters = {
  grades_1_6: boolean;
  grades_7_9: boolean;
  finnish_education: boolean;
  swedish_education: boolean;
  english_education: boolean;
};

export type School = {
  search_api_language: string;
  additional_filters: AdditionalFilters[];
  address: string[];
  id: string[];
  latitude: string[];
  longitude: string[];
  name: string[];
  name_override?: string[];
  ontologyword_details_clarifications?: string[];
  ontologyword_ids?: string[];
  picture_url?: string[];
  media_as_objects?: ImageOverride[];
  summary_processed?: string[];
  url: string[];
};
