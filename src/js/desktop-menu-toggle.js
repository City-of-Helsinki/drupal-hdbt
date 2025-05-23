import { positionDropdown } from './position-dropdown';

const OPEN_CLASS = 'menu__item--open';
const HOVER_CLASS = 'menu__item--hover';

// Helper function for clearing element styles.
const clearStyles = (element) => {
  element.removeAttribute('style');
};

const updateFirstChildAriaExpanded = (item) => {
  let state = 'false';
  if (item.classList.contains(OPEN_CLASS) || item.classList.contains(HOVER_CLASS)) {
    state = 'true';
  }
  const firstChild = item.querySelector(':first-child .menu__toggle-button');
  if (firstChild) {
    firstChild.setAttribute('aria-expanded', state);
  }
};

const closeOpenItems = (element) => {
  const allOpenItems = document.querySelectorAll(`.desktop-menu .${OPEN_CLASS}`);

  if (allOpenItems) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of allOpenItems) {
      // Check that the item we are about to close is not the
      // element-variable given to the function.
      if (item === element) {
        return;
      }
      item.classList.remove(OPEN_CLASS);
      const dropdown = item.querySelector('.menu--level-1');
      if (dropdown) {
        clearStyles(dropdown);
      }
      updateFirstChildAriaExpanded(item);
    }
  }
};

const toggleDesktopMenuLevel = (item) => {
  const toggleButton = item.querySelector('.menu__toggle-button');

  // Check if there was menu toggle button under the menu item.
  if (toggleButton !== null) {
    toggleButton.addEventListener('click', function toggleOpen() {
      item.classList.toggle(OPEN_CLASS);
      updateFirstChildAriaExpanded(item);
      if (item.classList.contains(OPEN_CLASS)) {
        positionDropdown(toggleButton, item,{gutter: 12});
      } else {
        const dropdown = item.querySelector('.menu--level-1');
        if (dropdown) {
          clearStyles(dropdown);
        }
      }
    });
  }
};

const mouseOver = (event) => {
  const item = event.currentTarget.closest('.menu__item--children');
  closeOpenItems(item);
  const toggleButton = item.querySelector('.menu__toggle-button');
  item.classList.add(HOVER_CLASS);
  updateFirstChildAriaExpanded(item);
  positionDropdown(toggleButton, item, { gutter: 12 });
};

const mouseLeave = (event) => {
  const item = event.currentTarget;
  item.classList.remove(HOVER_CLASS);

  if (!item.classList.contains(OPEN_CLASS)) {
    const dropdown = item.querySelector('.menu--level-1');
    if (dropdown) {
      clearStyles(dropdown);
    }
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
  for (; n; n = n.nextSibling) if (n.nodeType === 1 && n !== skipMe) r.push(n);
  return r;
};

// Gets siblings and excludes itself.
const getSiblings = (n) => getChildren(n.parentNode.firstChild, n);

const handleEscKey = (event) => {
  if (event.key === 'Escape') {
    closeOpenItems();
  }
};

((Drupal) => {
  Drupal.behaviors.toggleDesktopNavigation = {
    attach(context) {
      if (context !== document) {
        return;
      }

      if (!window.desktopMenuInitialized) {
        window.desktopMenuInitialized = true;

        const itemsWithVisibleChildren = context.querySelectorAll(
          '.desktop-menu .menu--level-0 > .menu__item--item-below'
        );

        itemsWithVisibleChildren.forEach((item) => {
          if (!item) {
            return;
          }

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

        document.addEventListener('keydown', handleEscKey);
      }

      if (!window.desktopMenuClickHandlerAdded) {
        window.desktopMenuClickHandlerAdded = true;

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
      }

      if (!window.desktopMenuResizeHandlerAdded) {
        window.desktopMenuResizeHandlerAdded = true;

        window.addEventListener('resize', () => {
          document.querySelectorAll('.menu__toggle-button').forEach((button) => {
            const buttonParent = button.parentElement;
            const dropDown = buttonParent.nextElementSibling;
            const menuItem = buttonParent.parentElement;

            if (dropDown && menuItem.classList.contains('menu__item--open')) {
              positionDropdown(button, menuItem, { gutter: 12 });
            }
          });
        });
      }
    }
  };
})(Drupal);
