//图表

function columns(obj) {
	var chart = Highcharts.chart(obj.id, {
		chart: {
			type: 'column',
			marginTop: 20
		},
		title: {
			text: null
		},
		xAxis: {
			categories: obj.categories,
			title: {
				text: null
			},
			gridLineColor:'#cccccc',
			tickWidth: 1,
			tickColor: '#999999',
			lineColor: '#999999',
			lineWidth: 1
		},
		yAxis: {
			min: 0,
			title: {
				text: '使用量 (m³)',
				rotation: -0,
				align: 'high',
				margin: -60,
				y: -10
			},
			labels: {
				overflow: 'justify',
				format: '{value}'
			},
			lineColor: '#999999',
			lineWidth: 1
		},
		credits: {
			enabled: false
		},
		tooltip: {
			valueSuffix: ' m³'
		},
		plotOptions: {
			bar: {
				dataLabels: {
					enabled: true,
					allowOverlap: true // 允许数据标签重叠
				}
			}
		},
		legend: {
			enabled: false
		},
		series: obj.series
	});
}

// 日期start
var datatime = new Date();
var data_tiem = datatime.getFullYear() + "-" + (String(datatime.getMonth() + 1).length < 2 ? '0' + ((datatime.getMonth() +
	1)) : (datatime.getMonth() + 1));
$(".date_picker").val(data_tiem);
var dtpicker1 = new mui.DtPicker({
	"type": "month"
});
document.querySelector(".date_picker").addEventListener("tap", function() {
	dtpicker1.show(function(items) {
		$(".date_picker").val(items.y.text + "-" + items.m.text);
		objs.month = items.y.text + "-" + items.m.text;
		page = 1;
		objs.page = page;
		// datePicker(objs);
		shaixuanFun(objs.month)
	});
});
// 日期end

//弹出图片
