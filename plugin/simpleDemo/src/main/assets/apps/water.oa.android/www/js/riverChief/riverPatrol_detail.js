var root = localStorage.getItem("str_url");
console.log(root)
if (root == "" || root == undefined || root == null) {
	mui.openWindow({
		url: 'login.html?cid=1', //通过URL传参
		id: 'login.html?cid=1', //通过URL传参
	})
}
var token = localStorage.getItem("token");
console.log(token);
var obj_data = {};
var obj_point = [];
var waterQualitylayers = {}
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	plus.nativeUI.showWaiting("加载中...");
	obj_data.token = token;
	obj_data.id = self.item_id;
	claerDetail(obj_data)
});

function claerDetail(obj) {
	var _url = root + 'api/v3/riverchief/inspectriver/show';
	console.log(JSON.stringify(obj_data))
	mui.ajax(_url, {
		data: {
			"token": token,
			"id": obj.id,
		},
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			console.log(JSON.stringify(data.data))
			var infobox = data.data;
			if (data.code == 1) {
				//基础信息
				var baseInfo = data.data.baseInfo;
				$('.head_texts').text(baseInfo[1].value);
				$('.head_desc').text(baseInfo[0].value);
				var length = baseInfo.length;
				var tr_html = '';
				for(let i=2;i<length;i++){
					if(baseInfo[i].value == ''){
						baseInfo[i].value = '-'
					}
					tr_html += '<tr><td class="texr">' + baseInfo[i].name + '</td><td class="texl">' + baseInfo[i].value + '</td></tr>';
				}
				$('.base_info_table').html(tr_html)
				
				// 监测信息
				var monitor = data.data.event;
				// console.log(JSON.stringify(monitor))
				if (monitor.length > 0) {
					for (let i = 0; i < monitor.length; i++) {
						if (i == 0) {
							for (let j = 0; j < monitor[0].length; j++) {
								$('.base_info_name').append(
									'<td class="texr texc">' + monitor[0][j].name + '</td>'
								)
								$('.respect_tr').append(
									'<td class="texl">' + monitor[0][j].value + '</td>'
								)
							}
						} else {
							$('.respect_table').append('<tr class="respect_trs"></tr>')
							for (let l = 0; l < monitor[i].length; l++) {
								$('.respect_trs').append(
									'<td class="texl">' + monitor[i][l].value + '</td>'
								)
							}
						}
					}
				} else {
					$('.river_patrol').css('display', 'none')
				}
				
				// 巡河轨迹
				var Points = data.data.point;
				// console.log(JSON.stringify(Points))
				// 设置地图中心点
				let lng_center = (Points.start.lng + Points.end.lng) / 2;
				let lat_center = (Points.start.lat + Points.end.lat)/2;
				let view = map.getView();
				view.setCenter([lng_center,lat_center]);
				view.setZoom(14);
				// 河流轨迹线
				var LineStrings = data.data.track;
				city_line_fun(LineStrings,'line');
				// console.log(LineStrings)
				// console.log(LineStrings[0])
				// console.log(LineStrings[LineStrings.length-1])
				// 河流开始，结束的位置
				// Points.start.icon = './../../images/waterQuality/icon_red.png';
				// Points.end.icon = './../../images/waterQuality/icon_red.png';
				var obj_start = {
					lng:LineStrings[0][0],
					lat:LineStrings[0][1],
					name:Points.start.name,
					icon:'./../../images/waterQuality/icon_red.png'
				}
				var obj_end = {
					lng:LineStrings[LineStrings.length-1][0],
					lat:LineStrings[LineStrings.length-1][1],
					name:Points.end.name,
					icon:'./../../images/waterQuality/icon_red.png'
				}
				obj_point.push(obj_start)
				obj_point.push(obj_end)
				city_dian_fun(obj_point,'point')
			}
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
}

// 巡河轨迹点添加
function city_dian_fun(item_info, layername) {
	var vSource = new ol.source.Vector({});
	console.log(JSON.stringify(item_info));
	item_info.forEach((item,index) =>{
		console.log(JSON.stringify(item))
		var feature = new ol.Feature({
			geometry: new ol.geom.Point([item.lng, item.lat]),
			name: item.name,
			item: item
		});
		vSource.addFeature(feature);
	})
	//创建图标层
	waterQualitylayers[layername] = new ol.layer.Vector({
		source: vSource,
		style: iconStyle_set,
		className: layername
	});
	map.addLayer(waterQualitylayers[layername]); //市级
}
// 巡河轨迹线添加
function city_line_fun(item_info, layername) {
	var vSource = new ol.source.Vector({});
	// console.log(JSON.stringify(item_info));
	var feature = new ol.Feature({
		geometry: new ol.geom.LineString(item_info),
		// name: item.name,
		// item: item
	});
	vSource.addFeature(feature);
	//创建图标层
	waterQualitylayers[layername] = new ol.layer.Vector({
		source: vSource,
		style: new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: "#2EA2F5",
				width: 2
			})
		}),
		className: layername
	});
	map.addLayer(waterQualitylayers[layername]); //市级
}

// 样式
/**
 * @param {Object} feature
 * @description 创建标签的样式
 */
function iconStyle_set(feature) {
	// console.log(JSON.stringify(feature));
	var level = map.getView().getZoom();
	var text =  feature.values_.name;
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


// 播放暂停按钮样式切换
// $('.animation').on('click','.image',function(){
// 	if($(this).hasClass('images') == true){
// 		$(this).removeClass('images')
// 		$(this).siblings().addClass('images')
// 	}
// })