//二级村列表
var root = localStorage.getItem("str_url");
if (root == "" || root == undefined || root == null) {
	mui.openWindow({
		url: 'login.html?cid=1', //通过URL传参
		id: 'login.html?cid=1', //通过URL传参
	})
}
var token = localStorage.getItem("token");
var page = 1;
var list_this = '';
var page_status = true;//页面状态第一次加载
var data_info = {};
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	$("#type_select").val(self.type_id)//修改灌区默认显示
	plus.nativeUI.showWaiting("加载中...");
	data_info.token = token;
	data_info.page = 1;
	data_info.type = $("#type_select").val();//类型 1 大型灌区 2 中型灌区
	data_info.city_code = '';//地市code
	data_info.river_basin_code = $("#type_basin").val();//所在流域
	data_info.water_project_type = $("#type_project").val();//水源工程类型
	data_info.geomorphic_types = $("#type_landforms").val();//地貌类型
	data_info.keywords = $("#username").val();//名称
	data_info.administrative_subordinate = $("#type_ascription").val();//行政隶属
	
	list(data_info);
	
	var area_info = {"token": token}
	var itemObj = {"itemid":"#city_select"}
	getArea(data_info,itemObj)
});

function list(data_info) {
	console.log(JSON.stringify(data_info));
	// var urlInterface = [
	// 	{
	// 		name: "大型灌区",
	// 		interface_url: "api/v3/rural_irrigation/list",
	// 		type: 1
	// 	},
	// 	{
	// 		name: "中型灌区",
	// 		interface_url: "api/v3/rural_irrigation/list",
	// 		type: 2
	// 	}
	// ]


	// var _url = root + urlInterface[data_info.type - 1].interface_url;
	var _url = root + "api/v3/rural_irrigation/list";
	console.log(_url);
	console.log(JSON.stringify(data_info));
	mui.ajax(_url, {
		data: data_info,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			console.log("---reponse----------" + JSON.stringify(data));
			// $(".list_number").children("span").html(0);
			if (data.code == 1) {
				// 第一次加载执行
				if(page_status){
					// 请选择所在流域 #type_basin
					var basin = data.data.basin;
					basin.forEach(function(item,index){
						$("#type_basin").append('<option value="'+item.value+'">'+item.name+'</option>')
					})
					// 请选择水源工程类型 #type_project
					var waterProjectType = data.data.waterProjectType;
					waterProjectType.forEach(function(item,index){
						$("#type_project").append('<option value="'+item.value+'">'+item.name+'</option>')
					})
					// 请选择地貌类型 #type_landforms
					var geomorphic = data.data.geomorphic;
					geomorphic.forEach(function(item,index){
						$("#type_landforms").append('<option value="'+item.value+'">'+item.name+'</option>')
					})
					// 请选择行政隶属 #type_ascription
					var subordinate = data.data.subordinate;
					subordinate.forEach(function(item,index){
						$("#type_ascription").append('<option value="'+item.value+'">'+item.name+'</option>')
					})
					
				}
				if (data.data.list.length > 0) {
					if (data_info.page > 1) {
						list_this.endPullupToRefresh(false);
					}
					if (data_info.page == 1) {
						console.log('page=====');
						$(".listBox").html("");
					}
					updateContent(data_info.type,data);
				} else {
					if (data_info.page > 1) {
						list_this.endPullupToRefresh(true);
					} else {
						$(".list_number").children("span").html(data.data.count);
						$(".listBox").html("");
						$(".listBox").append(
							'<a style="font-size:0.35rpx;text-align:center;margin-top:100px;display:block;">暂无数据</a>'
						)
					}
				}
				page_status = false;
				$(".mui-loading").css("display", "none")
			}
		},
		error: function(xhr, type, errorThrown) {
			console.log("加载失败")
			plus.nativeUI.closeWaiting();
		}
	})
}

