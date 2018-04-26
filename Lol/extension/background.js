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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/extension/background.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/extension/background.js":
/*!*************************************!*\
  !*** ./src/extension/background.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

let timeOutId;

function updateIcon() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'checkState' }, (response) => {
      if (response) {
        chrome.browserAction.setIcon({ path: 'icon16.png' });
        chrome.browserAction.enable();
      } else {
        chrome.browserAction.setIcon({ path: 'icon16-gray.png' });
        chrome.browserAction.disable();
      }
    });
  });
};

// chrome.browserAction.onClicked.addListener(updateIcon);

// 頁面網址改變
// chrome.webNavigation.onCommitted.addListener(updateIcon);
// chrome.webNavigation.onTabReplaced.addListener(updateIcon);

// 頁籤更新
chrome.tabs.onUpdated.addListener(() => {
  clearTimeout(timeOutId);
  timeOutId = setTimeout(updateIcon, 100);
});
// 頁籤切換
chrome.tabs.onSelectionChanged.addListener(updateIcon);

updateIcon();

/***/ })

/******/ });
//# sourceMappingURL=background.js.map