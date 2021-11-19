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
	data_info.outletName = $('#outletName').val();
	data_info.riverName = $('#riverName').val();
	data_info.cityCode = $('#city').val();
	data_info.riverSystem = $('#riverSystem').val();
	list(data_info);
});
$("#city").on("change",submit_fun)
// $('#searchOutletName').on('click',submit_fun)
// $('#searchRiverName').on('click',submit_fun)
// $('#searchRiverSystem').on('click',submit_fun)

// 放大镜按钮点击事件与键盘事件
magnifier("#searchOutletName")
magnifier("#searchRiverName")
magnifier("#searchRiverSystem")
function magnifier(searchName){
	$(searchName).on("click", function() {
		var search_value = $(this).prev().val();
		if (search_value == '') {
			$(this).prev().focus();
		}else{
			submit_fun();
		}
	})
	$(searchName).prev().keypress(function(event) {
		var e = event || window.event || arguments.callee.caller.arguments[0];
		console.log(e.keyCode)
		if (e && e.keyCode == 13) { // 按 Enter 
			//要做的事情
			console.log(11);
			$(searchName).prev().blur();
			var val_info = $(searchName).prev().val();
			if(val_info != '' && val_info != undefined){
				submit_fun();
			}
		}
	});
}
// 放大镜按钮点击事件与键盘事件


function list(data_info) {
	var _url = root + 'api/v3/riverchief/outlet/';
	mui.ajax(_url, {
		data: data_info,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			console.log(JSON.stringify(data.data))
			if (data.code == 1) {
				if(data.data.info.length>0){
					if(page>1){
						list_this.endPullupToRefresh(false);
					}
					if (page == 1) {
						$(".all_num").html("0");
						$(".lists").html("");
						console.log(page);
					}
				// 列表
				console.log(JSON.stringify(data.data.cityArr))
				$('.all_num').text(data.data.total);
				var infobox = data.data.info;
				for (let i = 0; i < infobox.length; i++) {
					$('.lists').append(
						'<li class="lists_li"><ul class="lists_data" onclick="xiangqing(' + infobox[i].id +
						')">' +
						'<li class="titles"><span class="weight">' + infobox[i].outletName + '</span></li>' +
						'<li><span>排入河流名称：</span><span>' + infobox[i].drainRiverName + '</span></li>' +
						'<li><span>所属河系：</span><span>' + infobox[i].riverSystem + '</span></li>' +
						'<li><span>位置名称：</span><span>' + infobox[i].locAreaName + '</span></li>' +
						'</ul></li>'
					)
				}
				
				//地市
				var citys = data.data.cityArr;
				console.log(citys)
				if(pageStatus){
					for(key in citys){
						$('#city').append(
						'<option value="'+key+'">'+citys[key]+'</option>'
						)
					}
				}
				
				
			}else{
					if(page>1){
						list_this.endPullupToRefresh(true);
					}else{
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
		url: 'drainOutlet_detail.html', //通过URL传参
		id: 'drainOutlet_detail.html', //通过URL传参
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

function submit_fun(){
	// 重置上拉加载
	mui('.mui-content').pullRefresh().refresh(true);
	plus.nativeUI.showWaiting("加载中...");
	page = 1;
	data_info.page = page;
	data_info.token = token;
	data_info.pageSize = 10;
	data_info.outletName = $('#outletName').val();
	data_info.riverName = $('#riverName').val();
	data_info.cityCode = $('#city').val();
	data_info.riverSystem = $('#riverSystem').val();
	list(data_info);
}