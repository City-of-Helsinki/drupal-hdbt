import { CardGhost } from './CardGhost';

export const GhostList = ({
  bordered = false,
  count,
}: {
  bordered?: boolean,
  count: number,
}) => (
  <>
    {Array.from(Array(count)).map((_, i) => <CardGhost bordered={bordered} key={i} />)}
  </>
);
