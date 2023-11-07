import parse from 'html-react-parser';

import type MetadataType from '@/types/MetadataType';
import type TagType from '@/types/TagType';
import Tags from './Tags';
import Icon from './Icon';

const Metarow = ({ icon, label, content, langAttribute } : MetadataType) => (
  <div className="card__meta">
    <span className="card__meta__icon"><Icon icon={icon} /></span>
    <span className="card__meta__label">{label}: </span>
    <span className="card__meta__content" {...langAttribute}>{content}</span>
  </div>
);

export type CardItemProps = {
  cardModifierClass: string;
  cardImage?: string | JSX.Element | JSX.Element[];
  cardTitle: string | JSX.Element;
  cardTitleLevel?: 2 | 3 | 4 | 5 | 6; // Allow only heading levels 2-6, defaults to 3
  cardUrl: string;
  cardUrlExternal?: boolean;
  cardCategoryTag?: TagType;
  cardDescription?: string;
  cardDescriptionHtml?: boolean;
  cardHelptext?: string;
  cardHelptextHtml?: boolean;
  cardTags?: Array<TagType>;
  location?: string | JSX.Element;
  locationLabel?: string;
  date?: string;
  dateLabel?: string;
  daterange?: string | JSX.Element;
  dateRangeLabel?: string;
  theme?: string;
  themeLabel?: string;
  langAttribute?: any;
  language?: string;
  languageLabel?: string;
  time?: string;
  timeLabel?: string;
};

function CardItem({
  cardModifierClass,
  cardImage,
  cardTitle,
  cardTitleLevel,
  cardUrl,
  cardUrlExternal=false,
  cardCategoryTag,
  cardDescription,
  cardDescriptionHtml,
  cardHelptext,
  cardHelptextHtml,
  cardTags,
  location,
  locationLabel,
  date,
  dateLabel,
  theme,
  themeLabel,
  daterange,
  dateRangeLabel,
  langAttribute,
  language,
  languageLabel,
  time,
  timeLabel,
}: CardItemProps): JSX.Element {
  const cardClass = `card ${cardModifierClass} ${cardUrlExternal ? 'card--external' : ''}`;
  const HeadingTag = cardTitleLevel ? `h${cardTitleLevel}` as keyof JSX.IntrinsicElements : 'h3';

  return (
    <div className={cardClass}>
      {cardImage &&
        <div className="card__image">
          { cardImage }
        </div>
      }

      <div className="card__text">
        <HeadingTag className="card__title" {...langAttribute}>
          <a href={cardUrl} className="card__link" {...cardUrlExternal && { 'data-is-external': 'true' }} rel="bookmark">
            <span>{ cardTitle }</span>
            {cardUrlExternal &&
              <span className="link__type link__type--external" aria-label={`(${Drupal.t(
                'Link leads to external service',
                {},
                { context: 'Explanation for screen-reader software that the icon visible next to this link means that the link leads to an external service.' },
              )})`} />
            }
          </a>
        </HeadingTag>
        {cardCategoryTag &&
          <div className="card__category">
            <Tags tags={[cardCategoryTag]} />
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

        <div className="card__metas">
          {location &&
            <Metarow icon="location" label={locationLabel || Drupal.t('Location')} content={location} />
          }
          {date &&
            <Metarow icon="clock" label={dateLabel || Drupal.t('Date')} content={date} />
          }
          {daterange &&
            <Metarow icon="calendar" label={dateRangeLabel|| Drupal.t('Estimated schedule')} content={daterange} langAttribute={langAttribute} />
          }
          {theme &&
            <Metarow icon="locate" label={themeLabel || Drupal.t('Theme')} content={theme} />
          }
          {language &&
            <Metarow icon="globe" label={languageLabel || Drupal.t('Language')} content={language} />
          }
          {time &&
            <Metarow icon="calendar" label={timeLabel || Drupal.t('Time', { context: 'Time of event' })} content={time} />
          }
        </div>

        {cardTags &&
          <div className="card__tags">
            <Tags tags={cardTags} langAttribute={langAttribute} />
          </div>
        }
      </div>
    </div>
  );
}

export default CardItem;
