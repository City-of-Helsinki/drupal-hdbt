const MenuDropdown = require('./nav-global/menu');
const ToggleWidgets = require('./nav-global/toggle-widgets');
const NavToggleDropdown = require('./nav-global/nav-toggle-dropdown');

function isScrollable(element) {
  return element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight;
}

const isMobile = () => window.matchMedia('(max-width: 992px)').matches;
/**
 * Init Menus and bind them together so that only one menu is open at a time.
 */
const SearchDropdown = NavToggleDropdown();

const OtherLangsDropdown = NavToggleDropdown();

OtherLangsDropdown.init({
  name: 'Other languages dropdown',
  buttonSelector: '.js-otherlangs-button',
  targetSelector: '#otherlangs',
  onOpen: () => {
    MenuDropdown.close();
    SearchDropdown.close();
    ToggleWidgets.close();
  },
  onClose: ToggleWidgets.open
});

SearchDropdown.init({
  name: 'Search dropdown',
  buttonSelector: '.js-header-search__button',
  targetSelector: '#search',
  onOpen: () => {
    MenuDropdown.close();
    OtherLangsDropdown.close();
    ToggleWidgets.close();
    window.setTimeout(() => document.querySelector('.header-search-wrapper input[type="search"]')?.focus(), 10); // Delay focus until element is focusable
  },
  onClose: ToggleWidgets.open
});

const closeFromOutside = ({ target }) => {
  if (target.closest('.desktop-menu, .header-top') || target.closest('.header') === null) {
    MenuDropdown.close();
    OtherLangsDropdown.close();
    SearchDropdown.close();
    ToggleWidgets.open();
  }
};

/**
 * See if menu instance is open
 *
 * @return boolean
 */

const isAnyMenuOpen = () => MenuDropdown.isOpen() || SearchDropdown.isOpen() || OtherLangsDropdown.isOpen();

/**
 * Blocks body scroll events when full screen menus are open.
 * @param Event
 * @return void
 */

const blockBrandingScroll = (e) => {
  console.log('SCROLLAA');
  const scrolledPanel = e.target.closest('.mmenu__panel--current');
  const preventBodyScrolling =
    isMobile() &&
    isAnyMenuOpen() &&
    // dont scroll body from shared header
    (e.target.closest('#nav-toggle-dropdown--menu') === null ||
      // if element has no overflow, it has no overscroll containment.
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

MenuDropdown.init({
  onOpen: () => {
    OtherLangsDropdown.close();
    SearchDropdown.close();
    ToggleWidgets.close();
  },
  onClose: ToggleWidgets.open
});

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', closeFromOutside);
  // prevent body scroll through shared header element when full screen  menu is open.
  document.querySelector('body').addEventListener('scroll', blockBrandingScroll, { passive: false });

  // iOS does not handle scroll with regular scroll event, so we need to check touchmove
  document.querySelector('body').addEventListener('touchmove', (e) => {
    // We still want to allow two finger zoom and scroll, but prevent single finger scroll
    if (e.touches.length <= 1) {
      blockBrandingScroll(e);
    }
  }, { passive: false });
});
