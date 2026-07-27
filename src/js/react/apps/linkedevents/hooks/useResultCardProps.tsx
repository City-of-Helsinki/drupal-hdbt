import { useAtomValue } from 'jotai';
import { Metarow } from '@/react/common/Card';
import { htmlToReact } from '@/react/common/helpers/htmlToReact';
import { hobbiesPublicUrl, settingsAtom } from '../store';
import type { Event, EventImage } from '../types/Event';

const INTERNET_EXCEPTION = 'helsinki:internet';

// Source sets mirror responsive_image.styles.card and responsive_image.styles.card_teaser.
// Each style name must be present in helfi_etusivu's LinkedEventsImageController::IMAGE_STYLES_ALLOWED.
type ImageSource = { media: string; style1x: string; style2x: string };

const CARD_SOURCES: ImageSource[] = [
  { media: 'all and (min-width: 1248px)', style1x: '1_5_304w_203h', style2x: '1_5_608w_406w_lq' },
  { media: 'all and (min-width: 992px)', style1x: '1_5_294w_196h', style2x: '1_5_588w_392h_lq' },
  { media: 'all and (min-width: 768px)', style1x: '1_5_220w_147h', style2x: '1_5_440w_294h_lq' },
  { media: 'all and (min-width: 576px)', style1x: '1_5_176w_118h', style2x: '1_5_352w_236h_lq' },
  { media: 'all and (min-width: 320px)', style1x: '1_5_511w_341h', style2x: '1_5_1022w_682h_lq' },
];
const CARD_FALLBACK_STYLE = '1_5_304w_203h';

const CARD_TEASER_SOURCES: ImageSource[] = [
  { media: 'all and (min-width: 1248px)', style1x: '1_5_405w_270h', style2x: '1_5_810w_540h_lq' },
  { media: 'all and (min-width: 992px)', style1x: '1_5_378w_252h', style2x: '1_5_756w_504h_lq' },
  { media: 'all and (min-width: 576px)', style1x: '1_5_294w_196h', style2x: '1_5_588w_392h_lq' },
  { media: 'all and (min-width: 320px)', style1x: '1_5_217w_145h', style2x: '1_5_434w_290h_lq' },
];
const CARD_TEASER_FALLBACK_STYLE = '1_5_378w_252h';
const overDayApart = (start: Date, end: Date) => start.toDateString() !== end.toDateString();

const pad = (value: number) => String(value).padStart(2, '0');

const toDatetimeAttr = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;

const formatStartDate = (start: Date, end: Date) => {
  if (start.getFullYear() === end.getFullYear()) {
    if (start.getMonth() === end.getMonth()) {
      return `${start.getDate()}.`;
    }

    // The getMonth function returns a zero-based index, so we need to add 1 to get the correct month.
    return `${start.getDate()}.${start.getMonth() + 1}.`;
  }

  return start.toLocaleDateString('fi-FI');
};

