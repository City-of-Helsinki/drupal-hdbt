import { CSSProperties, MouseEventHandler } from 'react';
import { Tag, TagSize } from 'hds-react';

type FilterButtonProps = {
  value: string;
  clearSelection: MouseEventHandler<HTMLButtonElement>;
};

const FilterButton = ({ value, clearSelection }: FilterButtonProps) => (
  <li
    className='content-tags__tags__tag content-tags__tags--interactive'
    key={`${value.toString()}`}
  >
    <Tag
      className='hdbt-search__remove-selection-button'
      /* @todo UHF-11117 Check if this works after react is updated */
      /* @ts-ignore */
      onDelete={clearSelection}
      size={TagSize.Large}
      aria-label={Drupal.t(
        'Remove @item from search results',
        { '@item': value.toString() },
        { context: 'Search: remove item aria label' }
      )}
      style={{
        '--background-color-hover': 'var(--hdbt-color-black)',
        '--background-color': 'var(--background-color-disabled)',
        '--border-color-focus': 'var(--hdbt-color-black)',
        '--border-color-hover': 'var(--hdbt-color-black)',
        '--color-focus': 'var(--hdbt-color-black)',
        '--color-hover': 'var(--color-white)',
        '--outline-color': 'var(--hdbt-color-black)',
        '--outline-color-hover': 'var(--hdbt-color-black)',
      } as CSSProperties }
      >
      {value}
    </Tag>
  </li>
);

export default FilterButton;
