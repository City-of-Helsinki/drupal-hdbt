import { FormEvent } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';

import LocationFilter from '../components/LocationFilter';
import ApiKeys from '../enum/ApiKeys';
import SubmitButton from '../components/SubmitButton';
import DateSelect from '../components/DateSelect';
import CheckboxFilter from '../components/CheckboxFilter';
import SelectionsContainer from './SelectionsContainer';
import {
  settingsAtom,
  urlAtom,
  titleAtom,
  freeFilterAtom,
  remoteFilterAtom,
  formErrorsAtom,
  updateUrlAtom,
} from '../store';
import TopicsFilter from '../components/TopicsFilter';
import AddressSearch from '../components/AddressSearch';
import FullTopicsFilter from '../components/FullTopicsFilter';


function FormContainer() {
  const filterSettings = useAtomValue(settingsAtom);
  const eventListTitle = useAtomValue(titleAtom);
  const errors = useAtomValue(formErrorsAtom);
  const url = useAtomValue(urlAtom);
  const updateUrl = useSetAtom(updateUrlAtom);
  const {
    showFreeFilter,
    showLocation,
    showRemoteFilter,
    showTimeFilter,
    showTopicsFilter,
    useFullTopicsFilter,
    useLocationSearch,
  } = filterSettings;

  const onSubmit = () => {
    updateUrl();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
    return false;
  };

  const bothCheckboxes = showFreeFilter && showRemoteFilter;
  const showOnlyLabel = Drupal.t('Show only', {}, { context: 'Events search: event type prefix' });
  const freeTranslation = Drupal.t('Free-of-charge events', {}, { context: 'Events search' });
  const remoteTranslation = Drupal.t('Remote events', {}, { context: 'Events search' });
  const freeLabel = bothCheckboxes ? freeTranslation : `${showOnlyLabel} ${freeTranslation.toLowerCase()}`;
  const remoteLabel = bothCheckboxes ? remoteTranslation : `${showOnlyLabel} ${remoteTranslation.toLowerCase()}`;

  const showForm = showLocation || showFreeFilter || showTimeFilter || showRemoteFilter || showTopicsFilter;
  const HeadingTag = eventListTitle ? 'h3' : 'h2';

  if (!showForm) {
    return null;
  }

  return (
    <form className='hdbt-search--react__form-container' role='search' onSubmit={handleSubmit}>
      <HeadingTag className='event-list__filter-title'>{Drupal.t('Filter events', {}, { context: 'Events search: search form title' })}</HeadingTag>
      <div className='event-form__filters-container'>
        {useLocationSearch &&
         <div className='event-form__filter-section-container'>
            <AddressSearch />
          </div>
        }
        <div className='event-form__filter-section-container'>
          {
            showTopicsFilter &&
            <TopicsFilter />
          }
          {
            (!showTopicsFilter && useFullTopicsFilter) &&
            <FullTopicsFilter />
          }
          {
            showLocation &&
            <LocationFilter />
          }
          {
            showTimeFilter &&
            <DateSelect />
          }
        </div>
        {
          bothCheckboxes &&
          <div className='event-form__checkboxes-label'>{showOnlyLabel}</div>
        }
        <div className='event-form__filter-checkbox-container'>
          {
            showRemoteFilter &&
              <CheckboxFilter
                id='remote-toggle'
                label={remoteLabel}
                atom={remoteFilterAtom}
                valueKey={ApiKeys.REMOTE}
              />
          }
          {
            showFreeFilter &&
              <CheckboxFilter
                id='free-toggle'
                label={freeLabel}
                atom={freeFilterAtom}
                valueKey={ApiKeys.FREE}
              />
          }
        </div>
        <SubmitButton disabled={errors.invalidEndDate || errors.invalidStartDate} />
        <SelectionsContainer url={url} />
      </div>
    </form>
  );
}

export default FormContainer;
