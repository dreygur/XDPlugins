module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/ui/main.jsx");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../lib/dart_style":
/*!***********************************!*\
  !*** external "./lib/dart_style" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("./lib/dart_style");

/***/ }),

/***/ "../lib/js-yaml":
/*!********************************!*\
  !*** external "./lib/js-yaml" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("./lib/js-yaml");

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/stylus-loader/index.js!./src/ui/styles.styl":
/*!***********************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/stylus-loader!./src/ui/styles.styl ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
var ___CSS_LOADER_GET_URL_IMPORT___ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
var ___CSS_LOADER_URL_IMPORT_0___ = __webpack_require__(/*! ./assets/icon@1x.png */ "./src/ui/assets/icon@1x.png");
var ___CSS_LOADER_URL_IMPORT_1___ = __webpack_require__(/*! ./assets/icon@2x.png */ "./src/ui/assets/icon@2x.png");
var ___CSS_LOADER_URL_IMPORT_2___ = __webpack_require__(/*! ./assets/bg-transparent.png */ "./src/ui/assets/bg-transparent.png");
exports = ___CSS_LOADER_API_IMPORT___(false);
var ___CSS_LOADER_URL_REPLACEMENT_0___ = ___CSS_LOADER_GET_URL_IMPORT___(___CSS_LOADER_URL_IMPORT_0___);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = ___CSS_LOADER_GET_URL_IMPORT___(___CSS_LOADER_URL_IMPORT_1___);
var ___CSS_LOADER_URL_REPLACEMENT_2___ = ___CSS_LOADER_GET_URL_IMPORT___(___CSS_LOADER_URL_IMPORT_2___);
// Module
exports.push([module.i, "ignore.ignore {\n  background: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ");\n  background: url(" + ___CSS_LOADER_URL_REPLACEMENT_1___ + ");\n}\na {\n  color: #0d66d0;\n}\na:hover {\n  text-decoration: underline;\n}\n.separator {\n  width: 100%;\n  height: 2px;\n  background-color: #eaeaea;\n  margin: 16px 0;\n}\n.label {\n  color: #8e8e8e;\n  text-transform: uppercase;\n  font-size: 9px;\n  letter-spacing: 0.18em;\n  margin: 8px 0;\n}\n#panel-container {\n  height: calc(100vh - 110px);\n  max-width: 400px;\n  width: 100%;\n  margin: 0 auto;\n  font-size: 10px;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n}\n#panel-container .actions-container {\n  flex: 0 1 auto;\n  display: flex;\n  flex-direction: column;\n  margin: 0;\n}\n#panel-container .actions-container .separator {\n  margin: 8px 0;\n}\n#panel-container .actions-container button {\n  display: block;\n  width: 100%;\n  margin: 4px 0;\n}\n#panel-container .options-container {\n  overflow: auto;\n  margin-bottom: 0.5rem;\n  margin-right: -12px;\n  padding-right: 12px;\n}\n#panel-container[data-platform*='win32'] {\n  font-family: 'Segoe UI', sans-serif;\n}\n#panel-container[data-platform*='darwin'] {\n  font-family: -apple-system, 'Helvetica Neue', sans-serif;\n}\n.preview-container {\n  display: flex;\n  flex-direction: column;\n}\n.preview-container .preview-canvas {\n  background: #fff;\n  background: url(" + ___CSS_LOADER_URL_REPLACEMENT_2___ + ");\n  width: 100%;\n  height: 160px;\n  padding: 4px;\n  margin: 0 auto 4px auto;\n  border: solid 1px #eaeaea;\n}\n.preview-container .preview-canvas .preview-img {\n  width: 100%;\n  height: 100%;\n  object-fit: contain;\n  overflow: hidden;\n}\n.preview-container .preview-canvas .preview-no {\n  display: none;\n  line-height: 144px;\n  text-align: center;\n  letter-spacing: 0.05em;\n  font-weight: 600;\n}\n.preview-container .preview-canvas.multi {\n  background: #e1e1e1;\n}\n.preview-container .preview-canvas.multi .preview-no {\n  display: block;\n}\n.preview-container .preview-canvas.multi .preview-img {\n  display: none;\n}\n.preview-container .separator {\n  margin: 4px 0 12px 0;\n}\n.settings-container {\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: start;\n  overflow-x: hidden;\n}\n.settings-container .project-row,\n.settings-container .customcode-row {\n  display: flex;\n  flex-direction: row;\n  width: 100%;\n}\n.settings-container .project-row button,\n.settings-container .customcode-row button {\n  margin: 0;\n  margin-left: 2px;\n}\n.settings-container .customcode-row textarea {\n  height: 64px;\n  background: #f3f3f3;\n  font-family: Courier !important;\n}\n.settings-container .customcode-row button {\n  margin-left: -36px;\n  margin-top: 32px;\n}\n.settings-container .label {\n  margin-top: 16px;\n}\n.settings-container .separator + .label,\n.settings-container *:first-child {\n  margin-top: 0px;\n}\n.settings-container .wrapping-row {\n  display: flex;\n  flex-wrap: wrap;\n  width: 100%;\n}\n.settings-container .warning-row {\n  display: flex;\n  font-weight: bold;\n  letter-spacing: 0.05em;\n  color: #f1aa25;\n}\n.settings-container .warning-row .icon {\n  height: 12px;\n  width: 12px;\n  margin-right: 8px;\n}\n.settings-container .warning-text p {\n  color: #3f3f3f;\n  margin: 12px 0;\n}\n.settings-container * + .warning {\n  margin-top: 8px;\n}\n.settings-container * + .warning .warning-row {\n  margin-top: 12px;\n}\n.settings-container .settings__text-input,\n.settings-container .settings__textarea {\n  width: 100%;\n  margin: 0;\n}\n.settings-container .settings__text-input + .settings__checkbox-label,\n.settings-container .settings__textarea + .settings__checkbox-label {\n  margin-top: 12px;\n}\n.settings-container select {\n  margin: 12px 0 4px 0;\n  width: 100%;\n}\n.settings-container .settings__checkbox-label {\n  display: flex;\n  flex-wrap: nowrap;\n  color: #3f3f3f;\n  max-width: 195px;\n  width: 100%;\n  justify-content: start;\n  align-content: center;\n  align-items: center;\n  margin: 0;\n  padding: 2px 0;\n}\n.settings-container .settings__checkbox-label input[type=checkbox] {\n  margin-left: 0;\n  margin-right: 0;\n}\n.settings-container .settings__checkbox-label span {\n  margin-top: -3px;\n}\n.settings-container p.note {\n  background: #eaeaea;\n  padding: 4px;\n  font-size: 10px;\n  margin: 4px 0;\n  width: 100%;\n  letter-spacing: 0.05em;\n}\n.settings-container p.note img {\n  height: 1em;\n  margin-bottom: -0.2em;\n  margin-top: -0.2em;\n  opacity: 0.5;\n}\n.results-container {\n  letter-spacing: 0.05em;\n  font-weight: bold;\n  color: #8e8e8e;\n}\n.results-container a {\n  display: inline-block;\n  margin-bottom: -2px;\n  font-weight: normal;\n}\n.results-container a.help {\n  font-weight: bold;\n}\n.results-container a img {\n  height: 1.1em;\n  margin-bottom: -0.25em;\n  margin-top: -0.25em;\n  margin-right: 2px;\n}\n.results-container .version,\n.results-container .alert {\n  color: #3f3f3f;\n  background: #eaeaea;\n  padding: 0.25em 0.5em;\n  margin-right: 0.5em;\n}\n.results-container .alert {\n  background: #b20;\n  color: #fff;\n}\n.results-container .vdiv {\n  padding: 0 6px;\n}\ndialog {\n  max-width: 600px;\n  padding: 16px;\n  padding-bottom: 8px;\n}\ndialog .text-information {\n  color: #8e8e8e;\n}\ndialog .icon {\n  height: 1.4em;\n  margin: -0.2em 0.2em 0 -0.2em;\n  vertical-align: middle;\n}\ndialog hr {\n  margin: 12px 0 12px 0;\n}\ndialog .result-icon {\n  height: 16px;\n  width: 16px;\n  margin-right: 8px;\n  margin-bottom: -3px;\n}\ndialog .list {\n  max-height: 200px;\n  min-height: 24px;\n  width: 500px;\n  border-top: 2px solid #e1e1e1;\n  background: #fff;\n  overflow-y: auto;\n  margin-top: 16px;\n  margin-bottom: 32px;\n}\ndialog .list > div {\n  padding: 8px 16px;\n}\ndialog .list > div:nth-child(even) {\n  background: #fafafa;\n}\ndialog footer {\n  margin: 0;\n  padding: 0;\n}\ndialog .code-editor {\n  width: 100%;\n  min-width: 480px;\n  height: 200px;\n  font-family: monospace !important;\n  white-space: pre;\n}\n", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (useSourceMap) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item, useSourceMap);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join('');
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === 'string') {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, '']];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

function cssWithMappingToString(item, useSourceMap) {
  var content = item[1] || ''; // eslint-disable-next-line prefer-destructuring

  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (useSourceMap && typeof btoa === 'function') {
    var sourceMapping = toComment(cssMapping);
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || '').concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
} // Adapted from convert-source-map (MIT)


function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
  return "/*# ".concat(data, " */");
}

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/getUrl.js":
/*!********************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/getUrl.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (url, options) {
  if (!options) {
    // eslint-disable-next-line no-param-reassign
    options = {};
  } // eslint-disable-next-line no-underscore-dangle, no-param-reassign


  url = url && url.__esModule ? url.default : url;

  if (typeof url !== 'string') {
    return url;
  } // If url is already wrapped in quotes, remove them


  if (/^['"].*['"]$/.test(url)) {
    // eslint-disable-next-line no-param-reassign
    url = url.slice(1, -1);
  }

  if (options.hash) {
    // eslint-disable-next-line no-param-reassign
    url += options.hash;
  } // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls


  if (/["'() \t\n]/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, '\\n'), "\"");
  }

  return url;
};

/***/ }),

/***/ "./node_modules/preact/dist/preact.module.js":
/*!***************************************************!*\
  !*** ./node_modules/preact/dist/preact.module.js ***!
  \***************************************************/
/*! exports provided: render, hydrate, createElement, h, Fragment, createRef, isValidElement, Component, cloneElement, createContext, toChildArray, _unmount, options */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return E; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hydrate", function() { return H; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createElement", function() { return h; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return h; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Fragment", function() { return y; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createRef", function() { return p; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isValidElement", function() { return l; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Component", function() { return d; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cloneElement", function() { return I; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createContext", function() { return L; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toChildArray", function() { return b; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_unmount", function() { return A; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "options", function() { return n; });
var n,l,u,t,i,o,r,f={},e=[],c=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord/i;function s(n,l){for(var u in l)n[u]=l[u];return n}function a(n){var l=n.parentNode;l&&l.removeChild(n)}function h(n,l,u){var t,i=arguments,o={};for(t in l)"key"!==t&&"ref"!==t&&(o[t]=l[t]);if(arguments.length>3)for(u=[u],t=3;t<arguments.length;t++)u.push(i[t]);if(null!=u&&(o.children=u),"function"==typeof n&&null!=n.defaultProps)for(t in n.defaultProps)void 0===o[t]&&(o[t]=n.defaultProps[t]);return v(n,o,l&&l.key,l&&l.ref)}function v(l,u,t,i){var o={type:l,props:u,key:t,ref:i,__k:null,__:null,__b:0,__e:null,__d:null,__c:null,constructor:void 0};return n.vnode&&n.vnode(o),o}function p(){return{}}function y(n){return n.children}function d(n,l){this.props=n,this.context=l}function m(n,l){if(null==l)return n.__?m(n.__,n.__.__k.indexOf(n)+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return"function"==typeof n.type?m(n):null}function w(n){var l,u;if(null!=(n=n.__)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return w(n)}}function g(l){(!l.__d&&(l.__d=!0)&&1===u.push(l)||i!==n.debounceRendering)&&((i=n.debounceRendering)||t)(k)}function k(){var n,l,t,i,o,r,f;for(u.sort(function(n,l){return l.__v.__b-n.__v.__b});n=u.pop();)n.__d&&(t=void 0,i=void 0,r=(o=(l=n).__v).__e,(f=l.__P)&&(t=[],i=T(f,o,s({},o),l.__n,void 0!==f.ownerSVGElement,null,t,null==r?m(o):r),$(t,o),i!=r&&w(o)))}function _(n,l,u,t,i,o,r,c,s){var h,v,p,y,d,w,g,k=u&&u.__k||e,_=k.length;if(c==f&&(c=null!=o?o[0]:_?m(u,0):null),h=0,l.__k=b(l.__k,function(u){if(null!=u){if(u.__=l,u.__b=l.__b+1,null===(p=k[h])||p&&u.key==p.key&&u.type===p.type)k[h]=void 0;else for(v=0;v<_;v++){if((p=k[v])&&u.key==p.key&&u.type===p.type){k[v]=void 0;break}p=null}if(y=T(n,u,p=p||f,t,i,o,r,c,s),(v=u.ref)&&p.ref!=v&&(g||(g=[]),p.ref&&g.push(p.ref,null,u),g.push(v,u.__c||y,u)),null!=y){if(null==w&&(w=y),null!=u.__d)y=u.__d,u.__d=null;else if(o==p||y!=c||null==y.parentNode){n:if(null==c||c.parentNode!==n)n.appendChild(y);else{for(d=c,v=0;(d=d.nextSibling)&&v<_;v+=2)if(d==y)break n;n.insertBefore(y,c)}"option"==l.type&&(n.value="")}c=y.nextSibling,"function"==typeof l.type&&(l.__d=y)}}return h++,u}),l.__e=w,null!=o&&"function"!=typeof l.type)for(h=o.length;h--;)null!=o[h]&&a(o[h]);for(h=_;h--;)null!=k[h]&&A(k[h],k[h]);if(g)for(h=0;h<g.length;h++)z(g[h],g[++h],g[++h])}function b(n,l,u){if(null==u&&(u=[]),null==n||"boolean"==typeof n)l&&u.push(l(null));else if(Array.isArray(n))for(var t=0;t<n.length;t++)b(n[t],l,u);else u.push(l?l("string"==typeof n||"number"==typeof n?v(null,n,null,null):null!=n.__e||null!=n.__c?v(n.type,n.props,n.key,null):n):n);return u}function x(n,l,u,t,i){var o;for(o in u)o in l||P(n,o,null,u[o],t);for(o in l)i&&"function"!=typeof l[o]||"value"===o||"checked"===o||u[o]===l[o]||P(n,o,l[o],u[o],t)}function C(n,l,u){"-"===l[0]?n.setProperty(l,u):n[l]="number"==typeof u&&!1===c.test(l)?u+"px":null==u?"":u}function P(n,l,u,t,i){var o,r,f,e,c;if(i?"className"===l&&(l="class"):"class"===l&&(l="className"),"key"===l||"children"===l);else if("style"===l)if(o=n.style,"string"==typeof u)o.cssText=u;else{if("string"==typeof t&&(o.cssText="",t=null),t)for(r in t)u&&r in u||C(o,r,"");if(u)for(f in u)t&&u[f]===t[f]||C(o,f,u[f])}else"o"===l[0]&&"n"===l[1]?(e=l!==(l=l.replace(/Capture$/,"")),c=l.toLowerCase(),l=(c in n?c:l).slice(2),u?(t||n.addEventListener(l,N,e),(n.l||(n.l={}))[l]=u):n.removeEventListener(l,N,e)):"list"!==l&&"tagName"!==l&&"form"!==l&&"type"!==l&&!i&&l in n?n[l]=null==u?"":u:"function"!=typeof u&&"dangerouslySetInnerHTML"!==l&&(l!==(l=l.replace(/^xlink:?/,""))?null==u||!1===u?n.removeAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase()):n.setAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase(),u):null==u||!1===u?n.removeAttribute(l):n.setAttribute(l,u))}function N(l){this.l[l.type](n.event?n.event(l):l)}function T(l,u,t,i,o,r,f,e,c){var a,h,v,p,m,w,g,k,x,C,P=u.type;if(void 0!==u.constructor)return null;(a=n.__b)&&a(u);try{n:if("function"==typeof P){if(k=u.props,x=(a=P.contextType)&&i[a.__c],C=a?x?x.props.value:a.__:i,t.__c?g=(h=u.__c=t.__c).__=h.__E:("prototype"in P&&P.prototype.render?u.__c=h=new P(k,C):(u.__c=h=new d(k,C),h.constructor=P,h.render=D),x&&x.sub(h),h.props=k,h.state||(h.state={}),h.context=C,h.__n=i,v=h.__d=!0,h.__h=[]),null==h.__s&&(h.__s=h.state),null!=P.getDerivedStateFromProps&&(h.__s==h.state&&(h.__s=s({},h.__s)),s(h.__s,P.getDerivedStateFromProps(k,h.__s))),p=h.props,m=h.state,v)null==P.getDerivedStateFromProps&&null!=h.componentWillMount&&h.componentWillMount(),null!=h.componentDidMount&&h.__h.push(h.componentDidMount);else{if(null==P.getDerivedStateFromProps&&k!==p&&null!=h.componentWillReceiveProps&&h.componentWillReceiveProps(k,C),!h.__e&&null!=h.shouldComponentUpdate&&!1===h.shouldComponentUpdate(k,h.__s,C)){for(h.props=k,h.state=h.__s,h.__d=!1,h.__v=u,u.__e=t.__e,u.__k=t.__k,h.__h.length&&f.push(h),a=0;a<u.__k.length;a++)u.__k[a]&&(u.__k[a].__=u);break n}null!=h.componentWillUpdate&&h.componentWillUpdate(k,h.__s,C),null!=h.componentDidUpdate&&h.__h.push(function(){h.componentDidUpdate(p,m,w)})}h.context=C,h.props=k,h.state=h.__s,(a=n.__r)&&a(u),h.__d=!1,h.__v=u,h.__P=l,a=h.render(h.props,h.state,h.context),u.__k=b(null!=a&&a.type==y&&null==a.key?a.props.children:a),null!=h.getChildContext&&(i=s(s({},i),h.getChildContext())),v||null==h.getSnapshotBeforeUpdate||(w=h.getSnapshotBeforeUpdate(p,m)),_(l,u,t,i,o,r,f,e,c),h.base=u.__e,h.__h.length&&f.push(h),g&&(h.__E=h.__=null),h.__e=null}else u.__e=j(t.__e,u,t,i,o,r,f,c);(a=n.diffed)&&a(u)}catch(l){n.__e(l,u,t)}return u.__e}function $(l,u){n.__c&&n.__c(u,l),l.some(function(u){try{l=u.__h,u.__h=[],l.some(function(n){n.call(u)})}catch(l){n.__e(l,u.__v)}})}function j(n,l,u,t,i,o,r,c){var s,a,h,v,p,y=u.props,d=l.props;if(i="svg"===l.type||i,null==n&&null!=o)for(s=0;s<o.length;s++)if(null!=(a=o[s])&&(null===l.type?3===a.nodeType:a.localName===l.type)){n=a,o[s]=null;break}if(null==n){if(null===l.type)return document.createTextNode(d);n=i?document.createElementNS("http://www.w3.org/2000/svg",l.type):document.createElement(l.type),o=null}if(null===l.type)null!=o&&(o[o.indexOf(n)]=null),y!==d&&n.data!=d&&(n.data=d);else if(l!==u){if(null!=o&&(o=e.slice.call(n.childNodes)),h=(y=u.props||f).dangerouslySetInnerHTML,v=d.dangerouslySetInnerHTML,!c){if(y===f)for(y={},p=0;p<n.attributes.length;p++)y[n.attributes[p].name]=n.attributes[p].value;(v||h)&&(v&&h&&v.__html==h.__html||(n.innerHTML=v&&v.__html||""))}x(n,d,y,i,c),l.__k=l.props.children,v||_(n,l,u,t,"foreignObject"!==l.type&&i,o,r,f,c),c||("value"in d&&void 0!==d.value&&d.value!==n.value&&(n.value=null==d.value?"":d.value),"checked"in d&&void 0!==d.checked&&d.checked!==n.checked&&(n.checked=d.checked))}return n}function z(l,u,t){try{"function"==typeof l?l(u):l.current=u}catch(l){n.__e(l,t)}}function A(l,u,t){var i,o,r;if(n.unmount&&n.unmount(l),(i=l.ref)&&(i.current&&i.current!==l.__e||z(i,null,u)),t||"function"==typeof l.type||(t=null!=(o=l.__e)),l.__e=l.__d=null,null!=(i=l.__c)){if(i.componentWillUnmount)try{i.componentWillUnmount()}catch(l){n.__e(l,u)}i.base=i.__P=null}if(i=l.__k)for(r=0;r<i.length;r++)i[r]&&A(i[r],u,t);null!=o&&a(o)}function D(n,l,u){return this.constructor(n,u)}function E(l,u,t){var i,r,c;n.__&&n.__(l,u),r=(i=t===o)?null:t&&t.__k||u.__k,l=h(y,null,[l]),c=[],T(u,(i?u:t||u).__k=l,r||f,f,void 0!==u.ownerSVGElement,t&&!i?[t]:r?null:e.slice.call(u.childNodes),c,t||f,i),$(c,l)}function H(n,l){E(n,l,o)}function I(n,l){return l=s(s({},n.props),l),arguments.length>2&&(l.children=e.slice.call(arguments,2)),v(n.type,l,l.key||n.key,l.ref||n.ref)}function L(n){var l={},u={__c:"__cC"+r++,__:n,Consumer:function(n,l){return n.children(l)},Provider:function(n){var t,i=this;return this.getChildContext||(t=[],this.getChildContext=function(){return l[u.__c]=i,l},this.shouldComponentUpdate=function(l){n.value!==l.value&&t.some(function(n){n.context=l.value,g(n)})},this.sub=function(n){t.push(n);var l=n.componentWillUnmount;n.componentWillUnmount=function(){t.splice(t.indexOf(n),1),l&&l.call(n)}}),n.children}};return u.Consumer.contextType=u,u}n={__e:function(n,l){for(var u,t;l=l.__;)if((u=l.__c)&&!u.__)try{if(u.constructor&&null!=u.constructor.getDerivedStateFromError&&(t=!0,u.setState(u.constructor.getDerivedStateFromError(n))),null!=u.componentDidCatch&&(t=!0,u.componentDidCatch(n)),t)return g(u.__E=u)}catch(l){n=l}throw n}},l=function(n){return null!=n&&void 0===n.constructor},d.prototype.setState=function(n,l){var u;u=this.__s!==this.state?this.__s:this.__s=s({},this.state),"function"==typeof n&&(n=n(u,this.props)),n&&s(u,n),null!=n&&this.__v&&(this.__e=!1,l&&this.__h.push(l),g(this))},d.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),g(this))},d.prototype.render=y,u=[],t="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,o=f,r=0;
//# sourceMappingURL=preact.module.js.map


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = {};

function modulesToDom(moduleId, list, options) {
  for (var i = 0; i < list.length; i++) {
    var part = {
      css: list[i][1],
      media: list[i][2],
      sourceMap: list[i][3]
    };

    if (stylesInDom[moduleId][i]) {
      stylesInDom[moduleId][i](part);
    } else {
      stylesInDom[moduleId].push(addStyle(part, options));
    }
  }
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : undefined;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && btoa) {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (moduleId, list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  moduleId = options.base ? moduleId + options.base : moduleId;
  list = list || [];

  if (!stylesInDom[moduleId]) {
    stylesInDom[moduleId] = [];
  }

  modulesToDom(moduleId, list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    if (!stylesInDom[moduleId]) {
      stylesInDom[moduleId] = [];
    }

    modulesToDom(moduleId, newList, options);

    for (var j = newList.length; j < stylesInDom[moduleId].length; j++) {
      stylesInDom[moduleId][j]();
    }

    stylesInDom[moduleId].length = newList.length;

    if (stylesInDom[moduleId].length === 0) {
      delete stylesInDom[moduleId];
    }
  };
};

/***/ }),

/***/ "./src/core/constants.js":
/*!*******************************!*\
  !*** ./src/core/constants.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

const PropType = __webpack_require__(/*! ../core/proptype */ "./src/core/proptype.js");

// a collection of miscellaneous constants that don't warrant their own files.
let ExportMode = Object.freeze({
	INLINE: "inline",
	METHOD: "method",
	BUILDER: "builder",
	CUSTOM: "custom"
});
exports.ExportMode = ExportMode;

exports.ExportModeOptions = [{ id: ExportMode.INLINE, label: "Export as inline code (default)" }, { id: ExportMode.METHOD, label: "Export as build method" }, { id: ExportMode.BUILDER, label: "Replace with builder param" }, { id: ExportMode.CUSTOM, label: "Replace with custom code" }];

exports.DEFAULT_CUSTOM_CODE = "Text('Hello World')";
exports.DEFAULT_CLASS_PREFIX = "XD";
exports.DEFAULT_COLORS_CLASS_NAME = "XDColors";
exports.DEFAULT_CHAR_STYLES_CLASS_NAME = "XDTextStyles";
exports.HELP_URL = "https://github.com/AdobeXD/xd-to-flutter-plugin/blob/master/README.md";
exports.REQUIRED_PARAM = { _: "required param" };

exports.DEFAULT_PLUGIN_DATA = {
	[PropType.WIDGET_PREFIX]: exports.DEFAULT_CLASS_PREFIX,
	[PropType.ENABLE_PROTOTYPE]: true,
	[PropType.NORMALIZE_NAME_CASE]: true,
	[PropType.INCLUDE_NAME_COMMENTS]: true
};

/***/ }),

/***/ "./src/core/context.js":
/*!*****************************!*\
  !*** ./src/core/context.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

const { Log } = __webpack_require__(/*! ./log */ "./src/core/log.js");
const { trace } = __webpack_require__(/*! ../utils/debug */ "./src/utils/debug.js");

const ContextTarget = {
	FILES: 1,
	CLIPBOARD: 2
};
exports.ContextTarget = ContextTarget;

class Context {

	constructor(target) {
		this._debugLog = new Log();
		this._userLog = new Log();
		this.log = this._userLog;
		this.widgetNameSet = {};
		this.artboards = {};
		this.masterComponents = {};
		this.componentInstances = {};
		this.target = target;
		this.widgets = {};
		this.widgetStack = [];
		this.resultMessage = null;
		this._gridDepth = 0;
		this._fonts = {};
	}

	get fonts() {
		return Object.keys(this._fonts);
	}

	get _currentWidget() {
		let stack = this.widgetStack,
		    l = stack.length;
		return l > 0 ? stack[l - 1] : null;
	}

	useDebugLog() {
		this.log = this._debugLog;
	}

	useUserLog() {
		this.log = this._userLog;
	}

	pushGrid() {
		this._gridDepth++;
	}
	popGrid() {
		this._gridDepth--;
	}

	get inGrid() {
		return this._gridDepth > 0;
	}

	pushWidget(node) {
		this.widgets[node.widgetName] = node;
		this.widgetStack.push(node);
	}

	popWidget() {
		this.widgetStack.pop();
	}

	addArtboard(node) {
		if (!this._checkWidgetName(node)) {
			return;
		}
		this.artboards[node.symbolId] = node;
		this.widgetNameSet[node.widgetName] = true;
	}

	addFont(font, xdNode) {
		// currently not using xdNode, but it's passed in so we can report it if needed.
		this._fonts[font] = true;
	}

	addComponentInstance(node) {
		let instances = this.componentInstances[node.symbolId];
		if (!instances) {
			instances = this.componentInstances[node.symbolId] = [];
		}
		if (node.isMaster && !this._checkWidgetName(node)) {
			return;
		}
		// Check if it's already in the instance list:
		for (let i = 0; i < instances.length; ++i) {
			if (instances[i].xdNode === node.xdNode) {
				return;
			}
		}
		instances.push(node);
		if (node.isMaster) {
			this.masterComponents[node.symbolId] = node;
			this.widgetNameSet[node.widgetName] = true;
		}
	}

	getComponentFromXdNode(xdNode) {
		let instances = this.componentInstances[xdNode.symbolId];
		for (let i = 0; instances && i < instances.length; ++i) {
			let instance = instances[i];
			// Comparing using equality to test if these xdNodes are the same reference
			if (instance.xdNode === xdNode) {
				return instance;
			}
		}
		return null;
	}

	getArtboardFromXdNode(xdNode) {
		return this.artboards[xdNode.guid];
	}

	addImport(name, isWidget, scope) {
		let widget = this._currentWidget;
		if (widget) {
			widget.addImport(name, isWidget, scope);
		}
	}

	usesPinned() {
		this.addImport("package:adobe_xd/pinned.dart");
	}

	addBuildMethod(name, str) {
		if (!this._currentWidget) {
			return;
		}
		this._currentWidget.addBuildMethod(name, str, this);
	}

	addShapeData(node) {
		let widget = this._currentWidget;
		if (widget) {
			widget.addShapeData(node);
			this.addImport("package:flutter_svg/flutter_svg.dart");
		}
	}

	removeShapeData(node) {
		let widget = this._currentWidget;
		if (widget) {
			widget.removeShapeData(node);
		}
	}

	addParam(param) {
		let widget = this._currentWidget;
		if (!this.inGrid && widget) {
			widget.addChildParam(param, this);
		}
	}

	// Post process data gathered during the parse stage and seal the object
	finish() {
		Object.freeze(this);
	}

	_checkWidgetName(node) {
		let name = node.widgetName;
		if (!name) {
			this.log.error(`Empty widget name.`, node.xdNode);
			return false;
		}
		if (this.widgetNameSet[name]) {
			this.log.error(`Duplicate widget name: ${name}.`, node.xdNode);
			return false;
		}
		return true;
	}

}

