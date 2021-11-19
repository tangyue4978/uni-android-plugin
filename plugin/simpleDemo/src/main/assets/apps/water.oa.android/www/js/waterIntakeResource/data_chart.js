// 行业类别分析start
function pieChartFirst(id,obj){
	var chart = Highcharts.chart(id, {
		chart: {
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			type: 'pie'
		},
		title: {
			text: null,
		},
		subtitle:{
			text:null,
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				dataLabels: {
					enabled: false
				},
				showInLegend: true,
				dataLabels: {
					enabled: true,
					style: {
						fontSize:"0.24rem",
					},
					formatter: function() {
					if(this.point.name == '农、林、牧渔业'){		
			　　　　　　　return '<span style="color:#91ee93">' + this.y;
			　　　　　　　}else if(this.point.name == '采矿业'){
			　　　　　　　　　return '<span style="color:#fd0100">'+ this.y ;
			　　　　　　　}else if(this.point.name == '制造业'){
			　　　　　　　　　return '<span style="color:#ff8252">'+ this.y;
			　　　　　　　}else if(this.point.name == '电力、燃气及水的生产和供应业'){
			　　　　　　　　　return '<span style="color:#aeff34">'+ this.y;
			　　　　　　　}else if(this.point.name == '建筑业'){
			　　　　　　　　　return '<span style="color:#028100">'+ this.y;
			　　　　　　　}else if(this.point.name == '批发和零售业'){
			　　　　　　　　　return '<span style="color:#f3fdf4">'+ this.y;
			　　　　　　　}else if(this.point.name == 'G.交通运输、仓储和邮政业'){
			　　　　　　　　　return '<span style="color:#41e0ce">'+ this.y;
			　　　　　　　}else if(this.point.name == '住宿和餐饮业'){
			　　　　　　　　　return '<span style="color:#30504f">'+ this.y;
			　　　　　　　}else if(this.point.name == '信息传输、计算机服务和软件业'){
			　　　　　　　　　return '<span style="color:#03fcfe">'+ this.y;
			　　　　　　　}else if(this.point.name == '金融业'){
			　　　　　　　　　return '<span style="color:#02befb">'+ this.y;
			　　　　　　　}else if(this.point.name == '房地产业'){
			　　　　　　　　　return '<span style="color:#1d92fb">'+ this.y;
			　　　　　　　}else if(this.point.name == '租赁和商务服务业'){
			　　　　　　　　　return '<span style="color:#4669df">'+ this.y;
			　　　　　　　}else if(this.point.name == '科学研究和技术服务业'){
			　　　　　　　　　return '<span style="color:#e8e5f8">'+ this.y;
			　　　　　　　}else if(this.point.name == '水利、环境和公共设施管理业'){
			　　　　　　　　　return '<span style="color:#9901d2">'+ this.y;
			　　　　　　　}else if(this.point.name == '居民服务和其他服务业'){
			　　　　　　　　　return '<span style="color:#d8bcd3">'+ this.y;
			　　　　　　　}else if(this.point.name == '教育'){
			　　　　　　　　　return '<span style="color:#dd143e">'+ this.y;
			　　　　　　　}else if(this.point.name == '卫生、社会保障和社会福利业'){
			　　　　　　　　　return '<span style="color:#191a76">'+ this.y;
			　　　　　　　}else if(this.point.name == '文化、体育和娱乐业'){
			　　　　　　　　　return '<span style="color:#f1f8ff">'+ this.y;
			　　　　　　　}else if(this.point.name == '公共管理和社会组织'){
			　　　　　　　　　return '<span style="color:#b0edee">'+ this.y;
			　　　　　　　}else if(this.point.name == '国际组织'){
			　　　　　　　　　return '<span style="color:#03898a">'+ this.y;
			　　　　　　　}else if(this.point.name == '其他'){
			　　　　　　　　　return '<span style="color:#00fe81">'+ this.y;
			　　　　　　　}
	　　　　　　　　	}
				}
			}
		},
		tooltip:{
			enabled:false
		},
		legend: {
			align: 'left',
			itemDistance: 10,
			symbolHeight:15,
			symbolWidth:15,
			symbolRadius:3,
			itemWidth:150,
			itemStyle:{
				fontSize:'0.18rem',
				color:'#666666',
				letterSpacing:0
			},
			itemMarginTop:12,
		},
		credits: {
			enabled: false
		},
		series: [{
			type: 'pie',
			// name: '河湖长制',
			size: '80%',
			data: obj.data
		}],
	})
}
//行业类别分析end
// 取水用途分析start
function pieChart(id,objs){
	var piechart = Highcharts.chart(id, {
		chart: {
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			type: 'pie',
			// marginBottom:20
		},
		title: {
			text: null
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				borderWidth:0,
				showInLegend: true,
				dataLabels: {
					enabled: true,
					style: {
						fontSize:"0.24rem",
					},
					formatter: function() {
					if(this.point.name == '城镇生活用水'){		
			　　　　　　　return '<span style="color:#40c87e">' + this.y;
			　　　　　　　}else if(this.point.name == '城镇公共用水'){
			　　　　　　　　　return '<span style="color:#c8905f">'+ this.y ;
			　　　　　　　}else if(this.point.name == '城镇工业用水'){
			　　　　　　　　　return '<span style="color:#7bd8e9">'+ this.y;
			　　　　　　　}else if(this.point.name == '生活（自备）'){
			　　　　　　　　　return '<span style="color:#fdb5c0">'+ this.y;
			　　　　　　　}else if(this.point.name == '工业用水'){
			　　　　　　　　　return '<span style="color:#abd7e2">'+ this.y;
			　　　　　　　}else if(this.point.name == '农业用水'){
			　　　　　　　　　return '<span style="color:#03fdfc">'+ this.y;
			　　　　　　　}else if(this.point.name == '发电用水'){
			　　　　　　　　　return '<span style="color:#41e0ce">'+ this.y;
			　　　　　　　}else if(this.point.name == '其他用水'){
			　　　　　　　　　return '<span style="color:#016600">'+ this.y;
			　　　　　　　}
	　　　　　　　　	}
				}
			}
		},
		legend: {
			itemDistance: 30,
			symbolHeight:15,
			symbolWidth:15,
			symbolRadius:3,
			itemStyle:{
				fontSize:'0.18rem',
				color:'#666666',
				letterSpacing:0
			},
			itemMarginTop:12,
			y:10
		},
		tooltip:{
			enabled:false
		},
		credits: {
			enabled: false
		},
		series: [{
			type: 'pie',
			size:'100%',
			innerSize: '65%',
			name: '',
			data:objs
		}]
	});
}

