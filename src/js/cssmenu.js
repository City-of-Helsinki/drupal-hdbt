const Events = require('minivents');
const Mustache = require('mustache');
const mockmenu = require('./MOCK_MENU');
const cls = require('classnames');
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
        <div class="jsmenu__language">
        <a href="#fi">Suomeksi</a>
        </div>
          <button class="jsmenu__button--back">back</button>
        {{>items}}
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
            <button class="jsmenu__button--forward " value={{id}}>
            &gt;
            </button>
          {{/button}}
        </li>
      {{/items}}
    </ul>
    `

  },

  size: 5,
  selectors:{
    states:[...Array(5)].map((a,i)=>`jsmenu--state-${i}`),
    rootId:'jsmenu',
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
        'jsmenu__panel':true,
        'jsmenu__panel--current':i === this.current,
        'jsmenu__panel--visible': (direction === 'start' && i === 0) || (direction === 'up' && i<= this.current && this.current > 0) || (direction ==='down' && i <= this.current+1  ),
        'jsmenu__panel--visible-up':  (direction === 'start' && i > this.current ) || (direction === 'up' && i >= this.current ) || direction === 'down' && i>this.current+1,
        'jsmenu__panel--visible-down': (direction  === 'up' && i<this.current-1) || (direction === 'down' && i <= this.current && this.current > 0)
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
    // this.emit('change')
  },
  down: function () {
    if(this.current === 0) {return;}
    this.current = this.current - 1 >= 0 ? this.current - 1 : this.current;
    this.render('down');

    // this.emit('change',)
  },
  animateDown:function(){

  },
  render:function(direction) {
    const root = this.getRoot();
    root.innerHTML = Mustache.render(this.templates.panelTemplate, {
      panels: this.getPanels(direction),
      current: () => this.current + 1,
    }, {
      items: this.templates.listTemplate,
    });

    setTimeout(()=>{
      console.log({direction,current:this.current});
      const panels = [...root.querySelectorAll('.jsmenu__panel')];

      switch (direction) {

      case 'start':
        // do nothing for now, just prototyping
        break;

      case 'up':
        // prevPanel = [...root.querySelectorAll('.jsmenu__panel')].at(this.current -1 )
        // // prevPanel.classList.add('jsmenu__panel--visible')
        panels.at(this.current).classList.add('jsmenu__panel--visible-fast');
        panels.at(this.current).classList.remove('jsmenu__panel--visible-up');
        panels.at(this.current -1 ).classList.add('jsmenu__panel--visible-down','jsmenu__panel--visible-slow');
        // currentPanel.classList.remove('jsmenu__panel--visible-up')
        break;

      case 'down':
        panels.at(this.current).classList.add('jsmenu__panel--visible-fast');
        panels.at(this.current).classList.remove('jsmenu__panel--visible-down');
        panels.at(this.current+1).classList.add('jsmenu__panel--visible-up', 'jsmenu__panel--visible-slow');
        // prevPanel = [...root.querySelectorAll('.jsmenu__panel')].at(this.current+1)
        // currentPanel = [...root.querySelectorAll('.jsmenu__panel')].at(this.current)
        // currentPanel.classList.add('jsmenu__panel--visible')
        // prevPanel.classList.remove('jsmenu__panel--visible-down' )
        break;
      }

      // root.classList.remove(...this.selectors.states)
      // root.classList.add(this.selectors.states.at(Panel.current))
    },10);
  }
};

document.addEventListener('DOMContentLoaded', async function() {

  if(!Panel.getRoot()) {
    throw new Error('Panel root not found');
  }
  //Get menu data
  //Set content of first panel

  try {
    const MENU = await( await fetch('./megamenu.json')).json();
    Panel.content = [MENU];
  } catch (error) {
    console.error(error);
    // throw error
    Panel.content = [mockmenu, ...Array(4)];
  }

  //Bind panel events
  Events(Panel);
  // Panel.on('start',function(){ Panel.render('start')})
  Panel.on('up', value => Panel.up(value));
  Panel.on('down', value => Panel.down(value));
  //intial render
  Panel.render('start');

  // bind panel click event listener. One for all events.
  Panel.getRoot().addEventListener('click', function({
    target: {
      classList,
      value
    }
  }) {
    if (classList && classList.contains(Panel.selectors.forward)) {
      Panel.emit('up',value);
    } else if (classList && classList.contains(Panel.selectors.back)) {
      Panel.emit('down',value);
    }
  });
});




// document.addEventListener('DOMContentLoaded', () => {
//   const widgetsToHideSelector = [
//     '.cx-theme-helsinki-blue', // Genesys chat in kymp and sote
//     '#smartti-wrapper', // Smartti chatbot in kymp
//     '.aca--button--desktop, .aca--button--mobile, .aca--widget--mobile, .aca--widget--desktop', // Watson chatbot in asuminen
//     '#block-kuurahealthchat', // Kuurahealth in sote
//     '#ed11y-panel' // Editoria11y accessibility tool
//   ];

//   let toggle = document.querySelector('.js-cssmenu-toggle-button');
//   let checkbox = document.querySelector('.js-cssmenu-toggle-checkbox');

//   function toggleWidgets(hide) {
//     const widgets = document.querySelectorAll(widgetsToHideSelector.join(','));
//     for (let i = 0; i < widgets.length; i++) {
//       const widget = widgets[i];
//       if (hide) {
//         widget.dataset.cssmenuHide = true;
//       } else {
//         delete widget.dataset.cssmenuHide;
//       }
//     }
//   }

//   function checkboxToggle() {
//     if (checkbox.checked) {
//       toggle.setAttribute('aria-expanded', 'false');
//       checkbox.checked = false;
//       toggleWidgets(false);
//       toggle.focus();
//     } else {
//       checkbox.checked = true;
//       toggleWidgets(true);
//       toggle.setAttribute('aria-expanded', 'true');
//     }
//   }

//   if (toggle) {
//     toggle.addEventListener('click', checkboxToggle);
//   }

//   document.addEventListener('keydown', function (e) {
//     if ((e.key == 'Escape' || e.key == 'Esc' || e.keyCode == 27) && checkbox.checked) {
//       checkboxToggle();
//     }
//   });

//   if (checkbox) {
//     checkbox.dataset.js = true; // Switch to use js-enhanced version instead of pure css version
//   }
// });
