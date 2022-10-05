const OPEN_CLASS = 'menu__item--open';
const HOVER_CLASS = 'menu__item--hover';

function updateFirstChildAriaExpanded(item) {
  let state = 'false';
  if (
    item.classList.contains(OPEN_CLASS) ||
    item.classList.contains(HOVER_CLASS)
  ) {
    state = 'true';
  }
  const firstChild = item.querySelector(':first-child .menu__toggle-button');
  if (firstChild) {
    firstChild.setAttribute('aria-expanded', state);
  }
}

function closeOpenItems(element) {
  let allOpenItems = document.querySelectorAll('.desktop-menu .' + OPEN_CLASS);

  if (allOpenItems) {
    for (let item of allOpenItems) {
      // Check that the item we are about to close is not the
      // element-variable given to the function.
      if (item === element) {
        return;
      }
      item.classList.remove(OPEN_CLASS);
      updateFirstChildAriaExpanded(item);
    }
  }
}

function toggleDesktopMenuLevel(item) {
  let toggleButton = item.querySelector('.menu__toggle-button');

  // Check if there was menu toggle button under the menu item.
  if (toggleButton !== null) {
    toggleButton.addEventListener('click', function () {
      item.classList.toggle(OPEN_CLASS);
      updateFirstChildAriaExpanded(item);
    });
  }
}

function mouseOver() {
  closeOpenItems(this.closest('.menu__item--children'));
  const item = this.closest('.menu__item--children');
  item.classList.add(HOVER_CLASS);
  updateFirstChildAriaExpanded(item);
}

function mouseLeave() {
  this.classList.remove(HOVER_CLASS);
  updateFirstChildAriaExpanded(this);
}

// Utility functions
// Gets the children of the given element and skips the one that is given
// to it as an option for skipMe.
function getChildren(n, skipMe) {
  var r = [];
  for (; n; n = n.nextSibling) if (n.nodeType == 1 && n != skipMe) r.push(n);
  return r;
}

// Gets siblings and excludes itself.
function getSiblings(n) {
  return getChildren(n.parentNode.firstChild, n);
}

document.addEventListener('DOMContentLoaded', function () {
  // Find all menu items with children menus.
  const itemsWithChildren = document.querySelectorAll(
    '.desktop-menu .menu--level-0 > .menu__item--children'
  );

  for (let item of itemsWithChildren) {
    if (item) {
      let firstLevelItem = item.querySelector(
        '.menu--level-0 > .menu__item--children > .menu__link-wrapper > a'
      );

      toggleDesktopMenuLevel(item);
      firstLevelItem.addEventListener('mouseover', mouseOver, false);
      item.addEventListener('mouseleave', mouseLeave, false);
    }
  }
});

// Functionality when other menu item is clicked while one is open or
// when the user clicks outside of the menu.
window.addEventListener('click', function (event) {
  // First make sure that clicks inside the menu are ignored unless the
  // click is to a menu-link that needs to open another sub menu.
  if (
    document
      .querySelector('[data-hdbt-selector="main-navigation"]')
      .contains(event.target)
  ) {
    let clickedElement = event.target;

    if (clickedElement.classList.contains('menu__toggle-button-icon')) {
      clickedElement = clickedElement.parentElement;
    }

    if (clickedElement.classList.contains('menu__toggle-button')) {
      let clickedElementParent = clickedElement.parentElement.closest(
        '.menu__item--children'
      );
      let clickedElementSiblings = getSiblings(clickedElementParent);

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
