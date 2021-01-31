/*! airbrake-js v1.4.6 */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(function(){try{return require("os")}catch(e){}}(),function(){try{return require("request")}catch(e){}}()):"function"==typeof define&&define.amd?define([,],t):"object"==typeof exports?exports.Client=t(function(){try{return require("os")}catch(e){}}(),function(){try{return require("request")}catch(e){}}()):(e.airbrakeJs=e.airbrakeJs||{},e.airbrakeJs.Client=t(e[void 0],e[void 0]))}("undefined"!=typeof self?self:this,function(e,t){return function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=4)}([function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.defaultReporter=function(e){return e.request?"node":"function"==typeof fetch?"fetch":"function"==typeof XMLHttpRequest?"xhr":"object"==typeof window?"jsonp":"node"},t.errors={unauthorized:new Error("airbrake: unauthorized: project id or key are wrong"),ipRateLimited:new Error("airbrake: IP is rate limited")}},function(e,t,r){"use strict";t.a=function(e){var t=this.constructor;return this.then(function(r){return t.resolve(e()).then(function(){return r})},function(r){return t.resolve(e()).then(function(){return t.reject(r)})})}},function(e,t){var r;r=function(){return this}();try{r=r||Function("return this")()||(0,eval)("this")}catch(e){"object"==typeof window&&(r=window)}e.exports=r},function(e,t,r){"use strict";(function(e){var n=r(1),o=setTimeout;function i(){}function s(e){if(!(this instanceof s))throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],l(e,this)}function a(e,t){for(;3===e._state;)e=e._value;0!==e._state?(e._handled=!0,s._immediateFn(function(){var r=1===e._state?t.onFulfilled:t.onRejected;if(null!==r){var n;try{n=r(e._value)}catch(e){return void u(t.promise,e)}c(t.promise,n)}else(1===e._state?c:u)(t.promise,e._value)})):e._deferreds.push(t)}function c(e,t){try{if(t===e)throw new TypeError("A promise cannot be resolved with itself.");if(t&&("object"==typeof t||"function"==typeof t)){var r=t.then;if(t instanceof s)return e._state=3,e._value=t,void f(e);if("function"==typeof r)return void l(function(e,t){return function(){e.apply(t,arguments)}}(r,t),e)}e._state=1,e._value=t,f(e)}catch(t){u(e,t)}}function u(e,t){e._state=2,e._value=t,f(e)}function f(e){2===e._state&&0===e._deferreds.length&&s._immediateFn(function(){e._handled||s._unhandledRejectionFn(e._value)});for(var t=0,r=e._deferreds.length;t<r;t++)a(e,e._deferreds[t]);e._deferreds=null}function l(e,t){var r=!1;try{e(function(e){r||(r=!0,c(t,e))},function(e){r||(r=!0,u(t,e))})}catch(e){if(r)return;r=!0,u(t,e)}}s.prototype.catch=function(e){return this.then(null,e)},s.prototype.then=function(e,t){var r=new this.constructor(i);return a(this,new function(e,t,r){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof t?t:null,this.promise=r}(e,t,r)),r},s.prototype.finally=n.a,s.all=function(e){return new s(function(t,r){if(!e||void 0===e.length)throw new TypeError("Promise.all accepts an array");var n=Array.prototype.slice.call(e);if(0===n.length)return t([]);var o=n.length;function i(e,s){try{if(s&&("object"==typeof s||"function"==typeof s)){var a=s.then;if("function"==typeof a)return void a.call(s,function(t){i(e,t)},r)}n[e]=s,0==--o&&t(n)}catch(e){r(e)}}for(var s=0;s<n.length;s++)i(s,n[s])})},s.resolve=function(e){return e&&"object"==typeof e&&e.constructor===s?e:new s(function(t){t(e)})},s.reject=function(e){return new s(function(t,r){r(e)})},s.race=function(e){return new s(function(t,r){for(var n=0,o=e.length;n<o;n++)e[n].then(t,r)})},s._immediateFn="function"==typeof e&&function(t){e(t)}||function(e){o(e,0)},s._unhandledRejectionFn=function(e){"undefined"!=typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",e)},t.a=s}).call(this,r(8).setImmediate)},function(e,t,r){r(5),e.exports=r(6)},function(e,t){Object.assign||(Object.assign=function(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r];for(var n=function(t){t&&Object.keys(t).forEach(function(r){return e[r]=t[r]})},o=0,i=t;o<i.length;o++){n(i[o])}return e})},function(e,t,r){"use strict";var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};r(7);var o=n(r(10)),i=n(r(11)),s=n(r(14)),a=n(r(15)),c=n(r(16)),u=n(r(17)),f=n(r(18)),l=n(r(19)),p=r(0),d=n(r(21)),h=n(r(22)),v=n(r(24)),m=n(r(25)),y=r(26),g=function(){function e(e){void 0===e&&(e={});var t=this;if(this.filters=[],this.offline=!1,this.todo=[],this.onClose=[],!e.projectId||!e.projectKey)throw new Error("airbrake: projectId and projectKey are required");this.opts=e,this.opts.host=this.opts.host||"https://api.airbrake.io",this.opts.timeout=this.opts.timeout||1e4,this.opts.keysBlacklist=this.opts.keysBlacklist||[/password/,/secret/],this.processor=e.processor||i.default,this.setReporter(e.reporter||p.defaultReporter(e)),this.addFilter(s.default),this.addFilter(a.default()),this.addFilter(c.default),this.addFilter(u.default),e.environment&&this.addFilter(function(t){return t.context.environment=e.environment,t}),"object"==typeof window?(this.addFilter(f.default),window.addEventListener&&(this.onOnline=this.onOnline.bind(this),window.addEventListener("online",this.onOnline),this.onOffline=this.onOffline.bind(this),window.addEventListener("offline",this.onOffline),this.onUnhandledrejection=this.onUnhandledrejection.bind(this),window.addEventListener("unhandledrejection",this.onUnhandledrejection),this.onClose.push(function(){window.removeEventListener("online",t.onOnline),window.removeEventListener("offline",t.onOffline),window.removeEventListener("unhandledrejection",t.onUnhandledrejection)}))):this.addFilter(l.default),y.historian.registerNotifier(this),(e.unwrapConsole||function(e){var t=e.environment;return t&&t.startsWith&&t.startsWith("dev")}(e))&&y.historian.unwrapConsole()}return e.prototype.close=function(){for(var e=0,t=this.onClose;e<t.length;e++){(0,t[e])()}y.historian.unregisterNotifier(this)},e.prototype.setReporter=function(e){switch(e){case"fetch":this.reporter=d.default;break;case"node":this.reporter=h.default;break;case"xhr":this.reporter=v.default;break;case"jsonp":this.reporter=m.default;break;default:this.reporter=e}},e.prototype.addFilter=function(e){this.filters.push(e)},e.prototype.notify=function(e){var t=this,r={id:"",errors:[],context:Object.assign({severity:"error"},e.context),params:e.params||{},environment:e.environment||{},session:e.session||{}};if("object"==typeof e&&void 0!==e.error||(e={error:e}),!e.error)return r.error=new Error("airbrake: got err="+JSON.stringify(e.error)+", wanted an Error"),Promise.resolve(r);if(this.opts.ignoreWindowError&&e.context&&e.context.windowError)return r.error=new Error("airbrake: window error is ignored"),Promise.resolve(r);if(this.offline)return new Promise(function(n,o){for(t.todo.push({err:e,resolve:n,reject:o});t.todo.length>100;){var i=t.todo.shift();if(void 0===i)break;r.error=new Error("airbrake: offline queue is too large"),i.resolve(r)}});var n=y.getHistory();n.length>0&&(r.context.history=n);var i=this.processor(e.error);r.errors.push(i);for(var s=0,a=this.filters;s<a.length;s++){var c=(0,a[s])(r);if(null===c)return r.error=new Error("airbrake: error is filtered"),Promise.resolve(r);r=c}r.context||(r.context={}),r.context.language="JavaScript",r.context.notifier={name:"airbrake-js",version:"1.4.6",url:"https://github.com/airbrake/airbrake-js"};var u=o.default(r,{keysBlacklist:this.opts.keysBlacklist});return this.reporter(r,u,this.opts)},e.prototype.wrap=function(e,t){if(void 0===t&&(t=[]),e._airbrake)return e;var r=this,n=function(){var t=Array.prototype.slice.call(arguments),n=r.wrapArguments(t);try{return e.apply(this,n)}catch(e){throw r.notify({error:e,params:{arguments:t}}),y.historian.ignoreNextWindowError(),e}};for(var o in e)e.hasOwnProperty(o)&&(n[o]=e[o]);for(var i=0,s=t;i<s.length;i++){o=s[i];e.hasOwnProperty(o)&&(n[o]=e[o])}return n._airbrake=!0,n.inner=e,n},e.prototype.wrapArguments=function(e){for(var t in e){var r=e[t];"function"==typeof r&&(e[t]=this.wrap(r))}return e},e.prototype.call=function(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r];return this.wrap(e).apply(this,Array.prototype.slice.call(arguments,1))},e.prototype.onerror=function(){y.historian.onerror.apply(y.historian,arguments)},e.prototype.onOnline=function(){this.offline=!1;for(var e=function(e){t.notify(e.err).then(function(t){e.resolve(t)})},t=this,r=0,n=this.todo;r<n.length;r++){e(n[r])}this.todo=[]},e.prototype.onOffline=function(){this.offline=!0},e.prototype.onUnhandledrejection=function(e){var t=e.reason||e.detail.reason,r=t.message||String(t);r.indexOf&&0===r.indexOf("airbrake: ")||this.notify(t)},e}();e.exports=g},function(e,t,r){"use strict";r.r(t),function(e){var t=r(3),n=r(1),o=function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if(void 0!==e)return e;throw new Error("unable to locate global object")}();o.Promise?o.Promise.prototype.finally||(o.Promise.prototype.finally=n.a):o.Promise=t.a}.call(this,r(2))},function(e,t,r){(function(e){var n=void 0!==e&&e||"undefined"!=typeof self&&self||window,o=Function.prototype.apply;function i(e,t){this._id=e,this._clearFn=t}t.setTimeout=function(){return new i(o.call(setTimeout,n,arguments),clearTimeout)},t.setInterval=function(){return new i(o.call(setInterval,n,arguments),clearInterval)},t.clearTimeout=t.clearInterval=function(e){e&&e.close()},i.prototype.unref=i.prototype.ref=function(){},i.prototype.close=function(){this._clearFn.call(n,this._id)},t.enroll=function(e,t){clearTimeout(e._idleTimeoutId),e._idleTimeout=t},t.unenroll=function(e){clearTimeout(e._idleTimeoutId),e._idleTimeout=-1},t._unrefActive=t.active=function(e){clearTimeout(e._idleTimeoutId);var t=e._idleTimeout;t>=0&&(e._idleTimeoutId=setTimeout(function(){e._onTimeout&&e._onTimeout()},t))},r(9),t.setImmediate="undefined"!=typeof self&&self.setImmediate||void 0!==e&&e.setImmediate||this&&this.setImmediate,t.clearImmediate="undefined"!=typeof self&&self.clearImmediate||void 0!==e&&e.clearImmediate||this&&this.clearImmediate}).call(this,r(2))},function(e,t,r){(function(e){!function(e,t){"use strict";if(!e.setImmediate){var r,n=1,o={},i=!1,s=e.document,a=Object.getPrototypeOf&&Object.getPrototypeOf(e);a=a&&a.setTimeout?a:e,"[object process]"==={}.toString.call(e.process)?r=function(e){process.nextTick(function(){u(e)})}:function(){if(e.postMessage&&!e.importScripts){var t=!0,r=e.onmessage;return e.onmessage=function(){t=!1},e.postMessage("","*"),e.onmessage=r,t}}()?function(){var t="setImmediate$"+Math.random()+"$",n=function(r){r.source===e&&"string"==typeof r.data&&0===r.data.indexOf(t)&&u(+r.data.slice(t.length))};e.addEventListener?e.addEventListener("message",n,!1):e.attachEvent("onmessage",n),r=function(r){e.postMessage(t+r,"*")}}():e.MessageChannel?function(){var e=new MessageChannel;e.port1.onmessage=function(e){u(e.data)},r=function(t){e.port2.postMessage(t)}}():s&&"onreadystatechange"in s.createElement("script")?function(){var e=s.documentElement;r=function(t){var r=s.createElement("script");r.onreadystatechange=function(){u(t),r.onreadystatechange=null,e.removeChild(r),r=null},e.appendChild(r)}}():r=function(e){setTimeout(u,0,e)},a.setImmediate=function(e){"function"!=typeof e&&(e=new Function(""+e));for(var t=new Array(arguments.length-1),i=0;i<t.length;i++)t[i]=arguments[i+1];var s={callback:e,args:t};return o[n]=s,r(n),n++},a.clearImmediate=c}function c(e){delete o[e]}function u(e){if(i)setTimeout(u,0,e);else{var r=o[e];if(r){i=!0;try{!function(e){var r=e.callback,n=e.args;switch(n.length){case 0:r();break;case 1:r(n[0]);break;case 2:r(n[0],n[1]);break;case 3:r(n[0],n[1],n[2]);break;default:r.apply(t,n)}}(r)}finally{c(e),i=!1}}}}}("undefined"==typeof self?void 0===e?this:e:self)}).call(this,r(2))},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=128;function o(e,t){return e>>t||1}t.default=function(e,t){var r=void 0===t?{}:t,n=r.maxLength,o=void 0===n?64e3:n,a=r.keysBlacklist,c=void 0===a?[]:a;if(e.errors)for(var u in e.errors){var f=new i({keysBlacklist:c});e.errors[u]=f.truncate(e.errors[u])}for(var l="",p=["context","params","environment","session"],d=0;d<8;d++){for(var h={level:d,keysBlacklist:c},v=0,m=p;v<m.length;v++)(x=e[b=m[v]])&&(e[b]=s(x,h));if((l=JSON.stringify(e)).length<o)return l}var y={json:l.slice(0,Math.floor(o/2))+"..."};p.push("errors");for(var g=0,w=p;g<w.length;g++){var b,x;(x=e[b=w[g]])&&(l=JSON.stringify(x),y[b]=l.length)}var j=new Error("airbrake: notice exceeds max length and can't be truncated");throw j.params=y,j};var i=function(){function e(e){this.maxStringLength=1024,this.maxObjectLength=n,this.maxArrayLength=n,this.maxDepth=8,this.keys=[],this.keysBlacklist=[],this.seen=[];var t=e.level||0;this.keysBlacklist=e.keysBlacklist||[],this.maxStringLength=o(this.maxStringLength,t),this.maxObjectLength=o(this.maxObjectLength,t),this.maxArrayLength=o(this.maxArrayLength,t),this.maxDepth=o(this.maxDepth,t)}return e.prototype.truncate=function(e,t,r){if(void 0===t&&(t=""),void 0===r&&(r=0),null===e||void 0===e)return e;switch(typeof e){case"boolean":case"number":case"function":return e;case"string":return this.truncateString(e);case"object":break;default:return this.truncateString(String(e))}if(e instanceof String)return this.truncateString(e.toString());if(e instanceof Boolean||e instanceof Number||e instanceof Date||e instanceof RegExp)return e;if(e instanceof Error)return this.truncateString(e.toString());if(this.seen.indexOf(e)>=0)return"[Circular "+this.getPath(e)+"]";var n=function(e){return Object.prototype.toString.apply(e).slice("[object ".length,-1)}(e);if(++r>this.maxDepth)return"[Truncated "+n+"]";switch(this.keys.push(t),this.seen.push(e),n){case"Array":return this.truncateArray(e,r);case"Object":return this.truncateObject(e,r);default:var o=this.maxDepth;this.maxDepth=0;var i=this.truncateObject(e,r);return i.__type=n,this.maxDepth=o,i}},e.prototype.getPath=function(e){for(var t=this.seen.indexOf(e),r=[this.keys[t]],n=t;n>=0;n--){var o=this.seen[n];o&&a(o,r[0])===e&&(e=o,r.unshift(this.keys[n]))}return"~"+r.join(".")},e.prototype.truncateString=function(e){return e.length>this.maxStringLength?e.slice(0,this.maxStringLength)+"...":e},e.prototype.truncateArray=function(e,t){void 0===t&&(t=0);var r=0,n=[];for(var o in e){var i=e[o];if(n.push(this.truncate(i,o,t)),++r>=this.maxArrayLength)break}return n},e.prototype.truncateObject=function(e,t){void 0===t&&(t=0);var r=0,n={};for(var o in e)if(c(o,this.keysBlacklist))n[o]="[Filtered]";else{var i=a(e,o);if(void 0!==i&&"function"!=typeof i&&(n[o]=this.truncate(i,o,t),++r>=this.maxObjectLength))break}return n},e}();function s(e,t){return void 0===t&&(t={}),new i(t).truncate(e)}function a(e,t){try{return e[t]}catch(e){return}}function c(e,t){for(var r=0,n=t;r<n.length;r++){var o=n[r];if(o===e)return!0;if(o instanceof RegExp&&e.match(o))return!0}return!1}t.truncate=s},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(12),o="object"==typeof console&&console.warn;function i(e){try{return n.parse(e)}catch(t){o&&e.stack&&console.warn("ErrorStackParser:",t.toString(),e.stack)}return e.fileName?[e]:[]}t.default=function(e){var t=[];if(!e.noStack){var r=i(e);if(0===r.length)try{throw new Error("fake")}catch(e){(r=i(e)).shift(),r.shift()}for(var n=0,o=r;n<o.length;n++){var s=o[n];t.push({function:s.functionName||"",file:s.fileName||"",line:s.lineNumber||0,column:s.columnNumber||0})}}return{type:e.name?e.name:"",message:e.message?String(e.message):String(e),backtrace:t}}},function(e,t,r){!function(t,n){"use strict";e.exports=n(r(13))}(0,function(e){"use strict";var t=/(^|@)\S+\:\d+/,r=/^\s*at .*(\S+\:\d+|\(native\))/m,n=/^(eval@)?(\[native code\])?$/;return{parse:function(e){if(void 0!==e.stacktrace||void 0!==e["opera#sourceloc"])return this.parseOpera(e);if(e.stack&&e.stack.match(r))return this.parseV8OrIE(e);if(e.stack)return this.parseFFOrSafari(e);throw new Error("Cannot parse given Error object")},extractLocation:function(e){if(-1===e.indexOf(":"))return[e];var t=/(.+?)(?:\:(\d+))?(?:\:(\d+))?$/.exec(e.replace(/[\(\)]/g,""));return[t[1],t[2]||void 0,t[3]||void 0]},parseV8OrIE:function(t){return t.stack.split("\n").filter(function(e){return!!e.match(r)},this).map(function(t){t.indexOf("(eval ")>-1&&(t=t.replace(/eval code/g,"eval").replace(/(\(eval at [^\()]*)|(\)\,.*$)/g,""));var r=t.replace(/^\s+/,"").replace(/\(eval code/g,"(").split(/\s+/).slice(1),n=this.extractLocation(r.pop()),o=r.join(" ")||void 0,i=["eval","<anonymous>"].indexOf(n[0])>-1?void 0:n[0];return new e({functionName:o,fileName:i,lineNumber:n[1],columnNumber:n[2],source:t})},this)},parseFFOrSafari:function(t){return t.stack.split("\n").filter(function(e){return!e.match(n)},this).map(function(t){if(t.indexOf(" > eval")>-1&&(t=t.replace(/ line (\d+)(?: > eval line \d+)* > eval\:\d+\:\d+/g,":$1")),-1===t.indexOf("@")&&-1===t.indexOf(":"))return new e({functionName:t});var r=/((.*".+"[^@]*)?[^@]*)(?:@)/,n=t.match(r),o=n&&n[1]?n[1]:void 0,i=this.extractLocation(t.replace(r,""));return new e({functionName:o,fileName:i[0],lineNumber:i[1],columnNumber:i[2],source:t})},this)},parseOpera:function(e){return!e.stacktrace||e.message.indexOf("\n")>-1&&e.message.split("\n").length>e.stacktrace.split("\n").length?this.parseOpera9(e):e.stack?this.parseOpera11(e):this.parseOpera10(e)},parseOpera9:function(t){for(var r=/Line (\d+).*script (?:in )?(\S+)/i,n=t.message.split("\n"),o=[],i=2,s=n.length;i<s;i+=2){var a=r.exec(n[i]);a&&o.push(new e({fileName:a[2],lineNumber:a[1],source:n[i]}))}return o},parseOpera10:function(t){for(var r=/Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i,n=t.stacktrace.split("\n"),o=[],i=0,s=n.length;i<s;i+=2){var a=r.exec(n[i]);a&&o.push(new e({functionName:a[3]||void 0,fileName:a[2],lineNumber:a[1],source:n[i]}))}return o},parseOpera11:function(r){return r.stack.split("\n").filter(function(e){return!!e.match(t)&&!e.match(/^Error created at/)},this).map(function(t){var r,n=t.split("@"),o=this.extractLocation(n.pop()),i=n.shift()||"",s=i.replace(/<anonymous function(: (\w+))?>/,"$2").replace(/\([^\)]*\)/g,"")||void 0;i.match(/\(([^\)]*)\)/)&&(r=i.replace(/^[^\(]+\(([^\)]*)\)$/,"$1"));var a=void 0===r||"[arguments not available]"===r?void 0:r.split(",");return new e({functionName:s,args:a,fileName:o[0],lineNumber:o[1],columnNumber:o[2],source:t})},this)}}})},function(e,t,r){!function(t,r){"use strict";e.exports=r()}(0,function(){"use strict";function e(e){return!isNaN(parseFloat(e))&&isFinite(e)}function t(e){return e.charAt(0).toUpperCase()+e.substring(1)}function r(e){return function(){return this[e]}}var n=["isConstructor","isEval","isNative","isToplevel"],o=["columnNumber","lineNumber"],i=["fileName","functionName","source"],s=n.concat(o,i,["args"]);function a(e){if(e instanceof Object)for(var r=0;r<s.length;r++)e.hasOwnProperty(s[r])&&void 0!==e[s[r]]&&this["set"+t(s[r])](e[s[r]])}a.prototype={getArgs:function(){return this.args},setArgs:function(e){if("[object Array]"!==Object.prototype.toString.call(e))throw new TypeError("Args must be an Array");this.args=e},getEvalOrigin:function(){return this.evalOrigin},setEvalOrigin:function(e){if(e instanceof a)this.evalOrigin=e;else{if(!(e instanceof Object))throw new TypeError("Eval Origin must be an Object or StackFrame");this.evalOrigin=new a(e)}},toString:function(){return(this.getFunctionName()||"{anonymous}")+("("+(this.getArgs()||[]).join(",")+")")+(this.getFileName()?"@"+this.getFileName():"")+(e(this.getLineNumber())?":"+this.getLineNumber():"")+(e(this.getColumnNumber())?":"+this.getColumnNumber():"")}};for(var c=0;c<n.length;c++)a.prototype["get"+t(n[c])]=r(n[c]),a.prototype["set"+t(n[c])]=function(e){return function(t){this[e]=Boolean(t)}}(n[c]);for(var u=0;u<o.length;u++)a.prototype["get"+t(o[u])]=r(o[u]),a.prototype["set"+t(o[u])]=function(t){return function(r){if(!e(r))throw new TypeError(t+" must be a Number");this[t]=Number(r)}}(o[u]);for(var f=0;f<i.length;f++)a.prototype["get"+t(i[f])]=r(i[f]),a.prototype["set"+t(i[f])]=function(e){return function(t){this[e]=String(t)}}(i[f]);return a})},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=["Script error","Script error.","InvalidAccessError"];t.default=function(e){var t=e.errors[0];return""===t.type&&-1!==n.indexOf(t.message)?null:t.backtrace&&t.backtrace.length>0&&"<anonymous>"===t.backtrace[0].file?null:e}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){var e,t;return function(r){var n=JSON.stringify(r.errors);return n===e?null:(t&&clearTimeout(t),e=n,t=setTimeout(function(){e=""},1e3),r)}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=new RegExp(["^","Uncaught\\s","(.+?)",":\\s","(.+)","$"].join(""));t.default=function(e){var t=e.errors[0];if(""!==t.type&&"Error"!==t.type)return e;var r=t.message.match(n);return null!==r&&(t.type=r[1],t.message=r[2]),e}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=new RegExp(["^","\\[(\\$.+)\\]","\\s","([\\s\\S]+)","$"].join(""));t.default=function(e){var t=e.errors[0];if(""!==t.type&&"Error"!==t.type)return e;var r=t.message.match(n);return null!==r&&(t.type=r[1],t.message=r[2]),e}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){return window.navigator&&window.navigator.userAgent&&(e.context.userAgent=window.navigator.userAgent),window.location&&(e.context.url=String(window.location),e.context.rootDirectory=window.location.protocol+"//"+window.location.host),e}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){var t;try{t=r(20)}catch(e){}if(t&&(e.context.os=t.type()+"/"+t.release(),e.context.architecture=t.arch(),e.context.hostname=t.hostname(),e.params.os={homedir:t.homedir(),uptime:t.uptime(),freemem:t.freemem(),totalmem:t.totalmem(),loadavg:t.loadavg()}),process)for(var n in e.context.platform=process.platform,e.context.rootDirectory||(e.context.rootDirectory=process.cwd()),process.env.NODE_ENV&&(e.context.environment=process.env.NODE_ENV),e.params.process={pid:process.pid,cwd:process.cwd(),execPath:process.execPath,argv:process.argv},["uptime","cpuUsage","memoryUsage"])process[n]&&(e.params.process[n]=process[n]());return e}},function(t,r){if(void 0===e){var n=new Error("Cannot find module 'undefined'");throw n.code="MODULE_NOT_FOUND",n}t.exports=e},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(0),o=0;t.default=function(e,t,r){if(Date.now()/1e3<o)return e.error=n.errors.ipRateLimited,Promise.resolve(e);var i=r.host+"/api/v3/projects/"+r.projectId+"/notices?key="+r.projectKey,s={method:"POST",body:t};return new Promise(function(t,r){fetch(i,s).then(function(r){if(401===r.status)return e.error=n.errors.unauthorized,void t(e);if(429!==r.status)if(r.status>=200&&r.status<500){var i=void 0;try{i=r.json()}catch(r){return e.error=r,void t(e)}i.then(function(r){return r.id?(e.id=r.id,void t(e)):r.message?(e.error=new Error(r.message),void t(e)):void 0})}else r.text().then(function(n){e.error=new Error("airbrake: fetch: unexpected response: code="+r.status+" body='"+n+"'"),t(e)});else{e.error=n.errors.ipRateLimited,t(e);var s=r.headers.get("X-RateLimit-Delay");if(!s)return;var a=parseInt(s,10);a>0&&(o=Date.now()/1e3+a)}}).catch(function(r){e.error=r,t(e)})})}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(0),o=0;t.default=function(e,t,i){var s;try{s=r(23)}catch(e){console.log("airbrake-js: please install request package")}if(Date.now()/1e3<o)return e.error=n.errors.ipRateLimited,Promise.resolve(e);var a=i.host+"/api/v3/projects/"+i.projectId+"/notices?key="+i.projectKey;return new Promise(function(r,c){(i.request||s)({url:a,method:"POST",body:t,headers:{"content-type":"application/json"},timeout:i.timeout},function(t,i,s){if(t)return e.error=t,void r(e);if(!i.statusCode)return e.error=new Error("airbrake: node: statusCode is null or undefined"),void r(e);if(401===i.statusCode)return e.error=n.errors.unauthorized,void r(e);if(429!==i.statusCode){if(i.statusCode>=200&&i.statusCode<500){var a=void 0;try{a=JSON.parse(s)}catch(t){return e.error=t,void r(e)}if(a.id)return e.id=a.id,void r(e);if(a.message)return e.error=new Error(a.message),void r(e)}s=s.trim(),e.error=new Error("airbrake: node: unexpected response: code="+i.statusCode+" body='"+s+"'"),r(e)}else{e.error=n.errors.ipRateLimited,r(e);var c=i.headers["x-ratelimit-delay"];if(!c)return;var u=void 0;if("string"==typeof c)u=c;else{if(!(c instanceof Array))return;u=c[0]}var f=parseInt(u,10);f>0&&(o=Date.now()/1e3+f)}})})}},function(e,r){if(void 0===t){var n=new Error("Cannot find module 'undefined'");throw n.code="MODULE_NOT_FOUND",n}e.exports=t},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(0),o=0;t.default=function(e,t,r){if(Date.now()/1e3<o)return e.error=n.errors.ipRateLimited,Promise.resolve(e);var i=r.host+"/api/v3/projects/"+r.projectId+"/notices?key="+r.projectKey;return new Promise(function(s,a){var c=new XMLHttpRequest;c.open("POST",i,!0),c.timeout=r.timeout,c.onreadystatechange=function(){if(4===c.readyState){if(401===c.status)return e.error=n.errors.unauthorized,void s(e);if(429!==c.status){if(c.status>=200&&c.status<500){var t=void 0;try{t=JSON.parse(c.responseText)}catch(t){return e.error=t,void s(e)}if(t.id)return e.id=t.id,void s(e);if(t.message)return e.error=new Error(t.message),void s(e)}var r=c.responseText.trim();e.error=new Error("airbrake: xhr: unexpected response: code="+c.status+" body='"+r+"'"),s(e)}else{e.error=n.errors.ipRateLimited,s(e);var i=c.getResponseHeader("X-RateLimit-Delay");if(!i)return;var a=parseInt(i,10);a>0&&(o=Date.now()/1e3+a)}}},c.send(t)})}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=0;t.default=function(e,t,r){return new Promise(function(o,i){var s="airbrakeCb"+String(++n);window[s]=function(t){try{delete window[s]}catch(e){window[s]=void 0}return t.id?(e.id=t.id,void o(e)):t.message?(e.error=new Error(t.message),void o(e)):(e.error=new Error(t),void o(e))},t=encodeURIComponent(t);var a=r.host+"/api/v3/projects/"+r.projectId+"/create-notice?key="+r.projectKey+"&callback="+s+"&body="+t,c=window.document,u=c.getElementsByTagName("head")[0],f=c.createElement("script");f.src=a,f.onload=function(){return u.removeChild(f)},f.onerror=function(){u.removeChild(f),e.error=new Error("airbrake: JSONP script error"),o(e)},u.appendChild(f)})}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(27),o=["debug","log","info","warn","error"],i=function(){function e(){var e=this;if(this.historyMaxLen=20,this.notifiers=[],this.errors=[],this.ignoreWindowError=0,this.history=[],this.ignoreNextXHR=0,"object"==typeof console&&console.error&&(this.consoleError=console.error),"object"==typeof window){var t=this,r=window.onerror;window.onerror=function(){r&&r.apply(this,arguments),t.onerror.apply(t,arguments)},this.domEvents(),"function"==typeof fetch&&this.fetch(),"object"==typeof history&&this.location()}"object"==typeof process&&"function"==typeof process.on&&(process.on("uncaughtException",function(t){e.notify(t).then(function(){1===process.listeners("uncaughtException").length&&(e.consoleError&&e.consoleError("uncaught exception",t),process.exit(1))})}),process.on("unhandledRejection",function(t,r){var n=t.message||String(t);n.indexOf&&0===n.indexOf("airbrake: ")||e.notify(t).then(function(){1===process.listeners("unhandledRejection").length&&(e.consoleError&&e.consoleError("unhandled rejection",t),process.exit(1))})})),"object"==typeof console&&this.console(),"undefined"!=typeof XMLHttpRequest&&this.xhr()}return e.prototype.registerNotifier=function(e){this.notifiers.push(e);for(var t=0,r=this.errors;t<r.length;t++){var n=r[t];this.notifyNotifiers(n)}this.errors=[]},e.prototype.unregisterNotifier=function(e){var t=this.notifiers.indexOf(e);-1!==t&&this.notifiers.splice(t,1)},e.prototype.notify=function(e){return this.notifiers.length>0?this.notifyNotifiers(e):(this.errors.push(e),this.errors.length>this.historyMaxLen&&(this.errors=this.errors.slice(-this.historyMaxLen)),Promise.resolve({}))},e.prototype.notifyNotifiers=function(e){for(var t=[],r=0,n=this.notifiers;r<n.length;r++){var o=n[r];t.push(o.notify(e))}return Promise.all(t).then(function(e){return e[0]})},e.prototype.onerror=function(e,t,r,n,o){this.ignoreWindowError>0||(o?this.notify({error:o,context:{windowError:!0}}):t&&r&&this.notify({error:{message:e,fileName:t,lineNumber:r,columnNumber:n,noStack:!0},context:{windowError:!0}}))},e.prototype.ignoreNextWindowError=function(){var e=this;this.ignoreWindowError++,setTimeout(function(){return e.ignoreWindowError--})},e.prototype.getHistory=function(){return this.history},e.prototype.pushHistory=function(e){this.isDupState(e)?this.lastState.num?this.lastState.num++:this.lastState.num=2:(e.date||(e.date=new Date),this.history.push(e),this.lastState=e,this.history.length>this.historyMaxLen&&(this.history=this.history.slice(-this.historyMaxLen)))},e.prototype.isDupState=function(e){if(!this.lastState)return!1;for(var t in e)if("date"!==t&&e[t]!==this.lastState[t])return!1;return!0},e.prototype.domEvents=function(){var e=n.makeEventHandler(this);window.addEventListener&&(window.addEventListener("load",e),window.addEventListener("error",function(t){"error"in t||e(t)},!0)),"object"==typeof document&&document.addEventListener&&(document.addEventListener("DOMContentLoaded",e),document.addEventListener("click",e),document.addEventListener("keypress",e))},e.prototype.console=function(){for(var e=this,t=function(t){if(!(t in console))return"continue";var r=console[t],n=function(){r.apply(console,arguments),e.pushHistory({type:"log",severity:t,arguments:Array.prototype.slice.call(arguments)})};n.inner=r,console[t]=n},r=0,n=o;r<n.length;r++){t(n[r])}},e.prototype.unwrapConsole=function(){for(var e=0,t=o;e<t.length;e++){var r=t[e];r in console&&console[r].inner&&(console[r]=console[r].inner)}},e.prototype.fetch=function(){var e=this,t=fetch;window.fetch=function(r,n){var o={type:"xhr",date:new Date};o.url="string"==typeof r?r:r.url,n&&n.method?o.method=n.method:o.method="GET",e.ignoreNextXHR++,setTimeout(function(){return e.ignoreNextXHR--});var i=t.apply(this,arguments);return i.then(function(t){o.statusCode=t.status,o.duration=(new Date).getTime()-o.date.getTime(),e.pushHistory(o)}),i}},e.prototype.xhr=function(){var e=this,t=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(r,n,o,i,s){0===e.ignoreNextXHR&&(this.__state={type:"xhr",method:r,url:n}),t.apply(this,arguments)};var r=XMLHttpRequest.prototype.send;XMLHttpRequest.prototype.send=function(t){var n=this.onreadystatechange;return this.onreadystatechange=function(t){if(4===this.readyState&&this.__state&&e.recordReq(this),n)return n.apply(this,arguments)},this.__state&&(this.__state.date=new Date),r.apply(this,arguments)}},e.prototype.recordReq=function(e){var t=e.__state;t.statusCode=e.status,t.duration=(new Date).getTime()-t.date.getTime(),this.pushHistory(t)},e.prototype.location=function(){this.lastLocation=document.location.pathname;var e=this,t=window.onpopstate;window.onpopstate=function(r){if(e.recordLocation(document.location.pathname),t)return t.apply(this,arguments)};var r=history.pushState;history.pushState=function(t,n,o){o&&e.recordLocation(o.toString()),r.apply(this,arguments)}},e.prototype.recordLocation=function(e){var t=e.indexOf("://");t>=0?e=(t=(e=e.slice(t+3)).indexOf("/"))>=0?e.slice(t):"/":"/"!==e.charAt(0)&&(e="/"+e),this.pushHistory({type:"location",from:this.lastLocation,to:e}),this.lastLocation=e},e}();t.default=i,t.historian=new i,t.getHistory=function(){return t.historian.getHistory()}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=["type","name","src"];function o(e){if(!e)return"";var t=[];if(e.tagName&&t.push(e.tagName.toLowerCase()),e.id&&(t.push("#"),t.push(e.id)),e.className&&(t.push("."),t.push(e.className.split(" ").join("."))),e.getAttribute)for(var r=0,o=n;r<o.length;r++){var i=o[r],s=e.getAttribute(i);s&&t.push("["+i+'="'+s+'"]')}return t.join("")}t.makeEventHandler=function(e){return function(t){var r;try{r=t.target}catch(e){return}if(r){var n={type:t.type};try{n.target=function(e){for(var t=[],r=e;r;){var n=o(r);if(""!==n&&(t.push(n),t.length>10))break;r=r.parentNode}return 0===t.length?String(e):t.reverse().join(" > ")}(r)}catch(e){n.target="<"+e.toString()+">"}e.pushHistory(n)}}}}])});
//# sourceMappingURL=client.min.js.map