exports.Context = Context;

/***/ }),

/***/ "./src/core/dart_export.js":
/*!*********************************!*\
  !*** ./src/core/dart_export.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

const xd = __webpack_require__(/*! scenegraph */ "scenegraph");
const assets = __webpack_require__(/*! assets */ "assets");
const clipboard = __webpack_require__(/*! clipboard */ "clipboard");

const $ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
const NodeUtils = __webpack_require__(/*! ../utils/nodeutils */ "./src/utils/nodeutils.js");
const ExportUtils = __webpack_require__(/*! ../utils/exportutils */ "./src/utils/exportutils.js");
const { cleanIdentifierName, cleanDartName } = __webpack_require__(/*! ../utils/nameutils */ "./src/utils/nameutils.js");

const { trace } = __webpack_require__(/*! ../utils/debug */ "./src/utils/debug.js");
const { Context, ContextTarget } = __webpack_require__(/*! ./context */ "./src/core/context.js");
const { parse } = __webpack_require__(/*! ./parse */ "./src/core/parse.js");
const { formatDart } = __webpack_require__(/*! ../lib/dart_style */ "../lib/dart_style");
const PropType = __webpack_require__(/*! ./proptype */ "./src/core/proptype.js");
const NodeType = __webpack_require__(/*! ./nodetype */ "./src/core/nodetype.js");
const { project } = __webpack_require__(/*! ./project */ "./src/core/project.js");
const { alert } = __webpack_require__(/*! ../ui/alert */ "./src/ui/alert.jsx");
const { checkXDVersion } = __webpack_require__(/*! ../version */ "./src/version.js");
const { getTextStyleParamList, getTextStyle } = __webpack_require__(/*! ./nodes/text */ "./src/core/nodes/text.js");
const { DEFAULT_COLORS_CLASS_NAME, DEFAULT_CHAR_STYLES_CLASS_NAME } = __webpack_require__(/*! ../core/constants */ "./src/core/constants.js");

async function copySelected(selection, root) {
	if (!checkXDVersion()) {
		return;
	}
	let xdNode = $.getSelectedItem(selection);
	if (!xdNode) {
		alert("Select a single item to copy.");return;
	}
	let type = NodeType.getType(xdNode);
	let isCopyable = type !== NodeType.ROOT && type !== NodeType.WIDGET;
	if (!isCopyable) {
		alert("The selected item cannot be copied.");
		return null;
	}

	let ctx = new Context(ContextTarget.CLIPBOARD);

	let result,
	    node = parse(root, xdNode, ctx);
	if (node) {
		node.layout.enabled = false;
		result = _formatDart(node.serialize(ctx) + ';', true, ctx);
	}

	if (result && result.length > 1) {
		result = result.slice(0, -1); // strip off trailing ';'
		clipboard.copyText(result);
		ctx.resultMessage = "Flutter code copied to clipboard";
	} else {
		ctx.resultMessage = "Unable to export this node";
	}

	ctx.log.dump(ctx.resultMessage);
	return ctx;
}

async function exportAll(selection, root) {
	if (!checkXDVersion()) {
		return;
	}
	let ctx = new Context(ContextTarget.FILES);

	if (!(await project.checkRoot())) {
		return null;
	}
	let codeF = project.code;

	let count = 0,
	    total = 0;
	// Parse entire document, getting all artboards and components, combining them in one object for iteration
	parse(root, null, ctx);
	let widgets = Object.assign({}, ctx.artboards, ctx.masterComponents);
	// Write each widget to disk
	for (let n in widgets) {
		if (NodeUtils.getProp(widgets[n].xdNode, PropType.INCLUDE_IN_EXPORT_PROJECT) === false) continue;
		++total;
		let fileName = await writeWidget(widgets[n], codeF, ctx);
		if (fileName) {
			count++;
		}
	}

	await exportColors(ctx);
	await exportCharStyles(ctx);
	await project.validate(ctx);

	ctx.resultMessage = $.getExportAllMessage(count, total, "widget");

	ctx.log.dump(ctx.resultMessage);
	return ctx;
}

async function exportSelected(selection, root) {
	if (!checkXDVersion()) {
		return;
	}
	let xdNode = $.getSelectedItem(selection);
	if (!xdNode) {
		alert("Select an Artboard or Master Component.");return null;
	}

	if (!NodeUtils.isWidget(xdNode)) {
		let msg = "Only Artboards and Master Components can be exported as Widgets.";
		if (xdNode instanceof xd.SymbolInstance) {
			msg += ` Press <b>${$.getCmdKeyStr()}-Shift-K</b> to locate the Master Component.`;
		}
		alert(msg);
		return null;
	}

	if (!(await project.checkRoot())) {
		return null;
	}
	let codeF = project.code;

	let ctx = new Context(ContextTarget.FILES);
	let fileName,
	    node = parse(root, xdNode, ctx);
	if (node) {
		// Write the widget we have selected to disk
		fileName = await writeWidget(node, codeF, ctx);
	}

	await project.validate(ctx);

	ctx.resultMessage = fileName ? `Exported '${fileName}' successfully` : "Widget export failed";

	ctx.log.dump(ctx.resultMessage);
	return ctx;
}

//Writes a single artboard / component to dart file
async function writeWidget(node, codeF, ctx) {
	let fileName = node.widgetName + ".dart";
	let fileStr = node.serializeWidget(ctx);
	fileStr = _formatDart(fileStr, false, ctx, node);

	if (!fileStr) {
		return null;
	}

	await codeF.writeFile(fileName, fileStr, ctx);
	return fileName;
}

async function exportColors(ctx) {
	if (!NodeUtils.getProp(xd.root, PropType.EXPORT_COLORS)) {
		return;
	}
	let entries = assets.colors.get();
	if (!entries) {
		return;
	}
	let lists = {},
	    usedNames = {},
	    names = [];
	let className = cleanDartName(NodeUtils.getProp(xd.root, PropType.COLORS_CLASS_NAME)) || DEFAULT_COLORS_CLASS_NAME;

	let str = `import 'package:flutter/material.dart';\n\nclass ${className} {\n`;
	for (let i = 0, l = entries.length; i < l; i++) {
		let asset = entries[i],
		    name = cleanIdentifierName(asset.name);
		if (!name) {
			continue;
		}
		if (usedNames[name]) {
			ctx.log.warn(`Duplicate color asset name: ${name}`);
			continue;
		}
		usedNames[name] = true;
		names.push(name);
		let isGradient = !asset.color;
		let match = /(.+?)(\d+)$/.exec(name);
		if (match) {
			let o = lists[match[1]];
			if (!o) {
				o = lists[match[1]] = [];
				o.isGradient = isGradient;
			}
			if (o.isGradient !== isGradient) {
				ctx.log.warn(`Color asset lists can't mix colors and gradients (${match[1]})`);
			} else {
				o[parseInt(match[2])] = name;
			}
		}
		if (isGradient) {
			let type = ExportUtils.getGradientTypeFromAsset(asset);
			str += `\tstatic const ${type} ${name} = ${ExportUtils.getGradientFromAsset(asset)};\n`;
		} else {
			str += `\tstatic const Color ${name} = ${ExportUtils.getColor(asset.color)};\n`;
		}
	}
	str += '\n';
	for (let n in lists) {
		let s = _getColorList(lists[n], n, true);
		if (s) {
			str += `${s}\n`;
		}
	}
	str += '\n}';
	str = _formatDart(str, false, ctx, null);
	await project.code.writeFile(`${className}.dart`, str, ctx);
}

function _getColorList(o, name, validate) {
	if (validate && (!o[0] || !o[1])) {
		return '';
	}
	let type = o.isGradient ? 'Gradient' : 'Color';
	let str = `\tstatic const List<${type}> ${name} = const [`;
	for (let i = 0; true; i++) {
		if (!o[i]) {
			break;
		}
		str += `${i === 0 ? '' : ', '}${o[i]}`;
	}
	return str + '];';
}

async function exportCharStyles(ctx) {
	if (!NodeUtils.getProp(xd.root, PropType.EXPORT_CHAR_STYLES)) {
		return;
	}
	let entries = assets.characterStyles.get();
	if (!entries || entries.length === 0) {
		return;
	}
	let usedNames = {},
	    names = [];
	let className = cleanDartName(NodeUtils.getProp(xd.root, PropType.CHAR_STYLES_CLASS_NAME)) || DEFAULT_CHAR_STYLES_CLASS_NAME;
	let str = `import 'package:flutter/material.dart';\n\nclass ${className} {\n`;
	for (let i = 0, l = entries.length; i < l; i++) {
		let asset = entries[i],
		    name = cleanIdentifierName(asset.name);
		if (!name) {
			continue;
		}
		if (usedNames[name]) {
			ctx.log.warn(`Duplicate character style asset name: ${name}`);
			continue;
		}
		usedNames[name] = true;
		names.push(name);
		let style = getTextStyle(getTextStyleParamList(asset.style, false, ctx));
		if (style) {
			str += `\tstatic const TextStyle ${name} = const ${style};\n`;
		}
	}
	str += '\n}';
	str = _formatDart(str, false, ctx, null);
	await project.code.writeFile(`${className}.dart`, str, ctx);
}

function _formatDart(str, nestInFunct, ctx, node) {
	let result = null,
	    xdNode = node && node.xdNode;
	try {
		result = formatDart(str, nestInFunct);
	} catch (e) {
		trace(e);
		ctx.log.error('Unable to format the exported source code.', xdNode);
	}
	return result;
}

module.exports = {
	copySelected,
	exportSelected,
	exportAll,
	exportColors
};

/***/ }),

/***/ "./src/core/decorators/abstractdecorator.js":
/*!**************************************************!*\
  !*** ./src/core/decorators/abstractdecorator.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

// Decorates an AbstractNode, typically by wrapping the widget.
class AbstractDecorator {
	// AbstractDecorators should also have a static `create(node, ctx)` method
	// that returns an instance if appropriate.

	constructor(node, ctx, cosmetic = false) {
		this.node = node;
		this.cosmetic = cosmetic;
	}

	get xdNode() {
		return this.node && this.node.xdNode;
	}

	serialize(nodeStr, ctx) {
		return this._serialize(nodeStr, ctx);
	}

	_serialize(nodeStr, ctx) {
		return nodeStr;
	}
}
exports.AbstractDecorator = AbstractDecorator;

/***/ }),

/***/ "./src/core/decorators/blend.js":
/*!**************************************!*\
  !*** ./src/core/decorators/blend.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

const xd = __webpack_require__(/*! scenegraph */ "scenegraph");

const $ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
const { AbstractDecorator } = __webpack_require__(/*! ./abstractdecorator */ "./src/core/decorators/abstractdecorator.js");

class Blend extends AbstractDecorator {
	static create(node, ctx) {
		let xdNode = node.xdNode,
		    blend = xdNode.blendMode;
		if (!blend || blend === "pass-through" || blend === "normal") {
			return;
		}
		if (!Blend.MODE_MAP[blend]) {
			ctx.log.warn(`Unsupported blend mode '${blend}'`, xdNode);
			return;
		}
		ctx.addImport("package:adobe_xd/blend_mask.dart", false);
		return new Blend(node, ctx);
	}

	_serialize(nodeStr, ctx) {
		let xdNode = this.node.xdNode,
		    bounds = xdNode.boundsInParent;
		let mode = Blend.MODE_MAP[xdNode.blendMode],
		    region = "";

		if (xdNode instanceof xd.Group && this.node.layout.isFixedSize) {
			let lx = $.fix(bounds.x),
			    ly = $.fix(bounds.y);
			let lw = $.fix(bounds.width),
			    lh = $.fix(bounds.height);
			region = `region: Offset(${lx}, ${ly}) & Size(${lw}, ${lh}), `;
		}

		let str = "BlendMask(" + `blendMode: BlendMode.${mode || "src"}, ` +
		//`opacity: ${xdNode.opacity}, ` +
		region + `child: ${nodeStr}, ` + ")";

		return str;
	}
}
exports.Blend = Blend;

Blend.MODE_MAP = {
	"pass-through": "src",
	"normal": "srcOver",
	"darken": "darken",
	"multiply": "multiply",
	"color-burn": "colorBurn",
	"lighten": "lighten",
	"screen": "screen",
	"color-dodge": "colorDodge",
	"overlay": "overlay",
	"soft-light": "softLight",
	"hard-light": "hardLight",
	"difference": "difference",
	"exclusion": "exclusion",
	"hue": "hue",
	"saturation": "saturation",
	"color": "color",
	"luminosity": "luminosity"
};

/***/ }),

/***/ "./src/core/decorators/blur.js":
/*!*************************************!*\
  !*** ./src/core/decorators/blur.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

const xd = __webpack_require__(/*! scenegraph */ "scenegraph");

const $ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
const { AbstractDecorator } = __webpack_require__(/*! ./abstractdecorator */ "./src/core/decorators/abstractdecorator.js");
const { Container } = __webpack_require__(/*! ../nodes/container */ "./src/core/nodes/container.js");

class Blur extends AbstractDecorator {
	static create(node, ctx) {
		let xdNode = node.xdNode,
		    blur = xdNode.blur;
		if (blur && blur.visible) {
			if (!(node instanceof Container)) {
				ctx.log.warn("Blur is currently only supported on rectangles and ellipses.", xdNode);
				return;
			}
			if (!blur.isBackgroundEffect) {
				ctx.log.warn("Object blur is not supported.", xdNode);
				return;
			}
			if (blur.isBackgroundEffect && Math.round(xdNode.blur.brightnessAmount) !== 0) {
				ctx.log.warn("Brightness is currently not supported on blurs.", xdNode);
			}
			ctx.addImport("dart:ui", false, "ui");
			return new Blur(node, ctx);
		}
	}

	_serialize(nodeStr, ctx) {
		let xdNode = this.node.xdNode,
		    blur = xdNode.blur;
		let clipType = xdNode instanceof xd.Rectangle ? "ClipRect" : "ClipOval";
		let filterParam = _getImageFilterParam(blur, ctx);
		return `${clipType}(child: BackdropFilter(${filterParam}child: ${nodeStr}, ), )`;
	}
}
exports.Blur = Blur;

function _getImageFilterParam(blur, ctx) {
	// currently just exports blurs.
	return `filter: ${_getImageFilter(blur, ctx)}, `;
}

function _getImageFilter(blur, ctx) {
	let sigStr = $.fix(blur.blurAmount, 0);
	return `ui.ImageFilter.blur(sigmaX: ${sigStr}, sigmaY: ${sigStr})`;
}

/***/ }),

/***/ "./src/core/decorators/comment.js":
/*!****************************************!*\
  !*** ./src/core/decorators/comment.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

const $ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
const { AbstractDecorator } = __webpack_require__(/*! ./abstractdecorator */ "./src/core/decorators/abstractdecorator.js");
const nodetype = __webpack_require__(/*! ../nodetype */ "./src/core/nodetype.js");

class Comment extends AbstractDecorator {
	static create(node, ctx) {
		if (Comment.enabled && !node.xdNode.hasDefaultName) {
			return new Comment(node, ctx, true);
		}
	}

	_serialize(nodeStr, ctx) {
		let xdNode = this.node.xdNode;
		let name = $.shorten(xdNode.name, 20),
		    type = nodetype.getXDLabel(xdNode);
		return `\n // Adobe XD layer: '${name}' (${type})\n${nodeStr}`;
	}
}
Comment.enabled = true;

exports.Comment = Comment;

/***/ }),

/***/ "./src/core/decorators/layout.js":
/*!***************************************!*\
  !*** ./src/core/decorators/layout.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

const $ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
const { getAlignment } = __webpack_require__(/*! ../../utils/exportutils */ "./src/utils/exportutils.js");
const { addSizedBox, getGroupContentBounds, hasComplexTransform } = __webpack_require__(/*! ../../utils/layoututils */ "./src/utils/layoututils.js");

const { AbstractDecorator } = __webpack_require__(/*! ./abstractdecorator */ "./src/core/decorators/abstractdecorator.js");

class Layout extends AbstractDecorator {
	static create(node, ctx) {
		throw "Layout.create() called.";
	}

	constructor(node, ctx) {
		super(node, ctx);
		this.enabled = true; // set to false to disable layout without changing settings.
	}

	reset() {
		// these properties are set in calculate():
		this.type = LayoutType.NONE;
		this.direction = LayoutDirection.BOTH; // for stack layouts
		this.padding = null;
		this.isFixedSize = false; // indicates layout should fix the size, can be adjusted externally
		this.isResponsive = false; // will move or resize when parent resizes. Ex. Center is both fixed size and responsive.

		// these properties are set by the target or its parent after .calculate() is run
		// they only affect serialize:
		this.shouldExpand = false; // indicates that a SizedBox.expand should be added. Defaults to false.
		this.shouldFixSize = false; // indicates that a SizedBox should be added. Defaults to the value of isFixedSize.
	}

	calculate(ctx) {
		// this precalculates the layout details. These properties can be overridden,
		// for example, by the node itself or its parent node.
		let node = this.node,
		    xdNode = this.xdNode;
		let constraints = xdNode.layout.resizeConstraints,
		    o = constraints && constraints.values;
		let parent = xdNode.parent,
		    xdParentLayout = parent && parent.layout;
		let tmp, pBounds, bounds;

		this.reset();

		if (!xdParentLayout) {
			// widget definition
			this.enabled = false;
			return this;
		}

		this.parentBounds = pBounds = getGroupContentBounds(parent);
		this.bounds = bounds = node.adjustedBounds;

		if (xdParentLayout && xdParentLayout.type === "stack") {
			// In a stack.
			let isVertical = xdParentLayout.stack.orientation === "vertical";
			this.direction = isVertical ? LayoutDirection.VERTICAL : LayoutDirection.HORIZONTAL;
			let shouldPin = o && (isVertical && !o.width && this._isFullWidth() || !isVertical && !o.height && this._isFullHeight());
			this.type = shouldPin ? LayoutType.NONE : LayoutType.PINNED;
			this.isResponsive = shouldPin;
			this.isFixedSize = !shouldPin;
		} else if (!bounds || !o) {
			// missing either bounds (rare) or constraints (not set to responsive)
			this.type = LayoutType.TRANSLATE;
			this.isFixedSize = true;
		} else if (o.top && o.right && o.bottom && o.left) {
			this.type = LayoutType.NONE;
			if (!this._isFullSize()) {
				this.padding = this._getPadding();
			}
			this.isResponsive = true;
		} else if (o.width && o.height && (tmp = this._getAlignment(o))) {
			this.type = tmp === "Alignment.center" ? LayoutType.CENTER : LayoutType.ALIGN;
			this.isFixedSize = true;
			this.isResponsive = true;
			this.alignment = tmp;
		} else {
			this.type = LayoutType.PINNED;
			this.isResponsive = true;
		}
		this.shouldFixSize = this.isFixedSize;

		// ideally this would get moved to _serialize(), in case someone changes it:
		if (this.type === LayoutType.PINNED) {
			ctx.usesPinned();
		}
		return this;
	}

	_serialize(nodeStr, ctx) {
		let node = this.node,
		    type = this.type;

		if (!this.enabled) {
			return nodeStr;
		}

		// work from inside out:
		nodeStr = this._transform(nodeStr, ctx);
		if (this.shouldFixSize) {
			nodeStr = addSizedBox(nodeStr, this.bounds, ctx);
		} else {
			nodeStr = this._expand(nodeStr, ctx);
		}

		if (this.padding) {
			nodeStr = this._padding(nodeStr, ctx);
		}

		if (type === LayoutType.NONE) {
			return nodeStr;
		}
		if (type === LayoutType.TRANSLATE) {
			return this._translate(nodeStr, ctx);
		}
		if (type === LayoutType.CENTER) {
			return this._center(nodeStr, ctx);
		}
		if (type === LayoutType.ALIGN) {
			return this._align(nodeStr, ctx);
		}
		if (type === LayoutType.PINNED) {
			return this._pinned(nodeStr, ctx);
		}
		ctx.log.error(`Unexpected layout type: ${this.type}`, node.xdNode);
	}

	_expand(nodeStr, ctx) {
		// PINNED doesn't require expansion, and other types are all fixed size.
		if (this.shouldExpand && !this.isFixedSize && this.type === LayoutType.NONE) {
			return `SizedBox.expand(child: ${nodeStr})`;
		}
		return nodeStr;
	}

	_pinned(nodeStr, ctx) {
		// TODO: update Pinned to accept null for unnecessary (congruent) pins? ie. optimize for layout direction (vertical/horizontal/both).
		// ^ can use _isFullWidth/Height
		let constraints = this.xdNode.layout.resizeConstraints;
		let o = constraints && constraints.values;
		return "Pinned.fromPins(" + this._getHPin(o, this.bounds, this.parentBounds) + ", " + this._getVPin(o, this.bounds, this.parentBounds) + ", " + `child: ${nodeStr}, ` + ")";
	}

	_getHPin(o, b, pb) {
		if (this.direction === LayoutDirection.HORIZONTAL) {
			return this._getDefaultPin();
		}
		return this._getPin(o.left, o.width, o.right, b.x, b.width, pb.width);
	}

	_getVPin(o, b, pb) {
		if (this.direction === LayoutDirection.VERTICAL) {
			return this._getDefaultPin();
		}
		return this._getPin(o.top, o.height, o.bottom, b.y, b.height, pb.height);
	}

	_getDefaultPin() {
		return "Pin()";
	}

	_getPin(cSt, cSz, cEnd, bSt, bSz, pSz) {
		// c = constraints, b = bounds, p = parent bounds
		let fix = $.fix,
		    end = pSz - (bSt + bSz);
		let middle = pSz === bSz ? 0.5 : bSt / (pSz - bSz);
		let params = [cSz ? `size: ${fix(bSz)}` : null, cSt ? `start: ${fix(bSt)}` : null, cEnd ? `end: ${fix(end)}` : null, !cSt && !cSz ? `startFraction: ${fix(bSt / pSz, 4)}` : null, !cEnd && !cSz ? `endFraction: ${fix(end / pSz, 4)}` : null, cSz && !cSt && !cEnd ? `middle: ${fix(middle, 4)}` : null];
		return "Pin(" + $.joinValues(params) + ")";
	}

	_translate(nodeStr, ctx) {
		let bounds = this.bounds;
		let isOrigin = $.almostEqual(bounds.x, 0, 0.1) && $.almostEqual(bounds.y, 0, 0.1);
		return isOrigin ? nodeStr : "Transform.translate(" + `offset: Offset(${$.fix(bounds.x)}, ${$.fix(bounds.y)}), ` + `child: ${nodeStr},` + ")";
	}

	_padding(nodeStr, ctx) {
		return !this.padding ? "" : "Padding(" + `padding: ${this.padding},` + `child: ${nodeStr}, ` + ")";
	}

	_align(nodeStr, ctx) {
		return !this.alignment ? "" : "Align(" + `alignment: ${this.alignment}, ` + `child: ${nodeStr}, ` + ")";
	}

	_center(nodeStr, ctx) {
		return `Center(child: ${nodeStr},)`;
	}

	_transform(nodeStr, ctx) {
		let transform = this.node.transform;

		if (this.isResponsive && !hasComplexTransform(this.node, "Rotation and flip are not fully supported in responsive layouts.", ctx)) {
			return nodeStr;
		}
		if (transform.flipY) {
			nodeStr = 'Transform(' + 'alignment: Alignment.center, ' + `transform: Matrix4.identity()..rotateZ(${this._getAngle(transform.rotation)})..scale(1.0, -1.0), ` + `child: ${nodeStr}, ` + ')';
		} else if (transform.rotation % 360 !== 0) {
			nodeStr = 'Transform.rotate(' + `angle: ${this._getAngle(transform.rotation)}, ` + `child: ${nodeStr}, ` + ')';
		}
		return nodeStr;
	}

	_getPadding() {
		let size = this.parentBounds,
		    bounds = this.bounds;
		let l = bounds.x,
		    r = size.width - (l + bounds.width);
		let t = bounds.y,
		    b = size.height - (t + bounds.height);

		if ($.almostEqual(l, r, 0.5) && $.almostEqual(t, b, 0.5)) {
			if ($.almostEqual(l, t, 0.5)) {
				return `EdgeInsets.all(${$.fix(l)})`;
			}
			return "EdgeInsets.symmetric(" + `horizontal: ${$.fix(l)}, ` + `vertical: ${$.fix(t)} ` + ")";
		}
		// leave out trailing commas to prevent auto-format from putting every value on a new line:
		return "EdgeInsets.fromLTRB(" + `${$.fix(l)}, ${$.fix(t)}, ${$.fix(r)}, ${$.fix(b)} ` + ")";
	}

	_getAlignment(o) {
		let size = this.parentBounds,
		    bounds = this.bounds;
		let hStr,
		    x = bounds.x,
		    w = size.width - bounds.width;
		let vStr,
		    y = bounds.y,
		    h = size.height - bounds.height;

		if ($.almostEqual(y, 0, 0.5)) {
			vStr = "top";
		} else if ($.almostEqual(y, h / 2, 0.5)) {
			vStr = "center";
		} else if ($.almostEqual(y, h, 0.5)) {
			vStr = "bottom";
		}

		if (o.top && vStr !== "top" || o.bottom && vStr !== "bottom") {
			return;
		}

		if ($.almostEqual(x, 0, 0.5)) {
			hStr = "Left";
		} else if ($.almostEqual(x, w / 2, 0.5)) {
			hStr = "Center";
		} else if ($.almostEqual(x, w, 0.5)) {
			hStr = "Right";
		}

		if (o.left && hStr !== "Left" || o.right && hStr !== "Right") {
			return;
		}

		let str = hStr && vStr ? vStr + hStr : null;
		if (str === "centerCenter") {
			str = "center";
		}
		if (str) {
			return `Alignment.${str}`;
		}
		return getAlignment(x / w, y / h);
	}

	_getAngle(rotation) {
		return $.fix(rotation / 180 * Math.PI, 4);
	}

	_isFullWidth() {
		return $.almostEqual(this.bounds.x, 0, 0.5) && $.almostEqual(this.bounds.width, this.parentBounds.width, 0.5);
	}

	_isFullHeight() {
		return $.almostEqual(this.bounds.y, 0, 0.5) && $.almostEqual(this.bounds.height, this.parentBounds.height, 0.5);
	}

	_isFullSize() {
		return this._isFullWidth() && this._isFullHeight();
	}

	_isCentered() {
		let size = this.parentBounds,
		    bounds = this.bounds;
		let x1 = bounds.x + bounds.width / 2,
		    x2 = size.width / 2;
		let y1 = bounds.y + bounds.height / 2,
		    y2 = size.height / 2;
		return $.almostEqual(x1, x2, 0.5) && $.almostEqual(y1, y2, 0.5);
	}
}

exports.Layout = Layout;

var LayoutType = Object.freeze({
	PINNED: "pinned",
	ALIGN: "align",
	CENTER: "center",
	TRANSLATE: "translate",
	NONE: "none"
});
exports.LayoutType = LayoutType;

var LayoutDirection = Object.freeze({
	VERTICAL: "vertical",
	HORIZONTAL: "horizontal",
	BOTH: "both"
});
exports.LayoutDirection = LayoutDirection;

/***/ }),

/***/ "./src/core/decorators/ontap.js":
/*!**************************************!*\
  !*** ./src/core/decorators/ontap.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

const { AbstractDecorator } = __webpack_require__(/*! ./abstractdecorator */ "./src/core/decorators/abstractdecorator.js");
const { Group } = __webpack_require__(/*! ../nodes/group */ "./src/core/nodes/group.js");

class OnTap extends AbstractDecorator {
	static create(node, ctx) {
		if (!(node instanceof Group)) {
			return;
		}
		if (node.getParam("onTap")) {
			return new OnTap(node, ctx);
		}
	}

	_serialize(nodeStr, ctx) {
		return OnTap.get(nodeStr, this.node.getParam("onTap").name);
	}
}
exports.OnTap = OnTap;

OnTap.get = function (nodeStr, onTap) {
	// This is also used by Component._serialize()
	if (!nodeStr || !onTap) {
		return nodeStr;
	}
	return 'GestureDetector(' + `onTap: ()=> ${onTap}?.call(), ` + `child: ${nodeStr}, ` + ')';
};

/***/ }),

/***/ "./src/core/decorators/prototypeinteraction.js":
/*!*****************************************************!*\
  !*** ./src/core/decorators/prototypeinteraction.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

const xd = __webpack_require__(/*! scenegraph */ "scenegraph");

const $ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
const NodeUtils = __webpack_require__(/*! ../../utils/nodeutils */ "./src/utils/nodeutils.js");
const { AbstractDecorator } = __webpack_require__(/*! ./abstractdecorator */ "./src/core/decorators/abstractdecorator.js");
const PropType = __webpack_require__(/*! ../proptype */ "./src/core/proptype.js");

class PrototypeInteraction extends AbstractDecorator {
	static create(node, ctx) {
		if (NodeUtils.getInteractionCount(node.xdNode) < 1) {
			return;
		}

		let xdNode = node.xdNode,
		    list = xdNode.triggeredInteractions,
		    interaction = list[0];
		if (list.length > 1) {
			return ctx.log.warn(`Multiple prototype interactions on one object is not supported.`, xdNode);
		}
		if (interaction.trigger.type !== "tap") {
			return ctx.log.warn(`Unsupported trigger '${interaction.trigger.type}'. Only tap is supported.`, xdNode);
		}
		let type = interaction.action.type;
		if (type !== "goToArtboard" && type !== "goBack") {
			return ctx.log.warn(`Unsupported action type '${type}'.`, xdNode);
		}
		ctx.addImport("package:adobe_xd/page_link.dart");
		return new PrototypeInteraction(node, ctx);
	}

