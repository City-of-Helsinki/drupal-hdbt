import { close, open } from './nav-toggle/toggle-widgets';
import NavToggleDropdown from './nav-toggle/nav-toggle-dropdown';
import MenuDropdown from './nav-global/menu';

(() => {
  const brandingElements = {};
  const menu = drupalSettings.hdbt.global_menu ? MenuDropdown : undefined;

  // Check what features on header branding region are on.
  if (drupalSettings.hdbt.profile_dropdown) {
    brandingElements.ProfileDropdown = 'profile';
  }

  if (drupalSettings.hdbt.search_dropdown) {
    brandingElements.SearchDropdown = 'search';
  }

  if (drupalSettings.hdbt.otherlangs_dropdown) {
    brandingElements.OtherLangsDropdown = 'otherlangs';
  }

  if (!menu) {
    brandingElements.CssMenuDropdownDropdown = 'cssmenu';
  }

  const isScrollable = (element) => element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight;

  // Needs to be 768px as after that breakpoint user can scroll header
  // almost offscreen, open menu accidentally and not be able to scroll back up.
  const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

  const AllElements = brandingElements;

  const keys = Object.keys(AllElements);

  keys.forEach((key) => {
    const name = AllElements[key];
    AllElements[key] = NavToggleDropdown();
    AllElements[key].init({
      name: `${name} dropdown`,
      buttonSelector: `.js-${name}-button`,
      targetSelector: `#${name}`,
      onOpen: () => {
        keys.forEach((menuName) => {
          if (menuName !== key) {
            AllElements[menuName].close();
          }
        });
        if (Object.keys(MenuDropdown).length) {
          MenuDropdown.close();
        }
        close();
        if (key === 'SearchDropdown') {
          window.setTimeout(() => document.querySelector('.header-search-wrapper input[type="search"]')?.focus(), 10);
        }
      },
      onClose: open
    });
  });

  if (Object.keys(MenuDropdown).length) {
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

  const isAnyMenuOpen = () => keys.some((key) => AllElements[key].dataset && AllElements[key].isOpen()) || (Object.keys(MenuDropdown).length && MenuDropdown.isOpen());

  const closeFromOutside = ({ target }) => {
    if (target.closest('.desktop-menu, .header-top') || !target.closest('.header')) {
      keys.forEach((key) => {
        AllElements[key].close();
      });
      if (Object.keys(MenuDropdown).length) {
        MenuDropdown.close();
      }
      open();
    }
  };

  const blockBrandingScroll = (e) => {
    if (e.touches?.length > 1) return true;

    const scrolledPanel = e.target.closest('.mmenu__panel--current, .nav-toggle-dropdown__content');
    const preventBodyScrolling = isMobile() && isAnyMenuOpen() && (!e.target.closest('.nav-toggle-dropdown') || (scrolledPanel && !isScrollable(scrolledPanel)));

    if (preventBodyScrolling) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };

  document.addEventListener('click', closeFromOutside);

  const body = document.querySelector('body');
  body.addEventListener('wheel', blockBrandingScroll, { passive: false });
  body.addEventListener('scroll', blockBrandingScroll, { passive: false });
  body.addEventListener('touchmove', blockBrandingScroll, { passive: false });
})();
