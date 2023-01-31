import React from 'react';

interface IconProps {
  icon: string;
  className?: string;
  label?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export function Icon(props: IconProps): JSX.Element {
  const {
    icon,
    className,
    label,
    onClick
  } = props;

  return (
    <span
      className={`hel-icon hel-icon--${icon} ${typeof className !== 'undefined' ? className : ''}`}
      aria-label={label}
      aria-hidden={ label ? 'true' : 'false'}
      onClick={onClick}
    />
  );
}

export default Icon;
