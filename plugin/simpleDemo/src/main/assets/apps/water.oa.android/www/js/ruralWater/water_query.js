function line(data) {
	var chart = Highcharts.chart(data.id, {
		chart: {
			type: 'line',
			backgroundColor: null
		},
		title: {
			text: '用水量趋势分析',
			verticalAlign: 'bottom',
			style: {
				"fontSize": "14px"
			}
		},
		subtitle: {
			text: null
		},
		credits: {
			enabled: false
		},
		xAxis: {
			categories: data.categories
		},
		yAxis: {
			title: {
				text: null
			},
			labels: {
				format: '{value}'
			}
		},
		legend: {
			enabled: false,
		},
		series: data.series
	});
}



var root = localStorage.getItem("str_url");
var token = localStorage.getItem("token");
if (root == "" || root == undefined || root == null) {
	mui.openWindow({
		url: 'login.html?cid=1', //通过URL传参
		id: 'login.html?cid=1', //通过URL传参
	})
}
// 获取token
var new_token = '';

function tokenFun() {
	var _url = root + 'api/v2/meter_statistics/get_token';
	var data = {
		"token": token
	}
	console.log(_url);
	console.log(JSON.stringify(data));
	mui.ajax(_url, {
		data: data,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(res) {
			console.log("----------333" + JSON.stringify(res));
			new_token = res.token;
			getStatisticsData()
		},
		error: function(xhr, type, errorThrown) {
			console.log("请求错误");
			console.log(xhr, type, errorThrown);
		}
	})
}
mui.plusReady(function() {
	//			选择时间
	var datatime = new Date();
	var datatime2 = new Date((datatime.getTime() - 24 * 60 * 60 * 1000));
	var data_tiem = datatime.getFullYear() + "-" + (String(datatime.getMonth() + 1).length < 2 ? '0' + ((datatime.getMonth() +
		1)) : (datatime.getMonth() + 1)) + "-" + (String(datatime.getDate()).length < 2 ? "0" + datatime.getDate() :
		datatime.getDate());
	var data_tiem2 = datatime2.getFullYear() - 1 + "-" + (String(datatime2.getMonth() + 1).length < 2 ? '0' + ((
		datatime2.getMonth() + 1)) : (datatime2.getMonth() + 1)) + "-" + (String(datatime2.getDate()).length < 2 ? "0" +
		datatime2.getDate() : datatime2.getDate());
	$("#statics_input1").html('<option value="">' + data_tiem + '</option>');
	$("#statics_input2").html('<option value="">' + data_tiem + '</option>');
	var dtpicker1 = new mui.DtPicker({
		"type": "date"
	});
	document.querySelector("#statics_input1").addEventListener("tap", function() {
		dtpicker1.show(function(items) {
			$("#statics_input1").html('<option value="">' + items.y.text + "-" + items.m.text + "-" + items.d.text +
				'</option>');
			getStatisticsData()
		});
	});
	var dtpicker2 = new mui.DtPicker({
		"type": "date"
	});
	document.querySelector("#statics_input2").addEventListener("tap", function() {
		dtpicker2.show(function(items) {
			$("#statics_input2").html('<option value="">' + items.y.text + "-" + items.m.text + "-" + items.d.text +
				'</option>');
			getStatisticsData()
		});
	});
	tokenFun()
})
/**
 * @description 获取统计数据值
 * @param {type}  
 */
$('#city').on('change', getStatisticsData)
$('#statics_input1').on('change', getStatisticsData)
$('#statics_input2').on('change', getStatisticsData)
var city_code = star_time = end_time = ""

function getStatisticsData() {
	plus.nativeUI.closeWaiting();
	var _url = 'http://rural_water.sxjicheng.com/api/v1/meter_search_wateroa/';
	city_code = $("#city").val();
	star_time = $("#statics_input1").text();
	end_time = $("#statics_input2").text();
	console.log(star_time);
	console.log(end_time);
	var data = {
		"token": new_token,
		"county_code": city_code,
		"star_time": star_time,
		"end_time": end_time
	}
	console.log(_url);
	console.log(JSON.stringify(data));
	mui.ajax(_url, {
		data: data,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(res) {
			console.log("----------" + JSON.stringify(res.data));
			var data = res.data;
			$("#use_value .color1").text(data.totle.total_in_num);
			$("#use_value .color2").text(data.totle.total_num);
			$("#use_value .color3").text(data.totle.total_report);

			var obj = {
				id: 'container1',
				categories: data.head.movements_key,
				series: [{
					name: '用水量',
					data: data.head.left_head_movements,
				}]
			}
			line(obj);
			console.log(JSON.stringify(data.data))
			var div_html = ''
			data.data.forEach(function(item, index) {
				div_html += '<div class="access1">' +
					'<div class="access_title">' +
					'<div class="access_titleL">' +
					'<div class="shu"></div>' +
					'<span>' + item.areaName + '</span>' +
					'</div>' +
					'<div class="access_titleR">' +
					'<span>接入率排名：' + (index + 1) + '</span>' +
					'</div>' +
					'</div>' +
					'<div class="access_content">' +
					'<div class="access_line">' +
					'<span>区县(已接/应接)：' + item.have + '/' + item.should + '</span>' +
					'<span>村(已接/应接)：' + item.inNum + '/' + item.totalNum + '</span>' +
					'</div>' +
					'<div class="access_line">' +
					'<span>用水量(本季/本月/上一日):' + item.q_data + '/' + item.m_data + '/' + item.y_data + '</span>' +
					'</div>' +
					'<div class="access_line">' +
					'<span>上报成功率：100.0%</span>' +
					'<span>抄表准确率：100.0%</span>' +
					'</div>' +
					'<div class="access_line">' +
					'<span>故障率：' + item.faultNum + '</span>' +
					'</div>' +
					'</div>' +
					'</div>';
			});
			$('.access_list').html(div_html);
		},
		error: function(xhr, type, errorThrown) {
			console.log("请求错误");
			console.log(xhr, type, errorThrown);
		}
	})
}
