import React, { useRef, useState } from 'react';

import Icon from '@/react/common/Icon';
import useOutsideClick from './hooks/useOutsideClick';

type Props = {
  active?: boolean;
  ariaControls?: string;
  children: React.ReactElement;
  helper?: string;
  id: string;
  label: string;
  dialogLabel?: string;
  showHandle?: boolean;
  title: string | React.ReactNode;
};

function Collapsible({ active, ariaControls, dialogLabel, helper, id, label, title, children, showHandle }: Props) {
  const [isActive, setActive] = useState<boolean>(active || false);
  const ref = useRef<HTMLDivElement | null>(null);
  const helperIds = [
    helper ? `${id}-helper` : undefined,
    `${id}-title`,
  ].filter(Boolean);

  const getHandle = () => {
    if (showHandle !== false) {
      return isActive ?
        <Icon icon="angle-up" className='collapsible__handle' onClick={() => setActive(!isActive)} /> :
        <Icon icon="angle-down" className='collapsible__handle' onClick={() => setActive(!isActive)} />;
    }
  };

  useOutsideClick(ref, () => {
    setActive(false);
  });

  return (
    <div className='collapsible-wrapper' ref={ref}>
      <label className='collapsible__label' htmlFor={id}>{label}</label>
      <button
        id={id}
        type="button"
        className='collapsible__element collapsible__control'
        aria-controls={ariaControls}
        aria-expanded={isActive}
        aria-describedby={helperIds.join(' ')}
        aria-haspopup='dialog'
        onClick={() => setActive(!isActive)}
      >
        <span id={`${id}-title`} className='collapsible__title'>
          { title }
          {getHandle()}
        </span>
      </button>
      {isActive &&
        <div
          className='collapsible__element collapsible__children'
          role='dialog'
          aria-label={dialogLabel}
        >
          {children}
        </div>
      }
      {helper &&
        <div id={`${id}-helper`} className='collapsible__helper'>{helper}</div>
      }
    </div>
  );
}

export default Collapsible;
