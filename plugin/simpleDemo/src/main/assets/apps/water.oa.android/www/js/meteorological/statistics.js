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
// var page = 1;
var pageStatus = true;
// var data_info = {};
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	plus.nativeUI.showWaiting("加载中...");
	list();
});
// 修改当前月份
$("#screen_type .screen_span").on("click",function(){
	$("#screen_type .screen_span").removeClass("active");
	$(this).addClass("active");
	list();
})
// 修改地市信息
$("#city").on("change", list)

function list() {
	// var cityCode = '';
	// cityCode = ;
	var _url = root + 'api/v3/weatherdata/weather/statistics';
	var data_info = {
		"token": token,
		"type":$("#screen_type .screen_span.active").attr("data-type"),
		"areaCode":$("#city").val(),
		"timeData":$('#muiPicker').val()
	}
	console.log(_url);
	console.log(JSON.stringify(data_info));
	mui.ajax(_url, {
		data: data_info,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			console.log(JSON.stringify(data.data))
			if (data.code == 1) {
				if(pageStatus){
					// 日期选择
					var begins = data.data.maxTime.split('-');
					var ends = data.data.minTime.split('-');
					var dtpicker1 = new mui.DtPicker({
						type: "date",
						beginDate: new Date(ends[0],Number(ends[1]) - 1,ends[2]),//设置开始日期
						endDate: new Date(begins[0],Number(begins[1]) - 1,begins[2]),//设置结束日期
					});
					document.querySelector("#muiPicker").addEventListener("tap", function() {
						dtpicker1.show(function(items) {
							$("#muiPicker").val(items.y.text + "-" + items.m.text + "-" + items.d.text);
							list()
						});
					});
					// 日期选择
				}
				
				var type_str = data_info.type;
				var categories = [];
				if(type_str == 1){
					categories = data.data.day;
				}else if(type_str == 2){
					categories = data.data.month;
				}else if(type_str == 3){
					categories = data.data.year;
				}else{
					console.log("未知type类型")
				}
				// 降雨
				// var jiangyu_obj = {
				// 	id: "container1",
				// 	categories:categories,
				// 	yTitle:"降雨量(mm)",
				// 	series: [{
				// 		name: '平均降水量',
				// 		data: data.data.rainfall,
				// 		color:"#0070F0"
				// 	}]
				// }
				// lineChart(jiangyu_obj);
				// 温度
				var wendu_obj = {
					id: "container2",
					categories:categories,
					yTitle:"温度(℃)",
					series: [{
						name: '最高气温',
						data: data.data.temperatureMax,
						color:"#EE2500"
					},{
						name: '平均气温',
						data: data.data.temperature,
						color:"#FFCC00"
					},{
						name: '最低气温',
						data: data.data.temperatureMin,
						color:"#00DAF2"
					}]
				}
				lineChart(wendu_obj);
				// 风速
				var fengsu_obj = {
					id: "container3",
					categories:categories,
					yTitle:"风速(级)",
					series: [{
						name: '平均风速',
						data: data.data.wind,
						color:"#0070F0"
					}]
				}
				lineChart(fengsu_obj);
				// 湿度
				var shidu_obj = {
					id: "container4",
					categories:categories,
					yTitle:"湿度(%)",
					series: [{
						name: '平均湿度',
						data: data.data.humidity,
						color:"#0070F0"
					}]
				}
				lineChart(shidu_obj);
			}
			pageStatus = false;
		},
		error: function(xhr, type, errorThrown) {
			console.log(type)
			plus.nativeUI.closeWaiting();
		}
	})
}


/**
 * @param {Object} data
 * @description 折线图
 */
function lineChart(data) {
	var chart = Highcharts.chart(data.id, {
		chart: {
			type: 'line'
		},
		title: {
			text: null
		},
		xAxis: {
			categories: data.categories
		},
		yAxis: {
			title: {
				text: data.yTitle
			},
			labels:{
				format: '{value}'
			},
			lineWidth: 1
		},
		credits: {
			enabled: false
		},
		plotOptions: {
			line: {
				dataLabels: {
					// 开启数据标签
					enabled: true          
				},
				// 关闭鼠标跟踪，对应的提示框、点击事件会失效
				enableMouseTracking: false
			}
		},
		series: data.series
	});

}

