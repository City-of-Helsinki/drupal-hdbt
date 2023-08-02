import { useAtomValue } from 'jotai';
import SimpleResultsContainer from './SimpleResultsContainer';
import PromotedResultsContainer from './PromotedResultsContainer';
import { configurationsAtom } from '../store';

const ResultsContainer = () => {
  const { promoted } = useAtomValue(configurationsAtom);

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

  return promoted?.length ?
    <PromotedResultsContainer /> :
    <SimpleResultsContainer />;
};

export default ResultsContainer;
