(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["index"],{

/***/ "./node_modules/_mini-css-extract-plugin@0.9.0@mini-css-extract-plugin/dist/loader.js?!./node_modules/_css-loader@1.0.1@css-loader/index.js?!./node_modules/_postcss-loader@3.0.0@postcss-loader/src/index.js?!./src/pages/index/index.css":
/*!**********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/_mini-css-extract-plugin@0.9.0@mini-css-extract-plugin/dist/loader.js??ref--6-1!./node_modules/_css-loader@1.0.1@css-loader??ref--6-2!./node_modules/_postcss-loader@3.0.0@postcss-loader/src??ref--6-3!./src/pages/index/index.css ***!
  \**********************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./src/pages/index/index.css":
/*!***********************************!*\
  !*** ./src/pages/index/index.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../node_modules/_mini-css-extract-plugin@0.9.0@mini-css-extract-plugin/dist/loader.js??ref--6-1!../../../node_modules/_css-loader@1.0.1@css-loader??ref--6-2!../../../node_modules/_postcss-loader@3.0.0@postcss-loader/src??ref--6-3!./index.css */ "./node_modules/_mini-css-extract-plugin@0.9.0@mini-css-extract-plugin/dist/loader.js?!./node_modules/_css-loader@1.0.1@css-loader/index.js?!./node_modules/_postcss-loader@3.0.0@postcss-loader/src/index.js?!./src/pages/index/index.css");

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

/***/ "./src/pages/index/index.js":
/*!**********************************!*\
  !*** ./src/pages/index/index.js ***!
  \**********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var crypto_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! crypto-js */ "./node_modules/_crypto-js@4.0.0@crypto-js/index.js");
/* harmony import */ var crypto_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(crypto_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var enc__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! enc */ "./node_modules/_enc@0.4.0@enc/index.js");
/* harmony import */ var enc__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(enc__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var vconsole__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vconsole */ "./node_modules/_vconsole@3.8.1@vconsole/dist/vconsole.min.js");
/* harmony import */ var vconsole__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(vconsole__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var js_jquery_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! js/jquery.js */ "./src/js/jquery.js");
/* harmony import */ var js_jquery_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(js_jquery_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var js_transcode_worker_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! js/transcode.worker.js */ "./src/js/transcode.worker.js");
/* harmony import */ var js_transcode_worker_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(js_transcode_worker_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _index_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./index.css */ "./src/pages/index/index.css");
/* harmony import */ var _index_css__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_index_css__WEBPACK_IMPORTED_MODULE_5__);
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Created by lycheng on 2019/8/1.
 *
 * 语音听写流式 WebAPI 接口调用示例 接口文档（必看）：https://doc.xfyun.cn/rest_api/语音听写（流式版）.html
 * webapi 听写服务参考帖子（必看）：http://bbs.xfyun.cn/forum.php?mod=viewthread&tid=38947&extra=
 * 语音听写流式WebAPI 服务，热词使用方式：登陆开放平台https://www.xfyun.cn/后，找到控制台--我的应用---语音听写---个性化热词，上传热词
 * 注意：热词只能在识别的时候会增加热词的识别权重，需要注意的是增加相应词条的识别率，但并不是绝对的，具体效果以您测试为准。
 * 错误码链接：
 * https://www.xfyun.cn/doc/asr/voicedictation/API.html#%E9%94%99%E8%AF%AF%E7%A0%81
 * https://www.xfyun.cn/document/error-code （code返回错误码时必看）
 * 语音听写流式WebAPI 服务，方言或小语种试用方法：登陆开放平台https://www.xfyun.cn/后，在控制台--语音听写（流式）--方言/语种处添加
 * 添加后会显示该方言/语种的参数值
 *
 */
// 1. websocket连接：判断浏览器是否兼容，获取websocket url并连接，这里为了方便本地生成websocket url
// 2. 获取浏览器录音权限：判断浏览器是否兼容，获取浏览器录音权限，
// 3. js获取浏览器录音数据
// 4. 将录音数据处理为文档要求的数据格式：采样率16k或8K、位长16bit、单声道；该操作属于纯数据处理，使用webWork处理
// 5. 根据要求（采用base64编码，每次发送音频间隔40ms，每次发送音频字节数1280B）将处理后的数据通过websocket传给服务器，
// 6. 实时接收websocket返回的数据并进行处理
// ps: 该示例用到了es6中的一些语法，建议在chrome下运行






