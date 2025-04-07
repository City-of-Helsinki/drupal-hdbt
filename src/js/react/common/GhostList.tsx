import { CardGhost } from './CardGhost';

export const GhostList = ({
  count,
}: {
  count: number,
}) => (
  <>
    {Array.from(Array(count)).map((_, i) => <CardGhost key={i} />)}
  </>
);
