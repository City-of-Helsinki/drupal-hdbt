import { useAtomValue, useSetAtom } from 'jotai';
import { titleAtom, updateUrlAtom } from '../../../store';
import { SearchBar } from '../components/SearchBar';

export const CrossStudiesFormContainer = () => {
  const eventListTitle = useAtomValue(titleAtom);
  const updateUrl = useSetAtom(updateUrlAtom);

  const onSubmit = () => {
    updateUrl();
  }; 

  const heading = Drupal.t('Search for online and distance studies in general upper secondary schools', {}, { context: 'Cross-institutional studies: form heading' });

  return (
    <form
      className='hdbt-search--react__form-container'
      role='search' 
    >
      <h2 className='event-list__filter-title'>{heading}</h2>
      <div className='event-form__filters-container'>
        <SearchBar />
      </div>
    </form>
  )
}
