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
 * - _js-mobile-navigation.scss
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
  return this.items?.length>0;
};

const active = function () {
  return new RegExp(`^${this.url}$`).test(window.location.pathname);
};

const inPath = function () {
  return new RegExp(`^${this.url}`).test(window.location.pathname);
};

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
          <a class="mmenu__title-link{{#inPath}} mmenu__title-link--in-path{{/inPath}}"{{#active}} aria-current="page"{{/active}} href="{{url}}">{{title}}</a>
          {{>items}}
        </div>
        ${document.querySelector('.js-mmenu__footer')?.outerHTML}
        ${ ''
  /*
        <div class="mmenu__footer">
          <ul class="mmenu__footer-items">
            <li class="mmenu__footer-item"><a href="#" class="mmenu__footer-link">Koronavirus</a></li>
            <li class="mmenu__footer-item"><a href="#" class="mmenu__footer-link">Anna palautetta</a></li>
            <li class="mmenu__footer-item"><a href="#" class="mmenu__footer-link" aria-current="page">Uutiset</a></li>
            <li class="mmenu__footer-item"><a href="#" class="mmenu__footer-link">Avoimet työpaikat</a></li>
            <li class="mmenu__footer-item"><a href="#" class="mmenu__footer-link">Osallistu ja vaikuta</a></li>
          </ul>
          <div class="mmenu__logo">
            <a href="https://www.hel.fi/${drupalSettings?.path?.currentLanguage || ''}" class="mmenu__logo-link">
              ${document.querySelector('.logo__icon')?.outerHTML}
            </a>
          </div>
        </div>
      */
}
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
  },
  //Maximum assumed depth of tree. Used for checking if going up is allowed
  size: 5,
  data:null,
  current: 0,
  cacheKey: 'hdbt-mobile-menu',
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
    this.current = panels.length-1;
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
      // Show title of previously clicked item in Back-button (or Frontpage if)
      back: ( i >0) ? this.content.at(i-1)?.title ?? Drupal.t('Frontpage','Global navigation mobile menu top level') : false ,
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

    const next = this.content.at(this.current).items.find(({
      id
    }) => id === parentId);

    if(!next) {
      throw new Error('ID mismatch in menu items'+ parentId);
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
      items: this.templates.listTemplate,
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

    },10);
  },
  load: async function(){
    const cache = JSON.parse(localStorage.getItem(this.cacheKey));
    const now = new Date().getTime();

    // Return cached menu if timestamp is less than hour old. 
    if(cache && cache.timestamp > now - 60 * 60 * 1000) {
      this.data = cache.value;
      return;
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
    //Show container on start
    container.classList.add('mmenu--visible');
    // show loader
    this.render('load');

    // load data from whatever
    try {
      await this.load();
    } catch(e) {
      console.error('Unable to load menu data, using mock menu for development purposes',e);
      this.data = mockmenu;
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
    toggleButton.removeEventListener('click',start);
    Panel.start(window.location.pathname);
  };

  toggleButton.addEventListener('click',start);

});

