import React from 'react';
import { IconClock, IconLocation, IconCogwheel } from 'hds-react';

import type Roadwork from '../types/Roadwork';
import CardItem from '@/react/common/Card';

interface RoadworkCardProps {
  roadwork: Roadwork;
  cardModifierClass?: string;
}

const RoadworkCard: React.FC<RoadworkCardProps> = ({ roadwork, cardModifierClass }) => {
  const { title, description, url, location, schedule } = roadwork;

  return (
    <CardItem
      cardTitle={title}
      cardUrl={url || '#'}
      cardUrlExternal={!!url}
      cardDescription={description}
      cardModifierClass={cardModifierClass}
      location={location}
      locationLabel="Sijainti"
      time={schedule}
      timeLabel="Aikataulu"
    />
  );
};

export default RoadworkCard;
