"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var _client=require("@prisma/client"),_assert=_interop_require_default(require("assert")),_database=require("../bot/functions/database"),_nodetest=_interop_require_default(require("node:test"));function asyncGeneratorStep(e,t,r,a,s,n,u){try{var o=e[n](u),i=o.value}catch(e){r(e);return}o.done?t(i):Promise.resolve(i).then(a,s)}function _async_to_generator(e){return function(){var t=this,r=arguments;return new Promise(function(a,s){var n=e.apply(t,r);function u(e){asyncGeneratorStep(n,a,s,u,o,"next",e)}function o(e){asyncGeneratorStep(n,a,s,u,o,"throw",e)}u(void 0)})}}function _interop_require_default(e){return e&&e.__esModule?e:{default:e}}function _ts_generator(e,t){var r,a,s,n,u={label:0,sent:function(){if(1&s[0])throw s[1];return s[1]},trys:[],ops:[]};return n={next:o(0),throw:o(1),return:o(2)},"function"==typeof Symbol&&(n[Symbol.iterator]=function(){return this}),n;function o(n){return function(o){return function(n){if(r)throw TypeError("Generator is already executing.");for(;u;)try{if(r=1,a&&(s=2&n[0]?a.return:n[0]?a.throw||((s=a.return)&&s.call(a),0):a.next)&&!(s=s.call(a,n[1])).done)return s;switch(a=0,s&&(n=[2&n[0],s.value]),n[0]){case 0:case 1:s=n;break;case 4:return u.label++,{value:n[1],done:!1};case 5:u.label++,a=n[1],n=[0];continue;case 7:n=u.ops.pop(),u.trys.pop();continue;default:if(!(s=(s=u.trys).length>0&&s[s.length-1])&&(6===n[0]||2===n[0])){u=0;continue}if(3===n[0]&&(!s||n[1]>s[0]&&n[1]<s[3])){u.label=n[1];break}if(6===n[0]&&u.label<s[1]){u.label=s[1],s=n;break}if(s&&u.label<s[2]){u.label=s[2],u.ops.push(n);break}s[2]&&u.ops.pop(),u.trys.pop();continue}n=t.call(e,u)}catch(e){n=[6,e],a=0}finally{r=s=0}if(5&n[0])throw n[1];return{value:n[0]?n[1]:void 0,done:!0}}([n,o])}}}var database=new _client.PrismaClient;(0,_nodetest.default)("Create user",_async_to_generator(function(){var e;return _ts_generator(this,function(t){switch(t.label){case 0:return[4,(0,_database.createUser)({id:"123",horde_token:"123"},database)];case 1:return e=t.sent(),_assert.default.strictEqual(e.id,"123"),_assert.default.strictEqual(e.horde_token,"123"),_assert.default.strictEqual(e.horde_config,null),[2]}})})),(0,_nodetest.default)("Remove token",_async_to_generator(function(){var e,t;return _ts_generator(this,function(r){switch(r.label){case 0:return[4,(0,_database.removeToken)("123",database)];case 1:return(e=r.sent())&&(_assert.default.strictEqual(e.id,"123"),_assert.default.strictEqual(e.horde_token,null)),[4,database.users.delete({where:{id:"123"}})];case 2:return t=r.sent(),_assert.default.strictEqual(t.id,"123"),_assert.default.strictEqual(t.horde_token,null),[2]}})})),(0,_nodetest.default)("Get user",_async_to_generator(function(){var e;return _ts_generator(this,function(t){switch(t.label){case 0:return[4,(0,_database.getUser)("123",database)];case 1:return e=t.sent(),_assert.default.strictEqual(e.id,"123"),_assert.default.strictEqual(e.horde_token,null),_assert.default.strictEqual(e.horde_config,null),[2]}})})),(0,_nodetest.default)("Get user with token",_async_to_generator(function(){var e;return _ts_generator(this,function(t){switch(t.label){case 0:return[4,(0,_database.createUser)({id:"123",horde_token:"123"},database)];case 1:return e=t.sent(),_assert.default.strictEqual(e.id,"123"),_assert.default.strictEqual(e.horde_token,"123"),[2]}})})),(0,_nodetest.default)("Remove user",_async_to_generator(function(){var e;return _ts_generator(this,function(t){switch(t.label){case 0:return[4,database.users.delete({where:{id:"123"}})];case 1:return e=t.sent(),_assert.default.strictEqual(e.id,"123"),_assert.default.strictEqual(e.horde_token,"123"),[2]}})})),(0,_nodetest.default)("Create user with a config and without a token",_async_to_generator(function(){var e;return _ts_generator(this,function(t){switch(t.label){case 0:return[4,(0,_database.createUser)({id:"123",horde_config:{create:{id:"123",loras:{create:{loras_id:"123"}}}}},database)];case 1:return e=t.sent(),_assert.default.strictEqual(e.id,"123"),_assert.default.strictEqual(e.horde_token,null),_assert.default.strictEqual(e.horde_config.id,"123"),_assert.default.strictEqual(e.horde_config.loras[0].loras_id,"123"),[2]}})})),(0,_nodetest.default)("Update the user with a token",_async_to_generator(function(){var e;return _ts_generator(this,function(t){switch(t.label){case 0:return[4,(0,_database.createUser)({id:"123",horde_token:"123"},database)];case 1:return e=t.sent(),_assert.default.strictEqual(e.id,"123"),_assert.default.strictEqual(e.horde_token,"123"),_assert.default.strictEqual(e.horde_config.id,"123"),[2]}})})),(0,_nodetest.default)("Delete user, config and loras",_async_to_generator(function(){var e,t,r;return _ts_generator(this,function(a){switch(a.label){case 0:return[4,database.loras.deleteMany({where:{aiHordeConfigId:"123"}})];case 1:return e=a.sent(),[4,database.aIHordeConfig.delete({where:{userId:"123"}})];case 2:return t=a.sent(),[4,database.users.delete({where:{id:"123"}})];case 3:return r=a.sent(),_assert.default.strictEqual(r.id,"123"),_assert.default.strictEqual(r.horde_token,"123"),_assert.default.strictEqual(t.id,"123"),_assert.default.strictEqual(e.count,1),[2]}})}));