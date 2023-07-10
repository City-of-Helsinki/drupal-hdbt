import { Select } from 'hds-react';
import useInitialQuery from '../hooks/useInitialQuery';
import useIndexQuery from '../hooks/useIndexQuery';
import IndexFields from '../enum/IndexFields';
import AggregationItem from '../types/AggregationItem';

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
  const initialQuery = useInitialQuery();
  const { data } = useIndexQuery(initialQuery, true);
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

  return (
    <form className='news-form'>
      <h2>{Drupal.t('Filter news items', {}, {context: 'News archive filter results heading'})}</h2>
      <div className='news-form__filters-container'>
        {topicOptions && <Select
          className='news-form__filter'
          clearable
          clearButtonAriaLabel={Drupal.t('Clear selection')}
          label={Drupal.t('Topics', {}, { context: 'News archive topics label' })}
          placeholder={Drupal.t('All topics', {}, { context: 'News archive topics placeholder' })}
          options={topicOptions}
          multiselect
          selectedItemRemoveButtonAriaLabel={Drupal.t('Remove item')}
        />}
        {neighbourhoodOptions && <Select
          className='news-form__filter'
          clearable
          clearButtonAriaLabel={Drupal.t('Clear selection')}
          label={Drupal.t('Topics', {}, { context: 'News archive topics label' })}
          placeholder={Drupal.t('All topics', {}, { context: 'News archive topics placeholder' })}
          options={neighbourhoodOptions}
          multiselect
          selectedItemRemoveButtonAriaLabel={Drupal.t('Remove item')}
        />}
        {groupOptions && <Select
          className='news-form__filter'
          clearable
          clearButtonAriaLabel={Drupal.t('Clear selection')}
          label={Drupal.t('Topics', {}, { context: 'News archive topics label' })}
          placeholder={Drupal.t('All topics', {}, { context: 'News archive topics placeholder' })}
          options={groupOptions}
          multiselect
          selectedItemRemoveButtonAriaLabel={Drupal.t('Remove item')}
        />}
      </div>
    </form>
  );
};

export default FormContainer;
