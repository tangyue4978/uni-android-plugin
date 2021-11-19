var root = localStorage.getItem("str_url");
if(root == "" || root == undefined || root == null){
		mui.openWindow({
		url: 'login.html?cid=1', //通过URL传参
		id: 'login.html?cid=1', //通过URL传参
	})
}
var token = localStorage.getItem("token");
var obj_data = {};
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	// plus.nativeUI.showWaiting("加载中...");
	obj_data.token = token;
	obj_data.id = self.item_id;
	console.log(obj_data.id);
})
			