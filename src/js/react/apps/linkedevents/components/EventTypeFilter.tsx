import { Checkbox } from 'hds-react';
import { useAtom, useSetAtom } from 'jotai';
import { defaultCheckboxStyle } from '@/react/common/constants/checkboxStyle';
import ApiKeys from '../enum/ApiKeys';
import { typeSelectionsToString } from '../helpers/TypeSelectionsToString';
import { useScopedId } from '../hooks/useScopedId';
import { eventTypeAtom, updateParamsAtom } from '../store';
import type { EventTypeOption } from '../types/EventTypeOption';

export const EventTypeFilter = () => {
  const [typeSelections, setTypes] = useAtom(eventTypeAtom);
  const updateParams = useSetAtom(updateParamsAtom);

  const toggleValue = (value: EventTypeOption) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event?.target?.checked;
    const newTypeSelections: EventTypeOption[] = checked
      ? [...typeSelections, value]
      : typeSelections.filter((type) => type !== value);
    setTypes(newTypeSelections);
    updateParams({ [ApiKeys.EVENT_TYPE]: typeSelectionsToString(newTypeSelections) });
  };

  const eventToggleId = useScopedId('event-type-toggle');
  const hobbyToggleId = useScopedId('hobby-type-toggle');

  return (
    <>
      <Checkbox
        checked={typeSelections.includes('General')}
        className='hdbt-search--react__checkbox'
        id={eventToggleId}
        label={Drupal.t('Events', {}, { context: 'Event search: events type' })}
        onChange={toggleValue('General')}
        style={defaultCheckboxStyle}
      />
      <Checkbox
        checked={typeSelections.includes('Course')}
        className='hdbt-search--react__checkbox'
        id={hobbyToggleId}
        label={Drupal.t('Hobbies', {}, { context: 'Event search: hobbies type' })}
        onChange={toggleValue('Course')}
        style={defaultCheckboxStyle}
      />
    </>
  );
};
