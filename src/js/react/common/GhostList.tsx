import { CardGhost } from './CardGhost';

export const GhostList = ({ bordered = false, count }: { bordered?: boolean; count: number }) => (
  <div aria-live='assertive' aria-atomic='true'>
    <div className='visually-hidden'>
      {Drupal.t('Search results are loading', {}, { context: 'React search: results loading' })}
    </div>
    {Array.from(Array(count)).map((_, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: @todo UHF-12501
      <CardGhost bordered={bordered} key={i} />
    ))}
  </div>
);
