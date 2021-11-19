/**
 * 演示程序当前的 “注册/登录” 等操作，是基于 “本地存储” 完成的
 * 当您要参考这个演示程序进行相关 app 的开发时，
 * 请注意将相关方法调整成 “基于服务端Service” 的实现。
 **/
(function($, owner) {
	/**
	 * 用户登录
	 **/
	owner.login = function(loginInfo, callback) {
		console.log(JSON.stringify(loginInfo))
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.mobile = loginInfo.mobile || '';
		loginInfo.password = loginInfo.password || '';
		if(loginInfo.mobile.length < 11) {
			return callback('请输入正确的手机号码');
		}
		if(loginInfo.password.length < 6) {
			return callback('密码最短为 6 个字符');
		}else {
			var jizhumima = jQuery("#passa .icon-xuanzhong").css('display');
			var root = localStorage.getItem("str_url");
				if(root == "" || root == undefined || root == null) {
					mui.openWindow({
						url: 'login.html?cid=1', //通过URL传参
						id: 'login.html?cid=1', //通过URL传参
					})
				}
		var _url = root+'api/login/';
		mui.ajax(_url, {
			data: loginInfo,
			dataType: 'json',
			type: 'post',
			contentType: "application/x-www-form-urlencoded; charset=utf-8",
			timeout: 60000,
			success: function(data) {
				if(data.code == 1) {
					if(jizhumima == "block") {
						localStorage.setItem('user',JSON.stringify(loginInfo));
						var settings = jizhumima;
						console.log(settings)
						app.setSettings(settings);
					}else{
						var settings = jizhumima;
						console.log(settings)
						app.setSettings(settings);
					}
					localStorage.setItem("token", data.data.token);
					return owner.createState(loginInfo.mobile,data.data.token, callback);
				} else {
					console.log(data.msg)
					mui.alert(data.msg)
				}

			},
			error: function(xhr, type, errorThrown) {}
		});
			
		}
	};

	owner.createState = function(name,token,callback) {
		var state = owner.getState();
		state.mobile = name;
		state.token = token;
		owner.setState(state);
		return callback();
	};

	/**
	 * 新用户注册
	 **/
	owner.reg = function(regInfo, callback) {
		callback = callback || $.noop;
		regInfo = regInfo || {};
		regInfo.mobile = regInfo.mobile || '';
		regInfo.password = regInfo.password || '';
		if(regInfo.mobile.length < 5) {
			return callback('用户名最短需要 5 个字符');
		}
		if(regInfo.password.length < 6) {
			return callback('密码最短需要 6 个字符');
		}
		if(!checkEmail(regInfo.email)) {
			return callback('邮箱地址不合法');
		}
		var users = JSON.parse(localStorage.getItem('$users') || '[]');
		users.push(regInfo);
		localStorage.setItem('$users', JSON.stringify(users));
		return callback();
	};

	/**
	 * 获取当前状态
	 **/
	owner.getState = function() {
		var stateText = localStorage.getItem('$state') || "{}";
		console.log(stateText)
		return JSON.parse(stateText);
	};

	/**
	 * 设置当前状态
	 **/
	owner.setState = function(state) {
		console.log(JSON.stringify(state))
		state = state || {};
		localStorage.setItem('$state', JSON.stringify(state));
		//var settings = owner.getSettings();
		//settings.gestures = '';
		//owner.setSettings(settings);
	};

	var checkEmail = function(email) {
		email = email || '';
		return(email.length > 3 && email.indexOf('@') > -1);
	};

	/**
	 * 找回密码
	 **/
	owner.forgetPassword = function(email, callback) {
		callback = callback || $.noop;
		if(!checkEmail(email)) {
			return callback('邮箱地址不合法');
		}
		return callback(null, '新的随机密码已经发送到您的邮箱，请查收邮件。');
	};

	/**
	 * 获取应用本地配置
	 **/
	owner.setSettings = function(settings) {
		console.log(settings)
		settings = settings || "";
		localStorage.setItem('$settings', JSON.stringify(settings));
	}

	/**
	 * 设置应用本地配置
	 **/
	owner.getSettings = function() {
		var settingsText = localStorage.getItem('$settings') || "{}";
		console.log(settingsText)
		return JSON.parse(settingsText);
	}
	/**
	 * 获取本地是否安装客户端
	 **/
	owner.isInstalled = function(id) {
		console.log(id)
		if(id === 'qihoo' && mui.os.plus) {
			return true;
		}
		if(mui.os.android) {
			var main = plus.android.runtimeMainActivity();
			var packageManager = main.getPackageManager();
			var PackageManager = plus.android.importClass(packageManager)
			var packageName = {
				"qq": "com.tencent.mobileqq",
				"weixin": "com.tencent.mm",
				"sinaweibo": "com.sina.weibo"
			}
			try {
				return packageManager.getPackageInfo(packageName[id], PackageManager.GET_ACTIVITIES);
			} catch(e) {}
		} else {
			switch(id) {
				case "qq":
					var TencentOAuth = plus.ios.import("TencentOAuth");
					return TencentOAuth.iphoneQQInstalled();
				case "weixin":
					var WXApi = plus.ios.import("WXApi");
					return WXApi.isWXAppInstalled()
				case "sinaweibo":
					var SinaAPI = plus.ios.import("WeiboSDK");
					return SinaAPI.isWeiboAppInstalled()
				default:
					break;
			}
		}
	}
}(mui, window.app = {}));