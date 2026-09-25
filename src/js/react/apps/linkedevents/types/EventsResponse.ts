import type Event from './Event';

type EventsResponse = { data: Event[]; meta: { count: number; next?: string; previous?: string } };

export default EventsResponse;
