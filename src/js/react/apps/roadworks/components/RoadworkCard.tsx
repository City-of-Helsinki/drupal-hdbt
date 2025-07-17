import { useAtomCallback } from 'jotai/utils';
import haversine from 'haversine';

import type Roadwork from '../types/Roadwork';
import CardItem from '@/react/common/Card';
import { coordinatesAtom } from '../store';

const RoadworkCard = ({
  roadwork: {
    coordinates,
    description,
    location,
    schedule,
    title,
    url,
  },
  cardModifierClass,
}: {
  roadwork: Roadwork;
  cardModifierClass?: string;
}) => {
  const readCurrentCoordinates = useAtomCallback((get) => get(coordinatesAtom));

  const getDistance = () => {
    const currentCoords = readCurrentCoordinates();

    if (!currentCoords || !coordinates) {
      return undefined;
    }

    const start = {
      latitude: currentCoords[1],
      longitude: currentCoords[0],
    };

    const end = {
      latitude: coordinates.lat,
      longitude: coordinates.lon,
    };

    const distance = haversine(start, end, {unit: 'km'});

    if (!distance) {
      return undefined;
    }

    return `${Math.ceil(distance)} km`;
  };

  return (
    <CardItem
      cardTitle={title}
      cardUrl={url || '#'}
      cardUrlExternal={!!url}
      cardDescription={description}
      cardModifierClass={cardModifierClass}
      location={location}
      locationLabel={Drupal.t('Location', {}, {context: 'Roadworks search: card location label'})}
      distance={getDistance()}
      date={schedule}
      dateLabel={Drupal.t('Planned schedule', {}, {context: 'Roadworks search: card schedule label'})}
    />
  );
};

export default RoadworkCard;
