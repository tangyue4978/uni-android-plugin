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
	var self = plus.webview.currentWebview();
	if (self.type_id == undefined) {
		self.type_id = 0;
	}
	plus.nativeUI.showWaiting("加载中...");
	data_info.token = token;
	data_info.page = page;
	data_info.pageSize = 15;
	data_info.code = '';//code地区编码
	data_info.date = $("#date").val();//时间
	data_info.userName = $("#userName").val();//河长姓名
	data_info.status = $("#status").val();//状态
	list(data_info);
});


function list(data_info) {
	var _url = root + 'api/v3/riverchief/inspectriver/patrol_search';
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
					// 是否完成任务 #status
					var status = data.data.status;
					status.forEach(function(item,index){
						$("#status").append('<option value="'+item.value+'">'+item.name+'</option>')
					})
					
					// 选择年度 #date
					var date = data.data.date;
					date.forEach(function(item,index){
						$("#date").append('<option value="'+item.value+'">'+item.name+'</option>')
					})
				}
				if (data.data.info.length > 0) {
					if (page > 1) {
						list_this.endPullupToRefresh(false);
					}
					if (page == 1) {
						$(".table_render").html("");
					}
					var infobox = data.data.info;
					infobox.map(item => {
						$(".table_render").append(`
							<div class="line">
							    <div class="item">${item.riverName}</div>
							    <div class="item">${item.userLevel}</div>
							    <div class="item">${item.userName}</div>
							    <div class="item">
							        <div class="number">
							            <div class="number_l">${item.patrolFinish}</div>
							            <div class="number_r">${item.patrolReality}</div>
							        </div>
							    </div>
							    <div class="item">
							        <div class="number">
							            <div class="number_l">${item.questionFinish}</div>
							            <div class="number_r">${item.questionReality}</div>
							        </div>
							    </div>
							</div>
						`)
					})
				} else {
					if (page > 1) {
						list_this.endPullupToRefresh(true);
					} else {
						$(".table_render").html(
							'<div style="height: 2.4rem;margin:0.2rem auto;box-shadow: 2px 2px 6px 0px rgba(0, 0, 0, 0.06);border-radius: 0.2rem;font-size:0.3rem;text-align:center;line-height: 2.4rem;">暂无数据</div>'
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
		container: ".table_render", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
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
	mui('.table_render').pullRefresh().refresh(true);
	plus.nativeUI.showWaiting("加载中...");
	page = 1;
	data_info.page = page;
	data_info.code = '';//code地区编码
	data_info.date = $("#date").val();//时间
	data_info.userName = $("#userName").val();//河长姓名
	data_info.status = $("#status").val();//状态
	list(data_info);
}

$("#date").on("change", shaixuanFun);
$("#userName").on("change", shaixuanFun);
$("#status").on("change", shaixuanFun);

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
