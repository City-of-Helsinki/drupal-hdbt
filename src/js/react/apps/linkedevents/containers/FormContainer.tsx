import { FormEvent } from 'react';
import { useAtomValue, useSetAtom, useAtom } from 'jotai';
import LocationFilter from '../components/LocationFilter';
import ApiKeys from '../enum/ApiKeys';
import SubmitButton from '../components/SubmitButton';
import DateSelect from '../components/DateSelect';
import CheckboxFilter from '../components/CheckboxFilter';
import SelectionsContainer from './SelectionsContainer';
import {
  pageAtom,
  queryBuilderAtom,
  settingsAtom,
  urlAtom,
  titleAtom,
  freeFilterAtom,
  remoteFilterAtom,
  formErrorsAtom,
} from '../store';


function FormContainer() {
  const queryBuilder = useAtomValue(queryBuilderAtom);
  const filterSettings = useAtomValue(settingsAtom);
  const eventListTitle = useAtomValue(titleAtom);
  const errors = useAtomValue(formErrorsAtom);
  const [url, setUrl] = useAtom(urlAtom);
  const setPage = useSetAtom(pageAtom);
  const { showLocation, showFreeFilter, showRemoteFilter, showTimeFilter } = filterSettings;

  if (!queryBuilder || !filterSettings) {
    return null;
  }

  const onSubmit = () => {
    setPage(1);
    setUrl(queryBuilder.updateUrl());
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(); return false;
  };

  const bothCheckboxes = showFreeFilter && showRemoteFilter;
  const showOnlyLabel = Drupal.t('Show only', {}, { context: 'Event search: event type prefix' });
  const freeTranslation = Drupal.t('Free-of-charge events');
  const remoteTranslation = Drupal.t('Remote events');
  const freeLabel = bothCheckboxes ? freeTranslation : `${showOnlyLabel} ${freeTranslation.toLowerCase()}`;
  const remoteLabel = bothCheckboxes ? remoteTranslation : `${showOnlyLabel} ${remoteTranslation.toLowerCase()}`;

  const showForm = showLocation || showFreeFilter || showTimeFilter || showRemoteFilter;
  const HeadingTag = eventListTitle ? 'h3' : 'h2';

  if (!showForm) {
    return null;
  }

  return (
    <form className='event-form-container' onSubmit={handleSubmit}>
      <HeadingTag className='event-list__filter-title'>{Drupal.t('Filter events', {}, { context: 'Event search: search form title' })}</HeadingTag>
      <div className='event-form__filters-container'>
        <div className='event-form__filter-section-container'>
          {
            showLocation &&
              <LocationFilter />
          }
          {
            showTimeFilter &&
              <DateSelect
              />
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
