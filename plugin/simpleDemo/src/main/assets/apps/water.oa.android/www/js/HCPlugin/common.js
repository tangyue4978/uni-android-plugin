// 初始化 sdk
function toInitHCNet() {
	plus.pluginhcnet.initHCNet({}, (ret) => {
		let _result = JSON.parse(ret[0])

		mui.toast(_result.msg)
	})
}

// 添加设备
function toAddHCNetDevice() {
	plus.pluginhcnet.addHCNetDevice({
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
	plus.pluginhcnet.startVpn(null, (ret) => {
		let _result = JSON.parse(ret[0])

		mui.toast(_result.msg)
	})
}

// 关闭并退出 vpn
function toCloseVpn() {
	plus.pluginhcnet.closeVpn(null, (ret) => {
		let _result = JSON.parse(ret[0])

		mui.toast(_result.msg)
	})
}

// 检测当前 vpn 连接状态
function toCheckVpn() {
	plus.pluginhcnet.checkVpn(null, (ret) => {
		let _result = JSON.parse(ret[0])

		mui.toast(_result.msg)
	})
}

// 设置 vpn mode（需要退出登录后才有用）
// 设置 vpn 模式：0: vpn连接后可访问互联网资源； 1：vpn连接后只可访问内部资源
function toSetVpnMode() {
	plus.pluginhcnet.setVpnMode({
		mode: 0
	}, (ret) => {
		let _result = JSON.parse(ret[0])

		mui.toast(_result.msg)
	})
}