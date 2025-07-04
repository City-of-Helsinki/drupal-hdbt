import React from 'react';
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
      locationLabel={Drupal.t('Location', {}, {context: 'Roadworks search: card location label'})}
      time={schedule}
      timeLabel={Drupal.t('Schedule', {}, {context: 'Roadworks search: card schedule label'})}
    />
  );
};

export default RoadworkCard;
