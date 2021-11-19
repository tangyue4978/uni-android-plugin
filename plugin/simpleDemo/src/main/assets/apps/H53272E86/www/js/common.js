function toInitVpn() {
	plus.plugintest.initVpn({
		ip: '1.71.182.98',
		tport: 8443,
		uport: 0,
		timeout: 5
	}, (ret) => {
		let _result = JSON.parse(ret[0])

		mui.toast(_result.msg)
	})
}

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

function toStartVpn() {
	plus.plugintest.startVpn(null, (ret) => {
		let _result = JSON.parse(ret[0])

		mui.toast(_result.msg)
	})
}

function toCloseVpn() {
	plus.plugintest.closeVpn(null, (ret) => {
		let _result = JSON.parse(ret[0])

		mui.toast(_result.msg)
	})
}

function toCheckVpn() {
	plus.plugintest.checkVpn(null, (ret) => {
		let _result = JSON.parse(ret[0])

		mui.toast(_result.msg)
	})
}
