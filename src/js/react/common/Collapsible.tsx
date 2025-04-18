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
  showHandle?: boolean;
  title: string | React.ReactNode;
};

function Collapsible({ active, ariaControls, helper, id, label, title, children, showHandle }: Props) {
  const [isActive, setActive] = useState<boolean>(active || false);
  const ref = useRef<HTMLDivElement | null>(null);

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
        onClick={() => setActive(!isActive)}
      >
        <span className='collapsible__title'>{ title }</span>
        {getHandle()}
      </button>
      {isActive &&
        <div className='collapsible__element collapsible__children'>
          {children}
        </div>
      }
      {helper &&
        <div aria-hidden className='collapsible__helper'>{helper}</div>
      }
    </div>
  );
}

export default Collapsible;
