import Mustache from 'mustache';
import cls from 'classnames';

const frontpageTranslation = Drupal.t('Frontpage', {}, { context: 'Global navigation mobile menu top level' });
const openSubMenuTranslation = Drupal.t('Open submenu:', {}, { context: 'Mobile navigation menu prefix' });
const openParentMenuTranslation = Drupal.t('Open parent menu:', {}, { context: 'Mobile navigation menu prefix' });

// eslint-disable-next-line no-extend-native
Array.prototype.findRecursive = function findRecursivelyFromArray(predicate, childrenPropertyName) {
  if (!childrenPropertyName) {
    throw new Error('findRecursive requires parameter `childrenPropertyName`');
  }
  let array = [];
  array = this;
  const initialFind = array.find(predicate);
  const elementsWithChildren = array.filter((x) => x[childrenPropertyName]);
  if (initialFind) {
    return initialFind;
  }
  if (elementsWithChildren.length) {
    const childElements = [];
    elementsWithChildren.forEach((x) => {
      childElements.push(...x[childrenPropertyName]);
    });
    return childElements.findRecursive(predicate, childrenPropertyName);
  }
  return undefined;
};

/**
 * Generic object helpers for template contexts
 */

/**
 * Check if current given menu item has items
 * @return {boolean} current object has sub_tree with items in it.
 */
function button() {
  // return this.hasItems
  return this.sub_tree?.length > 0;
}

/**
 * Check if  given menu item url pathname matches current browser pathname
 * @return {boolean} current object has url and url pathname matches current location pathname
 */
function isCurrentPath() {
  let url;

  try {
    url = new URL(this.url).pathname;
  }
  catch (e) {
    url = this.url;
  }
  return !this.external && this.url && url === window.location.pathname;
}

/**
 * Convert null `active` values to boolean for mustache templates to avoid using parent values
 * @return {boolean} does current object have active set and trueish
 */
function isActive() {
  return !!this.active;
}

/**
 * Convert null `inPath` values to boolean for mustache templates to avoid using parent values
 * @return {boolean} does current object have inPath set and trueish
 */
function isInPath() {
  return !!this.inPath;
}

/**
 * Convert null `is_injected` values to boolean for mustache templates to avoid using parent values
 * @return {boolean} does current object have is_injected set and trueish
 */
function isInjected() {
  return !!this.is_injected;
}

/** *
 * Convert attributes to to template-friendly object
 * @return {object}  {external:bool, protocol:bool}
 */
function externalLinkAttributes() {
  return {
    external: this.attributes['data-external'] || this.external || false,
    protocol: this.attributes['data-protocol'] || false,
  };
}

/**
 * Convert null `attributes.lang` values to boolean for mustache templates to avoid using parent values
 * @return {boolean} does current object have attributes.lang set and trueish
 */
function hasLang() {
  return !!this.attributes?.lang;
}

/**
 * Determinine icon type and text for external link
 * @return {object} {class: list of related CSS classes, text: translated description text }
 */
function externalLinkIcon() {
  if (!this.external) {
    return false;
  }

  return externalLinkIcon.ICONS[this.attributes['data-protocol']] || externalLinkIcon.ICONS.external;
}

externalLinkIcon.ICONS = {
  mailto: {
    class: 'link__type link__type--mailto',
    text: Drupal.t(
      'Link opens default mail program',
      {},
      {
        context:
          'Explanation for screen-reader software that the icon visible next to this link means that the link opens default mail program.',
      },
    ),
  },
  tel: {
    class: 'link__type link__type--tel',
    text: Drupal.t(
      'Link starts a phone call',
      {},
      {
        context:
          'Explanation for screen-reader software that the icon visible next to this link means that the link starts a phone call.',
      },
    ),
  },
  external: {
    class: 'link__type link__type--external',
    text: Drupal.t(
      'Link leads to external service',
      {},
      {
        context:
          'Explanation for screen-reader software that the icon visible next to this link means that the link leads to an external service.',
      },
    ),
  },
};

/**
 * Panel main object.
 */

