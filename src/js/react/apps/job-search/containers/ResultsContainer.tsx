import SimpleResultsContainer from './SimpleResultsContainer';
import PromotedResultsContainer from './PromotedResultsContainer';

const ResultsContainer = () => {
  const promoted = drupalSettings.helfi_rekry_job_search?.promoted_ids;

  // useEffect(() => {
  //   const el = document.getElementById('results-container');

  //   if (el && window.location.search) {
  //     const titleEl = el.querySelector<HTMLElement>('.job-listing-search__count-container');
  //     if (!titleEl) return;
  //     titleEl.setAttribute('tabindex', '0');
  //     titleEl.focus();
  //     el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  //     titleEl.setAttribute('tabindex', '-1');
  //   }
  // }, [data]);

  return promoted ?
    <PromotedResultsContainer promoted={promoted} /> :
    <SimpleResultsContainer />;
};

export default ResultsContainer;
