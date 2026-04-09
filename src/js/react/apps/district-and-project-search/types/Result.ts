type Result = {
  _index: string;
  _type: string;
  _id: string;
  _score: number;
  // biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12501
  _source: any;
  content_type: string[];
  field_district_image_alt?: string[];
  field_district_search_metatags?: string[];
  field_district_subdistricts_title_for_ui?: string[];
  field_district_subdistricts_title?: string[];
  field_project_district_title_for_ui?: string[];
  field_project_district_title?: string[];
  field_project_external_website?: string[];
  field_project_image_alt?: string[];
  field_project_phase_name?: string[];
  field_project_search_metatags?: string[];
  field_project_theme_name?: string[];
  field_project_type_name?: string[];
  main_image_url?: string[];
  nid: number[];
  project_execution_schedule?: string[];
  project_plan_schedule?: string[];
  search_api_language: string;
  title_for_ui: string[];
  title: string[];
  url: string[];
};

export default Result;
