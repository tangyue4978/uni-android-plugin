function funColumnBz1(data) {
	console.log(JSON.stringify(data))
	Highcharts.setOptions({
		lang: {
			numericSymbols: null // 不换算单位
		}
	});
	var chart = Highcharts.chart(data.id, {
		chart: {
			backgroundColor: null,
			colors: '#3f60e4',
			type: 'line',
			marginLeft: data.left,
			marginTop: 40,
			marginRight: 30
		},
		credits: {
			enabled: false // 禁用版权信息
		},
		title: {
			text: null,
		},
		xAxis: {
			categories: data.categories,
			// tickPositions: [0,1,2,3,4],
			tickWidth: 0, //去掉刻度
			tickInterval:1,
			lineColor: '#8c8c8c',
			labels: {
				style: {
					color: '#CCCCCC',
				},
				formatter:function(){
					return this.value;
				}
			},
			type: 'datetime',
			dateTimeLabelFormats: {
				second:"%Y-%m-%d %H:%M:%S",
			}
		},
		tooltip: {
			enabled: true,
		},
		yAxis: {
			max: data.max,
			min: data.min,
			lineColor: '#8c8c8c',
			lineWidth: 1,
			tickWidth: 1,
			title: {
				text: data.ytitle,
				style: {
					color: '#8c8c8c',
				},
				margin: 0,
				y: -20,
				x: 50,
				align: "high",
				rotation: 360
			},
			gridLineWidth: 0,
			labels: {
				enabled: true,
				style: {
					color: '#8c8c8c',
					fontSize: 10
				},
				format: '{value}',
			},
		},
		legend: {
			enabled: true,
			itemStyle: {
				color: '#cccccc',
				fontSize: '10px'
			}
		},
		plotOptions: {
			line: {
				dataLabels: {
					enabled: false,
					format: '{y} m',
					x:-100
				},
				marker: {
					enabled: false
				}
			},
		},
		series:data.series
	});
}
