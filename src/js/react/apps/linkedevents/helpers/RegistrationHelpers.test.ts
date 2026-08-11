import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import type { Event, Registration } from '../types/Event';
import { getEnrolmentStatus } from './RegistrationHelpers';

// All relative times in these tests are anchored to this instant.
const NOW = new Date(2025, 7, 5, 12, 0, 0);

// Local-time ISO strings (no offset) so the assertions stay timezone independent.
const PAST = '2025-08-01T09:00:00';
const FUTURE = '2025-08-20T16:00:00';
const CURRENT = '2025-08-05T12:00:00';

const makeEvent = (overrides: Partial<Event> = {}): Event => ({
  audience_max_age: null,
  audience_min_age: null,
  custom_data: null,
  date_published: null,
  end_time: NOW.getTime(),
  enrolment_end_time: null,
  enrolment_start_time: null,
  id: 'helsinki:test-event',
  in_language: [],
  maximum_attendee_capacity: null,
  minimum_attendee_capacity: null,
  name: { fi: 'Testikurssi', en: 'Test course' },
  registration: null,
  replaced_by: null,
  start_time: NOW.getTime(),
  super_event_type: null,
  super_event: null,
  type_id: 'Course',
  ...overrides,
});

const makeRegistration = (overrides: Partial<Registration> = {}): Registration => ({ ...overrides });

