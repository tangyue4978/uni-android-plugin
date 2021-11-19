(function() {
	document.addEventListener("plusready", function() {
		var _BARCODE = 'plugintest' // 插件
		var _bridge = window.plus.bridge
	
		var plugintest = {
			initVpn: function(Argus1, successCallback, errorCallback) {
				var success = typeof successCallback !== 'function' ? null : function(args) {
						successCallback(args);
					},
					fail = typeof errorCallback !== 'function' ? null : function(code) {
						errorCallback(code);
					};
				callbackID = _bridge.callbackId(success, fail);
	
				return _bridge.exec(_BARCODE, "initVpn", [callbackID, Argus1]);
			},
	
			loginVpn: function(Argus1, successCallback, errorCallback) {
				var success = typeof successCallback !== 'function' ? null : function(args) {
						successCallback(args);
					},
					fail = typeof errorCallback !== 'function' ? null : function(code) {
						errorCallback(code);
					};
				callbackID = _bridge.callbackId(success, fail);
	
				return _bridge.exec(_BARCODE, "loginVpn", [callbackID, Argus1]);
			},
	
			startVpn: function(Argus1, successCallback, errorCallback) {
				var success = typeof successCallback !== 'function' ? null : function(args) {
						successCallback(args);
					},
					fail = typeof errorCallback !== 'function' ? null : function(code) {
						errorCallback(code);
					};
				callbackID = _bridge.callbackId(success, fail);
	
				return _bridge.exec(_BARCODE, "startVpn", [callbackID, Argus1]);
			},
	
			closeVpn: function(Argus1, successCallback, errorCallback) {
				var success = typeof successCallback !== 'function' ? null : function(args) {
						successCallback(args);
					},
					fail = typeof errorCallback !== 'function' ? null : function(code) {
						errorCallback(code);
					};
				callbackID = _bridge.callbackId(success, fail);
	
				return _bridge.exec(_BARCODE, "closeVpn", [callbackID, Argus1]);
			},
	
			checkVpn: function(Argus1, successCallback, errorCallback) {
				var success = typeof successCallback !== 'function' ? null : function(args) {
						successCallback(args);
					},
					fail = typeof errorCallback !== 'function' ? null : function(code) {
						errorCallback(code);
					};
				callbackID = _bridge.callbackId(success, fail);
	
				return _bridge.exec(_BARCODE, "checkVpn", [callbackID, Argus1]);
			},
			
			setVpnMode: function(Argus1, successCallback, errorCallback) {
				var success = typeof successCallback !== 'function' ? null : function(args) {
						successCallback(args);
					},
					fail = typeof errorCallback !== 'function' ? null : function(code) {
						errorCallback(code);
					};
				callbackID = _bridge.callbackId(success, fail);
				
				return _bridge.exec(_BARCODE, "setVpnMode", [callbackID, Argus1]);
			},
		}
	
		window.plus.plugintest = plugintest
	}, true);
})()