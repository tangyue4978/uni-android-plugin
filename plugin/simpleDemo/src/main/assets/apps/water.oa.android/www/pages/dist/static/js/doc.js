(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["doc"],{

/***/ "./node_modules/_mini-css-extract-plugin@0.9.0@mini-css-extract-plugin/dist/loader.js?!./node_modules/_css-loader@1.0.1@css-loader/index.js?!./node_modules/_postcss-loader@3.0.0@postcss-loader/src/index.js?!./src/pages/doc/github-markdown.css":
/*!******************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/_mini-css-extract-plugin@0.9.0@mini-css-extract-plugin/dist/loader.js??ref--6-1!./node_modules/_css-loader@1.0.1@css-loader??ref--6-2!./node_modules/_postcss-loader@3.0.0@postcss-loader/src??ref--6-3!./src/pages/doc/github-markdown.css ***!
  \******************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/_mini-css-extract-plugin@0.9.0@mini-css-extract-plugin/dist/loader.js?!./node_modules/_css-loader@1.0.1@css-loader/index.js?!./node_modules/_postcss-loader@3.0.0@postcss-loader/src/index.js?!./src/pages/doc/index.css":
/*!********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/_mini-css-extract-plugin@0.9.0@mini-css-extract-plugin/dist/loader.js??ref--6-1!./node_modules/_css-loader@1.0.1@css-loader??ref--6-2!./node_modules/_postcss-loader@3.0.0@postcss-loader/src??ref--6-3!./src/pages/doc/index.css ***!
  \********************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./src/pages/doc/github-markdown.css":
/*!*******************************************!*\
  !*** ./src/pages/doc/github-markdown.css ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../node_modules/_mini-css-extract-plugin@0.9.0@mini-css-extract-plugin/dist/loader.js??ref--6-1!../../../node_modules/_css-loader@1.0.1@css-loader??ref--6-2!../../../node_modules/_postcss-loader@3.0.0@postcss-loader/src??ref--6-3!./github-markdown.css */ "./node_modules/_mini-css-extract-plugin@0.9.0@mini-css-extract-plugin/dist/loader.js?!./node_modules/_css-loader@1.0.1@css-loader/index.js?!./node_modules/_postcss-loader@3.0.0@postcss-loader/src/index.js?!./src/pages/doc/github-markdown.css");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../node_modules/_style-loader@0.23.1@style-loader/lib/addStyles.js */ "./node_modules/_style-loader@0.23.1@style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./src/pages/doc/index.css":
/*!*********************************!*\
  !*** ./src/pages/doc/index.css ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../node_modules/_mini-css-extract-plugin@0.9.0@mini-css-extract-plugin/dist/loader.js??ref--6-1!../../../node_modules/_css-loader@1.0.1@css-loader??ref--6-2!../../../node_modules/_postcss-loader@3.0.0@postcss-loader/src??ref--6-3!./index.css */ "./node_modules/_mini-css-extract-plugin@0.9.0@mini-css-extract-plugin/dist/loader.js?!./node_modules/_css-loader@1.0.1@css-loader/index.js?!./node_modules/_postcss-loader@3.0.0@postcss-loader/src/index.js?!./src/pages/doc/index.css");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../node_modules/_style-loader@0.23.1@style-loader/lib/addStyles.js */ "./node_modules/_style-loader@0.23.1@style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./src/pages/doc/index.js":
/*!********************************!*\
  !*** ./src/pages/doc/index.js ***!
  \********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _github_markdown_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./github-markdown.css */ "./src/pages/doc/github-markdown.css");
/* harmony import */ var _github_markdown_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_github_markdown_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _index_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.css */ "./src/pages/doc/index.css");
/* harmony import */ var _index_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_index_css__WEBPACK_IMPORTED_MODULE_1__);
/*
 * @Autor: lycheng
 * @Date: 2020-01-13 11:08:41
 */



function httpRequest(url, data, method, success) {
  // 异步对象
  var ajax = new XMLHttpRequest();
  var ajaxData = "_=".concat(new Date().getTime());

  if (data) {
    for (var p in data) {
      ajaxData += "&".concat(p, "=").concat(data[p]);
    }
  } // get 跟post  需要分别写不同的代码


  if (method === 'get') {
    // get请求
    if (data) {
      // 如果有值
      url += '?';
      url += ajaxData;
    } // 设置 方法 以及 url


    ajax.open(method, url); // send即可

    ajax.send();
  } else {
    ajax.open(method, url); // 需要设置请求报文

    ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); // 判断data send发送数据

    if (ajaxData) {
      // 如果有值 从send发送
      ajax.send(ajaxData);
    } else {
      // 木有值 直接发送即可
      ajax.send();
    }
  } // 注册事件


  ajax.onreadystatechange = function () {
    // 在事件中 获取数据 并修改界面显示
    if (ajax.readyState === 4 && ajax.status === 200) {
      try {
        success(JSON.parse(ajax.responseText));
      } catch (e) {
        success(ajax.responseText);
      }
    }
  };
}

httpRequest('/data/doc.readme.md', {}, 'get', function (result) {
  document.getElementById('readme').innerHTML = marked(result);
});

/***/ })

},[[0,"runtime","commons"]]]);