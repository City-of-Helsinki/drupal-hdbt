import { Tag, TagSize } from 'hds-react';
import type { CSSProperties, MouseEventHandler } from 'react';

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
      /* @ts-expect-error */
      onDelete={clearSelection}
      size={TagSize.Large}
      aria-label={Drupal.t(
        'Remove @item from search results',
        { '@item': value.toString() },
        { context: 'Search: remove item aria label' },
      )}
      style={
        {
          '--background-color-hover': 'var(--color-black-20)',
          '--background-color': 'var(--color-black-10)',
          '--border-color-focus': 'var(--color-black-90)',
          '--border-color-hover': 'var(--color-black-90)',
          '--color-focus': 'var(--hdbt-color-black)',
          '--color-hover': 'var(--hdbt-color-black)',
          '--outline-color': 'var(--color-black-90)',
          '--outline-color-hover': 'var(--color-black-90)',
        } as CSSProperties
      }
    >
      {value}
    </Tag>
  </li>
);

export default FilterButton;
