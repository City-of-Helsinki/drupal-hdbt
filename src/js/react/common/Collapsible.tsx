import React, { useRef, useState } from 'react';

import Icon from '@/react/common/Icon';
import useOutsideClick from './hooks/useOutsideClick';

type Props = {
  active?: boolean;
  ariaControls?: string;
  children: React.ReactElement;
  className?: string;
  dialogLabel?: string;
  helper?: string;
  id: string;
  isPlaceholder?: boolean;
  label: string;
  showHandle?: boolean;
  title: string | React.ReactNode;
};

function Collapsible({
  active,
  ariaControls,
  children,
  className,
  dialogLabel,
  helper,
  id,
  isPlaceholder,
  label,
  showHandle,
  title,
}: Props) {
  const [isActive, setActive] = useState<boolean>(active || false);
  const ref = useRef<HTMLDivElement | null>(null);
  const helperIds = [helper ? `${id}-helper` : undefined, `${id}-title`].filter(Boolean);

  const getHandle = () => {
    if (showHandle !== false) {
      return isActive ? (
        <Icon icon='angle-up' className='collapsible__handle' onClick={() => setActive(!isActive)} />
      ) : (
        <Icon icon='angle-down' className='collapsible__handle' onClick={() => setActive(!isActive)} />
      );
    }
  };

  useOutsideClick(ref, () => {
    setActive(false);
  });

  const titleElement = React.createElement(
    'span',
    { id: `${id}-title`, className: `collapsible__title${isPlaceholder ? ' collapsible__title--placeholder' : ''}` },
    title,
  );

  return (
    <div className={`collapsible-wrapper${className ? ` ${className}` : ''}`} ref={ref}>
      <label className='collapsible__label' htmlFor={id}>
        {label}
      </label>
      <button
        id={id}
        type='button'
        className='collapsible__element collapsible__control'
        aria-controls={ariaControls}
        aria-expanded={isActive}
        aria-describedby={helperIds.join(' ')}
        aria-haspopup='dialog'
        onClick={() => setActive(!isActive)}
      >
        {titleElement}
        {getHandle()}
      </button>
      {isActive && (
        <div className='collapsible__element collapsible__children' role='dialog' aria-label={dialogLabel}>
          {children}
        </div>
      )}
      {helper && (
        <div id={`${id}-helper`} className='collapsible__helper'>
          {helper}
        </div>
      )}
    </div>
  );
}

export default Collapsible;
