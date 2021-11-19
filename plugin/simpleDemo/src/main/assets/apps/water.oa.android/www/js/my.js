(function($, doc) {

//	$.init({
//		preloadPages: [{
//			url: 'reviseInfo.html',
//			id: 'reviseInfo.html',
//			styles: {
//
//			},
//			extras: {}
//		}]
//	})
	document.getElementById('xiugaiziliao').addEventListener('tap', function() {
		mui.openWindow({
			url: 'reviseInfo.html', //通过URL传参
			id: 'reviseInfo.html'
		})
	});
	document.getElementById('editPassword').addEventListener('tap', function() {
		mui.openWindow({
			url: 'editPassword.html', //通过URL传参
			id: 'editPassword.html'
		})
	});
	
	document.getElementById('bzhfk').addEventListener('tap', function() {
		mui.openWindow({
			url: 'help_feedback.html', //通过URL传参
			id: 'help_feedback.html'
		})
	});
	//获取数据
	var root = localStorage.getItem("str_url");
//	if(root == "" || root == undefined || root == null) {
//		mui.openWindow({
//			url: 'login.html?cid=1', //通过URL传参
//			id: 'login.html?cid=1', //通过URL传参
//		})
//	}
	var token = localStorage.getItem("token");
	function mainList() {
		var _url = root + 'api/user/'
		console.log(_url)
		mui.ajax(_url, {
			data: {
				"token": token,
			},
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			success: function(data) {
				console.log(JSON.stringify(data))
				if(data.code == 1) {
					if(data.data.phone != null&&data.data.phone != undefined&&data.data.phone != "") {
						document.getElementById('phone').innerHTML = data.data.phone;
					}else{
						document.getElementById('phone').innerHTML =  "暂无联系方式";
					}
					document.getElementById('name').innerHTML = data.data.truename;
					document.getElementById('duty').innerHTML = data.data.duty;
					var avatar_img=root+data.data.avatar;
					console.log(avatar_img); 
					if(data.data.avatar != null&&data.data.avatar != undefined&&data.data.avatar != "") {
						document.getElementById('imgId').setAttribute("src",root+"/"+data.data.avatar);
					}else{
						document.getElementById('imgId').setAttribute("src","images/user.png");
					}
					
					// 是否显示扫码控件
					let showScan = data.data.code;
					// showScan = 1
					if(showScan == 1){
						document.getElementById("scanning").style.display = "block"
					}
				}
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				//		console.log(type);
				mui.toast("网络异常！");
			}
		})
	}
	mainList()

	mui.plusReady(function() {
		// 在这里调用plus api
		var ws = plus.webview.currentWebview();

	});
//	window.addEventListener('refresh', function(e) { //执行刷新
//		location.reload();
//	});

//	document.getElementById("tuichu").addEventListener('tap', function() {
////		plus.storage.clear();
////		localStorage.clear();
//		mui.openWindow({
//			url: 'login.html?cid=1',
//			id: 'login.html?cid=1',
//		});
//		var list=plus.webview.getWebviewById("login.html");
//		mui.fire(list, 'refresh');
//	})

}(mui, document));