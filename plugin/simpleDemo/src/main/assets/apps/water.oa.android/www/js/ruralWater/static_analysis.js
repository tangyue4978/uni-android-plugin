var root = localStorage.getItem("str_url");
if(root == "" || root == undefined || root == null){
		mui.openWindow({
		url: 'login.html?cid=1', //通过URL传参
		id: 'login.html?cid=1', //通过URL传参
	})
}
var token = localStorage.getItem("token");
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	getSumToken();
})
// getSumToken();
var sumToken = '';
function getSumToken(){
	var _url = root + 'api/v2/meter_statistics/get_token';
	mui.ajax(_url, {
		data: {
			"token": token
		},
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(res) {
			if(res.code == 1){
				sumToken = res.token;
				plus.nativeUI.showWaiting("加载中...");
				inStatistics(sumToken)
			}
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
}
//接入状态
var obj1 = obj2 = obj3 = null;
function inStatistics(sumToken){
	var _url = 'http://rural_water.sxjicheng.com/api/v2/meter_statistics/summary';
	console.log(_url)
	mui.ajax(_url, {
		data: {
			"token": sumToken,
			"city_code":'',
			"county_code":''
		},
		datatype: 'json', //服务器返回json格式数据
		type: 'POST', //HTTP请求类型
		success: function(res) {
			console.log(JSON.stringify(res));
			plus.nativeUI.closeWaiting();
			if(res.code == 1){
				// 地图
				var cityInStatistics = res.data.cityInStatistics;
				var mapJson = res.data.shanximap;
				mapinit(mapJson,cityInStatistics);
				$(".back_fun").on("click",function(){
					mapinit(mapJson,cityInStatistics);
				})
				//接入情况
				var inStatistics = res.data.inStatistics;
				$('.finishIn').text(inStatistics.finishIn);
				$('.totalIn').text(inStatistics.totalIn);
				$('.conductIn').text(inStatistics.conductIn);
				//接入情况分析
				var inAnalysis = res.data.inAnalysis;
				$('.cityNum').text(inAnalysis.cityNum);
				$('.countyNum').text(inAnalysis.countyNum);
				$('.meterNum').text(inAnalysis.meterNum);
				$('.useWater').text(inAnalysis.useWater);
				//地市用水量排名
				var yearRanking = res.data.yearRanking;
				obj1 = {
					id:'columnContainer',
					categories :yearRanking.categories,
					data1:yearRanking.data1,
					name1:yearRanking.name1,
					data2:yearRanking.data2,
					name2:yearRanking.name2,
					data3:yearRanking.data3,
					name3:yearRanking.name3,
					data4:yearRanking.data4,
					name4:yearRanking.name4,
				}
				charts(obj1)
				$('#type').on('change',function(){
					var type = $('#type').val();
					console.log(type)
					switch (type){
						case '1':
							yearRanking = res.data.yearRanking;
							break;
						case '2':
							yearRanking = res.data.guarteRanking;
							break;
						case '3':
							yearRanking = res.data.monthRanking;
							break;
						case'4':
							yearRanking = res.data.dayRanking;
							break;
						default:
							break;
					}
					obj1 = {
						id:'columnContainer',
						categories :yearRanking.categories,
						data1:yearRanking.data1,
						name1:yearRanking.name1,
						data2:yearRanking.data2,
						name2:yearRanking.name2,
						data3:yearRanking.data3,
						name3:yearRanking.name3,
						data4:yearRanking.data4,
						name4:yearRanking.name4,
					}
					charts(obj1)
				});
				
				
				
				// 采集方式分析
				var modeAnalysis = res.data.modeAnalysis;
				obj2 = {
					id:'pieContainer1',
					title:modeAnalysis.title,
					colors:modeAnalysis.colors,
					data:modeAnalysis.data,
					dataLabels:true
				}
				pieChartFirst(obj2);
				//总水表供应商分析
				var supplierAnalysis = res.data.supplierAnalysis;
				obj3 = {
					id:'pieContainer2',
					title:supplierAnalysis.title,
					colors:supplierAnalysis.colors,
					data:supplierAnalysis.data,
					dataLabels:false
				}
				pieChartFirst(obj3);
				//供应商分析表格
				var supplierTable = res.data.supplierTable;
				var tableHead = supplierTable.header;
				var tabletd = supplierTable.body;
				for(let i=0;i<tableHead.length;i++){
					$('.tables_head').append('<td>'+tableHead[i]+'</td>')
				}
				var tr_html = td_html = th_html = '';
				for(let j=0;j<tabletd.length;j++){
					console.log(tabletd[j].length);
					th_html += '<tr><td class="td_line"><span class="square_i" style="background-color:'+tabletd[j][0]+'"></span><span>'+tabletd[j][1]+'</span></td>'+
					'<td>'+tabletd[j][2]+'</td>'+'<td>'+tabletd[j][3]+'</td>'+'<td>'+tabletd[j][4]+'</td>'+'<td>'+tabletd[j][5]+'</td></tr>'
				}
				$('.tables').append(th_html)
			}else{
				plus.nativeUI.toast(data.msg)
			}
		},
		error: function(xhr, type, errorThrown) {
			console.log(JSON.stringify(errorThrown))
			plus.nativeUI.closeWaiting();
			console.log(11)
		}
	})
}


// 地图
// var data = [
//  {
//   value: 1,
//   name: "太原市",
//   color: "#1D6FE9",
//  }, {
//   value: 2,
//   name: "大同市",
//   color: "#1D6FE9"
//  },
//  {
//   value: 3,
//   name: "阳泉市",
//   color: "#1D6FE9"
//  }, {
//   value: 4,
//   name: "长治市",
//   color: "#00CCFF"
//  },
//  {
//   value: 5,
//   name: "晋城市",
//   color: "#1D6FE9"
//  }, {
//   value: 6,
//   name: "朔州市",
//   color: "#1D6FE9"
//  },
//  {
//   value: 7,
//   name: "晋中市",
//   color: "#00CCFF"
//  }, {
//   value: 8,
//   name: "运城市",
//   color: "#1D6FE9"
//  },{
//   value: 9,
//   name: "忻州市",
//   color: "#1D6FE9"
//  }, {
//   value: 10,
//   name: "临汾市",
//   color: "#00CCFF"
//  }, {
//   value: 11,
//   name: "吕梁市",
//   color: "#1D6FE9"
//  }
// ];
function mapinit(mapJson,data){
	$.getJSON(mapJson, function (geojson) {
	 // Initiate the chart
	 Highcharts.mapChart('container', {
	  title: {
	   text: ''
	  },
	  chart:{
	   backgroundColor:''
	  },
	  legend:{
	   enabled:false
	  },
	  colorAxis: {
	   tickPixelInterval: 100,
	  },
	  credits:{
	   enabled:false
	  },
	  tooltip:{
	   enabled:false
	  },
	  series: [{
	   data: data,
	   mapData: geojson,
	   joinBy: 'name',
	   keys: ['name', 'value'],
	   name: '随机数据',
	   allowPointSelect: true,
	   states: {
	    hover: {
	     color: '#FFCC00'
	    },
	    select: {
	     color: '#FFCC00',
	     borderColor: 'white',
	     dashStyle: 'dot'
	    }
	   },
	   dataLabels: {
	    enabled: true,
	    format: '{point.name}',
	    style: {
	     'color':'#ffffff',
	     'fontSize':'12px',
	     'fontWeight':'none',
	     "textOutline": "0px 0px contrast"
	    },
	   }
	  }],
	  plotOptions: {
	   series: {
	    events: {
	     click: function (e) {
	      console.log(e.point);
	      console.log(e.point.value)
		  mapinit(e.point.json,e.point.child)
	     }
	    }
	   }
	 },
	 });
	});
}

// 表格column
function charts(data){
	var chart = Highcharts.chart(data.id, {
		chart: {
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			zoomType: 'xy',
			// spacingTop: 10,
			backgroundColor:'#ffffff',
			margin: [70, 40, 100, 40]
		},
		title: {
			align:'left',
			text: '地市用水量排名',
			style:{
				"color":"#666666",
				"fontSize":"0.28rem",
				"fontWeight":'700'
			},
			margin:50,
			x:-10
		},
		subtitle: {
			text: null,
		},
		xAxis: {
			categories:data.categories,
		},
		yAxis: [{
			ceiling:100,
			labels: {
				format: '{value}%',
				style: {
					color: '#656565',
					fontSize:'0.12rem'
				}
			},
			title: {
				text: '三率(百分比)',
				rotation:0,
				align:'high',
				x:-70,
				y:-20
			},
			opposite: true //移到右边
		}, { 
			gridLineWidth: 0,
			title: {
				text: '用水量(m³)',
				rotation:0,
				align:'high',
				x:70,
				y:-20
			},
			labels: {
				format: '{value}',
				style: {
					color: '#656565',
					fontSize:'0.12rem'
				}
			}
		}],
		legend: {
			align: 'right',
			itemDistance: 10,
			symbolHeight:15,
			symbolWidth:15,
			symbolRadius:3,
			itemStyle:{
				lineHeight:'0.24rem',
				fontSize:'0.24rem',
				color:'#333333',
			},
		},
		credits:{
			enabled:false
		},
		tooltip: {
		　　formatter: function() {
				if (this.series.name == '上报成功率' || this.series.name == '秒表准确率' || this.series.name == '故障率') {
					return  this.series.name + ' ' + this.y + '%';
				} else if (this.series.name == '用水量') {
					return this.series.name + ' ' + this.y + 'm³';
				} 
			}
		},
		series: [{
			name: data.name1,
			data: data.data1,
			type: 'column',
			color:"#33CC99",
			yAxis: 1,
			dataLabels: {
				enabled: false,
				color: '#33CC99',
				format: '{point.y:.2f}',
			},
		},{
			name: data.name2,
			data: data.data2,
			type: 'line',
			color:"#0ECFFF",
			marker:{
				enabled:false
			},
			dataLabels: {
				enabled: false,
			}
		},{
			name: data.name3,
			data: data.data3,
			type: 'line',
			color:"#9ACC02",
			marker:{
				enabled:false
			},
			dataLabels: {
				enabled: false,
			}
		},{
			name: data.name4,
			data: data.data4,
			type: 'line',
			color:"#FF3400",
			marker:{
				enabled:false
			},
			dataLabels: {
				enabled: false,
			}
		}]
	});
}
// 表格pie
function pieChartFirst(data) {
	var piechart = Highcharts.chart(data.id, {
		chart: {
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			type: 'pie',
			backgroundColor:'#ffffff',
			margin: [40, 0, 0, 0]
		},
		title: {
			align:'left',
			text: data.title,
			style: {
				fontSize: "0.3rem",
				color:'#666666',
				fontWeight:'700'
			},
		},
		tooltip: {
	　　　　pointFormat: '{series.name}: <b>{point.y}%</b>',
	　　},
		colors: data.colors,
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				borderWidth: 0,
				dataLabels: {
					enabled: data.dataLabels,
					style: {
						fontSize: "0.26rem",
					},
					formatter: function() {
						if (this.point.name == '数据直报' || this.point.name == '常德仪表') {
							return '<span style="color:#FF9900">' + this.point.name + ' ' + this.y + '%</span>';
						} else if (this.point.name == '系统对接' || this.point.name == '华水仪表') {
							return '<span style="color:#41c77e">' + this.point.name + ' ' + this.y + '%</span>';
						} else if (this.point.name == '山东金泉') {
							return '<span style="color:#33CC99">' + this.point.name + ' ' + this.y + '%</span>';
						} else if (this.point.name == '顺水水表') {
							return '<span style="color:#99CC00">' + this.point.name + ' ' + this.y + '%</span>';
						} else if (this.point.name == '德能仪表') {
							return '<span style="color:#993399">' + this.point.name + ' ' + this.y + '%</span>';
						}  else if (this.point.name == '三川仪表') {
							return '<span style="color:#FF9999">' + this.point.name + ' ' + this.y + '%</span>';
						} else if (this.point.name == '宁波优静') {
							return '<span style="color:#CC66CC">' + this.point.name + ' ' + this.y + '%</span>';
						} else if (this.point.name == '连云港腾越') {
							return '<span style="color:#00CCFF">' + this.point.name + ' ' + this.y + '%</span>';
						} else if (this.point.name == '慧怡水表') {
							return '<span style="color:#99CC99">' + this.point.name + ' ' + this.y + '%</span>';
						} else if (this.point.name == '其他') {
							return '<span style="color:#CC3366">' + this.point.name + ' ' + this.y + '%</span>';
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
			name: data.title,
			colorByPoint: true,
			data: data.data
		}]
	});
}