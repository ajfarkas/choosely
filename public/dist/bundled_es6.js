/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	eval("module.exports = __webpack_require__(1);\n\n\n/*****************\n ** WEBPACK FOOTER\n ** multi main\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///multi_main?");

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nwindow.Data = {\n  names: {}\n};\n\n__webpack_require__(2);\n__webpack_require__(3);\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/main.js\n ** module id = 1\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/main.js?");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nvar F = __webpack_require__(6);\n__webpack_require__(5)();\n\nif (window.location.pathname === '/') {\n\n  F.$('#login-btn').addEventListener('click', F.login);\n} else if (window.location.pathname.match('create.html')) {\n\n  F.$('#names .input-btn').addEventListener('click', F.createName);\n  F.$('[name=\\\"name\\\"]').addEventListener('keypress', function (e) {\n    if (e.keyCode === 13) {\n      e.preventDefault();\n      F.createName(e);\n    } else {\n      return true;\n    }\n  });\n\n  socket.on('connected', F.readNames);\n}\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/interaction.js\n ** module id = 2\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/interaction.js?");

/***/ },
/* 3 */
/***/ function(module, exports) {

	eval("'use strict';\n\nvar socket = io();\n\nsocket.on('connect', function () {\n  console.log('socket connected.');\n}).on('disconnect', function () {\n  console.log('socket disconnected.');\n});\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/realtime.js\n ** module id = 3\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/realtime.js?");

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	eval("var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol ? \"symbol\" : typeof obj; };\n\n/*!\n * JavaScript Cookie v2.0.4\n * https://github.com/js-cookie/js-cookie\n *\n * Copyright 2006, 2015 Klaus Hartl & Fagner Brack\n * Released under the MIT license\n */\n(function (factory) {\n  if (true) {\n    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n  } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {\n    module.exports = factory();\n  } else {\n    var _OldCookies = window.Cookies;\n    var api = window.Cookies = factory();\n    api.noConflict = function () {\n      window.Cookies = _OldCookies;\n      return api;\n    };\n  }\n})(function () {\n  function extend() {\n    var i = 0;\n    var result = {};\n    for (; i < arguments.length; i++) {\n      var attributes = arguments[i];\n      for (var key in attributes) {\n        result[key] = attributes[key];\n      }\n    }\n    return result;\n  }\n\n  function init(converter) {\n    function api(key, value, attributes) {\n      var result;\n\n      // Write\n\n      if (arguments.length > 1) {\n        attributes = extend({\n          path: '/'\n        }, api.defaults, attributes);\n\n        if (typeof attributes.expires === 'number') {\n          var expires = new Date();\n          expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);\n          attributes.expires = expires;\n        }\n\n        try {\n          result = JSON.stringify(value);\n          if (/^[\\{\\[]/.test(result)) {\n            value = result;\n          }\n        } catch (e) {}\n\n        value = encodeURIComponent(String(value));\n        value = value.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);\n\n        key = encodeURIComponent(String(key));\n        key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);\n        key = key.replace(/[\\(\\)]/g, escape);\n\n        return document.cookie = [key, '=', value, attributes.expires && '; expires=' + attributes.expires.toUTCString(), // use expires attribute, max-age is not supported by IE\n        attributes.path && '; path=' + attributes.path, attributes.domain && '; domain=' + attributes.domain, attributes.secure ? '; secure' : ''].join('');\n      }\n\n      // Read\n\n      if (!key) {\n        result = {};\n      }\n\n      // To prevent the for loop in the first place assign an empty array\n      // in case there are no cookies at all. Also prevents odd result when\n      // calling \"get()\"\n      var cookies = document.cookie ? document.cookie.split('; ') : [];\n      var rdecode = /(%[0-9A-Z]{2})+/g;\n      var i = 0;\n\n      for (; i < cookies.length; i++) {\n        var parts = cookies[i].split('=');\n        var name = parts[0].replace(rdecode, decodeURIComponent);\n        var cookie = parts.slice(1).join('=');\n\n        if (cookie.charAt(0) === '\"') {\n          cookie = cookie.slice(1, -1);\n        }\n\n        try {\n          cookie = converter && converter(cookie, name) || cookie.replace(rdecode, decodeURIComponent);\n\n          if (this.json) {\n            try {\n              cookie = JSON.parse(cookie);\n            } catch (e) {}\n          }\n\n          if (key === name) {\n            result = cookie;\n            break;\n          }\n\n          if (!key) {\n            result[name] = cookie;\n          }\n        } catch (e) {}\n      }\n\n      return result;\n    }\n\n    api.get = api.set = api;\n    api.getJSON = function () {\n      return api.apply({\n        json: true\n      }, [].slice.call(arguments));\n    };\n    api.defaults = {};\n\n    api.remove = function (key, attributes) {\n      api(key, '', extend(attributes, {\n        expires: -1\n      }));\n    };\n\n    api.withConverter = init;\n\n    return api;\n  }\n\n  return init();\n});\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/static/js.cookie.js\n ** module id = 4\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/static/js.cookie.js?");

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nvar F = __webpack_require__(6);\n\nvar handlers = {\n  namesRead: function namesRead(data) {\n    Object.keys(data).forEach(F.addNameToDOM);\n  },\n  nameAdded: function nameAdded(data) {\n    if (window.Data.names[data.name] === undefined) {\n      F.addNameToDOM(data.name);\n    }\n  }\n};\n\nmodule.exports = function () {\n  Object.keys(handlers).forEach(function (event) {\n    socket.on(event, handlers[event]);\n  });\n};\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/socketHandlers.js\n ** module id = 5\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/socketHandlers.js?");

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nvar cookie = __webpack_require__(4);\n\nvar F = {};\nF.$ = function (selector, container) {\n  container = container || document;\n  return container.querySelector(selector);\n}, F.login = function (e) {\n  e.preventDefault();\n\n  var userId = undefined;\n  var user = F.$('[name=\\\"user\\\"]').value.toLowerCase();\n  var partner = F.$('[name=\\\"partner\\\"]').value.toLowerCase();\n\n  if (user > partner) {\n    userId = user + '_' + partner;\n  } else {\n    userId = partner + '_' + user;\n  }\n\n  cookie('userId', userId);\n  window.location.pathname = '/create.html';\n}, F.addNameToDOM = function (value) {\n  var li = document.createElement('li');\n  var input = F.$('[name=\\\"name\\\"]');\n  if (value === undefined) {\n    value = input.value;\n  }\n  // add to Global\n  window.Data.names[value] = {\n    name: value,\n    score: 0,\n    matches: {}\n  };\n  // add to client\n  li.className = 'name';\n  li.innerText = value;\n  F.$('.names').appendChild(li);\n  // clear input\n  input.value = '';\n  return value;\n}, F.createName = function (e) {\n  e.preventDefault();\n\n  var value = F.addNameToDOM();\n  // send to server\n  socket.emit('put', {\n    verb: 'create',\n    subject: 'name',\n    user: cookie('userId'),\n    name: value\n  });\n}, F.readNames = function () {\n  socket.emit('get', {\n    verb: 'read',\n    subject: 'names',\n    user: cookie('userId')\n  });\n};\n\nmodule.exports = F;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/functions.js\n ** module id = 6\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/functions.js?");

/***/ }
/******/ ]);