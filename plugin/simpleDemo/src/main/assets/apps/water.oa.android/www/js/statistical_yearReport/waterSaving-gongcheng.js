var page_status = true;
// 获取基础信息
var root = localStorage.getItem("str_url");
if (root == "" || root == undefined || root == null) {
 mui.openWindow({
  url: 'login.html?cid=1', //通过URL传参
  id: 'login.html?cid=1', //通过URL传参
 })
}

var token = localStorage.getItem("token");
var page = 1;
var list_this = '';
var data_info = {};
var data_info2 = {};
var picker = new mui.PopPicker();
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	plus.nativeUI.showWaiting("加载中...");
	data_info.token = token;
	data_info.year = 0;
	data_info.type = 19;
	data_info.search_status = 0;//控制条件查询 0插入条件，否则不插入;
	data_info2.token = token;
	data_info2.year = 0;
	data_info2.type =20;
	data_info2.search_status = 0;//控制条件查询 0插入条件，否则不插入;
	
	picker.pickers[0].setSelectedIndex(4, 2000);
	list(data_info);
	list2(data_info2);
});


//表一表二切换
function wateryi(){
	$("#wateryi").addClass('tab_active');
	$(".wateryi").addClass("isShow");
	$(".wateryi").removeClass("ishide");
	$(".waterer").removeClass("isShow");
	$(".waterer").addClass('ishide');
	$("#waterer").removeClass('tab_active');
}
function waterer(){
	$("#wateryi").removeClass('tab_active');
	$(".wateryi").removeClass("isShow");
	$(".wateryi").addClass("ishide");
	$(".waterer").removeClass("ishide");
	$(".waterer").addClass('isShow');
	$("#waterer").addClass('tab_active');

}

//供水量表一start
function list(data_info) {
	console.log(JSON.stringify(data_info));
	var _url = root + 'api/v3/yearbookslist/yearbooks';
	console.log(_url);
	mui.ajax(_url, {
		data: data_info,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			console.log(JSON.stringify(data));
			plus.nativeUI.closeWaiting();
			page = data_info.page;
			if(data.code == 1) {
				<!-- 数据来源start -->
				$('.main_source').html(data.data.source);
				<!-- 数据来源end -->
				$(".river_lake_title_l #text1").html(data.data.title);
				$(".river_lake_title_l #text2").html(data.data.pie.series[0].name);
				$(".river_lake_title_l #text3").html(data.data.cityColumn.series[0].name);
				$(".river_lake_title_r").html(data.data.unit);
				$("#tabcontent").html("");
				$("#tabhead").html("");
				$("#tabcontent").append(data.data.head);
				picker.setData(data.data.year)
				for(let i = 0;i<data.data.year.length;i++){
					if(data_info.year == ''){
							$("#muiPicker").text(data.data.year[0].value+'年')
										
					}else{
							picker.pickers[0].setSelectedValue(data_info.year);
					}
				}
				$("#tabhead").append("<tr><td class='river_lake_tabletd'>"+$("#tabcontent tr").eq(0).find("th").eq(0).html()+"</td></tr>")
				$("#tabcontent tr").eq(0).find("th").eq(0).remove();
				//头部高度相等
				$('#tabhead').find("td,th").outerHeight($('#tabcontent').find("td,th").outerHeight())
				
				data.data.body.forEach(function(item,index) {
					var tr_html = '<tr>';
					var tr_head_html = '<tr>';
					item.forEach(function(td,index) {
						if(index == 0){
							tr_head_html += '<td>' + td + '</td>';
						}else{
							tr_html += '<td>' + td + '</td>';
						}
						
					});
					tr_html += '</tr>';
					tr_head_html += '</tr>';
					$("#tabcontent").append(tr_html)
					$("#tabhead").append(tr_head_html)
				}); 
				
				pie(data.data.pie);
				column(data.data.column);
				$("#biaoyi li").bind("click",{column: data.data.column, cityColumn: data.data.cityColumn}, liActive);
			}else{
				if(page>1){
					list_this.endPullupToRefresh(true);
				}
				plus.nativeUI.toast(data.msg);
			}
			page_status = false;
		},
		error: function(xhr, type, errorThrown) {
			console.log(errorThrown)
			plus.nativeUI.closeWaiting();
		}
	})
}
//供水量表一end

//供水量表二start
function list2(data_info2) {
	console.log(JSON.stringify(data_info2));
	var _url = root + 'api/v3/yearbookslist/yearbooks';
	console.log(_url);
	mui.ajax(_url, {
		data: data_info2,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			console.log(JSON.stringify(data));
			plus.nativeUI.closeWaiting();
			page = data_info2.page;
			if(data.code == 1) {
				<!-- 数据来源start -->
				$('.main_source').html(data.data.source);
				<!-- 数据来源end -->
				$(".river_lake_title_l #text4").html(data.data.title);
				$(".river_lake_title_l #text5").html(data.data.pie.series[0].name);
				$(".river_lake_title_l #text6").html(data.data.cityColumn.series[0].name);
				$(".river_lake_title_r").html(data.data.unit);
				$("#tabcontent2").html("");
				$("#tabhead4").html("");
				$("#tabcontent2").append(data.data.head);
				picker.setData(data.data.year)
				for(let i = 0;i<data.data.year.length;i++){
					if(data_info.year == ''){
							$("#muiPicker2").text(data.data.year[0].value+'年')
										
					}else{
							picker.pickers[0].setSelectedValue(data_info.year);
					}
				}
				$("#tabhead4").append("<tr><td class='river_lake_tabletd'>"+$("#tabcontent2 tr").eq(0).find("th").eq(0).html()+"</td></tr>")
				$("#tabcontent2 tr").eq(0).find("th").eq(0).remove();
				//头部高度相等
				console.log($('#tabcontent2').find("td,th").outerHeight())
				
				
				
				$('#tabhead4').find("td,th").outerHeight($('#tabcontent2').find("td,th").outerHeight()+"%")
				
				data.data.body.forEach(function(item,index) {
					var tr_html = '<tr>';
					var tr_head_html = '<tr>';
					item.forEach(function(td,index) {
						if(index == 0){
							tr_head_html += '<td>' + td + '</td>';
						}else{
							tr_html += '<td>' + td + '</td>';
						}
						
					});
					tr_html += '</tr>';
					tr_head_html += '</tr>';
					$("#tabcontent2").append(tr_html)
					$("#tabhead4").append(tr_head_html)
				}); 
				
				pie2(data.data.pie);
				column2(data.data.column);
				$("#biaoer li").bind("click",{column: data.data.column, cityColumn: data.data.cityColumn}, liActive2);
			}else{
				if(page>1){
					list_this.endPullupToRefresh(true);
				}
				plus.nativeUI.toast(data.msg);
			}
			page_status = false;
		},
		error: function(xhr, type, errorThrown) {
			console.log(errorThrown)
			plus.nativeUI.closeWaiting();
		}
	})
}
//供水量表二end


function pie2(data){
	var chart = Highcharts.chart(pip_container2, {
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

function column2(data){
	var chart = Highcharts.chart(column_container2,{
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
function liActive2(event) 
{
	//console.log(JSON.stringify(event.data))
	$(this).addClass("active");
	$(this).siblings("li").removeClass("active");
	var index = $(this).index();
	if(!index == 1){
		column2(event.data.column)
	}else{
		column2(event.data.cityColumn)
	}
}