(self.webpackChunkhdbt=self.webpackChunkhdbt||[]).push([[595,854],{2858:function(t,e,n){"use strict";n.r(e),n.d(e,{default:function(){return B}});var r=Object.prototype.toString,i=Array.isArray||function(t){return"[object Array]"===r.call(t)};function s(t){return"function"==typeof t}function a(t){return t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}function o(t,e){return null!=t&&"object"==typeof t&&e in t}var l=RegExp.prototype.test;var u=/\S/;function c(t){return!function(t,e){return l.call(t,e)}(u,t)}var h={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;","`":"&#x60;","=":"&#x3D;"};var p=/\s*/,d=/\s+/,f=/\s*=/,m=/\s*\}/,g=/#|\^|\/|>|\{|&|=|!/;function v(t){this.string=t,this.tail=t,this.pos=0}function b(t,e){this.view=t,this.cache={".":this.view},this.parent=e}function _(){this.templateCache={_cache:{},set:function(t,e){this._cache[t]=e},get:function(t){return this._cache[t]},clear:function(){this._cache={}}}}v.prototype.eos=function(){return""===this.tail},v.prototype.scan=function(t){var e=this.tail.match(t);if(!e||0!==e.index)return"";var n=e[0];return this.tail=this.tail.substring(n.length),this.pos+=n.length,n},v.prototype.scanUntil=function(t){var e,n=this.tail.search(t);switch(n){case-1:e=this.tail,this.tail="";break;case 0:e="";break;default:e=this.tail.substring(0,n),this.tail=this.tail.substring(n)}return this.pos+=e.length,e},b.prototype.push=function(t){return new b(t,this)},b.prototype.lookup=function(t){var e,n,r,i=this.cache;if(i.hasOwnProperty(t))e=i[t];else{for(var a,l,u,c=this,h=!1;c;){if(t.indexOf(".")>0)for(a=c.view,l=t.split("."),u=0;null!=a&&u<l.length;)u===l.length-1&&(h=o(a,l[u])||(n=a,r=l[u],null!=n&&"object"!=typeof n&&n.hasOwnProperty&&n.hasOwnProperty(r))),a=a[l[u++]];else a=c.view[t],h=o(c.view,t);if(h){e=a;break}c=c.parent}i[t]=e}return s(e)&&(e=e.call(this.view)),e},_.prototype.clearCache=function(){void 0!==this.templateCache&&this.templateCache.clear()},_.prototype.parse=function(t,e){var n=this.templateCache,r=t+":"+(e||x.tags).join(":"),s=void 0!==n,o=s?n.get(r):void 0;return null==o&&(o=function(t,e){if(!t)return[];var n,r,s,o=!1,l=[],u=[],h=[],b=!1,_=!1,k="",w=0;function y(){if(b&&!_)for(;h.length;)delete u[h.pop()];else h=[];b=!1,_=!1}function I(t){if("string"==typeof t&&(t=t.split(d,2)),!i(t)||2!==t.length)throw new Error("Invalid tags: "+t);n=new RegExp(a(t[0])+"\\s*"),r=new RegExp("\\s*"+a(t[1])),s=new RegExp("\\s*"+a("}"+t[1]))}I(e||x.tags);for(var L,E,P,C,S,A,O=new v(t);!O.eos();){if(L=O.pos,P=O.scanUntil(n))for(var T=0,j=P.length;T<j;++T)c(C=P.charAt(T))?(h.push(u.length),k+=C):(_=!0,o=!0,k+=" "),u.push(["text",C,L,L+1]),L+=1,"\n"===C&&(y(),k="",w=0,o=!1);if(!O.scan(n))break;if(b=!0,E=O.scan(g)||"name",O.scan(p),"="===E?(P=O.scanUntil(f),O.scan(f),O.scanUntil(r)):"{"===E?(P=O.scanUntil(s),O.scan(m),O.scanUntil(r),E="&"):P=O.scanUntil(r),!O.scan(r))throw new Error("Unclosed tag at "+O.pos);if(S=">"==E?[E,P,L,O.pos,k,w,o]:[E,P,L,O.pos],w++,u.push(S),"#"===E||"^"===E)l.push(S);else if("/"===E){if(!(A=l.pop()))throw new Error('Unopened section "'+P+'" at '+L);if(A[1]!==P)throw new Error('Unclosed section "'+A[1]+'" at '+L)}else"name"===E||"{"===E||"&"===E?_=!0:"="===E&&I(P)}if(y(),A=l.pop())throw new Error('Unclosed section "'+A[1]+'" at '+O.pos);return function(t){for(var e,n=[],r=n,i=[],s=0,a=t.length;s<a;++s)switch((e=t[s])[0]){case"#":case"^":r.push(e),i.push(e),r=e[4]=[];break;case"/":i.pop()[5]=e[2],r=i.length>0?i[i.length-1][4]:n;break;default:r.push(e)}return n}(function(t){for(var e,n,r=[],i=0,s=t.length;i<s;++i)(e=t[i])&&("text"===e[0]&&n&&"text"===n[0]?(n[1]+=e[1],n[3]=e[3]):(r.push(e),n=e));return r}(u))}(t,e),s&&n.set(r,o)),o},_.prototype.render=function(t,e,n,r){var i=this.getConfigTags(r),s=this.parse(t,i),a=e instanceof b?e:new b(e,void 0);return this.renderTokens(s,a,n,t,r)},_.prototype.renderTokens=function(t,e,n,r,i){for(var s,a,o,l="",u=0,c=t.length;u<c;++u)o=void 0,"#"===(a=(s=t[u])[0])?o=this.renderSection(s,e,n,r,i):"^"===a?o=this.renderInverted(s,e,n,r,i):">"===a?o=this.renderPartial(s,e,n,i):"&"===a?o=this.unescapedValue(s,e):"name"===a?o=this.escapedValue(s,e,i):"text"===a&&(o=this.rawValue(s)),void 0!==o&&(l+=o);return l},_.prototype.renderSection=function(t,e,n,r,a){var o=this,l="",u=e.lookup(t[1]);if(u){if(i(u))for(var c=0,h=u.length;c<h;++c)l+=this.renderTokens(t[4],e.push(u[c]),n,r,a);else if("object"==typeof u||"string"==typeof u||"number"==typeof u)l+=this.renderTokens(t[4],e.push(u),n,r,a);else if(s(u)){if("string"!=typeof r)throw new Error("Cannot use higher-order sections without the original template");null!=(u=u.call(e.view,r.slice(t[3],t[5]),(function(t){return o.render(t,e,n,a)})))&&(l+=u)}else l+=this.renderTokens(t[4],e,n,r,a);return l}},_.prototype.renderInverted=function(t,e,n,r,s){var a=e.lookup(t[1]);if(!a||i(a)&&0===a.length)return this.renderTokens(t[4],e,n,r,s)},_.prototype.indentPartial=function(t,e,n){for(var r=e.replace(/[^ \t]/g,""),i=t.split("\n"),s=0;s<i.length;s++)i[s].length&&(s>0||!n)&&(i[s]=r+i[s]);return i.join("\n")},_.prototype.renderPartial=function(t,e,n,r){if(n){var i=this.getConfigTags(r),a=s(n)?n(t[1]):n[t[1]];if(null!=a){var o=t[6],l=t[5],u=t[4],c=a;0==l&&u&&(c=this.indentPartial(a,u,o));var h=this.parse(c,i);return this.renderTokens(h,e,n,c,r)}}},_.prototype.unescapedValue=function(t,e){var n=e.lookup(t[1]);if(null!=n)return n},_.prototype.escapedValue=function(t,e,n){var r=this.getConfigEscape(n)||x.escape,i=e.lookup(t[1]);if(null!=i)return"number"==typeof i&&r===x.escape?String(i):r(i)},_.prototype.rawValue=function(t){return t[1]},_.prototype.getConfigTags=function(t){return i(t)?t:t&&"object"==typeof t?t.tags:void 0},_.prototype.getConfigEscape=function(t){return t&&"object"==typeof t&&!i(t)?t.escape:void 0};var x={name:"mustache.js",version:"4.2.0",tags:["{{","}}"],clearCache:void 0,escape:void 0,parse:void 0,render:void 0,Scanner:void 0,Context:void 0,Writer:void 0,set templateCache(t){k.templateCache=t},get templateCache(){return k.templateCache}},k=new _;x.clearCache=function(){return k.clearCache()},x.parse=function(t,e){return k.parse(t,e)},x.render=function(t,e,n,r){if("string"!=typeof t)throw new TypeError('Invalid template! Template should be a "string" but "'+((i(s=t)?"array":typeof s)+'" was given as the first argument for mustache#render(template, view, partials)'));var s;return k.render(t,e,n,r)},x.escape=function(t){return String(t).replace(/[&<>"'`=\/]/g,(function(t){return h[t]}))},x.Scanner=v,x.Context=b,x.Writer=_;var w=x,y=n(2485),I=n.n(y);const L=Drupal.t("Frontpage",{},{context:"Global navigation mobile menu top level"}),E=Drupal.t("Open submenu:",{},{context:"Mobile navigation menu prefix"}),P=Drupal.t("Open parent menu:",{},{context:"Mobile navigation menu prefix"});function C(){return this.sub_tree?.length>0}function S(){let t;try{t=new URL(this.url).pathname}catch(e){t=this.url}return!this.external&&this.url&&t===window.location.pathname}function A(){return!!this.active}function O(){return!!this.inPath}function T(){return!!this.is_injected}function j(){return{external:this.attributes["data-external"]||this.external||!1,protocol:this.attributes["data-protocol"]||!1}}function R(){return!!this.attributes?.lang}function U(){return!!this.external&&(U.ICONS[this.attributes["data-protocol"]]||U.ICONS.external)}Array.prototype.findRecursive=function(t,e){if(!e)throw new Error("findRecursive requires parameter `childrenPropertyName`");let n=[];n=this;const r=this.find(t),i=this.filter((t=>t[e]));if(r)return r;if(i.length){const n=[];return i.forEach((t=>{n.push(...t[e])})),n.findRecursive(t,e)}},U.ICONS={mailto:{class:"link__type link__type--mailto",text:Drupal.t("Link opens default mail program",{},{context:"Explanation for screen-reader software that the icon visible next to this link means that the link opens default mail program."})},tel:{class:"link__type link__type--tel",text:Drupal.t("Link starts a phone call",{},{context:"Explanation for screen-reader software that the icon visible next to this link means that the link starts a phone call."})},external:{class:"link__type link__type--external",text:Drupal.t("Link leads to external service",{},{context:"Explanation for screen-reader software that the icon visible next to this link means that the link leads to an external service."})}};var B={compileTemplates(){this.templates={panel:`\n  {{#panels}}\n    <section class="{{panel_class}}">\n      <div class="mmenu__panel-body">\n        {{#back}}\n          <button class="mmenu__back">\n            <span class="visually-hidden">{{openParentMenuTranslation}}</span>\n            <span class="mmenu__back-wrapper">{{back}}</span>\n          </button>\n        {{/back}}\n        <a href="{{url}}" class="mmenu__title-link{{#isInPath}} mmenu__title-link--in-path{{/isInPath}}"{{#isActive}} aria-current="page"{{/isActive}}\n\n        {{#externalLinkAttributes.external}}\n          data-external="true"\n        {{/externalLinkAttributes.external}}\n\n        {{#externalLinkAttributes.protocol}}\n          data-protocol="{{externalLinkAttributes.protocol}}"\n        {{/externalLinkAttributes.protocol}}\n\n        ><span class="mmenu__link__text"\n\n        {{#hasLang}}\n          lang="{{attributes.lang}}"\n        {{/hasLang}}\n\n        >{{name}}</span>{{#externalLinkIcon}} <span class="{{class}}"></span><span class="visually-hidden">({{ text }})</span>{{/externalLinkIcon}}</a>\n        {{>sub_tree}}\n      </div>\n      ${document.querySelector(".js-mmenu__footer")?.outerHTML}\n    </section>\n  {{/panels}}\n\n  {{^panels}}\n  <div class="mmenu__loading">\n    <div class="hds-loading-spinner">\n      <div></div>\n      <div></div>\n      <div></div>\n    </div>\n  </div>\n  {{/panels}}\n  `,list:'\n    <ul class="mmenu__items">\n      {{#sub_tree}}\n        <li class="mmenu__item">\n          <a href="{{url}}" class="mmenu__item-link{{#isInPath}} mmenu__item-link--in-path{{/isInPath}}{{#isInjected}} mmenu__item-link--injected{{/isInjected}}"{{#isActive}} aria-current="page"{{/isActive}}\n          {{#externalLinkAttributes.external}}\n            data-external="true"\n          {{/externalLinkAttributes.external}}\n          {{#externalLinkAttributes.protocol}}\n            data-protocol={{externalLinkAttributes.protocol}}\n          {{/externalLinkAttributes.protocol}}\n\n          ><span class="mmenu__link__text"\n\n          {{#hasLang}}\n            lang="{{attributes.lang}}"\n          {{/hasLang}}\n\n            >{{name}}</span>{{#externalLinkIcon}} <span class="{{class}}"></span><span class="visually-hidden">({{ text }})</span>{{/externalLinkIcon}}\n          </a>\n          {{#button}}\n            <button class="mmenu__forward " value={{id}}><span class="visually-hidden">{{openSubMenuTranslation}} {{name}}</span></button>\n          {{/button}}\n        </li>\n      {{/sub_tree}}\n    </ul>\n   '}},menu:null,templates:null,SCROLL_TRESHOLD:100,size:10,running:!1,data:null,currentIndex:0,cacheKey:"hdbt-mobile-menu",enableCache:!1,selectors:{container:"#mmenu",rootId:"mmenu__panels",forward:"mmenu__forward",back:"mmenu__back"},getAPIUrl(){const t=new URL(drupalSettings?.helfi_navigation?.links?.api);return t.searchParams.set("_format","json"),t.searchParams.set("max-depth",drupalSettings?.menu_depth),t.toString()},getRoot(){return document.getElementById(this.selectors.rootId)},sortPanelsByPath(){const t=[],e=this.data,n=e.findRecursive((t=>S.call(t)),"sub_tree");let r=n?.sub_tree?.length?n.id:n?.parentId;for(;r;){e.findRecursive((({id:e,url:n,name:i,sub_tree:s,parentId:a,inPath:o,active:l})=>e===r&&(t.push({sub_tree:s,name:i,url:n,parentId:a,inPath:o,active:l}),r=a,!0)),"sub_tree")||(r=void 0)}t.push({sub_tree:e,inPath:!0}),t.reverse(),this.currentIndex=t.length-1,this.content=[...t]},content:[],getView(t){return this.content.map(((e,n)=>({...e,name:e?.name||L,url:e.url||drupalSettings.helfi_navigation.links.canonical,button:C,isActive:A,isInPath:O,isInjected:T,externalLinkAttributes:j,hasLang:R,externalLinkIcon:U,back:n>0&&(this.content.at(n-1)?.name??L),openSubMenuTranslation:E,openParentMenuTranslation:P,panel_class:I()({mmenu__panel:!0,"mmenu__panel--visible":!0,"mmenu__panel--current":n===this.currentIndex,"mmenu__panel--visible-right":"start"===t&&n>this.currentIndex||"up"===t&&n>=this.currentIndex||"down"===t&&n>this.currentIndex+1,"mmenu__panel--visible-left":"up"===t&&n<this.currentIndex-1||"down"===t&&n<=this.currentIndex})})))},up(t){if(!t)throw new Error(`Id missing for next menu item  ${t}`);const e=this.content.at(this.currentIndex).sub_tree.find((({id:e})=>e===t));if(!e)throw new Error(`ID mismatch in menu items${t}`);this.currentIndex=this.currentIndex+1<this.size?this.currentIndex+1:this.currentIndex,this.content[this.currentIndex]=e,this.render("up")},down(){0!==this.currentIndex&&(this.currentIndex=this.currentIndex-1>=0?this.currentIndex-1:this.currentIndex,this.render("down"))},render(t){const e=this.getRoot();if(e.innerHTML=w.render(this.templates.panel,{panels:this.getView(t)},{sub_tree:this.templates.list}),"load"===t)return;const n=[...e.querySelectorAll(".mmenu__panel")],r=n.at(this.currentIndex);e.parentElement.scrollTop>this.SCROLL_TRESHOLD&&this.currentIndex>0&&r.querySelector(".mmenu__back").scrollIntoView({block:"start",behaviour:"smooth"}),setTimeout((()=>{switch(r.classList.remove("mmenu__panel--visible-right","mmenu__panel--visible-left"),t){case"up":n.at(this.currentIndex-1).classList.add("mmenu__panel--visible-left");break;case"down":n.at(this.currentIndex+1).classList.add("mmenu__panel--visible-right")}setTimeout((()=>{n.forEach((t=>{t.classList.contains("mmenu__panel--current")||(t.style.visibility="hidden")}))}),200)}),10)},async load(){const t=await fetch(this.getAPIUrl()),e=await t.json(),n=Object.getOwnPropertyNames(e);if(!n.length)throw new Error("No instances found in data",e);const r=n.map((t=>{const n=e[t].menu_tree[0];return n.parentId="",n})),i=r.findRecursive((t=>S.call(t)),"sub_tree");i&&(i.active=!0,i.inPath=!0);let s=i?.parentId;for(;s;){r.findRecursive((t=>t.id===s&&(s=t.parentId,t.inPath=!0,!0)),"sub_tree")||(s=void 0)}this.data=r},async start(){const t=document.querySelector(this.selectors.container);if(!this.getRoot()||!t)throw new Error("Panel root not found");t.classList.add("mmenu--visible"),this.render("load");try{await this.load()}catch(t){return console.error("Unable to load menu API, using fallback menu instead",t),void this.enableFallback()}this.sortPanelsByPath(),this.render("start"),this.getRoot().addEventListener("click",(t=>{const{target:{classList:e,value:n,parentElement:r}}=t;t.stopImmediatePropagation(),e&&e.contains(this.selectors.forward)?this.up(n):(e&&e.contains(this.selectors.back)||r?.classList&&r?.classList.contains(this.selectors.back))&&this.down()}))},isOpen(){return"#menu"===window.location.hash||"true"===this.toggleButton.getAttribute("aria-expanded")},disableFallback(){this.menu.dataset.js=!0},enableFallback(){this.menu.dataset.target="false",this.getRoot().innerHTML="",delete this.menu.dataset.js,window.location.hash="#menu"},close(){this.toggleButton.setAttribute("aria-expanded","false"),this.menu.dataset.target="false",this.onClose&&this.onClose()},open(){this.menu.dataset.target="true",this.toggleButton.setAttribute("aria-expanded","true"),this.onOpen&&this.onOpen()},toggle(){this.isOpen()?this.close():this.open(),this.toggleButton.focus()},init({onOpen:t,onClose:e}){if(this.running)return void console.warn("MobilePanel already initiated. Is it include more than once?");if(this.onOpen=t,this.onClose=e,this.toggleButton=document.querySelector(".js-menu-toggle-button"),!this.toggleButton)throw new Error("No toggle button for JS menu.");if(this.menu=document.querySelector("#menu"),!this.menu)return void console.error("Panel not present in DOM. Cannot start JS mobile menu");this.disableFallback(),document.addEventListener("keydown",(t=>{"Escape"!==t.key&&"Esc"!==t.key&&27!==t.keyCode||!this.isOpen()||(this.close(),this.toggleButton.focus())}));const n=()=>{this.compileTemplates(),this.toggleButton.removeEventListener("click",n),this.start()};this.toggleButton.addEventListener("click",n),this.toggleButton.addEventListener("click",(()=>this.toggle())),this.isOpen()&&(window.location.hash="",n(),this.open()),this.running=!0}}},2485:function(t,e){var n;!function(){"use strict";var r={}.hasOwnProperty;function i(){for(var t=[],e=0;e<arguments.length;e++){var n=arguments[e];if(n){var s=typeof n;if("string"===s||"number"===s)t.push(n);else if(Array.isArray(n)){if(n.length){var a=i.apply(null,n);a&&t.push(a)}}else if("object"===s)if(n.toString===Object.prototype.toString)for(var o in n)r.call(n,o)&&n[o]&&t.push(o);else t.push(n.toString())}}return t.join(" ")}t.exports?(i.default=i,t.exports=i):void 0===(n=function(){return i}.apply(e,[]))||(t.exports=n)}()}}]);