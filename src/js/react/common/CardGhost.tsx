export const CardGhost = ({ bordered = false, simple = false }: { bordered?: boolean; simple?: boolean }) => (
  <div className={`card card--ghost${simple ? ' card--ghost--simple' : ''}${bordered ? ' card--border' : ''}`}>
    {!simple && <div className='card__image'></div>}
    <div className='card__text'>
      <div className='card__title'></div>
      <div className='card__description'></div>
    </div>
  </div>
);
