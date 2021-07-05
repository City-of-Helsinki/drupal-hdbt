function closeOpenItems(element) {
  let allOpenItems = document.querySelectorAll(
    '.desktop-menu .menu__item--open'
  );

  if (allOpenItems) {
    for (let item of allOpenItems) {
      // Check that the item we are about to close is not the
      // element-variable given to the function.
      if (item === element) {
        return;
      }
      item.classList.remove('menu__item--open');
    }
  }
}

function toggleDesktopMenuLevel(item) {
  let toggleButton = item.querySelector('.menu__toggle-button');

  // Check if there was menu toggle button under the menu item.
  if (toggleButton !== null) {
    toggleButton.addEventListener('click', function () {
      item.classList.toggle('menu__item--open');
    });
  }
}

function mouseOver() {
  this.closest('.menu__item--children').classList.add('menu__item--hover');
  closeOpenItems(this.closest('.menu__item--children'));
}

function mouseLeave() {
  this.classList.remove('menu__item--hover');
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
    '.desktop-menu #menu--level-0 > .menu__item--children'
  );

  for (let item of itemsWithChildren) {
    if (item) {
      let firstLevelItem = item.querySelector(
        '#menu--level-0 > .menu__item--children > .menu__link-wrapper > a'
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

    if (clickedElement.classList.contains('menu__toggle-button')) {
      let clickedElementParent = clickedElement.parentElement.closest(
        '.menu__item--children'
      );
      let clickedElementSiblings = getSiblings(clickedElementParent);

      // Loop through all siblings and if there is some open, close them.
      for (let i = 0; i < clickedElementSiblings.length; i++) {
        if (clickedElementSiblings[i].classList.contains('menu__item--open')) {
          clickedElementSiblings[i].classList.toggle('menu__item--open');
        }
      }
    }
  } else {
    closeOpenItems();
  }
});
