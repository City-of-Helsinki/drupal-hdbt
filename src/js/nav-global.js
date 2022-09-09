const Mustache = require('mustache');
const cls = require('classnames');
const frontpageTranslation = Drupal.t('Frontpage', {}, { context: 'Global navigation mobile menu top level' });
const IN_PATH_WHITELIST = new RegExp(/(hel.fi|docker.so)$/);




/**
 * Related twig templates:
 * - block--mobile-navigation.html.twig
 * - menu--mobile.html.twig
 *
 * Related styles:
 * components/navigation/global
 * - _mmenu.scss
 * - _megamenu.scss
 * - _menu-toggle.scss
 *
 */

const widgetsToHideSelector = [
  '.cx-theme-helsinki-blue', // Genesys chat in kymp and sote
  '#smartti-wrapper', // Smartti chatbot in kymp
  '.aca--button--desktop, .aca--button--mobile, .aca--widget--mobile, .aca--widget--desktop', // Watson chatbot in asuminen
  '#block-kuurahealthchat', // Kuurahealth in sote
  '#ed11y-panel' // Editoria11y accessibility tool
];

function toggleWidgets(hide) {
  const widgets = document.querySelectorAll(widgetsToHideSelector.join(','));
  for (let i = 0; i < widgets.length; i++) {
    const widget = widgets[i];
    if (hide) {
      widget.dataset.cssmenuHide = true;
    } else {
      delete widget.dataset.cssmenuHide;
    }
  }
}


Array.prototype.findRecursive = function(predicate, childrenPropertyName){
  if(!childrenPropertyName){
    throw 'findRecursive requires parameter `childrenPropertyName`';
  }
  let array = [];
  array = this;
  let initialFind =  array.find(predicate);
  let elementsWithChildren  = array.filter(x=>x[childrenPropertyName]);
  if(initialFind){
    return initialFind;
  } else if(elementsWithChildren.length){
    let childElements = [];
    elementsWithChildren.forEach(x=>{
      childElements.push(...x[childrenPropertyName]);
    });
    return childElements.findRecursive(predicate, childrenPropertyName);
  } else {
    return undefined;
  }
};

/**
 * Generic object helpers for template contexts
 */

/**
 * Check if current given menu item has items
 * @returns boolean
 */

const button = function(){
// return this.hasItems
  return this.sub_tree?.length>0;
};


/**
 * Check if  given menu item url pathname matches current browser pathname
 */

const active = function () {
  try {
    return !this.external && this.url && new URL(this.url).pathname === window.location.pathname;
  }
  catch(e) {
    console.warn('Invalid url', this.url);
  }
  return false;
};

/**
 * Check if current given menu item url pathname is part of current full pathname
 */

const inPath = function () {
  try {
    const url = new URL(this.url);
    return !this.external && url && IN_PATH_WHITELIST.test(url.hostname) && window.location.pathname.includes(url.pathname);
  }
  catch(e) {
    console.warn('Invalid url', this.url);
  }
  return false;
};

/**
 * Panel main object.
 */

