import { ForwardedRef, forwardRef } from 'react';

type CardProps = {
  description: String;
  lead?: String;
  title: String;
}

const ResultCard = forwardRef(({description, lead, title}: CardProps, ref: ForwardedRef<HTMLDivElement>) => (
    <div className='hdbt-search--react__result-card' ref={ref}>
      <h3 className='hdbt-search--react__result-card--title hdbt-search--title'>{ title }</h3>
      <div>
        { lead && 
          <p>{lead}</p>
        }
        <p>{ description }</p>
      </div>
    </div>
  ));

export default ResultCard;
