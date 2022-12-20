import type { Event, EventImage } from '../types/Event';
import type { EventKeyword } from '../types/Event';

const INTERNET_EXCEPTION = 'helsinki:internet';

const overDayApart = (start: Date, end: Date) => {
  return start.toDateString() !== end.toDateString();
}

// Return start day string with increasing specificity the further apart it is from end date
const formatStartDate = (start: Date, end: Date) => {
  if (start.getFullYear() === end.getFullYear()) {
    if (start.getMonth() === end.getMonth()) {
      return start.getDay();
    }

    return `${start.getDay()}.${start.getMonth()}`;
  }

  return start.toLocaleDateString('fi-FI');
}

const ResultCard = ({ end_time, id, location, name, keywords, start_time, images }: Event) => {
  const { currentLanguage } = drupalSettings.path;
  const { baseUrl, imagePlaceholder } = drupalSettings.helfi_events;

  // Bail if no current language
  if (!name[currentLanguage]) {
    return null;
  }

  const getKeywords = () => {
    return keywords?.map((keyword: EventKeyword) => {

      // Bail if no current language.
      if (!keyword.name[currentLanguage]) {
        return null;
      }

      const keywordName = keyword.name[currentLanguage];
      return keywordName ? (
        <span key={keyword.id} className='event-list__tag'>
          {keywordName?.charAt(0).toUpperCase() + keywordName?.slice(1)}
        </span>
      ) : null;
    });
  }

  const getDate = () => {
    let  startDate;
    let endDate;
    let isMultiDate;
    try {
       startDate = new Date(start_time);
       endDate = new Date(end_time);
       isMultiDate = overDayApart(startDate, endDate);
    } catch(e) {
      throw new Error('DATE ERROR');
    }

    if (isMultiDate) {
      return `${formatStartDate(startDate, endDate)} - ${endDate.toLocaleDateString('fi-FI')}`
    }

    return `${startDate.toLocaleDateString('fi-FI')}, ${Drupal.t('at', {}, { context: 'Indication that events take place in a certain timeframe' })} ${startDate.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' })}`
  }

  const getLocation = () => {
    let locationString = '';
    const hasName = location?.name && location?.name[currentLanguage];
    const hasAddress = location?.street_address && location?.street_address[currentLanguage];

    if (hasName) {
      locationString += location.name?.[currentLanguage];
    }

    if (hasAddress) {
      hasName ? locationString += `, ${location.street_address?.[currentLanguage]}` : locationString += location.street_address?.[currentLanguage];
    }

    return locationString;
  };

  const imageToElement = (image: EventImage) => {
    const imageProps: React.ImgHTMLAttributes<HTMLImageElement> & { 'data-photographer'?: string } = {};

    if (image.url) {
      imageProps.src = image.url;
    }

    if (image.alt_text) {
      imageProps.alt = image.alt_text;
    }
    else if (name[currentLanguage]) {
      imageProps.alt = name[currentLanguage]?.trim();
    }

    if (image.photographer_name) {
      imageProps['data-photographer'] = image.photographer_name;
    }

    return <img className='event-list__event-image' alt='' {...imageProps} />
  }

  const image = images?.find(image => image.url);
  const isRemote = location && location.id === INTERNET_EXCEPTION;

  return (
    <div className='event-list__event'>
      <div className='event-list__image-container'>
        <div className='event-list__tags event-list__tags--mobile' role='region' aria-label={Drupal.t('Event keywords')}>
          {getKeywords()}
        </div>
        {image ? imageToElement(image) : <div className='event-list__event-image-placeholder' dangerouslySetInnerHTML={{ __html: imagePlaceholder.trim() }} />}
      </div>
      <div className='event-list__content-container'>
        <h3 className='event-list__event-name'>
          <a className='event-list__event-link' href={`${baseUrl}/events/${id}`} aria-label={Drupal.t('Link leads to external service', [], { context: 'Explanation for screen-reader software that the icon visible next to this link means that the link leads to an external service.' })}>
            {name[currentLanguage]}
          </a>
        </h3>
        <div className='event__content event__content--date'>
          {getDate()}
        </div>
        {location &&
          <div className='event__content event__content--location'>
            {isRemote ? 'Internet' : getLocation()}
          </div>
        }
        <div className='event__lower-container'>
          <div className='event-list__tags event-list__tags--desktop' role='region' aria-label={Drupal.t('Event keywords')}>{getKeywords()}</div>
          <div className='event-list__indicator-container'><span className='event-list__event-link-indicator'></span></div>
        </div>
      </div>
    </div>
  );
}

export default ResultCard;
