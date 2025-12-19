import { type ForwardedRef, forwardRef, type ReactElement } from 'react';

type ResultsHeaderProps = {
  actions?: ReactElement;
  actionsClass?: string;
  leftActions?: ReactElement;
  optionalResultsText?: ReactElement | string;
  resultText: ReactElement | string;
};

const ResultsHeader = forwardRef(
  (
    {
      actions,
      actionsClass,
      leftActions,
      optionalResultsText,
      resultText,
    }: ResultsHeaderProps,
    ref: ForwardedRef<HTMLHeadingElement>,
  ) => {
    const headerElement = (
      <h3 className='hdbt-search--react__results--title' ref={ref}>
        {resultText} {optionalResultsText && <>({optionalResultsText})</>}
      </h3>
    );

    if (leftActions) {
      return (
        <div className='hdbt-search--react__result-top-area hdbt-search--react__result-top-area--with-left-actions'>
          {headerElement}
          <div className='hdbt-search--react__actions-container'>
            <div className='hdbt-search--react__result-top-area-item'>
              {leftActions}
            </div>
            <div className='hdbt-search--react__result-top-area-item'>
              {actions && <div className={actionsClass}>{actions}</div>}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className='hdbt-search--react__result-top-area'>
        {headerElement}
        {actions && <div className={actionsClass}>{actions}</div>}
      </div>
    );
  },
);

export default ResultsHeader;
