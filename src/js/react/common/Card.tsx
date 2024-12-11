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
  cardModifierClass?: string;
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
  weightedEducation?: string;
  languageEducation?: string;
  registrationRequired?: boolean;
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
  weightedEducation,
  languageEducation,
  registrationRequired,
}: CardItemProps): JSX.Element {
  const cardClass = `
    card
    ${cardModifierClass ? ` ${cardModifierClass}` : ''}
    ${cardUrlExternal ? ' card--external' : ''}
  `;
  const HeadingTag = cardTitleLevel ? `h${cardTitleLevel}` as keyof JSX.IntrinsicElements : 'h3';

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

        <div className="card__metas">
          {location &&
            <Metarow icon="location" label={locationLabel || Drupal.t('Location', {}, { context: 'React search'})} content={location} />
          }
          {date &&
            <Metarow icon="clock" label={dateLabel || Drupal.t('Date', {}, { context: 'React search'})} content={date} />
          }
          {daterange &&
            <Metarow icon="calendar" label={dateRangeLabel|| Drupal.t('Estimated schedule', {}, { context: 'React search'})} content={daterange} langAttribute={langAttribute} />
          }
          {theme &&
            <Metarow icon="locate" label={themeLabel || Drupal.t('Theme', {}, { context: 'React search'})} content={theme} />
          }
          {weightedEducation &&
            <Metarow icon="layers" label={Drupal.t('Weighted curriculum education', {}, { context: 'TPR Ontologyword details schools' })} content={weightedEducation} />
          }
          {languageEducation &&
            <Metarow icon="group" label={Drupal.t('Language offering', {}, { context: 'TPR Ontologyword details schools' })} content={languageEducation} />
          }
          {language &&
            <Metarow icon="globe" label={languageLabel || Drupal.t('Language', {}, { context: 'React search'})} content={language} />
          }
          {time &&
            <Metarow icon="calendar" label={timeLabel || Drupal.t('Time', {}, { context: 'Time of event' })} content={time} />
          }
          {registrationRequired &&
            <Metarow icon="info-circle" label={Drupal.t('Additional information', {}, { context: 'Event additional information label' })} content={Drupal.t('The event requires registration or a ticket.', {}, { context: 'Event additional information value' })} />
          }
        </div>

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
