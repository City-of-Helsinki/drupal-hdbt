import parse from 'html-react-parser';
import { useAtomValue } from 'jotai';
import { hobbiesPublicUrl, settingsAtom } from '../store';
import type { Event, EventImage } from '../types/Event';

const INTERNET_EXCEPTION = 'helsinki:internet';
const overDayApart = (start: Date, end: Date) => start.toDateString() !== end.toDateString();

const formatStartDate = (start: Date, end: Date) => {
  if (start.getFullYear() === end.getFullYear()) {
    if (start.getMonth() === end.getMonth()) {
      return start.getDate();
    }

    // The getMonth function returns a zero-based index, so we need to add 1 to get the correct month.
    return `${start.getDate()}.${start.getMonth() + 1}.`;
  }

  return start.toLocaleDateString('fi-FI');
};

export const useResultCardProps = ({
  end_time,
  enrolment_end_time,
  enrolment_start_time,
  id,
  images,
  location,
  name,
  offers,
  start_time,
  type_id,
}: Event) => {
  const { currentLanguage } = drupalSettings.path;
  const { baseUrl, imagePlaceholder } = drupalSettings.helfi_events;
  const { useCrossInstitutionalStudiesForm } = useAtomValue(settingsAtom);

  const resolvedName = name?.[currentLanguage] || name?.fi || Object.values(name)[0] || '';

  const formatTime = (date: Date) => date.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' });

  const getDate = () => {
    let startDate: Date;
    let endDate: Date;
    let isMultiDate: boolean;

    try {
      startDate = new Date(start_time);
      endDate = new Date(end_time);
      isMultiDate = end_time ? overDayApart(startDate, endDate) : false;
    } catch (e) {
      throw new Error(`DATE ERROR ${e}`);
    }

    if (isMultiDate) {
      return `${formatStartDate(startDate, endDate)} - ${endDate.toLocaleDateString('fi-FI')}`;
    }

    return `${startDate.toLocaleDateString('fi-FI')}, ${Drupal.t('at', {}, { context: 'Indication that events take place in a certain timeframe' })} ${formatTime(startDate)} - ${formatTime(endDate)}`;
  };

  const getLocation = () => {
    let locationString = '';
    const hasName = location?.name?.[currentLanguage];
    const hasAddress = location?.street_address?.[currentLanguage];

    if (hasName) {
      locationString += hasName;
    }

    if (hasAddress) {
      hasName
        ? // biome-ignore lint/suspicious/noAssignInExpressions: @todo UHF-12501
          (locationString += `, ${hasAddress}`)
        : // biome-ignore lint/suspicious/noAssignInExpressions: @todo UHF-12501
          (locationString += hasAddress);
    }

    return locationString;
  };

  function isValidUrl(urlToCheck: string | undefined | null) {
    if (!urlToCheck) return false;
    const urlPattern = /^(http|https):\/\/[^ "]+$/;
    return urlPattern.test(urlToCheck);
  }

  const getOffers = (): boolean =>
    offers?.some(
      ({ info_url }) => info_url != null && info_url[currentLanguage] != null && isValidUrl(info_url[currentLanguage]),
    ) ?? false;

  const imageToElement = (image: EventImage): JSX.Element => {
    const imageProps: React.ImgHTMLAttributes<HTMLImageElement> & { 'data-photographer'?: string } = {};

    if (image.url) {
      imageProps.src = image.url;
    }

    if (image.photographer_name) {
      imageProps['data-photographer'] = image.photographer_name;
    }

    return <img alt='' {...imageProps} />;
  };

  const getImage = () => {
    const image = images?.find((img) => img.url);

    if (image) {
      return imageToElement(image);
    }
    if (imagePlaceholder) {
      return parse(imagePlaceholder);
    }

    return <div className='image-placeholder'></div>;
  };

  const getCardCategoryTag = () => {
    if (!type_id || type_id === 'Volunteering') {
      return;
    }

    return type_id === 'Course'
      ? { tag: Drupal.t('Hobby', {}, { context: 'Event search: hobby tag' }), color: 'gold' }
      : { tag: Drupal.t('Event', {}, { context: 'Event search: event tag' }), color: 'fog-medium-light' };
  };

  const isRemote = location && location.id === INTERNET_EXCEPTION;
  const isFree = offers?.some(({ is_free }) => is_free);

  const getCardTags = () => {
    const tags = [];

    if (isRemote) {
      tags.push({ tag: Drupal.t('Remote participation', {}, { context: 'Label for remote events' }), color: 'silver' });
    }

    if (isFree) {
      tags.push({ tag: Drupal.t('Free', {}, { context: 'Label for free events' }), color: 'silver' });
    }

    return tags;
  };

  const getSignUp = () => {
    if (!enrolment_end_time && !enrolment_start_time) {
      return;
    }

    const startDate = new Date(enrolment_start_time);
    const startString = `${startDate.toLocaleDateString('fi-FI')} ${Drupal.t('at', {}, { context: 'Indication that events take place in a certain timeframe' })} ${formatTime(startDate)}`;

    // There should never be a case where we have end date but no start date.
    if (!enrolment_end_time) {
      return startString;
    }

    const endDate = new Date(enrolment_end_time);
    return `${startString} - ${endDate.toLocaleDateString('fi-FI')} ${Drupal.t('at', {}, { context: 'Indication that events take place in a certain timeframe' })} ${formatTime(endDate)}`;
  };

  const getUrl = () => {
    if (useCrossInstitutionalStudiesForm) {
      const resolvedLanguage = name?.[currentLanguage] ? currentLanguage : 'fi';

      let courseParam = '';
      switch (resolvedLanguage) {
        case 'fi':
          courseParam = 'ristiinopiskelu';
          break;
        case 'sv':
          courseParam = 'kosstudier';
          break;
        default: courseParam = 'cross-institutional-studies';
      }

      return `${baseUrl}/${resolvedLanguage}/${courseParam}/${id}`;
    }

    if (type_id && type_id === 'Course') {
      const type = { fi: 'kurssit', sv: 'kurser' }[currentLanguage] ?? 'courses';

      return `${hobbiesPublicUrl}/${currentLanguage}/${type}/${id}`;
    }

    const type = { fi: 'tapahtumat', sv: 'kurser' }[currentLanguage] ?? 'events';

    return `${baseUrl}/${currentLanguage}/${type}/${id}`;
  };

  return {
    cardCategoryTag: getCardCategoryTag(),
    cardImage: getImage(),
    cardTags: getCardTags(),
    cardTitle: resolvedName,
    cardUrl: getUrl(),
    location: isRemote ? 'Internet' : getLocation(),
    registrationRequired: getOffers(),
    signUp: getSignUp(),
    time: getDate(),
  };
};