var transWorker = new js_transcode_worker_js__WEBPACK_IMPORTED_MODULE_4___default.a(); //APPID，APISecret，APIKey在控制台-我的应用-语音听写（流式版）页面获取

var APPID = 'd582f900';
var API_SECRET = 'ZTIxMjBkZjc0N2Y2OTgzZTBiMzQ1YTQw';
var API_KEY = '76f240763bf6d3469572f16b15999e23';
/**
 * 获取websocket url
 * 该接口需要后端提供，这里为了方便前端处理
 */

function getWebSocketUrl() {
  return new Promise(function (resolve, reject) {
    // 请求地址根据语种不同变化
    var url = 'wss://iat-api.xfyun.cn/v2/iat';
    var host = 'iat-api.xfyun.cn';
    var apiKey = API_KEY;
    var apiSecret = API_SECRET;
    var date = new Date().toGMTString();
    var algorithm = 'hmac-sha256';
    var headers = 'host date request-line';
    var signatureOrigin = "host: ".concat(host, "\ndate: ").concat(date, "\nGET /v2/iat HTTP/1.1");
    var signatureSha = crypto_js__WEBPACK_IMPORTED_MODULE_0___default.a.HmacSHA256(signatureOrigin, apiSecret);
    var signature = crypto_js__WEBPACK_IMPORTED_MODULE_0___default.a.enc.Base64.stringify(signatureSha);
    var authorizationOrigin = "api_key=\"".concat(apiKey, "\", algorithm=\"").concat(algorithm, "\", headers=\"").concat(headers, "\", signature=\"").concat(signature, "\"");
    var authorization = btoa(authorizationOrigin);
    url = "".concat(url, "?authorization=").concat(authorization, "&date=").concat(date, "&host=").concat(host);
    resolve(url);
  });
}

