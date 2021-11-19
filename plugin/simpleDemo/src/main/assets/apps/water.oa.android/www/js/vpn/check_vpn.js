// 扩展API加载完毕后调用onPlusReady回调函数
document.addEventListener("plusready", onPlusReady, false);

function onPlusReady() {
	document.addEventListener("resume", onAppReume, false);
}

function onAppReume() {
	plus.plugintest.checkVpn(null, (ret) => {
		let _loginResult = JSON.parse(ret[0]);

		if (_loginResult.code == -1) {
			mui.toast('vpn 失效，请重新登录');

			setTimeout(() => {
				plus.nativeUI.closeWaiting()
				plus.runtime.restart()
			}, 1500)
		}
	})
}
