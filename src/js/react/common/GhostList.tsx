import { CardGhost } from './CardGhost';

export const GhostList = ({
  bordered = false,
  simple = false,
  count,
  element: Element = 'div',
  modifierClass,
}: {
  bordered?: boolean;
  simple?: boolean;
  count: number;
  element?: keyof JSX.IntrinsicElements;
  modifierClass?: string;
}) => (
  <Element aria-live='assertive' aria-atomic='true' className={modifierClass ?? undefined}>
    <div className='visually-hidden'>
      {Drupal.t('Search results are loading', {}, { context: 'React search: results loading' })}
    </div>
    {Array.from(Array(count)).map((_, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: @todo UHF-12501
      <CardGhost bordered={bordered} simple={simple} key={i} />
    ))}
  </Element>
);
