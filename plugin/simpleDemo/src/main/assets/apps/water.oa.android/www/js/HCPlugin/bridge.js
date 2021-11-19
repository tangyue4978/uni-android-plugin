(function() {
	document.addEventListener("plusready", function() {
		var _BARCODE = 'pluginhcnet' // 插件
		var _bridge = window.plus.bridge
	
		var pluginhcnet = {
			initHCNet: function(Argus1, successCallback, errorCallback) {
				var success = typeof successCallback !== 'function' ? null : function(args) {
						successCallback(args);
					},
					fail = typeof errorCallback !== 'function' ? null : function(code) {
						errorCallback(code);
					};
				callbackID = _bridge.callbackId(success, fail);
	
				return _bridge.exec(_BARCODE, "initHCNet", [callbackID, Argus1]);
			},
			
			addHCNetDevice: function(Argus1, successCallback, errorCallback) {
				var success = typeof successCallback !== 'function' ? null : function(args) {
						successCallback(args);
					},
					fail = typeof errorCallback !== 'function' ? null : function(code) {
						errorCallback(code);
					};
				callbackID = _bridge.callbackId(success, fail);
				
				return _bridge.exec(_BARCODE, "addHCNetDevice", [callbackID, Argus1]);
			},
			
			createHCVideo: function(Argus1, successCallback, errorCallback) {
				var success = typeof successCallback !== 'function' ? null : function(args) {
						successCallback(args);
					},
					fail = typeof errorCallback !== 'function' ? null : function(code) {
						errorCallback(code);
					};
				callbackID = _bridge.callbackId(success, fail);
				
				return _bridge.exec(_BARCODE, "createHCVideo", [callbackID, Argus1]);
			}
		}
	
		window.plus.pluginhcnet = pluginhcnet
	}, true);
})()