var root = localStorage.getItem("str_url");
// if (root == "" || root == undefined || root == null) {
// 	mui.openWindow({
// 		url: 'login.html?cid=1', //通过URL传参
// 		id: 'login.html?cid=1', //通过URL传参
// 	})
// }
var token = localStorage.getItem("token");
var apis = '';
var dataObj = {};
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	// 获取接口地址
	apis = self.apiurl;
	dataObj.token = token;
	dataObj.code_number = self.bar_code;
	getInfoFun()
})


$('.return').on('click',function(){
	mui.openWindow({
		url: '../../my.html', //通过URL传参
		id: '../../my.html', //通过URL传参
	})
})

//本页面接口
function getInfoFun() {
	let _url = root + apis;
	console.log(_url);
	console.log(JSON.stringify(dataObj))
	mui.ajax(_url, {
		data: dataObj,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(res) {
			plus.nativeUI.closeWaiting();
			if (res.code == 1) {
				console.log(JSON.stringify(res))
				//条码编号
				$('.infos_right.code_number').text(res.data.code_number)
				// 设备序列号
				$('.infos_right.serial_number').text(res.data.serial_number)
				// 主机型号
				$('.infos_right.host_model').text(res.data.host_model)
				// 使用地点
				$('.infos_right.use_site').text(res.data.use_site)
				// 使用方式
				$('.infos_right.usage_mode').text(res.data.usage_mode)
				// 使用人
				$('.infos_right.user').text(res.data.user)
				// 绑定日期
				$('.infos_right.binding_date').text(res.data.binding_date)
				// 备注说明
				if(res.data.remark && res.data.remark != "选填"){
					$('.remarks_area.remark').text(res.data.remark)
				}else{
					$('.remarks_area.remark').text("无")
				}
			} else {
				plus.nativeUI.toast(res.msg)
			}
		},
		error: function(xhr, type, errorThrown) {
			console.log(errorThrown)
			plus.nativeUI.closeWaiting();
		}
	})
}