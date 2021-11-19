var clickStr = mui.os.ios ? 'tap' : "click";
$(function() {
	$("#searchBtn").on(clickStr, souinfo);
})

// 点击按钮搜索
function souinfo() {
	plus.nativeUI.showWaiting("搜索中...");
	var val_info = $(".searchInput").val();
	if (val_info == '') {
		plus.nativeUI.toast("请输入关键字搜索");
	}
	var _url = root + 'api/v2/hydropower_station/map';
	var token = localStorage.getItem("token");
	console.log(_url);
	console.log(token);
	mui.ajax(_url, {
		data: {
			"token": token,
			"name": val_info
		},
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			console.log("----------" + JSON.stringify(data));
			if (data.data == "") {
				plus.nativeUI.toast("暂无搜索结果");
				return false;
			}
			if(data.data.length >1){
				// map.getView().setZoom(6.8);
				// map.getView().setCenter(center);
				map.getView().animate({zoom: 6.8},{center: center})
			}
			// 清除要素点
			cityClusters.getSource().clear();
			// mapPoint(data.data);
			city_dian_fun(data.data)
		},
		error: function(xhr, type, errorThrown) {
			console.log("请求错误");
			console.log(xhr, type, errorThrown);
		}
	})
}


// 地图信息
//起始位置
// var center = [112.6, 37.9];
var center = [112.387029,37.872418];
//初始化矢量图层
var vectorLayers = new ol.layer.Vector({
	source: new ol.source.Vector({
		// url: '../../js/ruralWater/json/140800030101070001.json', //从文件加载边界等地理信息
		url: '../../js/ruralWater/shanxi.json', //从文件加载边界等地理信息
		// url: '../../js/ruralWater/boundary.json', //从文件加载边界等地理信息
		format: new ol.format.GeoJSON()
	}),
	className: "geojson",
	projection: 'EPSG:3857',
});

//加载geoserver的WMS服务
// var TileWMSLayer = new ol.layer.Tile({
// 	source: new ol.source.TileArcGISRest({
// 		url: "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunity_Mobile/MapServer"
// 	}),
// 	projection: 'EPSG:4326'
// })
var projection = ol.proj.get("EPSG:4326");
var projectionExtent = projection.getExtent();
var size = ol.extent.getWidth(projectionExtent) / 256;
var resolutions = [];
for (var z = 2; z < 19; ++z) {
	resolutions[z] = size / Math.pow(2, z);
}
// 地形晕渲_经纬度投影
var TileWMSLayer = new ol.layer.Tile({
	source: new ol.source.WMTS({
		name: "中国矢量1-4级",
		url: "http://t{0-6}.tianditu.com/ter_c/wmts?tk=470a3cb94a3196e6c324a42bf6afcb77",
		layer: "ter",
		style: "default",
		matrixSet: "c",
		format: "tiles",
		wrapX: true,
		tileGrid: new ol.tilegrid.WMTS({
			origin: ol.extent.getTopLeft(projectionExtent),
			//resolutions: res.slice(0, 15),
			resolutions: resolutions,
			matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
		})
	}),
})

// 河流服务
var WMTSRiver = new ol.layer.Tile({
	source: new ol.source.WMTS({
		name: 'group_sxriver',
		url: 'http://gis.sxjicheng.cn:8081/freexserver/htc/service/wmts',
		layer: 'group_sxriver',
		style: "",
		matrixSet: "EPSG:4326",
		format: "image/png",
		wrapX: true,
		tileGrid: new ol.tilegrid.WMTS({
			origin: ol.extent.getTopLeft(projectionExtent),
			resolutions: [0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125,
								0.0054931640625, 0.00274658203125, 0.001373291015625, 0.0006866455078125, 0.00034332275390625,
								0.000171661376953125, 8.58306884765625e-005, 4.291534423828125e-005, 2.1457672119140625e-005
							],
			matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
		})
	}),
	visible:true,
	className: 'heliu-server',
	projection: 'EPSG:4326'
})

