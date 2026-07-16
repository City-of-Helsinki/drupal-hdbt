/**
 * Toast positioning and focus-management utility.
 *
 * Exposes Drupal.toastPositioner with:
 *
 * positionToast(trigger, wrapper, options)
 *   Positions the toast above or below the trigger button based on available
 *   viewport space, and clamps horizontal overflow.
 *   options.flipVertical  {boolean} - flip above/below based on space (default: false)
 *   options.defaultAbove  {boolean} - prefer opening above when flipVertical is true (default: true)
 *
 * attachFocusOut(container, closeCallback, triggerButtons, options)
 *   Closes a toast when keyboard focus moves outside its container.
 *   Replaces any previously attached handler for the same container.
 *   options.onlyDesktop {boolean} - only attach on non-mobile screens (default: false)
 *
 * registerOpen(trigger, wrapper, options) / unregisterOpen(wrapper)
 *   Register/unregister a toast for automatic repositioning on window resize.
 */

((Drupal) => {
  const ARROW_SIZE = 8;
  const GUTTER = 16; // Minimum gap between toast edge and viewport edge.
  const DESKTOP_MEDIA_QUERY = '(min-width: 993px)'; // $breakpoint-l: 992px

  // Tracks currently open toasts so the resize listener can reposition them.
  // Regular Map because we need to iterate over all entries on every resize.
  const openToasts = new Map();

  // Tracks the active focusout/resize listeners per toast container so that
  // reopening a toast replaces the old listeners instead of stacking new ones.
  // WeakMap keys are garbage-collected automatically when the element is removed.
  const focusOutHandlers = new WeakMap();
  const focusOutResizers = new WeakMap();

  function positionToast(trigger, wrapper, options) {
    const { flipVertical = false, defaultAbove = true } = options || {};
    const triggerRect = trigger.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = document.documentElement.clientWidth;

    // Reset any previously-applied inline styles so we measure from CSS defaults.
    wrapper.style.top = '';
    wrapper.style.bottom = '';
    wrapper.style.left = '';
    wrapper.style.right = '';
    wrapper.style.transform = '';

    if (flipVertical) {
      const toastHeight = wrapper.offsetHeight;
      const spaceAbove = triggerRect.top;
      const spaceBelow = viewportHeight - triggerRect.bottom;
      const needed = toastHeight + ARROW_SIZE + GUTTER;

      // Prefer the default direction. Switch only when the default does not fit
      // and the other direction has more available space.
      const opensAbove = defaultAbove
        ? spaceAbove >= needed || spaceAbove >= spaceBelow
        : spaceBelow < needed && spaceAbove >= needed;

      if (opensAbove) {
        wrapper.style.top = 'auto';
        wrapper.style.bottom = `calc(100% + ${ARROW_SIZE}px)`;
      } else {
        wrapper.style.bottom = 'auto';
        wrapper.style.top = `calc(100% + ${ARROW_SIZE}px)`;
      }

      wrapper.classList.toggle('toast-wrapper--opens-above', opensAbove);
      wrapper.classList.toggle('toast-wrapper--opens-below', !opensAbove);

      const toastElement = wrapper.querySelector('.toast');
      if (toastElement) {
        toastElement.classList.toggle('toast--border-bottom', opensAbove);
        toastElement.classList.toggle('toast--border-top', !opensAbove);
      }
    }

    // Horizontal positioning.
    // Use getBoundingClientRect (not getComputedStyle) as the base because it
    // returns the final visual position after CSS transforms.
    const rect = wrapper.getBoundingClientRect();
    const parentElement = wrapper.offsetParent || document.documentElement;
    const parentLeft = parentElement.getBoundingClientRect().left;

    const rightOverflow = rect.right - (viewportWidth - GUTTER);
    const leftUnderflow = GUTTER - rect.left;

    if (rightOverflow > 0) {
      wrapper.style.left = `${rect.left - parentLeft - rightOverflow}px`;
      wrapper.style.transform = 'none';
    } else if (leftUnderflow > 0) {
      wrapper.style.left = `${GUTTER - parentLeft}px`;
      wrapper.style.right = 'auto';
      wrapper.style.transform = 'none';
    }

    // Keep the arrow pointing at the trigger button center.
    // The border-triangle is 2×ARROW_SIZE wide.
    // Left position the left edge of that span, so subtract ARROW_SIZE to
    // make the tip point to the button center.
    const adjustedRect = wrapper.getBoundingClientRect();
    const arrowTip = triggerRect.left - adjustedRect.left + triggerRect.width / 2;
    const arrowLeft = arrowTip - ARROW_SIZE;
    const clampedArrow = Math.max(0, Math.min(arrowLeft, adjustedRect.width - ARROW_SIZE * 2));
    wrapper.style.setProperty('--toast-arrow-left', `${clampedArrow}px`);
    wrapper.style.setProperty('--toast-arrow-right', 'auto');
    wrapper.style.setProperty('--toast-arrow-transform', '0');
  }

  function attachFocusOut(container, closeCallback, triggerButtons, options) {
    const { onlyDesktop = false } = options || {};
    const buttons = triggerButtons || [];

    // Remove any existing handlers for this container before attaching new ones
    // to prevent stacking multiple listeners on repeated open/close cycles.
    const existing = focusOutHandlers.get(container);
    if (existing) {
      container.removeEventListener('focusout', existing);
    }
    const existingResizer = focusOutResizers.get(container);
    if (existingResizer) {
      window.removeEventListener('resize', existingResizer);
    }

    const handler = (e) => {
      // If focus is moving to a trigger button, the click handler manages state.
      if (e.relatedTarget && buttons.includes(e.relatedTarget)) return;

      // Safari moves focus to <body> on button clicks instead of the clicked
      // element, so relatedTarget can be null. Use a longer delay to let the
      // click event fire and settle focus before we check where focus ended up.
      const delay = e.relatedTarget ? 10 : 300;

      setTimeout(() => {
        const active = document.activeElement;
        if (!container.contains(active) && !buttons.includes(active)) {
          closeCallback();
        }
      }, delay);
    };

    focusOutHandlers.set(container, handler);

    const attachHandler = () => {
      container.removeEventListener('focusout', handler);
      if (!onlyDesktop || window.matchMedia(DESKTOP_MEDIA_QUERY).matches) {
        container.addEventListener('focusout', handler);
      }
    };

    attachHandler();
    window.addEventListener('resize', attachHandler);
    focusOutResizers.set(container, attachHandler);
  }

  function registerOpen(trigger, wrapper, options) {
    openToasts.set(wrapper, { trigger, options: options || {} });
  }

  function unregisterOpen(wrapper) {
    openToasts.delete(wrapper);
  }

  // Reposition all tracked toasts and any visible language toasts on resize.
  window.addEventListener('resize', () => {
    openToasts.forEach(({ trigger, options }, wrapper) => {
      positionToast(trigger, wrapper, options);
    });

    document
      .querySelectorAll('.nav-toggle-dropdown--language-toast:not(.nav-toggle-dropdown--closed)')
      .forEach((dropdown) => {
        const navToggle = dropdown.previousElementSibling;
        const trigger = navToggle?.querySelector('.nav-toggle__button');
        if (trigger) {
          positionToast(trigger, dropdown);
        }
      });
  });

  Drupal.toastPositioner = {
    positionToast,
    attachFocusOut,
    registerOpen,
    unregisterOpen,
  };
})(Drupal);