	_serialize(nodeStr, ctx) {
		let xdNode = this.node.xdNode,
		    interaction = xdNode.triggeredInteractions[0];
		let action = interaction.action,
		    transition = action.transition;
		if (action.type === "goBack") {
			// PageLink treats an empty builder as "go back".
			return `PageLink(links: [PageLinkInfo(), ], child: ${nodeStr}, )`;
		}
		// goToArtboard.
		let artboard = ctx.getArtboardFromXdNode(action.destination);
		if (!artboard) {
			ctx.log.error(`Couldn't add prototype link to '${action.destination.name}'. This is likely due to a duplicate Artboard name.`);
			return nodeStr;
		}
		return 'PageLink(' + 'links: [PageLinkInfo(' + _getTransitionParam(transition, xdNode, ctx) + _getEaseParam(transition, xdNode, ctx) + _getDurationParam(transition, xdNode, ctx) + `pageBuilder: () => ${artboard.serialize(ctx)}, ` + '), ], ' + `child: ${nodeStr}, ` + ')';
	}
}
exports.PrototypeInteraction = PrototypeInteraction;

function _getTransitionParam(transition, xdNode, ctx) {
	let type = TRANSITION_TYPE_MAP[transition.type] || "";
	let dir = TRANSITION_SIDE_MAP[transition.fromSide] || "";
	if (!type) {
		ctx.log.warn(`Transition type not supported: '${transition.type}'.`, xdNode);
	}
	return !type ? '' : `transition: LinkTransition.${type}${dir}, `;
}

function _getEaseParam(transition, xdNode, ctx) {
	let ease = TRANSITION_EASE_MAP[transition.easing] || "";
	if (!ease) {
		ctx.log.warn(`Ease not supported: '${transition.easing}'.`, xdNode);
	}
	return !ease ? '' : `ease: Curves.${ease}, `;
}

function _getDurationParam(transition, xdNode, ctx) {
	return `duration: ${$.fix(transition.duration, 4)}, `;
}

const TRANSITION_TYPE_MAP = {
	"slide": "Slide",
	"push": "Push",
	"dissolve": "Fade"
};

const TRANSITION_SIDE_MAP = {
	"L": "Left",
	"R": "Right",
	"T": "Down",
	"B": "Up"
};

const TRANSITION_EASE_MAP = {
	"linear": "linear",
	"ease-in": "easeIn",
	"ease-out": "easeOut",
	"ease-in-out": "easeInOut",
	"wind-up": "slowMiddle",
	"bounce": "bounceIn",
	"snap": "easeInOutExpo"
};

/***/ }),

/***/ "./src/core/image_export.js":
/*!**********************************!*\
  !*** ./src/core/image_export.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

const xd = __webpack_require__(/*! scenegraph */ "scenegraph");
const app = __webpack_require__(/*! application */ "application");

const $ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
const NodeUtils = __webpack_require__(/*! ../utils/nodeutils */ "./src/utils/nodeutils.js");
const { Context, ContextTarget } = __webpack_require__(/*! ./context */ "./src/core/context.js");
const { project } = __webpack_require__(/*! ./project */ "./src/core/project.js");
const PropType = __webpack_require__(/*! ./proptype */ "./src/core/proptype.js");
const { alert } = __webpack_require__(/*! ../ui/alert */ "./src/ui/alert.jsx");
const { trace } = __webpack_require__(/*! ../utils/debug */ "./src/utils/debug.js");
const { checkXDVersion } = __webpack_require__(/*! ../version */ "./src/version.js");

async function exportImage(selection, root) {
	if (!checkXDVersion()) {
		return;
	}
	let xdNode = $.getSelectedItem(selection),
	    name = NodeUtils.getImageName(xdNode);
	if (!name) {
		alert("You must set an image name before exporting.");return;
	}

	if (!(await project.checkRoot())) {
		return null;
	}
	let imageF = project.images;

	// Do a full scan so we have maxW/maxH values:
	let data = _scanForImages(root, {})[name];
	let ctx = new Context(ContextTarget.FILES);
	let fileName = await _exportImageData(data, name, imageF, ctx);
	ctx.resultMessage = fileName ? `Exported '${fileName}' successfully` : "Image export failed";

	ctx.log.dump(ctx.resultMessage);
	return ctx;
}
exports.exportImage = exportImage;

async function exportAllImages(selection, root) {
	if (!checkXDVersion()) {
		return;
	}
	if (!(await project.checkRoot())) {
		return null;
	}
	let imageF = project.images;

	let ctx = new Context(ContextTarget.FILES);
	let imageNames = _scanForImages(root, {}),
	    count = 0,
	    total = 0;
	for (let n in imageNames) {
		let data = imageNames[n];
		if (!data.includeInExportAll) {
			continue;
		}
		total++;
		let fileName = await _exportImageData(data, n, imageF, ctx);
		if (fileName) {
			count++;
		}
	}
	_pruneImageMap(imageNames);

	ctx.resultMessage = $.getExportAllMessage(count, total, "named image");

	ctx.log.dump(ctx.resultMessage);
	return ctx;
}
exports.exportAllImages = exportAllImages;

function getImagePath(xdNode) {
	let name = _getImageFileName(xdNode);
	return name ? `${project.images.path}/${name}` : null;
}
exports.getImagePath = getImagePath;

function _pruneImageMap(activeNames) {
	// TODO: GS: might be worth pruning the image map stored on the root.
	// Leaving it intact means we would remember the image name even if they removed an image / exported / added it back.
}

function _scanForImages(xdNode, map) {
	// TODO: GS: should we warn about every unnamed image?
	xdNode.children.forEach((child, i) => {
		if (!child.visible) {
			return;
		}
		if (child.fill instanceof xd.ImageFill) {
			let name = NodeUtils.getImageName(child);
			if (name) {
				map[name] = (map[name] || new _ImageData()).add(child);
			}
		} else if (child.children) {
			_scanForImages(child, map);
		}
	});
	return map;
}

async function _exportImageData(data, name, imageF, ctx) {
	let xdNode = data.xdNode,
	    fill = xdNode.fill;
	let imgW = fill.naturalWidth,
	    imgH = fill.naturalHeight;

	if (!NodeUtils.getProp(xd.root, PropType.RESOLUTION_AWARE)) {
		return await _exportImageFile(data.xdNode, name, imgW, imgH, imageF, ctx);
	}

	// Resolution aware export:
	let maxW = data.maxW,
	    maxH = data.maxH;
	let aspect = imgW / imgH,
	    maxScale = Math.min(imgW / maxW, imgH / maxH);
	let w = Math.max(maxW, maxH * aspect) + 0.5 | 0,
	    h = w / aspect + 0.5 | 0;

	let fileName = await _exportImageFile(xdNode, name, w, h, imageF, ctx);
	if (!fileName) {
		return null;
	}

	if (maxScale >= 3 && (imageF = project.imagesX3)) {
		await _exportImageFile(xdNode, name, w * 3, h * 3, imageF, ctx);
	}
	if (maxScale >= 2 && (imageF = project.imagesX2)) {
		await _exportImageFile(xdNode, name, w * 2, h * 2, imageF, ctx);
	}
	return fileName;
}

async function _exportImageFile(xdNode, name, w, h, imageF, ctx) {
	if (!imageF) {
		return;
	}

	// Gets the selected node's image fill, creates a new xd.Rectangle node using the fill
	// at the natural size of the image, and then renders it to an image file.

	// There are two ways we could approach this.
	// One is to have this method return a rendition entry, and return it, then run them all at once.
	// The other is running them one at a time. This approach would let us show a progress bar,
	// and deal with errors individually, but may be slower?
	if (!(xdNode.fill instanceof xd.ImageFill)) {
		ctx.log.error('Tried to export an image from a node that does not have an image fill.', xNode);
		return;
	}

	let rect = new xd.Rectangle();
	rect.fill = xdNode.fill;
	rect.width = w;
	rect.height = h;

	let fileName = _getImageFileName(xdNode);

	let file = await imageF.getFile(fileName, ctx);

	if (!file) {
		ctx.log.error(`Could not create image file ('${fileName}').`, null);
		return null;
	}

	ctx.log.note(`Write image '${$.getRelPath(file, ctx)}'`);

	let type = _getRenditionType(xdNode);
	let opts = {
		node: rect,
		outputFile: file,
		type,
		scale: 1.0
	};
	if (type === app.RenditionType.JPG) {
		opts.quality = 80;
	}

	await app.createRenditions([opts]).then(results => {
		//ctx.log.note(`Image output to: ${results[0].outputFile.nativePath}`);
	}).catch(error => {
		ctx.log.error(`Unable to export image ('${name}'): ${error}`, null);
		fileName = null;
	});
	return fileName;
}

function _getRenditionType(xdNode) {
	let fill = xdNode.fill;
	if (!fill || !(fill instanceof xd.ImageFill)) {
		return null;
	}
	return fill.mimeType === 'image/jpeg' ? app.RenditionType.JPG : app.RenditionType.PNG;
}

function _getImageExtension(xdNode) {
	let type = _getRenditionType(xdNode);
	return !type ? null : type === app.RenditionType.JPG ? "jpg" : "png";
}

function _getImageFileName(xdNode) {
	let ext = _getImageExtension(xdNode),
	    name = NodeUtils.getImageName(xdNode);
	return ext && name ? `${name}.${ext}` : null;
}

class _ImageData {
	constructor(xdNode) {
		this.xdNode = null;
		this.count = this.maxW = this.maxH = 0;
		this.includeInExportAll = true;
		this.add(xdNode);
	}

	add(xdNode) {
		if (!xdNode) {
			return this;
		}
		this.count++;
		this.xdNode = xdNode;
		let bounds = xdNode.globalBounds;
		this.maxW = Math.max(this.maxW, bounds.width);
		this.maxH = Math.max(this.maxH, bounds.height);
		//if (NodeUtils.getProp(xdNode, PropType.INCLUDE_IN_EXPORT_ALL_IMAGES)) { this.includeInExportAll = true; }
		return this;
	}
}

/***/ }),

/***/ "./src/core/log.js":
/*!*************************!*\
  !*** ./src/core/log.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

const $ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
const { trace } = __webpack_require__(/*! ../utils/debug */ "./src/utils/debug.js");
const version = __webpack_require__(/*! ../version */ "./src/version.js");

class Log {
	constructor(message) {
		this.entries = {};
		this.log = [];
		this.startTime = Date.now();
		message && this.add(message);
	}

	add(message, severity = LogSeverity.NOTE, xdNode = null) {
		if (xdNode) {
			message = `[${$.shorten(xdNode.name, 20)}] ${message}`;
		}
		let entry = new Entry(message, severity);
		this.log.push(entry);
		let o = this.entries[entry.hash] = this.entries[entry.hash] || entry;
		o.count += 1;
		return o;
	}

	getResults() {
		let entries = this.entries,
		    results = { warnings: [], errors: [] };
		for (let n in entries) {
			let o = entries[n],
			    severity = o.severity;
			if (severity === LogSeverity.WARNING) {
				results.warnings.push(o);
			} else if (severity === LogSeverity.ERROR) {
				results.errors.push(o);
			}
		}
		return results;
	}

	dump(message) {
		// if in debug mode, this ends the log and traces the result.
		if (!version.debug) {
			return;
		}
		this.add("Complete" + (message ? ": " + message : ""));
		let str = "",
		    log = this.log,
		    t = this.startTime;
		for (let i = 0; i < log.length; i++) {
			let o = log[i];
			str += (o.time - t + "ms").padStart(7, " ") + " ";
			str += "".padStart(o.severity, "*").padEnd(4, " ");
			str += o.message + "\n";
		}
		trace(str);
	}

	// These methods should always have a void return, so they can be included in an empty return.
	note(message, xdNode) {
		this.add(message, LogSeverity.NOTE, xdNode);
	}

	warn(message, xdNode) {
		this.add(message, LogSeverity.WARNING, xdNode);
	}

	error(message, xdNode) {
		this.add(message, LogSeverity.ERROR, xdNode);
	}

	fatal(message, xdNode) {
		this.add(message, LogSeverity.FATAL, xdNode);
	}
}
exports.Log = Log;

class Entry {
	constructor(message, severity = LogSeverity.NOTE) {
		this.message = message;
		this.severity = severity;
		this.count = 0;
		this.hash = $.getHash(`${this.message}${this.severity}`);
		this.time = Date.now();
	}

	toString() {
		return this.message + (this.count > 1 ? ` (x${this.count})` : '');
	}
}

const LogSeverity = Object.freeze({
	NOTE: 0, // Not surfaced to user, dev log.
	WARNING: 1, // Surfaced as warning.
	ERROR: 2, // Surfaced as error.
	FATAL: 3, // Unlikely to be used. Plugin is in an unrecoverable state.
	BLACKWATCH_PLAID: 11 // Pee pee pants
});

/***/ }),

/***/ "./src/core/nodes/abstractnode.js":
/*!****************************************!*\
  !*** ./src/core/nodes/abstractnode.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

const $ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
const { getAdjustedBounds } = __webpack_require__(/*! ../../utils/layoututils */ "./src/utils/layoututils.js");

const { Parameter } = __webpack_require__(/*! ../parameter */ "./src/core/parameter.js");
const { Layout } = __webpack_require__(/*! ../decorators/layout */ "./src/core/decorators/layout.js");

// Abstract class representing the minimum interface required for an export node.
class AbstractNode {
	// Nodes should also have a static `create(xdNode, ctx)` method
	// that returns an instance if appropriate for the xdNode.

	constructor(xdNode, ctx) {
		this.xdNode = xdNode;
		this.parameters = null;
		this.children = null;
		this.decorators = null;
		this.hasDecorators = false; // indicates this node has non-cosmetic decorators.
		this._cache = null;
		this.layout = this._getLayout(ctx);
	}

	get hasChildren() {
		return !!(this.children && this.children.length);
	}

	get xdId() {
		return this.xdNode ? this.xdNode.guid : null;
	}

	get xdName() {
		return this.xdNode ? this.xdNode.name : null;
	}

	get adjustedBounds() {
		return getAdjustedBounds(this.xdNode);
	}

	addDecorator(decorator) {
		this.decorators = this.decorators || [];
		this.decorators.push(decorator);
		if (!decorator.cosmetic) {
			this.hasDecorators = true;
		}
	}

	addParam(key, name, type, value) {
		if (!name || !key) {
			return null;
		}
		let param = new Parameter(name, type, value);
		if (!this.parameters) {
			this.parameters = {};
		}
		return this.parameters[key] = param;
	}

	getParam(key) {
		return this.parameters && this.parameters[key];
	}

	getParamName(key) {
		let param = this.getParam(key);
		return param && param.name || null;
	}

	get transform() {
		// currently supports rotation & flipY.
		return { rotation: this.xdNode.rotation, flipY: false };
	}

	toString(ctx) {
		return `[${this.constructor.name}]`;
	}

	serialize(ctx) {
		if (this._cache === null) {
			let nodeStr = this._serialize(ctx);
			this._cache = this._decorate(nodeStr, ctx);
		}
		return this._cache;
	}

	_serialize(ctx) {
		return "";
	}

	_decorate(nodeStr, ctx) {
		if (!nodeStr) {
			return nodeStr;
		}
		let decorators = this.decorators,
		    l = nodeStr && decorators ? decorators.length : 0;
		for (let i = 0; i < l; i++) {
			nodeStr = decorators[i].serialize(nodeStr, ctx);
		}
		nodeStr = this.layout.serialize(nodeStr, ctx);
		return nodeStr;
	}

	_getChildList(children, ctx) {
		let str = "";
		if (!children || children.length == 0) {
			return str;
		}
		children.forEach(node => {
			let childStr = node && node.serialize(ctx);
			if (childStr) {
				str += childStr + ", ";
			}
		});
		return str;
	}

	_getChildStack(children, ctx) {
		return `Stack(children: <Widget>[${this._getChildList(children, ctx)}], )`;
	}

	// can be overridden by subclasses to set layout properties:
	_getLayout(ctx) {
		return new Layout(this).calculate(ctx);
	}
}
exports.AbstractNode = AbstractNode;

/***/ }),

/***/ "./src/core/nodes/abstractwidget.js":
/*!******************************************!*\
  !*** ./src/core/nodes/abstractwidget.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

const xd = __webpack_require__(/*! scenegraph */ "scenegraph");

const NodeUtils = __webpack_require__(/*! ../../utils/nodeutils */ "./src/utils/nodeutils.js");

const { AbstractNode } = __webpack_require__(/*! ./abstractnode */ "./src/core/nodes/abstractnode.js");
const { ContextTarget } = __webpack_require__(/*! ../context */ "./src/core/context.js");
const PropType = __webpack_require__(/*! ../proptype */ "./src/core/proptype.js");
const { REQUIRED_PARAM } = __webpack_require__(/*! ../constants */ "./src/core/constants.js");

// Base class for nodes that create new Widgets (ex. components or artboards)
// TODO: should this extend Group?
class AbstractWidget extends AbstractNode {

	constructor(xdNode, ctx) {
		super(xdNode, ctx);
		this.children = [];
		this._childParameters = {};
		this._buildMethods = {};
		this._memberNames = {};
		this._shapeData = {};
		this._imports = {};
	}

	get symbolId() {
		return this.xdNode.symbolId;
	}

	get widgetName() {
		return NodeUtils.getWidgetName(this.xdNode);
	}

	serialize(ctx) {
		// serialize a widget instance. Bypass cache & _decorate.
		return this._serialize(ctx);
	}

	serializeWidget(ctx) {
		// serialize the widget class
		ctx.pushWidget(this);
		let params = this._childParameters,
		    propStr = "",
		    paramStr = "";
		let nullsafe = !!NodeUtils.getProp(xd.root, PropType.NULL_SAFE);
		for (let n in params) {
			let param = params[n],
			    value = param.value,
			    required = false;
			if (param.value === REQUIRED_PARAM) {
				required = true;
				value = null;
			}
			if (required) {
				paramStr += `${nullsafe ? "" : "@"}required `;
			}
			paramStr += `this.${param.name}${value ? ` = ${value}` : ""}, `;
			propStr += `final ${param.type}${nullsafe && !required && !value ? "?" : ""} ${param.name};\n`;
		}

		let bodyStr = this._serializeWidgetBody(ctx);
		let importStr = this._getImportListString(ctx);
		let shapeDataStr = this._getShapeDataProps(ctx);
		let buildMethodsStr = this._getBuildMethods(ctx);
		let str = importStr + "\n" + `class ${this.widgetName} extends StatelessWidget {\n` + propStr + `${this.widgetName}({ Key${nullsafe ? "?" : ""} key, ${paramStr}}) : super(key: key);\n` + `@override\nWidget build(BuildContext context) { return ${bodyStr}; }` + buildMethodsStr + "}\n" + shapeDataStr;

		ctx.popWidget();
		return str;
	}

	addBuildMethod(name, str, ctx) {
		this._checkMemberName(name, "build method", ctx);
		this._buildMethods[name] = str;
	}

	addShapeData(shape) {
		// TODO: GS: Switching this to use a unique shape ID (NOT svgId) could simplify a few things
		this._shapeData[shape.xdNode.guid] = shape;
	}

	removeShapeData(shape) {
		delete this._shapeData[shape.xdNode.guid];
	}

	addImport(name, isWidget, scope) {
		this._imports[name] = { name, isWidget, scope };
	}

	addChildParam(param, ctx) {
		if (!param || !param.name) {
			return;
		}
		this._checkMemberName(param.name, `parameter of type ${param.type}`, ctx);
		this._childParameters[param.name] = param;
	}

	_checkMemberName(name, type, ctx) {
		if (!this.xdNode.isMaster) {
			return;
		}
		let t = this._memberNames[name];
		if (t && t === type) {
			ctx.log.warn(`A ${type} name was defined twice on '${this.widgetName}': '${name}'`);
		} else if (t && t !== type) {
			ctx.log.error(`A ${type} was defined with the same name as a ${t} on '${this.widgetName}': '${name}'`);
			//ctx.log.warn(`Duplicate member name (param) on '${this.widgetName}': ${name}.`);
		}
		this._memberNames[name] = type;
	}

	_serializeWidgetBody(ctx) {
		throw "_serializeWidgetBody must be implemented.";
	}

	_getBuildMethods(ctx) {
		let str = "",
		    o = this._buildMethods;
		for (let n in o) {
			str += `\n\nWidget ${n}(context) {\nreturn ${o[n]};\n}`;
		}
		return str;
	}

	_getShapeDataProps(ctx) {
		let str = "",
		    names = {};
		for (let [k, node] of Object.entries(this._shapeData)) {
			const name = NodeUtils.getShapeDataName(node, ctx);
			if (names[name]) {
				continue;
			}
			names[name] = true;
			str += `const String ${name} = '${node.toSvgString(ctx)}';\n`;
		}
		return str;
	}

	_getImportListString(ctx) {
		let str = "import 'package:flutter/material.dart';\n";
		let imports = this._imports;
		for (let n in imports) {
			let o = imports[n];
			if (ctx.target === ContextTarget.FILES || !o.isWidgetImport) {
				str += `import '${o.name}'${o.scope ? `as ${o.scope}` : ''};\n`;
			}
		}
		return str;
	}

	_getParamList(ctx) {
		let str = "",
		    params = this._childParameters;
		for (let n in params) {
			let param = params[n],
			    value = param.value;
			str += value ? `${param.name}: ${value}, ` : "";
		}
		return str;
	}
}
exports.AbstractWidget = AbstractWidget;

/***/ }),

/***/ "./src/core/nodes/artboard.js":
/*!************************************!*\
  !*** ./src/core/nodes/artboard.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

const xd = __webpack_require__(/*! scenegraph */ "scenegraph");

const { AbstractWidget } = __webpack_require__(/*! ./abstractwidget */ "./src/core/nodes/abstractwidget.js");
const { getColor } = __webpack_require__(/*! ../../utils/exportutils */ "./src/utils/exportutils.js");

class Artboard extends AbstractWidget {
	static create(xdNode, ctx) {
		throw "Artboard.create() called.";
	}

	get symbolId() {
		return this.xdNode.guid;
	}

	_serialize(ctx) {
		return `${this.widgetName}(${this._getParamList(ctx)})`;
	}

	get adjustedBounds() {
		// we don't want the artboard's position in the document.
		let xdNode = this.xdNode;
		return { x: 0, y: 0, width: xdNode.width, height: xdNode.height };
	}

	_serializeWidgetBody(ctx) {
		return `Scaffold(${this._getBackgroundColorParam(ctx)}body: ${this._getChildStack(this.children, ctx)}, )`;
	}

	_getBackgroundColorParam(ctx) {
		let xdNode = this.xdNode,
		    fill = xdNode.fillEnabled && xdNode.fill,
		    color;
		if (fill instanceof xd.Color) {
			color = fill;
		} else if (fill) {
			ctx.log.warn("Only solid color backgrounds are supported for artboards.", xdNode);
			let stops = fill.colorStops;
			if (stops && stops.length > 0) {
				color = stops[0].color;
			}
		}
		return color ? `backgroundColor: ${getColor(color)}, ` : "";
	}
}

exports.Artboard = Artboard;

/***/ }),

/***/ "./src/core/nodes/component.js":
/*!*************************************!*\
  !*** ./src/core/nodes/component.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

const NodeUtils = __webpack_require__(/*! ../../utils/nodeutils */ "./src/utils/nodeutils.js");
const { DartType } = __webpack_require__(/*! ../../utils/exportutils */ "./src/utils/exportutils.js");

const { AbstractWidget } = __webpack_require__(/*! ./abstractwidget */ "./src/core/nodes/abstractwidget.js");
const PropType = __webpack_require__(/*! ../proptype */ "./src/core/proptype.js");
const { ContextTarget } = __webpack_require__(/*! ../context */ "./src/core/context.js");
const { OnTap } = __webpack_require__(/*! ../decorators/ontap */ "./src/core/decorators/ontap.js");
const { Parameter } = __webpack_require__(/*! ../parameter */ "./src/core/parameter.js");

class Component extends AbstractWidget {
	static create(xdNode, ctx) {
		throw "Component.create() called.";
	}

	constructor(xdNode, ctx) {
		super(xdNode, ctx);

		let tapCB = NodeUtils.getProp(this.xdNode, PropType.TAP_CALLBACK_NAME);
		if (tapCB) {
			this.addChildParam(new Parameter(tapCB, DartType.TAP_CB), ctx);
		}
	}

	get isMaster() {
		return this.xdNode.isMaster;
	}

	_serialize(ctx) {
		let master = ctx.masterComponents[this.symbolId];
		if (!master) {
			ctx.log.error('Master component could not be found.', this.xdNode);
			return "Container()";
		}
		if (ctx.target === ContextTarget.CLIPBOARD) {
			ctx.log.warn(`Component widget ${master.widgetName} not exported during copy to clipboard operation.`, null);
		}
		let str = `${master.widgetName}(${this._getParamList(ctx)})`;
		return this._decorate(str, ctx);
	}

	_serializeWidgetBody(ctx) {
		let str = this._getChildStack(this.children, ctx);
		// for Component, onTap is not handled by the decorator, because it isn't instance based:
		return OnTap.get(str, NodeUtils.getProp(this.xdNode, PropType.TAP_CALLBACK_NAME));
	}
}

exports.Component = Component;

/***/ }),

/***/ "./src/core/nodes/container.js":
/*!*************************************!*\
  !*** ./src/core/nodes/container.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

const xd = __webpack_require__(/*! scenegraph */ "scenegraph");

const $ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
const ExportUtils = __webpack_require__(/*! ../../utils/exportutils */ "./src/utils/exportutils.js");
const NodeUtils = __webpack_require__(/*! ../../utils/nodeutils */ "./src/utils/nodeutils.js");

const { AbstractNode } = __webpack_require__(/*! ./abstractnode */ "./src/core/nodes/abstractnode.js");
const PropType = __webpack_require__(/*! ../proptype */ "./src/core/proptype.js");

// Represents an Ellipse or Rectangle that can be exported as a decorated Container
class Container extends AbstractNode {
	static create(xdNode, ctx) {
		if (xdNode instanceof xd.Rectangle || xdNode instanceof xd.Ellipse) {
			if (xdNode.fillEnabled && (xdNode.fill instanceof xd.RadialGradient || xdNode.fill instanceof xd.AngularGradient)) {
				ctx.addImport("package:adobe_xd/gradient_xd_transform.dart");
			}
			return new Container(xdNode, ctx);
		}
	}

	constructor(xdNode, ctx) {
		super(xdNode, ctx);
		if (xdNode.fill instanceof xd.ImageFill) {
			let value = ExportUtils.getAssetImage(xdNode, ctx);
			ctx.addParam(this.addParam("fill", NodeUtils.getProp(xdNode, PropType.IMAGE_PARAM_NAME), ExportUtils.DartType.IMAGE, value));
		}
	}

	get isRect() {
		return this.xdNode instanceof xd.Rectangle;
	}

	_serialize(ctx) {
		return "Container(" + this._getSizeParams(ctx) + this._getColorOrDecorationParam(ctx) + this._getMarginParam(ctx) + ")";
	}

	_getSizeParams(ctx) {
		let layout = this.layout;
		if (!layout.enabled || !layout.shouldFixSize) {
			return "";
		}
		layout.shouldFixSize = false; // indicate that it's been handled
		let o = this.xdNode,
		    isRect = this.isRect;
		let w = $.fix(isRect ? o.width : o.radiusX * 2, 0);
		let h = $.fix(isRect ? o.height : o.radiusY * 2, 0);
		return `width: ${w}, height: ${h}, `;
	}

	_getMarginParam(ctx) {
		let layout = this.layout;
		let margin = layout.enabled && layout.padding;
		if (!margin) {
			return "";
		}
		layout.padding = null; // indicate that it's been handled
		return `margin: ${margin}, `;
	}

	/** BOXDECORATION */
	_getColorOrDecorationParam(ctx) {
		let xdNode = this.xdNode;
		if (this.isRect && !xdNode.stroke && !xdNode.hasRoundedCorners && !xdNode.shadow && xdNode.fill instanceof xd.Color) {
			return this._getFillParam(ctx);
		} else {
			return this._getDecorationParam(ctx);
		}
	}

	_getDecorationParam(ctx) {
		let str = $.getParamList([this._getBorderRadiusParam(ctx), this._getBorderParam(ctx), this._getBoxShadowParam(ctx)]);
		let fill = this._getFillParam(ctx);
		if (!str && fill.startsWith("color: ")) {
			return fill;
		}
		return `decoration: BoxDecoration(${fill + str}), `;
	}

	/** FILL & STROKE */
	_getFillParam(ctx) {
		let xdNode = this.xdNode,
		    fill = xdNode.fillEnabled && xdNode.fill;
		if (!fill) {
			return "";
		}
		let blur = xdNode.blur;
		let blurFillOpacity = blur && blur.visible && blur.isBackgroundEffect ? blur.fillOpacity : 1.0;
		let opacity = NodeUtils.getOpacity(xdNode) * blurFillOpacity;
		if (fill instanceof xd.Color) {
			return `color: ${ExportUtils.getColor(xdNode.fill, opacity)}, `;
		}
		if (fill instanceof xd.ImageFill) {
			let image = this.getParamName("fill") || ExportUtils.getAssetImage(xdNode, ctx);
			return "image: DecorationImage(" + `  image: ${image},` + `  fit: ${this._getBoxFit(fill.scaleBehavior)},` + this._getOpacityColorFilterParam(opacity) + "), ";
		}
		let gradient = ExportUtils.getGradientParam(fill, opacity);
		if (gradient) {
			return gradient;
		}
		ctx.log.warn(`Unrecognized fill type ('${fill.constructor.name}').`, xdNode);
	}

