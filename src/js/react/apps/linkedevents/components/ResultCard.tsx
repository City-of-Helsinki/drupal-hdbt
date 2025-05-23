import parse from 'html-react-parser';

import type { Event, EventImage, EventKeyword } from '../types/Event';
import CardItem from '@/react/common/Card';
import type TagType from '@/types/TagType';

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

interface KeywordsForLanguage { keywords: EventKeyword[], currentLanguage: string }
const getCardTags = ({ keywords, currentLanguage }: KeywordsForLanguage ) => keywords?.map((item: any) => ({ tag: item.name[currentLanguage], color: 'silver' })).filter((keyword: any) => keyword.tag !== undefined) as TagType[];

interface ResultCardProps extends Event {
  cardModifierClass?: string;
}

function ResultCard({ end_time, id, location, name, keywords=[], start_time, images, offers, cardModifierClass, }: ResultCardProps) {
  const { currentLanguage } = drupalSettings.path;
  const { baseUrl, imagePlaceholder } = drupalSettings.helfi_events;
  const url = `${baseUrl}/${currentLanguage}/events/${id}`;

  const resolvedName = name?.[currentLanguage] || name?.fi || Object.values(name)[0] || '';

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

    return `${startDate.toLocaleDateString('fi-FI')}, ${Drupal.t('at', {}, { context: 'Indication that events take place in a certain timeframe' })} ${startDate.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' })}`;
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

  const isRemote = location && location.id === INTERNET_EXCEPTION;
  const cardTags = getCardTags({keywords, currentLanguage});

  return (
    <CardItem
      cardModifierClass={cardModifierClass}
      cardUrl={url}
      cardTitle={resolvedName}
      cardImage={getImage()}
      cardTags={cardTags}
      cardUrlExternal
      location={isRemote ? 'Internet' : getLocation()}
      time={getDate()}
      registrationRequired={getOffers()}
    />
  );
}

export default ResultCard;
