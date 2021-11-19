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
var shaixuanindex = 0;//筛选蓝快index
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	if (self.type_id == undefined) {
		self.type_id = 0;
	}
	plus.nativeUI.showWaiting("加载中...");
	data_info.token = token;
	data_info.page = page;
	data_info.pageSize = 10;
	data_info.type = '';
	data_info.cityCode = '';
	data_info.startDate = '';
	data_info.endDate = '';
	data_info.status = 1
	data_info.riverName = ''
	list(data_info);
});
$("#type").on("change", submit_fun)
$("#city").on("change", submit_fun)
$("#status").on("change", submit_fun)
// $('#searchRiver').on('click',submit_fun)
// 放大镜按钮点击事件与键盘事件
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
// 放大镜按钮点击事件与键盘事件
function list(data_info) {
	console.log("=====================")
	console.log(JSON.stringify(data_info))
	var _url = root + 'api/v3/riverchief/fourchaosproblem/';
	mui.ajax(_url, {
		data: data_info,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			console.log(JSON.stringify(data))
			if (data.code == 1) {

				// 城市编码||全部类型
				var code = data.data.city;
				var type = data.data.type;
				var problemStatus = data.data.problemStatus;
				if (pageStatus) {
					// 城市编码
					for (keys in code) {
						$('#city').append(
							'<option value="' + keys + '">' + code[keys] + '</option>')
					}
					// 全部类型
					for (keyss in type) {
						$('#type').append(
							'<option value="' + keyss + '" data-name="'+type[keyss]+'">' + type[keyss] + '</option>')
					}
					// 问题状态
					for (keysss in problemStatus) {
						if(keysss == '未处理'){
							$('#status').append(
								'<option value="' + 0 + '">' + keysss + '</option>')
						}else{
							$('#status').append(
								'<option value="' + 1 + '">' + keysss + '</option>')
						}
							
						
					}

					//日期选择start
					var startDate = data.data.date;
					console.log(JSON.stringify(startDate))
					var dateObj;
					var dateArr = [];
					for (let i = 0; i < startDate.length; i++) {
						dateObj = {
							value: startDate[i].value,
							text: startDate[i].name
						}
						dateArr.push(dateObj)
					}
					console.log(JSON.stringify(dateArr))
					$('#statics_input1').val(dateArr[1].value);
					$('#statics_input2').val(dateArr[0].value);
					document.querySelector("#statics_input1").addEventListener("tap", function() {
						var picker1 = new mui.PopPicker();
						picker1.setData(dateArr)
						picker1.pickers[0].setSelectedValue($('#statics_input1').val(), 2000);
						picker1.show(function(e) {
							console.log(e[0].value);
							var data_input_time1 = e[0].value;
							$('#statics_input1').val(data_input_time1);
							submit_fun()
						})
					})
					document.querySelector("#statics_input2").addEventListener("tap", function() {
						var picker2 = new mui.PopPicker();
						picker2.setData(dateArr)
						picker2.pickers[0].setSelectedValue($('#statics_input2').val(), 2000);
						picker2.show(function(e) {
							console.log(e[0].value);
							var data_input_time2 = e[0].value;
							$('#statics_input2').val(data_input_time2);
							submit_fun()
						})
					})
					// 日期选择end	
				}

				//四乱统计
				var num_html = '';
				var title_html = '';
				var statistics = data.data.statistics;
				// console.log(JSON.stringify(statistics))
				for (key in statistics) {
					var active = shaixuanindex == key ? " actives " : "333";
					num_html += '<li class="'+active+'">' + statistics[key] + '</li>';
					$('.header_list_num').html(num_html)
					
					var active = shaixuanindex == key ? " actives " : "333";
					title_html += '<li class="'+active+'"><span>' + key + '</span></li>';
					$('.header_list_title').html(title_html)
				}
				console.log(shaixuanindex);
				console.log($('.header_list_num').html());
				console.log($('.header_list_title').html());
				
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
					var infobox = data.data.info;
					$('#all_num').text(data.data.total);
					for (let i = 0; i < infobox.length; i++) {
						$('.lists').append(
							'<li class="lists_li lists_lis"><ul class="lists_data lists_datas" onclick="xiangqing(' + infobox[i].id +
							')">' +
							'<li class="titles"><span class="weight">' + infobox[i].title + '</span></li>' +
							'<li class="position titless"><span class="all_num">' + infobox[i].status + '</span></li>' +
							'<li><span>地址：</span><span>' + infobox[i].location + '</span></li>' +
							'<li><span>批次编码：</span><span>' + infobox[i].batchCode + '</span></li>' +
							'<li class="titlea"><span>河段地址：</span><span>' + infobox[i].specificLocation + '</span></li>' +
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
			} else {
				if (page > 1) {
					list_this.endPullupToRefresh(true);
				}
				plus.nativeUI.toast(data.msg);
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
		url: 'clear_four_mess_detail.html', //通过URL传参
		id: 'clear_four_mess_detail.html', //通过URL传参
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
	data_info.type = $('#type').val();
	data_info.cityCode = $('#city').val();
	data_info.startDate = $('#statics_input1').val();
	data_info.endDate = $('#statics_input2').val();
	data_info.status = $('#status').val();
	data_info.riverName = $('#riverName').val();
	list(data_info);
}

// 数据列表蓝快点击事件
$("body").on("click", "#statics_header li", function() {
	$("#statics_bottom li").removeClass("actives");
	$("#statics_header li").removeClass("actives");
	var index = $(this).index();
	$("#statics_bottom li").eq(index).addClass("actives");
	$("#statics_header li").eq(index).addClass("actives");
	shaixuanindex = $("#statics_bottom li").eq(index).text();
	var type_val = $("#type option[data-name='"+shaixuanindex+"']").val()
	console.log(type_val);
	$("#type").val(type_val);
	submit_fun()
})
$("body").on("click", "#statics_bottom li", function() {
	$("#statics_bottom li").removeClass("actives");
	$("#statics_header li").removeClass("actives");
	var index = $(this).index();
	$("#statics_bottom li").eq(index).addClass("actives");
	$("#statics_header li").eq(index).addClass("actives");
	shaixuanindex = $(this).text();
	var type_val = $("#type option[data-name='"+shaixuanindex+"']").val()
	console.log(type_val);
	$("#type").val(type_val);
	submit_fun()
})