const BrandingElements = require('./nav-toggle/branding-elements');
const ToggleWidgets = require('./nav-toggle/toggle-widgets');
const NavToggleDropdown = require('./nav-toggle/nav-toggle-dropdown');

const MenuDropdown = BrandingElements.MENU;

function isScrollable(element) {
  return element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight;
}

const isMobile = () => window.matchMedia('(max-width: 992px)').matches;

const AllElements = BrandingElements.BRANDING_ELEMENTS;

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
      ToggleWidgets.close();
    },
    onClose: ToggleWidgets.open
  });
});

if (Object.keys(MenuDropdown).length !== 0) {
  MenuDropdown.init({
    onOpen: () => {
      keys.forEach((key) => {
        AllElements[key].close();
      });
      ToggleWidgets.close();
    },
    onClose: ToggleWidgets.open
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
    ToggleWidgets.open();
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

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', closeFromOutside);

  // Prevent body scroll through shared header element when full screen  menu is open.
  const body =   document.querySelector('body');
  body.addEventListener('wheel', blockBrandingScroll, { passive: false });
  body.addEventListener('scroll', blockBrandingScroll, { passive: false });
  body.addEventListener('touchmove', blockBrandingScroll, { passive: false });

});
