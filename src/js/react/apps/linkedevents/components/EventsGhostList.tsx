import { GhostList } from '@/react/common/GhostList';

type EventsGhostListProps = {
  count: number;
  isLifts: boolean;
};

/**
 * Loading skeleton for the events search results.
 */
export const EventsGhostList = ({ count, isLifts }: EventsGhostListProps) => {
  const { cardsWithBorders } = drupalSettings.helfi_events;

  const ghosts = (
    <GhostList
      bordered={cardsWithBorders}
      count={count}
      element={isLifts ? 'li' : undefined}
      variant={isLifts ? 'teaser' : undefined}
      modifierClass={isLifts ? 'simple-event-list__events--ghosts' : undefined}
    />
  );

  return isLifts ? <ul className='simple-event-list__events'>{ghosts}</ul> : ghosts;
};
