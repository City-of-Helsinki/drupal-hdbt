import type React from 'react';

interface IconProps {
  icon: string;
  className?: string;
  label?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export function Icon(props: IconProps): JSX.Element {
  const { icon, className, label, onClick } = props;

  const iconLabelledBy = `hdbt-icon--${Math.floor(Math.random() * 99999)}`;

  return (
    // biome-ignore lint/a11y/useAriaPropsSupportedByRole: @todo UHF-12066
    <span
      className={`hel-icon hel-icon--${icon} ${typeof className !== 'undefined' ? className : ''}`}
      aria-labelledby={label && iconLabelledBy}
      aria-hidden={label ? 'true' : 'false'}
      onClick={onClick}
    >
      {label && (
        <span className='is-hidden' id={iconLabelledBy}>
          {label}
        </span>
      )}
    </span>
  );
}

export default Icon;
