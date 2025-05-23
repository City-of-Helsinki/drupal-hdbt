const toggleSidebarMenuVisibility = (item, cssClass) => {
  const toggleButton = item.querySelector('.menu__toggle-button');

  // Check if there was menu toggle button under the menu item.
  if (toggleButton !== null) {
    toggleButton.addEventListener('click', (event) => {
      item.classList.toggle(cssClass);
      toggleButton.setAttribute(
        'aria-expanded',
        toggleButton.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
      );
      event.stopPropagation();
    });
  }
};

((Drupal) => {
  Drupal.behaviors.toggleSidebarNavigation = {
    attach(context) {
      if (context !== document || window.sidebarNavigationInitialized) {
        return;
      }

      // Find all menu items with children menus.
      const sidebarNavigation = context.querySelector('.sidebar-navigation');

      if (sidebarNavigation) {
        const itemsWithChildren = sidebarNavigation.querySelectorAll('.menu__item--children');
        itemsWithChildren.forEach((item) => {
          toggleSidebarMenuVisibility(item, 'menu__item--open');
        });
      }

      // In case of section navigation find the section navigation.
      const sectionNavigations = context.querySelectorAll('.sidebar-navigation--section-navigation');
      sectionNavigations.forEach((item) => {
        toggleSidebarMenuVisibility(item, 'sidebar-navigation--section-navigation--open');
      });

      window.sidebarNavigationInitialized = true;
    }
  };
})(Drupal);
