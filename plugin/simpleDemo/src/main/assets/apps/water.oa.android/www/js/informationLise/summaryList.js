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
// var pageStatus = true;
var data_info = {};
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	if (self.type_id == undefined) {
		self.type_id = 0;
	}
	plus.nativeUI.showWaiting("加载中...");
	data_info.token =token;
	data_info.page = page;
	data_info.pageSize = 15;
	data_info.excelName = $('#keyName').val();
	list(data_info);
});
// $(".img_search").on("click", submit_fun)

function list(data_info) {
	var _url = root + 'api/v3/collectdata/collect/tableList';
	console.log(JSON.stringify(data_info))
	mui.ajax(_url, {
		data: data_info,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			console.log(JSON.stringify(data))
			plus.nativeUI.closeWaiting();
			if (data.code == 1) {
				if (data.data.data.length > 0) {
					if (page > 1) {
						list_this.endPullupToRefresh(false);
					}
					if (page == 1) {
						$(".lists").html("");
					}
					// 数据总计
					$('.all_num').text(data.data.count);
					
					// 列表
					var listCode = data.data.data;
					var list_html = '';
					for(let i=0;i<listCode.length;i++){
						list_html += '<li class="lists_li" onclick="xiangqing(\''+listCode[i].tableName+'\',' + listCode[i].type + ',\''+listCode[i].excelName+'\')">'+listCode[i].excelName+'</li>'
					}
					console.log(list_html)
					$('.lists').append(list_html)
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
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
			console.log(errorThrown);
		}
	})
}

function xiangqing(item_tableName,item_type,item_excelName) {
	console.log("详情=" + item_type);
	mui.openWindow({
		url: 'summaryList_detail.html', //通过URL传参
		id: 'summaryList_detail.html', //通过URL传参
		extras: {
			item_tableName: item_tableName,
			item_type: item_type,
			item_excelName : item_excelName
		}
	})
}

// 上拉加载
mui.init({
	pullRefresh: {
		container: ".mui-content", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
		up: {
			height: "50px", //可选.默认50.触发上拉加载拖动距离
			auto: false, //可选,默认false.自动上拉加载一次
			contentdown: "上拉显示更多",
			contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
			contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
			callback: up_fun //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
		}
	}
});

function up_fun() {
	page++;
	console.log("上拉加载成功");
	var self = plus.webview.currentWebview();
	data_info.page = page;
	list(data_info);
	list_this = this;
}

// 上拉加载 end

function submit_fun() {
	// 重置上拉加载
	mui('.mui-content').pullRefresh().refresh(true);
	plus.nativeUI.showWaiting("加载中...");
	page = 1;
	data_info.token =token;
	data_info.page = page;
	data_info.pageSize = 15;
	data_info.excelName = $('#keyName').val();
	list(data_info);
}

// 放大镜按钮点击事件与键盘事件
$(".img_search").on("click", function() {
	var search_value = $(this).prev().val();
	if (search_value == '') {
		$(this).prev().focus();
	}else{
		submit_fun();
	}
})
$(".img_search").prev().keypress(function(event) {
	var e = event || window.event || arguments.callee.caller.arguments[0];
	console.log(e.keyCode)
	if (e && e.keyCode == 13) { // 按 Enter 
		//要做的事情
		console.log(11);
		$(".img_search").prev().blur();
		var val_info = $(".img_search").prev().val();
		if(val_info != '' && val_info != undefined){
			submit_fun();
		}
	}
});
// 放大镜按钮点击事件与键盘事件