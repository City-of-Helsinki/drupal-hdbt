import Tags from './Tags';
import Icon from './Icon';
import type  MetadataType from '@/types/MetadataType';
import type TagType from '@/types/TagType';

type CardItemProps = {
  cardModifierClass: string;
  cardImage?: object;
  cardTitle: string;
  cardTitleLevel?: 2 | 3 | 4 | 5 | 6; // Allow only heading levels 2-6, defaults to 3
  cardUrl: string;
  cardUrlExternal?: boolean;
  cardCategoryTag?: TagType;
  cardDescription?: string;
  cardDescriptionHtml?: boolean;
  cardHelptext?: string;
  cardHelptextHtml?: boolean;
  cardMetas?: Array<MetadataType>;
  cardTags?: Array<TagType>;
};

export function CardItem(props: CardItemProps): JSX.Element {
  const {
    cardModifierClass,
    cardImage,
    cardTitle,
    cardTitleLevel,
    cardUrl,
    cardUrlExternal,
    cardCategoryTag,
    cardDescription,
    cardDescriptionHtml,
    cardHelptext,
    cardHelptextHtml,
    cardMetas,
    cardTags,
  } = props;

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
        <HeadingTag className="card__title">
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
              { cardDescription }
              :
              <p>{ cardDescription }</p>
            }
          </div>
        }

        {cardHelptext &&
          <div className="card__description">
            { cardHelptextHtml ?
              { cardHelptext }
              :
              <p>{ cardHelptext }</p>
            }
          </div>
        }

        {cardMetas &&
          <div className="card__metas">
            {cardMetas.map((cardMeta, key) =>
              <div key={key} className="card__meta">
                <span className="card__meta__icon"><Icon icon={cardMeta.icon} /></span>
                <span className="card__meta__label">{cardMeta.label}: </span>
                <span className="card__meta__content">{cardMeta.content}</span>
              </div>,
            )}
          </div>
        }

        {cardTags &&
          <div className="card__tags">
            <Tags tags={cardTags} />
          </div>
        }

      </div>
    </div>
  );
}

export default CardItem;
