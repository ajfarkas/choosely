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

	eval("'use strict';\n\n__webpack_require__(2);\n__webpack_require__(3);\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/main.js\n ** module id = 1\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/main.js?");

/***/ },
/* 2 */
/***/ function(module, exports) {

	eval("'use strict';\n\nvar socket = io();\n\nfunction $(selector, container) {\n  container = container || document;\n  return container.querySelector(selector);\n}\n\nfunction addName(e) {\n  e.preventDefault();\n\n  var li = document.createElement('li');\n  var input = $('[name=\\\"name\\\"]');\n  // add to client\n  li.className = 'name';\n  li.innerText = input.value;\n  $('.names').appendChild(li);\n  // send to server\n  socket.emit('addName', {\n    name: input.value\n  });\n  // clear form\n  input.value = '';\n}\n\nif (window.location.pathname.match('create.html')) {\n  $('#names .input-btn').addEventListener('click', addName);\n  $('[name=\\\"name\\\"]').addEventListener('keypress', function (e) {\n    if (e.keyCode === 13) {\n      e.preventDefault();\n      addName(e);\n    } else {\n      return true;\n    }\n  });\n}\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/interaction.js\n ** module id = 2\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/interaction.js?");

/***/ },
/* 3 */
/***/ function(module, exports) {

	eval("'use strict';\n\nvar socket = io();\n\nsocket.on('connect', function () {\n  console.log('socket connected.');\n}).on('disconnect', function () {\n  console.log('socket disconnected.');\n});\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/realtime.js\n ** module id = 3\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/realtime.js?");

/***/ }
/******/ ]);