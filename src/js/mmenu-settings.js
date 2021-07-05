document.addEventListener('DOMContentLoaded', () => {
  // Initialize mobile menu.
  function initializeMobileMenu() {
    // Get the burger link element, language switcher, a template for mobile
    // footer and header links.
    const burger = document.querySelector(
      '[data-hdbt-selector="menu-hamburger"]'
    );
    const languageSwitcher = document.querySelector(
      '[data-hdbt-selector="language-switcher"]'
    );
    const mobileFooterTemplate = document.querySelector(
      '[data-hdbt-selector="mobile-navigation-footer-template"]'
    );
    const headerTop = document.querySelector(
      '[data-hdbt-selector="hdbt-header-top"]'
    );
    // Fire the mmenu plugin.
    /* global Mmenu */
    const menu = new Mmenu('#mobile-navigation', {
      slidingSubmenus: false,
      lazySubmenus: true,
      extensions: ['position-bottom', 'fullscreen'],
      setSelected: {
        hover: true,
        parent: true,
      },
      keyboardNavigation: {
        enable: true,
      },
    });
    // Get the mmenu API
    const api = menu.API;
    // Bind the burger icon change to menu opening via API.
    api.bind('open:start', () => {
      burger.setAttribute('aria-expanded', 'true');
      languageSwitcher.classList.remove('scroll-up');
    });
    // Bind the burger icon change to menu closing via API.
    api.bind('close:start', () => {
      burger.setAttribute('aria-expanded', 'false');
    });
    // Clone header links to mobile footer if both of them exist and apply
    // the mobile navigation footer.
    if (headerTop && mobileFooterTemplate) {
      // Mobile footer elements.
      const mobileFooter = mobileFooterTemplate.cloneNode(true);
      mobileFooterTemplate.remove();
      mobileFooter.id = 'mobile-navigation-footer';
      mobileFooter.classList.add('mobile-navigation__footer');
      mobileFooter.appendChild(headerTop.cloneNode(true));
      const mobileNavigation = document.getElementById('mm-1');
      mobileNavigation.appendChild(mobileFooter);
    }
    // Open panel with active element.
    const panel = document.querySelector('#mobile-navigation .is-active');
    if (panel && panel.parentNode.parentNode) {
      api.openPanel(panel.parentNode.parentNode);
    }
  }
  // Get the mobile navigation.
  const initializeMenu = document.querySelector(
    '[data-hdbt-selector="mobile-navigation"]'
  );
  // Initialize mobile navigation if the mobile navigation element exists.
  if (initializeMenu) {
    initializeMobileMenu();
  }
});
