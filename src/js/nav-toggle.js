const ToggleWidgets = require('./nav-global/toggle-widgets');
const NavToggleDropdown = require('./nav-global/nav-toggle-dropdown');
const MenuDropdown = require('./nav-global/menu');

function isScrollable(element) {
  return element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight;
}

const isMobile = () => window.matchMedia('(max-width: 992px)').matches;

const ProfileDropdown = NavToggleDropdown();

ProfileDropdown.init({
  name: 'Profile dropdown',
  buttonSelector: '.js-profile-button',
  targetSelector: '#profile',
  onOpen: () => {
    ToggleWidgets.close();
  },
  onClose: ToggleWidgets.open
});

/**
 * See if menu instance is open
 *
 * @return boolean
 */

const isAnyMenuOpen = () => ProfileDropdown.isOpen();

const closeFromOutside = ({ target }) => {
  if (target.closest('.desktop-menu, .header-top') || target.closest('.header') === null) {
    ProfileDropdown.close();
    ToggleWidgets.open();
  }
};

/**
 * Blocks body scroll events when full screen menus are open.
 * @param Event
 * @return void
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
