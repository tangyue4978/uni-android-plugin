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
var data_info = {};
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	plus.nativeUI.showWaiting("加载中...");
	data_info.token = token;
	data_info.page = page;
	data_info.typeId = '1';
	data_info.cityCode = 0;
	data_info.city_code = 0;
	list(data_info);
});

function list(data_info) {
	console.log(JSON.stringify(data_info));
	var urlInterface = [{
			name: "全部灌区类型",
			interface_url: "api/v2/rural_irrigation/large",
			type: 1
		},
		{
			name: "大型灌区",
			interface_url: "api/v2/rural_irrigation/",
			type: 2
		},
		{
			name: "中型水库",
			interface_url: "api/v3/reservoir/list",
			type: 3
		}
	]


	var _url = root + urlInterface[data_info.typeId - 1].interface_url;
	console.log(_url);
	//处理额外参数
	switch(data_info.typeId) {
		case '3':
			data_info.scaleType =1;
			break;
		case '4':
			data_info.scaleType =2;
			break;
		case '5':
			data_info.type = 5;
			break;
		case '6':
			data_info.type = 4;
			break;
		case '7':
			data_info.type = 1;
			break;
	}
	mui.ajax(_url, {
		data: data_info,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			console.log("---reponse----------" + JSON.stringify(data));
			$(".list_number").children("span").html(0);
			if (data.code == 1) {

				switch (data_info.typeId) {
					case '1':
					case '2':
					case '7':
					case '8':
						data_list = data.data;
						break;
					case '13':
					case '14':
						data_list = data.data.list;
						break;
					case '3':
					case '4':
					case '15':
						data_list = data.data.data;
						break;
					case '16':
						data_list = data.data.info;
						break;
					default:
						data_list = data.data.result;
						break;
				}
				console.log(data_list.length);
				if (data_list.length > 0) {
					if (data_info.page > 1) {
						list_this.endPullupToRefresh(false);
					}
					if (data_info.page == 1) {
						console.log('page=====');
						$(".listBox").html("");
					}
					updateContent(data_info.typeId, data);
				} else {
					if (data_info.page > 1) {
						list_this.endPullupToRefresh(true);
					} else {
						$(".listBox").html("");
						$(".listBox").append(
							'<a style="font-size:0.35rpx;text-align:center;margin-top:100px;">暂无数据</a>'
						)
					}
				}

				$(".mui-loading").css("display", "none")
			}
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
}

function updateContent(typeId, data) {
	console.log('updateContent@@@@@@@@@=' + typeId);
	switch (typeId) {
		case '3':
		case '4':
			$(".list_number").children("span").html(data.data.count);
			data.data.data.forEach(function(item, index) {
				var li_html = '<li class="lists_li" onclick="xiangqing(' + typeId + ',' + item.id + ')">' +
					'<ul class="lists_data">' +
					'<li class="lists_data_head">' +
					'<span class="lists_data_head_l">' + item.name + '</span>' +
					'<span class="lists_data_head_r">'+item.city+' ' + item.county+'</span>' +
					'</li>' +
					'<li>' +
					'<span>水库类型:</span>' +
					'<span>'+item.type+'</span>' +
					'</li>' +
					'<li>' +
					'<span>供水对象:</span>' +
					'<span>'+item.objectWaterSupply+'</span>' +
					'</li>' +
					'<li>' +
					'<span>所在河流:</span>' +
					'<span>'+item.riversName+'</span>' +
					'</li>' +
					'</ul>' +
					'</li>';
				$(".listBox").append(li_html);
			});
			break;
		case '5':
		case '6':
			$(".list_number").children("span").html(data.data.count);
			data.data.result.forEach(function(item, index) {
				var li_html = '<li class="lists_li" onclick="xiangqing(' + typeId + ',' + item.id + ')">' +
					'<ul class="lists_data">' +
					'<li class="lists_data_head">' +
					'<span class="lists_data_head_l">' + item.applicant_name + '</span>' +
					'<span class="lists_data_head_r">';
				item.city.forEach(function(item, index) {
					if (index < 2) {
						li_html += item + '&nbsp;&nbsp;';
					}
				});
				li_html += '</span></li></li>'
				item.data.forEach(function(item, index) {
					li_html += '<li><span>' + item.name + ':</span> &nbsp;&nbsp;<span>' + item.value + '</span></li>';
				});
				li_html += '</ul></li>';
				$(".listBox").append(li_html);
			});
			break;
		case '7':
		case '8':
			$(".list_number").children("span").html(data.number);
			data.data.forEach(function(item, index) {
				var li_html = '<li class="lists_li" onclick="xiangqing(' + typeId + ',' + item.id + ')">' +
					'<ul class="lists_data">' +
					'<li class="lists_data_head">' +
					'<span class="lists_data_head_l">' + item.waterProjectName + '</span>' +
					'<span class="lists_data_head_r">'+item.city+' ' + item.county+'</span>'+
					'</li>' +
					'<li>' +
					'<span>设计供水规模(m³/d):</span>' +
					'<span>' + item.designScale + '</span>' +
					'</li>' +
					'<li>' +
					'<span>水源类型:</span>' +
					'<span>' + item.waterSourceType + '</span>' +
					'</li>' +
					'<li>' +
					'<span>地点:</span>' +
					'<span>' + item.address + '</span>' +
					'</li>' +
					'</ul>' +
					'</li>';
				$(".listBox").append(li_html);
			});
			break;
		case '9':
		case '10':
		case '11':
			$(".list_number").children("span").html(data.data.count);
			data.data.result.forEach(function(item, index) {
				var li_html = '<li class="lists_li" onclick="xiangqing(' + typeId + ',' + item.id + ')">' +
					'<ul class="lists_data">' +
					'<li class="lists_data_head">' +
					'<span class="lists_data_head_l">' + item.name + '</span>' +
					'<span class="lists_data_head_r">';
				item.city.forEach(function(item, index) {
					if (index < 2) {
						li_html += item + '&nbsp;&nbsp;';
					}
				});
				li_html += '</span></li></li>'
				item.data.forEach(function(item, index) {
					li_html += '<li><span>' + item.name + ':</span> &nbsp;&nbsp;<span>' + item.value + '</span></li>';
				});
				li_html += '</ul></li>';
				$(".listBox").append(li_html);
			});
			break;
		case '12':
			$(".list_number").children("span").html(data.data.count);
			data.data.result.forEach(function(item, index) {
				var li_html = '<li class="lists_li" onclick="xiangqing(' + typeId + ',' + item.id + ')">' +
					'<ul class="lists_data">' +
					'<li class="lists_data_head">' +
					'<span class="lists_data_head_l">' + item.name + '</span>' +
					//'<span class="lists_data_head_r">大同市 阳高县</span>'+
					'</li>' +
					'<li>';
				item.city.forEach(function(item, index) {
					li_html += '<span>' + item + '</span> &nbsp;&nbsp;';
				});


				li_html += '</li>'
				item.data.forEach(function(item, index) {
					li_html += '<li><span>' + item.name + ':</span> &nbsp;&nbsp;<span>' + item.value + ':</span></li>';
				});
				li_html += '</ul></li>';
				$(".listBox").append(li_html);
			});
			break;
		case '13':
			$(".list_number").children("span").html(data.data.totalCount);
			data.data.list.forEach(function(item, index) {
				var li_html = '<li class="lists_li" onclick="xiangqing(' + typeId + ',' + item.id + ')">' +
					'<ul class="lists_data">' +
					'<li class="lists_data_head">' +
					'<span class="lists_data_head_l">' + item.name + '</span>' +
					//'<span class="lists_data_head_r">大同市 阳高县</span>'+
					'</li>' +
					'<li>' +
					'<span>年最大取水量:</span>' +
					'<span>' + item.waterFlowMax + '</span>' +
					'</li>' +
					'<li>' +
					'<span>主要取水用途:</span>' +
					'<span>' + item.show_mainpurpose + '</span>' +
					'</li>' +
					'<li>' +
					'<span>地点:</span>' +
					'<span>' + item.address + '</span>' +
					'</li>' +
					'</ul>' +
					'</li>';
				$(".listBox").append(li_html);
			});
			break;
		case '14':
			$(".list_number").children("span").html(data.data.totalCount);
			data.data.list.forEach(function(item, index) {
				var li_html = '<li class="lists_li" onclick="xiangqing(' + typeId + ',' + item.id + ')">' +
					'<ul class="lists_data">' +
					'<li class="lists_data_head">' +
					'<span class="lists_data_head_l">' + item.name + '</span>' +
					//'<span class="lists_data_head_r">大同市 阳高县</span>'+
					'</li>' +
					'<li>' +
					'<span>堤防型式:</span>' +
					'<span>' + item.dikePattern + '</span>' +
					'</li>' +
					'<li>' +
					'<span>堤防类型:</span>' +
					'<span>' + item.show_dikeType + '</span>' +
					'</li>' +
					'<li>' +
					'<span>日变幅(m):-0.01</span>' +
					'<span>月变幅(m):-0.01</span>' +
					'</li>' +
					'</ul>' +
					'</li>';
				$(".listBox").append(li_html);
			});
			break;
		case '15':
			$(".list_number").children("span").html(data.data.count);
			data.data.data.forEach(function(item, index) {
				var li_html = '<li class="lists_li" onclick="xiangqing(' + typeId + ',' + item.id + ')">' +
					'<ul class="lists_data">' +
					'<li class="lists_data_head">' +
					'<span class="lists_data_head_l">' + item.project_name + '</span>' +
					'<span class="lists_data_head_r">' + item.city_name + ' ' + item.county_name + '</span>' +
					'</li>' +
					'<li>' +
					'<span>取水类型:</span>' +
					'<span>' + item.get_water_type + '</span>' +
					'</li>' +
					'<li>' +
					'<span>取水水源名称:</span>' +
					'<span>' + item.get_water_name + '</span>' +
					'</li>' +
					'</ul>' +
					'</li>';
				$(".listBox").append(li_html);
			});
			break;
		case '16':
			$(".list_number").children("span").html(data.data.total);
			data.data.info.forEach(function(item, index) {
				var li_html = '<li class="lists_li" onclick="xiangqing(' + typeId + ',' + item.id + ')">' +
					'<ul class="lists_data">' +
					'<li class="lists_data_head">' +
					'<span class="lists_data_head_l">' + item.name + '</span>' +
					'<span class="lists_data_head_r">' + item.city + ' ' + item.country + '</span>' +
					'</li>' +
					'<li>' +
					'<span>井深:</span>' +
					'<span>' + item.wellDepth + '</span>' +
					'</li>' +
					'<li>' +
					'<span>地下水深:</span>' +
					'<span>' + item.groundwaterDepth + '</span>' +
					'</li>' +
					'<li>' +
					'<span>成井时间:</span>' +
					'<span>' + item.completionTime + '</span>' +
					'</li>' +
					'</ul>' +
					'</li>';
				$(".listBox").append(li_html);
			});
			break;
		default:
			console.log("default");
			$(".list_number").children("span").html(data.number);
			data.data.forEach(function(item, index) {
				var li_html = '<li class="lists_li" onclick="xiangqing(' + typeId + ',' + item.id + ')">' +
					'<ul class="lists_data">' +
					'<li class="lists_data_head">' +
					'<span class="lists_data_head_l">' + item.irrigationName + '</span>' +
					'<span class="lists_data_head_r">' + item.city + '</span>' +
					'</li>' +
					'<li>' +
					'<span>设计灌溉面积(万亩):</span>' +
					'<span>'+item.designIrrigationArea+'</span>' +
					'</li>' +
					'<li>' +
					'<span>受益县区:</span>' +
					'<span>'+item.benefitCounty+'</span>' +
					'</li>' +
					'</ul>' +
					'</li>';
				$(".listBox").append(li_html);
			});
			break;
	}

}

function xiangqing(typeId, itemId) {
	var self = plus.webview.currentWebview();
	var url = '';
	console.log(typeId);
	var params = {
			item_id: itemId
		};
	switch (typeId) {
		case 1:
			console.log('typeId=1');
			url = '/pages/ruralWater/searchDetails.html';
			params = {
				item_id: itemId,
				type: 'big_irrigatedArea'
			};
			break;
		case 2:
			url = '/pages/ruralWater/searchDetails.html';
			params = {
				item_id: itemId,
				type: 'query_irrigatedArea'
			};
			break;
		case 3:
		case 4:
			url = '/pages/reservoirLevel/details.html';
			params = {
				item_id: itemId,
			};
			break;
		case 5:
		case 6:
			url = '/pages/waterIntake/waterIntake_detail.html';
			params = {
				item_id: itemId,
			};
			break;
		case 7:
		case 8:
			url = '/pages/ruralWater/searchDetails.html';
			params = {
				item_id: itemId,
				type: 'query_supWater'
			};
			break;
		case 9:
			url = '/pages/map/searchDetails-zhigou.html';
			break;
		case 10:
			url = '/pages/map/gatelist.html';
			break;
		case 11:
			url = '/pages/map/pumplist.html';
			break;
		case 12:
			url = '/pages/map/searchDetails-paiwu.html';
			break;
		case 13:
			url = '/pages/map/searchDetails-qushuikou.html';
			break;
		case 14:
			url = '/pages/map/searchDetails-difang.html';
			break;
		case 15:
			url = '/pages/map/callwater.html';
			break;
		case 16:
			url = '/pages/map/elecwell.html';
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
	data_info.page = 1;
	data_info.typeId = $("#type_select").val();
	var cityCode = $("#city_select").val();
	data_info.cityCode = data_info.city_code = cityCode;
	list(data_info);
}
$("#city_select").on("change", shaixuanFun)
$("#type_select").on("change", shaixuanFun)