	_getBoxFit(scaleBehavior, ctx) {
		// Flutter default is BoxFit.scaleDown, so this is always needed.
		return `BoxFit.${scaleBehavior === xd.ImageFill.SCALE_COVER ? 'cover' : 'fill'}`;
	}

	_getOpacityColorFilterParam(opacity) {
		if (opacity >= 1) {
			return '';
		}
		return `colorFilter: new ColorFilter.mode(Colors.black.withOpacity(${$.fix(opacity, 2)}), BlendMode.dstIn), `;
	}

	_getBorderParam(ctx) {
		let xdNode = this.xdNode;
		if (!xdNode.strokeEnabled) {
			return "";
		}
		if (xdNode.strokePosition !== xd.GraphicNode.INNER_STROKE) {
			ctx.log.warn('Only inner strokes are supported on rectangles & ellipses.', xdNode);
		}
		if (xdNode.strokeJoins !== xd.GraphicNode.STROKE_JOIN_MITER) {
			ctx.log.warn('Only miter stroke joins are supported on rectangles & ellipses.', xdNode);
		}
		let dashes = xdNode.strokeDashArray;
		if (dashes && dashes.length && dashes.reduce((a, b) => a + b)) {
			ctx.log.warn('Dashed lines are not supported on rectangles & ellipses.', xdNode);
		}
		let color = xdNode.stroke && ExportUtils.getColor(xdNode.stroke, NodeUtils.getOpacity(xdNode));
		return color ? `border: Border.all(width: ${$.fix(xdNode.strokeWidth, 2)}, color: ${color}), ` : "";
	}

	/** BORDERRADIUS */
	_getBorderRadiusParam(ctx) {
		let xdNode = this.xdNode,
		    radiusStr;
		if (xdNode instanceof xd.Ellipse) {
			radiusStr = this._getBorderRadiusForEllipse(ctx);
		} else if (xdNode.hasRoundedCorners) {
			radiusStr = this._getBorderRadiusForRectangle(ctx);
		}
		return radiusStr ? `borderRadius: ${radiusStr}, ` : "";
	}

	_getBorderRadiusForEllipse(ctx) {
		// use a really high number so it works if it is resized.
		// using shape: BoxShape.circle doesn't work with ovals
		return `BorderRadius.all(Radius.elliptical(9999.0, 9999.0))`;
	}

	_getBorderRadiusForRectangle(ctx) {
		let radii = this.xdNode.cornerRadii;
		let tl = radii.topLeft,
		    tr = radii.topRight,
		    br = radii.bottomRight,
		    bl = radii.bottomLeft;
		if (tl === tr && tl === br && tl === bl) {
			return `BorderRadius.circular(${$.fix(tl, 2)})`;
		} else {
			return 'BorderRadius.only(' + this._getRadiusParam("topLeft", tl) + this._getRadiusParam("topRight", tr) + this._getRadiusParam("bottomRight", br) + this._getRadiusParam("bottomLeft", bl) + ')';
		}
	}

	_getRadiusParam(param, value) {
		if (value <= 1) {
			return '';
		}
		return `${param}: Radius.circular(${$.fix(value, 2)}), `;
	}

	/** SHADOWS */
	_getBoxShadowParam(ctx) {
		let xdNode = this.xdNode,
		    s = xdNode.shadow;
		if (!s || !s.visible) {
			return "";
		}
		return "boxShadow: [BoxShadow(" + `color: ${ExportUtils.getColor(s.color, NodeUtils.getOpacity(xdNode))}, ` + `offset: Offset(${s.x}, ${s.y}), ` + `blurRadius: ${s.blur}, ` + "), ], ";
	}

}
exports.Container = Container;

/***/ }),

/***/ "./src/core/nodes/grid.js":
/*!********************************!*\
  !*** ./src/core/nodes/grid.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

const xd = __webpack_require__(/*! scenegraph */ "scenegraph");

const $ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
const NodeUtils = __webpack_require__(/*! ../../utils/nodeutils */ "./src/utils/nodeutils.js");
const { getString, getAssetImage, DartType, getScrollView } = __webpack_require__(/*! ../../utils/exportutils */ "./src/utils/exportutils.js");

const { AbstractNode } = __webpack_require__(/*! ./abstractnode */ "./src/core/nodes/abstractnode.js");
const PropType = __webpack_require__(/*! ../proptype */ "./src/core/proptype.js");

class Grid extends AbstractNode {
	static create(xdNode, ctx) {
		if (xdNode instanceof xd.RepeatGrid) {
			return new Grid(xdNode, ctx);
		}
	}

	constructor(xdNode, ctx) {
		super(xdNode, ctx);
		this.item = null;
		// TODO: it would be nice to include the first child in the default value,
		// but that's tricky if we need to add the param in the constructor instead of _serialize
		ctx.addParam(this.addParam("data", NodeUtils.getProp(xdNode, PropType.DATA_PARAM_NAME), DartType.GRID_DATA, "const []"));
	}

	_serialize(ctx) {
		let o = this.xdNode,
		    item = this.item,
		    layout = item.layout;
		if (!item || o.children.length < 1) {
			ctx.log.error("Repeat grid has no children.", o);
			return "";
		}
		if (item.children.length < 1) {
			ctx.log.warn("Repeat grid item is empty.", o);
			return "";
		}
		if (o.paddingX < 0 || o.paddingY < 0) {
			ctx.log.warn("Negative grid spacing is not supported.", o);
		}

		let itemIsResponsive = this._itemIsResponsive();
		if (itemIsResponsive) {
			item = this._stripVirtualGroup(item);
			// disable any layout on the inner group:
			layout.enabled = false;
		} else {
			// TODO: should we strip the virtual group if there is only a single child?
			// disable layout except adding a sized box:
			layout.reset();
			layout.shouldFixSize = true;
		}

		// TODO: it would be great to add explicit types to the params at some point
		// ex. children: <Map<String, dynamic>>
		// ex. final String value = o['foo'];
		let params = this._getParams(ctx);
		let l = o.children.length,
		    childData = new Array(l).fill(""),
		    paramVarStr = "";
		let ns = !!NodeUtils.getProp(xd.root, PropType.NULL_SAFE) ? "!" : "";

		for (let n in params) {
			let vals = params[n];
			paramVarStr += `final ${n} = ${Grid.mapParamName}['${n}']${ns};\n`;
			for (let i = 0; i < l; i++) {
				childData[i] += `'${n}': ${vals[i]}, `;
			}
		}
		let childDataStr = `[{${childData.join("}, {")}}]`;

		let dataParamName = NodeUtils.getProp(o, PropType.DATA_PARAM_NAME);
		if (dataParamName) {
			childDataStr = dataParamName;
		}

		let itemStr = item.serialize(ctx);

		let xSpacing = Math.max(0, o.paddingX),
		    ySpacing = Math.max(0, o.paddingY);
		let cellW = o.cellSize.width,
		    cellH = o.cellSize.height;
		let aspectRatio = $.fix(cellW / cellH, 2);

		let cols = (o.width + xSpacing) / (o.cellSize.width + xSpacing);
		let colCount = Math.round(cols),
		    delta = Math.abs(cols - colCount);

		if (delta > 0.15) {
			ctx.log.warn("Partial columns are not supported in repeat grids.", o);
		}

		let str = itemIsResponsive ? `GridView.count(` + `mainAxisSpacing: ${ySpacing}, crossAxisSpacing: ${xSpacing}, ` + `crossAxisCount: ${colCount}, ` + `childAspectRatio: ${aspectRatio}, ` + `children: ${childDataStr}.map((${Grid.mapParamName}) { ${paramVarStr} return ${itemStr}; }).toList(),` + ')' : getScrollView(`Wrap(` + 'alignment: WrapAlignment.center, ' + `spacing: ${xSpacing}, runSpacing: ${ySpacing}, ` + `children: ${childDataStr}.map((${Grid.mapParamName}) { ${paramVarStr} return ${itemStr}; }).toList(),` + ')', this, ctx);

		return str;
	}

	_itemIsResponsive() {
		// check to see if the virtual group has a single child:
		let item = this.item,
		    kids = item && item.children;
		if (!kids || kids.length !== 1) {
			return false;
		}
		// now check if that child has children and if they are responsive
		kids = kids[0].children;
		return !!(kids && kids.length > 0 && kids[0].layout.isResponsive);
	}

	_stripVirtualGroup(item) {
		let kids = item && item.children;
		return !kids || kids.length !== 1 ? item : kids[0];
	}

	_getParams(ctx) {
		let params = {};
		this._diff(this.item, this.xdNode.children.map(o => o), params, ctx);
		return params;
	}

	_diff(node, xdNodes, params, ctx) {
		if (!node || !xdNodes || xdNodes.length < 1) {
			return;
		}
		let master = xdNodes[0];

		// Currently in XD, only text content and image fills can be different in grid items.
		if (master instanceof xd.Text) {
			let pName = NodeUtils.getProp(master, PropType.TEXT_PARAM_NAME);
			let name = pName || this._getName(params, "text");
			if (this._diffField(params, xdNodes, name, this._getText, !!pName, ctx)) {
				node.addParam("text", name);
			}
		} else if ((master instanceof xd.Rectangle || master instanceof xd.Ellipse) && master.fill instanceof xd.ImageFill) {
			let pName = NodeUtils.getProp(master, PropType.IMAGE_PARAM_NAME);
			let name = pName || this._getName(params, "image");
			if (this._diffField(params, xdNodes, name, this._getImage, !!pName, ctx)) {
				node.addParam("fill", name);
			}
		}

		for (let i = 0, l = node.children && node.children.length; i < l; i++) {
			let childNode = node.children[i];
			this._diff(childNode, xdNodes.map(o => o.children.at(i)), params, ctx);
		};
	}

	_getName(params, name) {
		let count = 0,
		    n = name;
		while (params[n]) {
			n = name + "_" + count++;
		}
		return n;
	}

	_diffField(params, xdNodes, name, valueF, force, ctx) {
		let a = valueF(xdNodes[0]),
		    values = [],
		    diff = !!force;
		for (let i = 0, l = xdNodes.length; i < l; i++) {
			let xdNode = xdNodes[i],
			    b = valueF(xdNode, ctx);
			if (a !== b) {
				diff = true;
			}
			values[i] = b;
		}
		if (diff) {
			params[name] = values;
		}
		return diff;
	}

	_getText(xdNode, ctx) {
		return getString(xdNode.text);
	}

	_getImage(xdNode, ctx) {
		return getAssetImage(xdNode, ctx);
	}

}

Grid.mapParamName = 'itemData';
exports.Grid = Grid;

/***/ }),

/***/ "./src/core/nodes/group.js":
/*!*********************************!*\
  !*** ./src/core/nodes/group.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

const xd = __webpack_require__(/*! scenegraph */ "scenegraph");

const NodeUtils = __webpack_require__(/*! ../../utils/nodeutils */ "./src/utils/nodeutils.js");
const { getScrollView, DartType } = __webpack_require__(/*! ../../utils/exportutils */ "./src/utils/exportutils.js");
const { normalizeSpacings, normalizePadding, getGroupContentBounds, hasComplexTransform, mergeBounds, LayoutType } = __webpack_require__(/*! ../../utils/layoututils */ "./src/utils/layoututils.js");

const { AbstractNode } = __webpack_require__(/*! ./abstractnode */ "./src/core/nodes/abstractnode.js");
const PropType = __webpack_require__(/*! ../proptype */ "./src/core/proptype.js");
const { fix } = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
const { addSizedBox } = __webpack_require__(/*! ../../utils/layoututils */ "./src/utils/layoututils.js");
const { ExportMode, DEFAULT_CUSTOM_CODE, REQUIRED_PARAM } = __webpack_require__(/*! ../constants */ "./src/core/constants.js");

class Group extends AbstractNode {
	static create(xdNode, ctx) {
		if (xdNode instanceof xd.Group || xdNode instanceof xd.ScrollableGroup) {
			return new Group(xdNode, ctx);
		}
	}

	constructor(xdNode, ctx) {
		super(xdNode, ctx);
		this.children = [];

		let mode = this.mode;
		if (mode === ExportMode.INLINE || mode === ExportMode.METHOD) {
			ctx.addParam(this.addParam("onTap", NodeUtils.getProp(this.xdNode, PropType.TAP_CALLBACK_NAME), DartType.TAP_CB));
		} else if (mode === ExportMode.BUILDER) {
			ctx.addParam(this.addParam("builder", this.buildMethodName, DartType.BUILDER, REQUIRED_PARAM));
		}
	}

	get mode() {
		if (!this._mode) {
			this._mode = NodeUtils.getProp(this.xdNode, PropType.EXPORT_MODE) || ExportMode.INLINE;
		}
		return this._mode;
	}

	get buildMethodName() {
		return NodeUtils.getProp(this.xdNode, PropType.BUILD_METHOD_NAME) || NodeUtils.getDefaultBuildMethodName(this.xdNode);
	}

	get background() {
		let padding = this.xdNode.layout.padding;
		return padding && padding.background;
	}

	serialize(ctx) {
		let nodeStr = this._serialize(ctx);
		if (this.mode === ExportMode.CUSTOM || this.mode === ExportMode.BUILDER) {
			// don't decorate or add layout
			// TODO: what about the Comment decorator?
			return nodeStr;
		}
		nodeStr = this._decorate(nodeStr, ctx);

		if (this.mode === ExportMode.METHOD) {
			// TODO: should we add the decorations inside, or outside of the method? What about layout?
			ctx.addBuildMethod(this.buildMethodName, nodeStr);
			return `${this.buildMethodName}(context)`;
		}
		return nodeStr;
	}

	_normalizeChildren() {
		// removes the background child if appropriate.
		return this.children.slice(!!this.background ? 1 : 0);
	}

	_serialize(ctx) {
		// TODO: reconcile decorators with export modes.
		if (this.mode === ExportMode.CUSTOM) {
			return this._getCustomCode(ctx);
		} else if (this.mode === ExportMode.BUILDER) {
			return `${this.buildMethodName}(context)`;
		}

		if (!this.hasChildren) {
			return "";
		}

		let xdNode = this.xdNode,
		    layout = xdNode.layout,
		    str;
		if (xdNode.mask) {
			ctx.log.warn("Group masks aren't supported.", xdNode);
		}

		// determine group type:
		if (layout.type == "stack") {
			str = this._serializeFlex(ctx);
		} else {
			str = this._getChildStack(this._normalizeChildren(), ctx);
		}

		str = this._addPadding(str, ctx);
		str = this._addBackground(str, ctx);
		str = this._addScrolling(str, ctx);
		return str;
	}

	_getCustomCode(ctx) {
		let str = NodeUtils.getProp(this.xdNode, PropType.CUSTOM_CODE) || DEFAULT_CUSTOM_CODE;
		let match = /<(CHILDREN|THIS)({[^}]*?})?>/.exec(str);
		if (!match) {
			return str;
		}

		let i = match.index,
		    l = match[0].length,
		    tag = match[1],
		    repStr = null,
		    settings = {};
		if (match[2]) {
			try {
				settings = JSON.parse(match[2]);
			} catch (e) {
				ctx.log.warn(`Unable to parse tag settings in custom code: ${e}`, this.xdNode);
			}
		}

		if (tag === "CHILDREN") {
			// <CHILDREN{'layout':'size|none'}>
			if (settings.layout === "none") {
				this.children.forEach(o => o.layout.enabled = false);
			} else if (settings.layout === "size") {
				this.children.forEach(o => o.layout.reset(true));
			}
			repStr = this._getChildList(this.children, ctx);
		} else if (tag === "THIS") {
			// <THIS{'decorators':false}>
			// TODO: provide separate options for layout vs other decorators?
			let mode = this._mode;
			this._mode = ExportMode.INLINE;
			repStr = settings.decorators ? this.serialize(ctx) : this._serialize(ctx);
			this._mode = mode;
		}
		return repStr == null ? str : str.slice(0, i) + repStr + str.slice(i + l);
	}

	_serializeFlex(ctx) {
		let xdNode = this.xdNode,
		    layout = xdNode.layout;
		let isVertical = layout.stack.orientation == "vertical";

		let str = (isVertical ? "Column(" : "Row(") + "crossAxisAlignment: CrossAxisAlignment.stretch, " + `children: <Widget>[${this._getFlexChildren(ctx)}], ` + ")";
		return str;
	}

	_getFlexChildren(ctx) {
		let str = "",
		    space;
		let xdNode = this.xdNode,
		    xdLayout = xdNode.layout;
		let isVertical = xdLayout.stack.orientation === "vertical";
		let spaces = normalizeSpacings(xdLayout.stack.spacings, this.children.length - 1).reverse();
		let kids = this._normalizeChildren().reverse();

		kids.forEach((node, i) => {
			if (!node) {
				return;
			}
			node.layout.shouldFixSize = false; // handled below

			let childStr = node.serialize(ctx);
			let size = isVertical ? node.xdNode.localBounds.height : node.xdNode.localBounds.width;
			childStr = `SizedBox(${isVertical ? 'height' : 'width'}: ${fix(size)}, child: ${childStr}, )`;
			if (!childStr) {
				return;
			}

			if (space = spaces[i - 1]) {
				str += `SizedBox(${isVertical ? 'height' : 'width'}: ${fix(space)}, ), `;
			}

			str += childStr + ", ";
		});
		return str;
	}

	_addBackground(str, ctx) {
		let bg = this.background,
		    bgNode = this.children[0];
		if (!bg) {
			return str;
		}
		bgNode.layout.enabled = false;
		// this is just for the error generation:
		hasComplexTransform(bgNode, "Rotation and flip are not supported for background elements.", ctx);
		return 'Stack(children: [\n' + '// background:\n' + `Positioned.fill(child: ${bgNode.serialize(ctx)}, ), ` + `Positioned.fill(child: ${str}, ), ` + '], )';
	}

	_addPadding(str, ctx) {
		let padding = this.xdNode.layout.padding;
		let pad = normalizePadding(padding && padding.values);
		if (!pad) {
			return str;
		}
		return 'Padding(' + `padding: EdgeInsets.` + (pad.homogenous ? `all(${fix(pad.top)})` : `fromLTRB(${fix(pad.left)}, ${fix(pad.top)}, ${fix(pad.right)}, ${fix(pad.bottom)})`) + `, child: ${str}, ` + ')';
	}

	_addScrolling(str, ctx) {
		let xdNode = this.xdNode,
		    vp = xdNode.viewport;
		if (!(xdNode instanceof xd.ScrollableGroup) || !vp) {
			return str;
		}
		str = addSizedBox(str, mergeBounds(this.xdNode.children), ctx);
		return getScrollView(str, this, ctx);
	}

}
exports.Group = Group;

/***/ }),

/***/ "./src/core/nodes/path.js":
/*!********************************!*\
  !*** ./src/core/nodes/path.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

const xd = __webpack_require__(/*! scenegraph */ "scenegraph");

const { AbstractNode } = __webpack_require__(/*! ./abstractnode */ "./src/core/nodes/abstractnode.js");

class Path extends AbstractNode {
	static create(xdNode, ctx) {
		if (xdNode instanceof xd.Path || xdNode instanceof xd.Polygon || xdNode instanceof xd.Line || xdNode instanceof xd.BooleanGroup) {
			return new Path(xdNode, ctx);
		}
	}

	serialize(ctx) {
		// Path objects are converted to Shapes in combineShapes
		throw "Path.serialize() called.";
	}
}
exports.Path = Path;

/***/ }),

/***/ "./src/core/nodes/shape.js":
/*!*********************************!*\
  !*** ./src/core/nodes/shape.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const xd = __webpack_require__(/*! scenegraph */ "scenegraph");

const $ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
const { AbstractNode } = __webpack_require__(/*! ./abstractnode */ "./src/core/nodes/abstractnode.js");
const { getOpacity } = __webpack_require__(/*! ../../utils/nodeutils */ "./src/utils/nodeutils.js");
const { ContextTarget } = __webpack_require__(/*! ../context */ "./src/core/context.js");
const { getImagePath } = __webpack_require__(/*! ../image_export */ "./src/core/image_export.js");
const NodeUtils = __webpack_require__(/*! ../../utils/nodeutils */ "./src/utils/nodeutils.js");
const PropType = __webpack_require__(/*! ../proptype */ "./src/core/proptype.js");

const { Container } = __webpack_require__(/*! ./container */ "./src/core/nodes/container.js");
const { Path } = __webpack_require__(/*! ./path */ "./src/core/nodes/path.js");

class Shape extends AbstractNode {
	static create(xdNode, ctx) {
		throw "Shape.create() called.";
	}

	static fromPath(node, ctx) {
		// creates a Shape from a single path. Used by Copy Selected.
		let shape = new Shape(node.xdNode, ctx);
		shape.add(node);
		return shape;
	}

	// Collection of Path, Container, & Shape nodes that can be 
	// written to a single SVG string. Created by combineShapes.
	constructor(xdNode, ctx) {
		super(xdNode, ctx);
		this.nodes = [];
		this.rejectNextAdd = false;
		this.viewBox = null;
		this._svgString = null;
	}

	get count() {
		return this.nodes.length;
	}

	get adjustedBounds() {
		if (!this.nodes) {
			return null;
		}
		// Based on the composite view box, and not concerned with transformations.
		this._calculateViewBox();
		let xdNode = this.xdNode,
		    pb = xdNode.parent.localBounds,
		    vb = this.viewBox;
		return {
			x: vb.x - pb.x,
			y: vb.y - pb.y,
			width: vb.width,
			height: vb.height
		};
	}

	get transform() {
		// The SVG string already accounts for the transform.
		return { rotation: 0, flipY: false };
	}

	add(node, aggressive = false) {
		// returns true if the node was added, false if not.
		if (this.rejectNextAdd || !Shape.canAdd(node, aggressive)) {
			this.rejectNextAdd = false;
			return false;
		}
		if (Shape.hasInteraction(node) || node.hasDecorators || node.layout.isResponsive) {
			if (this.nodes.length) {
				return false;
			}
			this.decorators = node.decorators;
			this.rejectNextAdd = true;
		}
		// Shapes are added directly to the node list, others are added as xdNodes:
		if (!(node instanceof Shape)) {
			node = node.xdNode;
		}
		this.nodes.push(node);
		return true;
	}

	_serialize(ctx) {
		let layout = this.layout;
		// need to recalculate the layout because bounds may have changed due to shape collapsing:
		layout.calculate(ctx);

		let svg;
		if (ctx.target === ContextTarget.CLIPBOARD) {
			svg = `'${this.toSvgString(ctx)}'`;
		} else {
			svg = NodeUtils.getShapeDataName(this, ctx);
		}
		if (!layout.isFixedSize) {
			layout.shouldExpand = true;
		}
		let fit = !layout.isFixedSize ? "fit: BoxFit.fill, " : "";
		return `SvgPicture.string(${svg}, allowDrawingOutsideViewBox: true, ${fit})`;
	}

	get boundsInParent() {
		this._calculateViewBox();
		return this.xdNode.transform.transformRect(this.viewBox);
	}

	getSvgId(ctx) {
		if (this._svgId) {
			return this._svgId;
		}
		this._svgId = $.getHash(this.toSvgString(ctx)).toString(36);
		return this._svgId;
	}

	toSvgString(ctx) {
		if (this._svgString) {
			return this._svgString;
		}
		this._calculateViewBox();

		let vx = $.fix(this.viewBox.x);
		let vy = $.fix(this.viewBox.y);
		let vw = $.fix(this.viewBox.width);
		let vh = $.fix(this.viewBox.height);

		let svg = _serializeSvgGroup(this, ctx, true);
		this._svgString = `<svg viewBox="${vx} ${vy} ${vw} ${vh}" >${svg}</svg>`;
		return this._svgString;
	}

	_calculateViewBox() {
		if (this.viewBox) {
			return;
		}
		let o = this.viewBox = _calculateAggregateViewBox(this.nodes);
		// ensure a minimum width/height for shapes comprising of just a line:
		o.width = Math.max(1, o.width);
		o.height = Math.max(1, o.height);
	}

}
Shape.canAdd = function (node, aggressive = false) {
	let xdNode = node && node.xdNode;
	return node instanceof Path || node instanceof Shape || aggressive && node instanceof Container && !(xdNode.fillEnabled && xdNode.fill instanceof xd.ImageFill) && !(xdNode.shadow && xdNode.shadow.visible) && !node.hasDecorators;
};
Shape.hasInteraction = function (node) {
	let hasLink = NodeUtils.getInteractionCount(node.xdNode) > 0;
	let hasTap = NodeUtils.getProp(node.xdNode, PropType.TAP_CALLBACK_NAME);
	return !!(hasLink || hasTap);
};

exports.Shape = Shape;

function _serializeSvgGroup(node, ctx, ignoreTransform = false) {
	let result = "";
	for (let i = 0; i < node.nodes.length; ++i) {
		let o = node.nodes[i];
		if (o instanceof Shape) {
			result += _serializeSvgGroup(o, ctx);
		} else {
			result += _serializeSvgNode(o, ctx);
		}
	}
	if (!ignoreTransform) {
		let xform = _getSvgTransform(node.xdNode.transform);
		result = `<g transform="${xform}">${result}</g>`;
	}
	return result;
}

function _serializeSvgNode(xdNode, ctx) {
	// TODO: CE: Pull some of this code out into utility functions
	let o = xdNode,
	    pathStr = o.pathData;
	let opacity = getOpacity(o),
	    fill = "none",
	    fillOpacity = opacity;
	let hasImageFill = false,
	    hasGradientFill = false;
	if (o.fill && o.fillEnabled) {
		hasImageFill = o.fill instanceof xd.ImageFill;
		hasGradientFill = o.fill instanceof xd.LinearGradient || o.fill instanceof xd.RadialGradient;
		//	|| (o.fill instanceof xd.AngularGradient); // not supported in SVG yet
		if (hasGradientFill) {
			fill = "url(#gradient)";
		} else if (o.fill instanceof xd.Color) {
			fill = "#" + $.getRGBHex(o.fill);
			fillOpacity = o.fill.a / 255.0 * opacity;
		} else if (o.fill instanceof xd.AngularGradient) {
			ctx.log.warn('Angular gradient fills are not supported on shapes.', o);
		} else if (hasImageFill) {
			// TODO: Flutter SVG doesn't support image fills yet.
			hasImageFill = false;
			//fill = "url(#image)";
			ctx.log.warn('Image fills are not supported on shapes.', o);
		} else {
			ctx.log.warn(`Unrecognized fill type: ${o.fill.constructor.name}.`, o);
		}
	}

	if (o.strokeEnabled && o.strokePosition !== xd.GraphicNode.CENTER_STROKE) {
		ctx.log.warn('Only center strokes are supported on shapes.', o);
	}

	let imagePath = hasImageFill ? getImagePath(o) : "";
	let imageWidth = $.fix(hasImageFill ? o.fill.naturalWidth : 0);
	let imageHeight = $.fix(hasImageFill ? o.fill.naturalHeight : 0);
	let stroke = o.stroke && o.strokeEnabled ? "#" + $.getRGBHex(o.stroke) : "none";
	let strokeOpacity = o.stroke && o.strokeEnabled ? o.stroke.a / 255.0 * opacity : opacity;
	let strokeWidth = o.strokeWidth;
	let strokeDash = o.strokeDashArray.length > 0 ? o.strokeDashArray[0] : 0;
	let strokeGap = o.strokeDashArray.length > 1 ? o.strokeDashArray[1] : strokeDash;
	let strokeOffset = o.strokeDashArray.length > 0 ? o.strokeDashOffset : 0;
	let strokeMiterLimit = o.strokeJoins === xd.GraphicNode.STROKE_JOIN_MITER ? o.strokeMiterLimit : 0;
	let strokeCap = o.strokeEndCaps;
	let strokeJoin = o.strokeJoins;

	let fillAttrib = `fill="${fill}"`;
	if (fillOpacity != 1.0) fillAttrib += ` fill-opacity="${$.fix(fillOpacity, 2)}"`;
	let strokeAttrib = `stroke="${stroke}" stroke-width="${strokeWidth}"`;

	if (strokeOpacity != 1.0) strokeAttrib += ` stroke-opacity="${$.fix(strokeOpacity, 2)}"`;
	if (strokeGap != 0) strokeAttrib += ` stroke-dasharray="${strokeDash} ${strokeGap}"`;
	if (strokeOffset != 0) strokeAttrib += ` stroke-dashoffset="${strokeOffset}"`;
	if (strokeMiterLimit != 0) strokeAttrib += ` stroke-miterlimit="${strokeMiterLimit}"`;
	if (strokeCap != xd.GraphicNode.STROKE_CAP_BUTT) strokeAttrib += ` stroke-linecap="${strokeCap}"`;
	if (strokeJoin != xd.GraphicNode.STROKE_JOIN_MITER) strokeAttrib += ` stroke-linejoin="${strokeJoin}"`;

	let hasShadow = o.shadow && o.shadow.visible;
	if (hasShadow) {
		// TODO: Flutter SVG doesn't support shadows yet.
		hasShadow = false;
		ctx.log.warn('Shadows are not supported on shapes.', o);
	}
	let filterAttrib = hasShadow ? `filter="url(#shadow)"` : "";

	let defs = "";
	if (hasShadow) {
		defs += `<filter id="shadow"><feDropShadow dx="${o.shadow.x}" dy="${o.shadow.y}" stdDeviation="${o.shadow.blur}"/></filter>`;
	}
	if (hasImageFill) {
		defs += `<pattern id="image" patternUnits="userSpaceOnUse" width="${imageWidth}" height="${imageHeight}"><image xlink:href="${imagePath}" x="0" y="0" width="${imageWidth}" height="${imageHeight}" /></pattern>`;
	}
	if (hasGradientFill) {
		let colorStops = '';
		for (let stop of o.fill.colorStops) {
			const offset = $.fix(stop.stop, 6);
			const color = $.getRGBHex(stop.color);
			const opacity = stop.color.a !== 255 ? `stop-opacity="${$.fix(stop.color.a / 255.0, 2)}"` : "";
			colorStops += `<stop offset="${offset}" stop-color="#${color}" ${opacity}/>`;
		}
		if (o.fill instanceof xd.LinearGradient) {
			const x1 = $.fix(o.fill.startX, 6);
			const y1 = $.fix(o.fill.startY, 6);
			const x2 = $.fix(o.fill.endX, 6);
			const y2 = $.fix(o.fill.endY, 6);
			defs += `<linearGradient id="gradient" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">`;
			defs += colorStops;
			defs += `</linearGradient>`;
		} else if (o.fill instanceof xd.RadialGradient) {
			const inv = o.fill.gradientTransform.invert();
			const start = inv.transformPoint({ x: o.fill.startX, y: o.fill.startY });
			const end = inv.transformPoint({ x: o.fill.endX, y: o.fill.endY });
			const fx = $.fix(start.x, 6);
			const fy = $.fix(start.y, 6);
			const fr = $.fix(o.fill.startR, 6);
			const cx = $.fix(end.x, 6);
			const cy = $.fix(end.y, 6);
			const r = $.fix(o.fill.endR, 6);
			const a = $.fix(o.fill.gradientTransform.a, 6);
			const b = $.fix(o.fill.gradientTransform.b, 6);
			const c = $.fix(o.fill.gradientTransform.c, 6);
			const d = $.fix(o.fill.gradientTransform.d, 6);
			const e = $.fix(o.fill.gradientTransform.e, 6);
			const f = $.fix(o.fill.gradientTransform.f, 6);
			let xform = "";
			if (a !== 1.0 || b !== 0.0 || c !== 0.0 || d !== 1.0 || e !== 0.0 || f !== 0.0) {
				xform = `gradientTransform="matrix(${a} ${b} ${c} ${d} ${e} ${f})"`;
			}
			defs += `<radialGradient id="gradient" ${xform} fx="${fx}" fy="${fy}" fr="${fr}" cx="${cx}" cy="${cy}" r="${r}">`;
			defs += colorStops;
			defs += `</radialGradient>`;
		}
	}
	defs = defs ? `<defs>${defs}</defs>` : "";

	o.transform.translate(o.localBounds.x, o.localBounds.y);
	const xform = _getSvgTransform(o.transform);
	let transformAttrib = xform ? `transform="${xform}"` : "";

	let str = `${defs}<path ${transformAttrib} d="${pathStr}" ${fillAttrib} ${strokeAttrib} ${filterAttrib}/>`;
	return str;
}

