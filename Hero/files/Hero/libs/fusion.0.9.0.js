!function(e){var t={};function n(o){if(t[o])return t[o].exports;var i=t[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(o,i,function(t){return e[t]}.bind(null,i));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=13)}([,function(e,t,n){"use strict";t.a={SCENE_PLUGINS_READY:"SCENE_PLUGINS_READY",SCENE_PRE_READY:"SCENE_PRE_READY",SCENE_READY:"SCENE_READY"}},function(e,t,n){"use strict";function o(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}n.d(t,"a",(function(){return i}));var i=function(){function e(){var t,n,o;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),o={},(n="events")in(t=this)?Object.defineProperty(t,n,{value:o,enumerable:!0,configurable:!0,writable:!0}):t[n]=o}var t,n,i;return t=e,(n=[{key:"emit",value:function(e){var t=[].slice.call(arguments,1);[].slice.call(this.events[e]||[]).filter((function(e){e.apply(null,t)}))}},{key:"on",value:function(e,t){return(this.events[e]=this.events[e]||[]).push(t),function(){this.events[e]=this.events[e].filter((function(e){return e!==t}))}.bind(this)}},{key:"unbindAll",value:function(){this.events={}}}])&&o(t.prototype,n),i&&o(t,i),e}()},function(e,t,n){var o=n(4);"string"==typeof o&&(o=[[e.i,o,""]]);var i={insert:"head",singleton:!1};n(6)(o,i);o.locals&&(e.exports=o.locals)},function(e,t,n){(e.exports=n(5)(!1)).push([e.i,".fusion--player{display:flex;justify-content:center}.fusion--player .fusion--viewport{position:relative;width:100%;height:100%}.fusion--player .fusion--viewport .fusion--scene{position:absolute;top:0;right:0;bottom:0;left:0;overflow-x:hidden;overflow-y:hidden;visibility:hidden;opacity:0}.fusion--player .fusion--viewport .fusion--scene.visible{visibility:visible;opacity:1}.fusion--player .fusion--viewport .fusion--scene.fusion--scene--iframe iframe.fusion--iframe{overflow:hidden;border:none}.fusion--player .fusion--viewport .fusion--scene .fusion--scene--content{position:absolute;top:0;right:0;bottom:0;left:0;transform-origin:top left;overflow:hidden}.fusion--player .fusion--viewport .fusion--scene .fusion--scene--content>*{position:absolute;width:100%;height:100%}.fusion--player .fusion--viewport .fusion--scene .fusion--scene--content>*>*{position:absolute;top:0;left:0}.fusion--player .fusion--viewport .fusion--scene--debugger--guidesWrapper{position:absolute;top:0;right:0;bottom:0;left:0;z-index:9999999;pointer-events:none}.fusion--player .fusion--viewport .fusion--scene--debugger--guidesWrapper .guide-horizontal-center{position:absolute;top:0;bottom:0;left:50%;width:1px;z-index:99999;border-left:1px dashed rgba(0,0,0,0.8)}.fusion--player .fusion--viewport .fusion--scene--debugger--guidesWrapper .guide-sceneBounds{position:absolute;top:0;right:0;bottom:0;left:0;transform-origin:top left;background-color:rgba(108,159,255,0.3)}\n",""])},function(e,t,n){"use strict";e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n=function(e,t){var n=e[1]||"",o=e[3];if(!o)return n;if(t&&"function"==typeof btoa){var i=(a=o,s=btoa(unescape(encodeURIComponent(JSON.stringify(a)))),c="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(s),"/*# ".concat(c," */")),r=o.sources.map((function(e){return"/*# sourceURL=".concat(o.sourceRoot).concat(e," */")}));return[n].concat(r).concat([i]).join("\n")}var a,s,c;return[n].join("\n")}(t,e);return t[2]?"@media ".concat(t[2],"{").concat(n,"}"):n})).join("")},t.i=function(e,n){"string"==typeof e&&(e=[[null,e,""]]);for(var o={},i=0;i<this.length;i++){var r=this[i][0];null!=r&&(o[r]=!0)}for(var a=0;a<e.length;a++){var s=e[a];null!=s[0]&&o[s[0]]||(n&&!s[2]?s[2]=n:n&&(s[2]="(".concat(s[2],") and (").concat(n,")")),t.push(s))}},t}},function(e,t,n){"use strict";var o,i={},r=function(){return void 0===o&&(o=Boolean(window&&document&&document.all&&!window.atob)),o},a=function(){var e={};return function(t){if(void 0===e[t]){var n=document.querySelector(t);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}e[t]=n}return e[t]}}();function s(e,t){for(var n=[],o={},i=0;i<e.length;i++){var r=e[i],a=t.base?r[0]+t.base:r[0],s={css:r[1],media:r[2],sourceMap:r[3]};o[a]?o[a].parts.push(s):n.push(o[a]={id:a,parts:[s]})}return n}function c(e,t){for(var n=0;n<e.length;n++){var o=e[n],r=i[o.id],a=0;if(r){for(r.refs++;a<r.parts.length;a++)r.parts[a](o.parts[a]);for(;a<o.parts.length;a++)r.parts.push(b(o.parts[a],t))}else{for(var s=[];a<o.parts.length;a++)s.push(b(o.parts[a],t));i[o.id]={id:o.id,refs:1,parts:s}}}}function u(e){var t=document.createElement("style");if(void 0===e.attributes.nonce){var o=n.nc;o&&(e.attributes.nonce=o)}if(Object.keys(e.attributes).forEach((function(n){t.setAttribute(n,e.attributes[n])})),"function"==typeof e.insert)e.insert(t);else{var i=a(e.insert||"head");if(!i)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");i.appendChild(t)}return t}var l,f=(l=[],function(e,t){return l[e]=t,l.filter(Boolean).join("\n")});function p(e,t,n,o){var i=n?"":o.css;if(e.styleSheet)e.styleSheet.cssText=f(t,i);else{var r=document.createTextNode(i),a=e.childNodes;a[t]&&e.removeChild(a[t]),a.length?e.insertBefore(r,a[t]):e.appendChild(r)}}function h(e,t,n){var o=n.css,i=n.media,r=n.sourceMap;if(i&&e.setAttribute("media",i),r&&btoa&&(o+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(r))))," */")),e.styleSheet)e.styleSheet.cssText=o;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(o))}}var d=null,y=0;function b(e,t){var n,o,i;if(t.singleton){var r=y++;n=d||(d=u(t)),o=p.bind(null,n,r,!1),i=p.bind(null,n,r,!0)}else n=u(t),o=h.bind(null,n,t),i=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(n)};return o(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;o(e=t)}else i()}}e.exports=function(e,t){(t=t||{}).attributes="object"==typeof t.attributes?t.attributes:{},t.singleton||"boolean"==typeof t.singleton||(t.singleton=r());var n=s(e,t);return c(n,t),function(e){for(var o=[],r=0;r<n.length;r++){var a=n[r],u=i[a.id];u&&(u.refs--,o.push(u))}e&&c(s(e,t),t);for(var l=0;l<o.length;l++){var f=o[l];if(0===f.refs){for(var p=0;p<f.parts.length;p++)f.parts[p]();delete i[f.id]}}}}},function(e){e.exports=JSON.parse('{"name":"hero","version":"0.9.0","description":"","private":true,"scripts":{"build":"npx webpack --mode production","serve":"http-server -g -c-1"},"author":"Simon Widjaja","devDependencies":{"@babel/cli":"^7.7.0","@babel/core":"^7.7.2","@babel/node":"^7.7.0","@babel/plugin-proposal-class-properties":"^7.7.0","@babel/preset-env":"^7.7.1","@babel/register":"^7.7.0","babel-register":"^6.26.0","webpack":"^4.41.2","webpack-cli":"^3.3.11","webpack-dev-server":"^3.9.0"},"dependencies":{"@babel/plugin-transform-async-to-generator":"^7.7.0","babel-loader":"^8.0.6","core-js":"^3.4.0","css-loader":"^3.2.0","fs-extra":"^9.0.1","lodash.debounce":"^4.0.8","lodash.throttle":"^4.1.1","node-sass":"^4.13.1","regenerator-runtime":"^0.13.3","sass-loader":"^8.0.0","style-loader":"^1.0.0"}}')},,,,,,function(e,t,n){"use strict";function o(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}n.r(t);var i=function(){function e(){var t,n,o;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),o={},(n="sceneDefinitions")in(t=this)?Object.defineProperty(t,n,{value:o,enumerable:!0,configurable:!0,writable:!0}):t[n]=o}var t,n,i;return t=e,(n=[{key:"defineScene",value:function(e,t){console.log("[ Fusion ]","defineScene()",e),this.sceneDefinitions[e]=t}}])&&o(t.prototype,n),i&&o(t,i),e}();function r(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}var a=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}var t,n,o;return t=e,o=[{key:"appendHtml",value:function(e,t){return e.insertAdjacentHTML("beforeend",t),e.lastChild}},{key:"debounce",value:function(e,t,n){var o=e,i=null,r=t;return function(){var t=n||e,a=arguments;function s(){o.apply(t,a),i=null}i&&clearTimeout(i),i=setTimeout(s,r)}}},{key:"throttle",value:function(e,t,n){var o,i,r=e,a=null,s=t;return function(){var c=n||e,u=arguments,l=Date.now();!a||l-a>=s?(a=l,r.apply(c,u),u[0]instanceof Event&&(i=u[0].currentTarget)):(o&&(clearTimeout(o),o=void 0),u[0]instanceof Event&&(u[0].currentTarget_=i),o=setTimeout((function(){r.apply(c,u)}),t))}}
/*!
     * Check if an element is inside the viewport
     * #TODO Consider:
     *   + caching
     *   + partially in viewport
     *   + not relative to window but to parent container
     * #PERFORMANCE getBoundingClientRect() might become a performance bottleneck
     *              see https://gist.github.com/paulirish/5d52fb081b3570c81e3a
     *              and https://github.com/pelotoncycle/resize-observer/issues/5
     * @param  {Node} el The element
     * @return {Boolean} Returns true if element is in the viewport
     */},{key:"isInViewport",value:function(e){var t=e.getBoundingClientRect();return t.top>=0&&t.left>=0&&t.bottom<=(window.innerHeight||document.documentElement.clientHeight)&&t.right<=(window.innerWidth||document.documentElement.clientWidth)}}],(n=null)&&r(t.prototype,n),o&&r(t,o),e}(),s=n(1);function c(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}var u="[ SceneDebugger ]",l=function(){function e(t){var n=this;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.scene=t,console.log(u,"constructor()",t),t.on(s.a.SCENE_PRE_READY,(function(){n.guidesWrapper=a.appendHtml(t.element.parentNode,'<div class="fusion--scene--debugger--guidesWrapper"></div>'),n.guideHorizontalCenter=a.appendHtml(n.guidesWrapper,'<div class="guide-horizontal-center"></div>'),n.guideSceneBounds=a.appendHtml(n.guidesWrapper,'<div class="guide-sceneBounds"></div>')})),t.on(s.a.SCENE_READY,(function(){setTimeout((function(){n.size(),0==t.center||t.fit||(window.addEventListener("resize",a.debounce(n.center.bind(n),50)),n.center()),0!=t.fit&&(window.addEventListener("resize",a.debounce(n.fit.bind(n),50)),n.fit())}),200)}))}var t,n,o;return t=e,(n=[{key:"size",value:function(){this.guideSceneBounds.style.width="string"==typeof this.scene.width?this.scene.width:"".concat(this.scene.width,"px"),this.guideSceneBounds.style.height="string"==typeof this.scene.height?this.scene.height:"".concat(this.scene.height,"px"),this.scene.data.maxWidth&&(this.guideSceneBounds.style.maxWidth="".concat(this.scene.maxWidth,"px")),this.scene.data.maxHeight&&(this.guideSceneBounds.style.maxHeight="".concat(this.scene.maxHeight,"px"))}},{key:"center",value:function(){this.guideSceneBounds.style.left="50%",this.guideSceneBounds.style.top="50%",this.guideSceneBounds.style.marginLeft="-".concat(this.scene.width*this.scene.scale/2,"px"),this.guideSceneBounds.style.marginTop="-".concat(this.scene.height*this.scene.scale/2,"px")}},{key:"fit",value:function(){var e=this.scene.player.viewport.clientWidth,t=this.scene.player.viewport.clientHeight;this.scene.scale=Math.min(e/this.scene.width,t/this.scene.height),this.scene.scale=this.scene.scale>1?1:this.scene.scale,this.guideSceneBounds.style.transform="scale(".concat(this.scene.scale,")"),this.center()}}])&&c(t.prototype,n),o&&c(t,o),e}(),f=n(2);function p(e){return(p="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function h(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function d(e){return(d=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function y(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function b(e,t){return(b=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var v="[ Scene ]",m=!1,g=function(e){function t(e,n){var o,i,r;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),i=this,r=d(t).call(this),(o=!r||"object"!==p(r)&&"function"!=typeof r?y(i):r).player=e,o.element,o.content,o.data=n,o.timeline,o.id=n.id,o.state="init",o.width=n.width,o.height=n.height,o.player.options.debug&&(o.debugger=new l(y(o))),o.initPlugins(),o.emit(s.a.SCENE_PLUGINS_READY),o.on(s.a.SCENE_PRE_READY,(function(){o.size(),0==o.data.center||o.data.fit||(window.addEventListener("resize",a.debounce(o.center.bind(y(o)),50)),o.center()),0!=o.data.fit&&(window.addEventListener("resize",a.debounce(o.fit.bind(y(o)),50)),o.fit()),hero.fx.FxScanner.scan(o.content),setTimeout((function(){o.timeline&&o.timeline.play(0)}),1),m&&console.log(v,o.id,': setting state to "ready"'),o.state="ready",m&&console.log(v,o.id,": propagating SCENE_READY"),o.emit(s.a.SCENE_READY)})),o}var n,o,i;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&b(e,t)}(t,e),n=t,(o=[{key:"size",value:function(){this.content.style.width="string"==typeof this.data.width?this.data.width:"".concat(this.data.width,"px"),this.content.style.height="string"==typeof this.data.height?this.data.height:"".concat(this.data.height,"px"),this.data.maxWidth&&(this.content.style.maxWidth="".concat(this.data.maxWidth,"px")),this.data.maxHeight&&(this.content.style.maxHeight="".concat(this.data.maxHeight,"px"))}},{key:"center",value:function(){this.content.style.left="50%",this.content.style.top="50%",this.content.style.marginLeft="-".concat(this.data.width*this.scale/2,"px"),this.content.style.marginTop="-".concat(this.data.height*this.scale/2,"px")}},{key:"fit",value:function(){var e=this.player.viewport.clientWidth,t=this.player.viewport.clientHeight;this.scale=Math.min(e/this.data.width,t/this.data.height),this.scale=this.scale>1?1:this.scale,this.content.style.transform="scale(".concat(this.scale,")"),this.center()}},{key:"initPlugins",value:function(){var e=this;this.data.plugins&&this.data.plugins.forEach((function(t){for(var n in hero.plugins)t.id==hero.plugins[n].manifest().id&&new hero.plugins[n](e,t.options)}))}},{key:"get",value:function(e){return this.element.querySelector("#".concat(e))}},{key:"query",value:function(e){return this.element.querySelectorAll("".concat(e))}}])&&h(n.prototype,o),i&&h(n,i),t}(f.a);function w(e){return(w="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function S(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function E(e,t){return!t||"object"!==w(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function j(e){return(j=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function O(e,t){return(O=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var _=function(e){function t(e,n){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),E(this,j(t).call(this,e,n))}var n,o,i;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&O(e,t)}(t,e),n=t,(o=[{key:"render",value:function(){this.element=a.appendHtml(this.player.viewport,'<div class="fusion--scene fusion--scene--default scene-'.concat(this.id,'"></div>')),this.content=a.appendHtml(this.element,'<div class="fusion--scene--content"></div>'),a.appendHtml(this.content,this.data.html);var e=document.createElement("script"),t="\n      (function(scene) {\n        var playerId = '".concat(this.player.id,"';\n        var sceneId = '").concat(this.id,"';\n        var player = window.fusionPlayer[playerId];\n        var scene = player.getScene(sceneId);\n\n        ").concat(this.data.script,"\n      })();\n    ");e.innerHTML=t,this.element.appendChild(e),this.emit(s.a.SCENE_PRE_READY)}}])&&S(n.prototype,o),i&&S(n,i),t}(g);function P(e){return(P="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function k(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function x(e,t){return!t||"object"!==P(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function C(e){return(C=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function T(e,t){return(T=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var R=function(e){function t(e,n){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),x(this,C(t).call(this,e,n))}var n,o,i;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&T(e,t)}(t,e),n=t,(o=[{key:"load",value:function(){this.loadManifest(this.render.bind(this))}},{key:"loadManifest",value:function(e){var t=this,n=new createjs.LoadQueue(!1);n.loadManifest(this.data.path+"/manifest.json",!0,""),n.on("fileload",(function(e){t.data[e.item.id]=e.result})),n.on("complete",(function(t){e()})),n.on("error",(function(e){console.warn("Error in loadManifest() during preloading. "+e.message)}))}}])&&k(n.prototype,o),i&&k(n,i),t}(_);function N(e){return(N="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function D(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function H(e,t){return!t||"object"!==N(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function M(e){return(M=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function A(e,t){return(A=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var L=function(e){function t(e,n){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),H(this,M(t).call(this,e,n))}var n,o,i;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&A(e,t)}(t,e),n=t,(o=[{key:"load",value:function(){console.log("[ SceneFlat ]","load()"),this.wire(),this.render()}},{key:"wire",value:function(){var e=this.player.wrapper.querySelector(".fusion--scene.scene-".concat(this.id));this.element=e,this.content=e.querySelector(".fusion--scene--content")}},{key:"render",value:function(){console.log("[ SceneFlat ]",this.id," : render()");var e=fusion.sceneDefinitions[this.id];e&&e.preReady&&e.preReady.call(this,this,this.player),e&&e.ready&&this.on(s.a.SCENE_READY,e.ready.bind(this,this,this.player)),this.emit(s.a.SCENE_PRE_READY)}}])&&D(n.prototype,o),i&&D(n,i),t}(g);function W(e){return(W="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function Y(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function B(e,t){return!t||"object"!==W(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function I(e){return(I=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function z(e,t){return(z=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var F=function(e){function t(e,n){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),B(this,I(t).call(this,e,n))}var n,o,i;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&z(e,t)}(t,e),n=t,(o=[{key:"load",value:function(){this.gatherData(this.render.bind(this))}},{key:"gatherData",value:function(e){this.data.html=this.getHeroFragment("hero--markup--".concat(this.id),"text/hero-markup"),this.data.script=this.getHeroFragment("hero--script--".concat(this.id),"text/hero-script"),e()}},{key:"getHeroFragment",value:function(e,t){var n=document.querySelector("#".concat(e,'[type="').concat(t,'"]'));return n?n.innerHTML:void 0}}])&&Y(n.prototype,o),i&&Y(n,i),t}(_);function q(e){return(q="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function U(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function G(e){return(G=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function J(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function V(e,t){return(V=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var Q=function(e){function t(e,n){var o,i,r,a,s,c;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),i=this,o=!(r=G(t).call(this,e,n))||"object"!==q(r)&&"function"!=typeof r?J(i):r,a=J(o),c=void 0,(s="iframe")in a?Object.defineProperty(a,s,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[s]=c,o}var n,o,i;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&V(e,t)}(t,e),n=t,(o=[{key:"load",value:function(){console.log("[ SceneIframe ]","load()"),this.render()}},{key:"render",value:function(){this.element=a.appendHtml(this.viewport,'<div class="fusion--scene fusion--scene--iframe scene-'.concat(this.id,'"></div>')),this.iframe=a.appendHtml(this.element,'<iframe class="fusion--iframe" src="'.concat(this.data.path,'" frameborder="0" allowTransparency="true"></iframe>')),a.appendHtml(this.element,this.data.html),this.iframe.style.width="100%",this.iframe.style.height="100%",this.emit(s.a.SCENE_PRE_READY)}}])&&U(n.prototype,o),i&&U(n,i),t}(g);function X(e){return(X="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function K(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function Z(e){return(Z=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function $(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function ee(e,t){return(ee=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var te=!0,ne="[ DataStore ]",oe=function(e){function t(){var e,n,o,i,r,a;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),n=this,e=!(o=Z(t).call(this))||"object"!==X(o)&&"function"!=typeof o?$(n):o,i=$(e),a={},(r="data")in i?Object.defineProperty(i,r,{value:a,enumerable:!0,configurable:!0,writable:!0}):i[r]=a,te&&console.log(ne,"constructor()"),e}var n,o,i;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&ee(e,t)}(t,e),n=t,(o=[{key:"set",value:function(e,t){this.data[e]=t,this.emit("change",e,t)}},{key:"get",value:function(e){return this.data[e]}}])&&K(n.prototype,o),i&&K(n,i),t}(f.a);function ie(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function re(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var ae=function(){function e(t){var n=this;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),re(this,"defaults",{overflowX:"hidden",overflowY:"hidden"}),re(this,"options",void 0),re(this,"wrapper",void 0),re(this,"viewport",void 0),re(this,"scenes",[]),re(this,"currentScene",void 0),re(this,"lastScene",void 0),re(this,"data",void 0),window.fusionPlayer=window.fusionPlayer?window.fusionPlayer:{},window.fusionPlayer[t.id]=this,this.options=Object.assign(this.defaults,t),this.id=t.id,this.data=new oe,this.wrapper=document.getElementById(t.id),this.wrapper.classList.add("fusion--player"),this.createMarkup(),this.viewport=this.wrapper.querySelector(".fusion--viewport"),this.viewport.style.overflow="auto",this.options.scenes.forEach((function(e){switch(e.width=e.width||n.options.width,e.height=e.height||n.options.height,e.type){case"flat":n.scenes.push(new L(n,e));break;case"embedded":n.scenes.push(new F(n,e));break;case"iframe":n.scenes.push(new Q(n,e));break;default:n.scenes.push(new R(n,e))}}))}var t,n,o;return t=e,(n=[{key:"createMarkup",value:function(){this.wrapper.querySelector(".fusion--viewport")||a.appendHtml(this.wrapper,'<div class="fusion--viewport"></div>')}},{key:"getScene",value:function(e){return this.scenes.find((function(t){return t.id===e}))}},{key:"loadScene",value:function(e){var t=this;console.log("[ FusionPlayer ]","openScene()","{".concat(e,"}"));var n=this.getScene(e);console.log("[ FusionPlayer ]","openScene()","{".concat(e,"}"),"state: ".concat(n.state)),n!==this.currentScene&&(n&&"ready"===n.state?(this.lastScene=this.currentScene,this.currentScene=n,this.lastScene&&setTimeout((function(){t.lastScene.element.classList.remove("visible")}),100),n.element.parentNode.appendChild(n.element),setTimeout((function(){t.currentScene.element.classList.add("visible")}),1)):n?(n.on(s.a.SCENE_READY,this.loadScene.bind(this,e)),n.load()):console.error("[ FusionPlayer ]","Scene not found:",e))}}])&&ie(t.prototype,n),o&&ie(t,o),e}(),se=(n(3),n(7).version);console.log("[ Fusion ]","VERSION",se),window.fusion=new i,Object.assign(window.fusion,{const:s.a,Player:ae})}]);