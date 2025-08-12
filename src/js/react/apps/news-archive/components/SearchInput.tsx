import { TextInput } from 'hds-react';
import { useAtom } from 'jotai';
import { CSSProperties } from 'react';
import { stagedParamsAtom } from '../store';
import SearchComponents from '../enum/SearchComponents';

export const SearchInput = () => {
  const [params, setParams] = useAtom(stagedParamsAtom);

  return <TextInput
    className='hdbt-search__filter hdbt-search--react__text-field'
    id={SearchComponents.KEYWORD}
    label={Drupal.t('Search term', {}, {context: 'Search keyword label'})}
    onChange={(e) => setParams({
      ...params,
      [SearchComponents.KEYWORD]: e.target.value }
    )}
    placeholder={Drupal.t('For example, budget proposal', {}, {context: 'News archive: keyword placeholder'})}
    type='search'
    value={params?.keyword || ''}
    style={
      {
        '--color-focus-outline': 'var(--hdbt-color-black)',
      } as CSSProperties
    }
  />;
};
