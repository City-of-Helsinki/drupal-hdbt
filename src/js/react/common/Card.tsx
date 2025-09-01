import parse from 'html-react-parser';

import type MetadataType from '@/types/MetadataType';
import type TagType from '@/types/TagType';
import Tags from './Tags';
import Icon from './Icon';
import ExternalLink from '@/react/common/ExternalLink';

const Metarow = ({ icon, label, content, langAttribute } : MetadataType) => (
  <div className="card__meta">
    <span className="card__meta__icon"><Icon icon={icon} /></span>
    <span className="card__meta__label">{label}: </span>
    <span className="card__meta__content" {...langAttribute}>{content}</span>
  </div>
);

export type CardItemProps = {
  cardCategoryTag?: TagType;
  cardDescription?: string;
  cardDescriptionHtml?: boolean;
  cardHelptext?: string;
  cardHelptextHtml?: boolean;
  cardImage?: string | JSX.Element | JSX.Element[];
  cardModifierClass?: string;
  cardTags?: Array<TagType>;
  cardTitle: string | JSX.Element;
  cardTitleLevel?: 2 | 3 | 4 | 5 | 6; // Allow only heading levels 2-6, defaults to 4
  cardUrl: string;
  cardUrlExternal?: boolean;
  cardMetas?: MetadataType[];
  date?: string;
  dateLabel?: string;
  daterange?: string | JSX.Element;
  dateRangeLabel?: string;
  distance?: string;
  langAttribute?: any;
  language?: string;
  languageEducation?: string;
  languageLabel?: string;
  location?: string | JSX.Element;
  locationLabel?: string;
  registrationRequired?: boolean;
  signUp?: string | JSX.Element;
  theme?: string;
  themeLabel?: string;
  time?: string;
  timeLabel?: string;
  weightedEducation?: string;
};

function CardItem({
  cardCategoryTag,
  cardDescription,
  cardDescriptionHtml,
  cardHelptext,
  cardHelptextHtml,
  cardImage,
  cardModifierClass,
  cardTags,
  cardTitle,
  cardTitleLevel,
  cardUrl,
  cardUrlExternal=false,
  cardMetas=[],
  date,
  dateLabel,
  daterange,
  dateRangeLabel,
  distance,
  langAttribute,
  language,
  languageEducation,
  languageLabel,
  location,
  locationLabel,
  registrationRequired,
  signUp,
  theme,
  themeLabel,
  time,
  timeLabel,
  weightedEducation,
}: CardItemProps): JSX.Element {
  const cardClass = [
    'card',
    cardModifierClass,
    cardUrlExternal && 'card--external',
  ].filter(Boolean).join(' ');
  const HeadingTag = cardTitleLevel ? `h${cardTitleLevel}` as keyof JSX.IntrinsicElements : 'h4';

  const metaRows = [
    location && {
      icon: 'location',
      label: locationLabel || Drupal.t('Location', {}, { context: 'React search' }),
      content: location,
    },
    distance && {
      icon: 'map',
      label: Drupal.t('Distance', {}, { context: 'React search' }),
      content: distance,
    },
    date && {
      icon: 'clock',
      label: dateLabel || Drupal.t('Date', {}, { context: 'React search'}),
      content: date,
    },
    daterange && {
      icon: 'calendar',
      label: dateRangeLabel|| Drupal.t('Estimated schedule', {}, { context: 'React search'}),
      content: daterange,
      langAttribute,
    },
    theme && {
      icon: 'locate',
      label: themeLabel || Drupal.t('Theme', {}, { context: 'React search'}),
      content: theme,
    },
    weightedEducation && {
      icon: 'layers',
      label: Drupal.t('Weighted curriculum education', {}, { context: 'TPR Ontologyword details schools' }),
      content: weightedEducation,
    },
    languageEducation && {
      icon: 'group',
      label: Drupal.t('Language offering', {}, { context: 'TPR Ontologyword details schools' }),
      content: languageEducation,
    },
    language && {
      icon: 'globe',
      label: languageLabel || Drupal.t('Language', {}, { context: 'React search'}),
      content: language,
    },
    time && {
      icon: 'calendar',
      label: timeLabel || Drupal.t('Time', {}, { context: 'Time of event' }),
      content: time,
    },
    signUp && {
      icon: 'bell',
      label: Drupal.t('Registration time', {}, {context: 'Event signup period'}),
      content: signUp,
      langAttribute,
    },
    registrationRequired && {
      icon: 'info-circle',
      label: Drupal.t('Additional information', {}, { context: 'Event additional information label' }),
      content: Drupal.t('The event requires registration or a ticket.', {}, { context: 'Event additional information value' }),
    },
    ...cardMetas,
  ].filter(Boolean) as MetadataType[];

  return (
    <div className={cardClass}>
      {cardImage &&
        <div className="card__image">
          { cardImage }
        </div>
      }

      <div className="card__text">
        <HeadingTag className="card__title">
          {!cardUrlExternal ? (
            <a href={cardUrl} className="card__link" rel="bookmark">{ cardTitle }</a>
          ) : (
            <ExternalLink href={cardUrl} title={cardTitle} className="card__link" rel="bookmark" />
          )}
        </HeadingTag>
        {cardCategoryTag &&
          <div className="card__category">
            <Tags tags={[cardCategoryTag]} insideCard />
          </div>
        }

        {cardDescription &&
          <div className="card__description">
            { cardDescriptionHtml ?
              parse(cardDescription)
              :
              <p {...langAttribute}>{ cardDescription }</p>
            }
          </div>
        }

        {cardHelptext &&
          <div className="card__helptext">
            { cardHelptextHtml ?
              parse(cardHelptext)
              :
              <p>{ cardHelptext }</p>
            }
          </div>
        }

        {metaRows.length > 0 && (
          <div className="card__metas">
            {metaRows.map((row, index) => (
              <Metarow
                key={index}
                icon={row.icon}
                label={row.label}
                content={row.content}
              />
            ))}
          </div>
        )}

        {cardTags && cardTags.length > 0 &&
          <div className="card__tags">
            <Tags tags={cardTags} langAttribute={langAttribute} insideCard />
          </div>
        }
      </div>
    </div>
  );
}

export default CardItem;
