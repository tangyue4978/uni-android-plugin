(function() {
	//获取缓存判断是否记住密码

	$("#passa").click(function() {
		// console.log($("#passa .icon-xuanzhong").css('display'))
		if($("#passa .icon-xuanzhong").css('display') == 'block') {
			$("#passa").attr("data-remember","0");
			$("#passa .icon-xuanzhong").css('display', "none")
			$("#passa .icon-weixuanzhongkuang").css('display', "block")
		} else {
			$("#passa").attr("data-remember","1");
			$("#passa .icon-xuanzhong").css('display', "block")
			$("#passa .icon-weixuanzhongkuang").css('display', "none")
		}
	})
	if(localStorage.getItem("login_mobile")!=""&&localStorage.getItem("login_mobile")!=undefined&&localStorage.getItem("login_mobile")!=null){
		$("#username").val(localStorage.getItem("login_mobile"));
		$("#password").val(localStorage.getItem("login_password"));
	}
	// 登录处理，还记得我们上一篇写得的按钮关联的事件吧  
	document.getElementById("login").addEventListener('tap', function() {
		//var _url = 'http://wateroa.sxjicheng.com/';
		$(".mui-loading").css("display","block");
		var root = localStorage.getItem("str_url");
		var _mobile = mui('#username')[0].value;
		var _password = mui('#password')[0].value;
		if (_mobile==""||_mobile==null||_mobile==undefined) {
			$(".mui-loading").css("display","none");
			mui.toast("请输入账号");
			return false;
		}
		if (_password==""||_password==null||_password==undefined) {
			$(".mui-loading").css("display","none");
			mui.toast("请输入密码");
			return false;
		}
		document.activeElement.blur(); 
		mui.ajax(root + "api/login/", {
			data: {
				"mobile": mui('#username')[0].value,
				"password": mui('#password')[0].value
			},
			dataType: 'json',
			type: 'post',
			contentType: "application/x-www-form-urlencoded; charset=utf-8",
			timeout: 20000,
			success: function(data) {
				var jizhumima = $("#passa").attr('data-remember');
				if(data.code == 1) {
//					console.log(data.data.token)
					console.log(JSON.stringify(data.data))
					if(jizhumima == "1") {
						localStorage.setItem("login_mobile", mui('#username')[0].value);
						localStorage.setItem("login_password", mui('#password')[0].value);
					}else{
						localStorage.setItem("login_mobile", "");
						localStorage.setItem("login_password", "");
					}
					plus.storage.setItem("plus_token",data.data.token);
					localStorage.setItem("token", data.data.token);
					localStorage.setItem("isHeader", data.data.isHeader);
					if(data.data.status==0){
//						mui.openWindow({
//							url: 'dhy.html',
//							id: 'dhy.html',
//							show: {
//								autoShow: true, 
//								aniShow: "fade-in", 
//								duration: "300"
//							}
//						});
					}else if(data.data.status==1){
						mui.openWindow({
							url: 'main.html',
							id: 'main.html',
							show: {
								autoShow: true, 
								aniShow: "fade-in", 
								duration: "300" 
							},
							createNew: true
						});
					}else if(data.data.status==3){
						mui.openWindow({
							url: 'resetPassword.html',
							id: 'resetPassword.html',
							show: {
								autoShow: true, 
								aniShow: "fade-in", 
								duration: "300" 
							},
							createNew: true
						});
					}else{
						mui.toast(data.msg);
					}
					
					
					$(".mui-loading").css("display","none");
					//					mui.alert("登录成功")
					list=plus.webview.getWebviewById("my.html");
					mui.fire(list, 'refresh');
					

				} else {
					mui.alert(data.msg);
					$(".mui-loading").css("display","none");
				}

			},
			error: function(xhr, type, errorThrown) {
				mui.toast("网络异常,建议检查网络后重新启动。 "+"状态码："+xhr.status+";状态"+xhr.readyState+";"+type); 
				$(".mui-loading").css("display","none");
			}
		});
	});
	//忘记密码
	document.getElementById("forgetPassword").addEventListener('tap', function() {
//		console.log("1")
		mui.openWindow({
			url: 'forgetpass.html',
			id: 'forgetpass.html',
		});
	})

	mui.plusReady(function() {

		mui.oldBack = mui.back;
		var backButtonPress = 0;
		mui.back = function(event) {
			backButtonPress++;
			if(backButtonPress > 1) {
				plus.runtime.quit();
			} else {
				plus.nativeUI.toast('再按一次退出应用');
			}
			setTimeout(function() {
				backButtonPress = 0;
			}, 1000);
			return false;
		};
	});
})()
//清空缓存
//localStorage.clear();

window.addEventListener('refresh', function(e) { //执行刷新
	location.reload();
});