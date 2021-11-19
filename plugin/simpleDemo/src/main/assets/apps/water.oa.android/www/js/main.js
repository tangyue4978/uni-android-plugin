$(".mui-loading").css("display", "block");
var root = localStorage.getItem("str_url");
//if(root == "" || root == undefined || root == null) {
//	mui.openWindow({
//		url: 'login.html?cid=1', //通过URL传参
//		id: 'login.html?cid=1', //通过URL传参
//	})
//}
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	mainList()
	myList()
});
var token = localStorage.getItem("token");

function mainList() {
	var _url = root + 'api/v2/nav/'
	mui.ajax(_url, {
		data: {
			"token": token,
			"version":plus.runtime.version
		},
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			console.log(JSON.stringify("工作台=" + JSON.stringify(data)))
			if (data.code == 1 && data.data != []) {
				data.data.forEach(function(v) {
					// $(".caidan").append('<li onclick="cd(&quot;' + v.uri + '&quot;)"><div style="background: ' + v.color + ';"><i class="iconfont ' + v.icon + '"></i></div><span>' + v.name + '</span></li>')
					if (v.iconType === 1) {
						$(".caidan").append('<li onclick="cd(&quot;' + v.uri +
							'&quot;)"><div style="background: ' + v.color +
							';"><i class="iconfont ' + v.icon + '"></i></div><span>' + v.name +
							'</span></li>')
					} else if (v.iconType === 2) {
						$(".caidan").append('<li onclick="cd(&quot;' + v.uri +
							'&quot;)"><img src="images/main/' + v.imageName + '"/><span>' + v
							.name + '</span></li>')
					} else if (v.iconType === 3) {
						console.log(v.url);
						$(".caidan").append('<li onclick="cd(&quot;' + v.uri +
							'&quot;)"><img src="' + v.url + '"/><span>' + v.name +
							'</span></li>')
					} else {
						console.log(v.iconType);
					}

				})

			} else if(data.code >= 2 && data.code <= 100){
				mui.toast(data.msg);
				mui.openWindow({
					url: 'login.html?cid=1', //通过URL传参
					id: 'login.html?cid=1' //通过URL传参
				})
			}else {
				mui.toast('当前未开启菜单')
			}
			$(".mui-loading").css("display", "none");
		},
		error: function(xhr, type, errorThrown) {
			//异常处理；
			mui.toast("网络错误,请尝试退出应用重新登录");
		}
	})
}


function myList() {
	var _url = root + 'api/user/'
	mui.ajax(_url, {
		data: {
			"token": token,
		},
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			console.log(JSON.stringify(JSON.stringify(data)))
			if (data.code == 1) {
				$(".p1").html('<i class="iconfont icon-yuangong"></i>' + data.data.truename)
				localStorage.setItem("truename", data.data.truename)
			} else if(data.code >= 2 && data.code <= 100){
				mui.toast(data.msg);
				mui.openWindow({
					url: 'login.html?cid=1', //通过URL传参
					id: 'login.html?cid=1' //通过URL传参
				})
			}else{
				mui.toast(data.msg);
			}

		},
		error: function(xhr, type, errorThrown) {
			//异常处理；
			//		console.log(type);
		}
	})
}


//cd(i);

$(".p1").click(function() {
	//	mui.openWindow({
	//			url: 'schedule.html', //通过URL传参
	//			id: 'schedule.html', //通过URL传参
	//		})
	mui.openWindow({
		url: 'scheduleOne.html', //通过URL传参
		id: 'scheduleOne.html', //通过URL传参
	})
})

function cd(i) {
	if (i.indexOf("?") == -1) {
		mui.openWindow({
			url: i,
			id: i
		})
	} else {
		mui.openWindow({
			url: "child_view.html",
			id: "child_view.html",
			extras: {
				url: i
			}
		})
	}

	//1 通知 2 会议 3 知识 4 云盘 5 日志 6 请假 7 报销 
	//8 考勤 9 可视化 10 日程 11 积分 12 公文 13 河长制
	//	if(i == "1") {
	//		mui.openWindow({
	//			url: 'notice.html',
	//			id: 'notice.html',
	//		})
	//	} else if(i == "12") {
	//		mui.openWindow({
	//			url: 'bumf.html',
	//			id: 'bumf.html',
	//		})
	//	} else if(i == "11") {
	//		mui.openWindow({
	//			url: 'integral.html', //通过URL传参
	//			id: 'integral.html', //通过URL传参
	//		})
	//	} else if(i == "10") {
	////		mui.openWindow({
	////			url: 'schedule.html', //通过URL传参
	////			id: 'schedule.html', //通过URL传参
	////		})
	//		mui.openWindow({
	//			url: 'scheduleOne.html', //通过URL传参
	//			id: 'scheduleOne.html', //通过URL传参
	//		})
	//	} else if(i == "9") {
	//		mui.openWindow({
	//			url: 'visualization.html', //通过URL传参
	//			id: 'visualization.html', //通过URL传参
	//		})
	//	} else if(i == "8") {
	//		mui.openWindow({
	//			url: 'checkDiligent.html', //通过URL传参
	//			id: 'checkDiligent.html', //通过URL传参
	//		})
	//	} else if(i == "7") {
	//		mui.openWindow({
	//			url: 'reimbursement.html', //通过URL传参
	//			id: 'reimbursement.html', //通过URL传参
	//		})
	//	} else if(i == "6") {
	//		mui.openWindow({
	//			url: 'leave_list.html', //通过URL传参
	//			id: 'leave_list.html', //通过URL传参
	//		})
	//	} else if(i == "5") {
	//		mui.openWindow({
	//			url: 'journal.html', //通过URL传参
	//			id: 'journal.html', //通过URL传参
	//		})
	//	} else if(i == "4") {
	//		mui.openWindow({
	//			url: 'cloudDisk.html', //通过URL传参
	//			id: 'cloudDisk.html', //通过URL传参
	//		})
	//	} else if(i == "3") {
	//		mui.openWindow({
	//			url: 'lore.html', //通过URL传参
	//			id: 'lore.html', //通过URL传参
	//		})
	//	} else if(i == "2") {
	//		mui.openWindow({
	//			url: 'meeting.html', //通过URL传参
	//			id: 'meeting.html', //通过URL传参
	//		})
	//	}else if(i == "13") {
	//		mui.openWindow({
	//			url: 'river.html', //通过URL传参
	//			id: 'river.html', //通过URL传参
	//		})
	//	}
	//	console.log(i);
}

$("#inputid").click(function() {
	mui.openWindow({
		url: 'search.html', //通过URL传参
		id: 'search.html', //通过URL传参
	})
});
$("#zidingyi").click(function() {
	mui.openWindow({
		url: 'custom.html', //通过URL传参
		id: 'custom.html', //通过URL传参
	})
});

window.addEventListener('refresh', function(e) { //执行刷新
	location.reload();
});


function GetRequest(value) {
	//url例子：www.bicycle.com?id="123456"&Name="bicycle"；  
	var url = decodeURI(location.search); //?id="123456"&Name="bicycle";
	var object = {};
	if (url.indexOf("?") != -1) //url中存在问号，也就说有参数。  
	{
		var str = url.substr(1); //得到?后面的字符串
		var strs = str.split("&"); //将得到的参数分隔成数组[id="123456",Name="bicycle"];
		for (var i = 0; i < strs.length; i++) {
			object[strs[i].split("=")[0]] = strs[i].split("=")[1]
		}
	}
	return object[value];
}
