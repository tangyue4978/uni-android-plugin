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
// var pageStatus = true;
// var data_info = {};
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	plus.nativeUI.showWaiting("加载中...");
	list();
});
var obj1 = obj2 = obj3 = obj4 = null;
$("#city").on("change", list)

function list() {
	var cityCode = '';
	cityCode = $("#city").val();
	// if(cityCode != ''){
	// 	cityCode = $("#city").val() + '000000';
	// }
	// console.log(cityCode);
	// console.log(data_info.page)
	var _url = root + 'api/v3/riverchief/statistics/';
	mui.ajax(_url, {
		data: {
			"token": token,
		},
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			console.log(JSON.stringify(data.data.riverChief))
			if (data.code == 1) {
				obj1 = {
					id: "container",
					data: data.data.riverChief,
					subtitle: 22850,
					itemDistance: 10,
					y1:-50,
					y2:-10
				}
				pieChartFirst(obj1);
				obj2 = {
					id: "container2",
					data: data.data.lakeChief,
					subtitle: 49,
					itemDistance: 36,
					y1:-30,
					y2:-10
				}
				pieChartFirst(obj2);
				obj3 = {
					id: "container3",
					data: data.data.inspectRiver,
					subtitle: 3929,
					itemDistance: 20,
					y1:-50,
					y2:-30
				}
				pieChartFirst(obj3);
				obj4 = {
					id: 'container4',
					categories: data.data.dynamic.categories,
					series: data.data.dynamic.series
				}
				console.log(JSON.stringify(obj4))
				column(obj4);
			}
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
}


//河湖情况start
function pieChartFirst(data) {
	var chart = Highcharts.chart(data.id, {
		chart: {
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			type: 'pie'
		},
		title: {
			text: '合计',
			verticalAlign: 'middle',
			y: data.y1,
			style: {
				"color": "#333333",
				"fontSize": "0.24rem",
			}
		},
		subtitle: {
			text: data.subtitle,
			verticalAlign: 'middle',
			y: data.y2,
			style: {
				"color": "#3A77F0",
				"fontSize": "0.28rem",
			}
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				dataLabels: {
					enabled: false
				},
				showInLegend: true
			}
		},
		legend: {
			align: 'center',
			itemDistance: data.itemDistance,
			symbolHeight: 15,
			symbolWidth: 15,
			symbolRadius: 1,
			itemStyle: {
				fontSize: '0.18rem',
				color: '#666666',
				letterSpacing: 0
			},
			itemMarginTop: 10,
		},
		credits: {
			enabled: false
		},
		series: [{
			type: 'pie',
			innerSize: '65%',
			name: '河湖长制',
			data: data.data
		}],
	})
}
//河湖情况end
// 巡河统计start
function pie(data) {
	var chart = Highcharts.chart(data.id, {
		chart: {
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			type: 'pie'
		},
		title: {
			text: null
		},
		// 	tooltip: {
		// 　　　　pointFormat: '{series.name}: <b>{series.y}次</b>'
		// 　　},
		colors: data.colors,
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				borderWidth: 0,
				dataLabels: {
					enabled: true,
					// format: '<b>{point.name}</b>: {y} 次',
					style: {
						fontSize: "0.24rem",
					},
					formatter: function() {
						if (this.point.name == '太原市') {
							return '<span style="color:#FFC0AE">' + this.point.name + ' ' + this.y + '次</span>';
						} else if (this.point.name == '大同市') {
							return '<span style="color:#78D9E9">' + this.point.name + ' ' + this.y + '次</span>';
						} else if (this.point.name == '阳泉市') {
							return '<span style="color:#FFD44F">' + this.point.name + ' ' + this.y + '次</span>';
						} else if (this.point.name == '长治市') {
							return '<span style="color:#DA86FF">' + this.point.name + ' ' + this.y + '次</span>';
						} else if (this.point.name == '晋城市') {
							return '<span style="color:#84EA1E">' + this.point.name + ' ' + this.y + '次</span>';
						} else if (this.point.name == '朔州市') {
							return '<span style="color:#6FB4FF">' + this.point.name + ' ' + this.y + '次</span>';
						} else if (this.point.name == '晋中市') {
							return '<span style="color:#FF3366">' + this.point.name + ' ' + this.y + '次</span>';
						} else if (this.point.name == '运城市') {
							return '<span style="color:#FF9900">' + this.point.name + ' ' + this.y + '次</span>';
						} else if (this.point.name == '忻州市') {
							return '<span style="color:#FFCCCC">' + this.point.name + ' ' + this.y + '次</span>';
						} else if (this.point.name == '临汾市') {
							return '<span style="color:#CCCCCC">' + this.point.name + ' ' + this.y + '次</span>';
						} else if (this.point.name == '吕梁市') {
							return '<span style="color:#9B9B6A">' + this.point.name + ' ' + this.y + '次</span>';
						}
					}
				}
			}
		},
		credits: {
			enabled: false
		},
		series: [{
			type: 'pie',
			innerSize: '65%',
			name: '巡河统计',
			colorByPoint: true,
			data: data.data
		}]
	});
}

// 巡河统计end
// 动态信息start
// 怀仁市“三零”单位创建时间表、任务图

function column(data) {
	var chart = Highcharts.chart(data.id, {
		chart: {
			type: 'column',
			backgroundColor: ''
		},
		title: {
			// 标题内容
			text: data.title||"全省河、湖长制专项督查“一市（地）一单”问题销号进度",
			style: {
				"color": "#333333",
				"fontSize": "0.26rem"
			}
		},
		xAxis: {
			categories: data.categories,
			crosshair: true,
			labels: {
				style: {
					color: '#7B7B7B',
					fontSize: '0.24rem'
				}
			}
		},
		yAxis: {
			title: {
				enabled: false
			},
			labels: {
				enabled: false
			}
		},
		series: data.series,
		credits: {
			enabled: false
		},
		legend: {
			itemDistance: 30,
			symbolHeight: 15,
			symbolWidth: 15,
			symbolRadius: 1,
			itemStyle: {
				lineHeight: '0.24rem',
				fontSize: '0.24rem',
				color: '#7B7B7B',
				letterSpacing: 0,
			},
			itemMarginTop: 10
		},
		tooltip: {
			enabled: false
		},
		plotOptions: {
			column: {
				dataLabels: {
					enabled: true,
					allowOverlap: true, // 允许数据标签重叠
					// format: '{y}',
					style: {
						fontSize: "0.18rem",
					},
					formatter: function() {
						// console.log(this.series.name)
						if (this.series.name == '发现问题 678') {
							return '<span style="color:#0099FF">' + this.y + '</span>';
						} else if (this.series.name == '累计销号 431') {
							return '<span style="color:#00CC33">' + this.y + '</span>';
						}
					}
				}
			}
		},
	})
}

// 动态信息end
