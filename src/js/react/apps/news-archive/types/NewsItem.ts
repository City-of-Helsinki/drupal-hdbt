type Result = {
  _click_id: number;
  _id: string;
  _index: string;
  _score: number;
  _type: string;
  alt?: string[];
  changed?: number[];
  field_main_image_caption?: string[];
  field_news_groups?: string[];
  field_news_item_tags?: string[];
  field_news_neighbourhoods?: string[];
  field_photographer?: string[];
  fulltext_title: string[];
  highlight?: string[];
  main_image_url?: { [key: string]: string };
  published_at?: number[];
  search_api_language: string;
  title: string[];
  url: string[];
  uuid: string[];
}

export default Result;
