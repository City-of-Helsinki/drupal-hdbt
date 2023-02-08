import { TextInput } from 'hds-react';
import { useSetAtom } from 'jotai';
import { SyntheticEvent } from 'react';
import { paramsAtom, updateParamsAtom } from '../store';
import SearchParams from '../types/SearchParams';

type SubmitFormType = HTMLFormElement & {
  keyword: HTMLInputElement;
};

const FormContainer = () => {
  const setParams = useSetAtom(updateParamsAtom);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { keyword } = event.target as SubmitFormType;
    const params: SearchParams = {};

    if (keyword.value && keyword.value.length) {
      params.keyword = keyword.value;
    }

    setParams(params);
  };

  return (
    <form onSubmit={onSubmit}>
      <TextInput id='keyword'/>
      <button type='submit'>{Drupal.t('Submit')}</button>
    </form>
  );
};

export default FormContainer;
