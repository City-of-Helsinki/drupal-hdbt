import { TextInput } from 'hds-react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import ApiKeys from '../enum/ApiKeys';
import SearchComponents from '../enum/SearchComponents';
import { useScopedId } from '../hooks/useScopedId';
import { initialParamsAtom, searchKeywordAtom, updateParamsAtom } from '../store';

export const SearchBar = () => {
  const [value, setValue] = useAtom(searchKeywordAtom);
  const updateParams = useSetAtom(updateParamsAtom);
  const initialParams = useAtomValue(initialParamsAtom);
  const searchBarId = useScopedId(SearchComponents.SEARCH_BAR);

  // Bail if conflicting paremeter is set.
  if (initialParams.has(ApiKeys.FULL_TEXT)) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setValue(next);
    updateParams({
      [ApiKeys.FULL_TEXT]: next || undefined,
      [ApiKeys.FULL_TEXT_LANGUAGE]: next ? 'fi,en,sv' : undefined,
    });
  };

  return (
    <TextInput
      id={searchBarId}
      className='hdbt-search__filter'
      label={Drupal.t('Search term', {}, { context: 'Search keyword label' })}
      onChange={handleChange}
      value={value}
    />
  );
};
