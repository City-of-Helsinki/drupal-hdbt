import CardItem from '@/react/common/Card';
import { useResultCardProps } from '../hooks/useResultCardProps';
import type { Event } from '../types/Event';

export interface ResultCardProps extends Event {
  cardModifierClass?: string;
}

function ResultCard({ cardModifierClass, ...event }: ResultCardProps) {
  const props = useResultCardProps(event);

  return <CardItem {...props} cardModifierClass={cardModifierClass} cardUrlExternal />;
}

export default ResultCard;
