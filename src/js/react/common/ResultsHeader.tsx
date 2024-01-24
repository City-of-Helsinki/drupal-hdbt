import React, {ComponentType, ForwardedRef, forwardRef, ReactElement} from 'react';

type ResultsHeaderProps = {
  total: string;
  otherTotal?: string;
  singular: string;
  plural: string;
  otherSingular?: string;
  otherPlural?: string;
  translationContext: string;
  actions?: ReactElement;
  actionsClass?: string;
}

const ResultsHeader = forwardRef(({ total, otherTotal, singular, plural, otherSingular, otherPlural, translationContext, actions, actionsClass }: ResultsHeaderProps, ref: ForwardedRef<HTMLDivElement>) => (
    <div className='hdbt-search--react__result-top-area'>
        <h3
          className='hdbt-search--react__results--title'
          ref={ref}
        >
          {!otherTotal && !Number.isNaN(total) && (
            <>
              { Drupal.formatPlural(
                total,
                singular,
                plural,
                {},
                { context: translationContext })
              }
            </>
          )}
          {otherTotal && otherSingular && otherPlural&& !Number.isNaN(otherTotal) && !Number.isNaN(total) && (
            <>
              { Drupal.formatPlural(
                total,
                singular,
                plural,
                {},
                { context: translationContext })
              } ({ Drupal.formatPlural(
                otherTotal,
                otherSingular,
                otherPlural,
                {},
                { context: translationContext })
              })
            </>
          )}
        </h3>
      <div className={actionsClass}>
        {actions}
      </div>
    </div>
  ));

export default ResultsHeader;
