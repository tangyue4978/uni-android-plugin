// 巡河统计start
function pie(data){
	var chart =  Highcharts.chart(data.id, {
		chart: {
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			type: 'pie'
		},
		title: {
			text: null
		},
		tooltip: {
	　　　　enabled:false
	　　},
		legend:{
			enabled:true,
			width:350,
			height:80,
			// align:'right',
			x:20,
			itemMarginBottom:10
		},
		colors:data.colors,
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				borderWidth:0,
				showInLegend: true,
				dataLabels: {
					enabled: true,
					format: '<span style="color:{point.color}">{point.percentage:.1f} %<span>',
					style: {
						fontSize:"0.24rem",
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
			data:data.data
		}]
	});
}

// 巡河统计end

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
		$('#city').on('change',data_fun)
		var uppage = true;
		function data_fun() {
			console.log(token);
			var citys = $('#city').val();
			var _url = root + 'api/v3/water_quality/statistics';
			console.log(_url)
			mui.ajax(_url, {
				data: {
					"token": token,
					"city":citys
				},
				datatype: 'json', //服务器返回json格式数据
				type: 'post', //HTTP请求类型
				success: function(data) {
					if(data.code == 1){
						plus.nativeUI.closeWaiting();
						// plus.nativeUI.showWaiting(JSON.stringify(data.data));
						if (data.data == "") {
							plus.nativeUI.toast("暂无搜索结果");
							return false;
						}
						console.log("----------" + JSON.stringify(data));
						if(uppage){
							data.data.city.forEach(function(item,index){
								console.log(JSON.stringify(item))
								city += '<option value="'+item.value+'">'+item.name+'</option>'
							})
							$('#city').append(city);
						}
						
						var use_value = '';
						data.data.report.value.forEach(function(other_item, other_index) {
							use_value += '<li class="colors'+(other_index + 1)+'">'+other_item+'</li>';
						});
						$('#use_value').html(use_value);
						var use_name = '';
						data.data.report.name.forEach(function(other_item, other_index) {
							use_name += '<li class="colors'+(other_index + 1)+'0">'+other_item+'</li>';
						});
						$('#use_name').html(use_name);
						var warning_value = '';
						data.data.warning.value.forEach(function(other_item, other_index) {
							warning_value += '<li class="red">'+other_item+'</li>';
						});
						$('#warning_value').html(warning_value);
						var warning_name = '';
						data.data.warning.name.forEach(function(other_item, other_index) {
							warning_name += '<li class="red0">'+other_item+'</li>';
						});
						$('#warning_name').html(warning_name);
						console.log("----------" + JSON.stringify(data.data.categories));
						console.log("----------" + JSON.stringify(data.data.basin));
					}
					uppage = false;
					pie(data.data.categories);
					pie(data.data.basin);
					
					
				},
				error: function(xhr, type, errorThrown) {
					console.log('error')
					plus.nativeUI.closeWaiting();
					plus.nativeUI.toast("网络不稳定，请检查网络");
				}
			})
		}