function _getSvgTransform(transform) {
	let result;

	if (transform.a !== 1.0 || transform.b !== 0.0 || transform.c !== 0.0 || transform.d !== 1.0) {
		// Use full transform
		const a = $.fix(transform.a, 6);
		const b = $.fix(transform.b, 6);
		const c = $.fix(transform.c, 6);
		const d = $.fix(transform.d, 6);
		const e = $.fix(transform.e, 2);
		const f = $.fix(transform.f, 2);
		result = `matrix(${a}, ${b}, ${c}, ${d}, ${e}, ${f})`;
	} else if (transform.e !== 0.0 || transform.f !== 0.0) {
		// Use offset transform
		const e = $.fix(transform.e, 2);
		const f = $.fix(transform.f, 2);
		result = `translate(${e}, ${f})`;
	} else {
		result = "";
	}
	return result;
}

function _calculateAggregateViewBox(nodes) {
	let minX = Number.MAX_VALUE;
	let minY = Number.MAX_VALUE;
	let maxX = -Number.MAX_VALUE;
	let maxY = -Number.MAX_VALUE;

	for (let o of nodes) {
		let boundsR = o.boundsInParent.x + o.boundsInParent.width;
		let boundsB = o.boundsInParent.y + o.boundsInParent.height;
		if (o.boundsInParent.x < minX) {
			minX = o.boundsInParent.x;
		}
		if (o.boundsInParent.y < minY) {
			minY = o.boundsInParent.y;
		}
		if (boundsR > maxX) {
			maxX = boundsR;
		}
		if (boundsB > maxY) {
			maxY = boundsB;
		}
	}

	return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

/***/ }),

/***/ "./src/core/nodes/text.js":
/*!********************************!*\
  !*** ./src/core/nodes/text.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

const xd = __webpack_require__(/*! scenegraph */ "scenegraph");

const $ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.js");
const NodeUtils = __webpack_require__(/*! ../../utils/nodeutils */ "./src/utils/nodeutils.js");
const { getColor, getString, getScrollView, DartType } = __webpack_require__(/*! ../../utils/exportutils */ "./src/utils/exportutils.js");

const { AbstractNode } = __webpack_require__(/*! ./abstractnode */ "./src/core/nodes/abstractnode.js");
const PropType = __webpack_require__(/*! ../proptype */ "./src/core/proptype.js");
const { LayoutType } = __webpack_require__(/*! ../decorators/layout */ "./src/core/decorators/layout.js");

/*
Notes:
- Line height in XD is a fixed pixel value. In Flutter it is a multiplier of the largest text in a line. This causes differences in rich text with different sizes.
*/

class Text extends AbstractNode {
	static create(xdNode, ctx) {
		if (xdNode instanceof xd.Text) {
			return new Text(xdNode, ctx);
		}
	}

	constructor(xdNode, ctx) {
		super(xdNode, ctx);
		ctx.addParam(this.addParam("text", NodeUtils.getProp(xdNode, PropType.TEXT_PARAM_NAME), DartType.STRING, getString(xdNode.text)));
		ctx.addParam(this.addParam("fill", NodeUtils.getProp(xdNode, PropType.COLOR_PARAM_NAME), DartType.COLOR, getColor(xdNode.fill)));
	}

	get transform() {
		let o = this.xdNode;
		return { rotation: o.rotation, flipY: o.flipY };
	}

	_serialize(ctx) {
		let str,
		    o = this.xdNode,
		    layout = this.layout;

		if (o.styleRanges.length <= 1 || this.getParam("text") || this.getParam("fill")) {
			str = this._getText(ctx);
		} else {
			str = this._getTextRich(ctx);
		}

		if (o.clippedByArea) {
			str = getScrollView(str, this, ctx);
		}
		if (!layout.isFixedSize) {
			layout.shouldExpand = true;
		} else if (layout.type === LayoutType.TRANSLATE) {
			str = this._addSizeBox(str, ctx);
		}
		return str;
	}

	_getText(ctx) {
		let o = this.xdNode,
		    text = this.getParamName("text") || getString(o.text);
		return "Text(" + `${text}, ` + getStyleParam(this._getTextStyleParamList(o, false, ctx)) + (o.lineSpacing !== 0 ? this._getTextHeightBehavior() : "") + this._getTextAlignParam() + this._getSoftWrapParam() + ")";
	}

	_getTextRich(ctx) {
		let xdNode = this.xdNode,
		    text = xdNode.text;
		let styles = xdNode.styleRanges;
		let str = "",
		    j = 0;
		let defaultStyleParams = this._getTextStyleParamList(styles[0], true, ctx);
		let hasTextHeight = false;

		for (let i = 0; i < styles.length; i++) {
			let style = styles[i],
			    l = style.length;
			hasTextHeight = hasTextHeight || style.lineSpacing !== 0;
			if (l === 0) {
				continue;
			}
			let styleParams = this._getTextStyleParamList(style, false, ctx);
			let delta = $.getParamDelta(defaultStyleParams, styleParams);
			if (i === styles.length - 1) {
				l = text.length - j;
			} // for some reason, XD doesn't always return the correct length for the last entry.
			str += this._getTextSpan(delta, text.substr(j, l)) + ", ";
			j += l;
		}

		// Export a rich text object with an empty root span setting a default style.
		// Child spans set their style as a delta of the default.
		return "Text.rich(TextSpan(" + getStyleParam(defaultStyleParams) + `  children: [${str}], ),` + (hasTextHeight ? this._getTextHeightBehavior() : "") + this._getTextAlignParam() + this._getSoftWrapParam() + ")";
	}

	_getTextSpan(styleParams, text) {
		return "TextSpan(" + ` text: ${getString(text)}, ` + getStyleParam(styleParams) + ")";
	}

	_getSoftWrapParam() {
		if (this.xdNode.layoutBox.type !== xd.Text.POINT) {
			return "";
		}
		return "softWrap: false, ";
	}

	_getTextAlignParam() {
		if (this.xdNode.textAlign === "left") {
			return "";
		}
		return `textAlign: ${this._getTextAlign(this.xdNode.textAlign)}, `;
	}

	_getTextAlign(align) {
		return "TextAlign." + (align === "right" ? "right" : align === "center" ? "center" : "left");
	}

	_getTextHeightBehavior() {
		// TODO: this could potentially use some fuzzy logic to only apply to fields that are multi-line,
		// and just omit the line height for single line text.
		// ex. if (nodeHeight < textHeight * 1.2)
		// it's a bit esoteric though, and could cause confusion
		return "textHeightBehavior: TextHeightBehavior(applyHeightToFirstAscent: false), ";
	}

	_getTextStyleParamList(o, isDefault, ctx) {
		return getTextStyleParamList(o, isDefault, ctx, this.xdNode, this.getParamName("fill"));
	}

	_addSizeBox(str, ctx) {
		let o = this.xdNode,
		    type = o.layoutBox.type,
		    layout = this.layout;
		if (type === xd.Text.FIXED_HEIGHT || !layout.enabled) {
			return str;
		} // let layout handle it

		let bounds = layout.bounds,
		    w = bounds.width;
		layout.shouldFixSize = false;

		if (type === xd.Text.POINT) {
			if (o.textAlign === "right") {
				w += bounds.x;
				bounds.x = 0;
			} else if (o.textAlign === "center") {
				w += bounds.x;
				bounds.x /= 2;
			} else {
				return str;
			}
		}
		str = `SizedBox(width: ${$.fix(w, 0)}, child: ${str},)`;
		return str;
	}
}
exports.Text = Text;

function getTextStyleParamList(o, isDefault, ctx, xdNode = null, fill = null) {
	let isStyleRange = o.length != null;

	// kind of an unusual place for this, but we want to run it on every style object:
	_checkForUnsupportedFeatures(o, xdNode, ctx);
	ctx.addFont(_getFontFamily(o), xdNode);

	// Builds an array of style parameters.
	return [_getFontFamilyParam(o), _getFontSizeParam(o), _getColorParam(o, fill), _getLetterSpacingParam(o),
	// The default style doesn't include weight, decoration, or style (italic):
	isDefault ? null : _getFontStyleParam(o), isDefault ? null : _getFontWeightParam(o), isDefault ? null : _getTextDecorationParam(o),
	// Line height & shadows are set at the node level in XD, so not included for ranges:
	!isStyleRange || isDefault ? _getHeightParam(xdNode || o) : null, !isStyleRange || isDefault ? _getShadowsParam(xdNode || o) : null];
}
exports.getTextStyleParamList = getTextStyleParamList;

function getStyleParam(styleParams) {
	if (!styleParams) {
		return "";
	}
	let str = getTextStyle(styleParams);
	return !str ? "" : `style: ${str}, `;
}
exports.getStyleParam = getStyleParam;

function getTextStyle(styleParams) {
	let str = $.getParamList(styleParams);
	return !str ? "" : `TextStyle(${str})`;
}
exports.getTextStyle = getTextStyle;

function _checkForUnsupportedFeatures(o, xdNode, ctx) {
	if (o.textScript !== "none") {
		// super / subscript
		ctx.log.warn("Superscript & subscript are not currently supported.", xdNode);
	}
	if (o.textTransform !== "none") {
		// uppercase / lowercase / titlecase
		ctx.log.warn("Text transformations (all caps, title case, lowercase) are not currently supported.", xdNode);
	}
	if (o.paragraphSpacing) {
		ctx.log.warn("Paragraph spacing is not currently supported.", xdNode);
	}
	if (o.strokeEnabled && o.stroke) {
		// outline text
		ctx.log.warn("Text border is not currently supported.", xdNode);
	}
}

function _getFontFamilyParam(o) {
	return `fontFamily: '${_getFontFamily(o)}', `;
}

function _getFontFamily(o) {
	return NodeUtils.getFlutterFont(o.fontFamily) || o.fontFamily;
}

function _getFontSizeParam(o) {
	return `fontSize: ${o.fontSize}, `;
}

function _getColorParam(o, fill) {
	return `color: ${fill || getColor(o.fill, NodeUtils.getOpacity(o))}, `;
}

function _getLetterSpacingParam(o) {
	// Flutter uses pixel values for letterSpacing.
	// XD uses increments of 1/1000 of the font size.
	return o.charSpacing === 0 ? "" : `letterSpacing: ${o.charSpacing / 1000 * o.fontSize}, `;
}

function _getFontStyleParam(o) {
	let style = _getFontStyle(o.fontStyle);
	return style ? `fontStyle: ${style}, ` : "";
}

function _getFontStyle(style) {
	style = style.toLowerCase();
	let match = style.match(FONT_STYLES_RE);
	let val = match && FONT_STYLES[match];
	return val ? "FontStyle." + val : null;
}

function _getFontWeightParam(o) {
	let weight = _getFontWeight(o.fontStyle);
	return weight ? `fontWeight: ${weight}, ` : "";
}

function _getFontWeight(style) {
	style = style.toLowerCase();
	let match = style.match(FONT_WEIGHTS_RE);
	let val = match && FONT_WEIGHTS[match];
	return val ? "FontWeight." + val : null;
}

function _getTextDecorationParam(o) {
	let u = o.underline,
	    s = o.strikethrough,
	    str = "";
	if (!u && !s) {
		return str;
	}
	if (u && s) {
		str = "TextDecoration.combine([TextDecoration.underline, TextDecoration.lineThrough])";
	} else {
		str = `TextDecoration.${u ? "underline" : "lineThrough"}`;
	}
	return `decoration: ${str}, `;
}

function _getHeightParam(o) {
	// XD reports a lineSpacing of 0 to indicate default spacing.
	// Flutter uses a multiplier against the font size for its "height" value.
	// XD uses a pixel value.
	return o.lineSpacing === 0 ? "" : `height: ${o.lineSpacing / o.fontSize}, `;
}

function _getShadowsParam(xdNode) {
	return xdNode.shadow == null || !xdNode.shadow.visible ? "" : `shadows: [${_getShadow(xdNode.shadow)}], `;
}

function _getShadow(shadow) {
	let o = shadow;
	return `Shadow(color: ${getColor(o.color)}, ` + (o.x || o.y ? `offset: Offset(${o.x}, ${o.y}), ` : "") + (o.blur ? `blurRadius: ${o.blur}, ` : "") + ")";
}

function _buildStyleRegExp(map) {
	let list = [];
	for (let n in map) {
		list.push(n);
	}
	return new RegExp(list.join("|"), "ig");
}

// Used to translate font weight names from XD to Flutter constants:
// https://www.webtype.com/info/articles/fonts-weights/
const FONT_WEIGHTS = {
	"thin": "w100",
	"hairline": "w100",
	"extralight": "w200",
	"ultralight": "w200",
	"light": "w300",
	"book": "w300",
	"demi": "w300",

	"normal": null, // w400
	"regular": null,
	"plain": null,

	"medium": "w500",
	"semibold": "w600",
	"demibold": "w600",
	"bold": "w700", // or "bold"
	"extrabold": "w800",
	"heavy": "w800",
	"black": "w900",
	"poster": "w900"
};
const FONT_WEIGHTS_RE = _buildStyleRegExp(FONT_WEIGHTS);

const FONT_STYLES = {
	"italic": "italic",
	"oblique": "italic"
};
const FONT_STYLES_RE = _buildStyleRegExp(FONT_STYLES);

/***/ }),

/***/ "./src/core/nodetype.js":
/*!******************************!*\
  !*** ./src/core/nodetype.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

const xd = __webpack_require__(/*! scenegraph */ "scenegraph");

function getType(xdNode) {
    if (xdNode instanceof xd.Text) {
        return exports.TEXT;
    }
    if (xdNode instanceof xd.Group || xdNode instanceof xd.ScrollableGroup) {
        return exports.GROUP;
    }
    if (xdNode instanceof xd.RepeatGrid) {
        return exports.GRID;
    }
    if (xdNode instanceof xd.SymbolInstance || xdNode instanceof xd.Artboard) {
        return exports.WIDGET;
    }
    if (xdNode instanceof xd.Path || xdNode instanceof xd.Polygon || xdNode instanceof xd.Rectangle || xdNode instanceof xd.Ellipse || xdNode instanceof xd.BooleanGroup || xdNode instanceof xd.Line) {
        return exports.SHAPE;
    }
    return exports.ROOT;
}
exports.getType = getType;

function getXDLabel(xdNode) {
    if (xdNode == null) {
        return "none";
    }
    // not necessarily the ideal location for this method, but it's good to maintain proximity to the other similar methods.
    if (xdNode instanceof xd.Text) {
        return "text";
    }
    if (xdNode instanceof xd.Group || xdNode instanceof xd.ScrollableGroup) {
        return "group";
    }
    if (xdNode instanceof xd.RepeatGrid) {
        return "grid";
    }
    if (xdNode instanceof xd.SymbolInstance) {
        return "component";
    }
    if (xdNode instanceof xd.Artboard) {
        return "artboard";
    }
    if (xdNode instanceof xd.Path || xdNode instanceof xd.Polygon || xdNode instanceof xd.Rectangle || xdNode instanceof xd.Ellipse || xdNode instanceof xd.BooleanGroup || xdNode instanceof xd.Line) {
        return "shape";
    }
    return "unknown element";
}
exports.getXDLabel = getXDLabel;

function getLabel(xdNode) {
    // this works fine for now.
    return getType(xdNode);
}
exports.getLabel = getLabel;

exports.TEXT = "text";
exports.GROUP = "group";
exports.WIDGET = "widget";
exports.SHAPE = "shape";
exports.ROOT = "root";
exports.GRID = "grid";

/***/ }),

/***/ "./src/core/parameter.js":
/*!*******************************!*\
  !*** ./src/core/parameter.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

class Parameter {
	constructor(name, type = null, value = null) {
		this.name = name;
		this.type = type; // the Dart type
		this.value = value; // always the string value or null
	}
}
exports.Parameter = Parameter;

/***/ }),

/***/ "./src/core/parse.js":
/*!***************************!*\
  !*** ./src/core/parse.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

const xd = __webpack_require__(/*! scenegraph */ "scenegraph");

const NodeUtils = __webpack_require__(/*! ../utils/nodeutils */ "./src/utils/nodeutils.js");
const { cleanFileName } = __webpack_require__(/*! ../utils/nameutils */ "./src/utils/nameutils.js");
const PropType = __webpack_require__(/*! ./proptype */ "./src/core/proptype.js");
const { getXDLabel } = __webpack_require__(/*! ./nodetype */ "./src/core/nodetype.js");
const { trace } = __webpack_require__(/*! ../utils/debug */ "./src/utils/debug.js");

const { Artboard } = __webpack_require__(/*! ./nodes/artboard */ "./src/core/nodes/artboard.js");
const { Group } = __webpack_require__(/*! ./nodes/group */ "./src/core/nodes/group.js");
const { Container } = __webpack_require__(/*! ./nodes/container */ "./src/core/nodes/container.js");
const { Text } = __webpack_require__(/*! ./nodes/text */ "./src/core/nodes/text.js");
const { Component } = __webpack_require__(/*! ./nodes/component */ "./src/core/nodes/component.js");
const { Path } = __webpack_require__(/*! ./nodes/path */ "./src/core/nodes/path.js");
const { Grid } = __webpack_require__(/*! ./nodes/grid */ "./src/core/nodes/grid.js");

const { Shape } = __webpack_require__(/*! ./nodes/shape */ "./src/core/nodes/shape.js");
const { Blur } = __webpack_require__(/*! ./decorators/blur */ "./src/core/decorators/blur.js");
const { Blend } = __webpack_require__(/*! ./decorators/blend */ "./src/core/decorators/blend.js");
const { OnTap } = __webpack_require__(/*! ./decorators/ontap */ "./src/core/decorators/ontap.js");
const { PrototypeInteraction } = __webpack_require__(/*! ./decorators/prototypeinteraction */ "./src/core/decorators/prototypeinteraction.js");
const { Comment } = __webpack_require__(/*! ./decorators/comment */ "./src/core/decorators/comment.js");
const { LayoutType } = __webpack_require__(/*! ./decorators/layout */ "./src/core/decorators/layout.js");

const ParseMode = Object.freeze({
	NORMAL: 0,
	SYMBOLS_AS_GROUPS: 1
});

function parse(root, targetXdNode, ctx) {
	// set initial properties:
	Comment.enabled = !!NodeUtils.getProp(xd.root, PropType.INCLUDE_NAME_COMMENTS);

	// Grab components and artboard from the root nodes
	gatherWidgets(root, ctx);

	// Parse components and artboard
	const widgets = Object.assign({}, ctx.artboards, ctx.masterComponents);
	for (let widget of Object.values(widgets)) {
		if (!targetXdNode || widget.xdNode === targetXdNode) {
			// This widget is being exported by the user
			ctx.useUserLog();
		} else {
			// This widget must be parsed because it's state is needed but the user hasn't explicitly
			// requested to export this widget so filter the log messages
			ctx.useDebugLog();
		}
		let o = parseScenegraphNode(widget.xdNode, ctx, ParseMode.NORMAL, true);
		combineShapes(o, ctx);
	}
	ctx.useUserLog();

	if (!targetXdNode) {
		return null;
	}

	let node = parseScenegraphNode(targetXdNode, ctx, ParseMode.NORMAL, true);
	if (node instanceof Path) {
		node = Shape.fromPath(node, ctx);
	} else {
		combineShapes(node, ctx);
	}

	return node;
}
exports.parse = parse;

function gatherWidgets(xdNode, ctx) {
	if (xdNode instanceof xd.SymbolInstance) {
		ctx.addComponentInstance(new Component(xdNode, ctx));
	} else if (xdNode instanceof xd.Artboard) {
		ctx.addArtboard(new Artboard(xdNode, ctx));
	}
	if (xdNode.children) {
		xdNode.children.forEach(o => gatherWidgets(o, ctx));
	}
}

let NODE_FACTORIES = [Grid, Path, Container, Group, Text];
let DECORATOR_FACTORIES = [// order determines nesting order, first will be innermost
PrototypeInteraction, OnTap, Blur, Blend, Comment];

function parseScenegraphNode(xdNode, ctx, mode, ignoreVisible = false) {
	if (!ignoreVisible && !xdNode.visible) {
		return null;
	}

	let node = null,
	    isWidget = false;
	let isArtboard = xdNode instanceof xd.Artboard,
	    isComponent = xdNode instanceof xd.SymbolInstance;

	if (xdNode instanceof xd.RootNode) {
		throw "parseScenegraphNode() run on RootNode";
	} else if (isComponent && mode === ParseMode.SYMBOLS_AS_GROUPS) {
		node = new Group(xdNode, ctx);
	} else if (isArtboard || isComponent) {
		node = isArtboard ? ctx.getArtboardFromXdNode(xdNode) : ctx.getComponentFromXdNode(xdNode);
		if (node) {
			if (node.parsed) {
				return node;
			}
			if (node.layout.type === LayoutType.PINNED) {
				// since components can be parsed out of order
				ctx.usesPinned();
			}
			node.parsed = isWidget = true;
		}
	} else {
		for (let i = 0; i < NODE_FACTORIES.length && !node; i++) {
			node = NODE_FACTORIES[i].create(xdNode, ctx);
		}
	}
	if (!node) {
		ctx.log.error(`Unable to create export node from ${getXDLabel(xdNode)} named '${xdNode.constructor.name}'.`, xdNode);
		return null;
	}

	// post processing:
	if (isWidget) {
		ctx.pushWidget(node);
		parseChildren(node, ctx, mode);
		ctx.popWidget();
	} else if (node instanceof Group) {
		parseChildren(node, ctx, mode);
	} else if (node instanceof Grid) {
		if (ctx.inGrid) {
			ctx.log.warn("Nested repeat grids are currently unsupported, and may result in unexpected behaviour.", xdNode);
		}
		let kids = node.xdNode.children,
		    child = kids && kids.at(0);
		ctx.pushGrid();
		node.item = child && parseScenegraphNode(child, ctx, ParseMode.SYMBOLS_AS_GROUPS);
		ctx.popGrid();
		combineShapes(node.item, ctx);
	}

	addWidgetImports(node, ctx);

	// add decorators:
	for (let i = 0; i < DECORATOR_FACTORIES.length; i++) {
		let decorator = DECORATOR_FACTORIES[i].create(node, ctx);
		if (decorator) {
			node.addDecorator(decorator);
		}
	}
	return node;
}

function parseChildren(node, ctx, mode) {
	let xdNodes = node.xdNode.children;
	for (let i = 0; i < xdNodes.length; ++i) {
		node.children.push(parseScenegraphNode(xdNodes.at(i), ctx, mode, false));
	}
}

function addWidgetImports(node, ctx) {
	let xdNode = node.xdNode,
	    fixCase = !!NodeUtils.getProp(xd.root, PropType.NORMALIZE_NAME_CASE);

	// Gather imports for components
	if (xdNode instanceof xd.SymbolInstance) {
		let master = ctx.masterComponents[xdNode.symbolId];
		if (master) {
			ctx.addImport(`./${cleanFileName(master.widgetName, fixCase)}.dart`, true);
		} else {
			trace(`Didn't add import for component '${xdNode.name}' because the master was not found`);
		}
	}

	// Gather imports for interactions on nodes that reference other artboards
	let l = NodeUtils.getInteractionCount(xdNode);
	for (let i = 0; i < l; ++i) {
		let action = xdNode.triggeredInteractions[i].action;
		if (action.type !== "goToArtboard") {
			continue;
		}
		let artboard = ctx.getArtboardFromXdNode(action.destination);
		if (artboard) {
			ctx.addImport(`./${cleanFileName(artboard.widgetName, fixCase)}.dart`, true);
		} else {
			trace(`Didn't add import for destination artboard '${action.destination.name}' because it was not found. This is likely due to a duplicate name.`);
		}
	}
}

function combineShapes(node, ctx, aggressive = false) {
	// TODO: currently only subgroups set to "Combine Shapes" will be collapsed back into a
	// parent that is also set to "Combine Shapes". It would be nice if a CS parent could
	// combine in any subgroups if they are ONLY comprised of shapes.

	// Combines shapes into a single SVG output. In normal mode, it will only combine adjacent Path nodes.
	// In aggressive mode, it will combine Path & Container, and collapse groups that only contain those elements.
	if (!node || !node.children || node.children.length < 1 || node.hasCombinedShapes) {
		return;
	}
	node.hasCombinedShapes = true;
	let isFile = node instanceof Artboard || node instanceof Component;
	if (isFile) {
		ctx.pushWidget(node);
	}

	let inGroup = node instanceof Artboard || node instanceof Component || node instanceof Group;
	let shapeIndex,
	    shape = null,
	    kids = node.children;
	let maxCount = kids.length * 2; // TODO: GS: This is a temporary fail-safe, since infinite loops can take down XD.

	// This iterates one extra time with a null child to resolve the final shape:
	for (let i = 0; i <= kids.length; i++) {
		if (--maxCount < 0) {
			throw "infinite loop in combineShapes";
		}

		let child = kids[i];
		if (child && child.children) {
			let aggressiveGroup = aggressive || NodeUtils.getProp(child.xdNode, PropType.COMBINE_SHAPES);
			combineShapes(child, ctx, aggressiveGroup);

			let onlyChild = child.children.length === 1 && child.children[0];
			if (aggressiveGroup && inGroup && child instanceof Group && onlyChild instanceof Shape && !Shape.hasInteraction(child)) {
				// the only child was a Shape, so we can strip the group and leave just the shape.
				// this is currently necessary despite the check below, because the id changes when the xdNode changes:
				ctx.removeShapeData(onlyChild);
				// set the shape's xdNode to the group, so it uses its transform:
				onlyChild.xdNode = child.xdNode;
				// similarly copy the group's decorators onto the child:
				// TODO: GS: test this with a blend on the child & on the group.
				onlyChild.decorators = child.decorators;
				kids.splice(i, 1, onlyChild);
				child = onlyChild;
				// does not become the active shape because it has to be nested to retain transform.
			}
		}
		if (!shape && Shape.canAdd(child, aggressive)) {
			// start a new shape, the child will be added to it below.
			shape = new Shape(child.xdNode, ctx);
			shapeIndex = i;
		}
		if (shape && shape.add(child, aggressive)) {
			// Added.
			if (child instanceof Shape) {
				ctx.removeShapeData(child);
			}
		} else if (shape) {
			// Not able to add the child to the current shape, so end it.
			ctx.addShapeData(shape);
			kids.splice(shapeIndex, shape.count, shape);
			i -= shape.count - 1;
			shape = null;
			// If the child can be added, then iterate over it again, so it starts a new shape.
			// This typically happens because it had interactivity.
			if (Shape.canAdd(child, aggressive)) {
				i--;continue;
			}
		}
	}
	if (isFile) {
		ctx.popWidget();
	}
}

/***/ }),

