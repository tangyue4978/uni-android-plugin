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
var obj_position = {};
var waterQualitylayers = {}
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	plus.nativeUI.showWaiting("加载中...");

	obj_data.token = token;
	obj_data.id = self.item_id;
	claerDetail(obj_data)
});

function claerDetail(obj) {
	var _url = root + 'api/v3/riverchief/riverchieflakes/show';
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
				
				// 湖泊位置
				let view = map.getView();
				if(baseInfo[length-3].value != '' && baseInfo[length-3].value != 0 && baseInfo[length-2].value != '' && baseInfo[length-2].value != 0){
					$('.current_position').css('visibility','visible')
					view.setCenter([baseInfo[length-3].value,baseInfo[length-2].value]);
					obj_position = {
						name : baseInfo[0].value,
						lng : baseInfo[length-3].value,
						lat : baseInfo[length-2].value,
						icon : './../../images/waterQuality/icon_red.png'
					}
					city_dian_fun(obj_position,'lakes');
				}else{
					$('.current_position').css('display','none')
				}
				

				//处理描述
				// $('.deal_with_text').text(data.data.desc);
				//处理前后照片对比 before 处理前 after 处理后
				// var photo = data.data.img;
				// $('.before').attr('src',photo.before);
				// $('.after').attr('src',photo.after);	
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
