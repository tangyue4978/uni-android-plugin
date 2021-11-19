var root = localStorage.getItem("str_url");
if (root == "" || root == undefined || root == null) {
	mui.openWindow({
		url: 'login.html?cid=1', //通过URL传参
		id: 'login.html?cid=1', //通过URL传参
	})
}
var token = localStorage.getItem("token");
var obj_data = {};
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	plus.nativeUI.showWaiting("加载中...");

	obj_data.token = token;
	obj_data.id = self.item_id;

	vailageDetail(obj_data);
});

function vailageDetail(obj_data) {
	console.log(JSON.stringify(obj_data));
	var _url = root + 'api/v3/licence/getlicencesShow';
	console.log(_url);
	mui.ajax(_url, {
		data: obj_data,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			console.log('12121212');
			console.log("----------" + JSON.stringify(data));
			if (data.code == 1) {
				$('.head_texts').text(data.data.show.name);
				var item_html = '';

				var head_html = '<div class="head_text head_texts">' + data.data.show.name +
					'</div>' +
					'<div class="head_line"></div>' +
					'<div class="head_text">';
				data.data.show.type.forEach(function(item, index) {
					head_html += item;
				})
				head_html += '</div>'

				$('.head').append(head_html);

				var item_data = data.data.basic;
				for (var index = 0; index < item_data.length; index++) {
					var item = item_data[index];
					// console.log("----------"+JSON.stringify(item_data));
					item_html += "<tr><td class='texr'>" + item.name + "</td>" + "<td class='texl'>" +
						item.value + "</td></tr>";
				}
				$(".base_info_table").html(item_html);

				$("#year_zong_qsl").text(data.data.message.gross);
				$("#day_qsl").text(data.data.message.today_amount);
				$("#month_qsl").text(data.data.message.month_amount);
				$("#year_qsl").text(data.data.message.year_amount);
				$(".waterUse_th").html('<td>' + data.data.message.within + '</td>' +
					'<td>' + data.data.message.outer + '</td>' +
					'<td>' + data.data.message.up + '</td>' +
					'<td>' + data.data.message.down + '</td>');
				$(".mui-loading").css("display", "none")
				
				
				console.log('======================'+JSON.stringify(data.data.monitor_list))
				console.log(data.data.monitor_list.length)
				if(data.data.monitor_list.length == 0){
					$(".monitorings").hide()
				}else{
					$(".monitorings").show()
					data.data.monitor_list.map((item,index) =>{
						$(".monitorings .base_info_box").append(`
							<div class="monitoring_point">
								<div class="monitoring_point_title">
									${item.name}
									<img src="../../images/waterIntake/showLine.png" data-index="0" class="showLineImg" onclick="showLines(${item.code})">
								</div>
								<table class="monitoring_point_table" border="1" cellspacing="0" cellpadding="0">
									<tr>
										<td>昨日水量</td>
										<td>本月水量</td>
										<td>本年水量</td>
									</tr>
									<tr>
										<td>${item.dayW}</td>
										<td>${item.mothW}</td>
										<td>${item.yearW}</td>
									</tr>
								</table>
							</div>
						`)
					})
					
					
					if(data.data.monitor_list.length > 3){
						$(".monitorings .base_info_box").append(`
							<div class="monitoring_isShow" onclick="showMonitorings()">
								<img class="icon_arrow" src="../../images/ruralWater/bottomInfo_up.png">
							</div>
						`)
					}
				}
			} else {
				plus.nativeUI.toast(data.msg)
			}
		},
		error: function(xhr, type, errorThrown) {
			console.log(errorThrown)
			plus.nativeUI.closeWaiting();
		}
	})
}

function showMonitorings(){
	let monitoring = $(".monitorings .monitoring_point");
	if($(".monitoring_isShow .icon_arrow").hasClass("active")){
		for(let i=3;i<monitoring.length;i++){
			monitoring.eq(i).addClass('active')
		}
		$(".monitoring_isShow .icon_arrow").removeClass("active")
	}else{
		for(let i=0;i<monitoring.length;i++){
			monitoring.eq(i).removeClass('active')
		}
		$(".monitoring_isShow .icon_arrow").addClass("active")
	}
	
}

// 点击监测点事件
function showLines(codes){
	// 调用图表的接口
	var param = {
		token:token,
		code: codes
	}
	lineCharts(param)
}

function lineCharts(paramData) {
	console.log(JSON.stringify(paramData));
	var _url = root + 'api/v3/licence/getmonitorstationshow';
	console.log(_url);
	mui.ajax(_url, {
		data: paramData,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			console.log("----------" + JSON.stringify(data));
			if (data.code == 1) {
				$(".chart_popup_wrap").css("display", "flex")
				areaChart(data.data.charData)
			} else {
				plus.nativeUI.toast(data.msg)
			}
		},
		error: function(xhr, type, errorThrown) {
			console.log(errorThrown)
			plus.nativeUI.closeWaiting();
		}
	})
}

// 关闭监测点图表
$(".chart_popup_wrap .close").on("click", function() {
	$(this).parent().css("display", "none")
})
// 监测点图表
function areaChart(data) {
	Highcharts.chart("container_line", {
		chart: {
			type: "area",
			marginTop: 30
		},
		title: {
			text: null
		},
		credits: {
			enabled: false
		},
		xAxis: {
			crosshair: true,
			lineColor: "#333",
			lineWidth: 1,
			tickColor: "#333",
			tickLength: 5,
			tickWidth: 1,
			tickPosition: "outside",
			categories: data.categories
		},
		yAxis: {
			crosshair: true,
			lineColor: "#333",
			lineWidth: 1,
			minorTickColor: "#333",
			minorGridLineWidth: 0,
			minorTickInterval: 50,
			minorTickLength: 5,
			minorTickWidth: 1,
			title: {
				enabled: false
			},
			labels: {
				formatter: function() {
					return this.value;
				}
			},
		},
		tooltip: {
			pointFormat: '{series.name}<b>{point.y:,.0f}</b>'
		},
		plotOptions: {
			area: {
				marker: {
					enabled: false,
					symbol: 'circle',
					radius: 2,
					states: {
						hover: {
							enabled: true
						}
					}
				}
			}
		},
		series: data.series
	})
}
