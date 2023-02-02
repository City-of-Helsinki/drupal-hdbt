document.addEventListener('DOMContentLoaded', function startSidebarNavigation() {
  function toggleSidebarMenuVisibility(item, cssClass) {
    const toggleButton = item.querySelector('.menu__toggle-button');

    // Check if there was menu toggle button under the menu item.
    if (toggleButton !== null) {
      toggleButton.addEventListener('click', function onClickToggle(event) {
        item.classList.toggle(cssClass);
        toggleButton.setAttribute(
          'aria-expanded',
          toggleButton.getAttribute('aria-expanded') === 'true' ? 'false' : 'true',
        );
        event.stopPropagation();
      });
    }
  }

  // Find all menu items with children menus.
  const sidebarNavigation = document.getElementsByClassName('sidebar-navigation');
  if (typeof sidebarNavigation !== 'undefined') {
    if (sidebarNavigation[0]) {
      const itemsWithChildren = sidebarNavigation[0].getElementsByClassName('menu__item--children');

      // eslint-disable-next-line no-restricted-syntax
      for (const item of itemsWithChildren) {
        toggleSidebarMenuVisibility(item, 'menu__item--open');
      }
    }
  }

  // In case of section navigation find the section navigation.
  const sectionNavigation = document.getElementsByClassName('sidebar-navigation--section-navigation');
  if (typeof sectionNavigation !== 'undefined') {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of sectionNavigation) {
      toggleSidebarMenuVisibility(item, 'sidebar-navigation--section-navigation--open');
    }
  }
});
