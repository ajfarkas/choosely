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

	eval("'use strict';\n\nvar _connect = __webpack_require__(2);\n\nvar _connect2 = _interopRequireDefault(_connect);\n\nvar _helpers = __webpack_require__(1);\n\nvar _helpers2 = _interopRequireDefault(_helpers);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n// init socket.io\n(0, _connect2.default)();\n\nfunction login(e) {\n  e.preventDefault();\n\n  var userId = undefined;\n  var user = _helpers2.default.$('[name=\\\"user\\\"]').value.toLowerCase();\n  var partner = _helpers2.default.$('[name=\\\"partner\\\"]').value.toLowerCase();\n\n  if (user > partner) {\n    userId = user + '_' + partner;\n  } else {\n    userId = partner + '_' + user;\n  }\n\n  cookie('userId', userId);\n  window.location.pathname = '/create';\n}\n\n_helpers2.default.$('#login-btn').addEventListener('click', login);\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/login.js\n ** module id = 0\n ** module chunks = 2\n **/\n//# sourceURL=webpack:///./src/login.js?");

/***/ },
/* 1 */
/***/ function(module, exports) {

	eval("\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nfunction $(selector, container) {\n  container = container || document;\n  return container.querySelector(selector);\n}\n\nfunction $$(selector, container) {\n  container = container || document;\n  return container.querySelectorAll(selector);\n}\n\nexports.default = {\n  $: $, $$: $$\n};\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/helpers/helpers.js\n ** module id = 1\n ** module chunks = 0 1 2\n **/\n//# sourceURL=webpack:///./src/helpers/helpers.js?");

/***/ },
/* 2 */
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = initSocket;\nfunction initSocket(cb) {\n  window.Data = {\n    names: {},\n    lastnames: ['Madden', 'Farkas', 'Farkas-Madden', 'Madden-Farkas']\n  };\n\n  window.socket = io();\n\n  socket.on('connect', function () {\n    console.log('socket connected.');\n  }).on('disconnect', function () {\n    console.log('socket disconnected.');\n  });\n\n  if (cb) {\n    return cb();\n  }\n}\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/realtime/connect.js\n ** module id = 2\n ** module chunks = 0 1 2\n **/\n//# sourceURL=webpack:///./src/realtime/connect.js?");

/***/ }
/******/ ]);