document.addEventListener('DOMContentLoaded', function () {
  function toggleSidebarMenuLevel(item) {
    let toggleButton = item.querySelector('.menu__toggle-button');

    // Check if there was menu toggle button under the menu item.
    if (toggleButton !== null) {
      toggleButton.addEventListener('click', function (event) {
        item.classList.toggle('menu__item--collapsed');
        item.classList.toggle('menu__item--expanded');
        event.stopPropagation();
      });
    }
  }

  // Find all menu items with children menus.
  const itemsWithChildren = document
    .getElementById('block-main-navigation-level-2')
    .getElementsByClassName('menu__item--children');

  for (let item of itemsWithChildren) {
    toggleSidebarMenuLevel(item);
  }
});
