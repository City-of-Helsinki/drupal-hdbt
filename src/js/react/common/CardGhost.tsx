export type CardGhostVariant = 'simple' | 'teaser';

export const CardGhost = ({ bordered = false, variant }: { bordered?: boolean; variant?: CardGhostVariant }) => {
  const simple = variant === 'simple';

  return (
    <div
      className={`card card--ghost${simple ? ' card--ghost--simple' : ''}${bordered ? ' card--border' : ''}${variant === 'teaser' ? ' card--teaser' : ''}`}
    >
      {!simple && <div className='card__image'></div>}
      <div className='card__text'>
        <div className='card__title'></div>
        <div className='card__description'></div>
      </div>
    </div>
  );
};
