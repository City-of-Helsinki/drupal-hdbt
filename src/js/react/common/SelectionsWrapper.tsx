import { ReactNode, MouseEventHandler, Children } from 'react';
import type { DateTime } from 'luxon';
import {Button, ButtonVariant, IconCross} from 'hds-react';

type SelectionsWrapperProps = {
  showClearButton: string | number | boolean | true | DateTime | undefined;
  resetForm: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
};

const SelectionsWrapper = ({ showClearButton, resetForm, children }: SelectionsWrapperProps) =>
{
  // hasContent checks for string and react children if there would be any content to render and does not render the ul container if there is none
  const hasContent =
    typeof children === 'string'
      ? children.trim().length > 0
      : Children.toArray(children).some((child) => child !== false && child !== undefined);

  return (
    <div className='hdbt-search__selections-wrapper'>
      {hasContent && (
        <ul className='hdbt-search__selections-container content-tags__tags'>
          {children}
          <li className='hdbt-search__clear-all'>
            <Button
              aria-hidden={!showClearButton}
              className='hdbt-search__clear-all-button'
              iconStart={<IconCross className='hdbt-search__clear-all-icon' />}
              onClick={resetForm}
              style={showClearButton ? {} : { visibility: 'hidden' }}
              variant={ButtonVariant.Supplementary}
            >
              {Drupal.t('Clear selections', {}, { context: 'React search: clear selections' })}
            </Button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default SelectionsWrapper;
