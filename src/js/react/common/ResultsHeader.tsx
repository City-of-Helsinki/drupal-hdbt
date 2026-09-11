import { type ForwardedRef, forwardRef, type ReactElement } from 'react';

type HeadingLevel = 2 | 3 | 4 | 5 | 6;
type HeadingTag = 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

type ResultsHeaderProps = {
  actions?: ReactElement;
  actionsClass?: string;
  headingLevel?: HeadingLevel;
  leftActions?: ReactElement;
  optionalResultsText?: ReactElement | string;
  resultText: ReactElement | string;
};

const ResultsHeader = forwardRef(
  (
    { actions, actionsClass, headingLevel = 3, leftActions, optionalResultsText, resultText }: ResultsHeaderProps,
    ref: ForwardedRef<HTMLHeadingElement>,
  ) => {
    const Heading: HeadingTag = `h${headingLevel}`;

    const headerElement = (
      <Heading className='hdbt-search--react__results--title' ref={ref}>
        {resultText} {optionalResultsText && <>({optionalResultsText})</>}
      </Heading>
    );

    if (leftActions) {
      return (
        <div className='hdbt-search--react__result-top-area hdbt-search--react__result-top-area--with-left-actions'>
          {headerElement}
          <div className='hdbt-search--react__actions-container'>
            <div className='hdbt-search--react__result-top-area-item'>{leftActions}</div>
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
