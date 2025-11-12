export const CardGhost = ({ bordered = false }: { bordered?: boolean }) => (
  <div className={`card card--ghost${bordered ? ' card--border' : ''}`}>
    <div className='card__image'></div>
    <div className='card__text'>
      <div className='card__title'></div>
      <div className='card__description'></div>
    </div>
  </div>
);
