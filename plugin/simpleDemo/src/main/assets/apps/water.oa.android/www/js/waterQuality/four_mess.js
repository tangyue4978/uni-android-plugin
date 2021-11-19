var page_status = true;
// 获取基础信息
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
var data_info = {};
var shaixuanindex = 0;//筛选蓝快index
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	plus.nativeUI.showWaiting("加载中...");
	data_info.token = token;
	data_info.page = page;
	data_info.code = self.item_id;
	data_info.basin = 0; //流域code
	data_info.city = 0; //地市信息
	data_info.type = 0; //水质类别
	data_info.date = $("#statics_input").val(); //日期
	data_info.category = "" //分类名称  '水源地'、'地下水'、'河流水质'、'水库水质' 其他为'全部'
	data_info.name = "" //名称搜索
	data_info.search_status = 0; //控制条件查询 0插入条件，否则不插入;
	list(data_info);
	
	var area_info = {"token": token}
	getArea(data_info)
});

function list(data_info) {
	var _url = root + 'api/v3/water_quality/list';
	console.log(_url);
	console.log(JSON.stringify(data_info));
	mui.ajax(_url, {
		data: data_info,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			
			plus.nativeUI.closeWaiting();
			page = data_info.page;
			if (data.code == 1) {
				$(".list_number span").html(data.data.total);
				data_list = data.data.station
				//处理搜索项
				if (page_status) {
					console.log(page_status)
					data.data.city.forEach(function(item, index) {
						$("#city_sort").append('<option value="' + item.value + '">' + item.name + '</option>');
					});
					data.data.basin.forEach(function(item, index) {
						$("#river_sort").append('<option value="' + item.value + '">' + item.name + '</option>');
					});
					data.data.type.forEach(function(item, index) {
						$("#type_sort").append('<option value="' + item.value + '">' + item.name + '</option>');
					});
					// data.data.station.time.forEach(function(item,index) {
					// 		$("#type_time").append('<input type="" class="statics_input" id="statics_input" readonly="" placeholder="2021-01-01"/>');
					// });
					// <input type="" class="statics_input" id="statics_input" readonly="" placeholder="2021-01-01"/>


					document.querySelector(".statics_input").addEventListener("tap", function() {
						var startTime = data.data.startTime.split("-");
						var currentTime = data.data.currentTime.split("-");
						var dtpicker = new mui.DtPicker({
							type: "date",
							beginDate: new Date(startTime), //设置开始日期 
							endDate: new Date(currentTime), //设置结束日期 
						})
						dtpicker.setSelectedValue($('#statics_input').val())
						dtpicker.show(function(e) {
							console.log(e.text);
							var data_input_time = e.text;
							$('#statics_input').val(data_input_time);
							shaixuanFun()
						})
					})

				}

				if (page > 1) {
					list_this.endPullupToRefresh(false);
				}
				if (page == 1) {


					$(".lists").html("");

					console.log(page);
				}
				if (data_info.page == 1) {
					$("#statics_header").html("");
					$("#statics_bottom").html("");
					//处理概要统计
					data.data.category.value.forEach(function(item, index) {
						var active = shaixuanindex == index ? " active " : "333";
						if (data.data.category.name.length - 1 == index) {
							$("#statics_header").append('<li class="unborder '+active+'" data-name="' + data.data.category.name[index] + '">' +
								item + '</li>');
						} else {
							$("#statics_header").append('<li class="'+active+'" data-name="' + data.data.category.name[index] + '">' + item + '</li>');
						}
					});
					console.log($("#statics_header").html());

					data.data.category.name.forEach(function(item, index) {
						var active = shaixuanindex == index ? " active " : "333";
						$("#statics_bottom").append('<li class="'+active+'" data-name="' + data.data.category.name[index] + '"><span>' + item + '</span></li>');
					});
				}

				if (data_list.length > 0) {

					// console.log(JSON.stringify(data.data))

					data_list.forEach(function(item, index) {
						var li_html = '<li class="lists_li" onclick="xiangqing(' + item.id + ')">' +
							'<ul class="lists_data">' +
							'<li class="lists_data_head">' +
							'<span class="lists_data_head_l">' + item.name + '</span>' +
							'<span class="lists_data_head_r"><span class="kuang' + (7 - item.type.value) + '">' + item.type.name + '</span><span class="lists_data_head_status" style="background-color: '+item.report.value+';">'+item.report.name+'</span></span>' +
							'</li>' +
							'<li>' +
							'<span>' + item.address + '</span>' +
							'</li>';
						item.other.forEach(function(other_item, other_index) {
							if (other_index % 3 == 0) {
								if (other_index != 0) {
									li_html += '</li>';
								}
								li_html += '<li>';
								li_html += '<span>' + other_item.name + ':' + other_item.value + '</span>';
							} else {
								li_html += '<span>' + other_item.name + ':' + other_item.value + '</span>';
							}
							li_html += '&nbsp;&nbsp;&nbsp;';
						});
						li_html += '<li>' +
							'<span>更新时间:' + item.time + '</span>' +
							'</li>' +
							'</ul>' +
							'</li>';
						$(".lists").append(li_html)
					})

				} else {
					if (page > 1) {
						list_this.endPullupToRefresh(true);
					} else {
						$(".lists").html(
							'<a style="font-size:0.35rpx;text-align:center;padding:1rem 0rem;width:100%;display:block;">暂无数据</a>'
						)
					}
				}

				// // 追加筛选条件
				// if (data_info.search_status == 0 && data_info.page == 1) {
				// 	newHtmlAdd(".search_form ul",data.listSearchConfig)
				// }
				// // 追加筛选条件 end
				// $(".mui-loading").css("display", "none")
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

function xiangqing(item_id) {
	var self = plus.webview.currentWebview();
	mui.openWindow({
		url: 'four_mess_detail.html', //通过URL传参
		id: 'four_mess_detail.html', //通过URL传参
		extras: {
			item_id: item_id,
		}
	})
};
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


// 筛选信息
function shaixuanFun() {
	// 重置上拉加载
	mui('.mui-content').pullRefresh().refresh(true);
	plus.nativeUI.showWaiting("加载中...");
	$(document).scrollTop(0) //重置滚动条的top值为0
	page = 1;
	data_info.page = page;
	data_info.type = $("#type_sort").val();
	// data_info.city = $("#city_sort").val();
	data_info.city = $("#city_sort").attr("data-code");
	data_info.basin = $("#river_sort").val();
	data_info.date = $("#statics_input").val();
	data_info.category = $("#statics_header li.active").attr("data-name") //分类名称  '水源地'、'地下水'、'河流水质'、'水库水质' 其他为'全部'
	data_info.name = $("#username").val(); //名称搜索
	list(data_info);
}
$("#city_sort").on("change", shaixuanFun)
$("#river_sort").on("change", shaixuanFun)
$("#type_sort").on("change", shaixuanFun)
// $("#search").on("click", shaixuanFun)

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
// 数据列表蓝快点击事件

$("body").on("click", "#statics_header li", function() {
	$("#statics_header li").removeClass("active");
	$("#statics_bottom li").removeClass("active");
	var index = $(this).index();
	shaixuanindex = $(this).index();
	$("#statics_header li").eq(index).addClass("active");
	$("#statics_bottom li").eq(index).addClass("active");
	shaixuanFun()
})
$("body").on("click", "#statics_bottom li", function() {
	$("#statics_header li").removeClass("active");
	$("#statics_bottom li").removeClass("active");
	var index = $(this).index();
	shaixuanindex = $(this).index();
	$("#statics_header li").eq(index).addClass("active");
	$("#statics_bottom li").eq(index).addClass("active");
	shaixuanFun()
})
