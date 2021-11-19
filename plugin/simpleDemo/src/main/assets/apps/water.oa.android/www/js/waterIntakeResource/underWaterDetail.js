function Column(data) {
	// console.log(data);
	if(!plus.device.imei){
		data.yAxisX = 30;
		data.yAxisY = -180;
	}else{
		data.yAxisX = 30;
		data.yAxisY = -90;
	}
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
			marginLeft: 55,
			marginTop: 40,
			marginRight: 35,
			zoomType: 'xy'
		},
		colors: data.colors,
		credits: {
			enabled: false // 禁用版权信息
		},
		title: {
			text: null,
			align: 'left',
			style: {
				color: '#333333',
				fontSize: 14
			}
		},
		subtitle: {
			floating: true,
			verticalAlign: 'bottom',
		},
		xAxis: {
			tickWidth: 0, //去掉刻度
			lineColor: '#8c8c8c',
			labels: {
				enabled: true
			},
			categories: data.categories,
		},
		tooltip: {
			enabled: true,
		},
		yAxis: [{
			lineColor: '#8c8c8c',
			lineWidth: 1,
			title: {
				text: data.ytitle,
				style: {
					color: '#8c8c8c',
				},
				x: data.yAxisX,
				y: data.yAxisY,
				rotation: 360
			},
			// categories:[1033.28,1033.3,1033.32,1033.34,1033.36,1033.38,1033.4],
			gridLineWidth: 0,
			labels: {
				style: {
					color: '#8c8c8c',
					fontSize: 10
				},
				format: '{value}'
			}
		}, {
			lineColor: '#8c8c8c',
			lineWidth: 1,
			title: {
				text: data.ytext,
				style: {
					color: '#8c8c8c',
				},
				x: 10,
				y: -55,
				rotation: 360
			},
			// categories:[35.82,35.84,35.86,35.88,35.9,35.92,35.94],
			gridLineWidth: 0,
			labels: {
				style: {
					color: '#8c8c8c',
					fontSize: 10
				}
			},
			opposite: true
		}],
		legend: {
			enabled: true,
			itemStyle: {
				color: '#cccccc',
				fontSize: '10px'
			}
		},

		plotOptions: {
			dataLabels: {
				enabled: false
			},
			line: {
				// dataLabels:{
				// 	enabled: true,
				// 	format: '{y} m'
				// },
				marker: {
					enabled: false
				}
			}
		},
		series: data.series
	});
}

//
var root = localStorage.getItem("str_url");
if (root == "" || root == undefined || root == null) {
	mui.openWindow({
		url: 'login.html?cid=1', //通过URL传参
		id: 'login.html?cid=1', //通过URL传参
	})
}
var token = localStorage.getItem("token");
var obj_data = {};
var waterQualitylayers = {}
var obj_code = ""; // code
var starAt = ""; // starAt
var endAt = ""; // endAt
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	plus.nativeUI.showWaiting("加载中...");
	if (self.maptype == "map") {
		obj_data.token = token;
		obj_data.id = self.item_id;
	} else {
		obj_data.token = token;
		obj_data.id = self.item_id;
	}

	vailageDetail(obj_data);
});

