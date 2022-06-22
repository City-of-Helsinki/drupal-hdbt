// const Events = require('minivents');
const Mustache = require('mustache');
const mockmenu = require('./MOCK_MENU');
const cls = require('classnames');
// const once = require('lodash/once')
// view helper for showing button if current menu item has submenu items
const button = function(){return this.items?.length>0; };
/**
 * CSS classes for moving the panel. TODO: production naming
 * */
const Panel = {
  templates:{
    panelTemplate: `
    {{#panels}}
      <section class="{{panel_class}}">
      <div class="jsmenu__panel-body">
        <div class="jsmenu__language">
        <a href="#fi">Suomeksi</a>
        </div>
          <button class="jsmenu__button--back">
           {{title}}
          {{^title}}{{frontpage}}{{/title}}
          </button>
        {{>items}}
        </div>
        <div class="jsmenu__panel-footer">
        <a href="#">Anna palautetta</a>
        <div class="logo"/>
        </div>
      </section>
    {{/panels}}
    `,
    listTemplate:`
    <ul class="jsmenu__items">
      {{#items}}
        <li class="jsmenu__item">
          <a href={{url}} class="flex-grow jsmenu__itemlink">{{title}}</a>
          {{#button}}
            <button class="jsmenu__button--forward " value={{id}} />


          {{/button}}
        </li>
      {{/items}}
    </ul>
   `
  },
  size: 5,
  selectors:{
    states:[...Array(5)].map((a,i)=>`jsmenu--state-${i}`),
    container:'#jsmenu',
    rootId:'jsmenu__panels',
    forward:'jsmenu__button--forward',
    back:'jsmenu__button--back'
  },
  getRoot:function(){
    return document.getElementById(this.selectors.rootId);
  },
  content:[],
  getPanels : function(direction){
    // append button resolver to view data
    return this.content.map( (item,i) => ({
      ...item,
      button,
      panel_class: cls({
        /***
         * Define correct starting positions for each panel, depeding on traversal direction
         * At start, first item is on stage and anything else must be on right.
         * When going forward in the menu, current -1  item must be on stage and current item starts from right
         * When going backward in the menu, current +1 item must be on stage and current item starts from left
         *
         * At render, -up and -down classes are added and removed accordingly to achieve wanted animation and final state.
         */
        'jsmenu__panel':true,
        // 'jsmenu__panel--first':i===0,
        'jsmenu__panel--visible':true,
        'jsmenu__panel--current':i === this.current,
        'jsmenu__panel--visible-up':  (direction === 'start' && i > this.current ) || (direction === 'up' && i >= this.current ) ||( direction === 'down' && i > this.current+1 ),
        'jsmenu__panel--visible-down': (direction  === 'up' && i<this.current-1)  || (direction === 'down' && i <= this.current)
      })
    }));
  },
  current: 0,
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
  render:function(direction) {
    const root = this.getRoot();
    // root.parentElement.scrollTo(0,0);
    root.innerHTML = Mustache.render(this.templates.panelTemplate, {
      panels: this.getPanels(direction),
      frontpage:Drupal.t('Front Page','Mobile Menu'),
      // current:()=> this.current+1,
      back: ()=> ['back to',this.current +1].join(' ') ,
    }, {
      items: this.templates.listTemplate,
    });
    const panels = [...root.querySelectorAll('.jsmenu__panel')];
    const current =  panels.at(this.current);
    const TRESHOLD = 100;

    if(root.parentElement.scrollTop > TRESHOLD) {
      current.querySelectorAll('.jsmenu__button--back')[0].scrollIntoView({block:'start',behaviour:'smooth'});
      // console.log('scroll treshold exceeded',{TRESHOLD,sc:root.parentElement.scrollTop})
      // root.parentElement.scrollTo({top: TRESHOLD} );
      // root.parentElement.scrollTo({top: 0, behavior: 'smooth'});
    }


    setTimeout(()=>{

      //element has multiple transitions so we dont want this to run on all of them.
      const afterTransitions =({propertyName})=> {
        //run only on transform transition, should be only one. If this
        // becomes too tricky with CSS, use once() and just dont care about it.
        if(propertyName !== 'opacity') {
          return;
        }
        // if(root.parentElement.scrollTop > TRESHOLD) {
        //   current.querySelectorAll('.jsmenu__button--back')[0].scrollIntoView({block:'start',behaviour:'smooth'});
        //   // console.log('scroll treshold exceeded',{TRESHOLD,sc:root.parentElement.scrollTop})
        //   // root.parentElement.scrollTo({top: TRESHOLD} );
        //   // root.parentElement.scrollTo({top: 0, behavior: 'smooth'});
        // }
        // if(root.parentElement.scrollTop > TRESHOLD && current.querySelectorAll('.jsmenu__panel-body')[0].clientHeight < window.innerHeight*0.7 ) {
        //   console.log({TRESHOLD,sc:root.parentElement.scrollTop})
        //   root.parentElement.scrollTo({top: 0, behavior: 'smooth'});
        // }
        // current.querySelectorAll('.jsmenu__button--back')[0].scrollIntoView({block:'start',behaviour:'smooth'});
        // if(root.parentElement.scrollTop > 0 ) {
        //   current.querySelectorAll('.jsmenu__button--back')[0].scrollIntoView({block:'start',behaviour:'smooth'});
        // }

      };


      current.classList.add('jsmenu__panel--visible-fast');
      current.classList.remove('jsmenu__panel--visible-up','jsmenu__panel--visible-down');
      switch (direction) {
      /***
       *  Exiting panel moves slow and fades away from given direction
       *  Entering panel moves fast and enters stage from given direction
       */

      case 'up':
        panels.at(this.current-1).classList.add('jsmenu__panel--visible-down','jsmenu__panel--visible-slow');
        panels.at(this.current-1).addEventListener('transitionend',afterTransitions);
        break;

      case 'down':
        panels.at(this.current+1).classList.add('jsmenu__panel--visible-up', 'jsmenu__panel--visible-slow');
        panels.at(this.current+1).addEventListener('transitionend',afterTransitions);
        break;

      default:
        // 'start does not need a handler

      }

    },10);


  }
};

document.addEventListener('DOMContentLoaded', async function() {

  if(!Panel.getRoot()) {
    throw new Error('Panel root not found');
  }

  try {
    const MENU = await( await fetch('./megamenu.json')).json();
    Panel.content = [MENU];
  } catch (error) {
    console.error(error);
    // throw error
    Panel.content = [mockmenu, ...Array(4)];
  }

  Panel.render('start');

  /**
   * Event listeners:
   *
   *  Bind one click event listener to main panel. One for all click events.
   *  Add more if one handler becomes too cumbersome.
   *  */
  Panel.getRoot().addEventListener('click', function({
    target: {
      classList,
      value:id
    }
  }) {

    if (classList && classList.contains(Panel.selectors.forward)) {
      Panel.up(id);
    } else if (classList && classList.contains(Panel.selectors.back)) {
      Panel.down();
    }
  });
});


