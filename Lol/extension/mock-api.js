!function(e){var t={};function o(n){if(t[n])return t[n].exports;var r=t[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,o),r.l=!0,r.exports}o.m=e,o.c=t,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:n})},o.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=11)}({10:function(e,t){},11:function(e,t,o){"use strict";o.r(t);o(10);let n={},r=!1;function s(e,t){t?e.classList.remove("label--warning"):e.classList.add("label--warning")}function c(){const e=n.mockURL.value.trim(),t=n.status.value.trim(),o=n.response.value.trim(),r=n.timeout.value.trim()||"100-200",c=!!e,u=!!t;let a=!!o;try{JSON.parse(o)}catch(e){a=!1}return s(document.querySelector(".label-url"),c),s(document.querySelector(".label-status"),u),s(document.querySelector(".label-response"),a),{response:o,mockURL:e,timeout:r,status:t}}function u(e){r=!0;const{response:t,mockURL:o,timeout:n,status:s}=c();if(!o||!t||!s)return void new Notification("請確認欄位是否設定完成",{icon:"../icon48.png"});try{JSON.parse(t)}catch(e){return void new Notification("Response 需要 JSON 字串",{icon:"../icon48.png"})}const u={response:t,mockURL:o,timeout:n,status:s};chrome.tabs.query({active:!0,currentWindow:!0},e=>{chrome.tabs.sendMessage(e[0].id,{...u,type:"mock"},e=>{localStorage.setItem("mockExtensionData",JSON.stringify(u))})}),window.close()}function a(e){r&&c()}document.addEventListener("DOMContentLoaded",function(){n={mockURL:document.querySelector("#mockURL"),status:document.querySelector("#status"),response:document.querySelector("#response"),timeout:document.querySelector("#timeout")};let e={response:"",mockURL:"",timeout:"100-200",status:"200"};try{e=JSON.parse(localStorage.getItem("mockExtensionData"))||e}catch(e){localStorage.removeItem("mockExtensionData")}try{n.response.value=JSON.stringify(JSON.parse(e.response),null,2)}catch(t){n.response.value=e.response}n.mockURL.value=e.mockURL,n.timeout.value=e.timeout,n.status.value=e.status;const t=document.querySelectorAll("#btn");for(var o=0;o<t.length;o++)t[o].addEventListener("click",u);Object.keys(n).forEach(e=>{n[e].addEventListener("change",a),n[e].addEventListener("keyup",a)})})}});