function vailageDetail(obj_data) {
	console.log(JSON.stringify(obj_data));
	// var _url = root + 'api/rural/townshow';
	var _url = root + 'api/v3/water_rain_condition/stageshow';

	console.log(_url);
	mui.ajax(_url, {
		data: obj_data,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			console.log("----------" + JSON.stringify(data));
			obj_code = data.data.code;

			if (data.code == 1) {
				var title = data.data.title;
				starAt = data.data.statisticsDate[0].value;
				endAt = data.data.statisticsDate[1].value;
				$('.head').append(
					'<div class="head_text head_texts">' + title.name + '</div>' +
					'<div class="head_line"></div>' +
					'<div class="head_text head_text_top">' + title.city + ' ' + title.county + '</div>'
				);
				var item_html = '';
				var item_data = data.data.body;
				for (var index = 0; index < item_data.length - 1; index++) {

					var item = item_data[index];

					item_html += '<tr><td class="texr">' + item.name + '</td><td class="texl">' + item
						.value + '</td></tr>';
				}
				$(".base_info_table").html(item_html);
				var report_html = '';
				if (data.data.reportList != '') {
					data.data.reportList.forEach(function(item, index) {
						report_html += '<tr>' +
							'<td>' + item.tm + '</td> ' +
							'<td>' + item.stage + '</td> ' +
							'<td>' + item.buried_depth + '</td> ' +
							'<td>' + item.month_diff + '</td> ' +
							'</tr> '
					})
					$(".deal_table").append(report_html);
				} else {
					$(".deal_with_text").append(
						'<img style="width: 2.39rem;height: 1.95rem;margin:1.5rem auto 0;" src="../../images/unmoment.png" >'
						);
				}

				var date_html = '';
				data.data.statisticsDate.forEach(function(item, index) {
					date_html += '<span class="">' + item.value + '</span>';
					if (index == 0) {
						date_html += '<span class=""> ~ </span>';
					}
				})
				$(".monitoring_input").append(date_html);
				console.log(data.data.statisticsArr.series[0].data)
				if (data.data.statisticsArr.series[0].data != '') {
					Column(data.data.statisticsArr)
				} else {
					$(".reservoirL1").append(
						'<img style="width: 2.39rem;height: 1.95rem;" src="../../images/unmoment.png" >'
						);
				}

				// 监测站位置标注
				var coordinate = data.data.coordinate;
				if (coordinate.lng == "" && coordinate.lat == "") {
					$('.current_location').css('display', 'none');
				} else {
					let view = map.getView();
					view.setCenter([coordinate.lng, coordinate.lat]);
					obj_position = {
						name: title.name,
						lng: coordinate.lng,
						lat: coordinate.lat,
						icon: './../../images/waterQuality/icon_red.png'
					}
					city_dian_fun(obj_position, 'station');
				}


				$(".mui-loading").css("display", "none")
			} else {
				plus.nativeUI.toast(data.msg)
			}
			// 修改基本信息的高度
			if (!plus.device.imei) {
				$(".main .base_info").css({
					'height': 'auto',
					'padding-bottom': '0.5rem'
				})
			}
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
}
//水位监测数据
var data1 = {
	id: "reservoirL1",
	colors: ['#6492ff', '#ff0000', '#cc33cc', '#00cc00'],
	ytitle: '水位(m)',
	ytext: '埋深(m)',
	series: [{
		name: '水位(m)',
		data: [1.060, 1.059, 1.061, 1.059],
	}, {
		name: '禁采水位(m)',
		data: null,
	}, {
		name: '限采水位(m)',
		data: null,
	}, {
		name: '埋深(m)',
		data: [35.9, 35.88, 35.92, 35.84],
	}]
};


// 地下水监测信息
/**
 * @param {Object} type -1 前一天 1后一天
 * @param {Object} date 日期时间
 */
function riqi(type, dqdate) {
	var curDate = new Date(dqdate);
	if (type > 0) {
		var nextDate = new Date(curDate.getTime() + 3 * 24 * 60 * 60 * 1000); //后一天
		return getNowFormatDate(nextDate.getTime());
	} else {
		var preDate = new Date(curDate.getTime() - 3 * 24 * 60 * 60 * 1000); //前一天
		console.log(getNowFormatDate(preDate.getTime()));
		return getNowFormatDate(preDate.getTime());
	}

}

function getNowFormatDate(data) {
	if (data == "") {
		var date = new Date();
	} else {
		var date = new Date(data);
	}


	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1;

	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}

	var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
	return currentdate;
}


function setJcxxFun(typenum) {

	if ((typenum - 0) > 0) {
		var star_riqi_date = new Date(getNowFormatDate(""));
		var end_riqi_date = new Date(endAt);
		console.log(end_riqi_date.getTime(), star_riqi_date.getTime());
		if (end_riqi_date.getTime() >= star_riqi_date.getTime()) {
			plus.nativeUI.toast("监测信息不能大于当前日期");
			return false;
		}
		endAt = riqi(typenum, endAt)
		starAt = riqi(typenum, starAt)
	} else {
		endAt = riqi(typenum, endAt)
		starAt = riqi(typenum, starAt)
	}
	var self = plus.webview.currentWebview();
	plus.nativeUI.showWaiting("加载中...");
	var obj_data = {};
	obj_data.token = token;
	obj_data.id = self.item_id;
	obj_data.code = obj_code;
	obj_data.startAt = starAt;
	obj_data.endAt = endAt;
	var _url = root + 'api/v3/water_rain_condition/stagereport';
	console.log(_url);
	console.log(JSON.stringify(obj_data));
	mui.ajax(_url, {
		data: obj_data,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			console.log(JSON.stringify(data));
			plus.nativeUI.closeWaiting();

			Column(data.data.statisticsArr)

			var date_html = '';
			data.data.statisticsDate.forEach(function(item, index) {
				date_html += '<span class="">' + item.value + '</span>';
				if (index == 0) {
					date_html += '<span class=""> ~ </span>';
				}
			})
			$(".monitoring_input").html(date_html);
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
}

// 点的位置
function city_dian_fun(item_info, layername) {
	var vSource = new ol.source.Vector({});
	console.log(JSON.stringify(item_info));
	var feature = new ol.Feature({
		geometry: new ol.geom.Point([item_info.lng, item_info.lat]),
		name: item_info.name,
		item: item_info
	});
	vSource.addFeature(feature);

	//创建图标层
	waterQualitylayers[layername] = new ol.layer.Vector({
		source: vSource,
		style: iconStyle_set,
		className: layername
	});
	map.addLayer(waterQualitylayers[layername]); //市级
}


/**
 * @param {Object} feature
 * @description 创建标签的样式
 */
function iconStyle_set(feature) {
	// console.log(JSON.stringify(feature));
	var level = map.getView().getZoom();
	var text = feature.values_.name;
	var images = feature.values_.item.icon;

	var item = feature.values_.item
	var zoom = map.getView().getZoom();
	//返回一个样式
	var iconStyle = new ol.style.Style({
		image: new ol.style.Icon({
			opacity: 1,
			scale: 0.6,
			src: images
		}),
		text: new ol.style.Text({
			font: '12px sans-seri',
			text: String(text),
			fill: new ol.style.Fill({
				color: "#2EA2F5"
			}),
			offsetY: 20,
			stroke: new ol.style.Stroke({
				color: "#ffffff",
				width: 2
			})
			// backgroundFill: new ol.style.Fill({
			// 	color: '#ffffff'
			// })
		})
	});
	return iconStyle;
};