// 获取基础信息
var root = localStorage.getItem("str_url");
if (root == "" || root == undefined || root == null) {
	mui.openWindow({
		url: 'login.html?cid=1', //通过URL传参
		id: 'login.html?cid=1', //通过URL传参
	})
}
var token = localStorage.getItem("token");
mui.plusReady(function() {
	data_fun();
	plus.nativeUI.showWaiting("数据加载中...");
});
//统计信息api
$('#city_sort').on('change',data_fun)
var uppage = true;
function data_fun() {
	console.log(token);
	var citys = $('#city_sort').val();
	var _url = root + 'api/v3/licence/getlicencestatis';
	console.log(_url)
	mui.ajax(_url, {
		data: {
			"token": token,
			"cityCode":citys
		},
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			// console.log(JSON.stringify(data));
			if(data.code == 1){
				plus.nativeUI.closeWaiting();
				if (data.data == "") {
					plus.nativeUI.toast("暂无搜索结果");
					return false;
				}
				console.log("----------" + JSON.stringify(data));
				var city = ''
				if(uppage){
					data.data.cityData.forEach(function(item,index) {
						city += '<option value="'+item.value+'">'+item.name+'</option>'
					}); 
					$("#city_sort").append(city);
				}
				
				$(".river_patrol_box_analysis").html(`<div class="river_lake_title">
							<div class="river_lake_title_l">
								<div class="line"></div>
								<div class="text">重点监控用水单位分析</div>
							</div>
						</div>`);
				data.data.unit_statis.forEach(function(item,index) {
					console.log(JSON.stringify(item))
						var div_html = '<div class="waterUse">' +
										'<ul class="waterUse_title">';
						for(key in item.value) {
							div_html += '<li class="color'+index+'_'+key+'">'+item.value[key]+'</li>';
						}
						
						div_html += '</ul>';
						div_html += '<ul class="waterUse_name">';
						for(key in item.name) {
							div_html += '<li class="color'+index+'_'+key+'0">'+item.name[key]+'</li>';
						}
						div_html += '</ul></div>'
						console.log(div_html);
						$(".river_patrol_box_analysis").append(div_html);
				}); 
				uppage = false;
				pieChartFirst('container',data.data.type_statis);
				pieChart('pieChart1',data.data.use_type_statis);
			}
			
			
		},
		error: function(xhr, type, errorThrown) {
			console.log('error')
			plus.nativeUI.closeWaiting();
			plus.nativeUI.toast("网络不稳定，请检查网络");
		}
	})
}