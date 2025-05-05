import { positionDropdown } from './position-dropdown';

const OPEN_CLASS = 'menu__item--open';
const HOVER_CLASS = 'menu__item--hover';

// Helper function for clearing element styles.
function clearStyles(element) {
  element.removeAttribute('style');
}

function updateFirstChildAriaExpanded(item) {
  let state = 'false';
  if (item.classList.contains(OPEN_CLASS) || item.classList.contains(HOVER_CLASS)) {
    state = 'true';
  }
  const firstChild = item.querySelector(':first-child .menu__toggle-button');
  if (firstChild) {
    firstChild.setAttribute('aria-expanded', state);
  }
}

function closeOpenItems(element) {
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
      clearStyles(item.querySelector('.menu--level-1'));
      updateFirstChildAriaExpanded(item);
    }
  }
}

function toggleDesktopMenuLevel(item) {
  const toggleButton = item.querySelector('.menu__toggle-button');

  // Check if there was menu toggle button under the menu item.
  if (toggleButton !== null) {
    toggleButton.addEventListener('click', function toggleOpen() {
      item.classList.toggle(OPEN_CLASS);
      updateFirstChildAriaExpanded(item);
      if (item.classList.contains(OPEN_CLASS)) {
        positionDropdown(toggleButton, item,{gutter: 12});
      } else {
        clearStyles(item.querySelector('.menu--level-1'));
      }
    });
  }
}

function mouseOver() {
  closeOpenItems(this.closest('.menu__item--children'));
  const item = this.closest('.menu__item--children');
  const toggleButton = item.querySelector('.menu__toggle-button');
  item.classList.add(HOVER_CLASS);
  updateFirstChildAriaExpanded(item);
  positionDropdown(toggleButton, item,{gutter: 12});
}

function mouseLeave() {
  this.classList.remove(HOVER_CLASS);
  if (!this.classList.contains(OPEN_CLASS)) {
    clearStyles(this.querySelector('.menu--level-1'));
  }
  updateFirstChildAriaExpanded(this);
}

function mouseLeaveButton() {
  closeOpenItems(this.closest('.menu__item--children'));
  const item = this.closest('.menu__item--children');
  item.classList.remove(HOVER_CLASS);
  updateFirstChildAriaExpanded(item);
}

// Utility functions
// Gets the children of the given element and skips the one that is given
// to it as an option for skipMe.
function getChildren(n, skipMe) {
  const r = [];
  for (; n; n = n.nextSibling) if (n.nodeType === 1 && n !== skipMe) r.push(n);
  return r;
}

// Gets siblings and excludes itself.
function getSiblings(n) {
  return getChildren(n.parentNode.firstChild, n);
}

function handleEscKey(event) {
  if (event.key === 'Escape') {
    closeOpenItems();
  }
}

document.addEventListener('DOMContentLoaded', function startDesktopMenu() {
  // Find all menu items with children menus.
  const itemsWithVisibleChildren = document.querySelectorAll('.desktop-menu .menu--level-0 > .menu__item--item-below');

  // eslint-disable-next-line no-restricted-syntax
  for (const item of itemsWithVisibleChildren) {
    if (item) {
      const firstLevelItem = item.querySelector('.menu--level-0 > .menu__item--item-below > .menu__link-wrapper > a');
      const firstLevelItemButton = item.querySelector('.menu--level-0 > .menu__item--item-below > .menu__link-wrapper > .menu__toggle-button');

      toggleDesktopMenuLevel(item);
      firstLevelItem.addEventListener('mouseover', mouseOver, false);
      firstLevelItemButton.addEventListener('mouseover', mouseLeaveButton, false);
      item.addEventListener('mouseleave', mouseLeave, false);
    }
  }

  // Add keydown event listener to handle 'Esc' key
  document.addEventListener('keydown', handleEscKey);
});

// Functionality when other menu item is clicked while one is open or
// when the user clicks outside the menu.
window.addEventListener('click', function onMainNavigationClick(event) {
  // First make sure that clicks inside the menu are ignored unless the
  // click is to a menu-link that needs to open another sub menu.
  if (document.querySelector('[data-hdbt-selector="main-navigation"]').contains(event.target)) {
    let clickedElement = event.target;

    if (clickedElement.classList.contains('menu__toggle-button-icon')) {
      clickedElement = clickedElement.parentElement;
    }

    if (clickedElement.classList.contains('menu__toggle-button')) {
      const clickedElementParent = clickedElement.parentElement.closest('.menu__item--children');
      const clickedElementSiblings = getSiblings(clickedElementParent);

      // Loop through all siblings and if there is some open, close them.
      for (let i = 0; i < clickedElementSiblings.length; i++) {
        if (clickedElementSiblings[i].classList.contains(OPEN_CLASS)) {
          clickedElementSiblings[i].classList.remove(OPEN_CLASS);
          updateFirstChildAriaExpanded(clickedElementSiblings[i]);
        }
      }
    }
  } else {
    closeOpenItems();
  }
});

// Handle resize event to reposition open dropdowns.
window.addEventListener('resize', function mainNavigationOnResize() {
  document.querySelectorAll('.menu__toggle-button').forEach(button => {
    const buttonParent = button.parentElement;
    const dropDown = buttonParent.nextElementSibling;
    const menuItem = buttonParent.parentElement;

    if (dropDown && menuItem.classList.contains('menu__item--open')) {
      positionDropdown(button, menuItem,{gutter: 12});
    }
  });
});
