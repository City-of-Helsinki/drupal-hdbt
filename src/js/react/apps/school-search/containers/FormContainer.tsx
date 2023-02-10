import { TextInput } from 'hds-react';
import { useSetAtom } from 'jotai';
import { SyntheticEvent } from 'react';
import { paramsAtom } from '../store';
import SearchParams from '../types/SearchParams';
import UseCoordinates from '../hooks/UseCoordinates';

type SubmitFormType = HTMLFormElement & {
  keyword: HTMLInputElement;
};

const FormContainer = () => {
  const setParams = useSetAtom(paramsAtom);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { keyword } = event.target as SubmitFormType;
    const params: SearchParams = {};

    if (keyword.value && keyword.value.length) {
      params.address = keyword.value;
    };

    setParams(params);
  };

  return (
    <form onSubmit={onSubmit}>
      <TextInput type='search' id='keyword'/>
      <button type='submit'>{Drupal.t('Submit')}</button>
    </form>
  );
};

export default FormContainer;
