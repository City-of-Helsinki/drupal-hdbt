const Mustache = require('mustache');
const mockmenu = require('./MOCK_MENU');
const cls = require('classnames');
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
const menu = document.querySelector('#menu');

if (menu) {
  menu.dataset.js = true; // Switch to use js-enhanced version instead of pure css version
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
 *
 * Generic object helpers for template contexts
 *
 */

const button = function(){
  return this.items?.length>0;
};

const active = function () {
  return new RegExp(`^${this.url}$`).test(window.location.pathname);
};

const inPath = function () {
  return new RegExp(`^${this.url}`).test(window.location.pathname);
};

/**
 * Panel main object.
 *
 */

const Panel = {
  /**
   * Compile templates at request to ensure direct DOM queries are made to completed DOM.
   */
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
      <a class="mmenu__title-link{{#inPath}} mmenu__title-link--in-path{{/inPath}}"{{#active}} aria-current="page"{{/active}} href="{{url}}">{{title}}</a>
      {{>items}}
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
    {{#items}}
      <li class="mmenu__item">
        <a href={{url}} class="mmenu__item-link{{#inPath}} mmenu__item-link--in-path{{/inPath}}"{{#active}} aria-current="page"{{/active}}>{{title}}</a>
        {{#button}}
          <button class="mmenu__forward " value={{id}} />
        {{/button}}
      </li>
    {{/items}}
  </ul>
 `
    };},
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
  getRoot:function(){
    return document.getElementById(this.selectors.rootId);
  },
  sortPanelsByPath:function() {
    const allItems = this.data.items;
    const currentItem = allItems.findRecursive( item => active.call(item),'items' );
    let parentId = currentItem?.parent;
    const panels = [];
    while(parentId) {
      allItems.findRecursive(({id,url,title,items,parent}) => {
        if(id === parentId) {
          panels.push({items,title, url,parent});
          //set new parent id. If this is empty, it will stop the while-loop.
          parentId = parent;
          return true;
        }
        return false;
      }, 'items');

    }
    panels.push({items:allItems});
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
      title:item?.title ||  Drupal.t('Frontpage','Global navigation mobile menu top level'),
      // If current item has subitems, show button for next panel.
      button,
      active,
      inPath,
      // Show title of previously clicked item in Back-button (or Frontpage)
      back: ( i >0) ? this.content.at(i-1)?.title ?? Drupal.t('Frontpage','Global navigation mobile menu top level') : false ,
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
      return;
    }
    if(!parentId) {
      throw new Error('missing id for menu item ' + parentId);
    }
    /**
     * Find the item corresponding to given id in item arrow click event.
     * It's items will be the new current panel. Old panel swipes left.
     */
    const next = this.content.at(this.currentIndex).items.find(({
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
      items: this.templates.list,
    });

    if(state === 'load') {
      return;
    }

    const panels = [...root.querySelectorAll('.mmenu__panel')];
    const current =  panels.at(this.currentIndex);

    if(root.parentElement.scrollTop > this.SCROLL_TRESHOLD && this.currentIndex> 0) {
      current.querySelectorAll('.mmenu__back')[0].scrollIntoView({block:'start',behaviour:'smooth'});
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
    const cache = JSON.parse(localStorage.getItem(this.cacheKey));
    const now = new Date().getTime();

    // Return cached menu if timestamp is less than hour old.
    if (this.enableCache && cache && cache.timestamp > now - 60 * 60 * 1000) {
      this.data = cache.value;
      return;
    } else {
      console.log('Mobile menu cache is disabled');
    }

    const MENU = await( await fetch('/global-mobile-menu.json')).json();
    localStorage.setItem(this.cacheKey, JSON.stringify({
      value: MENU,
      timestamp: new Date().getTime()
    }));

    this.data = MENU;
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
      this.data = mockmenu;
    }
    /**
     * Set the panels according to current path.
     *  */
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
  menuToggle:  function() {
    if (this.menuIsOpen()) {
      this.toggleButton.setAttribute('aria-expanded', 'false');
      menu.dataset.target = 'false';
      toggleWidgets(false);
    } else {
      toggleWidgets(true);
      menu.dataset.target = 'true';
      Panel.toggleButton.setAttribute('aria-expanded', 'true');
    }
    // We should always focus the menu button after toggling the menu
    Panel.toggleButton.focus();
  }
};

/**
 *
 * Start the panel after DOM has loaded.
 * Compiled templates need to have reliable access to header and menu elements cloned from Server DOM.
 *
 */
document.addEventListener('DOMContentLoaded', () => {
  // See  block--mobile-navigation.html.twig for the button
  Panel.toggleButton = document.querySelector('.js-menu-toggle-button');
  if(!Panel.toggleButton){
    throw new Error('no toggle button');
  }
  // TODO: organize fallback-menu-code to sensible functions.
  // Now it is just splattered here from nav-global-toggle in a random order that works.
  document.getElementById('js-menu-fallback').style.display = 'none';

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
    Panel.start(window.location.pathname);
  };

  /**
   *
   * Add start-event to menu toggle button.
   *
   * Add Menu toggle function to menu button.
   * Side effects:
   * Toggles chat widget display values and aria-expanded states and clears menu hash when closing.
   *
   */
  Panel.toggleButton.addEventListener('click',start);
  Panel.toggleButton.addEventListener('click',()=>Panel.menuToggle());

  /**
   *
   * Open menu if it is required in the hash, then clear hash.
   */
  if (Panel.menuIsOpen()) {
    window.location.hash = '';
    start();
    Panel.menuToggle();
  }
});

