import { useAtom, useSetAtom } from "jotai";
import { searchKeywordAtom, updateParamsAtom } from "../store";
import { TextInput } from "hds-react";
import SearchComponents from "../enum/SearchComponents";

export const SearchBar = () => {
  const [value, setValue] = useAtom(searchKeywordAtom); 
  const updateParams = useSetAtom(updateParamsAtom);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    updateParams({
      [SearchComponents.SEARCH_BAR]: e.target.value,
    });
  };

  return <TextInput
    id={SearchComponents.SEARCH_BAR}
    value={value}
    onChange={handleChange}
  />;
};
