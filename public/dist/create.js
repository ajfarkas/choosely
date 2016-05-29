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

	eval("'use strict';\n\nvar _connect = __webpack_require__(2);\n\nvar _connect2 = _interopRequireDefault(_connect);\n\nvar _functions = __webpack_require__(4);\n\nvar _functions2 = _interopRequireDefault(_functions);\n\nvar _helpers = __webpack_require__(1);\n\nvar _helpers2 = _interopRequireDefault(_helpers);\n\nvar _socketHandlers = __webpack_require__(3);\n\nvar _socketHandlers2 = _interopRequireDefault(_socketHandlers);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n(0, _connect2.default)(_socketHandlers2.default);\n// use input value to create new name\n_helpers2.default.$('#names .input-btn').addEventListener('click', _functions2.default.createName);\n_helpers2.default.$('[name=\\\"name\\\"]').addEventListener('keypress', _functions2.default.enterAndCreateName);\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/create.js\n ** module id = 0\n ** module chunks = 1\n **/\n//# sourceURL=webpack:///./src/create.js?");

/***/ },
/* 1 */
/***/ function(module, exports) {

	eval("\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nfunction $(selector, container) {\n  container = container || document;\n  return container.querySelector(selector);\n}\n\nfunction $$(selector, container) {\n  container = container || document;\n  return container.querySelectorAll(selector);\n}\n\nexports.default = {\n  $: $, $$: $$\n};\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/helpers/helpers.js\n ** module id = 1\n ** module chunks = 0 1 2\n **/\n//# sourceURL=webpack:///./src/helpers/helpers.js?");

/***/ },
/* 2 */
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = initSocket;\nfunction initSocket(cb) {\n  window.Data = {\n    names: {},\n    lastnames: ['Madden', 'Farkas', 'Farkas-Madden', 'Madden-Farkas']\n  };\n\n  window.socket = io();\n\n  socket.on('connect', function () {\n    console.log('socket connected.');\n  }).on('disconnect', function () {\n    console.log('socket disconnected.');\n  });\n\n  if (cb) {\n    return cb();\n  }\n}\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/realtime/connect.js\n ** module id = 2\n ** module chunks = 0 1 2\n **/\n//# sourceURL=webpack:///./src/realtime/connect.js?");

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = setHandlers;\n\nvar _functions = __webpack_require__(4);\n\nvar _functions2 = _interopRequireDefault(_functions);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar handlers = {\n  connected: function connected(data) {\n    console.log('connectedHandler');\n    _functions2.default.readNames(data);\n  },\n  namesRead: function namesRead(data) {\n    console.log('namesRead');\n    if (window.location.pathname.match(/\\/create\\b/)) {\n      var sortedData = Object.keys(data).sort(function (a, b) {\n        return data[a].createDate > data[b].createDate;\n      });\n      sortedData.forEach(function (record) {\n        _functions2.default.addNameToDOM(data[record]);\n      });\n    } else if (window.location.pathname.match(/\\/choose\\b/)) {\n      Data.names = data;\n    }\n  },\n  nameAdded: function nameAdded(data) {\n    if (window.location.pathname.match(/\\/create\\b/)) {\n      if (window.Data.names[data.id] === undefined) {\n        _functions2.default.addNameToDOM(data);\n      }\n    } else if (window.location.pathname.match(/\\/choose\\b/)) {\n      Data.names[data.id] = data;\n    }\n  }\n};\n\nfunction setHandlers(cb) {\n  Object.keys(handlers).forEach(function (event) {\n    socket.on(event, handlers[event]);\n  });\n\n  if (cb) {\n    return cb();\n  }\n}\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/realtime/socketHandlers.js\n ** module id = 3\n ** module chunks = 0 1\n **/\n//# sourceURL=webpack:///./src/realtime/socketHandlers.js?");

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nvar _jsCookie = __webpack_require__(5);\n\nvar _jsCookie2 = _interopRequireDefault(_jsCookie);\n\nvar _helpers = __webpack_require__(1);\n\nvar _helpers2 = _interopRequireDefault(_helpers);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar F = {};\n\nF.deleteName = function (e) {\n  e.preventDefault();\n\n  return console.log('F.deleteName temp. disabled');\n\n  // const parent = e.target.parentNode\n  // const name = parent.dataset.value\n\n  // socket.emit('put', {\n  //   verb: 'delete',\n  //   subject: 'name',\n  //   user: cookie('userId'),\n  //   name: name\n  // })\n\n  // parent.remove()\n  // delete Data.names[name]\n};\n\nF.updateName = function (e) {\n  e.preventDefault();\n\n  var input = _helpers2.default.$('#names input');\n  var button = _helpers2.default.$('#names button');\n  var target = _helpers2.default.$('.editing');\n  var id = target.dataset.value;\n  var name = input.value;\n  // update local Data Object\n  Data.names[id].name = name;\n  // send to server\n  socket.emit('put', {\n    verb: 'update',\n    subject: 'name',\n    user: (0, _jsCookie2.default)('userId'),\n    nameObj: Data.names[id]\n  });\n  // reset input\n  input.value = '';\n  button.innerText = '+';\n  // reset selected name\n  target.dataset.name = name;\n  _helpers2.default.$('.name-label', target).innerText = name;\n  target.className = target.className.replace(' editing', '');\n  // switch listeners to Create\n  button.removeEventListener('click', F.updateName);\n  input.removeEventListener('keypress', F.enterAndUpdateName);\n\n  button.addEventListener('click', F.createName);\n  input.addEventListener('keypress', F.enterAndCreateName);\n};\n\nF.enterAndUpdateName = function (e) {\n  if (e.keyCode === 13) {\n    e.preventDefault();\n    F.updateName(e);\n  } else {\n    return true;\n  }\n};\n\nF.updateNameMode = function (e) {\n  e.preventDefault();\n\n  var parent = e.target.parentNode;\n  var name = parent.dataset.name;\n  var input = _helpers2.default.$('#names input');\n  var button = _helpers2.default.$('#names button');\n\n  parent.className += ' editing';\n  input.value = name;\n  button.innerText = '√';\n  // switch listeners to Update\n  button.removeEventListener('click', F.createName);\n  input.removeEventListener('keypress', F.enterAndCreateName);\n\n  button.addEventListener('click', F.updateName);\n  input.addEventListener('keypress', F.enterAndUpdateName);\n};\n\nF.addNameToDOM = function (record) {\n  var main = _helpers2.default.$('main');\n  var li = document.createElement('li');\n  var num = document.createElement('p');\n  var name = document.createElement('p');\n  var btn = document.createElement('button');\n  var input = _helpers2.default.$('[name=\\\"name\\\"]');\n  if (!record) {\n    return console.error('no record provided!');\n  }\n  // add to Global\n  window.Data.names[record.id] = record;\n  // set up li\n  li.className = 'name';\n  li.dataset.value = record.id;\n  li.dataset.name = record.name;\n  // li.addEventListener('click', () => {\n  //   Data.names[record.id].score++\n  //   socket.emit('put', {\n  //     verb: 'update',\n  //     subject: 'name',\n  //     user: cookie('userId'),\n  //     nameObj: Data.names[record.id]\n  //   })\n  // })\n\n  num.className = 'name-order';\n  num.innerText = _helpers2.default.$$('.name').length + 1;\n\n  name.className = 'name-label';\n  name.innerText = record.name;\n  // set up button\n  btn.className = 'edit-btn';\n  btn.setAttribute('type', 'button');\n  btn.innerText = 'edit';\n  btn.addEventListener('click', F.updateNameMode);\n\n  // add to client\n  li.appendChild(num);\n  li.appendChild(name);\n  li.appendChild(btn);\n  _helpers2.default.$('.names').appendChild(li);\n  // clear input\n  input.value = '';\n  // keep last name on list onscreen\n  main.scrollTop = main.getBoundingClientRect().height;\n\n  return record.name;\n};\n\nF.createName = function (e) {\n  e.preventDefault();\n\n  // send to server\n  socket.emit('put', {\n    verb: 'create',\n    subject: 'name',\n    user: (0, _jsCookie2.default)('userId'),\n    name: _helpers2.default.$('#names input').value\n  });\n};\n\nF.enterAndCreateName = function (e) {\n  if (e.keyCode === 13) {\n    e.preventDefault();\n    F.createName(e);\n  } else {\n    return true;\n  }\n};\n\nF.readNames = function () {\n  socket.emit('get', {\n    verb: 'read',\n    subject: 'names',\n    user: (0, _jsCookie2.default)('userId')\n  });\n};\n\nmodule.exports = F;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/helpers/functions.js\n ** module id = 4\n ** module chunks = 0 1\n **/\n//# sourceURL=webpack:///./src/helpers/functions.js?");

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	eval("var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol ? \"symbol\" : typeof obj; };\n\n/*!\n * JavaScript Cookie v2.0.4\n * https://github.com/js-cookie/js-cookie\n *\n * Copyright 2006, 2015 Klaus Hartl & Fagner Brack\n * Released under the MIT license\n */\n(function (factory) {\n  if (true) {\n    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n  } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {\n    module.exports = factory();\n  } else {\n    var _OldCookies = window.Cookies;\n    var api = window.Cookies = factory();\n    api.noConflict = function () {\n      window.Cookies = _OldCookies;\n      return api;\n    };\n  }\n})(function () {\n  function extend() {\n    var i = 0;\n    var result = {};\n    for (; i < arguments.length; i++) {\n      var attributes = arguments[i];\n      for (var key in attributes) {\n        result[key] = attributes[key];\n      }\n    }\n    return result;\n  }\n\n  function init(converter) {\n    function api(key, value, attributes) {\n      var result;\n\n      // Write\n\n      if (arguments.length > 1) {\n        attributes = extend({\n          path: '/'\n        }, api.defaults, attributes);\n\n        if (typeof attributes.expires === 'number') {\n          var expires = new Date();\n          expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);\n          attributes.expires = expires;\n        }\n\n        try {\n          result = JSON.stringify(value);\n          if (/^[\\{\\[]/.test(result)) {\n            value = result;\n          }\n        } catch (e) {}\n\n        value = encodeURIComponent(String(value));\n        value = value.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);\n\n        key = encodeURIComponent(String(key));\n        key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);\n        key = key.replace(/[\\(\\)]/g, escape);\n\n        return document.cookie = [key, '=', value, attributes.expires && '; expires=' + attributes.expires.toUTCString(), // use expires attribute, max-age is not supported by IE\n        attributes.path && '; path=' + attributes.path, attributes.domain && '; domain=' + attributes.domain, attributes.secure ? '; secure' : ''].join('');\n      }\n\n      // Read\n\n      if (!key) {\n        result = {};\n      }\n\n      // To prevent the for loop in the first place assign an empty array\n      // in case there are no cookies at all. Also prevents odd result when\n      // calling \"get()\"\n      var cookies = document.cookie ? document.cookie.split('; ') : [];\n      var rdecode = /(%[0-9A-Z]{2})+/g;\n      var i = 0;\n\n      for (; i < cookies.length; i++) {\n        var parts = cookies[i].split('=');\n        var name = parts[0].replace(rdecode, decodeURIComponent);\n        var cookie = parts.slice(1).join('=');\n\n        if (cookie.charAt(0) === '\"') {\n          cookie = cookie.slice(1, -1);\n        }\n\n        try {\n          cookie = converter && converter(cookie, name) || cookie.replace(rdecode, decodeURIComponent);\n\n          if (this.json) {\n            try {\n              cookie = JSON.parse(cookie);\n            } catch (e) {}\n          }\n\n          if (key === name) {\n            result = cookie;\n            break;\n          }\n\n          if (!key) {\n            result[name] = cookie;\n          }\n        } catch (e) {}\n      }\n\n      return result;\n    }\n\n    api.get = api.set = api;\n    api.getJSON = function () {\n      return api.apply({\n        json: true\n      }, [].slice.call(arguments));\n    };\n    api.defaults = {};\n\n    api.remove = function (key, attributes) {\n      api(key, '', extend(attributes, {\n        expires: -1\n      }));\n    };\n\n    api.withConverter = init;\n\n    return api;\n  }\n\n  return init();\n});\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/static/js.cookie.js\n ** module id = 5\n ** module chunks = 0 1\n **/\n//# sourceURL=webpack:///./src/static/js.cookie.js?");

/***/ }
/******/ ]);