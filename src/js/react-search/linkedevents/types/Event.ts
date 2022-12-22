export type MultilingualString = {
  fi?: string,
  en?: string,
  sv?: string
};

export type EventImage = {
  alt_text: string,
  id: number,
  name?: string,
  photographer_name?: string,
  url?: string
};

export type EventKeyword = {
  id: string,
  name: MultilingualString
};

export type EventLocation = {
  id: string,
  name?: MultilingualString
  street_address?: MultilingualString
};

export type Event = {
  end_time: number,
  id: string,
  images?: EventImage[],
  keywords?: EventKeyword[],
  name: MultilingualString
  location?: EventLocation,
  start_time: number,
  street_address?: MultilingualString
};

export default Event;