const Panel = {
  compileTemplates : function(){
    this.templates = { panel: `
{{#panels}}
  <section class="{{panel_class}}">
    <div class="mmenu__panel-body">
      <div class="mmenu__language">
        ${document.querySelector('.js-language-switcher')?.outerHTML}
      </div>
      {{#back}}
        <button class="mmenu__back">
          <span class="mmenu__back-wrapper">{{back}}</span>
        </button>
      {{/back}}
      <a class="mmenu__title-link{{#inPath}} mmenu__title-link--in-path{{/inPath}}"{{#active}} aria-current="page"{{/active}} href="{{url}}">{{name}}</a>
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
    list:
  `
  <ul class="mmenu__items">
    {{#sub_tree}}
      <li class="mmenu__item">
        <a href={{url}} class="mmenu__item-link{{#inPath}} mmenu__item-link--in-path{{/inPath}}"{{#active}} aria-current="page"{{/active}}>{{name}}</a>
        {{#button}}
          <button class="mmenu__forward " value={{id}} />
        {{/button}}
      </li>
    {{/sub_tree}}
  </ul>
 `
    };},
  menu:null,
  templates:null,
  SCROLL_TRESHOLD:100,
  //Maximum assumed depth of tree. Used for checking if going up is allowed
  size: 5,
  data:null,
  currentIndex: 0,
  cacheKey: 'hdbt-mobile-menu',
  enableCache: false,
  selectors:{
    container:'#mmenu',
    rootId:'mmenu__panels',
    forward:'mmenu__forward',
    back:'mmenu__back'
  },
  // We use this same url for pointing to frontpage instance at the root level
  getAPIUrl:function(){
    const frontpageInstanceDomain =  window.location.hostname.indexOf('docker.so') != -1 ? '//helfi-etusivu.docker.so' : '';
    const currentLangCode = drupalSettings?.path?.currentLanguage || 'fi';
    return `${frontpageInstanceDomain}/${currentLangCode}/api/v1/global-menu?_format=json`;
  },
  getRoot:function(){
    return document.getElementById(this.selectors.rootId);
  },
  sortPanelsByPath:function() {
    const panels = [];
    const allItems = this.data;
    const currentItem = allItems.findRecursive( item => active.call(item) ,'sub_tree');
    let parentIndex = currentItem?.sub_tree?.length ? currentItem.id : currentItem?.parentId;

    while(parentIndex) {
      const found = allItems.findRecursive(({id,url,name,sub_tree,parentId}) => {
        if(id === parentIndex) {
          panels.push({sub_tree,name, url,parentId});
          //set new parent id. If this is empty, it will stop the while-loop.
          parentIndex = parentId;
          return true;
        }
        return false;
      }, 'sub_tree');

      if (!found) {
        // Stop while-loop.
        parentIndex = undefined;
      }

    }

    panels.push({sub_tree:allItems});
    panels.reverse();
    this.currentIndex = panels.length-1;
    this.content = [...panels];
  },
  content:[],
  getView: function(state){
    // Note the use of arrow functions and non-arrow functions for scope of "this" in panel rendering.
    // Use arrow to access Panel object, non-lexical function for accessing current iterable object in template.
    return this.content.map( (item,i) => ({
      ...item,
      name:item?.name || frontpageTranslation,

      // If current item has subitems, show button for next panel.
      button,
      active,
      inPath,
      // Show title of previously clicked item in Back-button (or Frontpage)
      back: ( i >0) ? this.content.at(i-1)?.name ?? frontpageTranslation : false ,
      /***
       * Define correct starting positions for each panel, depeding on traversal direction
       * At start, first item is on stage and anything else must be on right.
       * When going forward in the menu, current -1  item must be on stage and current item starts from right
       * When going backward in the menu, current +1 item must be on stage and current item starts from left
       *
       * At render, -left  (down to root) and -right (up the tree) classes are added and removed accordingly to achieve wanted animation and final state.
       */
      panel_class: cls({
        'mmenu__panel':true,
        'mmenu__panel--visible':true,
        'mmenu__panel--current':i === this.currentIndex,
        'mmenu__panel--visible-right':  (state === 'start' && i > this.currentIndex ) || (state === 'up' && i >= this.currentIndex ) ||( state === 'down' && i > this.currentIndex+1 ),
        'mmenu__panel--visible-left': (state  === 'up' && i<this.currentIndex-1)  || (state === 'down' && i <= this.currentIndex)
      })
    }));
  },
  up: function (parentId) {
    if(this.currentIndex===this.size) {
      console.warn('Panel max size reached', this.size);
      return;
    }
    if(!parentId) {
      throw new Error('missing id for menu item ' + parentId);
    }
    /**
     * Find the item corresponding to given id in item arrow click event.
     * It's items will be the new current panel. Old panel swipes left.
     */
    const next = this.content.at(this.currentIndex).sub_tree.find(({
      id
    }) => id === parentId);

    if(!next) {
      throw new Error('ID mismatch in menu items'+ parentId);
    }

    this.currentIndex= this.currentIndex+ 1 < this.size ? this.currentIndex+ 1 : this.currentIndex;
    this.content[this.currentIndex] = next;
    this.render('up');
  },
  down: function () {
    if(this.currentIndex=== 0) {return;}
    this.currentIndex= this.currentIndex- 1 >= 0 ? this.currentIndex- 1 : this.currentIndex;
    this.render('down');
  },
  render:function(state) {
    const root = this.getRoot();
    root.innerHTML = Mustache.render(this.templates.panel, {
      panels: this.getView(state),
    }, {
      sub_tree: this.templates.list,
    });

    if(state === 'load') {
      return;
    }

    const panels = [...root.querySelectorAll('.mmenu__panel')];
    const current =  panels.at(this.currentIndex);

    if(root.parentElement.scrollTop > this.SCROLL_TRESHOLD && this.currentIndex> 0) {
      current.querySelector('.mmenu__back').scrollIntoView({block:'start',behaviour:'smooth'});
    }

    setTimeout(()=>{

      current.classList.remove('mmenu__panel--visible-right','mmenu__panel--visible-left');
      switch (state) {

      case 'up':
        panels.at(this.currentIndex-1).classList.add('mmenu__panel--visible-left');
        break;

      case 'down':
        panels.at(this.currentIndex+1).classList.add('mmenu__panel--visible-right');
        break;

      default:

      }

      setTimeout(()=>{
        /**
         * Hide prev & next panels from screen readers by adding visibility:hidden.
         * DO NOT USE display:none. Display needs to be set to 'flex' or panels will collapse.
        */
        panels.forEach( panel => {
          if(!panel.classList.contains('mmenu__panel--current')) {
            panel.style.visibility = 'hidden';
          }
        });
      /**
       * See $-transition-duration in _mmenu.scss.
       * Timeout must not be shorter than animation duration.
       */
      },200);

    },10); // Transition classes need to be added after initial render.
  },
  load: async function(){

    const MENU = await fetch(this.getAPIUrl());
    const data = await MENU.json();


    var allInstances = Object.getOwnPropertyNames(data);

    if (!allInstances.length) {
      throw new Error('No instances found in data', data);
    }
    const allItems = allInstances.map(instanceName => {
      const item = data[instanceName].menu_tree[0];
      item.parentId = '';
      return item;
    });

    this.data = allItems;
  },
  start: async function(){
    const container = document.querySelector(this.selectors.container);
    if(!this.getRoot() || !container) {
      throw new Error('Panel root not found');
    }
    // Show container and loader on start
    container.classList.add('mmenu--visible');
    this.render('load');
    try {
      await this.load();
    } catch(e) {
      console.error('Unable to load menu data, using mock menu for development purposes. Reset to nojs-fallback when integrating with actual API',e);
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
    this.getRoot().addEventListener('click', ({
      target: {
        classList,
        value: id,
        parentElement
      }
    }) => {
      // Arrow function keeps us in Panel context for "this". Take what you need from event
      if (classList && classList.contains(this.selectors.forward)) {
        this.up(id);
      } else if (classList && classList.contains(this.selectors.back) || parentElement?.classList && parentElement?.classList.contains(this.selectors.back)) {
        this.down();
      }
    });
  },
  menuIsOpen : function() {
    return window.location.hash === '#menu' || this.toggleButton.getAttribute('aria-expanded') === 'true';
  },
  disableFallback :function() {
    Panel.menu.dataset.js = true; // Switch to use js-enhanced version instead of pure css version
    //TODO toggle class instead?
    document.getElementById('js-menu-fallback').style.display = 'none';

  },
  enableFallback:function() {
    delete Panel.menu.dataset.js; // Switch to use js-enhanced version instead of pure css version
    //TODO toggle class instead?
    document.getElementById('js-menu-fallback').style.display = 'block';

  },
  menuToggle:  function() {
    if (this.menuIsOpen()) {
      this.toggleButton.setAttribute('aria-expanded', 'false');
      Panel.menu.dataset.target = 'false';
      toggleWidgets(false);
    } else {
      toggleWidgets(true);
      Panel.menu.dataset.target = 'true';
      Panel.toggleButton.setAttribute('aria-expanded', 'true');
    }
    // We should always focus the menu button after toggling the menu
    Panel.toggleButton.focus();
  }
};

/**
 * Start the panel after DOM has loaded.
 * Compiled templates need to have reliable access to header and menu elements cloned from Server DOM.
 */
document.addEventListener('DOMContentLoaded', () => {
  // See  block--mobile-navigation.html.twig for the button
  Panel.toggleButton = document.querySelector('.js-menu-toggle-button');
  if(!Panel.toggleButton){
    throw 'No toggle button for JS menu.';
  }
  // TODO Where is this #menu coming from Maybe name it better?
  Panel.menu = document.querySelector('#menu');
  if (!Panel.menu) {
    console.error('Panel not present in DOM. Cannot start JS mobile menu');
    return;
  }

  Panel.disableFallback();

  /**
   * Close menu on Escape button click if it is open.
   */
  document.addEventListener('keydown', function (e) {
    if ((e.key == 'Escape' || e.key == 'Esc' || e.keyCode == 27) && Panel.menuIsOpen()) {
      Panel.menuToggle();
    }
  });

  const start = function() {
    /**
     * Delay template compilation to menu start to ensure
     * footer & top menu blocks are rendered in main DOM before cloning them.
     *
     * Start removes itself in order to only run once.
     */
    Panel.compileTemplates();
    Panel.toggleButton.removeEventListener('click',start);
    Panel.start();
  };

  /**
   * Add start-event to menu toggle button.
   *
   * Add Menu toggle function to menu button.
   * Side effects:
   * Toggles chat widget display values and aria-expanded states and clears menu hash when closing.
   */
  Panel.toggleButton.addEventListener('click',start);
  Panel.toggleButton.addEventListener('click',()=>Panel.menuToggle());

  /**
   * Open menu if it is required in the hash, then clear hash.
   */
  if (Panel.menuIsOpen()) {
    window.location.hash = '';
    start();
    Panel.menuToggle();
  }
});