function updateContent(typeId,data) {
	$(".list_number").children("span").html(data.data.count);
	data.data.list.forEach(function(item, index) {
		// console.log(JSON.stringify(item));
		// console.log(typeId);
		// console.log(item.id);
		var li_html = '<li class="lists_li" onclick="xiangqing(' + typeId + ',' + item.id + ')">' +
			'<ul class="lists_data">' +
			'<li class="lists_data_head">' +
			'<span class="lists_data_head_l">' + item.name + '</span>' +
			// '<span class="lists_data_head_r">山西省</span>' +
			'</li>' +
			'<li>' +
			'<span>管理单位名称:</span>' +
			'<span>'+item.body[0].value+'</span>' +
			'</li>' +
			'<li>' +
			'<span>所在流域:</span>' +
			'<span>'+item.body[1].value+'</span>' +
			'</li>' +
			'<li>' +
			'<span>水源工程类型:</span>' +
			'<span>'+item.body[2].value+'</span>' +
			'</li>' +
			'</ul>' +
			'</li>';
		$(".listBox").append(li_html);
	});

}

function xiangqing(typeId, itemId) {
	var self = plus.webview.currentWebview();
	var url = '';
	console.log(typeId);
	console.log(itemId);
	var params = {
		item_id: itemId
	};
	switch (typeId) {
		case 1://大型灌区
			console.log('typeId=1');
			url = '/pages/irrigated/searchDetails.html';
			params = {
				item_id: itemId,
				type: 'big_irrigatedArea'
			};
			break;
		case 2://中型灌区
			url = '/pages/irrigated/searchDetails.html';
			params = {
				item_id: itemId,
				type: 'query_irrigatedArea'
			};
			break;
		
		default:
			break;
	}
	mui.openWindow({
		url: url, //通过URL传参
		id: url, //通过URL传参
		extras: params
	});
};
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

	// var data_info = {};
	// data_info.token = token;
	data_info.page = page;
	list(data_info);

	list_this = this;
}

// 筛选信息
function shaixuanFun() {
	// 重置上拉加载
	mui('.mui-content').pullRefresh().refresh(true);
	plus.nativeUI.showWaiting("加载中...");
	$(document).scrollTop(0) //重置滚动条的top值为0
	page = 1;
	data_info.page = 1;
	data_info.type = $("#type_select").val();//灌区类型
	// data_info.city_code = $("#city_select").val();//地市筛选
	data_info.city_code = $("#city_select").attr("data-code");//地市筛选
	data_info.river_basin_code = $("#type_basin").val();//所在流域
	data_info.water_project_type = $("#type_project").val();//水源工程类型
	data_info.geomorphic_types = $("#type_landforms").val();//地貌类型
	data_info.keywords = $("#username").val();//名称
	data_info.administrative_subordinate = $("#type_ascription").val();//行政隶属
	list(data_info);
}
$("#type_select").on("change", shaixuanFun)//灌区类型
$("#city_select").on("change", shaixuanFun)//地市筛选
$("#type_basin").on("change", shaixuanFun)//所在流域
$("#type_project").on("change", shaixuanFun)//水源工程类型
$("#type_landforms").on("change", shaixuanFun)//地貌类型
// $("#search").on("click", shaixuanFun)//名称
$("#type_ascription").on("change", shaixuanFun)//行政隶属

// 放大镜按钮点击事件与键盘事件
$("#search").on("click", function() {
	var search_value = $(this).prev().val();
	if (search_value == '') {
		$(this).prev().focus();
	}else{
		shaixuanFun();
	}
})
$("#search").prev().keypress(function(event) {
	var e = event || window.event || arguments.callee.caller.arguments[0];
	console.log(e.keyCode)
	if (e && e.keyCode == 13) { // 按 Enter 
		//要做的事情
		console.log(11);
		$("#search").prev().blur();
		var val_info = $("#search").prev().val();
		if(val_info != '' && val_info != undefined){
			shaixuanFun();
		}
	}
});
// 放大镜按钮点击事件与键盘事件
