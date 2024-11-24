"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),Object.defineProperty(exports,"default",{enumerable:!0,get:function(){return Logout}});var _discord=require("discord.js"),_main=require("../../../main"),_database=require("../../functions/database");function asyncGeneratorStep(e,t,r,n,o,a,u){try{var i=e[a](u),l=i.value}catch(e){r(e);return}i.done?t(l):Promise.resolve(l).then(n,o)}function Logout(e,t){return _Logout.apply(this,arguments)}function _Logout(){var e;return e=function(e,t){return function(e,t){var r,n,o,a,u={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return a={next:i(0),throw:i(1),return:i(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function i(a){return function(i){return function(a){if(r)throw TypeError("Generator is already executing.");for(;u;)try{if(r=1,n&&(o=2&a[0]?n.return:a[0]?n.throw||((o=n.return)&&o.call(n),0):n.next)&&!(o=o.call(n,a[1])).done)return o;switch(n=0,o&&(a=[2&a[0],o.value]),a[0]){case 0:case 1:o=a;break;case 4:return u.label++,{value:a[1],done:!1};case 5:u.label++,n=a[1],a=[0];continue;case 7:a=u.ops.pop(),u.trys.pop();continue;default:if(!(o=(o=u.trys).length>0&&o[o.length-1])&&(6===a[0]||2===a[0])){u=0;continue}if(3===a[0]&&(!o||a[1]>o[0]&&a[1]<o[3])){u.label=a[1];break}if(6===a[0]&&u.label<o[1]){u.label=o[1],o=a;break}if(o&&u.label<o[2]){u.label=o[2],u.ops.push(a);break}o[2]&&u.ops.pop(),u.trys.pop();continue}a=t.call(e,u)}catch(e){a=[6,e],n=0}finally{r=o=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,i])}}}(this,function(r){try{(0,_database.removeToken)(t.user.id,e.client.database)&&t.reply({content:_main.bt.__({phrase:"You have been logged out",locale:t.locale}),flags:_discord.MessageFlags.Ephemeral})}catch(e){t.reply({content:_main.bt.__({phrase:"You were not logged in",locale:t.locale}),flags:_discord.MessageFlags.Ephemeral})}return[2]})},(_Logout=function(){var t=this,r=arguments;return new Promise(function(n,o){var a=e.apply(t,r);function u(e){asyncGeneratorStep(a,n,o,u,i,"next",e)}function i(e){asyncGeneratorStep(a,n,o,u,i,"throw",e)}u(void 0)})}).apply(this,arguments)}