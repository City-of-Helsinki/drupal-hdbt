const Mustache = require('mustache');
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
 */


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

const button = function(){
  return this.sub_tree?.length>0;
};

const active = function () {
  const url = window.location.href.replace(/#.*$/, '');
  return new RegExp(`^${this.url}$`).test(url);
};

const inPath = function () {
  const url = window.location.href.replace(/#.*$/, '');
  return new RegExp(`^${this.url}`).test(url);
};

const frontpageTranslation = Drupal.t('Frontpage', {}, { context: 'Global navigation mobile menu top level' });

const Panel = {
  templates:{
    panelTemplate: `
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
    listTemplate:`
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
  },
  //Maximum assumed depth of tree. Used for checking if going up is allowed
  size: 5,
  data:null,
  frontpageInstanceUrl: null,
  current: 0,
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
    const allItems = this.data;
    const currentItem = allItems.findRecursive( item => active.call(item),'sub_tree' );
    let parentIdIndex = currentItem?.parentId;
    const panels = [];

    while (parentIdIndex) {
      const found = allItems.findRecursive(({ id, url, name, sub_tree, parentId }) => {

        if (id === parentIdIndex) {
          panels.push({ sub_tree, name, url, parentId });
          //set new parent id. If this is empty, it will stop the while-loop.
          parentIdIndex = parentId;
          return true;
        }
        return false;
      }, 'sub_tree');

      if (!found) {
        console.warn('No parent found with', parentIdIndex, 'stopping while-loop');
        parentIdIndex = undefined;
      }
    }
    panels.push({sub_tree:allItems});
    panels.reverse();
    this.current = panels.length-1;
    this.content = [...panels];


  },
  content:[],
  getView: function(state){
    // Note the use of arrow functions and non-arrow functions for scope of "this" in panel rendering.
    // Use arrow to access Panel object, non-lexical function for accessing current iterable object in template.
    return this.content.map( (item,i) => ({
      ...item,
      name: item?.name || frontpageTranslation,
      // If current item has subitems, show button for next panel.
      button,
      active,
      inPath,
      url: item?.url || this.frontpageInstanceUrl,
      // Show name of previously clicked item in Back-button (or Frontpage if)
      back: (i > 0) ? this.content.at(i - 1)?.name ?? frontpageTranslation : false,
      /***
       * Define correct starting positions for each panel, depeding on traversal direction
       * At start, first item is on stage and anything else must be on right.
       * When going forward in the menu, current -1  item must be on stage and current item starts from right
       * When going backward in the menu, current +1 item must be on stage and current item starts from left
       *
       * At render, -up and -down classes are added and removed accordingly to achieve wanted animation and final state.
       */
      panel_class: cls({
        'mmenu__panel':true,
        'mmenu__panel--visible':true,
        'mmenu__panel--current':i === this.current,
        'mmenu__panel--visible-right':  (state === 'start' && i > this.current ) || (state === 'up' && i >= this.current ) ||( state === 'down' && i > this.current+1 ),
        'mmenu__panel--visible-left': (state  === 'up' && i<this.current-1)  || (state === 'down' && i <= this.current)
      })
    }));
  },
  up: function (parentId) {

    if(this.current===this.size) {
      return;
    }
    if(!parentId) {
      throw new Error('missing id for menu item ' + parentId);
    }

    const next = this.content.at(this.current).sub_tree.find(({
      id
    }) => id === parentId);

    if(!next) {
      throw new Error('ID mismatch in menu items ' + parentId);
    }

    this.current = this.current + 1 < this.size ? this.current + 1 : this.current;
    this.content[this.current] = next;
    this.render('up');
  },
  down: function () {
    if(this.current === 0) {return;}
    this.current = this.current - 1 >= 0 ? this.current - 1 : this.current;
    this.render('down');
  },
  render:function(state) {
    const root = this.getRoot();
    root.innerHTML = Mustache.render(this.templates.panelTemplate, {
      panels: this.getView(state),
    }, {
      sub_tree: this.templates.listTemplate,
    });

    if(state === 'load') {
      return;
    }

    const panels = [...root.querySelectorAll('.mmenu__panel')];
    const current =  panels.at(this.current);
    // Scroll to back-button height if back-button is not visible any more.
    // Todo: bind treshold to suitable element position when all menu blocks have been added and styled.
    const TRESHOLD = 100;
    if(root.parentElement.scrollTop > TRESHOLD && this.current > 0) {
      current.querySelectorAll('.mmenu__back')[0].scrollIntoView({block:'start',behaviour:'smooth'});
    }

    setTimeout(()=>{

      current.classList.remove('mmenu__panel--visible-right','mmenu__panel--visible-left');
      switch (state) {

      case 'up':
        panels.at(this.current-1).classList.add('mmenu__panel--visible-left');
        break;

      case 'down':
        panels.at(this.current+1).classList.add('mmenu__panel--visible-right');
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
  load: async function () {
    const cache = JSON.parse(localStorage.getItem(this.cacheKey));
    const now = new Date().getTime();

    // Return cached menu if timestamp is less than hour old.
    if (this.enableCache) {
      if (cache && cache.timestamp > now - 60 * 60 * 1000) {
        this.data = cache.value;
        return;
      }
    } else {
      console.log('Mobile menu cache is disabled');
    }

    // Is the frontpage instance in another domain or at relative path?
    const frontpageInstanceDomain = window.location.hostname.indexOf('docker.so') != -1 ? '//helfi-etusivu.docker.so' : '';

    // Lets get menu in same language as the current page is in.
    const currentLangCode = drupalSettings?.path?.currentLanguage || 'fi';

    // We use this same url for pointing to frontpage instance at the root level
    this.frontpageInstanceUrl = `${frontpageInstanceDomain}/${currentLangCode}`;

    const MENU = await fetch(`${this.frontpageInstanceUrl}/api/v1/global-menu?_format=json`);
    const data = await MENU.json();
    const allItems = [];

    var allInstances = Object.getOwnPropertyNames(data);

    if (!allInstances.length) {
      throw new Error('No instances found in data', data);
    }

    // Put all instances in same array
    for (let i = 0; i < allInstances.length; i++) {
      const instanceName = allInstances[i];
      const instance = data[instanceName].menu_tree[0];
      allItems.push(instance);
    }

    // TODO: Remove this loop when first level has proper references to parents with proper ids
    // Fix data first level id's, parentId's and second level parentId's
    for (let i = 0; i < allItems.length; i++) {
      allItems[i].id = allItems[i].url;
      allItems[i].parentId = '';
      for (let j = 0; j < allItems[i].sub_tree.length; j++) {
        allItems[i].sub_tree[j].parentId = allItems[i].id;
      }
    }

    this.data = allItems;

    if (this.enableCache) {
      localStorage.setItem(this.cacheKey, JSON.stringify({
        value: this.data,
        timestamp: new Date().getTime()
      }));
    }

  },
  start: async function(){
    const container = document.querySelector(this.selectors.container);
    if(!this.getRoot() || !container) {
      throw new Error('Panel root not found');
    }
    //Show container on start
    container.classList.add('mmenu--visible');
    // show loader
    this.render('load');

    // load data from whatever
    try {
      await this.load();
    } catch (e) {
      // TODO Enable nojs here
      console.error('Unable to load menu data, using mock menu for development purposes. Reset to nojs-fallback when integrating with actual API', e);
    }
    //Set the panels according to current path.
    this.sortPanelsByPath();
    this.render('start');
    this.getRoot().addEventListener('click', ({
      target: {
        classList,
        value: id,
        parentElement
      }
    }) => {

      /**
       * Event listeners:
       *
       *  Bind one click event listener to main panel. One for all click events.!
       *  Add more if one handler becomes too cumbersome.
       *  */

      if (classList && classList.contains(this.selectors.forward)) {
        this.up(id);
      } else if (classList && classList.contains(this.selectors.back) || parentElement?.classList && parentElement?.classList.contains(this.selectors.back)) {
        this.down();
      }
    });

  }
};

document.addEventListener('DOMContentLoaded', () => {
  // See  block--mobile-navigation.html.twig
  const toggleButton = document.querySelectorAll('.js-menu-toggle-button')[0];
  if(!toggleButton){
    throw new Error('no toggle button');
  }

  document.getElementById('js-menu-fallback').style.display = 'none';

  //start only once.
  const start = function() {
    toggleButton.removeEventListener('click', start);
    Panel.start();
  };

  toggleButton.addEventListener('click',start);

});
