import { ForwardedRef, forwardRef } from 'react';

type ResultsHeadingProps = {
  choices: boolean;
  total: number;
}

const ResultsHeading = forwardRef((props: ResultsHeadingProps, ref: ForwardedRef<HTMLDivElement>) => {
  const { choices, total } = props;

  const heading = choices ?
    `${Drupal.t('News based on your choices', {}, {context: 'News archive heading'})  } (${total})` :
    Drupal.t('All news items', {}, {context: 'News archive heading'});

  return (
    <div className='news-archive__heading' ref={ref}>
      <h2 className='news-archive__title'>
        {heading}
      </h2>
    </div>
  );
});

export default ResultsHeading;
