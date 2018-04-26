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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/extension/mock-api.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/extension/mock-api.js":
/*!***********************************!*\
  !*** ./src/extension/mock-api.js ***!
  \***********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mock_api_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mock-api.scss */ "./src/extension/mock-api.scss");
/* harmony import */ var _mock_api_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_mock_api_scss__WEBPACK_IMPORTED_MODULE_0__);


function mock(e) {
  const response = document.getElementById('response').value;
  const mockURL = document.getElementById('mockURL').value;
  const timeout = document.getElementById('timeout').value || '100-200';
  const status = document.getElementById('status').value;
  if (!mockURL || !response || !status) {
    new Notification("請確認欄位是否設定完成");
    return;
  }
  const mockExtensionData = {
    response,
    mockURL,
    timeout,
    status
  };

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { ...mockExtensionData, type: 'mock' }, (response) => {
        console.log(`response: ${response}`);
        localStorage.setItem('mockExtensionData', JSON.stringify(mockExtensionData));
      });
  });
  window.close();
}

document.addEventListener('DOMContentLoaded', function () {
  let mockExtensionData = {
    response: '',
    mockURL: '',
    timeout: '100-200',
    status: '200'
  };
  try {
    mockExtensionData = JSON.parse(localStorage.getItem('mockExtensionData')) || mockExtensionData;
  } catch(e) {
    localStorage.removeItem('mockExtensionData');
  }
  try {
    document.getElementById('response').value = JSON.stringify(JSON.parse(mockExtensionData.response), null, 2);
  } catch (e) {
    document.getElementById('response').value = mockExtensionData.response;
  }
  document.getElementById('mockURL').value = mockExtensionData.mockURL;
  document.getElementById('timeout').value = mockExtensionData.timeout;
  document.getElementById('status').value = mockExtensionData.status;
  const divs = document.querySelectorAll('#btn');
  for (var i = 0; i < divs.length; i++) {
    divs[i].addEventListener('click', mock);
  }
});


/***/ }),

/***/ "./src/extension/mock-api.scss":
/*!*************************************!*\
  !*** ./src/extension/mock-api.scss ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

/******/ });
//# sourceMappingURL=mock-api.js.map