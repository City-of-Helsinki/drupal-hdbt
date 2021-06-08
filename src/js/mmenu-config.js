document.addEventListener('DOMContentLoaded', () => {
  // Get the burger link element.
  const burger = document.getElementById('menu-hamburger');
  const languageSwitcher = document.getElementById('block-language-switcher');
  const mobileFooterTemplate = document.getElementById(
    'mobile-navigation-footer-template'
  );
  const mobileFooter = mobileFooterTemplate.cloneNode(true);
  const headerTop = document.getElementById('hdbt-header-top');

  if (headerTop) {
    // Mobile footer elements.
    mobileFooterTemplate.remove();
    mobileFooter.id = 'mobile-navigation-footer';
    mobileFooter.classList.add('mobile-navigation__footer');
    mobileFooter.appendChild(headerTop.cloneNode(true)); //add the DOM reference you have
  }

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

  // Apply the mobile navigation footer.
  const mobileNavigation = document.getElementById('mm-1');
  mobileNavigation.appendChild(mobileFooter);

  // Open panel with active element.
  const panel = document.querySelector('#mobile-navigation .is-active');
  if (panel.parentNode.parentNode) {
    api.openPanel(panel.parentNode.parentNode);
  }
});
