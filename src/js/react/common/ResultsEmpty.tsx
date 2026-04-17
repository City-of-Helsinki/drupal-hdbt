import { type ForwardedRef, forwardRef, type ReactElement, type ReactNode } from 'react';
import ResultsHeader from '@/react/common/ResultsHeader';

type ResultsEmptyProps = {
  wrapperClass?: string;
  leftActions?: ReactElement;
  additionalDescription?: string;
  resultText?: string;
  children?: ReactNode;
};

const ResultsEmpty = forwardRef(
  (
    {
      wrapperClass = 'react-search__results',
      leftActions,
      additionalDescription,
      resultText,
      children,
    }: ResultsEmptyProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => (
    <div className={wrapperClass}>
      <ResultsHeader
        resultText={resultText ?? Drupal.t('No results', {}, { context: 'Unit search no results title' })}
        ref={ref}
        leftActions={leftActions}
      />
      <p>
        {Drupal.t(
          'No results were found for the criteria you entered. Try changing your search criteria.',
          {},
          { context: 'React search: no search results' },
        )}
      </p>
      {additionalDescription && <p>{additionalDescription}</p>}
      {children}
    </div>
  ),
);

export default ResultsEmpty;
