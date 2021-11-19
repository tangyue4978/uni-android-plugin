$(function() {
	document.addEventListener("plusready", () => {
		fetchStatisticsData()
	})
})

/**
 * @function fetchStatisticsData
 * @description 查询统计数据
 */
const fetchStatisticsData = function() {
	let rootUrl = localStorage.getItem("str_url")
	let token = localStorage.getItem('token')

	plus.nativeUI.showWaiting("加载中...");

	mui.ajax(rootUrl + 'api/v3/riverchief/riverchieflakechiefmore/', {
		type: 'post',
		data: handleRequestData({
			token: token
		}),
		dataType: 'json',
		success: res => {
			plus.nativeUI.closeWaiting()


			if (res.code == 1) {
				$(".content_box").show()
				let tableData = res.data

				// 固定表头表格
				initFixedTable('#table_left', '#table_right', tableData.left, tableData.head, tableData
					.body)

				// 饼图
				initPieChart('container1', tableData.pie)

				// 柱状图
				initBarChart('container2', tableData.column)
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
 * @function initFixedTable
 * @description 初始化固定表头 table
 * @param {string} leftTarget 左侧表格选择器
 * @param {string} rightTarget 右侧表格选择器
 * @param {string} leftHtml 左侧表格 html
 * @param {string} rightHeadHtml 右侧表格 thead html
 * @param {array} rightData 右侧表格 tbody 数据
 */
const initFixedTable = function(leftTarget, rightTarget, leftHtml, rightHeadHtml, rightData) {
	// 左侧固定表格
	$(leftTarget).html(leftHtml);

	// 右侧固定表格
	let rightTableAppend = ''

	rightData.forEach((trItem, trIndex) => {
		let cacheHtml = ''

		trItem.forEach(tdItem => {
			cacheHtml += `<td>${tdItem}</td>`
		})

		rightTableAppend += `<tr>${cacheHtml}</td>`
	})

	$(rightTarget).html(rightHeadHtml).append(rightTableAppend);

	// 匹配左右表格高度
	let leftTableTr = $(leftTarget).find("tr")
	let rightTableTr = $(rightTarget).find("tr")
	let numArr = [] // 左侧 tr 包含 th、td 长度数组
	let reg = /row="\d+"/g // 匹配 row 字符串正则
	let matchHtmlList = leftHtml.split('</tr>') // 匹配结果数组
	let cacheIndex = 0 // 计算到右侧 th/td 的 index
	let rightLenght = rightTableTr.length // 右侧 tr 个数

	matchHtmlList.pop() // 去除最后一个
	matchHtmlList.forEach((item, index) => {
		if (index) {
			if (item.match(reg) != null) { // 如果当前包含 row
				let cacheItem = item.match(reg)[0]
				numArr.push(parseInt(cacheItem.replace('row="', '').replace('"', '')))
			} else { // 如果没有，push 1
				numArr.push(1)
			}
		} else { // 左侧首行 th，需要右侧所有 th 个数之和
			numArr.push(rightHeadHtml.split("</tr>").length - 1)
		}
	})

	leftTableTr.each(function(index, item) {
		let lineLength = parseInt(numArr[index]) // 左侧 tr 包含的 th/td 个数
		let endLineIndex = cacheIndex + lineLength // 左侧 tr ，对应的右侧最后一个 tr

		let startTop = rightTableTr.eq(cacheIndex).offset().top // 对应右侧开始 tr 高度
		let endTop = endLineIndex >= rightLenght ? rightTableTr.parent().outerHeight() + rightTableTr
			.parent().offset().top : rightTableTr.eq(endLineIndex).offset().top // 对应右侧结尾 tr 高度
		let cacheTop = endTop - startTop

		$(item).find("th, td").outerHeight(cacheTop) // 左侧 tr 高度赋值

		cacheIndex += lineLength
	})
}

/**
 * @function initBarChart
 * @description 初始化柱状图
 */
const initBarChart = function(target, dataBar) {
	$('.bar_chart_title').text(dataBar.series[0].name)

	const chart = Highcharts.chart(target, {
		chart: {
			height: '280px',
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
			categories: dataBar.categories,
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
		series: dataBar.series,
		tooltip: {
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
const initPieChart = function(target, _pieData) {
	let totalNum = _pieData.series[0].data.reduce((sum, item) => sum + Number(item.y), 0) // 计算总和
	let screenWidth = $(document).width()
	let parentWidth = $('#' + target).width()
	let _radius = parentWidth / 2 // 直径
	$('#' + target).height(_radius * 1 + 20 * 2 + (20 + 3) * 2 +
		20) // 直径 + (pie 上下 padding) + (legend 高度 + legend 间距) * legend 行数 + 底部 padding

	$('.pie_chart_title').text(_pieData.series[0].name)

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
			labelFormatter: function() {
				return this.name
			}
		},
		series: _pieData.series,
		tooltip: {
			formatter: function() {
				var s = '<span style="display:inline-block; width:100px;white-space: pre-wrap;">' + this
					.point.name + '</span>';
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

	return cacheObj
}