/***/ "./src/core/project.js":
/*!*****************************!*\
  !*** ./src/core/project.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

const xd = __webpack_require__(/*! scenegraph */ "scenegraph");
const fs = __webpack_require__(/*! uxp */ "uxp").storage.localFileSystem;

const $ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
const { cleanFileName } = __webpack_require__(/*! ../utils/nameutils */ "./src/utils/nameutils.js");
const NodeUtils = __webpack_require__(/*! ../utils/nodeutils */ "./src/utils/nodeutils.js");
const PropType = __webpack_require__(/*! ./proptype */ "./src/core/proptype.js");
const { Pubspec } = __webpack_require__(/*! ./pubspec */ "./src/core/pubspec.js");
const { Log } = __webpack_require__(/*! ./log */ "./src/core/log.js");
const { projectAlert, prompt } = __webpack_require__(/*! ../ui/alert */ "./src/ui/alert.jsx");

class Project {
	constructor() {
		this.root = new _Folder(null, PropType.EXPORT_PATH, null);
		this.code = new _Folder(this.root, PropType.CODE_PATH, DefaultPath.CODE);
		this.images = new _Folder(this.root, PropType.IMAGE_PATH, DefaultPath.IMAGE);
		this.imagesX2 = new _Folder(this.images, null, DefaultPath.IMAGE_X2);
		this.imagesX3 = new _Folder(this.images, null, DefaultPath.IMAGE_X3);
	}

	async checkRoot(alert = true) {
		if (this.hasRoot) {
			return true;
		}
		if (alert) {
			let result = await projectAlert(this);
			if (!result) {
				return false;
			}
		}
		return await this.promptForRoot();
	}

	async validate(ctx) {
		// check for pubspec.yaml
		let str = await this.root.readFile("pubspec.yaml");
		if (!str) {
			ctx.log.warn(Project.PUBSPEC_WARNING, null);return false;
		}
		let pubspec = new Pubspec(str, ctx.log);
		pubspec.checkFonts(ctx.fonts);
		this._checkDependencies(pubspec);
		// Flutter asset directories always end in `/`:
		pubspec.checkAssets([this.images.path + '/']);
		return true;
	}

	async promptForRoot() {
		let f = await fs.getFolder();
		if (!f) {
			return false;
		}
		if (!(await this._verifyRoot(f))) {
			return false;
		}
		this.root._f = f;
		this.root._path = f.nativePath;
		NodeUtils.setProp(xd.root, this.root._prop, this.root._path);
		return true;
	}

	get hasRoot() {
		return !!this.root._f;
	}

	async _verifyRoot(f) {
		// we can't run this through _Folder, because we're verifying before we assign it to the folder.
		// this doesn't check images or fonts, since they may not have been set up yet.
		let file;
		try {
			file = await f.getEntry('pubspec.yaml');
		} catch (e) {}
		if (!file) {
			return prompt(Project.PUBSPEC_WARNING);
		}
		let log = new Log(),
		    str = await file.read();
		if (!str) {
			log.warn("Unable to read pubspec.yaml.", null);
		} else {
			this._checkDependencies(new Pubspec(str, log));
		}
		let results = log.getResults();
		str = results.errors.concat(results.warnings).reduce((s, o) => `${s}<div>  • ${o}</div>`, '');
		return !str || prompt(`Warnings were generated while validating your Flutter project.${str}`);
	}

	_checkDependencies(pubspec) {
		let result = pubspec.checkDependencies([Project.XD_PACKAGE]);
		// check null safe only if it's enabled & we found adobe_xd:
		if (result && !!NodeUtils.getProp(xd.root, PropType.NULL_SAFE)) {
			result = pubspec.checkNullSafe();
		}
		return result;
	}
}

class _Folder {
	constructor(parent, prop, defaultPath) {
		this._parent = parent;
		this._prop = prop;
		this._defaultPath = defaultPath;
		this._path = null;
		this._f = null; // UXP filesystem reference
	}

	async getFile(name, ctx, create = true) {
		let file = null,
		    f = await this._getF(ctx);
		if (!f) {
			return null;
		}
		let fixCase = !!NodeUtils.getProp(xd.root, PropType.NORMALIZE_NAME_CASE);
		name = cleanFileName(name, fixCase);
		if (create) {
			try {
				file = f.createFile(name, { overwrite: true });
			} catch (e) {
				ctx.log.error(`Unable to create file ('${this._getFullPath()}${name}'): ${e}`, null);
			}
		} else {
			try {
				file = await f.getEntry(name);
			} catch (e) {}
			if (file && !file.isFile) {
				file = null;
			}
		}
		return file;
	}

	async writeFile(name, content, ctx) {
		let file = await this.getFile(name, ctx);
		if (!file) {
			return false;
		}
		ctx.log.note(`Write file '${$.getRelPath(file, ctx)}'`);
		try {
			file.write(content);
		} catch (e) {
			return false;
		}
		return true;
	}

	async readFile(name, ctx) {
		let file = await this.getFile(name, ctx, false);
		if (!file) {
			return null;
		}
		return await file.read();
	}

	get path() {
		return this._getRelPath();
	}

	async _getF(ctx) {
		if (!this._parent) {
			return this._f;
		} // root

		let fullPath = this._getFullPath();
		if (this._f && fullPath === this._path) {
			return this._f;
		} // cached reference

		let parentF = await this._parent._getF(ctx);
		this._f = await this._getNestedF(parentF, this._getRelPath().split('/'), ctx);
		return this._f;
	}

	async _getNestedF(parentF, names, ctx) {
		if (!parentF) {
			return null;
		}
		let f,
		    err,
		    name = names.shift().substr(0, 160);
		// check if it already exists:
		try {
			f = await parentF.getEntry(name);
		} catch (e) {}
		if (!f) {
			// create it:
			try {
				f = await parentF.createFolder(name);
			} catch (e) {
				err = e;
			}
		} else if (!f.isFolder) {
			err = 'A file with that name already exists.'; // tested.
			f = null;
		}
		if (err) {
			ctx.log.error(`Unable to create folder ('${this._getFullPath()}'): ${err}`, null);
		}
		return names.length && f ? this._getNestedF(f, names) : f;
	}

	_hasRootPath() {
		if (!this._parent) {
			return !!this._f;
		}
		return this._parent._hasRootPath();
	}

	_getFullPath() {
		if (!this._parent) {
			return this._f && this._f.nativePath;
		} // root
		return this._parent._getFullPath() + this._getRelPath() + '/';
	}

	_getRelPath() {
		let path = this._prop && NodeUtils.getProp(xd.root, this._prop) || this._defaultPath;
		return $.cleanPath(path);
	}
}

Project.PUBSPEC_WARNING = 'A "pubspec.yaml" file was not found in the specified Flutter project folder.';
Project.XD_PACKAGE = 'adobe_xd';

let DefaultPath = Object.freeze({
	ROOT: "Select a project path.", // only used for placeholder UI
	CODE: "lib",
	IMAGE: "assets/images",
	IMAGE_X2: "2.0x",
	IMAGE_X3: "3.0x"
});

let project = new Project();

module.exports = {
	DefaultPath,
	project
};

/***/ }),

/***/ "./src/core/proptype.js":
/*!******************************!*\
  !*** ./src/core/proptype.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

module.exports = Object.freeze({
	// Project
	EXPORT_PATH: "exportPath",
	CODE_PATH: "codePath",
	IMAGE_PATH: "imagePath",
	WIDGET_PREFIX: "widgetPrefix",
	ENABLE_PROTOTYPE: "enablePrototype",
	RESOLUTION_AWARE: "resolutionAware",
	NULL_SAFE: "nullSafe",
	INCLUDE_NAME_COMMENTS: "includeNameComments",
	NORMALIZE_NAME_CASE: "normalizeNameCase",
	EXPORT_COLORS: "exportColors",
	COLORS_CLASS_NAME: "colorsClassName",
	EXPORT_CHAR_STYLES: "exportCharStyles",
	CHAR_STYLES_CLASS_NAME: "charStylesClassName",

	// Component / Artboard
	INCLUDE_IN_EXPORT_PROJECT: "addToExportAll",
	WIDGET_NAME: "widgetName",
	TAP_CALLBACK_NAME: "tapCallbackName",

	// Text
	FLUTTER_FONT: "flutterFont",
	TEXT_PARAM_NAME: "textParamName",
	COLOR_PARAM_NAME: "colorParamName",

	// Shapes
	IMAGE_FILL_NAME: "imageFillName",
	IMAGE_PARAM_NAME: "imageParamName",
	INCLUDE_IN_EXPORT_ALL_IMAGES: "includeInExportAllImages",

	// Groups
	COMBINE_SHAPES: "combineShapes",
	EXPORT_MODE: "exportMode",
	BUILD_METHOD_NAME: "buildMethodName",
	CUSTOM_CODE: "customCode",

	// Grid
	DATA_PARAM_NAME: "dataParamName",

	// Shared
	FLATTEN_TO_IMAGE: "flattenToImage"
});

/***/ }),

/***/ "./src/core/pubspec.js":
/*!*****************************!*\
  !*** ./src/core/pubspec.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

// NOTE: if we ever need to write YAML, we should evaluate https://www.npmjs.com/package/yaml
// because it may allow us to preserve comments.
const yaml = __webpack_require__(/*! ../lib/js-yaml */ "../lib/js-yaml");
const { SemVer } = __webpack_require__(/*! ./semver */ "./src/core/semver.js");

class Pubspec {
	constructor(str, log) {
		this.log = log;
		let err;
		try {
			this.yaml = yaml.load(str);
		} catch (e) {
			err = e;
		}
		if (!this.yaml) {
			this._warn(`Unable to parse pubspec.yaml${err ? ': ' + err.reason : ''}`);
		}
	}

	checkFonts(fonts) {
		if (!this.yaml) {
			return false;
		} // already threw a parsing error
		let list = this.yaml.flutter && this.yaml.flutter.fonts;
		let f = (val, o) => o.family === val;
		return this._checkListEntries(fonts, list, 'flutter/fonts', f);
	}

	checkDependencies(names) {
		if (!this.yaml) {
			return false;
		}
		return this._checkMapEntries(names, this.yaml.dependencies, 'dependencies');
	}

	checkAssets(paths) {
		if (!this.yaml) {
			return false;
		}
		let list = this.yaml.flutter && this.yaml.flutter.assets;
		return this._checkListEntries(paths, list, 'flutter/assets');
	}

	checkNullSafe() {
		let yaml = this.yaml,
		    errs = [];
		if (!yaml) {
			return null;
		} // already threw a parsing error

		let sdk = yaml.environment && yaml.environment.sdk;
		let sdkResult = SemVer.parse(sdk).requiresAtLeast("2.12.0");
		if (sdkResult === false) {
			errs.push("a minimum Dart SDK constraint of 2.12.0 or higher");
		}

		let adobe_xd = yaml.dependencies && yaml.dependencies.adobe_xd;
		let xdResult = !adobe_xd || !!adobe_xd.path ? null : SemVer.parse(adobe_xd).requiresAtLeast("2.0.0");
		if (xdResult === false) {
			errs.push("adobe_xd 2.0.0 or higher");
		}

		if (errs.length) {
			this._warn(`Null safety requires ${errs.join(" and ")}. Update your pubspec.yaml or disable 'Export Null Safe Code'.`);
		}
		return xdResult === false || sdkResult === false ? false : xdResult === true && sdkResult === true ? true : null;
	}

	_warn(str) {
		this.log && this.log.warn(str);
		return false;
	}

	_logMissingEntry(noun) {
		return this._warn(`Could not find ${noun} entry in pubspec.yaml.`);
	}

	_hasMissingEntries(values, noun) {
		if (!values || values.length === 0) {
			return true;
		}
		return this._warn(`Could not find ${noun} entry in pubspec.yaml for: ${values.join(', ')}.`);
	}

	_checkMapEntries(keys, map, noun) {
		// checks for the existence of entries with the specified key names
		if (!map) {
			return this._logMissingEntry(noun);
		}
		let missing = [];
		for (let i = 0, l = keys.length; i < l; i++) {
			if (!map[keys[i]]) {
				missing.push(keys[i]);
			}
		}
		return this._hasMissingEntries(missing, noun);
	}

	_checkListEntries(values, list, noun, comparisonFunction = null) {
		// checks for the existence of entries in list that match the specified values
		// if a comparisonFunction is provided, it is used to determine the match
		if (!list) {
			return this._logMissingEntry(noun);
		}
		let missing = [],
		    f = comparisonFunction || ((val, o) => val === o);
		for (let i = 0, l = values.length; i < l; i++) {
			if (!this._checkListEntry(values[i], list, f)) {
				missing.push(values[i]);
			}
		}
		return this._hasMissingEntries(missing, noun);
	}

	_checkListEntry(value, list, f) {
		for (let i = 0, l = list.length; i < l; i++) {
			let o = list[i];
			if (f(value, o)) {
				return true;
			}
		}
		return false;
	}
}

module.exports = {
	Pubspec
};

/***/ }),

/***/ "./src/core/semver.js":
/*!****************************!*\
  !*** ./src/core/semver.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

// Temporary test harness: https://jsfiddle.net/10Lra6jg/8/

class SemVer {
	constructor(low, high, isValid = true) {
		this._low = low;
		this._high = high;
		this._isValid = (low == null || low.isValid) && (high == null || high.isValid) && isValid !== false;
	}

	get isValid() {
		return this._isValid && !(this._high && !this._low) && ( // invalid if it has a high, but not a low
		this._high == null || this._low.isLessThan(this._high)); // valid if low < high
	}

	isSatisfiedBy(version) {
		version = Version.parse(version);
		if (!version || !version.isValid || !this.isValid) {
			return null;
		}
		if (this._low && this._low.compare(version) > 0) {
			return false;
		} // if lowVersion > version, return false
		if (this._high && this._high.compare(version) <= 0) {
			return false;
		} // if highVersion <= version, return false
		return true;
	}

	includesAtLeast(version) {
		version = Version.parse(version);
		if (!version || !version.isValid || !this.isValid) {
			return null;
		}
		return this._high == null || this._high.compare(version) > 0; // no upper constraint or it's >= version
	}

	requiresAtLeast(version) {
		version = Version.parse(version);
		if (!version || !version.isValid || !this.isValid) {
			return null;
		}
		return this._low.compare(version) >= 0; // low is >= version
	}
}

SemVer.getInvalid = function () {
	let o = new SemVer(null, null, false);
	o.isInvalid = true;
	return o;
};

SemVer.parse = function (str) {
	if (str === null || str === "" || /any/i.test(str)) {
		return new SemVer(null, null);
	}
	let v,
	    o = /^[\s'"]*([^'"]+)[\s'"]*$/.exec(str);
	str = o && o[1];
	if (!str) {
		return false;
	}
	if (str.charAt(0) === "^") {
		// Caret syntax: ^1.2.3
		v = Version.parse(str.slice(1));
		return new SemVer(v, v.major === 0 ? new Version(0, v.minor + 1, 0) : new Version(v.major + 1, 0, 0));
	}
	if (/[0-9]/.test(str.charAt(0))) {
		// Concrete version: 1.2.3
		if (/\s/.test(str)) {
			return SemVer.getInvalid();
		} // more than one constraint
		v = Version.parse(str);
		return new SemVer(v, new Version(v.major, v.minor, v.patch + 1));
	}
	// comparative: >=1.2.3 <2.0.0
	let low = null,
	    high = null;
	while (true) {
		let re = /^\s*((?:<|>)?=?)\s*([0-9.]+)/,
		    o = re.exec(str);
		if (!o) {
			break;
		}
		str = str.slice(o[0].length);
		let constraint = o[1],
		    v = Version.parse(o[2]);
		if (!v.isValid || !constraint || !o[2]) {
			return SemVer.getInvalid();
		}
		if (constraint.charAt(0) === ">") {
			if (low) {
				return SemVer.getInvalid();
			} // already have a lower constraint
			if (constraint.charAt(1) !== "=") {
				v.patch++;
			}
			low = v;
		} else {
			if (high) {
				return SemVer.getInvalid();
			} // already have a higher constraint
			if (constraint.charAt(1) === "=") {
				v.patch++;
			}
			high = v;
		}
	}
	if (!low & !high) {
		return SemVer.getInvalid();
	} // unable to parse any constraints
	return new SemVer(low, high);
};

class Version {
	constructor(major, minor, patch, build, label) {
		this.major = major;
		this.minor = minor;
		this.patch = patch;
		this.build = build || null;
		this.label = label || null;
	}

	get isValid() {
		return this._isValid(this.major) && this._isValid(this.minor) && this._isValid(this.patch);
	}

	_isValid(val) {
		return !(isNaN(val) || val == null || val !== (val | 0));
	}

	isEqual(v) {
		return this.compare(v) === 0;
	}
	isGreaterThan(v) {
		return this.compare(v) > 0;
	}
	isLessThan(v) {
		return this.compare(v) < 0;
	}

	compare(v) {
		// returns +1 if greater, 0 if equal, -1 if less
		let o = this;
		if (o.major > v.major) {
			return 1;
		} else if (o.major < v.major) {
			return -1;
		}
		if (o.minor > v.minor) {
			return 1;
		} else if (o.minor < v.minor) {
			return -1;
		}
		if (o.patch > v.patch) {
			return 1;
		} else if (o.patch < v.patch) {
			return -1;
		}
		return 0; // equal
	}

	get versionString() {
		return `${this.major}.${this.minor}.${this.patch}`;
	}

	get fullVersionString() {
		return this.versionString + (this.build ? '+' + this.build : '') + (this.label ? '-' + this.label : '');
	}

	toString() {
		return `Version[${this.fullVersionString}]`;
	}
}

Version.parse = function (str) {
	if (str instanceof Version) {
		return str;
	}
	let o = /\s*v?([^-+\s]+)\s*(?:\+([^-]+))?\s*-?\s*(.*)/.exec(str);
	if (!o || o[1] == null) {
		return new Version();
	}
	let version = o[1],
	    build = o[2],
	    label = o[3];
	let parts = version && version.split(".").map(s => parseInt(s));
	return new Version(parts[0], parts[1], parts[2], build, label);
};

module.exports = {
	Version, SemVer
};

/***/ }),

/***/ "./src/ui/alert.jsx":
/*!**************************!*\
  !*** ./src/ui/alert.jsx ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

const { h, render, Component, Fragment } = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");
const clipboard = __webpack_require__(/*! clipboard */ "clipboard");

const iconError = __webpack_require__(/*! ./assets/icon-error.png */ "./src/ui/assets/icon-error.png");
const iconWarning = __webpack_require__(/*! ./assets/icon-warning.png */ "./src/ui/assets/icon-warning.png");
const iconPlugin = __webpack_require__(/*! ./assets/icon@2x.png */ "./src/ui/assets/icon@2x.png");

// docs for dialog UI: https://adobexdplatform.com/plugin-docs/reference/ui/dialogs/

let dialog, callback;

function closeDialog(value, e) {
	e && e.preventDefault();
	callback && callback(value, dialog);
	dialog && dialog.close(value);
	dialog = callback = null;
}

async function openDialog(contents, cb = null) {
	// returns true if the user clicked the cta
	dialog = document.createElement('dialog');
	callback = cb;
	render(contents, dialog);
	let value = await document.body.appendChild(dialog).showModal();
	if (value === "reasonCanceled") {
		value = null;
	} // esc key pressed
	return value;
}

function Chrome(title, content, cancel, cta = 'OK') {
	// currently returns true if the cta is clicked, false if cancel is clicked
	// callback is called with the return value before the dialog is closed, to maintain edit privileges
	return h(
		"form",
		{ method: "dialog", onSubmit: e => closeDialog(true, e) },
		title && h(
			Fragment,
			null,
			h(
				"h1",
				null,
				h("img", { "class": "icon", src: iconPlugin.default }),
				h(
					"span",
					null,
					title
				)
			),
			h("hr", null)
		),
		content,
		h(
			"footer",
			null,
			cancel && h(
				"button",
				{ onClick: e => closeDialog(false, e), type: "reset", "uxp-variant": "primary" },
				cancel
			),
			h(
				"button",
				{ type: "submit", "uxp-variant": "cta", "uxp-selected": "true", autofocus: "autofocus" },
				cta
			)
		)
	);
}

async function alert(msg, title = null, closeLabel = 'OK') {
	await openDialog(Chrome(title, h("p", { dangerouslySetInnerHTML: { __html: msg } }), null, closeLabel));
}

async function prompt(msg, title = null, cancelLabel = 'Cancel', ctaLabel = 'Continue') {
	// note: html injection is to let us show lists.
	return await openDialog(Chrome(title, h("p", { dangerouslySetInnerHTML: { __html: msg } }), cancelLabel, ctaLabel));
}

async function projectAlert(project) {
	return await openDialog(Chrome('Set a Flutter Project Folder', h(
		Fragment,
		null,
		h(
			"p",
			{ "class": "text" },
			"Before exporting, you must select the Flutter project folder to export into."
		),
		h(
			"p",
			{ "class": "text-information" },
			"Due to current restrictions in Adobe XD, you will have to do this each time you open this file."
		)
	), 'Cancel', 'Continue'));
}

async function resultsAlert(results) {
	//results.errors = ["This is an error!"]; // for testing since we throw so few errors.
	return await openDialog(Chrome(null, // each category creates it's own header.
	h(
		Fragment,
		null,
		getResultsCategory(results.errors, "Error", iconError),
		getResultsCategory(results.warnings, "Warning", iconWarning)
	), 'Copy To Clipboard', 'Close'), (v, _) => v === false && copyResults(results));
}

async function codeEditorAlert(code, handler) {
	return await openDialog(Chrome("Custom Code", h(
		Fragment,
		null,
		h(
			"p",
			{ "class": "text" },
			"Paste code here without a trailing semicolon or comma. Read the Custom Code section of the ",
			h(
				"a",
				{ href: "https://github.com/AdobeXD/xd-to-flutter-plugin/blob/master/README.md" },
				"README"
			),
			" for more info."
		),
		h(
			"p",
			{ "class": "text-information" },
			"Unfortunately, XD plugin limitations prevent showing a proper code editor here."
		),
		h("textarea", { "class": "code-editor", id: "editor", value: code || '', onKeyDown: o => o.preventDefault() })
	), 'Cancel', 'Save'), (v, d) => v && handler(d.querySelector('#editor').value));
}

function copyResults(results) {
	let str = getCategoryString(results.errors, "Error") + '\n\n' + getCategoryString(results.warnings, "Warning");
	clipboard.copyText(str.trim());
}

function getResultsCategory(list, title, icon) {
	let l = list.length;
	return !l ? null : h(
		Fragment,
		null,
		h(
			"h1",
			null,
			h("img", { src: icon.default, alt: "icon", "class": "result-icon" }),
			getCategoryTitle(list, title)
		),
		h(
			"div",
			{ "class": "list" },
			list.map(o => h(
				"div",
				null,
				o.toString()
			))
		)
	);
}

function getCategoryString(list, title) {
	if (list.length === 0) {
		return '';
	}
	let str = getCategoryTitle(list, title) + ':';
	return list.reduce((s, o) => s + '\n' + o.toString(), str);
}
function getCategoryTitle(list, title) {
	let l = list.length;
	return l + ' ' + title + (l > 1 ? 's' : '');
}

module.exports = { alert, prompt, projectAlert, resultsAlert, codeEditorAlert };

/***/ }),

/***/ "./src/ui/assets/bg-transparent.png":
/*!******************************************!*\
  !*** ./src/ui/assets/bg-transparent.png ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "images/bg-transparent.png");

/***/ }),

/***/ "./src/ui/assets/icon-edit.png":
/*!*************************************!*\
  !*** ./src/ui/assets/icon-edit.png ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "images/icon-edit.png");

/***/ }),

/***/ "./src/ui/assets/icon-error.png":
/*!**************************************!*\
  !*** ./src/ui/assets/icon-error.png ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "images/icon-error.png");

/***/ }),

/***/ "./src/ui/assets/icon-folder.png":
/*!***************************************!*\
  !*** ./src/ui/assets/icon-folder.png ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "images/icon-folder.png");

/***/ }),

/***/ "./src/ui/assets/icon-info.png":
/*!*************************************!*\
  !*** ./src/ui/assets/icon-info.png ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "images/icon-info.png");

/***/ }),

/***/ "./src/ui/assets/icon-warning.png":
/*!****************************************!*\
  !*** ./src/ui/assets/icon-warning.png ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "images/icon-warning.png");

/***/ }),

/***/ "./src/ui/assets/icon@1x.png":
/*!***********************************!*\
  !*** ./src/ui/assets/icon@1x.png ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "images/icon@1x.png");

/***/ }),

/***/ "./src/ui/assets/icon@2x.png":
/*!***********************************!*\
  !*** ./src/ui/assets/icon@2x.png ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "images/icon@2x.png");

/***/ }),

/***/ "./src/ui/formutils.jsx":
/*!******************************!*\
  !*** ./src/ui/formutils.jsx ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

const { editDocument } = __webpack_require__(/*! application */ "application");
const { h, Fragment } = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const NodeUtils = __webpack_require__(/*! ../utils/nodeutils */ "./src/utils/nodeutils.js");
const $ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
const { cleanDartName } = __webpack_require__(/*! ../utils/nameutils */ "./src/utils/nameutils.js");
const PropType = __webpack_require__(/*! ../core/proptype */ "./src/core/proptype.js");

function initInputHandlers(component) {
    // Inject a button handler, that passes the current component to the shared handler to retain scope
    component.handleInput = e => handleNodeInputChanged(component, e);

    component.handleBlurAsCleanPath = e => handleBlur(component, e, $.cleanPath);
    component.handleBlurAsClassName = e => handleBlur(component, e, cleanDartName);
    component.handleBlurAsCustomCode = e => handleBlur(component, e, $.cleanCustomCode);
};

//Handles any input changes, and writes them into the node metadata
function handleNodeInputChanged(c, event) {
    let target = event.target,
        name = target.name || target.id;
    let value = target.type === 'checkbox' ? !c.state[name] : target.value;

    editDocument({ editLabel: "Updated Flutter Data" }, function (selection) {
        if (name === PropType.FLUTTER_FONT) {
            NodeUtils.setFlutterFont(c.props.node.fontFamily, value);
        } else if (name === PropType.IMAGE_FILL_NAME) {
            NodeUtils.setImageName(c.props.node, value);
        } else {
            // Update component state
            let state = c.state;
            state[name] = value;
            // Inject latest component state, into the node's metadata
            let node = c.props.node;
            //NodeUtils.setProp(node, name, value);
            NodeUtils.setState(node, state);
        }
    });
    c.setState({ [name]: value });
}

function handleBlur(c, event, cleanFxn) {
    let target = event.target,
        name = target.name || target.id;
    let value = cleanFxn(c.state[name]);
    let node = c.props.node;

    editDocument({ editLabel: "Updated Flutter Data" }, function (_) {
        let state = c.state;
        state[name] = value;
        //NodeUtils.setProp(node, name, value);
        NodeUtils.setState(node, state);
    });

    c.setState({ [name]: value });
}

function TextInputWithLabel(props) {
    return h(
        Fragment,
        null,
        Label(props),
        TextInput(props)
    );
}

function TextInput(props) {
    return h("input", { type: "text", "class": "settings__text-input",
        name: props.name,
        onblur: props.onBlur,
        placeholder: props.placeholder,
        onInput: props.handleInput,
        readonly: props.readonly,
        value: props.value || props.name && props.state[props.name] || ''
    });
}

function TextArea(props) {
    // textarea elements don't pass their name through events, so add id too:
    return h("textarea", { "class": "settings__textarea",
        id: props.name,
        name: props.name,
        onblur: props.onBlur,
        placeholder: props.placeholder,
        onInput: props.handleInput,
        readonly: props.readonly,
        value: props.value || props.name && props.state[props.name] || ''
    });
}

function Label(props) {
    return h(
        "label",
        { "class": "label" },
        props.label
    );
}

function Checkbox(props) {
    return h(
        "label",
        { "class": "settings__checkbox-label" },
        h("input", { type: "checkbox",
            name: props.name,
            onClick: props.handleInput,
            checked: props.state[props.name] || false
        }),
        h(
            "span",
            null,
            props.label
        )
    );
}

function Select(props) {
    let val = props.state[props.name],
        opts = props.options;
    if (val == null && props.default) {
        val = props.default === true ? opts[0].id : props.default;
    }
    // select elements don't pass their name through onChange events, so add id too:
    return h(
        "select",
        { "class": "settings__select",
            name: props.name,
            id: props.name,
            onChange: props.handleInput,
            value: val },
        opts.map(o => h(
            "option",
            { value: o.id, type: "option" },
            o.label || o.id
        ))
    );
}

module.exports = {
    initInputHandlers,
    TextInputWithLabel,
    TextInput,
    TextArea,
    Label,
    Checkbox,
    Select
};

/***/ }),

/***/ "./src/ui/main.jsx":
/*!*************************!*\
  !*** ./src/ui/main.jsx ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

const { h, render, Component } = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");
const { editDocument } = __webpack_require__(/*! application */ "application");
const os = __webpack_require__(/*! os */ "os");

const Preview = __webpack_require__(/*! ./preview */ "./src/ui/preview.jsx");
const Results = __webpack_require__(/*! ./results */ "./src/ui/results.jsx");
const Settings = __webpack_require__(/*! ./settings */ "./src/ui/settings.jsx");
const NodeType = __webpack_require__(/*! ../core/nodetype */ "./src/core/nodetype.js");
const nodeutils = __webpack_require__(/*! ../utils/nodeutils */ "./src/utils/nodeutils.js");
__webpack_require__(/*! ./styles.styl */ "./src/ui/styles.styl");

