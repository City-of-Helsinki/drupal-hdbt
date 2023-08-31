import { ReactNode, MouseEventHandler } from 'react';
import { Button, IconCross } from 'hds-react';

type SelectionsWrapperProps = {
  showClearButton: string | number | true | undefined;
  resetForm: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
};

const SelectionsWrapper = ({ showClearButton, resetForm, children }: SelectionsWrapperProps) => (
  <div className='hdbt-search__selections-wrapper'>
    <ul className='hdbt-search__selections-container content-tags__tags'>
      {children}
      <li className='hdbt-search__clear-all'>
        <Button
          aria-hidden={!showClearButton}
          className='hdbt-search__clear-all-button'
          iconLeft={<IconCross className='hdbt-search__clear-all-icon' />}
          onClick={resetForm}
          style={showClearButton ? {} : { visibility: 'hidden' }}
          variant='supplementary'
        >
        {Drupal.t('Clear selections', {}, { context: 'React search: clear selections' })}
        </Button>
      </li>
    </ul>
  </div>
);

export default SelectionsWrapper;
