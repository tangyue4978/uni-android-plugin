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
		if(data.level == "1") {
			$(".edition").css("display", "block");
			$(".edition .infor .pop_content .pop_top .pop_title .bottom_top span").html(data.versionnum);
			$(".edition .infor .pop_content .pop_top .pop_close").css("display", "none");
			$(".edition .infor .pop_content .pop_top .pop_updated_content .updated_cont").html('<pre>' + data.versionintro + '</pre>');
			$(".pop_ljsj").css("display", "block");
			$(".pop_zzgx").css("display", "none");
			$("#demo5").css("display", "none");

			$(".pop_ljsj").on("click", function() {
				download(url);
			})
		} else if(data.level == "3") {
			$(".edition").css("display", "block");
			$(".edition .infor .pop_content .pop_top .pop_title .bottom_top span").html(data.versionnum);
			$(".edition .infor .pop_content .pop_top .pop_close").css("display", "block");
			$(".edition .infor .pop_content .pop_top .pop_updated_content .updated_cont").html('<pre>' + data.versionintro + '</pre>');
			$(".pop_ljsj").css("display", "block");
			$(".pop_zzgx").css("display", "none");
			$("#demo5").css("display", "none");

			$(".pop_ljsj").on("click", function() {
				download(url);
			})
		} else {

		}
	}

}

//	(function() {
	document.addEventListener('plusready', function() {
		$("#dqversion").text(plus.runtime.version);
	var system="";
		if (plus.os.name == 'iOS') {
			system=2;
		}else{
			system=1;
		}
	var root = localStorage.getItem("str_url");
	console.log("system="+system+";plus.runtime.version="+plus.runtime.version)
		mui.ajax(root + "api/version/checkversion", {
			data: {
				"versionnum":plus.runtime.version,
				"system":system
			},
			dataType: 'json',
			type: 'post',
			contentType: "application/x-www-form-urlencoded; charset=utf-8",
//			timeout: 60000,
			success: function(data) {
				console.log(JSON.stringify(data));
				var obj=data;
				if(data.code == 1) {
					Callback_5(obj)
				} else {
					mui.alert(data.msg)
				}

			},
			error: function(xhr, type, errorThrown) {}
		});
		}, false)
//	});

function download(d_url) {
//	alert(d_url);
	if(mui.os.ios) {
		//				var url='itms-apps://itunes.apple.com/cn/app/hello-h5+/id682211190?l=zh&mt=8';// HelloH5应用在appstore的地址
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
			//					var url='itms-apps://itunes.apple.com/cn/app/hello-h5+/id682211190?l=zh&mt=8';// HelloH5应用在appstore的地址
			//						plus.runtime.openURL(url);
			//iOS 跳转end
		});
		var up_num = 0;
		dtask.addEventListener("statechanged", function(download, status) {

			//下载进度
			console.log("进入" + JSON.stringify(download))
			var s_Size = parseInt(download.downloadedSize);
			var z_size = parseInt(download.totalSize);
			var str_num = parseInt((s_Size / z_size) * 100);
			console.log((s_Size / z_size) * 100);
			mui(container).progressbar().setProgress(str_num);
			//下载进度
			if(up_num != str_num) {
//				alert("下载=" + JSON.stringify(download)+"---------"+"状态=" + status)
				up_num = str_num;
				download_tips.setTitle("下载中" + up_num + "%...");
			}
		}, false);
		dtask.start();
	}
}