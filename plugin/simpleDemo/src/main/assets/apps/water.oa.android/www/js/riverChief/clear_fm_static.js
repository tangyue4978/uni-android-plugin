$(function() {
	document.addEventListener("plusready", () => {
		fetchStatisticsData()
		handleSearchListener()
	})
})

let cityCode // 城市
let searchDate // 时间

/**
 * @function handleSearchListener
 * @description 监听搜索
 */
const handleSearchListener = function() {
	// 城市
	$('.select_city').on('change', function() {
		fetchStatisticsData()
	})
	
	// 时间
	$('.select_date').on('change', function() {
		fetchStatisticsData()
	})
}


/**
 * @function fetchStatisticsData
 * @description 查询统计数据
 */
const fetchStatisticsData = function() {
	let rootUrl = localStorage.getItem("str_url")
	let token = localStorage.getItem('token')
	cityCode = $('.select_city').val()
	searchDate = $('.select_date').val()
	
	plus.nativeUI.showWaiting("加载中...");
	
	mui.ajax(rootUrl + 'api/v3/riverchief/fourchaosproblem/statistics', {
		type: 'post',
		data: handleRequestData({
			token: token,
			code: cityCode,
			date: searchDate
		}),
		dataType: 'json',
		success: res => {
			plus.nativeUI.closeWaiting()
			
			if (res.code == 1) {
				$(".main").show()
				let response = res.data
				let cityList = response.city
				let dateList = response.date
				let dataBar = response.data[0].data
				let dataPie1 = response.data[1].data
				let dataPie2 = response.data[2].data
				
				let citySearchHtml = '<option value="">山西省</option>'
				let dateSearchHtml = '<option value="">日期</option>'
				
				initBarChart(dataBar)
				initPieChart('pie_chart_1', dataPie1, 6)
				initPieChart('pie_chart_2', dataPie2, 6)
				
				// 字符串拼接操作 - 搜索 - 省市
				for (let key in cityList) {
					citySearchHtml += `<option value="${key}">${cityList[key]}</option>`
				}
				
				// 字符串拼接操作 - 搜索 - 日期
				dateList.forEach(item => {
					dateSearchHtml += `<option value="${item.value}">${item.name}</option>`
				})
				
				// 搜索 option
				if (!$('.select_city').children('option').length) {
					$('.select_city').html(citySearchHtml)
				}
				
				// 搜索 option
				if (!$('.select_date').children('option').length) {
					$('.select_date').html(dateSearchHtml)
				}
			} else {
				mui.toast(res.msg)
			}
		},
		error: err => {
			plus.nativeUI.closeWaiting()
			mui.toast("网络异常，接口请求失败")
		}
	})
}

/**
 * @function initBarChart
 * @description 初始化柱状图
 */
const initBarChart = function(dataBar) {
	let xList = []
	let yList = []
	
	dataBar.forEach(item => {
		xList.push(item.name)
		yList.push(parseInt(item.value))
	})
	
	const chart = Highcharts.chart('line_chart', {
		chart: {
			height: '200px',
			type: 'column',
			backgroundColor: ''
		},
		title: {
			text: null // 禁用标题
		},
		credits: {
			enabled: false // 禁用版权信息
		},
		plotOptions: {
			column: {
				pointPadding: 0.2,
				borderWidth: 0,
				dataLabels: {
					enabled: true // 设置显示对应 y 的值
				}
			},
		},
		xAxis: {
			categories: xList,
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
		series: [{
			showInLegend: false,
			data: yList
		}],
		tooltip:{
			formatter: function() {
				return `${this.x}：${this.y}`
			}
		}
	})
}

/**
 * @function initPieChart
 * @description 初始化饼图
 */
const initPieChart = function(target, _pieData, legendLine) {
	let pieData = []
	
	_pieData.forEach(item => {
		pieData.push({
			name: item.name,
			y: item.value
		})
	})
	
	let totalNum = pieData.reduce((sum, item) => sum + Number(item.y), 0) // 计算总和
	let screenWidth = $(document).width()
	let parentWidth = $('#' + target).width()
	let _radius = parentWidth / 2 // 半径
	$('#' + target).height(_radius * 1 + 20 * 2 + (20 + 3) * legendLine + 20) // 直径 + (pie 上下 padding) + (legend 高度 + legend 间距) * legend 行数 + 底部 padding
	
	const chart = Highcharts.chart(target, {
		chart: {

		},
		title: {
			text: `<div style="display: flex; flex-direction: column; align-items: center;"><h5>合计</h5><h2 style="color: rgb(58, 120, 240);">${totalNum}</h2></div>`,
			useHTML: true,
			verticalAlign: 'top',
			y: _radius / 2,
			floating: true,
			style: {
				"color": "#333333",
				"fontSize": "0.24rem",
				"lineHeight": "0.24rem",
			}
		},
		credits: {
			enabled: false // 禁用版权信息
		},
		plotOptions: {
			pie: {
				center: ['50%', _radius / 2],
				size: _radius,
				innerSize: '80%',
				borderWidth: 0,
				dataLabels: {
					enabled: false
				},
				showInLegend: true
			},
		},
		yAxis: {
			title: {
				enabled: false
			},
			labels: {
				enabled: false
			}
		},
		legend: {
			align: 'center',
			symbolHeight: 15,
			symbolWidth: 15,
			symbolRadius: 1,
			itemStyle: {
				fontSize: '0.18rem',
				color: '#666666',
				letterSpacing: 0
			},
			floating: true,
			verticalAlign: 'top',
			y: _radius + 25,
			x: 0,
			itemMarginTop: 10,
			layout: 'vertical',
			labelFormatter: function() {
				return `${this.name} ${this.y}`
			}
		},
		series: [{
			type: 'pie',
			data: pieData
		}],
		tooltip:{
			formatter: function() {
				var s = '<span style="display:inline-block; width:100px;white-space: pre-wrap;">'+ this.point.name + '：' + this.point.y + '</span>';
				return s;
			},
		}
	})
}

/**
 * @function handleRequestData
 * @description 接口请求参数格式化
 * @param {Object} _object 请求参数
 */
const handleRequestData = function(_object) {
	let cacheObj = {}

	for (let key in _object) {
		if (_object[key]) {
			cacheObj[key] = _object[key]
		}
	}
	
	console.log(JSON.stringify(cacheObj))

	return cacheObj
}
