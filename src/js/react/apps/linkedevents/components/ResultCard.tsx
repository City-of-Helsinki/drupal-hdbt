import parse from 'html-react-parser';

import type { Event, EventImage } from '../types/Event';
import CardItem from '@/react/common/Card';
import { hobbiesPublicUrl } from '../store';

const INTERNET_EXCEPTION = 'helsinki:internet';
const overDayApart = (start: Date, end: Date) => start.toDateString() !== end.toDateString();

// Return start day string with increasing specificity the further apart it is from end date
const formatStartDate = (start: Date, end: Date) => {
  if (start.getFullYear() === end.getFullYear()) {
    if (start.getMonth() === end.getMonth()) {
      return start.getDate();
    }

    return `${start.getDate()}.${start.getMonth()}`;
  }

  return start.toLocaleDateString('fi-FI');
};

interface ResultCardProps extends Event {
  cardModifierClass?: string;
}

function ResultCard({
  cardModifierClass,
  end_time,
  enrolment_end_time,
  enrolment_start_time,
  id,
  images,
  keywords=[],
  location,
  name,
  offers,
  start_time,
  type_id,
}: ResultCardProps) {
  const { currentLanguage } = drupalSettings.path;
  const { baseUrl, imagePlaceholder } = drupalSettings.helfi_events;
  const resolvedName = name?.[currentLanguage] || name?.fi || Object.values(name)[0] || '';

  const formatTime = (date: Date) => date.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' });

  const getDate = () => {
    let startDate;
    let endDate;
    let isMultiDate;

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
    const hasName = location?.name && location?.name[currentLanguage];
    const hasAddress = location?.street_address && location?.street_address[currentLanguage];

    if (hasName) {
      locationString += hasName;
    }

    if (hasAddress) {
      hasName ? locationString += `, ${hasAddress}` : locationString += hasAddress;
    }

    return locationString;
  };

  // Function to check if the url is valid that can be found in the info_url field.
  function isValidUrl(urlToCheck: string | undefined | null) {
    if (!urlToCheck) return false;
    const urlPattern = /^(http|https):\/\/[^ "]+$/; // Regex because the eslint rules tell me not to use new.
    return urlPattern.test(urlToCheck);
  }

  const getOffers = (): boolean => offers?.some(({ info_url }) =>
    info_url != null && info_url[currentLanguage] != null && isValidUrl(info_url[currentLanguage])
  ) ?? false;

  const imageToElement = (image: EventImage): JSX.Element => {
    const imageProps: React.ImgHTMLAttributes<HTMLImageElement> & { 'data-photographer'?:string } = {};

    if (image.url) {
      imageProps.src = image.url;
    }

    if (image.photographer_name) {
      imageProps['data-photographer'] = image.photographer_name;
    }

    return <img alt='' {...imageProps} />;
  };

  const getImage = () => {
    const image = images?.find(img => img.url);

    if (image) {
      return imageToElement(image);
    }
    if (imagePlaceholder) {
      return parse(imagePlaceholder);
    }

    return (
      <div className='image-placeholder'></div>
    );
  };

  const getCardCategoryTag = () => {
    if (!type_id || type_id === 'Volunteering') {
      return;
    }

    return type_id === 'Course' ?
      {tag: Drupal.t('Hobby', {}, {context: 'Event search: hobby tag'}), color: 'gold'} :
      {tag: Drupal.t('Event', {}, {context: 'Event search: event tag'}), color: 'fog-medium-light'};
  };

  const isRemote = location && location.id === INTERNET_EXCEPTION;
  const isFree = offers?.some(({ is_free }) => is_free);
  const getCardTags = () => {
    const tags = [];

    if (isRemote) {
      tags.push({
        tag: Drupal.t('Remote participation', {}, { context: 'Label for remote events' }),
        color: 'silver',
      });
    }

    if (isFree) {
      tags.push({
        tag: Drupal.t('Free', {}, { context: 'Label for free events' }),
        color: 'silver',
      });
    }

    return tags;
  };

  const getSignUp = () => {
    if (!enrolment_end_time && !enrolment_start_time) {
      return;
    }

    const startDate = new Date(enrolment_start_time);
    const startString = `${startDate.toLocaleDateString('fi-FI')} ${Drupal.t('at', {}, {context: 'Indication that events take place in a certain timeframe' })} ${formatTime(startDate)}`;

    // There should never be a case where we have end date but no start date.
    if (!enrolment_end_time) {
      return startString;
    }

    const endDate = new Date(enrolment_end_time);
    return `${startString} - ${endDate.toLocaleDateString('fi-FI')} ${Drupal.t('at', {}, {context: 'Indication that events take place in a certain timeframe' })} ${formatTime(endDate)}`;
  };

  const getUrl = () => {
    if (type_id && type_id === 'Course') {
      const type = {
        'fi': 'kurssit',
        'sv': 'kurser'
      }[currentLanguage] ?? 'courses';

      return `${hobbiesPublicUrl}/${currentLanguage}/${type}/${id}`;
    }

    const type = {
      'fi': 'tapahtumat',
      'sv': 'kurser'
    }[currentLanguage] ?? 'events';

    return `${baseUrl}/${currentLanguage}/${type}/${id}`;
  };

  return (
    <CardItem
      cardCategoryTag={getCardCategoryTag()}
      cardModifierClass={cardModifierClass}
      cardUrl={getUrl()}
      cardTitle={resolvedName}
      cardImage={getImage()}
      cardTags={getCardTags()}
      cardUrlExternal
      location={isRemote ? 'Internet' : getLocation()}
      time={getDate()}
      registrationRequired={getOffers()}
      signUp={getSignUp()}
    />
  );
}

export default ResultCard;
