import { formatHDSDate } from '@/react/common/helpers/dateUtils';
import type { Event, Registration } from '../types/Event';
import { formatTime } from './TimeHelpers';

const hasEnrolmentData = (event: Event): boolean =>
  !!event.registration || !!event.enrolment_start_time || !!event.enrolment_end_time;

const getEventRegistrationData = (event: Event): Registration | undefined => {
  if (event.registration) {
    return event.registration;
  }

  // Lore:
  // If event has enrolment data set in it's root,
  // it should also have registration field populated.
  // This is a strange behaviour in LinkedEvents,
  // that it might use registration data from super event in this case.
  if (
    hasEnrolmentData(event) &&
    event.super_event &&
    hasEnrolmentData(event.super_event) &&
    event.super_event?.registration
  ) {
    return event.super_event.registration;
  }
};

export const getEnrolmentStatus = (event: Event): string | undefined => {
  const now = new Date();

  const registrationData = getEventRegistrationData(event);

  if (!registrationData) return;

  const {
    enrolment_end_time: enrolmentEndTime,
    enrolment_start_time: enrolmentStartTime,
    remaining_attendee_capacity: remainingAttendeeCapacity,
    remaining_waiting_list_capacity: remainingWaitingListCapacity,
    waiting_list_capacity: waitingListCapacity,
  } = registrationData;

  if (enrolmentStartTime && new Date(enrolmentStartTime) > now) {
    const startDate = new Date(enrolmentStartTime);

    return Drupal.t(
      'Registration opens on @date, at @time',
      { '@date': formatHDSDate(startDate), '@time': formatTime(startDate) },
      { context: 'Event registration status value' },
    );
  }

  if (enrolmentEndTime && new Date(enrolmentEndTime) < now) {
    return Drupal.t('Registration has closed', {}, { context: 'Event registration status value' });
  }

  const noCapacity = typeof remainingAttendeeCapacity === 'number' && remainingAttendeeCapacity === 0;

  if (noCapacity && waitingListCapacity && remainingWaitingListCapacity) {
    return Drupal.t('Registration to queue', {}, { context: 'Event registration status value' });
  }

  if (noCapacity) {
    return Drupal.t('No space available', {}, { context: 'Event registration status value' });
  }

  return Drupal.t('Registration is open', {}, { context: 'Event registration status value' });
};
