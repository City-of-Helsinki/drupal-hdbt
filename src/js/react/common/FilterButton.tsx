import { MouseEventHandler } from 'react';
import { Button, IconCross } from 'hds-react';

type FilterButtonProps = {
  value: string;
  clearSelection: MouseEventHandler<HTMLButtonElement>;
};

const FilterButton = ({ value, clearSelection }: FilterButtonProps) => (
  <li
    className='content-tags__tags__tag content-tags__tags--interactive'
    key={`${value.toString()}`}
  >
    <Button
      aria-label={Drupal.t(
        'Remove @item from search results',
        { '@item': value.toString() },
        { context: 'Search: remove item aria label' }
      )}
      className='hdbt-search__remove-selection-button'
      iconRight={<IconCross className='hdbt-search__remove-selection-icon' />}
      variant='supplementary'
      onClick={clearSelection}
    >
      {value}
    </Button>
  </li>
);

export default FilterButton;
