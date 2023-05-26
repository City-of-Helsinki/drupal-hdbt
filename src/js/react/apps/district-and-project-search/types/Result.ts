interface Result {
  _index: string;
  _type: string;
  _id: string;
  _score: number;
  _language: string;
  url: Array<string>;
  nid: Array<number>;
  content_type: Array<string>;
  title: Array<string>;
  title_for_ui: Array<string>;
  field_project_district_title?: Array<string>;
  field_project_district_title_for_ui?: Array<string>;
  field_project_external_website?: Array<string>;
  field_project_image_alt?: Array<string>;
  field_project_image_height?: Array<number>
  field_project_image_width?: Array<number>
  field_project_phase_name?: Array<string>;
  field_project_search_metatags?: Array<string>;
  field_project_theme_name?: Array<string>;
  field_project_type_name?: Array<string>;
  project_execution_schedule?: Array<number>;
  project_plan_schedule?: Array<number>;
  project_image_absolute_url?: Array<string>;
  district_image_absolute_url?: Array<string>;
  field_district_image_alt?: Array<string>;
  field_district_image_height?: Array<number>
  field_district_image_width?: Array<number>
  field_district_search_metatags?: Array<string>;
  field_district_subdistricts_title?: Array<string>;
  field_district_subdistricts_title_for_ui?: Array<string>;
}

export default Result;
