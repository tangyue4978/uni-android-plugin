
mui.plusReady(function() {
	var dqweb=plus.webview.currentWebview();
//	console.log(JSON.stringify(dqweb))
	$("nav.mui-bar-tab .mui-tab-item ").on("tap",function(){
//		console.log(dqweb.id);
		var href=$(this).attr("href");
		if(dqweb.id!=href){
//			var w = plus.webview.create(href,href);
//				w.show(href,"fade-in","300");
			mui.openWindow({
				url: href,
				id: href,
				show: {
					autoShow: true, 
					aniShow: "fade-in", 
					duration: "300" 
				},
				createNew: true
			});
			return false;
		}
	})
});
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



//window.onload=function (){
//
//  var userName=”xiaoming”;
//
//  alert(userName);
//
//}