var IatRecorder = /*#__PURE__*/function () {
  function IatRecorder() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        language = _ref.language,
        accent = _ref.accent,
        appId = _ref.appId;

    _classCallCheck(this, IatRecorder);

    var self = this;
    this.status = 'null';
    this.language = language || 'zh_cn';
    this.accent = accent || 'mandarin';
    this.appId = appId || APPID; // 记录音频数据

    this.audioData = []; // 记录听写结果

    this.resultText = ''; // wpgs下的听写结果需要中间状态辅助记录

    this.resultTextTemp = '';

    transWorker.onmessage = function (event) {
      var _self$audioData;

      (_self$audioData = self.audioData).push.apply(_self$audioData, _toConsumableArray(event.data));
    };
  } // 修改录音听写状态


  _createClass(IatRecorder, [{
    key: "setStatus",
    value: function setStatus(status) {
      this.onWillStatusChange && this.status !== status && this.onWillStatusChange(this.status, status);
      this.status = status;
    }
  }, {
    key: "setResultText",
    value: function setResultText() {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          resultText = _ref2.resultText,
          resultTextTemp = _ref2.resultTextTemp;

      this.onTextChange && this.onTextChange(resultTextTemp || resultText || '');
      resultText !== undefined && (this.resultText = resultText);
      resultTextTemp !== undefined && (this.resultTextTemp = resultTextTemp);
    } // 修改听写参数

  }, {
    key: "setParams",
    value: function setParams() {
      var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          language = _ref3.language,
          accent = _ref3.accent;

      language && (this.language = language);
      accent && (this.accent = accent);
    } // 连接websocket

  }, {
    key: "connectWebSocket",
    value: function connectWebSocket() {
      var _this = this;

      return getWebSocketUrl().then(function (url) {
        var iatWS;
		console.log(url);
        if ('WebSocket' in window) {
          iatWS = new WebSocket(url);
        } else if ('MozWebSocket' in window) {
          iatWS = new MozWebSocket(url);
        } else {
          alert('浏览器不支持WebSocket');
          return;
        }

        _this.webSocket = iatWS;

        _this.setStatus('init');

        iatWS.onopen = function (e) {
          _this.setStatus('ing'); // 重新开始录音


          setTimeout(function () {
            _this.webSocketSend();
          }, 500);
        };

        iatWS.onmessage = function (e) {
          _this.result(e.data);
        };

        iatWS.onerror = function (e) {
          _this.recorderStop();
        };

        iatWS.onclose = function (e) {
          _this.recorderStop();
        };
      });
    } // 初始化浏览器录音

  }, {
    key: "recorderInit",
    value: function recorderInit() {
      var _this2 = this;

      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia; // 创建音频环境

      try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.audioContext.resume();

        if (!this.audioContext) {
          alert('浏览器不支持webAudioApi相关接口');
          return;
        }
      } catch (e) {
        if (!this.audioContext) {
          alert('浏览器不支持webAudioApi相关接口');
          return;
        }
      } // 获取浏览器录音权限


      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false
        }).then(function (stream) {
          getMediaSuccess(stream);
        }).catch(function (e) {
          getMediaFail(e);
        });
      } else if (navigator.getUserMedia) {
        navigator.getUserMedia({
          audio: true,
          video: false
        }, function (stream) {
          getMediaSuccess(stream);
        }, function (e) {
          getMediaFail(e);
        });
      } else {
        if (navigator.userAgent.toLowerCase().match(/chrome/) && location.origin.indexOf('https://') < 0) {
          alert('chrome下获取浏览器录音功能，因为安全性问题，需要在localhost或127.0.0.1或https下才能获取权限');
        } else {
          alert('无法获取浏览器录音功能，请升级浏览器或使用chrome');
        }

        this.audioContext && this.audioContext.close();
        return;
      } // 获取浏览器录音权限成功的回调


      var getMediaSuccess = function getMediaSuccess(stream) {
        console.log('getMediaSuccess'); // 创建一个用于通过JavaScript直接处理音频

        _this2.scriptProcessor = _this2.audioContext.createScriptProcessor(0, 1, 1);

        _this2.scriptProcessor.onaudioprocess = function (e) {
          // 去处理音频数据
          if (_this2.status === 'ing') {
            transWorker.postMessage(e.inputBuffer.getChannelData(0));
          }
        }; // 创建一个新的MediaStreamAudioSourceNode 对象，使来自MediaStream的音频可以被播放和操作


        _this2.mediaSource = _this2.audioContext.createMediaStreamSource(stream); // 连接

        _this2.mediaSource.connect(_this2.scriptProcessor);

        _this2.scriptProcessor.connect(_this2.audioContext.destination);

        _this2.connectWebSocket();
      };

      var getMediaFail = function getMediaFail(e) {
        alert('请求麦克风失败');
        console.log(e);
        _this2.audioContext && _this2.audioContext.close();
        _this2.audioContext = undefined; // 关闭websocket

        if (_this2.webSocket && _this2.webSocket.readyState === 1) {
          _this2.webSocket.close();
        }
      };
    }
  }, {
    key: "recorderStart",
    value: function recorderStart() {
      if (!this.audioContext) {
        this.recorderInit();
      } else {
        this.audioContext.resume();
        this.connectWebSocket();
      }
    } // 暂停录音

  }, {
    key: "recorderStop",
    value: function recorderStop() {
      // safari下suspend后再次resume录音内容将是空白，设置safari下不做suspend
      if (!(/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgen))) {
        this.audioContext && this.audioContext.suspend();
      }

      this.setStatus('end');
    } // 处理音频数据
    // transAudioData(audioData) {
    //   audioData = transAudioData.transaction(audioData)
    //   this.audioData.push(...audioData)
    // }
    // 对处理后的音频数据进行base64编码，

  }, {
    key: "toBase64",
    value: function toBase64(buffer) {
      var binary = '';
      var bytes = new Uint8Array(buffer);
      var len = bytes.byteLength;

      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }

      return window.btoa(binary);
    } // 向webSocket发送数据

  }, {
    key: "webSocketSend",
    value: function webSocketSend() {
      var _this3 = this;

      if (this.webSocket.readyState !== 1) {
        return;
      }

      var audioData = this.audioData.splice(0, 1280);
      var params = {
        common: {
          app_id: this.appId
        },
        business: {
          language: this.language,
          //小语种可在控制台--语音听写（流式）--方言/语种处添加试用
          domain: 'iat',
          accent: this.accent,
          //中文方言可在控制台--语音听写（流式）--方言/语种处添加试用
          vad_eos: 5000,
          dwa: 'wpgs' //为使该功能生效，需到控制台开通动态修正功能（该功能免费）

        },
        data: {
          status: 0,
          format: 'audio/L16;rate=16000',
          encoding: 'raw',
          audio: this.toBase64(audioData)
        }
      };
      this.webSocket.send(JSON.stringify(params));
      this.handlerInterval = setInterval(function () {
        // websocket未连接
        if (_this3.webSocket.readyState !== 1) {
          _this3.audioData = [];
          clearInterval(_this3.handlerInterval);
          return;
        }

        if (_this3.audioData.length === 0) {
          if (_this3.status === 'end') {
            _this3.webSocket.send(JSON.stringify({
              data: {
                status: 2,
                format: 'audio/L16;rate=16000',
                encoding: 'raw',
                audio: ''
              }
            }));

            _this3.audioData = [];
            clearInterval(_this3.handlerInterval);
          }

          return false;
        }

        audioData = _this3.audioData.splice(0, 1280); // 中间帧

        _this3.webSocket.send(JSON.stringify({
          data: {
            status: 1,
            format: 'audio/L16;rate=16000',
            encoding: 'raw',
            audio: _this3.toBase64(audioData)
          }
        }));
      }, 40);
    }
  }, {
    key: "result",
    value: function result(resultData) {
      // 识别结束
      var jsonData = JSON.parse(resultData);

      if (jsonData.data && jsonData.data.result) {
        var data = jsonData.data.result;
        var str = '';
        var resultStr = '';
        var ws = data.ws;

        for (var i = 0; i < ws.length; i++) {
          str = str + ws[i].cw[0].w;
        } // 开启wpgs会有此字段(前提：在控制台开通动态修正功能)
        // 取值为 "apd"时表示该片结果是追加到前面的最终结果；取值为"rpl" 时表示替换前面的部分结果，替换范围为rg字段


        if (data.pgs) {
          if (data.pgs === 'apd') {
            // 将resultTextTemp同步给resultText
            this.setResultText({
              resultText: this.resultTextTemp
            });
          } // 将结果存储在resultTextTemp中


          this.setResultText({
            resultTextTemp: this.resultText + str
          });
        } else {
          this.setResultText({
            resultText: this.resultText + str
          });
        }
      }

      if (jsonData.code === 0 && jsonData.data.status === 2) {
        this.webSocket.close();
      }

      if (jsonData.code !== 0) {
        this.webSocket.close();
        console.log("".concat(jsonData.code, ":").concat(jsonData.message));
      }
    }
  }, {
    key: "start",
    value: function start() {
      this.recorderStart();
      this.setResultText({
        resultText: '',
        resultTextTemp: ''
      });
    }
  }, {
    key: "stop",
    value: function stop() {
      this.recorderStop();
    }
  }]);

  return IatRecorder;
}(); // ======================开始调用=============================


