// 初始化 vpn
function toInitVpn() {
	plus.plugintest.initVpn({
		ip: '1.71.182.98',
		tport: 8443,
		uport: 0,
		timeout: 5
	}, (ret) => {
		let _result = JSON.parse(ret[0])

		if (_result.code == 2) { // ping 地址成功
			mui.openWindow({
				url: 'login.html',
				id: 'login.html',
				createNew: true
			});
		} else {
			$('.container .layer_box').hide()
		}
		mui.toast(_result.msg)
	})
}

// vpn 账号密码登录
function toLoginVpn() {
	plus.plugintest.loginVpn({
		// account: 'sgxk_xxy_hl5',
		// password: 'Xxy@soft.com_369'
		account: 'test_001',
		password: 'xfj_admin@123'
	}, (ret) => {
		let _result = JSON.parse(ret[0])

		mui.toast(_result.msg)
	})
}

// 开启 vpn
function toStartVpn() {
	plus.plugintest.startVpn(null, (ret) => {
		let _result = JSON.parse(ret[0])

		mui.toast(_result.msg)
	})
}

// 关闭并退出 vpn
function toCloseVpn() {
	plus.plugintest.closeVpn(null, (ret) => {
		let _result = JSON.parse(ret[0])

		mui.toast(_result.msg)
	})
}

// 检测当前 vpn 连接状态
function toCheckVpn() {
	plus.plugintest.checkVpn(null, (ret) => {
		let _result = JSON.parse(ret[0])

		mui.toast(_result.msg)
	})
}

// 设置 vpn mode（需要退出登录后才有用）
// 设置 vpn 模式：0: vpn连接后可访问互联网资源； 1：vpn连接后只可访问内部资源
function toSetVpnMode() {
	plus.plugintest.setVpnMode({
		mode: 0
	}, (ret) => {
		let _result = JSON.parse(ret[0])

		mui.toast(_result.msg)
	})
}