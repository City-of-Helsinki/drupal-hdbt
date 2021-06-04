document.addEventListener('DOMContentLoaded', function () {
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

  // Find all menu items with children menus.
  const itemsWithChildren = document
    .getElementById('block-mainnavigation')
    .getElementsByClassName('menu__item--children');

  for (let item of itemsWithChildren) {
    toggleDesktopMenuLevel(item);
  }
});
