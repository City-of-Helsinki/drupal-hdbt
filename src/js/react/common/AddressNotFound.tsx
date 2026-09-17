import { type ForwardedRef, forwardRef } from 'react';
import { type AddressSearchErrorType, getAddressSearchResultsText } from './helpers/addressSearchError';

type AddressMessageProps = { title: string; hint: string };

const AddressMessage = forwardRef(({ title, hint }: AddressMessageProps, ref: ForwardedRef<HTMLHeadingElement>) => (
  <div>
    <div className='hdbt-search--react__result-top-area'>
      <h3 className='hdbt-search--react__results--title' ref={ref}>
        {title}
      </h3>
    </div>
    <div>
      <span>{hint}</span>
    </div>
  </div>
));

export const AddressNotFound = forwardRef((_props, ref: ForwardedRef<HTMLHeadingElement>) => (
  <AddressMessage {...getAddressSearchResultsText('not-found')} ref={ref} />
));

export const AddressSearchError = forwardRef(
  ({ type }: { type: AddressSearchErrorType }, ref: ForwardedRef<HTMLHeadingElement>) => (
    <AddressMessage {...getAddressSearchResultsText(type)} ref={ref} />
  ),
);
