"use strict";function _define_property(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}Object.defineProperty(exports,"__esModule",{value:!0}),Object.defineProperty(exports,"default",{enumerable:!0,get:function(){return baseCommands}});var baseCommands=function e(n,t,o){"use strict";var a,c=this;!function(e,n){if(!(e instanceof n))throw TypeError("Cannot call a class as a function")}(this,e),_define_property(this,"name",void 0),_define_property(this,"client",void 0),_define_property(this,"command",void 0),o||null===(a=n.application)||void 0===a||a.commands.create(t).then(function(e){console.log("[command] ".concat(t.name," created")),c.command=e}).catch(function(e){console.log("[command] ".concat(t.name," not created")),console.log(e)}),this.name=t.name,this.client=n};