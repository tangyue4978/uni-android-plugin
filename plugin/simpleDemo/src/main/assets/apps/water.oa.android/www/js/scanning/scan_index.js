var root = localStorage.getItem("str_url");
if (root == "" || root == undefined || root == null) {
	mui.openWindow({
		url: 'login.html?cid=1', //通过URL传参
		id: 'login.html?cid=1', //通过URL传参
	})
}
var token = localStorage.getItem("token");
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	console.log(JSON.stringify(self.opener().id))
	if (self.opener().id == 'scan_binding.html') {
		plus.webview.currentWebview().opener().close();
	}
	// 初始化调用扫码
	getBarcode()
})

function scanCodeInfo(code) {
	console.log(code)
	let _url = root + 'api/assets_manage/index';
	console.log(_url);
	mui.ajax(_url, {
		data: {
			token: token,
			serial_number:code
		},
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(res) {
			console.log(JSON.stringify(res))
			plus.nativeUI.closeWaiting();
			if (res.code == 1) {
				mui.openWindow({
					url: 'scan_binding.html', //通过URL传参
					id: 'scan_binding.html', //通过URL传参
					createNew:true,
					extras: {
					    bar_code: res.code_number,
						apiurl:res.url
					},
				})
			} else if(res.code == 2){
				// mui.openWindow({
				// 	url: 'scan_binded.html', //通过URL传参
				// 	id: 'scan_binded.html', //通过URL传参
				// 	extras: {
				// 	    bar_code: res.code_number,
				// 		apiurl:res.url
				// 	},
				// })
				var codeNmber = res.code_number;
				console.log(codeNmber)
				mui.openWindow({
					url: './scan_info.html', //通过URL传参
					id: 'scan_info.html', //通过URL传参
					createNew:true,
					extras: {
					    bar_code: codeNmber
					},
				})
			}else {
				plus.nativeUI.toast(res.msg)
			}
		},
		error: function(xhr, type, errorThrown) {
			console.log(errorThrown)
			plus.nativeUI.closeWaiting();
		}
	})
}
