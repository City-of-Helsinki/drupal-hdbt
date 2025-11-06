import { type ForwardedRef, forwardRef } from 'react';

export const AddressNotFound = forwardRef((_props, ref: ForwardedRef<HTMLHeadingElement>) => (
  <div>
    <div className='hdbt-search--react__result-top-area'>
      <h3 className='hdbt-search--react__results--title' ref={ref}>
        {Drupal.t('No results for the address entered', {}, { context: 'React search: Address not found title' })}
      </h3>
    </div>
    <div>
      <span>
        {Drupal.t(
          'Make sure the address is written correctly. You can also search using a nearby street number.',
          {},
          { context: 'React search: Address not found hint' },
        )}
      </span>
    </div>
  </div>
));
