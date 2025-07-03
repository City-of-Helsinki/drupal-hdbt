import { Checkbox } from 'hds-react';
import { useAtom, useSetAtom } from 'jotai';
import { eventTypeAtom, updateParamsAtom } from '../store';
import ApiKeys from '../enum/ApiKeys';
import { typeSelectionsToString } from '../helpers/TypeSelectionsToString';
import { EventTypeOption } from '../types/EventTypeOption';

export const EventTypeFilter = () => {
  const [typeSelections, setTypes] = useAtom(eventTypeAtom);
  const updateParams = useSetAtom(updateParamsAtom);

  const toggleValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event?.target?.checked;
    const value = event.target.id === 'event-type-toggle' ? 'General' : 'Course';
    const newTypeSelections: EventTypeOption[] = checked ? [...typeSelections, value] : typeSelections.filter((type) => type !== value);
    setTypes(newTypeSelections);
    updateParams({ [ApiKeys.EVENT_TYPE]: typeSelectionsToString(newTypeSelections) });
  };

  return (
    <>
      <Checkbox
        checked={typeSelections.includes('General')}
        className='hdbt-search--react__checkbox'
        id='event-type-toggle'
        label={Drupal.t('Events', {}, { context: 'Event search: events type' })}
        onChange={toggleValue}
      />
      <Checkbox
        checked={typeSelections.includes('Course')}
        className='hdbt-search--react__checkbox'
        id='hobby-type-toggle'
        label={Drupal.t('Hobbies', {}, { context: 'Event search: hobbies type' })}
        onChange={toggleValue}
      />
    </> 
  );
};