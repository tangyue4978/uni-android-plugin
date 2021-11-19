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
var waterQualitylayers = {};
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	plus.nativeUI.showWaiting("加载中...");

	obj_data.token = token;
	obj_data.id = self.item_id;
	claerDetail(obj_data)
});

function claerDetail(obj) {
	var _url = root + 'api/v3/riverchief/riverchiefriver/show';
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
			if (data.code == 1) {
				//详情标题
				// var title = data.data.head;
				// $('.head_texts').text(title.type);
				// $('.head_desc').text(title.desc);


				//基础信息?????
				var baseInfo = data.data.baseInfo;

				//详情标题
				$('.head_texts').text(baseInfo[0].value);
				$('.head_desc').text(baseInfo[1].value);
				var length = baseInfo.length;
				var tr_html = '';
				for(let i=2;i<length;i++){
					if(baseInfo[i].value == ''){
						baseInfo[i].value = '-'
					}
					tr_html += '<tr><td class="texr">' + baseInfo[i].name + '</td><td class="texl">' + baseInfo[i].value + '</td></tr>';
				}
				$('.base_info_table').html(tr_html)

				//流经地
				console.log(baseInfo.length)
				$('.deal_with_text').text(baseInfo[baseInfo.length - 1].value)

				// 河源位置河口
				var arr_point = [];
				var obj_position = {};
				var obj_position1 = {};
				for(let j=0;j<length;j++){
					switch (baseInfo[j].name){
						case '河源经度':
							obj_position.lng = baseInfo[j].value
							break;
						case '河源纬度':
							obj_position.lat = baseInfo[j].value
							break;
						case '河口经度':
							obj_position1.lng = baseInfo[j].value
							break;
						case '河口纬度':
							obj_position1.lat = baseInfo[j].value
							break;
						default:
							break;
					}
				}
				obj_position.name = '河源位置';
				obj_position1.name = '河口位置'
				let lng_center = (Number(obj_position.lng) + Number(obj_position1.lng))/2;
				let lat_center = (Number(obj_position.lat) + Number(obj_position1.lat))/2;
				if(obj_position.lng != '' && obj_position.lat != "" && obj_position1.lng != "" && obj_position1.lat != ""){
					$('.current_position').css('visibility','visible')
					let view = map.getView();
					view.setCenter([lng_center,lat_center]);
					view.setZoom(5)
					arr_point.push(obj_position)
					arr_point.push(obj_position1)
					city_dian_fun(arr_point,'river');
				}else{
					$('.current_position').css('display','none')
				}
			}
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


/**
 * @param {Object} feature
 * @description 创建标签的样式
 */
function iconStyle_set(feature) {
	// console.log(JSON.stringify(feature));
	var level = map.getView().getZoom();
	var text =  feature.values_.name;
	
	var item = feature.values_.item
	var zoom = map.getView().getZoom();
	//返回一个样式
	var iconStyle = new ol.style.Style({
		image: new ol.style.Icon({
			opacity: 1,
			scale: 0.6,
			src: './../../images/waterQuality/icon_red.png'
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
