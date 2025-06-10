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
import FullLocationFilter from '../components/FullLocationFilter';
import { LanguageFilter } from '../components/LanguageFilter';
import { EventTypeFilter } from '../components/EventTypeFilter';


function FormContainer() {
  const filterSettings = useAtomValue(settingsAtom);
  const eventListTitle = useAtomValue(titleAtom);
  const errors = useAtomValue(formErrorsAtom);
  const url = useAtomValue(urlAtom);
  const updateUrl = useSetAtom(updateUrlAtom);
  const {
    eventListType,
    showFreeFilter,
    hideHeading,
    showLanguageFilter,
    showLocation,
    showRemoteFilter,
    showTimeFilter,
    showTopicsFilter,
    useFullLocationFilter,
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
  const freeTranslation = Drupal.t('Free-of-charge', {}, { context: 'Events search: free filter label' });
  const remoteTranslation = Drupal.t('Remote participation', {}, { context: 'Events search: remote filter label' });
  const freeLabel = bothCheckboxes ? freeTranslation : `${showOnlyLabel} ${freeTranslation.toLowerCase()}`;
  const remoteLabel = bothCheckboxes ? remoteTranslation : `${showOnlyLabel} ${remoteTranslation.toLowerCase()}`;

  const showForm = showLocation || showFreeFilter || showTimeFilter || showRemoteFilter || showTopicsFilter || eventListType === 'events_and_hobbies';
  const HeadingTag = eventListTitle ? 'h3' : 'h2';

  if (!showForm) {
    return null;
  }

  let heading = '';
  switch (eventListType) {
    case 'events':
      heading = Drupal.t('Filter events', {}, { context: 'Events search: search form title' });
      break;
    case 'hobbies':
      heading = Drupal.t('Filter hobbies', {}, { context: 'Events search: search form title' });
      break;
    case 'events_and_hobbies':
      heading = Drupal.t('Filter events and hobbies', {}, { context: 'Events search: search form title' });
      break;
    default: break;
  }

  return (
    <form className='hdbt-search--react__form-container' role='search' onSubmit={handleSubmit}>
      {
        !hideHeading &&
        <HeadingTag className='event-list__filter-title'>{heading}</HeadingTag>
      }
      <div className='event-form__filters-container'>
        {useLocationSearch &&
          <AddressSearch />
        }
        <div className='event-form__filter-section-container'>
          {
            showTopicsFilter &&
            <TopicsFilter />
          }
          {
            useFullTopicsFilter &&
            <FullTopicsFilter />
          }
          {
            showLocation &&
              (useFullLocationFilter ?
                <FullLocationFilter /> :
                <LocationFilter />
              )
          }
          {
            showTimeFilter &&
            <DateSelect />
          }
          {
            showLanguageFilter &&
            <LanguageFilter />
          }
        </div>
        {
          eventListType === 'events_and_hobbies' &&
          <div className='hdbt-search--react__checkbox-filter-container'>
            <fieldset className='hdbt-search--react__fieldset'>
              <legend className='hdbt-search--react__legend'>
                {Drupal.t('Type', {}, { context: 'Event search: type filter label' })}
              </legend>
              <EventTypeFilter />
            </fieldset>
          </div>
        }
        {
          (showFreeFilter || showRemoteFilter) &&
          <div className='hdbt-search--react__checkbox-filter-container'>
            <fieldset className='hdbt-search--react__fieldset'>
              {
                bothCheckboxes &&
                <legend className='hdbt-search--react__legend'>
                  {showOnlyLabel}
                </legend>
              }
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
            </fieldset>
          </div>
        }
        <SubmitButton disabled={errors.invalidEndDate || errors.invalidStartDate} />
        <SelectionsContainer url={url} />
      </div>
    </form>
  );
}

export default FormContainer;
