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

const active = function() {
  return new RegExp(`${this.url}$`).test(window.location.pathname);
};

const Panel = {
  templates:{
    panelTemplate: `
    {{#panels}}
      <section class="{{panel_class}}">
        <div class="jsmenu__panel-body">
          <div class="jsmenu__language">
            ${document.querySelector('.language-switcher')?.innerHTML}
          </div>
          {{#back}}
            <button class="jsmenu__button--back">
              <span>{{back}}</span>
            </button>
          {{/back}}
          <a class="jsmenu__title-link" href="{{url}}">{{title}}</a>
          {{>items}}
        </div>
        <div class="jsmenu__panel-footer">
          <a href="#">Anna palautetta</a>
          <div class="logo"/>
        </div>
      </section>
    {{/panels}}

    {{^panels}}
    <div class="jsmenu__loading">
      <div class="hds-loading-spinner">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
    {{/panels}}
    `,
    listTemplate:`
    <ul class="jsmenu__items">
      {{#items}}
        <li class="jsmenu__item">
          <a href={{url}} class="flex-grow jsmenu__itemlink {{#active}}jsmenu__itemlink--active{{/active}}">{{title}}</a>
          {{#button}}
            <button class="jsmenu__button--forward " value={{id}} />
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
  selectors:{
    container:'#jsmenu',
    rootId:'jsmenu__panels',
    forward:'jsmenu__button--forward',
    back:'jsmenu__button--back'
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
        'jsmenu__panel':true,
        'jsmenu__panel--visible':true,
        'jsmenu__panel--current':i === this.current,
        'jsmenu__panel--visible-right':  (state === 'start' && i > this.current ) || (state === 'up' && i >= this.current ) ||( state === 'down' && i > this.current+1 ),
        'jsmenu__panel--visible-left': (state  === 'up' && i<this.current-1)  || (state === 'down' && i <= this.current)
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

    const panels = [...root.querySelectorAll('.jsmenu__panel')];
    const current =  panels.at(this.current);
    // Scroll to back-button height if back-button is not visible any more.
    // Todo: bind treshold to suitable element position when all menu blocks have been added and styled.
    const TRESHOLD = 100;
    if(root.parentElement.scrollTop > TRESHOLD && this.current > 0) {
      current.querySelectorAll('.jsmenu__button--back')[0].scrollIntoView({block:'start',behaviour:'smooth'});
    }

    setTimeout(()=>{

      current.classList.add('jsmenu__panel--visible-fast');
      current.classList.remove('jsmenu__panel--visible-right','jsmenu__panel--visible-left');
      switch (state) {
      /***
       *  Exiting panel moves slow and fades away from given direction
       *  Entering panel moves fast and enters stage from given direction
       */

      case 'up':
        panels.at(this.current-1).classList.add('jsmenu__panel--visible-left','jsmenu__panel--visible-slow');
        break;

      case 'down':
        panels.at(this.current+1).classList.add('jsmenu__panel--visible-right', 'jsmenu__panel--visible-slow');
        break;

      default:

      }

    },10);
  },
  load: async function(){
    const MENU = await( await fetch('./megamenu.json')).json();
    this.data = MENU;
  },
  start: async function(){
    const container = document.querySelector(this.selectors.container);
    if(!this.getRoot() || !container) {
      throw new Error('Panel root not found');
    }
    //Show container on start
    container.classList.add('jsmenu--visible');
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
        value:id
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
      } else if (classList && classList.contains(this.selectors.back)) {
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

