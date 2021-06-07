function closeOpenItems() {
  let allOpenItems = document.querySelector('.menu__item--collapsed');
  if (allOpenItems) {
    allOpenItems.classList.toggle('menu__item--collapsed');
    allOpenItems.classList.toggle('menu__item--expanded');
  }
}

function toggleDesktopMenuLevel(item) {
  let toggleButton = item.querySelector('.menu__toggle-button');

  // Check if there was menu toggle button under the menu item.
  if (toggleButton !== null) {
    toggleButton.addEventListener('click', function () {
      item.classList.toggle('menu__item--collapsed');
      item.classList.toggle('menu__item--expanded');
    });
  }
}

function mouserOver() {
  this.classList.toggle('menu__item--hover');
  closeOpenItems();
}

function mouseOut() {
  this.classList.toggle('menu__item--hover');
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
  const itemsWithChildren = document
    .getElementById('block-mainnavigation')
    .getElementsByClassName('menu__item--children');

  for (let item of itemsWithChildren) {
    toggleDesktopMenuLevel(item);
    item.addEventListener('mouseover', mouserOver, false);
    item.addEventListener('mouseout', mouseOut, false);
  }
});

// Functionality when other menu item is clicked while one is open or
// when the user clicks outside of the menu.
window.addEventListener('click', function (event) {
  // First make sure that clicks inside the menu are ignored unless the
  // click is to a menu-link that needs to open another sub menu.
  if (document.getElementById('block-mainnavigation').contains(event.target)) {
    let clickedElement = event.target;

    if (clickedElement.classList.contains('menu__toggle-button')) {
      let clickedElementParent = clickedElement.parentElement.closest(
        '.menu__item--children'
      );
      let clickedElementSiblings = getSiblings(clickedElementParent);

      // Loop through all siblings and if there is some open, close them.
      for (let i = 0; i < clickedElementSiblings.length; i++) {
        if (
          clickedElementSiblings[i].classList.contains('menu__item--collapsed')
        ) {
          clickedElementSiblings[i].classList.toggle('menu__item--collapsed');
          clickedElementSiblings[i].classList.toggle('menu__item--expanded');
        }
      }
    }
  } else {
    closeOpenItems();
  }
});