var vConsole = new vconsole__WEBPACK_IMPORTED_MODULE_2___default.a();
var iatRecorder = new IatRecorder();
var countInterval; // 状态改变时处罚

iatRecorder.onWillStatusChange = function (oldStatus, status) {
  var _this4 = this;

  // 可以在这里进行页面中一些交互逻辑处理：倒计时（听写只有60s）,录音的动画，按钮交互等
  // 按钮中的文字
  var text = {
    null: '开始识别',
    // 最开始状态
    init: '开始识别',
    // 初始化状态
    ing: '结束识别',
    // 正在录音状态
    end: '开始识别' // 结束状态

  };
  var senconds = 0;
  $('.taste-button').removeClass("status-".concat(oldStatus)).addClass("status-".concat(status)).text(text[status]);

  if (status === 'ing') {
    $('hr').addClass('hr');
    $('.taste-content').css('display', 'none');
    $('.start-taste').addClass('flex-display-1'); // 倒计时相关

    countInterval = setInterval(function () {
      senconds++;
      $('.used-time').text("0".concat(Math.floor(senconds / 60), "\uFF1A").concat(Math.floor(senconds / 10)).concat(senconds % 10));

      if (senconds >= 60) {
        _this4.stop();

        clearInterval(countInterval);
      }
    }, 1000);
  } else if (status === 'init') {
    $('.time-box').show();
    $('.used-time').text('00：00');
  } else {
    $('.time-box').hide();
    $('hr').removeClass('hr');
    clearInterval(countInterval);
  }
}; // 监听识别结果的变化


iatRecorder.onTextChange = function (text) {
  $('#result_output').text(text);
};

$('#taste_button, .taste-button').click(function () {
  if (iatRecorder.status === 'ing') {
    iatRecorder.stop();
  } else {
    iatRecorder.start();
  }
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./node_modules/_jquery@3.6.0@jquery/dist/jquery.js")))

/***/ })

},[[1,"runtime","jquery","commons"]]]);