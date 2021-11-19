//各地区饮水工程信息汇总：柱状图
function barChartFirst(data){
	var chart = Highcharts.chart(data.id, {
		chart: {
			type: 'column',
			marginRight: 20
		},
		title: {
			text: data.title
		},
		subtitle: {
			text: null
		},
		xAxis: {
			type: 'category',
			labels: {
				rotation: -45  // 设置轴标签旋转角度
			},
		},
		yAxis: {
			minorTickInterval: 'auto',
			startOnTick: true,
			endOnTick: true,
			min: 0,
			title: {
				text: data.y_title
			},
			labels:{
				format: '{value}'
			}
		},
		legend: {
			enabled: true
		},
		tooltip: {
			pointFormat: data.tooltip
		},
		credits: {
			enabled: false
		},
		series: [{
			name: '地市',
			data: data.series.data,
			dataLabels: {
				enabled: false,
			}
		}]
	});
}
//供水工程投资信息汇总：柱状图
function colChartInvest(id,data){
	var chart = Highcharts.chart(id, {
		chart: {
			type: 'column'
		},
		title: {
			text: '供水工程投资信息汇总'
		},
		credits: {
			enabled: false
		},
		xAxis: {
			categories: data.tdata,
		},
		yAxis: {
			tickPositions: [0, 250000,500000,750000,1000000],
			title: {
				text: '投资额(万元)'
			},
			stackLabels: {  // 堆叠数据标签
				enabled: false,
			},
			minorTickInterval: 'auto',
			startOnTick: true,
			endOnTick: true,
			labels:{
				format: '{value}'
			}
		},
		legend: {
			enabled: true,
			itemMarginTop:5
		},
		plotOptions: {
			column: {
				stacking: 'normal',
				dataLabels: {
					enabled: false,
				}
			}
		},
		series: data.list
	});
}
//农村饮水工程情况汇总：柱状图
function dcolChartInvest(id, data){
	var chart = Highcharts.chart(id,{
		chart:{
			type:'column'
		},
		title:{
			// 标题内容
			text:'年供水情况统计',
		},
		xAxis:{
			categories:data.xDatas,
			crosshair: true,
			labels:{
				style:{
					color:'#333333',
				}
			},
		},
		yAxis: {
				tickPositions: [0,2500,5000,7500,10000,12500,15000],
				title: {
					text:'万M³'
				},
				labels:{
					style:{
						color:'#333333',
					},
					format: '{value}'
				},
				minorTickInterval: 'auto',
				startOnTick: true,
				endOnTick: true
			},
		series:[{
			name:data.lengend,
			data:data.yData,
			color:"#83B9ED"
		},
		{
			name:data.lengends,
			data:data.yDatas,
			color:'#F7A966'
		}],
		credits:{
			enabled:false
		},
		legend:{
			itemStyle:{
				color:'#666666',
				letterSpacing:0
			},
		},
	})
}
// 农村饮水工程设施情况汇总
function barChartFirstT(id,data){
	var chart = Highcharts.chart(id, {
		chart: {
			type: 'column',
		},
		title: {
			// 标题内容
			text:'各地市水源井信息汇总'
		},
		xAxis: {
			categories: data.seriesData,
			crosshair: true,
			labels:{
				style:{
					color:'#333333',
				}
			}
		},
		yAxis: {
			tickPositions: [0, 5000,10000,15000,20000,25000,30000],
			title: {
				text:'水源井眼数'
			},
			labels: {
				style:{
					color:'#333333',
				},
				format: '{value}'
			},
			minorTickInterval: 'auto',
			startOnTick: true,
			endOnTick: true,
		},
		series: [
				{
					name:['地市'],
					data:data.seriesDatas,
					color:"#7CB5EC"
				},
		],
		credits: {
			enabled: false
		},
		legend: {
			enabled: true,
		},
		plotOptions: {
			column: {
				dataLabels: {
					enabled: false,
				},
			},
		},
	})
}
// 农村饮水工程管理情况汇总
function pieChartFirst(id,data){
	var x = '';
	switch (id){
		case 'pieChart':
			data = [{
					name: data.names[2],
					y: data.ys[2],
					color: '#7CB5EC'
				},
				{
					name: data.names[1],
					y: data.ys[1],
					color: '#F7A35C'
				},
				{
					name: data.names[3],
					y: data.ys[3],
					color: '#90EE7E'
				},
				{
					name: data.names[0],
					y: data.ys[0],
					color: '#7798BF'
				},
				{
					name: data.names[4],
					y: data.ys[4],
					color: '#AAEEEE'
				},];
				x = -30;
			break;
		case 'pieCharts':
			data = [{
					name: data.name[3],
					y: data.y[3],
					color: '#7CB5EC'
				},
				{
					name: data.name[2],
					y: data.y[2],
					color: '#F7A35C'
				},
				{
					name: data.name[0],
					y: data.y[0],
					color: '#90EE7E'
				},
				{
					name: data.name[1],
					y: data.y[1],
					color: '#7798BF'
				},
				{
					name: data.name[5],
					y: data.y[5],
					color: '#AAEEEE'
				},
				{
					name: data.name[6],
					y: data.y[6],
					color: '#FF0066'
				},
				{
					name: data.name[7],
					y: data.y[7],
					color: '#EEAAEE'
				},
				{
					name: data.name[4],
					y: data.y[4],
					color: '#55BF3B'
				},];
				x = -50;
			break;
		default:
			break;
	}
	
	var chart = Highcharts.chart(id, {
		chart: {
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			type: 'pie'
		},
		title: {
			text: '山西省',
			verticalAlign:'middle',
			x:x
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
			layout: 'vertical',
			verticalAlign: 'middle',
			align: 'right',
			itemStyle:{
				color:'#666666',
			},
			itemMarginTop:5,
		},
		credits: {
			enabled: false
		},
		series: [{
			type: 'pie',
			innerSize: '70%',
			name: '市场份额',
			data: data
		}],
	})
}
//农村饮水工程运行情况汇总
function lineChartFirst(id,data){
	// console.log(data.zData)
	var chart = Highcharts.chart(id, {
	    chart: {
	        type: 'line'
	    },
	    title: {
	        text: '年实际供水情况统计'
	    },
	    xAxis: {
	        categories:data.zData
	    },
	    yAxis: {
			tickPositions: [0, 2000,4000,6000,8000],
	        title: {
	            text: '万 (M³)'
	        },
			minorTickInterval: 'auto',
			startOnTick: true,
			endOnTick: true,
			labels:{
				format: '{value}'
			}
	    },
		legend: {
			enabled: true,
			itemMarginTop:5
		},
		credits: {
			enabled: false
		},
	    plotOptions: {
	        line: {
	            dataLabels: {
	                enabled: false
	            },
	        }
	    },
	    series: [{
	        name: data.yName1,
	        data: data.yData1,
			color:"#7FB7EC"
	    },{
		    name: data.yName2,
		    data: data.yData2,
			color:"#F7A35C"
		},{
	        name: data.yName3,
	        data: data.yData3,
			color:"#90EE7E"
	    }]
	});
}
// 农村饮水工程水质情况汇总
function barChartFirstC(id,data){
	var chart = Highcharts.chart(id, {
		chart: {
			type: 'column',
		},
		title: {
			// 标题内容
			text:'水质不达标工程信息汇总'
		},
		xAxis: {
			categories: data.seriesData,
			crosshair: true,
			labels:{
				style:{
					color:'#333333',
				}
			}
		},
		yAxis: {
			tickPositions: [0, 50,100,150,200,250],
			title: {
				text:'水质不达标工程(处)'
			},
			labels: {
				style:{
					color:'#333333',
				},
				format: '{value}'
			},
			minorTickInterval: 'auto',
			startOnTick: true,
			endOnTick: true,
		},
		series: [
				{
					name:['地市'],
					data:data.seriesDatas,
					color:"#7CB5EC"
				},
		],
		credits: {
			enabled: false
		},
		legend: {
			enabled: true,
		},
		plotOptions: {
			column: {
				dataLabels: {
					enabled: false,
				},
			},
		},
	})
}