const xd = __webpack_require__(/*! scenegraph */ "scenegraph");
const image_export = __webpack_require__(/*! ../core/image_export */ "./src/core/image_export.js");
const dart_export = __webpack_require__(/*! ../core/dart_export */ "./src/core/dart_export.js");

const debug = __webpack_require__(/*! ../utils/debug */ "./src/utils/debug.js");
const trace = debug.trace;

class FlutterPanel extends Component {
	constructor(props) {
		super(props);
		this.state = { context: null };
		props.notifier.listen(o => this.updateResults(o));
	}

	exportSelectedItem() {
		editDocument({ editLabel: "Export widget" }, async (selected, root) => {
			this.updateResults((await dart_export.exportSelected(selected, root)));
		});
	}

	copySelectedItem() {
		editDocument({ editLabel: "Copy selected item to clipboard" }, async (selected, root) => {
			this.updateResults((await dart_export.copySelected(selected, root)));
		});
	}

	exportAll() {
		editDocument({ editLabel: "Export all widgets" }, async (selected, root) => {
			this.updateResults((await dart_export.exportAll(selected, root)));
		});
	}

	exportImage() {
		editDocument({ editLabel: "Export image" }, async (selected, root) => {
			this.updateResults((await image_export.exportImage(selected, root)));
		});
	}

	exportAllImages() {
		editDocument({ editLabel: "Export all images" }, async (selected, root) => {
			this.updateResults((await image_export.exportAllImages(selected, root)));
		});
	}

	updateResults(ctx) {
		this.setState({ context: ctx });
		if (!ctx) {
			trace("NO RESULT RETURNED!");return;
		}
		if (!ctx.log) {
			trace("UNEXPECTED RESULT OBJECT!");return;
		}
	}

	render(props, state) {
		let multi = !!(props.selected && props.selected.length > 1);
		let xdNode = !multi && props.selected && props.selected[0];
		let type = NodeType.getType(xdNode);
		let isRoot = type === NodeType.ROOT;
		let isWidget = nodeutils.isWidget(xdNode);
		let isCopyable = type !== NodeType.ROOT && type !== NodeType.WIDGET;
		let hasImage = xdNode && xdNode.fill && xdNode.fill instanceof xd.ImageFill;
		let component = nodeutils.getContainingComponent(xdNode, true);

		return h(
			"div",
			{ id: "panel-container", "data-platform": os.platform() },
			h(
				"div",
				{ "class": "options-container" },
				!isRoot || multi ? h(Preview, { node: xdNode }) : null,
				h(Settings, { node: isRoot ? xd.root : xdNode, component: component, multi: multi })
			),
			h(
				"div",
				{ "class": "actions-container" },
				h(Results, { context: state.context, node: xdNode }),
				h("span", { "class": "separator" }),
				hasImage ? h(
					"button",
					{ "uxp-variant": "primary", onClick: () => this.exportImage() },
					"Export Image"
				) : null,
				isCopyable ? h(
					"button",
					{ "uxp-variant": "primary", onClick: () => this.copySelectedItem() },
					"Copy Selected"
				) : null,
				isWidget ? h(
					"button",
					{ "uxp-variant": "primary", onClick: () => this.exportSelectedItem() },
					"Export Widget"
				) : null,
				isRoot ? h(
					"button",
					{ "uxp-variant": "primary", onClick: () => this.exportAllImages() },
					"Export All Images"
				) : null,
				h(
					"button",
					{ "uxp-variant": "cta", onClick: () => this.exportAll() },
					"Export All Widgets"
				)
			)
		);
	}
}

class Notifier {
	listen(f) {
		this.f = f;
	}
	notify(o) {
		this.f && this.f(o);
	}
}

let panelHolder,
    notifier = new Notifier();

function create() {
	if (panelHolder == null) {
		panelHolder = document.createElement("div");
		update();
	}
	return panelHolder;
}

function show(event) {
	if (!panelHolder) event.node.appendChild(create());
}

function update(selection) {
	let items = selection && selection.items;
	render(h(FlutterPanel, { key: "panel", selected: items, notifier: notifier }), panelHolder);
}

async function exportAll(selection, root) {
	notifier.notify((await dart_export.exportAll(selection, root)));
}

async function exportSelected(selection, root) {
	notifier.notify((await dart_export.exportSelected(selection, root)));
}

async function copySelected(selection, root) {
	notifier.notify((await dart_export.copySelected(selection, root)));
}

module.exports = {
	panels: {
		flutterPanel: {
			show,
			update
		}
	},
	commands: {
		exportAll,
		exportSelected,
		copySelected,

		// debug menu items, enable in manifest.json:
		_testDartStyle: debug._testDartStyle,
		_printdumpNodePluginData: debug._printdumpNodePluginData,
		_imageFlipTest: debug._imageFlipTest,
		_dumpTransformData: debug._dumpTransformData,
		_dumpLayoutData: debug._dumpLayoutData
	}

};

/***/ }),

/***/ "./src/ui/preview.jsx":
/*!****************************!*\
  !*** ./src/ui/preview.jsx ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

const { h, Component, Fragment } = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");
const NodeType = __webpack_require__(/*! ../core/nodetype */ "./src/core/nodetype.js");
const render_preview = __webpack_require__(/*! ./render_preview */ "./src/ui/render_preview.js");
const { trace } = __webpack_require__(/*! ../utils/debug */ "./src/utils/debug.js");

class Preview extends Component {
	constructor(props) {
		super(props);
		this.state = { rendition: '' };
	}

	componentDidMount() {
		this.renderPreview(this.props.node);
	}

	shouldComponentUpdate(nextProps, nextState) {
		// render new preview only if the props changed:
		if (this.props !== nextProps) {
			this.renderPreview(nextProps.node);
		}
		return true;
	}

	async renderPreview(node) {
		try {
			this.setState({ rendition: await render_preview.getPreview(node) });
		} catch (e) {
			trace('error rendering preview', e);
		}
	}

	render() {
		let isMultiple = !this.props.node;
		let noPreview = isMultiple || this.state.rendition === null;
		let label = isMultiple ? 'MULTIPLE' : NodeType.getXDLabel(this.props.node);
		return h(
			'div',
			{ 'class': 'preview-container' },
			h(
				'div',
				{ 'class': `preview-canvas${noPreview ? ' multi' : ' '}` },
				h('img', { 'class': 'preview-img', src: this.state.rendition, alt: 'preview' }),
				h(
					'div',
					{ 'class': 'preview-no label' },
					'PREVIEW NOT AVAILABLE'
				)
			),
			h(
				'span',
				{ 'class': 'label' },
				'SELECTION: ',
				h(
					'b',
					null,
					label.toUpperCase()
				),
				' '
			),
			h('span', { 'class': 'separator' })
		);
	}
}

module.exports = Preview;

/***/ }),

/***/ "./src/ui/render_preview.js":
/*!**********************************!*\
  !*** ./src/ui/render_preview.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

const app = __webpack_require__(/*! application */ "application");
const fs = __webpack_require__(/*! uxp */ "uxp").storage;
const $ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");

let previewFile;

function initPreview() {
  fs.localFileSystem.getTemporaryFolder().then(folder => {
    folder.createFile('XD_Flutter_preview.png', { overwrite: true }).then(f => {
      previewFile = f;
    });
  });
}
initPreview();

async function getPreview(node, retryCount = 0) {
  // return null when something goes wrong, empty string for an empty preview
  if (!node) {
    return '';
  }
  if (!previewFile) {
    return null;
  }
  let bounds = node.localBounds;
  let scale = Math.min(20, 200 / bounds.height, 400 / bounds.width) * 3; // for hi-dpi
  try {
    await app.createRenditions([{
      node, scale,
      outputFile: previewFile,
      type: app.RenditionType.PNG
    }]);
  } catch (e) {
    if (retryCount > 0) {
      await $.delay(100);
      return await getPreview(node, retryCount - 1);
    } else {
      return null;
    }
  }
  const data = await previewFile.read({ format: fs.formats.binary });
  return 'data:image/png;base64,' + base64ArrayBuffer(data);
}
exports.getPreview = getPreview;

function base64ArrayBuffer(arrayBuffer) {
  let base64 = '';
  const encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  const bytes = new Uint8Array(arrayBuffer);
  const byteLength = bytes.byteLength;
  const byteRemainder = byteLength % 3;
  const mainLength = byteLength - byteRemainder;

  let a, b, c, d;
  let chunk;

  // Main loop deals with bytes in chunks of 3
  for (var i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2];

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
    d = chunk & 63; // 63       = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder == 1) {
    chunk = bytes[mainLength];

    a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

    // Set the 4 least significant bits to zero
    b = (chunk & 3) << 4; // 3   = 2^2 - 1

    base64 += encodings[a] + encodings[b] + '==';
  } else if (byteRemainder == 2) {
    chunk = bytes[mainLength] << 8 | bytes[mainLength + 1];

    a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15) << 2; // 15    = 2^4 - 1

    base64 += encodings[a] + encodings[b] + encodings[c] + '=';
  }

  return base64;
}

/***/ }),

/***/ "./src/ui/results.jsx":
/*!****************************!*\
  !*** ./src/ui/results.jsx ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

const { h, Component, Fragment } = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");
const { resultsAlert } = __webpack_require__(/*! ./alert */ "./src/ui/alert.jsx");
const version = __webpack_require__(/*! ../version */ "./src/version.js");
const { shell } = __webpack_require__(/*! uxp */ "uxp");
const { HELP_URL } = __webpack_require__(/*! ../core/constants */ "./src/core/constants.js");

const iconError = __webpack_require__(/*! ./assets/icon-error.png */ "./src/ui/assets/icon-error.png");

class Results extends Component {
	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps) {
		if (this.props.node !== nextProps.node) {
			this.setState({ results: null });
			return true;
		}
		if (this.props.context === nextProps.context) return false;
		if (nextProps.context && nextProps.context.log) {
			this.setState({ results: nextProps.context.log.getResults() });
		}
	}

	render(props, state) {
		if (!version.xdVersionOk) {
			return h(
				'div',
				{ 'class': 'results-container' },
				h(
					'div',
					{ 'class': 'version alert' },
					`Version ${version.xdVersionRequired}+ of Adobe XD is required (v${version.version})`
				)
			);
		}
		if (!props.context || !state.results) {
			return h(
				'div',
				{ 'class': 'results-container' },
				h(
					'span',
					{ 'class': `version${version.debug ? ' alert' : ''}` },
					`${version.label} v${version.version}`
				),
				h(
					'a',
					{ 'class': 'help', href: HELP_URL },
					'Need help?'
				)
			);
		}
		if (!props.context.log) {
			return h(
				'p',
				null,
				'UNEXPECTED RESULT OBJECT!'
			);
		}

		let results = state.results,
		    errorMsg = this.getErrorMsg(results);
		return h(
			Fragment,
			null,
			results && h(
				'div',
				{ 'class': 'results-container' },
				props.context.resultMessage,
				errorMsg ? ': ' : '.',
				errorMsg
			)
		);
	}

	getErrorMsg(results) {
		if (!results) {
			return null;
		}
		let count = results.errors.length,
		    hasErrors = count > 0;
		let noun = count ? 'error' : 'warning';
		if (!count) {
			count = results.warnings.length;
		}
		let s = count > 1 ? 's' : '';
		return !count ? null : h(
			'a',
			{ onClick: () => resultsAlert(results) },
			hasErrors ? h('img', { src: iconError.default }) : null,
			`${count} ${noun}${s}`
		);
	}
}

module.exports = Results;

/***/ }),

/***/ "./src/ui/settings.jsx":
/*!*****************************!*\
  !*** ./src/ui/settings.jsx ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

const xd = __webpack_require__(/*! scenegraph */ "scenegraph");
const { editDocument } = __webpack_require__(/*! application */ "application");
const { h, Component, Fragment } = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const $ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
const { project } = __webpack_require__(/*! ../core/project */ "./src/core/project.js");
const NodeUtils = __webpack_require__(/*! ../utils/nodeutils */ "./src/utils/nodeutils.js");
const { initInputHandlers, TextInputWithLabel, Label, TextInput, TextArea, Checkbox, Select } = __webpack_require__(/*! ./formutils */ "./src/ui/formutils.jsx");

const NodeType = __webpack_require__(/*! ../core/nodetype */ "./src/core/nodetype.js");
const PropType = __webpack_require__(/*! ../core/proptype */ "./src/core/proptype.js");
const { DEFAULT_PLUGIN_DATA, DEFAULT_COLORS_CLASS_NAME, DEFAULT_CHAR_STYLES_CLASS_NAME } = __webpack_require__(/*! ../core/constants */ "./src/core/constants.js");
const { DefaultPath } = __webpack_require__(/*! ../core/project */ "./src/core/project.js");
const Alert = __webpack_require__(/*! ./alert */ "./src/ui/alert.jsx");

const iconFolder = __webpack_require__(/*! ./assets/icon-folder.png */ "./src/ui/assets/icon-folder.png");
const iconEdit = __webpack_require__(/*! ./assets/icon-edit.png */ "./src/ui/assets/icon-edit.png");
const iconWarning = __webpack_require__(/*! ./assets/icon-warning.png */ "./src/ui/assets/icon-warning.png");
const iconInfo = __webpack_require__(/*! ./assets/icon-info.png */ "./src/ui/assets/icon-info.png");

const { ExportMode, ExportModeOptions, DEFAULT_CUSTOM_CODE } = __webpack_require__(/*! ../core/constants */ "./src/core/constants.js");

function Settings(props) {
    let type = NodeType.getType(props.node);
    if (props.multi) {
        return h(
            "div",
            null,
            "Select a single element to modify settings."
        );
    }
    if (isComponentInstance(props) && !hasImage(props)) {
        return h(ComponentWarning, _extends({ key: props.node.guid }, props));
    }
    switch (type) {
        case NodeType.TEXT:
            return h(TextSettings, _extends({ key: props.node.guid }, props));
        case NodeType.GROUP:
            return h(GroupSettings, _extends({ key: props.node.guid }, props));
        case NodeType.GRID:
            return h(GridSettings, _extends({ key: props.node.guid }, props));
        case NodeType.WIDGET:
            return h(WidgetSettings, _extends({ key: props.node.guid }, props));
        case NodeType.SHAPE:
            return h(ShapeSettings, _extends({ key: props.node.guid }, props));
        default:
            return h(ProjectSettings, props);
    }
}
module.exports = Settings;

function isComponentInstance(props) {
    return props.component && !props.component.isMaster;
}

function hasImage(props) {
    return props.node.fill && props.node.fill instanceof xd.ImageFill;
}

class ComponentWarning extends Component {
    constructor(props) {
        super(props);
    }

    render(_, state) {
        return h(
            "div",
            { "class": "settings-container" },
            getWarning(this.props)
        );
    }
}

function getWarning(props, some = false) {
    let isComponent = props.node === props.component;
    let type = isComponent ? 'element' : NodeType.getXDLabel(props.node);
    return h(
        "div",
        { "class": "warning" },
        some ? h("span", { "class": "separator" }) : null,
        h(
            "div",
            { "class": "warning-row" },
            h("img", { src: iconWarning.default, alt: "icon", "class": "icon" }),
            h(
                "div",
                null,
                "EDITING COMPONENT"
            )
        ),
        h(
            "div",
            { "class": "warning-text" },
            h(
                "p",
                null,
                "The selected ",
                type,
                " is ",
                isComponent ? '' : 'part of',
                " a component instance."
            ),
            h(
                "p",
                null,
                "To modify ",
                some ? 'some ' : '',
                "settings on this ",
                type,
                " you must edit the Master Component."
            ),
            h(
                "p",
                null,
                "Press ",
                h(
                    "b",
                    null,
                    $.getCmdKeyStr(),
                    "-Shift-K"
                ),
                " to locate the Master Component."
            )
        )
    );
}

class ProjectSettings extends Component {
    constructor(props) {
        super(props);
        initInputHandlers(this);
        this.state = xd.root.pluginData || DEFAULT_PLUGIN_DATA;
    }

    setProjectFolder() {
        editDocument(_ => project.promptForRoot());
    }

    shouldComponentUpdate() {
        this.setState(NodeUtils.getState(xd.root));
    }

    render(_, state) {
        return h(
            "div",
            { "class": "settings-container" },
            h(Label, { label: "FLUTTER PROJECT" }),
            h(
                "div",
                { "class": "project-row" },
                h(TextInput, { name: PropType.EXPORT_PATH, placeholder: DefaultPath.ROOT, state: state, handleInput: this.handleInput, readonly: true }),
                h(
                    "button",
                    { "uxp-variant": "action", onClick: this.setProjectFolder },
                    h("img", { src: iconFolder.default, alt: "icon-folder" })
                )
            ),
            h(TextInputWithLabel, {
                name: PropType.CODE_PATH,
                label: "CODE PATH",
                placeholder: DefaultPath.CODE,
                state: state,
                handleInput: this.handleInput,
                onBlur: this.handleBlurAsCleanPath }),
            h(TextInputWithLabel, {
                name: PropType.IMAGE_PATH,
                label: "IMAGE PATH",
                placeholder: DefaultPath.IMAGE,
                state: state,
                handleInput: this.handleInput,
                onBlur: this.handleBlurAsCleanPath }),
            h(TextInputWithLabel, {
                name: PropType.WIDGET_PREFIX,
                label: "WIDGET NAME PREFIX",
                placeholder: "",
                state: state,
                handleInput: this.handleInput,
                onBlur: this.handleBlurAsClassName }),
            h("span", { "class": "separator" }),
            h(
                "label",
                { "class": "label" },
                "SETTINGS"
            ),
            h(
                "div",
                { "class": "wrapping-row" },
                h(Checkbox, {
                    name: PropType.ENABLE_PROTOTYPE,
                    label: "Prototype Interactions",
                    state: state,
                    handleInput: this.handleInput }),
                h(Checkbox, {
                    name: PropType.RESOLUTION_AWARE,
                    label: "Resolution Aware Images",
                    state: state,
                    handleInput: this.handleInput }),
                h(Checkbox, {
                    name: PropType.NULL_SAFE,
                    label: "Export Null Safe Code",
                    state: state,
                    handleInput: this.handleInput }),
                h(Checkbox, {
                    name: PropType.NORMALIZE_NAME_CASE,
                    label: "Normalize Names",
                    state: state,
                    handleInput: this.handleInput }),
                h(Checkbox, {
                    name: PropType.INCLUDE_NAME_COMMENTS,
                    label: "Layer Name Comments",
                    state: state,
                    handleInput: this.handleInput })
            ),
            h("span", { "class": "separator" }),
            h(
                "label",
                { "class": "label" },
                "EXPORT ASSETS"
            ),
            h(Checkbox, {
                name: PropType.EXPORT_COLORS,
                label: "Colors",
                state: state,
                handleInput: this.handleInput }),
            !state[PropType.EXPORT_COLORS] ? null : h(TextInput, {
                name: PropType.COLORS_CLASS_NAME,
                placeholder: DEFAULT_COLORS_CLASS_NAME,
                state: state,
                handleInput: this.handleInput,
                onBlur: this.handleBlurAsClassName }),
            h(Checkbox, {
                name: PropType.EXPORT_CHAR_STYLES,
                label: "Character Styles",
                state: state,
                handleInput: this.handleInput }),
            !state[PropType.EXPORT_CHAR_STYLES] ? null : h(TextInput, {
                name: PropType.CHAR_STYLES_CLASS_NAME,
                placeholder: DEFAULT_CHAR_STYLES_CLASS_NAME,
                state: state,
                handleInput: this.handleInput,
                onBlur: this.handleBlurAsClassName })
        );
    }
}

class TextSettings extends Component {
    constructor(props) {
        super(props);
        initInputHandlers(this);
        let state = this.props.node.pluginData || {};
        state.flutterFont = NodeUtils.getFlutterFont(this.props.node.fontFamily);
        this.state = state;
    }

    shouldComponentUpdate(nextProps) {
        let state = nextProps.node.pluginData || {};
        state[PropType.FLUTTER_FONT] = NodeUtils.getFlutterFont(nextProps.node.fontFamily);
        this.setState(state);
    }

    render(_, state) {
        return h(
            "div",
            { "class": "settings-container" },
            h(TextInputWithLabel, {
                name: PropType.FLUTTER_FONT,
                label: "FLUTTER FONT",
                placeholder: this.props.node.fontFamily,
                state: state,
                handleInput: this.handleInput }),
            h(TextInputWithLabel, {
                name: PropType.TEXT_PARAM_NAME,
                label: "TEXT PARAMETER",
                state: state,
                handleInput: this.handleInput,
                onBlur: this.handleBlurAsClassName }),
            h(TextInputWithLabel, {
                name: PropType.COLOR_PARAM_NAME,
                label: "COLOR PARAMETER",
                state: state,
                handleInput: this.handleInput,
                onBlur: this.handleBlurAsClassName })
        );
    }
}

class WidgetSettings extends Component {
    constructor(props) {
        super(props);
        initInputHandlers(this);
        this.state = props.node.pluginData || { [PropType.INCLUDE_IN_EXPORT_PROJECT]: true };
    }

    shouldComponentUpdate() {
        // this is necessary to react to Undo
        this.setState(NodeUtils.getState(this.props.node));
    }

    render(_, state) {
        let isComponent = this.props.node instanceof xd.SymbolInstance;
        return h(
            "div",
            { "class": "settings-container" },
            h(Checkbox, {
                name: PropType.INCLUDE_IN_EXPORT_PROJECT,
                label: "Include in Export All Widgets",
                state: state,
                handleInput: this.handleInput }),
            h(TextInputWithLabel, {
                name: PropType.WIDGET_NAME,
                label: "WIDGET NAME",
                placeholder: NodeUtils.getDefaultWidgetName(this.props.node),
                state: state,
                handleInput: this.handleInput,
                onBlur: this.handleBlurAsClassName }),
            isComponent && h(TextInputWithLabel, {
                name: PropType.TAP_CALLBACK_NAME,
                label: "TAP CALLBACK NAME",
                state: state,
                handleInput: this.handleInput,
                onBlur: this.handleBlurAsClassName })
        );
    }
}

class GridSettings extends Component {
    constructor(props) {
        super(props);
        initInputHandlers(this);
        this.state = props.node.pluginData || {};
    }

    shouldComponentUpdate() {
        // this is necessary to react to Undo
        this.setState(NodeUtils.getState(this.props.node));
    }

    render(_, state) {
        let hasParam = !!state[PropType.DATA_PARAM_NAME];
        return h(
            "div",
            { "class": "settings-container" },
            h(TextInputWithLabel, {
                name: PropType.DATA_PARAM_NAME,
                label: "DATA PARAMETER",
                state: state,
                handleInput: this.handleInput,
                onBlur: this.handleBlurAsClassName }),
            !hasParam ? null : h(
                "p",
                { "class": "note" },
                h("img", { src: iconInfo.default }),
                " the data parameter value will default to an empty list."
            )
        );
    }
}

class ShapeSettings extends Component {
    constructor(props) {
        super(props);
        initInputHandlers(this);
        let state = props.node.pluginData || {};
        state[PropType.IMAGE_FILL_NAME] = NodeUtils.getImageName(props.node);
        this.state = state;
    }

    shouldComponentUpdate(nextProps) {
        let state = nextProps.pluginData || {};
        state[PropType.IMAGE_FILL_NAME] = NodeUtils.getImageName(nextProps.node);
        this.setState(state);
        return true;
    }

    render(_, state) {
        return !hasImage(this.props) ? null : h(
            "div",
            { "class": "settings-container" },
            h(TextInputWithLabel, {
                name: PropType.IMAGE_FILL_NAME,
                label: "IMAGE EXPORT NAME",
                state: state,
                handleInput: this.handleInput }),
            isComponentInstance(this.props) ? getWarning(this.props, true) : h(TextInputWithLabel, {
                name: PropType.IMAGE_PARAM_NAME,
                label: "IMAGE PARAMETER",
                state: state,
                handleInput: this.handleInput,
                onBlur: this.handleBlurAsClassName })
        );
    }
}

class GroupSettings extends Component {
    constructor(props) {
        super(props);
        initInputHandlers(this);
        this.state = props.node.pluginData || {};
    }

    shouldComponentUpdate() {
        // this is necessary to react to Undo
        this.setState(NodeUtils.getState(this.props.node));
    }

    render(_, state) {
        return h(
            "div",
            { "class": "settings-container" },
            h(Select, {
                name: PropType.EXPORT_MODE,
                options: ExportModeOptions,
                "default": true,
                state: state,
                handleInput: this.handleInput }),
            this.renderModeOptions(state)
        );
    }

    renderModeOptions(state) {
        let arr = [],
            mode = state[PropType.EXPORT_MODE];
        if (mode === ExportMode.CUSTOM) {
            let code = state[PropType.CUSTOM_CODE] || DEFAULT_CUSTOM_CODE;
            arr.push(h(
                "div",
                { "class": "customcode-row" },
                h(TextArea, {
                    name: PropType.CUSTOM_CODE,
                    state: state,
                    placeholder: DEFAULT_CUSTOM_CODE,
                    handleInput: this.handleInput,
                    onBlur: this.handleBlurAsCustomCode }),
                h(
                    "button",
                    {
                        "uxp-variant": "action",
                        onClick: () => this.openCodeEditor(code) },
                    h("img", { src: iconEdit.default, alt: "icon-edit" })
                )
            ));
        }
        if (mode === ExportMode.METHOD || mode === ExportMode.BUILDER) {
            arr.push(h(TextInput, {
                name: PropType.BUILD_METHOD_NAME,
                placeholder: NodeUtils.getDefaultBuildMethodName(this.props.node),
                state: state,
                handleInput: this.handleInput,
                onBlur: this.handleBlurAsClassName }));
        }
        if (mode === ExportMode.METHOD || mode === ExportMode.INLINE || mode == null) {

            arr.push(h(TextInputWithLabel, {
                name: PropType.TAP_CALLBACK_NAME,
                label: "TAP CALLBACK NAME",
                state: state,
                handleInput: this.handleInput,
                onBlur: this.handleBlurAsClassName }));

            arr.push(h(Checkbox, {
                name: PropType.COMBINE_SHAPES,
                label: "Combine Shapes",
                state: state,
                handleInput: this.handleInput }));
        }

        return arr;
    }

    async openCodeEditor(code) {
        await Alert.codeEditorAlert(code, value => {
            let name = PropType.CUSTOM_CODE;
            if (value === DEFAULT_CUSTOM_CODE) {
                value = null;
            } else {
                value = $.cleanCustomCode(value);
            }
            editDocument({ editLabel: "Updated Flutter Data" }, _ => {
                this.state[name] = value;
                NodeUtils.setState(this.props.node, this.state);
            });
            this.setState({ [name]: value });
        });
    }
}

/***/ }),

/***/ "./src/ui/styles.styl":
/*!****************************!*\
  !*** ./src/ui/styles.styl ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(/*! ../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
            var content = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!../../node_modules/stylus-loader!./styles.styl */ "./node_modules/css-loader/dist/cjs.js!./node_modules/stylus-loader/index.js!./src/ui/styles.styl");

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(module.i, content, options);

var exported = content.locals ? content.locals : {};



module.exports = exported;

/***/ }),

/***/ "./src/utils/debug.js":
/*!****************************!*\
  !*** ./src/utils/debug.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

const xd = __webpack_require__(/*! scenegraph */ "scenegraph");
const { formatDart } = __webpack_require__(/*! ../lib/dart_style */ "../lib/dart_style");
const $ = __webpack_require__(/*! ./utils */ "./src/utils/utils.js");
const version = __webpack_require__(/*! ../version */ "./src/version.js");

function trace(...rest) {
	version.debug && console.log(...rest);
}
exports.trace = trace;

function _printParameters(n, depth) {
	let d = depth || 0;
	let t = "";
	for (let i = 0; i < d; ++i) t += "  ";
	trace(`${t}node - ${n.constructor.name}`);
	if (n.parameters) {
		let values = Object.entries(n.parameters);
		for (let [key, value] of values) {
			trace(`    ${t}${key}`);
		}
	}
	if (n.children) {
		n.children.forEach(child => {
			printParameters(child, d + 1);
		});
	}
}
exports._printParameters = _printParameters;

function _printTree(node, t = "") {
	let str = `\n${t}${node.xdNode.name}(${node.constructor.name}, ${node.xdNode.constructor.name})`;
	let kids = node.children;
	for (var i = 0; kids && i < kids.length; i++) {
		str += _printTree(kids[i], t + "\t");
	}
	if (!t) {
		trace(str);
	}
	return str;
}
exports._printTree = _printTree;

// Everything below is designed to be used as a menu item:

function _dumpLayoutData(selection, root) {
	let xdNode = selection.items[0];
	console.clear();
	trace(JSON.stringify(xdNode.layout, null, "\t"));
}
exports._dumpLayoutData = _dumpLayoutData;

function _imageFlipTest(selection, root) {
	let items = selection.items,
	    imgSrc,
	    target;
	for (let i = 0; i < items.length; i++) {
		let o = items[i];
		if (o.fill instanceof xd.ImageFill) {
			imgSrc = o;
		} else if (o instanceof xd.Rectangle) {
			target = o;
		}
	}
	if (!imgSrc || !target) {
		trace("select two rectangles, one with an image fill, one without.");return;
	}
	target.fill = imgSrc.fill;
	trace("src matrix:", imgSrc.transform);
}
exports._imageFlipTest = _imageFlipTest;

function _dumpTransformData(selection, root) {
	console.clear();
	__dumpTransformData(selection.items);
	trace("***** Calculated values: *****");
	_calculateTransform(selection, root);
}
exports._dumpTransformData = _dumpTransformData;

