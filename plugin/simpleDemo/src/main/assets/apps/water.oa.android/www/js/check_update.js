/**
 * @module 版本更新 
 */
//document.addEventListener('plusready', function() {
//		//			alert(plus.os.version);
//		var text1 = [
//			["versionnum", plus.runtime.version]
//		];
//		var ads = "/api/version/checkversion";
//		var jump = " ";
//		interactive(text1, ads, jump, 5);
//	}, false)


function Callback_5(obj) {
	console.log(obj);
	var data = obj.data;
	var status = obj.status;
	var url = obj.url;
	if(status == "1") {
		$(".updated_cont").css("display", "block");
		$(".current_version").css("display", "inline-block");
		$(".current_version .new_version").html(data.versionnum);
		$(".update_title").html("发现新版本");
		$(".updated_cont").html('<pre>' + data.versionintro + '</pre>');
		$("#demo5").css("display", "block");
		$(".update_btn").attr("onclick","download('"+url+"')").html("立即更新");
		var container = mui("#demo5");
		mui(container).progressbar().setProgress(0);
	}else{
		
	}
	plus.nativeUI.closeWaiting();

}

document.addEventListener('plusready', function() {}, false)

function download(d_url) {
	if(mui.os.ios) {
		//var url='itms-apps://itunes.apple.com/cn/app/hello-h5+/id682211190?l=zh&mt=8';// HelloH5应用在appstore的地址
		var ios_url = d_url; 
		plus.runtime.openURL(ios_url);
	} else {
		$("#demo5").css("display", "block");
		$(".pop_ljsj").css("display", "none");
		$(".pop_zzgx").css("display", "block");
		var download_tips = plus.nativeUI.showWaiting("下载中...", {
			zIndex: 999999,
			width: "81%",
			height: "20rem",
			back: "none"
		});
		//下载进度
		var container = mui("#demo5");
		var android_url = d_url;

		mui(container).progressbar({
			progress: 0
		}).show();
		//下载进度
		var dtask = plus.downloader.createDownload(android_url, {
			filename: "_downloads/weater_oa.apk"
		}, function(download, status) {
			plus.nativeUI.closeWaiting();

			var path = download.filename;
			plus.runtime.install(path); // 安装下载的apk文件
			//iOS 跳转
			//var url='itms-apps://itunes.apple.com/cn/app/hello-h5+/id682211190?l=zh&mt=8';// HelloH5应用在appstore的地址
			//plus.runtime.openURL(url);
			//iOS 跳转end
		});
		var up_num = 0;
		dtask.addEventListener("statechanged", function(download, status) {

			//下载进度
			var s_Size = parseInt(download.downloadedSize);
			var z_size = parseInt(download.totalSize);
			var str_num = parseInt((s_Size / z_size) * 100);
			mui(container).progressbar().setProgress(str_num);
			
		}, false);
		dtask.start();
	}
}