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

	eval("'use strict';\n\nwindow.Data = {\n  names: {}\n};\n\nwindow.socket = io();\n\n__webpack_require__(1);\n__webpack_require__(5);\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/main.js\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/main.js?");

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nvar _helpers = __webpack_require__(!(function webpackMissingModule() { var e = new Error(\"Cannot find module \\\"../helpers\\\"\"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));\n\nvar _helpers2 = _interopRequireDefault(_helpers);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar F = __webpack_require__(!(function webpackMissingModule() { var e = new Error(\"Cannot find module \\\"./functions\\\"\"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));\n\n__webpack_require__(4)();\n\nif (window.location.pathname === '/') {\n\n  _helpers2.default.$('#login-btn').addEventListener('click', F.login);\n} else if (window.location.pathname.match('/create')) {\n  // use input value to create new name\n  _helpers2.default.$('#names .input-btn').addEventListener('click', F.createName);\n  _helpers2.default.$('[name=\\\"name\\\"]').addEventListener('keypress', function (e) {\n    if (e.keyCode === 13) {\n      e.preventDefault();\n      F.createName(e);\n    } else {\n      return true;\n    }\n  });\n\n  socket.on('connected', F.readNames);\n}\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/admin/interaction.js\n ** module id = 1\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/admin/interaction.js?");

/***/ },
/* 2 */,
/* 3 */,
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = setHandlers;\n\nvar _functions = __webpack_require__(!(function webpackMissingModule() { var e = new Error(\"Cannot find module \\\"../admin/functions\\\"\"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));\n\nvar _functions2 = _interopRequireDefault(_functions);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar handlers = {\n  connected: function connected(data) {\n    _functions2.default.readNames(data);\n  },\n  namesRead: function namesRead(data) {\n    Object.keys(data).forEach(function (record) {\n      _functions2.default.addNameToDOM(data[record]);\n    });\n  },\n  nameAdded: function nameAdded(data) {\n    if (window.Data.names[data.name] === undefined) {\n      _functions2.default.addNameToDOM(data);\n    }\n  }\n};\n\nfunction setHandlers(cb) {\n  Object.keys(handlers).forEach(function (event) {\n    socket.on(event, handlers[event]);\n  });\n\n  if (cb) {\n    return cb();\n  }\n}\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/realtime/socketHandlers.js\n ** module id = 4\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/realtime/socketHandlers.js?");

/***/ },
/* 5 */
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = initSocket;\nfunction initSocket(cb) {\n  window.Data = {\n    names: {}\n  };\n\n  window.socket = io();\n\n  socket.on('connect', function () {\n    console.log('socket connected.');\n  }).on('disconnect', function () {\n    console.log('socket disconnected.');\n  });\n\n  if (cb) {\n    return cb();\n  }\n}\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/realtime/connect.js\n ** module id = 5\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/realtime/connect.js?");

/***/ }
/******/ ]);