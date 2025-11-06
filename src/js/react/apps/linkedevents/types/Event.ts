type MultilingualString = {
  fi?: string;
  en?: string;
  sv?: string;
};

export type EventImage = {
  alt_text: string;
  id: number;
  name?: string;
  photographer_name?: string;
  url?: string;
};

export type EventKeyword = {
  id: string;
  name: MultilingualString;
};

type EventOffers = {
  info_url: MultilingualString;
  is_free: boolean;
};

type EventLocation = {
  id: string;
  name?: MultilingualString;
  street_address?: MultilingualString;
};

export type Event = {
  end_time: number;
  enrolment_end_time: number;
  enrolment_start_time: number;
  id: string;
  images?: EventImage[];
  keywords?: EventKeyword[];
  location?: EventLocation;
  name: MultilingualString;
  offers?: EventOffers[];
  start_time: number;
  street_address?: MultilingualString;
  type_id: 'Course' | 'General' | 'Volunteering';
};

export default Event;
