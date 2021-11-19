
						
						
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
	data_info.token =token;
	data_info.pageSize = 10;
	data_info.status = $("#status").val();
	data_info.cityCode = $('#city_select').val();
	data_info.riverName = $('#riverName').val();
	data_info.reporter = $('#reporter').val();
	data_info.keyWords = $('#searchKey').val();
	data_info.startDate = $('#statics_input1').val();
	data_info.endDate = $('#statics_input2').val();
	list(data_info);
});
$("#status").on("change", submit_fun)
$('#city_select').on("change", submit_fun)
// $('#searchRiver').on('click',submit_fun)
// $('#searchPeople').on('click',submit_fun)
// $('#searchKeyevent').on('click',submit_fun)

// 放大镜按钮点击事件与键盘事件
//所属河流
$("#searchRiver").on("click", function() {
	var search_value = $(this).prev().val();
	if (search_value == '') {
		$(this).prev().focus();
	}else{
		submit_fun();
	}
})
$("#searchRiver").prev().keypress(function(event) {
	var e = event || window.event || arguments.callee.caller.arguments[0];
	console.log(e.keyCode)
	if (e && e.keyCode == 13) { // 按 Enter 
		//要做的事情
		console.log(11);
		$("#searchRiver").prev().blur();
		var val_info = $("#searchRiver").prev().val();
		if(val_info != '' && val_info != undefined){
			submit_fun();
		}
	}
});
//上报人
$("#searchPeople").on("click", function() {
	var search_value = $(this).prev().val();
	if (search_value == '') {
		$(this).prev().focus();
	}else{
		submit_fun();
	}
})
$("#searchPeople").prev().keypress(function(event) {
	var e = event || window.event || arguments.callee.caller.arguments[0];
	console.log(e.keyCode)
	if (e && e.keyCode == 13) { // 按 Enter 
		//要做的事情
		console.log(22);
		$("#searchPeople").prev().blur();
		var val_info = $("#searchPeople").prev().val();
		if(val_info != '' && val_info != undefined){
			submit_fun();
		}
	}
});
//上报事件关键字
$("#searchKeyevent").on("click", function() {
	var search_value = $(this).prev().val();
	if (search_value == '') {
		$(this).prev().focus();
	}else{
		submit_fun();
	}
})
$("#searchKeyevent").prev().keypress(function(event) {
	var e = event || window.event || arguments.callee.caller.arguments[0];
	console.log(e.keyCode)
	if (e && e.keyCode == 13) { // 按 Enter 
		//要做的事情
		console.log(33);
		$("#searchKeyevent").prev().blur();
		var val_info = $("#searchKeyevent").prev().val();
		if(val_info != '' && val_info != undefined){
			submit_fun();
		}
	}
});
// 放大镜按钮点击事件与键盘事件

function list(data_info) {
	var _url = root + 'api/v3/riverchief/event/';
	mui.ajax(_url, {
		data: data_info,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			console.log(JSON.stringify(data))
			if (data.code == 1) {
				if (data.data.info.length > 0) {
					if (page > 1) {
						list_this.endPullupToRefresh(false);
					}
					if (page == 1) {
						$(".all_num").html("0");
						$(".lists").html("");
						console.log(page);
					}
					// 列表
					$('.all_num').text(data.data.total);
					var infobox = data.data.info;
					for (let i = 0; i < infobox.length; i++) {
						$('.lists').append(
							'<li class="lists_li lists_lis"><ul class="lists_data lists_datas" onclick="xiangqing(' + infobox[i].id +
							')">' +
							'<li><span class="weight">' + infobox[i].enventType + '</span></li>' +
							'<li class="position"><span class="region" style="color:'+infobox[i].statusColor+';">' + infobox[i].status + '</span></li>' +
							'<li><span>所属河流：</span><span>' + infobox[i].riverName + '</span></li>' +
							'<li><span>上报人：</span><span>' + infobox[i].reporter + '</span></li>' +
							'<li class="titles"><span>上报时间：</span><span>' + infobox[i].reportTime + '</span></li>' +
							// '<li><span>经度：</span><span>' + infobox[i].lng + '</span></li>' +
							// '<li><span>纬度：</span><span>' + infobox[i].lat + '</span></li>' +
							// '<li><span>图标：</span><img class="event_imgs" src="' + infobox[i].icon + '"></li>' +
							'</ul></li>'
						)
					}

					//状态
					var status = data.data.type;
					console.log(status)
					if (pageStatus) {
						for (key in status) {
							$('#status').append(
								'<option value="' + key + '">' + status[key] + '</option>'
							)
						}
						// 日期start
						var datatime = data.data.dateArr.start_date;
						var datatime2 = data.data.dateArr.end_date;
						console.log(datatime)
						console.log(datatime2)
						$("#statics_input1").val(datatime);
						$("#statics_input2").val(datatime2);
						var dtpicker1 = new mui.DtPicker({"type": "date"});
						document.querySelector(".statics_input1").addEventListener("tap", function() {
							dtpicker1.show(function(items) {
								$("#statics_input1").val(items.y.text + "-" + items.m.text+ "-" + items.d.text);
								submit_fun()
							});
						});
						var dtpicker2 = new mui.DtPicker({"type": "date"});
						document.querySelector(".statics_input2").addEventListener("tap", function() {
							dtpicker2.show(function(items) {
								$("#statics_input2").val(items.y.text + "-" + items.m.text + "-" + items.d.text);
								submit_fun()
							});
						});
						// 日期end
					}
					
					//地市编码
					var cityCode = data.data.cityArr;
					if (pageStatus) {
						for (key in cityCode) {
							$('#city_select').append(
								'<option value="' + key + '">' + cityCode[key] + '</option>'
							)
						}
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
		url: 'event_detail.html', //通过URL传参
		id: 'event_detail.html', //通过URL传参
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

function submit_fun() {
	// 重置上拉加载
	mui('.mui-content').pullRefresh().refresh(true);
	plus.nativeUI.showWaiting("加载中...");
	page = 1;
	data_info.page = page;
	data_info.token =token;
	data_info.pageSize = 10;
	data_info.status = $("#status").val();
	data_info.cityCode = $('#city_select').val();
	data_info.riverName = $('#riverName').val();
	data_info.reporter = $('#reporter').val();
	data_info.keyWords = $('#searchKey').val();
	data_info.startDate = $('#statics_input1').val();
	data_info.endDate = $('#statics_input2').val();
	list(data_info);
}