export const useResultCardProps = ({
  audience_max_age,
  audience_min_age,
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
  const { baseUrl, etusivuBaseUrl, imagePlaceholder } = drupalSettings.helfi_events;
  const { layout, useCrossInstitutionalStudiesForm } = useAtomValue(settingsAtom);

  const resolvedName = name?.[currentLanguage] || name?.fi || Object.values(name)[0] || '';

  const formatTime = (date: Date) => date.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' });

  const getDateParts = ({ withTimePrefix = true }: { withTimePrefix?: boolean } = {}) => {
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

    const timePrefix = withTimePrefix
      ? `, ${Drupal.t('at', {}, { context: 'Indication that events take place in a certain timeframe' })} `
      : ' ';
    const startContent = isMultiDate
      ? `${formatStartDate(startDate, endDate)}`
      : `${startDate.toLocaleDateString('fi-FI')}${timePrefix}${formatTime(startDate)}`;
    const endContent = isMultiDate ? endDate.toLocaleDateString('fi-FI') : formatTime(endDate);

    return { startDate, endDate, startContent, endContent };
  };

  const getDate = (): string => {
    const { startContent, endContent } = getDateParts();

    return `${startContent} - ${endContent}`;
  };

  const getJsxDate = (): JSX.Element => {
    const { startDate, endDate, startContent, endContent } = getDateParts({ withTimePrefix: false });

    return (
      <>
        <time dateTime={toDatetimeAttr(startDate)}>{startContent}</time>
        {' - '}
        <time dateTime={toDatetimeAttr(endDate)}>{endContent}</time>
      </>
    );
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

  const buildStyledUrl = (image: EventImage, style: string, time: string) => {
    const params = new URLSearchParams({ style, time });
    return `${etusivuBaseUrl}/fi/linked-events/image/${image.id}?${params.toString()}`;
  };

  const imageToElement = (image: EventImage): JSX.Element => {
    const { last_modified_time } = image;
    if (etusivuBaseUrl && last_modified_time) {
      const sources = layout === 'lifts' ? CARD_TEASER_SOURCES : CARD_SOURCES;
      const fallback = layout === 'lifts' ? CARD_TEASER_FALLBACK_STYLE : CARD_FALLBACK_STYLE;

      return (
        <picture>
          {sources.map(({ media, style1x, style2x }) => (
            <source
              key={media}
              media={media}
              srcSet={`${buildStyledUrl(image, style1x, last_modified_time)} 1x, ${buildStyledUrl(image, style2x, last_modified_time)} 2x`}
            />
          ))}
          <img
            alt=''
            src={buildStyledUrl(image, fallback, last_modified_time)}
            {...(image.photographer_name ? { 'data-photographer': image.photographer_name } : {})}
          />
        </picture>
      );
    }

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
      return <>{htmlToReact(imagePlaceholder)}</>;
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
        default:
          courseParam = 'cross-institutional-studies';
      }

      return `${baseUrl}/${resolvedLanguage}/${courseParam}/${id}`;
    }

    if (type_id && type_id === 'Course') {
      const type =
        ({ fi: 'kurssit', sv: 'kurser' } as Partial<Record<typeof currentLanguage, string>>)[currentLanguage] ??
        'courses';

      return `${hobbiesPublicUrl}/${currentLanguage}/${type}/${id}`;
    }

    const type =
      ({ fi: 'tapahtumat', sv: 'kurser' } as Partial<Record<typeof currentLanguage, string>>)[currentLanguage] ??
      'events';

    return `${baseUrl}/${currentLanguage}/${type}/${id}`;
  };

  const getPrice = (): string => {
    if (isFree || !offers?.length) {
      return Drupal.t('Free', {}, { context: 'Label for free events' });
    }

    const priced = offers.find(({ price }) => price?.[currentLanguage] || price?.fi);

    return (
      priced?.price?.[currentLanguage] ||
      priced?.price?.fi ||
      Drupal.t('Free', {}, { context: 'Label for free events' })
    );
  };

  const getAge = (): string | undefined => {
    if (audience_min_age == null && audience_max_age == null) {
      return;
    }

    if (audience_min_age != null && audience_max_age != null) {
      return Drupal.t(
        '@min–@max years old',
        { '@min': audience_min_age, '@max': audience_max_age },
        { context: 'Event audience age value' },
      );
    }

    if (audience_min_age != null) {
      return Drupal.t('@age year-olds and over', { '@age': audience_min_age }, { context: 'Event audience age value' });
    }

    return Drupal.t('@age year-olds and under', { '@age': audience_max_age }, { context: 'Event audience age value' });
  };

  const getCustomMetaRows = (): { bottom: JSX.Element[] } => {
    const bottom: JSX.Element[] = [];

    const age = getAge();
    if (age) {
      bottom.push(
        <Metarow
          key='age'
          icon='cake'
          label={Drupal.t('Age', {}, { context: 'Event audience age label' })}
          content={age}
        />,
      );
    }

    bottom.push(
      <Metarow
        key='price'
        icon='ticket'
        label={Drupal.t('Price', {}, { context: 'Event price label' })}
        content={getPrice()}
      />,
    );

    return { bottom };
  };

  return {
    cardCategoryTag: getCardCategoryTag(),
    cardImage: getImage(),
    cardTags: getCardTags(),
    cardTitle: resolvedName,
    cardUrl: getUrl(),
    customMetaRows: getCustomMetaRows(),
    location: isRemote ? 'Internet' : getLocation(),
    registrationRequired: getOffers(),
    signUp: getSignUp(),
    time: getDate(),
    jsxTime: getJsxDate(),
  };
};
