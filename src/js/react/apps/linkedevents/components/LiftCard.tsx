import { Teaser } from '@/react/common/Teaser';
import { useResultCardProps } from '../hooks/useResultCardProps';
import type { ResultCardProps } from './ResultCard';

export const LiftCard = (props: ResultCardProps) => {
  const { cardImage, cardTitle, cardUrl, jsxTime } = useResultCardProps(props);

  return <Teaser image={cardImage} time={jsxTime} title={cardTitle} url={cardUrl} />;
};
