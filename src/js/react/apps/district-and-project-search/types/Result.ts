type Result = {
  _index: string;
  _type: string;
  _id: string;
  _score: number;
  // biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12066
  _source: any;
  search_api_language: string;
  url: string[];
  nid: number[];
  content_type: string[];
  title: string[];
  title_for_ui: string[];
  field_project_district_title?: string[];
  field_project_district_title_for_ui?: string[];
  field_project_external_website?: string[];
  field_project_image_alt?: string[];
  field_project_phase_name?: string[];
  field_project_search_metatags?: string[];
  field_project_theme_name?: string[];
  field_project_type_name?: string[];
  project_execution_schedule?: string[];
  project_plan_schedule?: string[];
  project_image_absolute_url?: { [key: string]: string };
  district_image_absolute_url?: { [key: string]: string };
  field_district_image_alt?: string[];
  field_district_search_metatags?: string[];
  field_district_subdistricts_title?: string[];
  field_district_subdistricts_title_for_ui?: string[];
};

export default Result;