function __dumpTransformData(items, t = "") {
	if (!items || !items.length) {
		return;
	}
	items.forEach(o => {
		trace(`${t}-> ${o.name}`);
		trace(`${t} • topLeftInParent: ${__pointToString(o.topLeftInParent)}`);
		trace(`${t} • rotation: ${$.fix(o.rotation)}`);
		trace(`${t} • localBounds: ${__rectToString(o.localBounds)}`);
		trace(`${t} • boundsInParent: ${__rectToString(o.boundsInParent)}`);
		trace(`${t} • matrix: ${o.transform}`);
		__dumpTransformData(o.children, t + "  ");
	});
}

function _calculateTransform(selection, root) {
	__calculateTransform(selection.items);
}

function __calculateTransform(items, t = "") {
	if (!items || !items.length) {
		return;
	}
	items.forEach(o => {
		// Artboards always return 0,0,w,h for their localBounds, even when content exceeds the canvas edges
		let lb = o.localBounds,
		    pb = o.parent.localBounds,
		    tl = o.topLeftInParent;
		if (o instanceof xd.Artboard) {
			tl = pb = { x: 0, y: 0 };
		}
		let rect = {
			x: tl.x - pb.x,
			y: tl.y - pb.y,
			width: lb.width,
			height: lb.height
		};
		trace(`${t}-> ${o.name}`);
		trace(`${t} • rotation: ${$.fix(o.rotation)}`);
		trace(`${t} • rect: ${__rectToString(rect)}`);
		__calculateTransform(o.children, t + "  ");
	});
}

function __rectToString(o) {
	return `{x:${$.fix(o.x)}, y:${$.fix(o.y)}, w:${$.fix(o.width)}, h:${$.fix(o.height)}}`;
}

function __pointToString(o) {
	return `{x:${$.fix(o.x)}, y:${$.fix(o.y)}}}`;
}

async function _printdumpNodePluginData(selection, root) {
	let _dumpPluginData = (pluginData, depth) => {
		if (!pluginData) return;
		let t = "";
		for (let i = 0; i < depth; ++i) t += "  ";
		for (let [k, v] of Object.entries(pluginData)) {
			trace(`${t}${k} => ${v}`);
		}
	};
	let _dumpNodePluginData = (xdNode, depth) => {
		if (!xdNode) return;
		let d = depth || 0;
		_dumpPluginData(xdNode.pluginData, d);
		xdNode.children.forEach(child => {
			_dumpNodePluginData(child, d + 1);
		});
	};
	for (let i = 0; i < selection.items.length; ++i) {
		let item = selection.items[i];
		_dumpNodePluginData(item);
	}
}
exports._printdumpNodePluginData = _printdumpNodePluginData;

/* for performance testing the formatDart method: */
async function _testDartStyle(selection, root) {
	let el = selection.items[0];
	if (!(el instanceof xd.Text)) {
		trace("select text");return;
	}
	let str = el.text,
	    count = 0,
	    maxT = 1000,
	    result;
	let t = Date.now();
	while (Date.now() - t < maxT) {
		result = formatDart(str);
		count++;
	}
	t = Date.now() - t;
	trace(result);
	trace("-------------------");
	trace(str.length + " characters formatted");
	trace(count + " iterations took " + t + "ms (avg: " + (t / count).toFixed(1) + "ms)");
}
exports._testDartStyle = _testDartStyle;

/***/ }),

/***/ "./src/utils/exportutils.js":
/*!**********************************!*\
  !*** ./src/utils/exportutils.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

const xd = __webpack_require__(/*! scenegraph */ "scenegraph");
const assets = __webpack_require__(/*! assets */ "assets");

const $ = __webpack_require__(/*! ./utils */ "./src/utils/utils.js");
const { getImagePath } = __webpack_require__(/*! ../core/image_export */ "./src/core/image_export.js");

exports.DartType = Object.freeze({
	BOOL: "bool",
	COLOR: "Color",
	IMAGE: "ImageProvider",
	STRING: "String",
	TAP_CB: "VoidCallback",
	BUILDER: "WidgetBuilder",
	GRID_DATA: "List<Map<String, dynamic>>"
});

function getColor(color, opacity = 1.0) {
	if (color == null || opacity <= 0) {
		return "Colors.transparent";
	}
	return "const Color(0x" + $.getARGBHexWithOpacity(color, opacity) + ")";
}
exports.getColor = getColor;

function getAssetImage(xdNode, ctx) {
	let path = getImagePath(xdNode);
	if (!path && ctx) {
		ctx.log.warn('Image does not have a Flutter image name.', xdNode);
	}
	return `const AssetImage('${path || ''}')`;
}
exports.getAssetImage = getAssetImage;

function getString(str) {
	return `'${$.escapeString(str)}'`;
}
exports.getString = getString;

function getGradientParam(fill, opacity) {
	let gradient = getGradient(fill, opacity);
	return gradient ? `gradient: ${gradient}, ` : '';
}
exports.getGradientParam = getGradientParam;

function getGradient(fill, opacity) {
	// Note: XD API docs say this should be called `LinearGradientFill`
	return fill instanceof xd.LinearGradient ? _getLinearGradient(fill, opacity) : fill instanceof xd.RadialGradient ? _getRadialGradient(fill, opacity) : fill instanceof xd.AngularGradient ? _getSweepGradient(fill, opacity) : '';
}
exports.getGradient = getGradient;

function getGradientFromAsset(xdColorAsset) {
	return `const ${getGradientTypeFromAsset(xdColorAsset)}(` + _getColorsParam(xdColorAsset.colorStops) + ')';
}
exports.getGradientFromAsset = getGradientFromAsset;

function getGradientTypeFromAsset(xdColorAsset) {
	return xdColorAsset.gradientType === assets.RADIAL ? "RadialGradient" : "LinearGradient";
}
exports.getGradientTypeFromAsset = getGradientTypeFromAsset;

function getScrollView(childStr, node, ctx) {
	return 'SingleChildScrollView(' + 'primary: false,' + // avoid vertical scroll views on desktop trying to share PrimaryScrollController.
	_getScrollDirectionParam(node, ctx) + `child: ${childStr}, ` + ')';
}
exports.getScrollView = getScrollView;

function getAlignment(x, y) {
	// XD uses 0 to 1, Flutter uses -1 to +1.
	return `Alignment(${$.fix(x * 2 - 1, 3)}, ${$.fix(y * 2 - 1, 3)})`;
}
exports.getAlignment = getAlignment;

function _getLinearGradient(fill, opacity = 1) {
	return 'LinearGradient(' + `begin: ${getAlignment(fill.startX, fill.startY)},` + `end: ${getAlignment(fill.endX, fill.endY)},` + _getColorsParam(fill.colorStops, opacity) + ')';
}

function _getRadialGradient(fill, opacity = 1) {
	// Flutter always draws relative to the shortest edge, whereas XD draws the gradient
	// stretched to the aspect ratio of its container.
	return 'RadialGradient(' + `center: ${getAlignment(fill.startX, fill.startY)}, ` + (fill.startX === fill.endX && fill.startY === fill.endY ? '' : `focal: ${getAlignment(fill.endX, fill.endY)}, `) + (fill.startR === 0 ? '' : `focalRadius: ${$.fix(fill.startR, 3)}, `) + `radius: ${$.fix(fill.endR, 3)}, ` + _getColorsParam(fill.colorStops, opacity) + _getTransformParam(fill) + ')';
}

function _getSweepGradient(fill, opacity = 1) {
	// Flutter's SweepGradient always starts at 0 deg (right). `startAngle` only affects color placement.
	// Also, `transform` is multiplied against the `center`.
	// As such, we need to rotate & move the gradient via GradientXDTransform

	return 'SweepGradient(' + `center: ${getAlignment(fill.startX, fill.startY)}, ` + `startAngle: 0.0, endAngle: ${$.fix(Math.PI * 2, 4)}, ` + _getColorsParam(fill.colorStops, opacity) + _getTransformParam(fill, _getRotationMtx(fill.rotation / 180 * Math.PI)) + ')';
}

function _getColorsParam(arr, opacity) {
	let l = arr.length,
	    stops = [],
	    colors = [];
	for (let i = 0; i < l; i++) {
		let s = arr[i];
		stops.push($.fix(s.stop, 3));
		colors.push(getColor(s.color, opacity));
	}
	return `colors: [${colors.join(", ")}], stops: [${stops.join(", ")}], `;
}

function _getTransformParam(fill, mtx) {
	// The GradientXDTransform is needed even if there is no transformation in order to fix the aspect ratio.
	let o = mtx || fill.gradientTransform;
	return 'transform: GradientXDTransform(' + `${$.fix(o.a, 3)}, ${$.fix(o.b, 3)}, ${$.fix(o.c, 3)}, ` + `${$.fix(o.d, 3)}, ${$.fix(o.e, 3)}, ${$.fix(o.f, 3)}, ` + `${getAlignment(fill.startX, fill.startY)}), `;
}

function _getRotationMtx(r) {
	return {
		a: Math.cos(r), b: Math.sin(r), e: 0,
		c: -Math.sin(r), d: Math.cos(r), f: 0
	};
}

function _getScrollDirectionParam(node, ctx) {
	let dir = node.xdNode.scrollingType;
	if (dir === xd.ScrollableGroup.PANNING) {
		ctx.log.warn("Panning scroll groups are not supported.", node.xdNode);
	}
	return dir === xd.ScrollableGroup.HORIZONTAL ? "scrollDirection: Axis.horizontal, " : "";
}

/***/ }),

/***/ "./src/utils/layoututils.js":
/*!**********************************!*\
  !*** ./src/utils/layoututils.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

/*
This file comprises a number of helper functions for getting, translating
or normalizing XD API values related to layout or transformation.
*/

const $ = __webpack_require__(/*! ./utils */ "./src/utils/utils.js");

function addSizedBox(nodeStr, size, ctx) {
	return `SizedBox(width: ${$.fix(size.width, 0)}, height: ${$.fix(size.height, 0)}, child: ${nodeStr},)`;
}
exports.addSizedBox = addSizedBox;

function getGroupContentBounds(xdNode, ctx) {
	// adjusts group bounds to account for inner padding.
	let b = xdNode.localBounds;
	let pad = normalizePadding(xdNode.layout.padding && xdNode.layout.padding.values);

	return !pad ? b : {
		x: b.x + pad.left,
		y: b.y + pad.top,
		width: b.width - pad.left - pad.right,
		height: b.height - pad.top - pad.bottom
	};
}
exports.getGroupContentBounds = getGroupContentBounds;

function getAdjustedBounds(xdNode, ctx) {
	// finds the untransformed bounds within the parent, adjusting for parent padding and scrolling

	// Note: Artboards always return x/y=0 & w/h = specified size for localBounds, even if children exceed edges.
	let bip = xdNode.boundsInParent,
	    lb = xdNode.localBounds;
	let parent = xdNode.parent,
	    pb = parent.localBounds;

	// calculate the untransformed top left corner, by finding the center
	// and subtracting half the untransformed w & h:
	let x = bip.x + bip.width / 2 - lb.width / 2;
	let y = bip.y + bip.height / 2 - lb.height / 2;
	let b = {
		x: x - pb.x,
		y: y - pb.y,
		width: lb.width,
		height: lb.height

		// adjust for parent padding:
	};let pad = normalizePadding(parent.layout.padding && parent.layout.padding.values);
	if (pad) {
		b.x -= pad.left;
		b.y -= pad.top;
	}

	// adjust for scrolling:
	let offset = getScrollOffset(xdNode.parent, ctx);
	if (offset) {
		b.x += offset.x;
		b.y += offset.y;
	}

	return b;
}
exports.getAdjustedBounds = getAdjustedBounds;

function getScrollOffset(xdNode, ctx) {
	let vp = xdNode.viewport;
	if (!vp) {
		return null;
	}
	return { x: vp.offsetX || 0, y: vp.offsetY || 0 };
}
exports.getScrollOffset = getScrollOffset;

function normalizePadding(pad) {
	// XD padding can be a rect object or a single value
	// returns null if no padding, otherwise returns a rect object
	if (!pad) {
		return null;
	}
	if (isNaN(pad)) {
		return pad;
	} // already a rect
	return { top: pad, right: pad, bottom: pad, left: pad, homogenous: true };
}
exports.normalizePadding = normalizePadding;

function mergeBounds(xdNodes) {
	if (!xdNodes || xdNodes.length === 0) {
		return null;
	}
	let o = { l: null, t: null, b: null, r: null };
	xdNodes.forEach(node => {
		let bip = node.boundsInParent;
		let l = bip.x,
		    t = bip.y,
		    r = l + bip.width,
		    b = t + bip.height;
		if (o.l === null || l < o.l) {
			o.l = l;
		}
		if (o.t === null || t < o.t) {
			o.t = t;
		}
		if (o.r === null || r > o.r) {
			o.r = r;
		}
		if (o.b === null || b > o.b) {
			o.b = b;
		}
	});
	return { x: o.l, y: o.t, width: o.r - o.l, height: o.b - o.t };
}
exports.mergeBounds = mergeBounds;

function normalizeSpacings(spaces, length) {
	// XD spacing can be a list or a single value, this method always returns an Array
	// the value "arrays" XD returns aren't actually of type Array:
	if (spaces.map) {
		return spaces.map(o => o);
	}
	if (spaces == null) {
		spaces = 0;
	}
	return Array(length).fill(spaces);
}
exports.normalizeSpacings = normalizeSpacings;

function hasComplexTransform(node, error, ctx) {
	let o = node.transform;
	if (!o.flipY && o.rotation % 360 === 0) {
		return false;
	}
	if (error && ctx) {
		ctx.log.warn(error, node.xdNode);
	}
	return true;
}
exports.hasComplexTransform = hasComplexTransform;

/***/ }),

/***/ "./src/utils/nameutils.js":
/*!********************************!*\
  !*** ./src/utils/nameutils.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

const $ = __webpack_require__(/*! ./utils */ "./src/utils/utils.js");

exports.DART_RESERVED_WORDS = [
// reserved words:
"assert", "break", "case", "catch", "class", "const", "continue", "default", "do", "else", "enum", "extends", "false", "final", "finally", "for", "if", "in", "is", "new", "null", "rethrow", "return", "super", "switch", "this", "throw", "true", "try", "var", "void", "while", "with",
// keywords:
"async", "hide", "on", "show", "sync",
// identifiers:
"abstract", "as", "covariant", "deferred", "export", "factory", "Function", "get", "implements", "import", "interface", "library", "mixin", "operator", "part", "set", "static", "typedef", "await", "yield",
// types:
"bool", "double", "dynamic", "int", "List", "Map", "String"];

exports.DART_RESERVED_WORDS_MAP = $.buildMap(exports.DART_RESERVED_WORDS);

// clean a Dart name without consideration for case:
function cleanDartName(name) {
   if (!name) {
      return "";
   }
   name = name.replace(/^[\W\d]+|\W/ig, '');
   if (exports.DART_RESERVED_WORDS_MAP[name]) {
      name += "_";
   }
   return name;
}
exports.cleanDartName = cleanDartName;

function cleanClassName(name, fixCase = true) {
   if (!fixCase) {
      return cleanDartName(name);
   }
   let words = findWords(name),
       n = "";
   for (let i = 0; i < words.length; i++) {
      let word = words[i];
      if (!word) {
         continue;
      }
      n += word[0].toUpperCase() + word.slice(1);
   }
   return cleanDartName(n);
}
exports.cleanClassName = cleanClassName;

// just a class name with a lowercase first char:
function cleanIdentifierName(name, fixCase = true) {
   if (!(name = cleanClassName(name, fixCase))) {
      return name;
   }
   // TODO: catch things like: ADBTester --> adbTester instead of aDBTester? Less important than for file names
   return name[0].toLowerCase() + name.slice(1);
}
exports.cleanIdentifierName = cleanIdentifierName;

function cleanFileName(name, fixCase = true) {
   // remove bad chars including /
   if (!(name = name.replace(/[\/\\:*?"<>|#]]+/ig, '')) || !fixCase) {
      return name;
   }
   let words = findWords(name),
       n = "",
       prev;
   for (let i = 0; i < words.length; i++) {
      let word = words[i];
      if (!word) {
         continue;
      }
      // catch things like: ADBTester --> adb_tester instead of a_d_b_tester
      if (isSingleCap(word) && isSingleCap(prev)) {} else if (i > 0) {
         n += "_";
      }
      prev = word;
      n += word.toLowerCase();
   }
   return n;
}
exports.cleanFileName = cleanFileName;

function pushNonEmpty(arr, val) {
   if (val) {
      arr.push(val);
   }
}

function findWords(str) {
   if (!str) {
      return [];
   }
   let re = /[-A-Z_ ]/g,
       arr = [],
       i = 0,
       o;
   while (o = re.exec(str)) {
      let c = o[0];
      pushNonEmpty(arr, str.slice(i, re.lastIndex - 1));
      i = re.lastIndex - 1;
      if (c === "-" || c === "_" || c === " ") {
         ++i;
      }
   }
   pushNonEmpty(arr, str.slice(i));
   return arr;
}

function isSingleCap(str) {
   if (!str || str.length !== 1) {
      return false;
   }
   return str.toLowerCase() !== str;
}

/***/ }),

/***/ "./src/utils/nodeutils.js":
/*!********************************!*\
  !*** ./src/utils/nodeutils.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

const xd = __webpack_require__(/*! scenegraph */ "scenegraph");
const $ = __webpack_require__(/*! ./utils */ "./src/utils/utils.js");
const { cleanClassName, cleanDartName } = __webpack_require__(/*! ../utils/nameutils */ "./src/utils/nameutils.js");
const PropType = __webpack_require__(/*! ../core/proptype */ "./src/core/proptype.js");
const { DEFAULT_CLASS_PREFIX } = __webpack_require__(/*! ../core/constants */ "./src/core/constants.js");

function getContainingComponent(xdNode, inclusive = false) {
	if (!xdNode || xdNode === xd.root) {
		return null;
	}
	if (inclusive && xdNode instanceof xd.SymbolInstance) {
		return xdNode;
	}
	return getContainingComponent(xdNode.parent, true);
}
exports.getContainingComponent = getContainingComponent;

function getOpacity(xdNode) {
	// TODO: CE: Calculate opacity based off of parents compositing mode (whether or not it exports a blend mask widget that has it's own opacity and forces compositing)
	let o = xdNode,
	    opacity = 1.0;
	while (o) {
		if (o.opacity != null) {
			opacity *= o.opacity;
		}
		o = o.parent;
	}
	return opacity;
}
exports.getOpacity = getOpacity;

function getProp(xdNode, prop) {
	let o = xdNode.pluginData;
	return o && o[prop];
}
exports.getProp = getProp;

function setProp(xdNode, prop, value) {
	let o = xdNode.pluginData || {};
	o[prop] = value;
	xdNode.pluginData = o;
}
exports.setProp = setProp;

function getInteractionCount(xdNode) {
	if (!xdNode || !xdNode.triggeredInteractions) {
		return 0;
	}
	let enabled = getProp(xd.root, PropType.ENABLE_PROTOTYPE);
	return enabled === false ? 0 : xdNode.triggeredInteractions.length;
}
exports.getInteractionCount = getInteractionCount;

function getFlutterFont(font) {
	let o = xd.root.pluginData;
	return o && o.fontMap && o.fontMap[font] || null;
}
exports.getFlutterFont = getFlutterFont;

function setFlutterFont(xdFont, flutterFont) {
	let o = xd.root.pluginData || {};
	if (!o.fontMap) {
		o.fontMap = {};
	}
	o.fontMap[xdFont] = flutterFont;
	xd.root.pluginData = o;
}
exports.setFlutterFont = setFlutterFont;

function getWidgetName(xdNode) {
	if (!isWidget(xdNode)) {
		return null;
	}
	let name = getProp(xdNode, PropType.WIDGET_NAME) || getDefaultWidgetName(xdNode);
	return cleanDartName(_getWidgetPrefix() + name);
}
exports.getWidgetName = getWidgetName;

function getDefaultWidgetName(xdNode) {
	if (!isWidget(xdNode)) {
		return null;
	}
	return cleanClassName(xdNode.name, _getNormalizeNames());
}
exports.getDefaultWidgetName = getDefaultWidgetName;

function getDefaultBuildMethodName(xdNode) {
	return "build" + cleanClassName(xdNode.name, _getNormalizeNames());
}
exports.getDefaultBuildMethodName = getDefaultBuildMethodName;

function _getWidgetPrefix() {
	let o = xd.root.pluginData;
	return o ? o[PropType.WIDGET_PREFIX] || '' : DEFAULT_CLASS_PREFIX;
}

function isWidget(xdNode) {
	// returns true if the xdNode is an exportable widget.
	return xdNode instanceof xd.Artboard || xdNode instanceof xd.SymbolInstance && xdNode.isMaster;
}
exports.isWidget = isWidget;

function getImageName(xdNode) {
	if (!xdNode.fill) {
		return null;
	}
	let name,
	    hash = getImageHash(xdNode),
	    id = getImageId(xdNode);
	let o = xd.root.pluginData,
	    map = o && o.imageMap;
	if (id) {
		name = map && map[id];
	}
	if (!name && hash) {
		// for backwards compatibility.
		name = map && map[hash];
	}
	return name || getProp(xdNode, PropType.IMAGE_FILL_NAME) || null;
}
exports.getImageName = getImageName;

function setImageName(xdNode, name) {
	let hash = getImageHash(xdNode);
	if (hash) {
		// set in both the global hash, and on the instance
		// in case a future version of XD breaks the hash again.
		let o = xd.root.pluginData || {};
		if (!o.imageMap) {
			o.imageMap = {};
		}
		o.imageMap[getImageId(xdNode)] = name;
		xd.root.pluginData = o;
	}
	setProp(xdNode, PropType.IMAGE_FILL_NAME, name);
}
exports.setImageName = setImageName;

function setState(xdNode, value) {
	xdNode.pluginData = value;
}
exports.setState = setState;

function getState(xdNode) {
	return xdNode.pluginData || {};
}
exports.getState = getState;

function getImageId(xdNode) {
	return xdNode.fill && xdNode.fill.assetId;
}

function getImageHash(xdNode) {
	// This only works on images that have been dragged into XD from the file system.
	let path = _getImageFillName(xdNode.fill);
	return path ? $.getHash(path) : null;
}
exports.getImageHash = getImageHash;

function _getImageFillName(fill) {
	if (!fill) {
		return null;
	}
	// this is a huge hack, because ImageFill doesn't have a .file property
	let fillStr = fill.toString().replace(/\\/g, '/');
	// as of XD29, this returns a file name & dimensions
	let match = /ImageFill\(([^<][^(]+)\)/.exec(fillStr);
	return match ? match[1] : null;
}

function getShapeDataName(shape, ctx) {
	return '_svg_' + cleanDartName(shape.getSvgId(ctx));
}
exports.getShapeDataName = getShapeDataName;

function _getNormalizeNames() {
	return !!getProp(xd.root, PropType.NORMALIZE_NAME_CASE);
}

/***/ }),

/***/ "./src/utils/utils.js":
/*!****************************!*\
  !*** ./src/utils/utils.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

const os = __webpack_require__(/*! os */ "os"); // used by getCmdKeyStr

function fix(num, digits = 1) {
	let p = Math.pow(10, digits);
	num = Math.round(num * p) / p;
	return num + (num === (num | 0) ? '.0' : '');
}
exports.fix = fix;

function capitalize(str) {
	return str[0].toUpperCase() + str.substr(1);
}
exports.capitalize = capitalize;

function shorten(str, length) {
	return str && str.length > length ? str.substr(0, length - 1) + "…" : str;
}
exports.shorten = shorten;

function getColorComponent(val) {
	return (val < 0x10 ? "0" : "") + Math.round(val).toString(16);
}
exports.getColorComponent = getColorComponent;

function getARGBHexWithOpacity(color, opacity = 1) {
	if (color == null) {
		return "00000000";
	}
	return getColorComponent(color.a * opacity) + getColorComponent(color.r) + getColorComponent(color.g) + getColorComponent(color.b);
}
exports.getARGBHexWithOpacity = getARGBHexWithOpacity;

function getRGBHex(color) {
	if (color == null) {
		return "000000";
	}
	return getColorComponent(color.r) + getColorComponent(color.g) + getColorComponent(color.b);
}
exports.getRGBHex = getRGBHex;

function delay(t) {
	return new Promise(f => setTimeout(f, t));
}
exports.delay = delay;

function buildMap(arr, value = true) {
	return arr.reduce((o, s) => (o[s] = value, o), {});
}
exports.buildMap = buildMap;

function getRelPath(file, ctx) {
	if (!file) {
		return "";
	}
	// this expects a url format like: 'blob:/blob-1/filepath/etc/filename.ext
	let o = /:\/.+?\/(.+)$/.exec(file.url || "");
	if (!o || !o[1]) {
		ctx && ctx.log.note(`Unable to parse relative path from URL ('${file.url}')`);
		return file.name;
	}
	return o[1];
}
exports.getRelPath = getRelPath;

function cleanPath(path) {
	// remove bad chars & leading or trailing /
	return path.replace(/^\/|\/$|[\\:*?"<>|#]+/g, '');
}
exports.cleanPath = cleanPath;

function cleanCustomCode(code) {
	// remove trailing spaces, commas, or semi-colons
	return code.replace(/[\s,;]+$/g, '');
}
exports.cleanCustomCode = cleanCustomCode;

function getParamList(arr) {
	let str = '';
	arr.forEach(o => {
		if (o) {
			str += o;
		}
	});
	return str;
}
exports.getParamList = getParamList;

function getParamDelta(defaultParams, params) {
	// Compares an array of params to an array of default params,
	// and returns a new array containing only the entries that differ,
	// or null if there is no difference.
	let delta = null;
	for (let i = 0; i < params.length; i++) {
		if (defaultParams[i] === params[i]) {
			continue;
		}
		if (delta === null) {
			delta = [];
		}
		delta.push(params[i]);
	}
	return delta;
}
exports.getParamDelta = getParamDelta;

function escapeString(str) {
	return str.replace(/(['\\$])/g, '\\$1') // escaped characters
	.replace(/\n/g, '\\n'); // line breaks
}
exports.escapeString = escapeString;

function getSelectedItem(selection) {
	return selection.items.length === 1 ? selection.items[0] : null;
}
exports.getSelectedItem = getSelectedItem;

function enumName(enumeration, value) {
	for (let [k, v] of Object.entries(enumeration)) {
		if (v == value) {
			return k;
		}
	}
	return "";
}
exports.enumName = enumName;

function getHash(str) {
	let hash = 0;
	for (let i = 0; i < str.length; ++i) {
		// Original fn: h = c + (h << 6) + (h << 16) - h
		// Idk if the bit version or multiply version is faster, it probably doesn't matter
		hash = hash * 65599 + str.charCodeAt(i) | 0; // Prime multiply, add character to hash, convert to int
	}
	return hash;
}
exports.getHash = getHash;

function getExportAllMessage(count, total, noun) {
	let s = total === 1 ? '' : 's';
	if (total === 0) {
		return `No ${noun}s found to export`;
	}
	if (count === total) {
		return `Exported ${count} ${noun}${s}`;
	}
	if (count > 0) {
		return `Exported ${count} of ${total} ${noun}${s}`;
	}
	return `Failed to export ${total} ${noun}${s}`;
}
exports.getExportAllMessage = getExportAllMessage;

function getCmdKeyStr() {
	return os.platform() === "darwin" ? "Cmd" : "Ctrl";
}
exports.getCmdKeyStr = getCmdKeyStr;

function almostEqual(v0, v1, d = 0.01) {
	return Math.abs(v1 - v0) < d;
}
exports.almostEqual = almostEqual;

function joinValues(arr, delimiter = ", ") {
	return arr.filter(n => n != null && n !== "").join(delimiter);
}
exports.joinValues = joinValues;

function isIdentityTransform(o) {
	// unused.
	return o.a === 1 && o.b === 0 && o.c === 0 && o.d === 1 && o.e === 0 && o.f === 0;
}

/***/ }),

/***/ "./src/version.js":
/*!************************!*\
  !*** ./src/version.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

const app = __webpack_require__(/*! application */ "application");
const { alert } = __webpack_require__(/*! ./ui/alert */ "./src/ui/alert.jsx");

// Update for new builds:
exports.version = "4.0.0";
exports.debug = false;
exports.xdVersionRequired = 42; // the actual minimum XD version required to run the plugin.

// Calculated:
exports.xdVersion = parseInt(app.version);
exports.xdVersionOk = exports.xdVersion >= exports.xdVersionRequired;
exports.label = exports.debug ? 'DEBUG' : 'Release';

// Methods:
function checkXDVersion() {
	if (exports.xdVersionOk) {
		return true;
	}
	alert(`XD to Flutter plugin (v${exports.version}) requires Adobe XD version ` + `${exports.xdVersionRequired} or higher.` + `<br><br>Current version is ${app.version}. Please upgrade.`);
	return false;
}
exports.checkXDVersion = checkXDVersion;

/***/ }),

/***/ "application":
/*!******************************!*\
  !*** external "application" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("application");

/***/ }),

/***/ "assets":
/*!*************************!*\
  !*** external "assets" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("assets");

/***/ }),

/***/ "clipboard":
/*!****************************!*\
  !*** external "clipboard" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("clipboard");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),

/***/ "scenegraph":
/*!*****************************!*\
  !*** external "scenegraph" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("scenegraph");

/***/ }),

/***/ "uxp":
/*!**********************!*\
  !*** external "uxp" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("uxp");

/***/ })

/******/ });
//# sourceMappingURL=main.js.map