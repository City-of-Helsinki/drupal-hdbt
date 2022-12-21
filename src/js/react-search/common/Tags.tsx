import type TagType from '@/types/TagType';

interface TagsProps {
  tags: Array<TagType>;
  isInteractive?: boolean;
}

export function Tags(props: TagsProps): JSX.Element {
  const {
    tags,
    isInteractive,
  } = props;

  const typeClass = isInteractive ? 'content-tags__tags--interactive' : 'content-tags__tags--static';

  return (
    <section
      className="content-tags"
      aria-label={
        Drupal.t('Tags', {}, { context: 'Label for screen reader software users explaining that this is a list of tags related to this page.' })
      }>
      <ul className={`content-tags__tags ${typeClass}`}>
        {tags.map((item:TagType, key:number) => (
            <li key={ key } className={`content-tags__tags__tag ${ item.color ? `content-tags__tags__tag--${item.color}` : '' }`}>
              <span>{ item.tag }</span>
            </li>
        ),
        )}
      </ul>
    </section>
  );
}

export default Tags;
