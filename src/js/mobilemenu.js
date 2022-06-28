const Mustache = require('mustache');
const mockmenu = require('./MOCK_MENU');
const cls = require('classnames');

const button = function(){
  // "this" should be a json-menu object in panel/items template
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
        <a href="#fi">Suomeksi</a>
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
  size: 5,
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
  content:[],
  getView: function(state){
    // Prepare props for each panel
    // Note the use of arrow functions and non-arrow functions for scope of "this" in panel rendering.
    // Use arrow to access Panel object, non-lexical function for accessing current iterable object in template.
    return this.content.map( (item,i) => ({
      ...item,
      title:item?.title ||  Drupal.t('Front Page','Mobile Menu'),
      // If current item has subitems, show button for next panel.
      button,
      active,
      // Show title of previously clicked item in Back-button (or Frontpage if)
      back: (this.current > 0 && i >0) ? this.content.at(i-1)?.title ?? Drupal.t('Front Page','Mobile Menu') : false ,
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

    if(this.current===this.size) {return;}
    if(!parentId) {
      throw new Error('missing id for menu item ' +parentId);
    }

    const next = this.content.at(this.current).items.find(({
      id
    }) => id === parentId);

    if(!next) {
      console.error({next,parentId});
      throw new Error('ID mismatch in menu items'+parentId);
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
    //Scroll to back-button height if back-button is not visible any more
    // Todo: bind treshold to back-button position when all menu blocks have been added and styled


    const TRESHOLD = 100;
    if(root.parentElement.scrollTop > TRESHOLD) {
      current.querySelectorAll('.jsmenu__button--back')[0].scrollIntoView({block:'start',behaviour:'smooth'});
    }

    setTimeout(()=>{

      //element has multiple transitions so we dont want this to run on all of them.
      // const afterTransitions =({propertyName})=> {
      //   //run only on transform transition, should be only one. If this
      //   // becomes too tricky with CSS, use once() and just dont care about it.
      //   if(propertyName !== 'opacity') {
      //     return;
      //   }
      // };

      current.classList.add('jsmenu__panel--visible-fast');
      current.classList.remove('jsmenu__panel--visible-right','jsmenu__panel--visible-left');
      switch (state) {
      /***
       *  Exiting panel moves slow and fades away from given direction
       *  Entering panel moves fast and enters stage from given direction
       */

      case 'up':
        panels.at(this.current-1).classList.add('jsmenu__panel--visible-left','jsmenu__panel--visible-slow');
        // panels.at(this.current-1).addEventListener('transitionend',afterTransitions);
        break;

      case 'down':
        panels.at(this.current+1).classList.add('jsmenu__panel--visible-right', 'jsmenu__panel--visible-slow');
        // panels.at(this.current+1).addEventListener('transitionend',afterTransitions);
        break;

      default:

      }

    },10);
  },
  load: async function(){
    const MENU = await( await fetch('./megamenu.json')).json();
    this.content = [MENU];
  },
  start: async function(){
    if(!this.getRoot()) {
      console.error('menu data not loaded');
      throw new Error('Panel root not found');
    }
    this.render('load');
    try {
      await this.load();
    } catch(e) {
      console.error(e);
      this.content = [mockmenu, ...Array(4)];
    }

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
       *  Bind one click event listener to main panel. One for all click events.
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
  // TODO integrate with megamenu button
  const toggleButton = document.querySelectorAll('.cssmenu-toggle')[0];

  //start only once.
  const start = function() {
    toggleButton.removeEventListener('click',start);
    Panel.start();
  };

  toggleButton.addEventListener('click',start);

});
