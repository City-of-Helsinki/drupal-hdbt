(self.webpackChunkhdbt=self.webpackChunkhdbt||[]).push([[209,991],{9296:function(t){class e{constructor(){this.HASH_ID=null,this.buttonSelector=null,this.buttonInstance=null,this.running=!1,this.targetNode=null,this.onOpen=null}isOpen(){return window.location.hash===this.HASH_ID||"true"===this.targetNode.dataset.target}close(){this.running&&(this.buttonInstance.setAttribute("aria-expanded","false"),this.targetNode.dataset.target="false",this.onClose&&this.onClose())}open(){this.running&&(this.buttonInstance.setAttribute("aria-expanded","true"),this.targetNode.dataset.target="true",this.onOpen&&this.onOpen())}toggle(){this.isOpen()?this.close():this.open(),this.buttonInstance.focus()}addListeners(){document.addEventListener("keydown",(t=>{"Escape"!==t.key&&"Esc"!==t.key&&27!==t.keyCode||!this.isOpen()||(this.close(),this.buttonInstance.focus())})),this.buttonInstance.addEventListener("click",(()=>{this.toggle()}))}init({name:t,buttonSelector:e,targetSelector:n,onOpen:s,onClose:i}){if(this.name=t,this.buttonSelector=e,this.buttonInstance=document.querySelector(this.buttonSelector),!this.buttonInstance)return this.running=!1,void console.warn(`${t} button missing. Looking for ${this.buttonSelector}`);if(this.running)console.warn(`${t} already initiated. Is it included more than once?`);else{if(this.HASH_ID=n,this.onOpen=s,this.onClose=i,this.targetNode=document.querySelector(this.HASH_ID),!this.targetNode)throw new Error(`${t} target node missing. Looking for ${this.HASH_ID}`);this.targetNode.dataset.js=!0,this.addListeners(),this.running=!0}}}t.exports=()=>new e}}]);