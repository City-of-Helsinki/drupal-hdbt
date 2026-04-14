import { CardGhost } from './CardGhost';

export const GhostList = ({
  bordered = false,
  simple = false,
  count,
  modifierClass,
}: {
  bordered?: boolean;
  simple?: boolean;
  count: number;
  modifierClass?: string;
}) => (
  <div aria-live='assertive' aria-atomic='true' className={modifierClass ?? undefined}>
    <div className='visually-hidden'>
      {Drupal.t('Search results are loading', {}, { context: 'React search: results loading' })}
    </div>
    {Array.from(Array(count)).map((_, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: @todo UHF-12501
      <CardGhost bordered={bordered} simple={simple} key={i} />
    ))}
  </div>
);
