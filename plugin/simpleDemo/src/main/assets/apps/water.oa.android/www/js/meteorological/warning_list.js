var root = localStorage.getItem("str_url");
if (root == "" || root == undefined || root == null) {
    mui.openWindow({
        url: "login.html?cid=1", //通过URL传参
        id: "login.html?cid=1", //通过URL传参
    });
}

var token = localStorage.getItem("token");
var data_info = {};
var page = 1;
var page_status = true;
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	plus.nativeUI.showWaiting("加载中...");
	data_info.token = token;
	data_info.page = page;
	data_info.level = $("#warning_type").val();
	data_info.keywrods = $("#keywords").val();
	list(data_info);
});

function list(data_info) {
    var _url = root + "api/v4/disaster_warning/history";
	console.log(_url)
	console.log(JSON.stringify(data_info));
    //24小时预报
    mui.ajax(_url,{
        data: data_info,
        datatype: "json", //服务器返回json格式数据
        type: "post", //HTTP请求类型
        success: function (data) {
			plus.nativeUI.closeWaiting();
			console.log(JSON.stringify(data));
			if(data.code == 1){
				let datas = data.data.list;
				if(datas.length > 0){
					if(page > 1){
						list_this.endPullupToRefresh(false);
					}
					if(page == 1){
						$(".listBox ul").html('')
					}
					for(let i=0;i<datas.length;i++){
						$(".listBox ul").append(`
							<li onclick="xiangqing(${datas[i].id})">
								<a class="yj_a">
									<span class="yjbox">
										<img class="yj_img" src="${datas[i].icon}">
										<span class="yjtitle">${datas[i].title}</span>
									</span>
									<span class="yjtime">${datas[i].release_at_str}</span>
								</a>
							</li>
						`)
					}
				}else{
					if (page > 1) {
						list_this.endPullupToRefresh(true);
					} else {
						$(".listBox ul").html(
							'<div style="width: 96%;height: 2.4rem;margin:0 auto;background-color: #ffffff;box-shadow: 2px 2px 6px 0px rgba(0, 0, 0, 0.06);border-radius: 0.2rem;font-size:0.3rem;text-align:center;line-height: 2.4rem;">最近12小时内暂无气象灾害预警信息</div>'
						)
					}
				}
				
				if(page_status){
					
				}
			}else{
				if (page > 1) {
					list_this.endPullupToRefresh(true);
				}
				plus.nativeUI.toast(data.msg);
			}
            page_status = false
        },
        error: function (xhr, type, errorThrown) {
			console.log(type)
            plus.nativeUI.closeWaiting();
			mui.toast("服务异常");
        },
    });
}

function xiangqing(ids){
	jump_new("warning_detail.html?timestamp="+new Date().getTime(),{ids:ids})
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
	data_info.token = token;
	data_info.page = page;
	data_info.level = $("#warning_type").val();
	data_info.keywrods = $("#keywords").val();
	list(data_info);
}

$("#warning_type").on('change',submit_fun)
// 放大镜按钮点击事件与键盘事件
$("#searchKey").on("click", function() {
	var search_value = $(this).prev().val();
	if (search_value == '') {
		$(this).prev().focus();
	}else{
		submit_fun();
	}
})
$("#searchKey").prev().keypress(function(event) {
	var e = event || window.event || arguments.callee.caller.arguments[0];
	console.log(e.keyCode)
	if (e && e.keyCode == 13) { // 按 Enter 
		//要做的事情
		console.log(11);
		$("#searchKey").prev().blur();
		var val_info = $("#searchKey").prev().val();
		if(val_info != '' && val_info != undefined){
			submit_fun();
		}
	}
});
// 放大镜按钮点击事件与键盘事件