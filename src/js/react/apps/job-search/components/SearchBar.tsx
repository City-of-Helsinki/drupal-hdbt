import { TextInput } from 'hds-react';
import { useAtomValue, useSetAtom } from 'jotai';
import { defaultTextInputStyle } from '@/react/common/constants/textInputStyle';
import SearchComponents from '../enum/SearchComponents';
import { getKeywordAtom, setStateValueAtom } from '../store';

export const SearchBar = () => {
  const keyword = useAtomValue(getKeywordAtom);
  const setStateValue = useSetAtom(setStateValueAtom);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStateValue({ key: SearchComponents.KEYWORD, value: event.target.value.replace(/\s+/g, ' ') });
  };

  return (
    <TextInput
      className='job-search-form__filter'
      id={SearchComponents.KEYWORD}
      label={Drupal.t('Search term', {}, { context: 'Search keyword label' })}
      name={SearchComponents.KEYWORD}
      onChange={handleChange}
      placeholder={Drupal.t(
        'Eg. title, location, department',
        {},
        { context: 'HELfi Rekry job search keyword placeholder' },
      )}
      type='search'
      value={keyword}
      clearButtonAriaLabel={Drupal.t('Clear', {}, { context: 'React search' })}
      style={defaultTextInputStyle}
    />
  );
};
