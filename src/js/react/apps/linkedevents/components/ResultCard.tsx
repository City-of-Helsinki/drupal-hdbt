import CardItem from '@/react/common/Card';
import { useResultCardProps } from '../hooks/useResultCardProps';
import type { Event } from '../types/Event';

export interface ResultCardProps extends Event {
  cardModifierClass?: string;
  element?: keyof JSX.IntrinsicElements;
}

function ResultCard({ cardModifierClass, element, ...event }: ResultCardProps) {
  const props = useResultCardProps(event);

  return <CardItem {...props} cardModifierClass={cardModifierClass} element={element} cardUrlExternal />;
}

export default ResultCard;
