var root = localStorage.getItem("str_url");
console.log(root)
// if (root == "" || root == undefined || root == null) {
// 	mui.openWindow({
// 		url: 'login.html?cid=1', //通过URL传参
// 		id: 'login.html?cid=1', //通过URL传参
// 	})
// }
var token = localStorage.getItem("token");
console.log(token);
var page = 1;
var list_this = '';
var pageStatus = true;
var data_info = {};
mui.plusReady(function() {
	var river=plus.webview.getWebviewById("four_mess.html");
	if(river){
	   console.log(river.getURL());
	   river.hide();
	   river.close();
	}
	var self = plus.webview.currentWebview();
	if (self.type_id == undefined) {
		self.type_id = 0;
	}
	plus.nativeUI.showWaiting("加载中...");
	data_info.token = token;
	data_info.page = page;
	data_info.code = $("#city").attr("data-code");//code地区编码
	data_info.resParentname = $("#resParentname").val();//上级河流
	data_info.riverName = $("#riverName").val();//名称搜索
	data_info.flowsThrough = $("#flowsThrough").val();//流经地关键字搜索
	list(data_info);
	
	var area_info = {"token": token}
	var itemObj = {"itemid":"#city"}
	getArea(data_info,itemObj)
});


function list(data_info) {
	var _url = root + 'api/v3/riverchief/riverchiefriver/';
	console.log(_url);
	console.log(JSON.stringify(data_info));
	mui.ajax(_url, {
		data: data_info,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			console.log(JSON.stringify(data))

			if (data.code == 1) {
				if(pageStatus){
					// 请选择上级河流 #resParentname
					var resParentname = data.data.resParentname;
					resParentname.forEach(function(item,index){
						$("#resParentname").append('<option value="'+item.value+'">'+item.name+'</option>')
					})
				}
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
					$('.all_num').text(data.data.count);
					for (let i = 0; i < infobox.length; i++) {
						$('.lists').append(
							'<li class="lists_li"><ul class="lists_data" onclick="xiangqing(' + infobox[i].id +
							')">' +
							'<li><span class="weight">' + infobox[i].riverName + '</span></li>' +
							'<li class="position"><span class="region">' + infobox[i].adFullName + '</span></li>' +
							'<li><span>河长姓名：</span><span>' + infobox[i].userName + '</span></li>' +
							'<li><span>河流等级：</span><span>' + infobox[i].riverLevelName + '</span></li>' +
							'<li><span>河流长度(km)：</span><span>' + infobox[i].riverLenght + '</span></li>' +
							'<li><span>流域面积(k㎡)：</span><span>' + infobox[i].waterArea + '</span></li>' +
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

function xiangqing(item_id, item_num) {
	console.log("详情=" + item_id);
	mui.openWindow({
		url: 'four_mess_detail4.html', //通过URL传参
		id: 'four_mess_detail4.html', //通过URL传参
		extras: {
			item_id: item_id,
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


function shaixuanFun() {
	// 重置上拉加载
	mui('.mui-content').pullRefresh().refresh(true);
	plus.nativeUI.showWaiting("加载中...");
	page = 1;
	data_info.page = page;
	data_info.code = $("#city").attr("data-code");//code地区编码
	data_info.resParentname = $("#resParentname").val();//上级河流
	data_info.riverName = $("#riverName").val();//名称搜索
	data_info.flowsThrough = $("#flowsThrough").val();//流经地关键字搜索
	list(data_info);
}

$("#city").on("change", shaixuanFun);
$("#resParentname").on("change", shaixuanFun);

// 放大镜按钮点击事件与键盘事件
$("#search_riverName").on("click", function() {
	var search_value = $(this).prev().val();
	if (search_value == '') {
		$(this).prev().focus();
	}else{
		shaixuanFun();
	}
})
$("#search_riverName").prev().keypress(function(event) {
	var e = event || window.event || arguments.callee.caller.arguments[0];
	console.log(e.keyCode)
	if (e && e.keyCode == 13) { // 按 Enter 
		//要做的事情
		console.log(11);
		$("#search_riverName").prev().blur();
		var val_info = $("#search_riverName").prev().val();
		if(val_info != '' && val_info != undefined){
			shaixuanFun();
		}
	}
});

$("#search_flowsThrough").on("click", function() {
	var search_value = $(this).prev().val();
	if (search_value == '') {
		$(this).prev().focus();
	}else{
		shaixuanFun();
	}
})
$("#search_flowsThrough").prev().keypress(function(event) {
	var e = event || window.event || arguments.callee.caller.arguments[0];
	console.log(e.keyCode)
	if (e && e.keyCode == 13) { // 按 Enter 
		//要做的事情
		console.log(22);
		$("#search_flowsThrough").prev().blur();
		var val_info = $("#search_flowsThrough").prev().val();
		if(val_info != '' && val_info != undefined){
			shaixuanFun();
		}
	}
});
// 放大镜按钮点击事件与键盘事件
