import { useSetAtom } from 'jotai';
import { Button, Checkbox, TextInput } from 'hds-react';
import { useState } from 'react';
import { paramsAtom } from '../store';
import type SearchParams from '../types/SearchParams';

type SubmitFormType = HTMLFormElement & {
  keyword: HTMLInputElement;
  finnish_education: HTMLInputElement;
  grades_1_6: HTMLInputElement;
  swedish_education: HTMLInputElement;
  grades_7_9: HTMLInputElement;
};

const FeatureFormContainer = () => {
  const [keywordValue, setKeywordValue] = useState<string|undefined>();
  const [fiChecked, setFiChecked] = useState<boolean>(false);
  const [seChecked, setSeChecked] = useState<boolean>(false);
  const [lowerChecked, setLowerChecked] = useState<boolean>(false);
  const [upperChecked, setUpperChecked] = useState<boolean>(false);
  const setParams = useSetAtom(paramsAtom);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { keyword, finnish_education, grades_1_6, swedish_education, grades_7_9 } = event.target as SubmitFormType;
    // TS doesn't support constructing from FormData, use any type as workaround
    const query = new URLSearchParams(new FormData(event.currentTarget) as any).toString();
    const params: SearchParams = {
      query
    };

    if (keyword.value && keyword.value.length) {
      params.keyword = keyword.value;
    };

    [finnish_education, grades_1_6, swedish_education, grades_7_9].forEach(element => {
      if (!element || !element.checked || !element.name) {
        return;
      };

      const name = element.name as keyof Omit<SearchParams, 'keyword'|'page'|'query'>;
      params[name] = true;
    });

    setParams(params);
  };

  return (
    <form className='react-search__form-container' onSubmit={onSubmit}>
      <h3>
        {Drupal.t('Search by school features')}
      </h3>
      <p className='react-search__form-description'>
        {Drupal.t(
          'You can search schools by name, language, level, or postal code. Students may be accepted into schools outside of their own district if there\'s room. Note that some schools require passing an exam.',
          {},
          {context: 'Feature search description'}
        )}
      </p>
      <TextInput
        className='hdbt-search__filter'
        id='keyword'
        label={Drupal.t('School name or postal code')}
        name='keyword'
        onChange={({target: { value }}: { target: { value: string }}) => setKeywordValue(value)}
        type='search'
        value={keywordValue}
      />
      <div className='react-search__checkbox-filter-container'>
        <fieldset className='react-search__fieldset'>
          <legend className='react-search__legend'>
            {Drupal.t('Education language')}
          </legend>
          <Checkbox
            className='react-search__checkbox'
            checked={fiChecked}
            id='finnish_education'
            label={Drupal.t('Finnish')}
            name='finnish_education'
            onClick={() => setFiChecked(!fiChecked)}
            value={fiChecked.toString()}
          />
          <Checkbox
            className='react-search__checkbox'
            checked={seChecked}
            id='swedish_education'
            label={Drupal.t('Swedish')}
            name='swedish_education'
            onClick={() => setSeChecked(!seChecked)}
            value={seChecked.toString()}
          />
        </fieldset>
        <fieldset className='react-search__fieldset'>
          <legend className='react-search__legend'>
            {Drupal.t('Education level')}
          </legend>
          <Checkbox
            className='react-search__checkbox'
            checked={lowerChecked}
            id='grades_1_6'
            label={Drupal.t('Lower levels (1-6)')}
            name='grades_1_6'
            onClick={() => setLowerChecked(!lowerChecked)}
            value={lowerChecked.toString()}
          />
          <Checkbox
            className='react-search__checkbox'
            checked={upperChecked}
            id='grades_7_9'
            label={Drupal.t('Upper levels (7-9)')}
            name='grades_7_9'
            onClick={() => setUpperChecked(!upperChecked)}
            value={upperChecked.toString()}
          />
        </fieldset>
      </div>
      <Button className='hdbt-search__submit-button' type='submit'>{Drupal.t('Submit')}</Button>
    </form>
  );
};

export default FeatureFormContainer;
