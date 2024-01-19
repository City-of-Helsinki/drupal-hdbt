import React, {ComponentType, ForwardedRef, forwardRef, ReactElement} from 'react';

type ResultsHeaderProps = {
  total: string;
  singular: string;
  plural: string;
  translationContext: string;
  actions?: ReactElement;
  actionsClass?: string;
}

const ResultsHeader = forwardRef(({ total, singular, plural, translationContext, actions, actionsClass }: ResultsHeaderProps, ref: ForwardedRef<HTMLDivElement>) => (
    <div className='hdbt-search--react__result-top-area'>
      {!Number.isNaN(total) &&
        <h3
          className='hdbt-search--react__results--title'
          ref={ref}
        >
          { Drupal.formatPlural(total, singular, plural, {}, { context: translationContext }) }
        </h3>
      }
      <div className={actionsClass}>
        {actions}
      </div>
    </div>
  ));

export default ResultsHeader;
