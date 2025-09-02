import React from 'react';
import { Tag } from 'hds-react';
import type TagType from '@/types/TagType';

interface TagsProps {
  tags: Array<TagType>;
  isInteractive?: boolean;
  langAttribute?: any;
  insideCard?: boolean;
}

export function Tags({ tags, isInteractive, langAttribute, insideCard }: TagsProps): JSX.Element {
  const typeClass = isInteractive ? 'content-tags__tags--interactive' : 'content-tags__tags--static';

  // When inside a card, use a div instead of a section to avoid duplicating the aria-label description on each card.
  const Element = insideCard ? 'div' : 'section';

  return React.createElement(
    Element,
    {
      className: 'content-tags content-tags--card',
      'aria-label': Drupal.t('Tags', {}, { context: 'Label for screen reader software users explaining that this is a list of tags related to this page.' }),
      role: insideCard ? 'group' : undefined, // When inside a card, use role="group" to group the tags together.
    },
    <ul className={`content-tags__tags ${typeClass}`}>
      {tags.map((item: TagType, key: number) => (
        <li key={`{item.tag}-${key}`} className="content-tags__tags__tag" {...langAttribute}>
          {/* @todo UHF-11117 Check if this works after react is updated */}
          {/* @ts-ignore */}
          <Tag
            className={`${item.color ? `content-tags__tags__tag--${item.color}` : ''}`}
            {...(item.icon && { iconStart: item.icon })}
          >
            {item.tag}
          </Tag>
        </li>
      ),
      )}
    </ul>
  );
}

export default Tags;
