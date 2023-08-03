type ResultsHeadingProps = {
  choices: boolean;
  total: number;
}

const ResultsHeading = ({ choices, total }: ResultsHeadingProps) => {
  const heading = choices ?
    `${Drupal.t('News based on your choices', {}, {context: 'News archive heading'})  } (${total})` :
    Drupal.t('All news items', {}, {context: 'News archive heading'});

  return (
    <div className='news-archive__heading'>
      <h2 className='news-archive__title'>
        {heading}
      </h2>
    </div>
  );
};

export default ResultsHeading;
