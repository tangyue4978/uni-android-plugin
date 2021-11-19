// 日期start
var datatime = new Date();
var data_tiem = datatime.getFullYear() + "-" + (String(datatime.getMonth() + 1).length < 2 ? '0' + ((datatime.getMonth() +
	1)) : (datatime.getMonth() + 1));
$("#statics_input1").val(data_tiem);
// var dtpicker1 = new mui.DtPicker({
// 	"type": "month"
// });
// document.querySelector("#statics_input1").addEventListener("tap", function() {
// 	dtpicker1.show(function(items) {
// 		$("#statics_input1").val(items.y.text + "-" + items.m.text);
// 		shaixuanFun()
// 	});
// });
// 日期end
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
var obj_data = {};
var page_status = true; //判断是否是第一次加载页面，第一次加载需要插入筛选条件，否则不插入

mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	plus.nativeUI.showWaiting("加载中...");

	obj_data.token = token;
	obj_data.code = self.obj_code;
	obj_data.month = $('#statics_input1').val();
	obj_data.page = page;
	claerDetail(obj_data)
});

function claerDetail(obj) {
	console.log(JSON.stringify(obj))
	var _url = root + 'api/v3/water_rain_condition/rivercoursemonthreport';
	console.log(token)
	mui.ajax(_url, {
		data: obj_data,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			// console.log(JSON.stringify(data.data.length))
			plus.nativeUI.closeWaiting();

			if (data.code == 1) {
				if(page_status){
					// 日期start
					var begin = data.dateRange.minDate.split('-');
					var end = data.dateRange.maxDate.split('-');
					document.querySelector("#statics_input1").addEventListener("tap", function() {
						var dtpicker1 = new mui.DtPicker({
							"type": "month",
							beginDate: new Date(begin),//设置开始日期 
							endDate: new Date(end),//设置结束日期
						});
						dtpicker1.setSelectedValue($('#statics_input1').val())
						dtpicker1.show(function(items) {
							$("#statics_input1").val(items.y.text + "-" + items.m.text);
							shaixuanFun()
						});
					});
					// 日期end
				}
				if (data.data.length > 0) {
					if (page > 1) {
						list_this.endPullupToRefresh(false);
					}
					if (page == 1) {
						$(".base_info_table_data").html(""); //清空列表注意检查类名是否正确
					}
					console.log(1)
					
					//监测信息start
					var datas = data.data;
					var tr_html = '';
					if (datas != null && datas != "" && datas != "undefined") {
						for (let i = 0; i < datas.length; i++) {
							tr_html += '<tr/><td class="texl">' + datas[i].tm + '</td><td class="texl">' + datas[i].stage + '</td></tr>'
						}
						$('.base_info_table_data').append(tr_html);
					} else {
						$('#lsjc').hide();
					}
					//监测信息end

				} else {
					if (page > 1) {
						list_this.endPullupToRefresh(true);
					} else {
						$("base_info_table_data").html(
							'<a style="font-size:0.35rpx;text-align:center;padding:1rem 0rem;width:100%;display:block;background:#ffffff;">暂无数据</a>'
						)
					}
				}
			} else {
				if (page > 1) {
					list_this.endPullupToRefresh(true);
				}
				plus.nativeUI.toast(data.msg);
			}
			page_status = false;
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
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
	obj_data.page = page;
	claerDetail(obj_data);
	list_this = this;
}

// 上拉加载 end


// 筛选信息
function shaixuanFun() {
	// 重置上拉加载
	mui('.mui-content').pullRefresh().refresh(true);
	plus.nativeUI.showWaiting("加载中...");
	$(document).scrollTop(0) //重置滚动条的top值为0
	page = 1;
	obj_data.token = token;
	var self = plus.webview.currentWebview();
	obj_data.code = self.obj_code;
	obj_data.page = page;
	obj_data.month = $('#statics_input1').val();
	console.log(JSON.stringify(obj_data))
	claerDetail(obj_data);
}
$("#statics_input1").on("change", shaixuanFun)
// 筛选信息 end
