import { TextInput } from 'hds-react';
import { useAtom, useSetAtom } from 'jotai';
import ApiKeys from '../enum/ApiKeys';
import SearchComponents from '../enum/SearchComponents';
import { searchKeywordAtom, updateParamsAtom } from '../store';

export const SearchBar = () => {
  const [value, setValue] = useAtom(searchKeywordAtom);
  const updateParams = useSetAtom(updateParamsAtom);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setValue(next);
    updateParams({
      [ApiKeys.FULL_TEXT]: next || undefined,
      [ApiKeys.FULL_TEXT_LANGUAGE]: next ? 'fi,en,sv' : undefined,
    });
  };

  return <TextInput id={SearchComponents.SEARCH_BAR} value={value} onChange={handleChange} />;
};
