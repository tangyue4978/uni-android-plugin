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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/ 	__webpack_require__.p = "../";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./node_modules/_babel-loader@8.2.2@babel-loader/lib/index.js?!./src/js/transcode.worker.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/_babel-loader@8.2.2@babel-loader/lib/index.js?!./src/js/transcode.worker.js":
/*!**************************************************************************************************!*\
  !*** ./node_modules/_babel-loader@8.2.2@babel-loader/lib??ref--5-0!./src/js/transcode.worker.js ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
 * @Autor: lycheng
 * @Date: 2020-01-07 08:51:50
 */
(function () {
  self.onmessage = function (e) {
    transAudioData.transcode(e.data);
  };

  var transAudioData = {
    transcode: function transcode(audioData) {
      var output = transAudioData.to16kHz(audioData);
      output = transAudioData.to16BitPCM(output);
      output = Array.from(new Uint8Array(output.buffer));
      self.postMessage(output); // return output
    },
    to16kHz: function to16kHz(audioData) {
      var data = new Float32Array(audioData);
      var fitCount = Math.round(data.length * (16000 / 44100));
      var newData = new Float32Array(fitCount);
      var springFactor = (data.length - 1) / (fitCount - 1);
      newData[0] = data[0];

      for (var i = 1; i < fitCount - 1; i++) {
        var tmp = i * springFactor;
        var before = Math.floor(tmp).toFixed();
        var after = Math.ceil(tmp).toFixed();
        var atPoint = tmp - before;
        newData[i] = data[before] + (data[after] - data[before]) * atPoint;
      }

      newData[fitCount - 1] = data[data.length - 1];
      return newData;
    },
    to16BitPCM: function to16BitPCM(input) {
      var dataLength = input.length * (16 / 8);
      var dataBuffer = new ArrayBuffer(dataLength);
      var dataView = new DataView(dataBuffer);
      var offset = 0;

      for (var i = 0; i < input.length; i++, offset += 2) {
        var s = Math.max(-1, Math.min(1, input[i]));
        dataView.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      }

      return dataView;
    }
  };
})();

/***/ })

/******/ });