//整个地图
var map = new ol.Map({
	interactions: ol.interaction.defaults({
		pinchRotate: false // 移动端禁止地图旋转
	}),
	layers: [
		TileWMSLayer,
		vectorLayers,
		WMTSRiver
	],
	target: 'map',
	view: new ol.View({
		center: center,
		projection: projection,
		zoom: 6.8
	})
});


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
	jc_info_fun();
	plus.nativeUI.showWaiting("数据加载中...");
});

function jc_info_fun() {

	var _url = root + 'api/v2/hydropower_station/map';
	console.log(_url)
	mui.ajax(_url, {
		data: {
			"token": token
		},
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			// plus.nativeUI.showWaiting(JSON.stringify(data.data));
			if (data.data == "") {
				plus.nativeUI.toast("暂无搜索结果");
				return false;
			}
			console.log("----------" + JSON.stringify(data));
			// map_level = data.level;
			// 清除要素点
			// vectorlayer.getSource().clear();
			// mapPoint(data.data);
			city_dian_fun(data.data);
		},
		error: function(xhr, type, errorThrown) {
			console.log('error')
			plus.nativeUI.closeWaiting();
			plus.nativeUI.toast("网络不稳定，请检查网络");
		}
	})
}
// 基础信息 end

// 详情方法
function xiangqing(item_id) {
	var self = plus.webview.currentWebview();
	mui.openWindow({
		url: 'searchDetails.html', //通过URL传参
		id: 'searchDetails.html', //通过URL传参
		extras: {
			item_id: item_id,
			type: "hydropower_station_list"
		}
	})
};
// 点击跳转水电站详情
map.on(clickStr, function(e) {
	//在点击时获取像素区域
	var pixel = map.getEventPixel(e.originalEvent);
	map.forEachFeatureAtPixel(pixel, function(feature, vectorLayers) {
		var coodinate = e.coordinate;
		if (vectorLayers.className_ == "feature") {
			var item_info = feature.values_;
			console.log("----------" + JSON.stringify(item_info))
			xiangqing(item_info.item.id);
		} else {
			console.log(e.coordinate);
		}
	});
});
// 地图信息 end


// 坐标组
/**
 * @param {Object} feature
 * @description 创建标签的样式
 */
function iconStyle_set(feature) {
	// console.log(JSON.stringify(feature));
	var text = feature.values_.name;
	// var images = "./../../images/ruralWater/xxsdz_icon/waterfee_xxsdz.png";
	var images = feature.values_.item.icon || "./../../images/ruralWater/xxsdz_icon/waterfee_xxsdz.png";
	var item = feature.values_.item
	var zoom = map.getView().getZoom();
	var opacity = 1;
	var scale = 0.6;
	if(!item.type_zoom || item.type_zoom<=zoom){
		
	}else{
		text ="";
		opacity = 12 / item.type_zoom / 2;
		scale = 0.4;
	}
	//返回一个样式
	var iconStyle = new ol.style.Style({
		image: new ol.style.Icon({
			opacity: opacity,
			scale: scale,
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
				color: feature.values_.item.stroke || "#ffffff",
				width:feature.values_.item.stroke_width || 2
			})
			// backgroundFill: new ol.style.Fill({
			// 	color: '#ffffff'
			// })
		})
	});
	
	return iconStyle;
};
// 水电站位置
function city_dian_fun(arr) {
	var vectorSource = new ol.source.Vector({});
	var pointArr = arr;
	if(pointArr.length == 1){
		pointArr[0].type_zoom = 1;
		map.getView().animate({zoom: 6.8},{center: [Number(pointArr[0].longitude),Number(pointArr[0].latitude)]}, {zoom: 12})
	}
	for (var i = 0; i < pointArr.length; i++) {
		var item_info = pointArr[i];
		var feature = new ol.Feature({
			geometry: new ol.geom.Point([item_info.longitude, item_info.latitude]),
			name: item_info.name,
			// code: item_info.code,
			item: item_info
		});
		vectorSource.addFeature(feature);
		
		//为点要素添加样式
		// feature.setStyle(iconStyle_set(feature));
		
	}

	//创建图标层
	cityClusters = new ol.layer.Vector({
		source: vectorSource,
		style: iconStyle_set,
		className: "feature"
	});
	map.addLayer(cityClusters); //市级
	cityClusters.setVisible(true);
	cityClusters.setZIndex(999);
	
}