const MobilePanel = {
  compileTemplates() {
    this.templates = {
      panel: `
  {{#panels}}
    <section class="{{panel_class}}">
      <div class="mmenu__panel-body">
        {{#back}}
          <button class="mmenu__back">
            <span class="visually-hidden">{{openParentMenuTranslation}}</span>
            <span class="mmenu__back-wrapper">{{back}}</span>
          </button>
        {{/back}}
        <a href="{{url}}" class="mmenu__title-link{{#isInPath}} mmenu__title-link--in-path{{/isInPath}}"{{#isActive}} aria-current="page"{{/isActive}}

        {{#externalLinkAttributes.external}}
          data-external="true"
        {{/externalLinkAttributes.external}}

        {{#externalLinkAttributes.protocol}}
          data-protocol="{{externalLinkAttributes.protocol}}"
        {{/externalLinkAttributes.protocol}}

        ><span class="mmenu__link__text"

        {{#hasLang}}
          lang="{{attributes.lang}}"
        {{/hasLang}}

        >{{name}}</span>{{#externalLinkIcon}} <span class="{{class}}"></span><span class="visually-hidden">({{ text }})</span>{{/externalLinkIcon}}</a>
        {{>sub_tree}}
      </div>
      ${document.querySelector('.js-mmenu__footer')?.outerHTML}
    </section>
  {{/panels}}

  {{^panels}}
  <div class="mmenu__loading">
    <div class="hds-loading-spinner">
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
  {{/panels}}
  `,
      list: `
    <ul class="mmenu__items">
      {{#sub_tree}}
        <li class="mmenu__item">
          <a href="{{url}}" class="mmenu__item-link{{#isInPath}} mmenu__item-link--in-path{{/isInPath}}{{#isInjected}} mmenu__item-link--injected{{/isInjected}}"{{#isActive}} aria-current="page"{{/isActive}}
          {{#externalLinkAttributes.external}}
            data-external="true"
          {{/externalLinkAttributes.external}}
          {{#externalLinkAttributes.protocol}}
            data-protocol={{externalLinkAttributes.protocol}}
          {{/externalLinkAttributes.protocol}}

          ><span class="mmenu__link__text"

          {{#hasLang}}
            lang="{{attributes.lang}}"
          {{/hasLang}}

            >{{name}}</span>{{#externalLinkIcon}} <span class="{{class}}"></span><span class="visually-hidden">({{ text }})</span>{{/externalLinkIcon}}
          </a>
          {{#button}}
            <button class="mmenu__forward " value={{id}}><span class="visually-hidden">{{openSubMenuTranslation}} {{name}}</span></button>
          {{/button}}
        </li>
      {{/sub_tree}}
    </ul>
   `,
    };
  },
  menu: null,
  templates: null,
  SCROLL_TRESHOLD: 100,
  size: 10, // Maximum assumed depth of tree. Used for checking if going up is allowed
  running: false,
  data: null,
  currentIndex: 0,
  cacheKey: 'hdbt-mobile-menu',
  enableCache: false,
  selectors: {
    container: '#mmenu',
    rootId: 'mmenu__panels',
    forward: 'mmenu__forward',
    back: 'mmenu__back',
  },
  getAPIUrl() {
    const url = new URL(drupalSettings?.helfi_navigation?.links?.api);
    url.searchParams.set('_format', 'json');
    url.searchParams.set('max-depth', drupalSettings?.menu_depth);
    return url.toString();
  },
  getRoot() {
    return document.getElementById(this.selectors.rootId);
  },
  sortPanelsByPath() {
    const panels = [];
    const allItems = this.data;
    const currentItem = allItems.findRecursive((item) => isCurrentPath.call(item), 'sub_tree');
    let parentIndex = currentItem?.sub_tree?.length ? currentItem.id : currentItem?.parentId;

    while (parentIndex) {
      const found = allItems.findRecursive(
        // sub_tree is api  data key.
        // eslint-disable-next-line no-loop-func, camelcase,
        ({ id, url, name, sub_tree, parentId, inPath, active }) => {
          if (id === parentIndex) {
            // eslint-disable-next-line camelcase
            panels.push({ sub_tree, name, url, parentId, inPath, active });
            // Set new parent id. If this is empty, it will stop the while-loop.
            parentIndex = parentId;
            return true;
          }
          return false;
        },
        'sub_tree',
      );

      if (!found) {
        // Stop while-loop.
        parentIndex = undefined;
      }
    }
    panels.push({ sub_tree: allItems, inPath: true });
    panels.reverse();
    this.currentIndex = panels.length - 1;
    this.content = [...panels];
  },
  content: [],
  getView(state) {
    // Note the use of arrow functions and non-arrow functions for scope of "this" in panel rendering.
    // Use arrow to access Panel object, non-lexical function for accessing current iterable object in template.
    return this.content.map((item, i) => ({
      ...item,
      name: item?.name || frontpageTranslation,
      url: item.url || drupalSettings.helfi_navigation.links.canonical,
      // If current item has subitems, show button for next panel.
      button,
      isActive,
      isInPath,
      isInjected,
      externalLinkAttributes,
      hasLang,
      externalLinkIcon,
      // Show title of previously clicked item in Back-button (or Frontpage)
      back: i > 0 ? this.content.at(i - 1)?.name ?? frontpageTranslation : false,
      openSubMenuTranslation,
      openParentMenuTranslation,
      /** *
       * Define correct starting positions for each panel, depeding on traversal direction
       * At start, first item is on stage and anything else must be on right.
       * When going forward in the menu, current -1  item must be on stage and current item starts from right
       * When going backward in the menu, current +1 item must be on stage and current item starts from left
       *
       * At render, -left  (down to root) and -right (up the tree) classes are added and removed accordingly to achieve wanted animation and final state.
       */
      panel_class: cls({
        mmenu__panel: true,
        'mmenu__panel--visible': true,
        'mmenu__panel--current': i === this.currentIndex,
        'mmenu__panel--visible-right':
          (state === 'start' && i > this.currentIndex) ||
          (state === 'up' && i >= this.currentIndex) ||
          (state === 'down' && i > this.currentIndex + 1),
        'mmenu__panel--visible-left':
          (state === 'up' && i < this.currentIndex - 1) || (state === 'down' && i <= this.currentIndex),
      }),
    }));
  },
  up(parentId) {
    if (!parentId) {
      throw new Error(`Id missing for next menu item  ${parentId}`);
    }
    /**
     * Find the item corresponding to given id in item arrow click event.
     * It's items will be the new current panel. Old panel swipes left.
     */
    const next = this.content.at(this.currentIndex).sub_tree.find(({ id }) => id === parentId);

    if (!next) {
      throw new Error(`ID mismatch in menu items${parentId}`);
    }

    this.currentIndex = this.currentIndex + 1 < this.size ? this.currentIndex + 1 : this.currentIndex;
    this.content[this.currentIndex] = next;
    this.render('up');
  },
  down() {
    if (this.currentIndex === 0) {
      return;
    }
    this.currentIndex = this.currentIndex - 1 >= 0 ? this.currentIndex - 1 : this.currentIndex;
    this.render('down');
  },
  render(state) {
    const root = this.getRoot();
    root.innerHTML = Mustache.render(
      this.templates.panel,
      {
        panels: this.getView(state),
      },
      {
        sub_tree: this.templates.list,
      },
    );

    if (state === 'load') {
      return;
    }

    const panels = [...root.querySelectorAll('.mmenu__panel')];
    const current = panels.at(this.currentIndex);

    if (root.parentElement.scrollTop > this.SCROLL_TRESHOLD && this.currentIndex > 0) {
      current.querySelector('.mmenu__back').scrollIntoView({ block: 'start', behaviour: 'smooth' });
    }

    setTimeout(() => {
      current.classList.remove('mmenu__panel--visible-right', 'mmenu__panel--visible-left');
      switch (state) {
        case 'up':
          panels.at(this.currentIndex - 1).classList.add('mmenu__panel--visible-left');
          break;

        case 'down':
          panels.at(this.currentIndex + 1).classList.add('mmenu__panel--visible-right');
          break;

        default:
      }

      setTimeout(() => {
        /**
         * Hide prev & next panels from screen readers by adding visibility:hidden.
         * DO NOT USE display:none. Display needs to be set to 'flex' or panels will collapse.
         */
        panels.forEach((panel) => {
          if (!panel.classList.contains('mmenu__panel--current')) {
            panel.style.visibility = 'hidden';
          }
        });
        /**
         * See $-transition-duration in _mmenu.scss.
         * Timeout must not be shorter than animation duration.
         */
      }, 200);
    }, 10); // Transition classes need to be added after initial render.
  },
  async load() {
    const MENU = await fetch(this.getAPIUrl());
    const data = await MENU.json();
    const allInstances = Object.getOwnPropertyNames(data);

    if (!allInstances.length) {
      throw new Error('No instances found in data', data);
    }
    const allItems = allInstances.map((instanceName) => {
      const item = data[instanceName].menu_tree[0];
      item.parentId = '';
      return item;
    });

    const currentItem = allItems.findRecursive((item) => isCurrentPath.call(item), 'sub_tree');

    if (currentItem) {
      currentItem.active = true;
      currentItem.inPath = true;
    }

    let parentIndex = currentItem?.parentId;

    while (parentIndex) {
      // eslint-disable-next-line no-loop-func
      const found = allItems.findRecursive((item) => {
        if (item.id === parentIndex) {
          // set new parent id. If this is empty, it will stop the while-loop.
          parentIndex = item.parentId;
          item.inPath = true;
          return true;
        }
        return false;
      }, 'sub_tree');

      if (!found) {
        // Stop while-loop.
        parentIndex = undefined;
      }
    }
    this.data = allItems;
  },
  async start() {
    const container = document.querySelector(this.selectors.container);
    if (!this.getRoot() || !container) {
      throw new Error('Panel root not found');
    }
    // Show container and loader on start
    container.classList.add('mmenu--visible');
    this.render('load');
    try {
      await this.load();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(
        'Unable to load menu API, using fallback menu instead',
        e,
      );
      this.enableFallback();
      return;
    }
    /**
     * Set the panels according to current path.
     */
    this.sortPanelsByPath();
    this.render('start');
    /**
     * Panel event listener:
     *
     *  Bind one click event listener to main panel. One for all click events.!
     *  Add more if one handler becomes too cumbersome.
     *  */
    this.getRoot().addEventListener('click', (e) => {
      // Arrow function keeps us in Panel context for "this". Take what you need from event
      const {
        target: { classList, value: id, parentElement },
      } = e;

      e.stopImmediatePropagation();
      // Or outside-of-menu-click listener will be triggered incorrectly due to rerender before parent lookup.
      // See nav-global.js

      if (classList && classList.contains(this.selectors.forward)) {
        this.up(id);
      } else if (
        (classList && classList.contains(this.selectors.back)) ||
        (parentElement?.classList && parentElement?.classList.contains(this.selectors.back))
      ) {
        this.down();
      }
    });
  },
  isOpen() {
    return window.location.hash === '#menu' || this.toggleButton.getAttribute('aria-expanded') === 'true';
  },
  disableFallback() {
    this.menu.dataset.js = true; // Switch to use js-enhanced version instead of pure css version
  },
  enableFallback() {
    this.menu.dataset.target = 'false'; // Close the menu with js so that we can use css version instead
    this.getRoot().innerHTML = ''; // Remove rotator
    delete this.menu.dataset.js; // Switch to use pure css version instead of js-enhanced version
    window.location.hash = '#menu'; // Open menu with the css way
  },
  close() {
    this.toggleButton.setAttribute('aria-expanded', 'false');
    this.menu.dataset.target = 'false';
    if (this.onClose) {
      this.onClose();
    }
  },
  open() {
    this.menu.dataset.target = 'true';
    this.toggleButton.setAttribute('aria-expanded', 'true');
    if (this.onOpen) {
      this.onOpen();
    }
  },
  toggle() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
    // We should always focus the menu button after toggling the menu
    this.toggleButton.focus();
  },
  init({ onOpen, onClose }) {
    /**
     * Start the panel after DOM has loaded.
     * Compiled templates need to have reliable access to header and menu elements cloned from Server DOM.
     */
    if (this.running) {
      // eslint-disable-next-line no-console
      console.warn('MobilePanel already initiated. Is it include more than once?');
      return;
    }
    this.onOpen = onOpen;
    this.onClose = onClose;

    // This used to load after DOM was loaded, but we added defer for the javascript.
    // See  block--mobile-navigation.html.twig for the button
    this.toggleButton = document.querySelector('.js-menu-toggle-button');
    if (!this.toggleButton) {
      throw new Error('No toggle button for JS menu.');
    }
    // TODO: UHF-8791 Where is this #menu coming from? Maybe name it better (https://helsinkisolutionoffice.atlassian.net/browse/UHF-8791).
    this.menu = document.querySelector('#menu');
    if (!this.menu) {
      // eslint-disable-next-line no-console
      console.error('Panel not present in DOM. Cannot start JS mobile menu');
      return;
    }

    this.disableFallback();

    /**
     * Close menu on Escape button click if it is open.
     */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
        this.toggleButton.focus();
      }
    });

    const start = () => {
      /**
       * Delay template compilation to menu start to ensure
       * footer & top menu blocks are rendered in main DOM before cloning them.
       *
       * Start removes itself in order to only run once.
       */
      this.compileTemplates();
      this.toggleButton.removeEventListener('click', start);
      this.start();
    };
    /**
     * Add start-event to menu toggle button.
     *
     * Add Menu toggle function to menu button.
     * Side effects:
     * Toggles chat widget display values and aria-expanded states and clears menu hash when closing.
     */
    this.toggleButton.addEventListener('click', start);
    this.toggleButton.addEventListener('click', () => this.toggle());

    /**
     * Open menu if it is required in the hash, then clear hash.
     */
    if (this.isOpen()) {
      window.location.hash = '';
      start();
      this.open();
    }
    this.running = true;
  },
};

export default MobilePanel;
