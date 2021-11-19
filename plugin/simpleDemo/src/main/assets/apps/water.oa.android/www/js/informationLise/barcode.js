/**
 * Copyright(C)
 * Author: 小明 172160459@qq.com
 * Date: 2021年06月10日09:10:21
 * Version: 1.0.0
 * Description: 基于mui Barcode 扫码获取数据
 * Function getBarcode: 1.创建扫码识别控件对象;2.扫码识别控件对象;
 * History:
 * Others:	
 **/
var barcodeScan = null;//扫描对象 
function getBarcode() {
	// document.addEventListener("plusready", function() {
		var height = window.innerHeight + 'px';//获取页面实际高度   
		var width = window.innerWidth + 'px';   
		document.getElementById("bcid").style.height= height;   
		document.getElementById("bcid").style.width= width;  
		document.getElementById("bcid").style.zIndex = 2;
		startRecognize(); 
	// }, false)
}

function startRecognize() { //开启扫描
	try {
		console.log(222);
		var filter = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
		//自定义的扫描控件样式   
		var styles = {
			frameColor: "#3990ff",//扫码框颜色
			scanbarColor: "#3990ff",//扫码调颜色
			background: ""
		}
		//扫描控件构造
		barcodeScan = new plus.barcode.Barcode('bcid', filter, styles, true);
		barcodeScan.onmarked = onmarked;
		barcodeScan.onerror = onerror; //扫描错误 
		barcodeScan.start();
		//打开关闭闪光灯处理   
		// var flag = false;
		// document.getElementById("turnTheLight").addEventListener('tap', function() {
		// 	if (flag == false) {
		// 		barcodeScan.setFlash(true);
		// 		flag = true;
		// 	} else {
		// 		barcodeScan.setFlash(false);
		// 		flag = false;
		// 	}
		// });
	} catch (e) {
		console.log("出现错误啦");
		console.log(e);
		alert("出现错误啦:\n" + e);
	}
};

function onerror(e) { //错误弹框 
	console.log('==============')
	// alert(e);
};

function onmarked(type, result) { //这个是扫描二维码的回调函数，type是扫描二维码回调的类型 
	console.log(type);
	var text = '';
	//QR,EAN13,EAN8都是二维码的一种编码格式,result是返回的结果 
	var barcodeArr = ["QR", "EAN13", "EAN8", "AZTEC", "DATAMATRIX",
					  "UPCA", "UPCE", "CODABAR", "CODE39", "CODE93",
					  "CODE128", "ITF", "MAXICODE", "PDF417", "RSS14", "RSSEXPANDED"];
	text = barcodeArr[type];
	// 调用接口
	// scanCodeInfo(result)
	//跳转报修查看页面
	mui.openWindow({
		url: './scan_info_new.html', //通过URL传参
		id: 'scan_info_new.html', //通过URL传参
		createNew:true,
		extras: {
		    bar_code: result
		},
	})
	// alert(text + " : " + result);
	barcodeScan.close();
	document.getElementById("bcid").style.zIndex = -1;
};

// 从相册中选择二维码图片    
function scanPicture() { //可以直接识别二维码图片 
	plus.gallery.pick(function(path) {
		plus.barcode.scan(path, onmarked, function(error) {
			plus.nativeUI.alert("无法识别此图片");
		});
	}, function(err) {
		plus.nativeUI.alert("Failed: " + err.message);
	});
}
