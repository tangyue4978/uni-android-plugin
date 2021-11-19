// 取水用途分析start
var objs = [
	{
		name: '大型水库',
		data: [2,4,5,2,4,5,2,4,5,2,2],
		color: '#9966cb',
	},
	{
		name: '中型水库',
		data:[0,5,8,10,5,8,10,5,8,10,10],
		color: '#ffcb00',
	},
	{
		name: '小I型水库',
		data:[1,11,4,8,11,4,8,11,4,8,8],
		color: '#06af52',
	},
	{
		name: '小II型水库',
		data:[5,15,23,19,15,23,19,15,23,19,19],
		color: '#0099ff',
	},
]

function pieChart(id,objs, categories){
	var piechart = Highcharts.chart(id, {
		chart: {
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			type: 'bar',
		},
		title: {
			text: null
		},
		xAxis: {
			categories: categories,
			title: {
				text: null
			},
		},
		yAxis:{
			title: {
				text: null
			},
			labels: {
				enabled:false
			},
			gridLineWidth:0
		},
		plotOptions: {
			bar: {
				allowPointSelect: true,
				cursor: 'pointer',
				borderWidth:0,
				showInLegend: true,
				dataLabels: {
					enabled: true,
					style: {
						fontSize:"0.22rem",
					},
					formatter: function() {
						console.log(this.series.name)
						if(this.series.name == '大型水库'){
		　　　　　　　　　　return '<span style="color:#9966cb">'+ this.y +'</span>';
		　　　　　　　　}else if(this.series.name == '中型水库'){
		　　　　　　　　　　return '<span style="color:#ffcb00">'+ this.y +'</span>';
		　　　　　　　　}else if(this.series.name == '小I型水库'){
		　　　　　　　　　　return '<span style="color:#06af52">'+ this.y +'</span>';
		　　　　　　　　}else if(this.series.name == '小II型水库'){
		　　　　　　　　　　return '<span style="color:#0099ff">'+ this.y +'</span>';
		　　　　　　　　}
					}
				}
			}
		},
		legend: {
			itemDistance: 10,
			symbolHeight:13,
			symbolWidth:13,
			symbolRadius:1,
			itemStyle:{
				fontSize:'0.22rem',
				color:'#7b7b7b',
				letterSpacing:0
			},
			y:10
		},
		credits: {
			enabled: false
		},
		series: objs
	});
}
// 取水用途分析end
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
var page_status = true;//判断是否是第一次加载页面，第一次加载需要插入筛选条件，否则不插入
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	console.log("type=" + self.type_id);
	if (self.type_id == undefined) {
		self.type_id = 0;
	}
	plus.nativeUI.showWaiting("加载中...");
	data_info.token = token;
	data_info.page = page;
	data_info.type = self.type_id;
	data_info.cityCode = 0;
	data_info.name = '';
	data_info.search_status = 0; //控制条件查询 0插入条件，否则不插入;
	list(data_info);
});

function list(data_info) {
	console.log(JSON.stringify(data_info));
	var _url = root + 'api/v3/reservoir/statistical';
	console.log(_url);
	mui.ajax(_url, {
		data: data_info,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			console.log(JSON.stringify(data));
			plus.nativeUI.closeWaiting();
			if (data.code == 1) {
				$(".all_num").html(data.data.count);
				data_list = data.data
				//处理搜索项
				if (page_status) {
					// data.data.city.forEach(function(item, index) {
					// 	$("#city_sort").append('<option value="' + item.value + '">' + item.name + '</option>');
					// });
				}

					if (page > 1) {
						list_this.endPullupToRefresh(false);
					}
					if (page == 1) {
						$(".lists").html("");//清空列表注意检查类名是否正确
						console.log(page);
					}
					// console.log(JSON.stringify(data.data))

					var city_html = '';
						data_list.city.forEach(function(other_item, other_index) {
							city_html += '<option value="'+other_item.value+'">' + other_item.name + '</option>';
						});
						
						$("#city").append(city_html)
					
					
					var value_html = '';
					data_list.sacle_type.value.forEach(function(item, index) {
						value_html += '<li class="colors'+(index+1)+'">'+item+'</li>';
					})
					$("#waterUser_value").append(value_html)
					var name_html = '';
					data_list.sacle_type.name.forEach(function(item, index) {
						name_html += '<li class="colors'+(index+1)+'0">'+item+'</li>';
					})
					$("#waterUser_name").append(name_html)
					//水库地区分析
					pieChart('pieChart1',data.data.count, data.data.city_name);
				

				// // 追加筛选条件
				// if (data_info.search_status == 0 && data_info.page == 1) {
				// 	newHtmlAdd(".search_form ul",data.listSearchConfig)
				// }
				// // 追加筛选条件 end
				// $(".mui-loading").css("display", "none")
			} else {
				if (page > 1) {
					list_this.endPullupToRefresh(true);
				}
				plus.nativeUI.toast(data.msg);
			}
			page_status = false;
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
}


/**
 * @description 详情跳转
 * @param {Object} item_id
 */
function xiangqing(item_id) {
	var self = plus.webview.currentWebview();
	mui.openWindow({
		url: 'waterIntake_detail.html', //通过URL传参
		id: 'waterIntake_detail.html', //通过URL传参
		extras: {
			item_id: item_id
		}
	})
};


// 筛选信息
function shaixuanFun(){
	// 重置上拉加载
	mui('.mui-content').pullRefresh().refresh(true);
	plus.nativeUI.showWaiting("加载中...");
	$(document).scrollTop(0)//重置滚动条的top值为0
	page = 1;
	data_info.page = page;
	data_info.type = $("#type_sort").val();
	data_info.cityCode = $("#city_sort").val();
	data_info.name = $("#username").val();
	list(data_info);
}
$("#type_sort").on("change",shaixuanFun)
$("#city_sort").on("change",shaixuanFun)
$("#search").on("click",shaixuanFun)
// 筛选信息 end
