var root = localStorage.getItem("str_url");
console.log(root)
if (root == "" || root == undefined || root == null) {
	mui.openWindow({
		url: 'login.html?cid=1', //通过URL传参
		id: 'login.html?cid=1', //通过URL传参
	})
}
var token = localStorage.getItem("token");
console.log(token);
var page = 1;
var list_this = '';
var pageStatus = true;
var data_info = {};
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	if (self.type_id == undefined) {
		self.type_id = 0;
	}
	plus.nativeUI.showWaiting("加载中...");
	data_info.page = page;
	data_info.token = token;
	data_info.pageSize = 10;
	data_info.code = '';
	list(data_info);
	list2();
});
$("#city").on("change", submit_fun);

//七河五湖切换
function qihe(){
	$("#qihe").addClass('tab_active');
	$(".lists").addClass("isShow");
	$(".lists").removeClass("ishide");
	$(".lists2").removeClass("isShow");
	$(".lists2").addClass('ishide');
	$("#wuhu").removeClass('tab_active');
	$("#qihenumber").removeClass("ishide");
	$("#qihenumber").addClass("isShow");
	$('#wuhunumber').removeClass("isShow");
	$('#wuhunumber').addClass("ishide");
}
function wuhu(){
	$("#qihe").removeClass('tab_active');
	$(".lists").removeClass("isShow");
	$(".lists").addClass("ishide");
	$(".lists2").removeClass("ishide");
	$(".lists2").addClass('isShow');
	$("#wuhu").addClass('tab_active');
	$("#qihenumber").removeClass("isShow");
	$("#qihenumber").addClass("ishide");
	$('#wuhunumber').removeClass("ishide");
	$('#wuhunumber').addClass("isShow");

}


//七河
function list(data_info) {
	console.log(JSON.stringify(data_info))
	var _url = root + 'api/v3/riverchief/sevenriverfivelake/';
	mui.ajax(_url, {
		data: {
			"token": data_info.token,
			// "page": data_info.page,
			// "pageSize": data_info.pageSize ,
			// "code": data_info.code,
			"type":1
		},
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			console.log(JSON.stringify(data))
			plus.nativeUI.closeWaiting();
			if (data.code == 1) {

				if (data.data.info.length > 0) {
					if (page > 1) {
						list_this.endPullupToRefresh(false);
					}
					if (page == 1) {
						$(".all_num").html("");
						$(".lists").html("");
						console.log(page);
					}
					var infobox = data.data.info;
					$('#qihenumber .all_num').text(data.data.total);
					for (let i = 0; i < infobox.length; i++) {
						$('.lists').append(
							'<li class="lists_li"><ul class="lists_data" onclick="xiangqing(' + infobox[i].id +
							')">' +
							'<li><span class="weight">' + infobox[i].name + '</span></li>' +
							'<li class="position"><span class="region">' + infobox[i].flowArea + '</span></li>' +
							'<li><span>源头：</span><span>' + infobox[i].source + '</span></li>' +
							'<li><span></span></li>' +
							'<li><span>河流长度(km)：</span><span>' + infobox[i].length + '</span></li>' +
							'<li><span>流域面积(km³)：</span><span>' + infobox[i].drainageArea + '</span></li>' +
							
							'</ul></li>'
						)
					}
				} else {
					if (page > 1) {
						list_this.endPullupToRefresh(true);
					} else {  
						$('.all_num').text("0");
						$(".lists").html(
							'<div style="width: 96%;height: 2.4rem;margin:0 auto;background-color: #ffffff;box-shadow: 2px 2px 6px 0px rgba(0, 0, 0, 0.06);border-radius: 0.2rem;font-size:0.3rem;text-align:center;line-height: 2.4rem;">暂无数据</div>'
						)
					}
				}
			}
			pageStatus = false;
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
}

function xiangqing(item_id) {
	console.log("详情=" + item_id);
	mui.openWindow({
		url: 'qihu_detail.html', //通过URL传参
		id: 'qihu_detail.html', //通过URL传参
		extras: {
			item_id: item_id,
		}
	})
}






//五湖
function list2() {
	var _url = root + 'api/v3/riverchief/fivelake/';
	mui.ajax(_url, {
		data: {
			"token": token,
		},
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			console.log(JSON.stringify(data))
			if (data.code == 1) {
				if (data.data.length > 0) {
					if (page > 1) {
						list_this.endPullupToRefresh(false);
					}
					var infobox = data.data;
					$('#wuhunumber .number').text('5');
					for (let i = 0; i < infobox.length; i++) {
						$('.lists2').append(
							'<li class="lists_li2"><ul class="lists_data2" onclick="xiangqing2(' + infobox[i].id + ')">' +
							'<li><span class="weight">' + infobox[i].name + '</span></li>' +
							'<li><span>位于：</span><span class="region">' + infobox[i].source + '</span></li>' +
							'<li><span>类型：</span><span>' + infobox[i].type + '</span></li>' +
							'</ul></li>'
						)
					}
				} else {
					if (page > 1) {
						list_this.endPullupToRefresh(true);
					} else {
						$('#wuhunumber .number').text("0");
						$(".lists2").html(
							'<div style="width: 96%;height: 2.4rem;margin:0 auto;background-color: #ffffff;box-shadow: 2px 2px 6px 0px rgba(0, 0, 0, 0.06);border-radius: 0.2rem;font-size:0.3rem;text-align:center;line-height: 2.4rem;">暂无数据</div>'
						)
					}
				}
			}
			pageStatus = false;
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
}

function xiangqing2(item_id) {
	console.log("详情=" + item_id);
	mui.openWindow({
		url: 'wuhu_detail.html', //通过URL传参
		id: 'wuhu_detail.html', //通过URL传参
		extras: {
			item_id: item_id,
		}
	})
}






// 上拉加载
// mui.init({
// 	pullRefresh: {
// 		container: ".mui-content", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
// 		up: {
// 			height: "50px", //可选.默认50.触发上拉加载拖动距离
// 			auto: false, //可选,默认false.自动上拉加载一次
// 			contentdown: "上拉显示更多",
// 			contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
// 			contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
// 			callback: up_fun //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
// 		}
// 	}
// });

// function up_fun() {
// 	page++;
// 	console.log("上拉加载成功");
// 	var self = plus.webview.currentWebview();
// 	data_info.page = page;
// 	list(data_info);
// 	list_this = this;
// }

// 上拉加载 end


function submit_fun() {
	// 重置上拉加载
	mui('.mui-content').pullRefresh().refresh(true);
	plus.nativeUI.showWaiting("加载中...");
	page = 1;
	data_info.page = page;
	list(data_info);
}
