import { positionDropdown } from './positionDropdown';

const OPEN_CLASS = 'menu__item--open';
const HOVER_CLASS = 'menu__item--hover';

// Helper function for clearing element styles.
const clearStyles = (element) => {
  if (element) {
    element.removeAttribute('style');
  }
};

const updateFirstChildAriaExpanded = (item) => {
  const state = item.classList.contains(OPEN_CLASS) || item.classList.contains(HOVER_CLASS) ? 'true' : 'false';
  const firstChild = item.querySelector(':first-child .menu__toggle-button');
  if (firstChild) {
    firstChild.setAttribute('aria-expanded', state);
  }
};

const closeOpenItems = (element) => {
  const allOpenItems = document.querySelectorAll(`.desktop-menu .${OPEN_CLASS}`);

  // Check that the item we are about to close is not the
  // element-variable given to the function.
  allOpenItems.forEach((item) => {
    if (item === element) return;

    item.classList.remove(OPEN_CLASS);
    clearStyles(item.querySelector('.menu--level-1'));
    updateFirstChildAriaExpanded(item);
  });
};

const toggleDesktopMenuLevel = (item) => {
  const toggleButton = item.querySelector('.menu__toggle-button');

  // Check if there was menu toggle button under the menu item.
  if (toggleButton !== null) {
    toggleButton.addEventListener('click', () => {
      item.classList.toggle(OPEN_CLASS);
      updateFirstChildAriaExpanded(item);
      if (item.classList.contains(OPEN_CLASS)) {
        positionDropdown(toggleButton, item, { gutter: 12 });
      } else {
        clearStyles(item.querySelector('.menu--level-1'));
      }
    });
  }
};

const mouseOver = (event) => {
  const item = event.currentTarget.closest('.menu__item--children');
  closeOpenItems(item);
  item.classList.add(HOVER_CLASS);
  updateFirstChildAriaExpanded(item);
  positionDropdown(item.querySelector('.menu__toggle-button'), item, { gutter: 12 });
};

const mouseLeave = (event) => {
  const item = event.currentTarget;
  item.classList.remove(HOVER_CLASS);

  if (!item.classList.contains(OPEN_CLASS)) {
    clearStyles(item.querySelector('.menu--level-1'));
  }

  updateFirstChildAriaExpanded(item);
};

const mouseLeaveButton = (event) => {
  const item = event.currentTarget.closest('.menu__item--children');
  closeOpenItems(item);
  item.classList.remove(HOVER_CLASS);
  updateFirstChildAriaExpanded(item);
};

// Utility functions
// Gets the children of the given element and skips the one that is given
// to it as an option for skipMe.
const getChildren = (n, skipMe) => {
  const r = [];
  for (; n; n = n.nextSibling) {
    if (n.nodeType === 1 && n !== skipMe) r.push(n);
  }
  return r;
};

// Gets siblings and excludes itself.
const getSiblings = (n) => getChildren(n.parentNode.firstChild, n);

const handleEscKey = (event) => {
  if (event.key === 'Escape') {
    closeOpenItems();
  }
};

// Function to close dropdown when focus moves outside of it.
const closeOnFocusOut = (item) => {
  const handler = () => {
    requestAnimationFrame(() => {
      const active = document.activeElement;

      if (!item.contains(active)) {
        closeOpenItems();
      }
    });
  };

  item.addEventListener('focusout', handler);
};

((Drupal, once) => {
  Drupal.behaviors.toggleDesktopNavigation = {
    attach(context) {
      document.addEventListener('keydown', handleEscKey);

      window.addEventListener('click', (event) => {
        const mainNav = document.querySelector('[data-hdbt-selector="main-navigation"]');

        if (mainNav && mainNav.contains(event.target)) {
          let clickedElement = event.target;

          if (clickedElement.classList.contains('menu__toggle-button-icon')) {
            clickedElement = clickedElement.parentElement;
          }

          if (clickedElement.classList.contains('menu__toggle-button')) {
            const clickedElementParent = clickedElement.parentElement.closest('.menu__item--children');
            const clickedElementSiblings = getSiblings(clickedElementParent);
            closeOnFocusOut(clickedElementParent);

            clickedElementSiblings.forEach((sibling) => {
              if (sibling.classList.contains(OPEN_CLASS)) {
                sibling.classList.remove(OPEN_CLASS);
                updateFirstChildAriaExpanded(sibling);
              }
            });
          }
        } else {
          closeOpenItems();
        }
      });

      window.addEventListener('resize', () => {
        document.querySelectorAll('.menu__toggle-button').forEach((button) => {
          const buttonParent = button.parentElement;
          const dropDown = buttonParent.nextElementSibling;
          const menuItem = buttonParent.parentElement;

          if (dropDown && menuItem.classList.contains(OPEN_CLASS)) {
            positionDropdown(button, menuItem, { gutter: 12 });
          }
        });
      });

      // Show toggle button if js is enabled.
      document.querySelectorAll('.header-bottom .menu__toggle-button').forEach((button) => {
        button.classList.add('js-show-menu__toggle-button');
      });

      // Use Drupal's once() to ensure this runs only once per element.
      const itemsWithVisibleChildren = once('toggleDesktopNavigation',
        '.desktop-menu .menu--level-0 > .menu__item--item-below',
        context
      );

      itemsWithVisibleChildren.forEach((item) => {
        const firstLevelItem = item.querySelector(
          '.menu--level-0 > .menu__item--item-below > .menu__link-wrapper > a'
        );
        const firstLevelItemButton = item.querySelector(
          '.menu--level-0 > .menu__item--item-below > .menu__link-wrapper > .menu__toggle-button'
        );

        toggleDesktopMenuLevel(item);

        if (firstLevelItem) {
          firstLevelItem.addEventListener('mouseover', mouseOver, false);
        }

        if (firstLevelItemButton) {
          firstLevelItemButton.addEventListener('mouseover', mouseLeaveButton, false);
        }

        item.addEventListener('mouseleave', mouseLeave, false);
      });
    }
  };
})(Drupal, once);
