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
 *
 * CSS classes set by positionToast:
 *   toast-wrapper--opens-above / toast-wrapper--opens-below  on the wrapper
 *   toast--border-bottom       / toast--border-top           on the inner .toast
 *
 * CSS custom properties set on the wrapper:
 *   --toast-arrow-left / --toast-arrow-right / --toast-arrow-transform
 */

((Drupal) => {
  const ARROW_SIZE = 8; // px — matches $spacing-half
  const GUTTER = 8; // minimum gap between toast edge and viewport edge
  const DESKTOP_MQ = '(min-width: 993px)';

  const openToasts = new Map(); // wrapper → { trigger, options }
  const focusOutHandlers = new WeakMap(); // container → focusout handler fn
  const focusOutResizers = new WeakMap(); // container → resize handler fn

  // ---------------------------------------------------------------------------
  // positionToast
  // ---------------------------------------------------------------------------

  function positionToast(trigger, wrapper, options) {
    const { flipVertical = false, defaultAbove = true } = options || {};
    const triggerRect = trigger.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const viewportW = document.documentElement.clientWidth;

    // Reset any previously-applied inline styles so we measure from CSS defaults.
    wrapper.style.top = '';
    wrapper.style.bottom = '';
    wrapper.style.left = '';
    wrapper.style.right = '';
    wrapper.style.transform = '';

    if (flipVertical) {
      const toastH = wrapper.offsetHeight;
      const spaceAbove = triggerRect.top;
      const spaceBelow = viewportH - triggerRect.bottom;
      const needed = toastH + ARROW_SIZE + GUTTER;

      // Prefer the default direction; switch only when the default does not fit
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

      const toastEl = wrapper.querySelector('.toast');
      if (toastEl) {
        toastEl.classList.toggle('toast--border-bottom', opensAbove);
        toastEl.classList.toggle('toast--border-top', !opensAbove);
      }
    }

    // Horizontal clamping.
    // Use getBoundingClientRect (not getComputedStyle) as the base because it
    // returns the final visual position after CSS transforms.
    const rect = wrapper.getBoundingClientRect();
    const parentEl = wrapper.offsetParent || document.documentElement;
    const parentLeft = parentEl.getBoundingClientRect().left;

    const rightOverflow = rect.right - (viewportW - GUTTER);
    const leftUnderflow = GUTTER - rect.left;

    if (rightOverflow > 0) {
      wrapper.style.left = `${rect.left - parentLeft - rightOverflow}px`;
      wrapper.style.transform = 'none';
    } else if (leftUnderflow > 0) {
      wrapper.style.left = `${GUTTER - parentLeft}px`;
      wrapper.style.right = 'auto';
      wrapper.style.transform = 'none';
    }

    // Keep the arrow pseudo-element pointing at the trigger button centre.
    // The CSS border-triangle has width=0 but its borders span 2×ARROW_SIZE px.
    // `left` positions the left edge of that span, so subtract ARROW_SIZE to
    // make the visual tip land on the button centre.
    const adjustedRect = wrapper.getBoundingClientRect();
    const arrowTip = triggerRect.left - adjustedRect.left + triggerRect.width / 2;
    const arrowLeft = arrowTip - ARROW_SIZE;
    const clampedArrow = Math.max(0, Math.min(arrowLeft, adjustedRect.width - ARROW_SIZE * 2));
    wrapper.style.setProperty('--toast-arrow-left', `${clampedArrow}px`);
    wrapper.style.setProperty('--toast-arrow-right', 'auto');
    wrapper.style.setProperty('--toast-arrow-transform', '0');
  }

  // ---------------------------------------------------------------------------
  // attachFocusOut
  // ---------------------------------------------------------------------------

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
      if (!onlyDesktop || window.matchMedia(DESKTOP_MQ).matches) {
        container.addEventListener('focusout', handler);
      }
    };

    attachHandler();
    window.addEventListener('resize', attachHandler);
    focusOutResizers.set(container, attachHandler);
  }

  // ---------------------------------------------------------------------------
  // registerOpen / unregisterOpen
  // ---------------------------------------------------------------------------

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
