import { type ForwardedRef, forwardRef } from 'react';

type CardProps = { title: string; address?: string; lead?: string; description: string | JSX.Element | JSX.Element[] };

const ResultCard = forwardRef(({ description, lead, title, address }: CardProps, ref: ForwardedRef<HTMLDivElement>) => (
  <div className='hdbt-search--ploughing-schedule__result-card' ref={ref}>
    <h3 className='hdbt-search--ploughing-schedule__result-card--title hdbt-search--title'>{title}</h3>
    {address && <h4 className='hdbt-search--ploughing-schedule__result-card--address hdbt-search--title'>{address}</h4>}
    <div>
      {lead && <p>{lead}</p>}
      <p>{description}</p>
    </div>
  </div>
));

export default ResultCard;
