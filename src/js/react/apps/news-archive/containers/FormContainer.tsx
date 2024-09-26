import { useAtomValue, useSetAtom } from 'jotai';
import { SyntheticEvent } from 'react';
import {Button} from 'hds-react';
import useInitialQuery from '../hooks/useInitialQuery';
import useIndexQuery from '../hooks/useIndexQuery';
import IndexFields from '../enum/IndexFields';
import AggregationItem from '../types/AggregationItem';
import Filter from '../components/Filter';
import { stagedParamsAtom, urlUpdateAtom } from '../store';
import SelectionsContainer from './SelectionsContainer';

const parseAggData = (data: AggregationItem[]) => {
  if (!data.length) {
    return [];
  }

  return data.map(item => {
    const [name, tid] = item.key;

    return {
      label: name.toString(),
      value: tid.toString(),
    };
  });
};

const FormContainer = () => {
  const stagedParams = useAtomValue(stagedParamsAtom);
  const setParams = useSetAtom(urlUpdateAtom);
  const initialQuery = useInitialQuery();
  const { data, isLoading, isValidating } = useIndexQuery({
    query: initialQuery,
    multi: true,
    key: 'initialdata'
  });
  let topicOptions; let neighbourhoodOptions; let groupOptions;

  if (data?.responses) {
    const [topicData, neighbourhoodData, groupData] = data.responses;

    [
      topicData?.aggregations?.[IndexFields.FIELD_NEWS_ITEM_TAGS]?.buckets || [],
      neighbourhoodData?.aggregations?.[IndexFields.FIELD_NEWS_NEIGHBOURHOODS]?.buckets || [],
      groupData?.aggregations?.[IndexFields.FIELD_NEWS_GROUPS]?.buckets || []
    ].forEach((sourceData, index) => {
      const parsedData = parseAggData(sourceData);

      switch(index) {
        case 0:
          topicOptions = parsedData;
          break;
        case 1:
          neighbourhoodOptions = parsedData;
          break;
        case 2:
          groupOptions = parsedData;
          break;
        default:
          break;
      };
    });
  }

  const onSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setParams({...stagedParams, page: 1});
  };

  const loading = isLoading || isValidating;
  const topicLabel = Drupal.t('Topics', {}, { context: 'News archive topics label' });
  const neighbourhoodLabel = Drupal.t('City districts', {}, { context: 'News archive neighbourhoods label' });
  const groupLabel = Drupal.t('Target groups', {}, { context: 'News archive groups label' });

  return (
    <form className='hdbt-search--react__form-container' role='search' onSubmit={onSubmit}>
      <div className='hdbt-search--react__dropdown-filters'>
        {topicOptions && <Filter
          label={topicLabel}
          placeholder={Drupal.t('All topics', {}, {context: 'News archive topics placeholder'})}
          options={topicOptions}
          stateKey='topic'
        />}
        {neighbourhoodOptions && <Filter
          label={neighbourhoodLabel}
          placeholder={Drupal.t(
            'All city districts',
            {},
            {context: 'News archive neighbourhoods placeholder'}
          )}
          options={neighbourhoodOptions}
          stateKey='neighbourhoods'
        />}
        {groupOptions && <Filter
          label={groupLabel}
          placeholder={Drupal.t('All target groups', {}, {context: 'News archive groups placeholder'})}
          options={groupOptions}
          stateKey='groups'
        />}
      </div>
      <div className='hdbt-search--react__submit'>
        <Button
          className='hdbt-search--react__submit-button'
          type='submit'
          variant='primary'
          theme='black'
          disabled={loading}
        >
          {Drupal.t('Search', {}, {context: 'React search: submit button label'})}
        </Button>
      </div>
      <SelectionsContainer
        topic={topicOptions}
        neighbourhoods={neighbourhoodOptions}
        groups={groupOptions}
      />
    </form>
);
};

export default FormContainer;