describe('RegistrationHelpers', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getEnrolmentStatus: no registration object', () => {
    // Without a registration object the enrolment fields on the event root are used instead.
    test('reports an open registration when the event root has no enrolment data either', () => {
      expect(getEnrolmentStatus(makeEvent())).toBe('Registration is open');
    });

    test('announces the opening date from the event root enrolment start time', () => {
      const event = makeEvent({ enrolment_start_time: FUTURE });

      expect(getEnrolmentStatus(event)).toBe('Registration opens on 20.8.2025, at 16.00');
    });

    test('reports a closed registration from the event root enrolment end time', () => {
      const event = makeEvent({ enrolment_start_time: PAST, enrolment_end_time: PAST });

      expect(getEnrolmentStatus(event)).toBe('Registration has closed');
    });
  });

  describe('getEnrolmentStatus: upcoming registration', () => {
    test('announces the opening date and time', () => {
      const event = makeEvent({ registration: makeRegistration({ enrolment_start_time: FUTURE }) });

      expect(getEnrolmentStatus(event)).toBe('Registration opens on 20.8.2025, at 16.00');
    });

    test('takes precedence over remaining capacity', () => {
      const event = makeEvent({
        registration: makeRegistration({ enrolment_start_time: FUTURE, remaining_attendee_capacity: 0 }),
      });

      expect(getEnrolmentStatus(event)).toBe('Registration opens on 20.8.2025, at 16.00');
    });

    test('is not used when the opening moment is exactly now', () => {
      const event = makeEvent({ registration: makeRegistration({ enrolment_start_time: CURRENT }) });

      expect(getEnrolmentStatus(event)).toBe('Registration is open');
    });

    test('is not used once the opening moment has passed', () => {
      const event = makeEvent({ registration: makeRegistration({ enrolment_start_time: PAST }) });

      expect(getEnrolmentStatus(event)).toBe('Registration is open');
    });
  });

  describe('getEnrolmentStatus: closed registration', () => {
    test('reports a closed registration once the end time has passed', () => {
      const event = makeEvent({ registration: makeRegistration({ enrolment_end_time: PAST }) });

      expect(getEnrolmentStatus(event)).toBe('Registration has closed');
    });

    test('takes precedence over a full course', () => {
      const event = makeEvent({
        registration: makeRegistration({ enrolment_end_time: PAST, remaining_attendee_capacity: 0 }),
      });

      expect(getEnrolmentStatus(event)).toBe('Registration has closed');
    });

    test('is not used while the end time is still ahead', () => {
      const event = makeEvent({
        registration: makeRegistration({ enrolment_start_time: PAST, enrolment_end_time: FUTURE }),
      });

      expect(getEnrolmentStatus(event)).toBe('Registration is open');
    });
  });

  describe('getEnrolmentStatus: full course', () => {
    test('offers the waiting list when it still has room', () => {
      const event = makeEvent({
        registration: makeRegistration({
          remaining_attendee_capacity: 0,
          remaining_waiting_list_capacity: 3,
          waiting_list_capacity: 10,
        }),
      });

      expect(getEnrolmentStatus(event)).toBe('Registration to queue');
    });

    test('reports no space when the waiting list is also full', () => {
      const event = makeEvent({
        registration: makeRegistration({
          remaining_attendee_capacity: 0,
          remaining_waiting_list_capacity: 0,
          waiting_list_capacity: 10,
        }),
      });

      expect(getEnrolmentStatus(event)).toBe('No space available');
    });

    test('reports no space when there is no waiting list at all', () => {
      const event = makeEvent({
        registration: makeRegistration({ remaining_attendee_capacity: 0, waiting_list_capacity: 0 }),
      });

      expect(getEnrolmentStatus(event)).toBe('No space available');
    });

    test('reports no space when the waiting list fields are null', () => {
      const event = makeEvent({
        registration: makeRegistration({
          remaining_attendee_capacity: 0,
          remaining_waiting_list_capacity: null,
          waiting_list_capacity: null,
        }),
      });

      expect(getEnrolmentStatus(event)).toBe('No space available');
    });
  });

  describe('getEnrolmentStatus: open registration', () => {
    test('reports an open registration when seats remain', () => {
      const event = makeEvent({ registration: makeRegistration({ remaining_attendee_capacity: 5 }) });

      expect(getEnrolmentStatus(event)).toBe('Registration is open');
    });

    test('reports an open registration when capacity is not tracked', () => {
      const event = makeEvent({ registration: makeRegistration({ remaining_attendee_capacity: null }) });

      expect(getEnrolmentStatus(event)).toBe('Registration is open');
    });

    test('reports an open registration for a registration object with no fields', () => {
      // An uncapped registration: present, but with no capacity or enrolment times.
      const event = makeEvent({ registration: makeRegistration() });

      expect(getEnrolmentStatus(event)).toBe('Registration is open');
    });
  });

  describe('getEnrolmentStatus: super event fallback', () => {
    test('falls back to the super event registration when the event carries enrolment times', () => {
      const event = makeEvent({
        enrolment_start_time: CURRENT,
        registration: null,
        super_event: makeEvent({
          id: 'helsinki:super-event',
          registration: makeRegistration({ remaining_attendee_capacity: 0, waiting_list_capacity: 0 }),
          super_event_type: 'recurring',
        }),
      });

      expect(getEnrolmentStatus(event)).toBe('No space available');
    });

    test('prefers the event own registration over the super event one', () => {
      const event = makeEvent({
        enrolment_start_time: CURRENT,
        registration: makeRegistration({ remaining_attendee_capacity: 5 }),
        super_event: makeEvent({
          id: 'helsinki:super-event',
          registration: makeRegistration({ remaining_attendee_capacity: 0, waiting_list_capacity: 0 }),
        }),
      });

      expect(getEnrolmentStatus(event)).toBe('Registration is open');
    });

    test('ignores the super event when the event itself has no enrolment data', () => {
      const event = makeEvent({
        enrolment_end_time: null,
        enrolment_start_time: null,
        registration: null,
        // A full super event registration: consulting it would report no space.
        super_event: makeEvent({
          id: 'helsinki:super-event',
          registration: makeRegistration({ remaining_attendee_capacity: 0, waiting_list_capacity: 0 }),
        }),
      });

      expect(getEnrolmentStatus(event)).toBe('Registration is open');
    });

    test('falls back to the event root when the super event has no registration either', () => {
      const event = makeEvent({
        enrolment_start_time: FUTURE,
        registration: null,
        super_event: makeEvent({ id: 'helsinki:super-event', registration: null }),
      });

      expect(getEnrolmentStatus(event)).toBe('Registration opens on 20.8.2025, at 16.00');
    });
  });
});
