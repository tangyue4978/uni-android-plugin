# 文档说明

## websocket连接

1. 连接地址需要后端提供，

下面是接口鉴权示例（以tts为例），需要引入`enc-base64-min.js` `hmac-sha256.js`
```js示例
const API_KEY = 'xxx'
const API_SECRET = 'xxx'
function getWebsocketUrl() {
  return new Promise((resolve, reject) => {
    var apiKey = API_KEY
    var apiSecret = API_SECRET
    var url = 'wss://tts-api.xfyun.cn/v2/tts'
    var host = location.host
    var date = new Date().toGMTString()
    var algorithm = 'hmac-sha256'
    var headers = 'host date request-line'
    var signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/tts HTTP/1.1`
    var signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret)
    var signature = CryptoJS.enc.Base64.stringify(signatureSha)
    var authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`
    var authorization = btoa(authorizationOrigin)
    url = `${url}?authorization=${authorization}&date=${date}&host=${host}`
    resolve(url)
  })
}
```

## 兼容性

1. 流式接口需要浏览器支持websocket
2. 录音/播放需要浏览器支持webAudioAPI及相关API，兼容性请查看：https://www.caniuse.com/#search=Web%20Audio%20API
3. 移动端对录音接口支持请自行验证
4. chrome下获取浏览器录音功能，因为安全性问题，需要在localhost或127.0.0.1或https下才能获取权限
5. 本地ip测试可以在火狐浏览器下测试

## 数据格式转换

1. 了解[ArreyBuffer](http://es6.ruanyifeng.com/#docs/arraybuffer)

2. [代码](/data/transcode.js)

## 浏览器录音 [文档](https://developer.mozilla.org/zh-CN/docs/Web/API/AudioContext)

1. 获取录音权限`MediaDevices.getUserMedia()` 
[文档](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices/getUserMedia)

2. 创建音频处理环境
`let audioContext = new (window.AudioContext || window.webkitAudioContext)`
[文档](https://developer.mozilla.org/zh-CN/docs/Web/API/AudioContext)

3. 创建一个用于通过JavaScript直接处理音频
`let scriptProcessor = audioContext.createScriptProcessor(0, 1, 1)`
[文档](https://developer.mozilla.org/zh-CN/docs/Web/API/AudioContext/createScriptProcessor)

4. 创建一个新的MediaStreamAudioSourceNode 对象，使来自MediaStream的音频可以被播放和操作 
`let mediaSource = audioContext.createMediaStreamSource(stream)`
[文档](https://developer.mozilla.org/zh-CN/docs/Web/API/AudioContext/createMediaStreamSource)

5. 连接`scriptProcessor`与`mediaSource` `mediaSource.connect(scriptProcessor)`

6. `scriptProcessor`连接到输出设备，`scriptProcessor.connect(audioContext.destination)`

7. 暂停录音`audioContext.suspend()`

8. 继续录音`audioContext.resume()`

9. js读取并处理音频流

```
scriptProcessor.onaudioprocess = function(e) {
  console.log(e.inputBuffer.getChannelData(0))
  // 得到float 32bit的数组
  // 降采样，数据格式转换，base64编码。。。
}
```
10. ps: 获取浏览器录音权限、音频处理环境请在用户操作（如点击）之后

## 部署到服务器
1. 决定部署到服务器的文件夹。
如果是根目录直接运行第二步，
如果非根目录，如：test，请将build/config中的build.assetsPublicPath改为/test/，然后运行第二步
2. 打开cmd，进入demo目录，执行如下命令
 ```
 npm install
 npm run build
 ```
 3. 将第二步编译后的dist文件夹中的内容（非dist）复制到指定的文件夹
