function pie(data){
	var chart = Highcharts.chart(data.id, {
	chart: {
		type: 'pie',
		options3d: {
			enabled: true,
			alpha: 45,
			beta: 0
		}
	},
	colors:data.colors,
	title: {
		text: null
	},
	legend:{
		enable:true,
		itemDistance: 5,
		symbolHeight:15,
		symbolWidth:15,
		symbolRadius:3,
		itemStyle:{
			lineHeight:'0.2rem',
			fontSize:'0.2rem',
			color:'#7C7C7C',
		},
		itemMarginTop:10
	},
	tooltip: {
		useHTML: true,
		formatter:function(){
			console.log(this);
			return this.key+'('+ Highcharts.numberFormat( this .percentage, 1 ) + '%'+')'+'</span>'+'</p>'
		},
	},
	credits:{
		enabled: false
	},
	plotOptions: {
		pie: {
			allowPointSelect: true,
			cursor: 'pointer',
			depth: 35,
			dataLabels: {
				enabled: true,
				formatter:function(){
					// console.log(this);
					return  Highcharts.numberFormat( this .percentage, 0 ) + '%'
				},
			},
			showInLegend: true//重点图例显示
		}
	},
	series: data.series
});
}

function column(data){
	var chart = Highcharts.chart(data.id,{
	chart: {
		type: 'column',
		margin: 25,
		// height:200,
		marginBottom:50,
		options3d: {
			enabled: true,
			alpha: 10,
			beta: 25,
			depth: 70,
			viewDistance: 100,      // 视图距离，它对于计算角度影响在柱图和散列图非常重要。此值不能用于3D的饼图
			frame: {                // Frame框架，3D图包含柱的面板，我们以X ,Y，Z的坐标系来理解，X轴与 Z轴所形成
				// 的面为bottom，Y轴与Z轴所形成的面为side，X轴与Y轴所形成的面为back，bottom、
				// side、back的属性一样，其中size为感官理解的厚度，color为面板颜色
				bottom: {
					size: 10
				},
				side: {
					size: 1,
					color: 'transparent'
				},
				back: {
					size: 1,
					color: 'transparent'
				}
			}
		},
	},
	credits:{
		enabled: false
	},
	title: {
		text: null
	},
	subtitle: {
		text: null
	},
	plotOptions: {
		column: {
			depth: 25,
			pointWidth:13, //柱子宽度
		}
	},
	xAxis: {
		categories: data.categories,
	},
	yAxis: {
		title: {
			text: null
		},
		labels:{
			format: '{value}'
		}
	},
	legend:{
		enabled:false
	},
	series: data.series,
	tooltip: {
		formatter: function () {
			if(data.unit != undefined){
				return '<b>' + this.x +'</b><br/>已建水库情况：' + this.y + data.unit;
			}else{
				return '<b>' + this.x +'</b><br/>已建水库情况：' + this.y;
			}
		}
	},
});
}

//节水灌溉面积对比end

function liActive(event) 
{
	//console.log(JSON.stringify(event.data))
	$(this).addClass("active");
	$(this).siblings("li").removeClass("active");
	var index = $(this).index();
	if(!index == 1){
		column(event.data.column)
	}else{
		column(event.data.cityColumn)
	}
}
		