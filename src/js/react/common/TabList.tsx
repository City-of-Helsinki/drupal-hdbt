import { type FocusEvent, type KeyboardEvent, type ReactNode, useRef, useState } from 'react';

export type TabItem = {
  // Value passed to onSelect when the tab is activated.
  value: string;
  label: ReactNode;
  // Id of the tabpanel this tab controls.
  controls: string;
  id?: string;
};

type TabListProps = {
  tabs: TabItem[];
  selected: string;
  onSelect: (value: string) => void;
  label?: string;
  className?: string;
};

/**
 * Tablist following the WAI-ARIA APG tabs pattern with manual activation.
 *
 * Only one tab is in the tab sequence (roving tabindex), so Tab moves focus
 * into the tablist and out of it. Entering the tablist focuses the selected
 * tab. Arrow keys move focus between tabs, Home and End jump to the first and
 * last tab. Enter or Space selects the focused tab.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 */
const TabList = ({
  tabs,
  selected,
  onSelect,
  label,
  className = 'hdbt-search--react__results--tablist',
}: TabListProps) => {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // Tab that holds focus inside the tablist, null when focus is outside.
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const selectedIndex = tabs.findIndex((tab) => tab.value === selected);
  // The focused tab is tabbable so that Tab leaves the tablist instead of
  // moving to the selected tab. Once focus leaves, the selected tab is
  // tabbable again.
  const tabbableIndex = focusedIndex ?? (selectedIndex === -1 ? 0 : selectedIndex);

  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setFocusedIndex(null);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = tabs.length - 1;
    let next: number;

    switch (event.key) {
      case 'ArrowRight':
        next = index === last ? 0 : index + 1;
        break;
      case 'ArrowLeft':
        next = index === 0 ? last : index - 1;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = last;
        break;
      default:
        return;
    }

    event.preventDefault();
    tabRefs.current[next]?.focus();
  };

  return (
    <div className={className} role='tablist' aria-label={label} onBlur={onBlur}>
      {tabs.map(({ value, label: tabLabel, controls, id }, index) => {
        const isSelected = value === selected;

        return (
          <button
            key={value}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            id={id}
            type='button'
            className='tablist-tab'
            role='tab'
            aria-selected={isSelected}
            tabIndex={index === tabbableIndex ? 0 : -1}
            aria-controls={controls}
            onFocus={() => setFocusedIndex(index)}
            onClick={() => onSelect(value)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {tabLabel}
          </button>
        );
      })}
    </div>
  );
};

export default TabList;
