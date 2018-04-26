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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/extension/content.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/extension/content.js":
/*!**********************************!*\
  !*** ./src/extension/content.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

///////////////////////////////
// xhr-mock
///////////////////////////////

function initial () {
  if (window.xhrMockApi === undefined) {
    // 將主程式置入 Browser
    var script = document.createElement('script');
    script.id = 'xhrMockApi';
    document.getElementsByTagName("body")[0].appendChild(script);
    script.src = chrome.extension.getURL('broswer/xhr-mock.js');
    script.onload = () => {
      console.log('xhrMockApi init');
    };
    script.onerror = () => {
      console.log('xhrMockApi error');
    }
  }
}

// 執行 Browser 上 Mock 程式
function callMockAPI(mockExtensionData) {
  const timeout = mockExtensionData.timeout.split('-');
  let responseTime = timeout.filter((item) => item !== '').map((time) => parseInt(time));
  let delay = 0;
  if (responseTime.length < 1) responseTime = [100, 200];
  if (responseTime.length === 2) {
    delay = Math.floor(Math.random() * Math.abs(responseTime[0] - responseTime[1])) + Math.min(responseTime[0], responseTime[1]);
  } else if (responseTime.length === 1) {
    delay = responseTime[0];
  }

  postMessage({
    id: 'xhr-mock-api-message',
    type: 'mock',
    mockURL: mockExtensionData.mockURL,
    status: parseInt(mockExtensionData.status),
    response: JSON.stringify(mockExtensionData.response),
    delay
  }, '*');
}

// 偵聽主程式訊息
chrome.runtime.onMessage.addListener((mockExtensionData, sender, sendResponse) => {
  switch (mockExtensionData.type) {
    case 'checkState':
      sendResponse(window.xhrMockApi !== undefined);
      break;
    case 'mock':
    default:
      mockExtensionData.response = JSON.parse(mockExtensionData.response);
      callMockAPI(mockExtensionData);
      // 回給主程式 ok
      sendResponse('ok');
  }
});

initial();

/***/ })

/******/ });
//# sourceMappingURL=content.js.map