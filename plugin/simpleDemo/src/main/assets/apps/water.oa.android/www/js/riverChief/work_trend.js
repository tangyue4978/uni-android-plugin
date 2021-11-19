//二级村列表
var root = localStorage.getItem("str_url");
if (root == "" || root == undefined || root == null) {
	mui.openWindow({
		url: 'login.html?cid=1', //通过URL传参
		id: 'login.html?cid=1', //通过URL传参
	})
}
var token = localStorage.getItem("token");
var data_info = {};
var page_status = true;
var page = 1;
var list_this = "";
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	plus.nativeUI.showWaiting("加载中...");
	data_info.token = token;
	data_info.page = page;
	data_info.title = "";
	data_info.type = "";
	list(data_info);
});
function list(data_info) {
	
	var _url = root + "api/v3/riverchief/riverchieflakechief/news_list";
	console.log(_url);
	console.log(JSON.stringify(data_info));
	mui.ajax(_url, {
		data: data_info,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(res) {
			console.log(JSON.stringify(res))
			plus.nativeUI.closeWaiting();
			if (res.code == 1) {
				if (res.data.info.length > 0) {
					if (page > 1) {
						list_this.endPullupToRefresh(false);
					}
					if(page == 1){
						$(".list").html("");
					}
					setList(res.data)
				}else{
					if(page > 1){
						list_this.endPullupToRefresh(true);
						mui.toast("暂无数据");
					}else{
						$(".list").html(
							'<div style="width: 96%;height: 2.4rem;margin:0 auto;background-color: #ffffff;box-shadow: 2px 2px 6px 0px rgba(0, 0, 0, 0.06);border-radius: 0.2rem;font-size:0.3rem;text-align:center;line-height: 2.4rem;">暂无数据</div>'
						)
					}
				}
				
				if(page_status){
					page_status = false;
					for (var i = 0; i < res.data.typeList.length; i++) {
						$(".nav_wrap .nav").append(`<span class="nav_item " data-type="${res.data.typeList[i].value}">${res.data.typeList[i].name}</span>`)
					}
				}
				
				
			}else{
				mui.toast(res.msg);
			}
		},
		error: function(xhr, type, errorThrown) {
			console.log("接口获取请求失败");
			plus.nativeUI.closeWaiting();
		}
	})
}

function setList(data){
	var listBox = data.info;
	for (var i = 0; i < listBox.length; i++) {
		$(".list").append(`<div class="item" onclick="xiangqing(${listBox[i].id})">
								<div class="item_left">
									<div class="left_top">
										${listBox[i].title}
									</div>
									<div class="left_btm">
										<span class="site">${listBox[i].unitName}</span>
										<span class="time">${listBox[i].addTime}</span>
									</div>
								</div>
								<div class="item_right">
									<img src="${listBox[i].imgUrl}" alt="">
								</div>
							</div>`)
	}
	
}

function xiangqing(item_id) {
	console.log("详情=" + item_id);
	mui.openWindow({
		url: 'work_trend_detalis.html', //通过URL传参
		id: 'work_trend_detalis', //通过URL传参
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
	list_this = this;
	list(data_info);
	
}

// 上拉加载 end

function submit_fun() {
	// 重置上拉加载
	mui('.mui-content').pullRefresh().refresh(true);
	plus.nativeUI.showWaiting("加载中...");
	page = 1;
	data_info.page = page;
	data_info.type = $(".nav_wrap .nav .nav_item.active").attr("data-type")//类型
	data_info.title = $("#lkName").val();//名称搜索
	list(data_info);
}
$(".nav_wrap .nav").on("click",".nav_item" ,function(){
	$(this).addClass("active").siblings().removeClass("active");
	submit_fun()
})
// $("#search_lkName").on("click", submit_fun)
// 放大镜按钮点击事件与键盘事件
$("#search_lkName").on("click", function() {
	var search_value = $(this).parent().prev().val();
	if (search_value == '') {
		$(this).prev().focus();
	}else{
		submit_fun();
	}
})
// 放大镜按钮点击事件与键盘事件
$("#search_lkName").parent().prev().keypress(function(event) {
	var e = event || window.event || arguments.callee.caller.arguments[0];
	console.log(e.keyCode)
	if (e && e.keyCode == 13) { // 按 Enter 
		//要做的事情
		console.log(11);
		$("#search_lkName").parent().prev().blur();
		var val_info = $("#search_lkName").parent().prev().val();
		if(val_info != '' && val_info != undefined){
			submit_fun();
		}
	}
});


