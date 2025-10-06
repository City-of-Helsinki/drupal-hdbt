import { close, open } from './nav-toggle/toggle-widgets';
import NavToggleDropdown from './nav-toggle/nav-toggle-dropdown';
import MenuDropdown from './nav-global/menu';

// Not using 'once()' here because NavToggleDropdown manages its own init state via 'this.running'.
// Using 'once()' would interfere with dropdown lifecycle and cause skipped or incomplete setups.

((Drupal) => {
  Drupal.behaviors.navToggle = {
    attach(context, settings) {
      if (window.navToggleInitialized && context === document) {
        return;
      }

      const brandingElements = {};
      // Check if global menu is enabled.
      const globalMenu = settings.hdbt.global_menu ? MenuDropdown : false;

      // Check what features on header branding region are on.
      if (settings.hdbt.profile_dropdown) {
        brandingElements.ProfileDropdown = 'profile';
      }

      if (settings.hdbt.search_dropdown) {
        brandingElements.SearchDropdown = 'search';
      }

      if (settings.hdbt.otherlangs_dropdown) {
        brandingElements.OtherLangsDropdown = 'otherlangs';
      }

      if (!globalMenu) {
        brandingElements.CssMenuDropdownDropdown = 'cssmenu';
      }

      if (settings.hdbt.language_toast_dropdown) {
        const currentLanguage = settings.hdbt.current_language;
        const supportedLanguages = ['fi', 'sv', 'en'];

        supportedLanguages.forEach((language) => {
          if (language !== currentLanguage) {
            // The charAt(0).toUpperCase().slice(1) here capitalizes the first letter.
            const key = `LanguageToast${language.charAt(0).toUpperCase()}${language.slice(1)}`;
            brandingElements[key] = `language-toast--${language}`;
          }
        });
      }

      // Checks if an element has scrollable overflow in either direction.
      const isScrollable = (element) =>
        element.scrollWidth > element.clientWidth ||
        element.scrollHeight > element.clientHeight;

      const isMobile = () => window.matchMedia('(max-width: 992px)').matches;

      const AllElements = brandingElements;

      const keys = Object.keys(AllElements);

      // Function to close dropdown when focus moves outside of it.
      const closeOnFocusOut = (wrapper, dropdownClose, instance) => {
        const handler = () => {
          setTimeout(() => {
            const active = document.activeElement;
            if (!wrapper.contains(active)) {
              dropdownClose();
            }
          }, 10);
        };

        const attachHandler = () => {
          wrapper.removeEventListener('focusout', handler);

          if (!isMobile() || instance?.startsWith('LanguageToast')) {
            wrapper.addEventListener('focusout', handler);
          }
        };

        attachHandler();

        window.addEventListener('resize', attachHandler);
      };

      keys.forEach((key) => {
        const name = AllElements[key];
        AllElements[key] = NavToggleDropdown();
        AllElements[key].init({
          buttonSelector: `.js-${name}-button`,
          dropdownSelector: `.js-${name}-dropdown`,
          name: `${name} dropdown`,
          onClose: open,
          onOpen: () => {
            // Close all open menus before opening a new one.
            keys.forEach((menuName) => {
              if (menuName !== key) {
                AllElements[menuName].simpleClose();
              }
            });
            // Close global menu if it is open.
            if (globalMenu) globalMenu.close();

            // Close all third party dropdowns.
            close();

            // Focus search field on open and delay focus
            // until element is focusable.
            if (key === 'SearchDropdown') {
              window.setTimeout(() => document.querySelector('.header-search-wrapper input[type="search"]')?.focus(), 10);
            }

            const dropdownInstance = AllElements[key];
            let menuWrapper = dropdownInstance?.dropdownInstance;

            // Language toast dropdown is inside language link wrapper.
            if (key.startsWith('LanguageToast')) {
              menuWrapper = dropdownInstance?.dropdownInstance?.parentElement;
            }

            if (menuWrapper) {
              closeOnFocusOut(menuWrapper, () => dropdownInstance.simpleClose(), key);
            }

          },
          targetSelector: `#${name}`,
        });
      });

      // Initialize global menu if it is available.
      if (globalMenu) {
        globalMenu.init({
          onOpen: () => {
            keys.forEach((key) => {
              AllElements[key].close();
            });
            const wrapper = document.getElementById('nav-toggle-dropdown--menu');
            if (wrapper) {
              closeOnFocusOut(wrapper, () => globalMenu.close());
            }
            close();
          },
          onClose: open
        });
      }

      // Check if any menu instance is open.
      const isAnyMenuOpen = () => keys.some((key) => AllElements[key].dataset && AllElements[key].isOpen()) || (globalMenu && globalMenu.isOpen());

      // Close all open menus on click outside.
      const closeFromOutside = ({ target }) => {
        if (target.closest('.desktop-menu, .header-top') || !target.closest('.header')) {
          // Close all open menus.
          keys.forEach((key) => {
            AllElements[key].simpleClose();
          });

          // Close global menu if it is open.
          if (globalMenu) globalMenu.close();

          // Reveal hidden UI elements.
          open();
        }
      };

      // Prevent body scrolling when menus are open.
      const blockBrandingScroll = (e) => {
        // Ignore touch events.
        if (e.touches?.length > 1) return true;

        const scrolledPanel = e.target.closest('.mmenu__panel--current, .nav-toggle-dropdown__content');

        // Prevent scrolling when menu is open.
        const preventBodyScrolling =
          isMobile() &&
          isAnyMenuOpen() &&
          // Don't scroll body from shared header.
          (!e.target.closest('.nav-toggle-dropdown') ||
          // If element has no overflow, it has no overscroll containment.
          // See overscroll-behavior CSS specifications.
          (scrolledPanel && !isScrollable(scrolledPanel)));

        if (preventBodyScrolling) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      };


      // Attach outside click listener to the whole header branding region area,
      // so that other languages menu and mega menu can be closed when clicking
      // outside of header branding region.
      context.addEventListener('click', closeFromOutside);

      // Prevent body scroll through shared header element when
      // full screen menu is open.
      const body = document.querySelector('body');
      body.addEventListener('wheel', blockBrandingScroll, { passive: false });
      body.addEventListener('scroll', blockBrandingScroll, { passive: false });
      body.addEventListener('touchmove', blockBrandingScroll, { passive: false });
      window.navToggleInitialized = true;
    }
  };
})(Drupal);
