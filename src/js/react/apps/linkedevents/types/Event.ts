type MultilingualString = { fi?: string; en?: string; sv?: string };

export type EventImage = { alt_text: string; id: number; name?: string; photographer_name?: string; url?: string };

type IncludableResource = { id: string; name: MultilingualString } | { '@id': string };

export type EventKeyword = IncludableResource & {
  aggregate: boolean;
  data_source: string;
  has_user_editable_resources?: boolean;
};

type EventOffers = { info_url: MultilingualString; is_free: boolean };

type EventLocation = {
  data_source?: string;
  has_user_editable_resources?: boolean;
  id: string;
  name?: MultilingualString;
  street_address?: MultilingualString;
};

export type EventExternalLink = { language?: string; link: string; name: string };

type EventStatus = 'EventScheduled' | 'EventCancelled' | 'EventPostponed' | 'EventRescheduled';

export type Event = {
  '@context'?: string;
  '@id'?: string;
  '@type'?: string;
  audience?: IncludableResource[];
  audience_max_age: number | null;
  audience_min_age: number | null;
  created_time?: string;
  custom_data: unknown | null;
  data_source?: string;
  date_published: string | null;
  deleted?: boolean;
  description?: MultilingualString;
  end_time: number;
  enrolment_end_time: number;
  enrolment_start_time: number;
  environment?: string | null;
  environmental_certificate?: string | null;
  event_status?: EventStatus;
  external_links?: EventExternalLink[];
  has_user_editable_resources?: boolean;
  id: string;
  images?: EventImage[];
  info_url?: MultilingualString;
  in_language: IncludableResource[];
  keywords?: EventKeyword[];
  last_modified_time?: string;
  local?: boolean;
  location?: EventLocation;
  location_extra_info?: MultilingualString;
  maximum_attendee_capacity: number | null;
  minimum_attendee_capacity: number | null;
  name: MultilingualString;
  offers?: EventOffers[];
  provider?: MultilingualString;
  provider_contact_info?: MultilingualString | null;
  publisher?: string;
  registration: unknown | null;
  replaced_by: string | null;
  short_description?: MultilingualString;
  start_time: number;
  street_address?: MultilingualString;
  sub_events?: IncludableResource[];
  super_event: IncludableResource | null;
  super_event_type: 'recurring' | 'umbrella' | null;
  type_id: 'Course' | 'General' | 'Volunteering';
};

export default Event;
