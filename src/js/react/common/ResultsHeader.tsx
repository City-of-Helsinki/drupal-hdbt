import React, {ForwardedRef, forwardRef, ReactElement} from 'react';

type ResultsHeaderProps = {
  resultText: ReactElement;
  optionalResultsText?: ReactElement;
  actions?: ReactElement;
  actionsClass?: string;
}

const ResultsHeader = forwardRef(({ resultText, optionalResultsText, actions, actionsClass }: ResultsHeaderProps, ref: ForwardedRef<HTMLDivElement>) => (
  <div className='hdbt-search--react__result-top-area'>
      <h3 className='hdbt-search--react__results--title' ref={ref} >
        {resultText} {optionalResultsText && (<>({optionalResultsText})</> )}
      </h3>
    {actions && (
      <div className={actionsClass}>
        {actions}
      </div>
    )}
  </div>
));

export default ResultsHeader;
