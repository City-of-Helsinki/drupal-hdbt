// const MenuDropdown = require('./nav-global/menu');
// const ToggleWidgets = require('./nav-toggle/toggle-widgets');
// const NavToggleDropdown = require('./nav-toggle/nav-toggle-dropdown');
//
// function isScrollable(element) {
//   return element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight;
// }
//
// const isMobile = () => window.matchMedia('(max-width: 992px)').matches;
//
// /**
//  * Init Menus and bind them together so that only one menu is open at a time.
//  */
// const SearchDropdown = NavToggleDropdown();
//
// SearchDropdown.init({
//   name: 'Search dropdown',
//   buttonSelector: '.js-search-button',
//   targetSelector: '#search',
//   onOpen: () => {
//     MenuDropdown.close();
//     ToggleWidgets.close();
//     window.setTimeout(() => document.querySelector('.header-search-wrapper input[type="search"]')?.focus(), 10); // Delay focus until element is focusable
//   },
//   onClose: ToggleWidgets.open
// });
//
// const closeFromOutside = ({ target }) => {
//   if (target.closest('.desktop-menu, .header-top') || target.closest('.header') === null) {
//     MenuDropdown.close();
//     SearchDropdown.close();
//     ToggleWidgets.open();
//   }
// };
//
// /**
//  * See if menu instance is open
//  *
//  * @return boolean
//  */
//
// const isAnyMenuOpen = () => MenuDropdown.isOpen() || SearchDropdown.isOpen() || OtherLangsDropdown.isOpen();
//
// /**
//  * Blocks body scroll events when full screen menus are open.
//  * @param Event
//  * @return void
//  */
//
// const blockBrandingScroll = (e) => {
//    // gesture actions are excluded
//    if (e.touches && e.touches.length >1) {
//     return true;
//    }
//
//   const scrolledPanel = e.target.closest('.mmenu__panel--current');
//   const preventBodyScrolling =
//     isMobile() &&
//     isAnyMenuOpen() &&
//     // Don't scroll body from shared header
//     (e.target.closest('#nav-toggle-dropdown--menu') === null ||
//       // If element has no overflow, it has no overscroll containment.
//       // See overscroll-behavour CSS specs
//       (scrolledPanel !== null && !isScrollable(scrolledPanel)));
//
//   if (preventBodyScrolling) {
//     e.preventDefault();
//     e.stopPropagation();
//     return false;
//   }
// };
//
// /**
//  * Attach outside click listener to the whole branding navigation area
//  * so that OtherLangs Menu and Mega menu
//  * can be closed when clicking outside of branding navi block
//  */
//
// MenuDropdown.init({
//   onOpen: () => {
//     SearchDropdown.close();
//     ToggleWidgets.close();
//   },
//   onClose: ToggleWidgets.open
// });
//
// document.addEventListener('DOMContentLoaded', () => {
//   document.addEventListener('click', closeFromOutside);
//
//   // Prevent body scroll through shared header element when full screen  menu is open.
//   const body =   document.querySelector('body');
//   body.addEventListener('wheel', blockBrandingScroll, { passive: false });
//   body.addEventListener('scroll', blockBrandingScroll, { passive: false });
//   body.addEventListener('touchmove', blockBrandingScroll, { passive: false });
//
// });
