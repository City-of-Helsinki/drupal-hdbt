(async () => {
  const {close, open} = await import(/* webpackChunkName: "toggleWidgets" */ './nav-toggle/toggle-widgets');
  const NavToggle = await import(/* webpackChunkName: "navToggleDropdown" */ './nav-toggle/nav-toggle-dropdown');
  const NavToggleDropdown = NavToggle.default;

  const BRANDING_ELEMENTS = {};
  let MENU;
  let MenuDropdown = {};

  // Check what features on branding navigation are on.
  if (drupalSettings.hdbt.profile_dropdown === true) {
    BRANDING_ELEMENTS.ProfileDropdown = 'profile';
  }

  if (drupalSettings.hdbt.search_dropdown === true) {
    BRANDING_ELEMENTS.SearchDropdown = 'search';
  }

  if (drupalSettings.hdbt.otherlangs_dropdown === true) {
    BRANDING_ELEMENTS.OtherLangsDropdown = 'otherlangs';
  }

  if (drupalSettings.hdbt.global_menu === true) {
    MENU = await import(/* webpackChunkName: "globalMenu" */ './nav-global/menu');
    MenuDropdown = MENU.default;
  }

  function isScrollable(element) {
    return element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight;
  }

  const isMobile = () => window.matchMedia('(max-width: 992px)').matches;

  const AllElements = BRANDING_ELEMENTS;

  const keys = Object.keys(AllElements);

  keys.forEach((key) => {
    const name = AllElements[key];
    AllElements[key] = NavToggleDropdown();
    AllElements[key].init({
      name: `${name} dropdown`,
      buttonSelector: `.js-${name}-button`,
      targetSelector: `#${name}`,
      onOpen: () => {
        for (let i = 0; i < AllElements.length; i += 1) {
          const OtherElements = AllElements;
          // Delete the current index from the AllElements array.
          OtherElements.splice(i,1);
          // Close all but the current index element.
          if (OtherElements.length !== 0) {
            OtherElements[i][1].close();
          }
        }
        if (Object.keys(MenuDropdown).length !== 0) {
          MenuDropdown.close();
        }
        close();
      },
      onClose: open
    });
  });
  if (Object.keys(MenuDropdown).length !== 0) {
    MenuDropdown.init({
      onOpen: () => {
        keys.forEach((key) => {
          AllElements[key].close();
        });
        close();
      },
      onClose: open
    });
  }

  /**
   * See if menu instance is open
   *
   * @return boolean
   */

  const isAnyMenuOpen = () => {
    let isOpen = false;

    keys.forEach((key) => {
      if (AllElements[key].isOpen()) {
        isOpen = true;
      }
    });

    if (Object.keys(MenuDropdown).length !== 0 && MenuDropdown.isOpen()) {
      isOpen = true;
    }

    return isOpen;
  };

  const closeFromOutside = ({ target }) => {
    if (target.closest('.desktop-menu, .header-top') || target.closest('.header') === null) {
      keys.forEach((key) => {
        AllElements[key].close();
      });
      if (Object.keys(MenuDropdown).length !== 0) {
        MenuDropdown.close();
      }
      open();
    }
  };

  /**
   * Blocks body scroll events when full screen menus are open.
   * @param e
   * @return boolean
   */

  const blockBrandingScroll = (e) => {
    // gesture actions are excluded
    if (e.touches && e.touches.length >1) {
      return true;
    }

    const scrolledPanel = e.target.closest('.mmenu__panel--current');
    const preventBodyScrolling =
      isMobile() &&
      isAnyMenuOpen() &&
      // Don't scroll body from shared header
      (e.target.closest('#nav-toggle-dropdown--menu') === null ||
        // If element has no overflow, it has no overscroll containment.
        // See overscroll-behavour CSS specs
        (scrolledPanel !== null && !isScrollable(scrolledPanel)));

    if (preventBodyScrolling) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };


  /**
   * Attach outside click listener to the whole branding navigation area
   * so that OtherLangs Menu and Mega menu
   * can be closed when clicking outside of branding navi block
   */

  // This used to load after DOM was loaded, but we added defer for the javascript.
  document.addEventListener('click', closeFromOutside);

  // Prevent body scroll through shared header element when full screen  menu is open.
  const body =   document.querySelector('body');
  body.addEventListener('wheel', blockBrandingScroll, { passive: false });
  body.addEventListener('scroll', blockBrandingScroll, { passive: false });
  body.addEventListener('touchmove', blockBrandingScroll, { passive: false });
})();
