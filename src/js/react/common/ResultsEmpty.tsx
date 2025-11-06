import { type ForwardedRef, forwardRef } from 'react';
import ResultsHeader from '@/react/common/ResultsHeader';

type ResultsEmptyProps = {
  title?: string;
  content?: string;
  wrapperClass?: string;
};

const ResultsEmpty = forwardRef(
  (
    // biome-ignore lint/correctness/noUnusedFunctionParameters: @todo UHF-12066
    { title, content, wrapperClass = 'react-search__results' }: ResultsEmptyProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => (
    <div className={wrapperClass}>
      <ResultsHeader
        // biome-ignore lint/complexity/noUselessFragments: @todo UHF-12066
        resultText={<>{Drupal.t('No results', {}, { context: 'Unit search no results title' })}</>}
        ref={ref}
      />
      <p>
        {Drupal.t(
          'No results were found for the criteria you entered. Try changing your search criteria.',
          {},
          { context: 'React search: no search results' },
        )}
      </p>
    </div>
  ),
);

export default ResultsEmpty;
