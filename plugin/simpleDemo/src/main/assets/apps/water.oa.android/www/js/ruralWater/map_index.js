var clickStr = mui.os.ios ? 'tap' : "click"
$(function() {
	//菜单
	$(".icon-menu").on(clickStr, function() {
		var $menuList = $(this).parent(".header").find(".menuList");
		if ($menuList.hasClass("show")) {
			$menuList.removeClass("show").fadeOut();
		} else {
			$menuList.addClass("show").fadeIn();
		}
	})
	//导航信息
	$(".gpsInfo .icon_arrow").on(clickStr, function() {
		if ($(".gpsInfo").hasClass("open")) {
			$(".gpsInfo").removeClass("open").css("height", ".48rem");
		} else {
			$(".gpsInfo").addClass("open").css("height", "auto");
		}
	})
	//地图搜索
	// $(".searchPanel .searchInput").on("input", function() {
	// 	var $inputLen = $(".searchInput").val().length;

	// 	if ($inputLen > 0) {
	// 		$(".searchPanel").addClass("active");
	// 	} else {
	// 		$(".searchPanel").removeClass("active");
	// 	}
	// 	$("#searchUl").html('');
	// 	var _url = root + 'api/rural/indexsearch';
	// 	var val_info = $(".searchInput").val();
	// 	var token = localStorage.getItem("token");
	// 	mui.ajax(_url, {
	// 		data: {
	// 			"token": token,
	// 			"name": val_info
	// 		},
	// 		datatype: 'json', //服务器返回json格式数据
	// 		type: 'post', //HTTP请求类型
	// 		success: function(data) {
	// 			console.log("----------" + JSON.stringify(data));
	// 			var html = "";
	// 			if (data.data.length > 0) {
	// 				data.data.forEach(function(item, index) {
	// 					var str2 = '<span class="text-orange">' + val_info + '</span>';
	// 					var item_name = item.name;
	// 					var item_code = item.code;
	// 					var new_name = item_name.replace(new RegExp(val_info, 'g'), str2);
	// 					html +=
	// 						`<li class="tips_li" data-code="${item_code}" data-name="${item_name}" >
	// 										<a href="javascript:void(0);">
	// 											<img src="../../images/ruralWater/gps.png" alt="">
	// 											${new_name}
	// 										</a>
	// 									</li>`
	// 				})

	// 			} else {
	// 				html =
	// 					`<li>
	// 									<a href="javascript:void(0);">
	// 										<img src="../../images/ruralWater/gps.png" alt="">
	// 										暂无数据
	// 									</a>
	// 								</li>`
	// 			}
	// 			// console.log(html)
	// 			$("#searchUl").html(html);

	// 		},
	// 		error: function(xhr, type, errorThrown) {}
	// 	})

	// })


	$("#searchBtn").on(clickStr, souinfo);
	$("body #searchUl").on(clickStr, ".tips_li", tips_souinfo);
	$(".searchPanel .searchparts_cancel").on(clickStr, function() {
		$(".searchInput").val("");
		$(".searchPanel").removeClass("active");
	})
})
// 点击按钮搜索
function souinfo() {
	plus.nativeUI.showWaiting("搜索中...");
	var val_info = $(".searchInput").val();
	$(".searchPanel").removeClass("active");

	var _url = root + 'api/rural/indexsearch';
	var token = localStorage.getItem("token");
	mui.ajax(_url, {
		data: {
			"token": token,
			"name": val_info
		},
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			if (data.data == "") {
				plus.nativeUI.toast("暂无搜索结果");
				return false;
			}
			map.getView().setZoom(6.3);
			console.log("----------" + JSON.stringify(data));
			map_level = data.level;
			// map_nav = data.nav;
			// setInfodata(map_nav);
			// 清除要素点
			cityClusters.getSource().clear();
			addfeaturepoint(data.data, cityClusters)
		},
		error: function(xhr, type, errorThrown) {}
	})
}

// 点击快捷提示搜索
function tips_souinfo() {
	var code = $(this).attr("data-code");
	var name = $(this).attr("data-name");
	plus.nativeUI.showWaiting("搜索中...");
	$(".searchInput").val(name);
	var val_info = $(".searchInput").val();
	var new_code = code;
	$(".searchPanel").removeClass("active");

	var _url = root + 'api/rural/indexsearch';
	var token = localStorage.getItem("token");
	mui.ajax(_url, {
		data: {
			"token": token,
			// "name": val_info,
			"code": new_code
		},
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			if (data.data == "") {
				plus.nativeUI.toast("暂无搜索结果");
				return false;
			}
			map.getView().setZoom(12);
			// console.log(data.data[0].lng,data.data[0].lat);
			var self_center = [data.data[0].lng, data.data[0].lat];
			map.getView().setCenter(self_center);
			console.log("----------" + JSON.stringify(data));
			map_level = data.level;
			// map_nav = data.nav;
			// setInfodata(map_nav);
			// 清除要素点
			cityClusters.getSource().clear();
			addfeaturepoint(data.data, cityClusters)
		},
		error: function(xhr, type, errorThrown) {}
	})
}


// 自然村搜索 end

// 地图信息
//起始位置
// var center = [112.6, 37.9];
var center = [112.387029, 37.872418];
//聚合距离
var clusterDistance = 50;
//初始化矢量图层
var vectorLayer = new ol.layer.Vector({
	source: new ol.source.Vector({
		// url: '../../js/ruralWater/json/140800030101070001.json', //从文件加载边界等地理信息
		url: '../../js/ruralWater/shanxi.json', //从文件加载边界等地理信息
		// url: '../../js/ruralWater/boundary.json', //从文件加载边界等地理信息
		format: new ol.format.GeoJSON()
	}),
	className: "geojson",
	projection: 'EPSG:3857'
});
//散列点数组
// var coordinate = [
// 	[113.74, 39.86],
// 	[113.65, 39.36],
// 	[112.64, 39.52],
// 	[112.65, 38.68],
// 	[112.33, 37.93],
// 	[111.19, 37.70],
// 	[113.54, 38.04],
// 	[113.10, 37.44],
// 	[111.41, 36.17],
// 	[113.07, 36.41],
// 	[111.00, 35.20],
// 	[112.65, 35.60]
// ];
//散列点资源
var source = new ol.source.Vector();

// for(var i = 0; i < coordinate.length; i++){
// 	var feature = new ol.Feature({
// 		geometry:new ol.geom.Point(ol.proj.transform(coordinate[i], 'EPSG:4326', 'EPSG:3857'))
// 	});
// 	source.addFeature(feature);
// }
//聚类资源
// var clusterSource = new ol.source.Cluster({  
// 	distance:clusterDistance,  
// 	source: source  
// });  
//聚类
// var clusters = new ol.layer.Vector({  
// 	source: clusterSource,  
// 	style:function(feature) {  
// 		return setClusterStyle(feature);  
// 	}  
// }); 

//加载geoserver的WMS服务
// var TileWMSLayer = new ol.layer.Tile({
// 	// source : new ol.source.TileWMS({
// 	// 	url:"http://192.168.1.251:8002/geoserver/map_tms/wms",
// 	// 	// params: {'LAYERS': 'map_tms:china_tiles'},
// 	// 	params: {'LAYERS': 'map_tms:jiancaopingTiles'},
// 	// }),
// 	// source: new ol.source.OSM(),
// 	source : new ol.source.TileArcGISRest({
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

var TitleWMSLayer_bz = new ol.layer.Tile({
	source: new ol.source.WMTS({
		name: "中国矢量注记1-4级",
		url: "http://t{0-6}.tianditu.com/cva_c/wmts?tk=470a3cb94a3196e6c324a42bf6afcb77",
		layer: "cva",
		style: "default",
		matrixSet: "c",
		format: "tiles",
		wrapX: true,
		tileGrid: new ol.tilegrid.WMTS({
			origin: ol.extent.getTopLeft(projectionExtent),
			resolutions: resolutions,
			matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
		})
	}),
})

//整个地图
var map = new ol.Map({
	interactions: ol.interaction.defaults({
		pinchRotate: false // 移动端禁止地图旋转
	}),
	layers: [TileWMSLayer, TitleWMSLayer_bz, vectorLayer],
	target: 'map',
	view: new ol.View({
		center: center,
		projection: projection,
		zoom: 6.8
	})
});

// 市级点
function city_dian_fun(arr) {
	var vectorSource = new ol.source.Vector({});
	var pointArr = arr;
	for (var i = 0; i < pointArr.length; i++) {
		var item_info = pointArr[i];
		var feature = new ol.Feature({
			geometry: new ol.geom.Point([item_info.lng, item_info.lat]),
			name: item_info.name,
			code: item_info.code,
			number: item_info.count,
			id: item_info.id
		});
		vectorSource.addFeature(feature);
	}

	//创建图标层
	cityClusters = new ol.layer.Vector({
		source: vectorSource,
		style: function(res) {
			return new_style(res);
		},
		className: "feature"
	});
	map.addLayer(cityClusters); //市级
}
var cityClusters = new ol.layer.Vector({})

// 市级点 end
//zoom变化
// function zoomLevelFun(){
// 	var zoomLevel = map.getView().getZoom();
// 	map.removeLayer(clusters);
// 	map.removeLayer(cityClusters);
// 	if(zoomLevel > 6.5){
// 		map.addLayer(clusters);//具体点聚合点
// 	}else{
// 		map.addLayer(cityClusters);//市级
// 	}
// }
// zoomLevelFun();

// 地图缩放事件监听
map.getView().on('change:resolution', function() {
	// 重新设置图标的缩放率，基于层级20来做缩放
	// zoomLevelFun()

	var mapExtent = map.getView().calculateExtent(map.getSize());
	var point = ol.extent.getCenter(mapExtent);
	point = [point[0], point[1]],
		console.log("中心点=" + point);
	console.log("getSize=" + map.getSize());
})

map.on(clickStr, function(e) {
	var pixel = map.getEventPixel(e.originalEvent);
	// console.log(pixel);
	map.forEachFeatureAtPixel(pixel, function(feature, vectorlayer) {
		if (vectorlayer.className_ == "feature") {
			var item_info = feature.values_;
			console.log(JSON.stringify(item_info));
			console.log(item_info.name, item_info.code, item_info.number, "====", item_info.id);

			if (map_level >= 4) {
				console.log("第三级暂无点击数据————————" + map_level);
				xiangqing(item_info.code)
			} else {
				plus.nativeUI.showWaiting("数据加载中...");
				mapDataFun(map, feature.values_, e.coordinate, vectorlayer);
			}

		} else {
			console.log(vectorlayer.className_);
			console.log(e.coordinate);
		}
	})
})


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
var map_level = "";
var map_nav = "";

function jc_info_fun() {
	var _url = root + 'api/rural/map';
	mui.ajax(_url, {
		data: {
			"token": token,
			// "type":"1", //1地市 2县区 3村
			"code": ""
		},
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			console.log("----------" + JSON.stringify(data));
			map_level = data.level;
			map_nav = data.nav;
			setInfodata(map_nav);
			// var box_arr = [];
			// data.data.map(function(item,index){
			// 	var arr = Array(item.lng,item.lat,item.count);
			// 	box_arr.push(arr);
			// })
			// console.log(box_arr instanceof Array);
			// city_dian_fun(box_arr);
			city_dian_fun(data.data);

			// zoomLevelFun();
		},
		error: function(xhr, type, errorThrown) {}
	})
}
// 基础信息 end



/**
 * @param {Object} map
 */
function mapDataFun(map, info, lnglat, vectorlayer, type) {
	console.log(map, info, lnglat, vectorlayer);

	if (type == "reload") {
		location.reload();
		return false;
	}
	if (type != "backfun") {
		var data_obj = {
			map: map,
			info: info,
			lnglat: lnglat,
			vectorlayer: vectorlayer,
			type: "backfun",
			map_level: map_level,
		}

		map_history_record.push(data_obj);
		console.dir(map_history_record);
	}


	map.getView().setCenter(lnglat);
	var new_map_level = map_level != "" ? map_level + 1 : 1;
	if (new_map_level == 1) {
		map.getView().setZoom(6.3);
	} else if (new_map_level == 2) {
		map.getView().setZoom(8);
	} else if (new_map_level == 3) {
		map.getView().setZoom(10);
	} else {
		map.getView().setZoom(13);
	}


	//新增要素点
	// 坐标组
	var _url = root + 'api/rural/map';
	mui.ajax(_url, {
		data: {
			"token": token,
			// "type":"2", //1地市 2县区 3村
			"code": info.code
		},
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			console.log("----------" + JSON.stringify(data));
			map_level = data.level;
			map_nav = data.nav;
			setInfodata(map_nav);
			if (map_level <= 2) {
				getInformationFun(vectorLayer, map_nav.navcode)
			}

			// 清除要素点
			vectorlayer.getSource().clear();
			addfeaturepoint(data.data, vectorlayer)
		},
		error: function(xhr, type, errorThrown) {}
	})
	// var lnglats = [{
	// 	"name": "太原市",
	// 	"code": "1401",
	// 	"count": "1444",
	// 	"lng": "112.36145753825991",
	// 	"lat": "37.89639883185157",
	// 	"id": "1"
	// }, {
	// 	"name": "大同市",
	// 	"code": "1402",
	// 	"count": "5555",
	// 	"lng": "113.70540926959225",
	// 	"lat": "39.90067366817379",
	// 	"id": "1584"
	// }]

}

/**
 * @param {Object} lnglats  坐标组
 * @param {Object} vectorlayer  图层对象
 * @description 新增要素点
 */
function addfeaturepoint(lnglats, vectorlayer) {

	// 创建Feature对象集合
	var features_arr = new Array();
	for (var i = 0; i < lnglats.length; i++) {
		var item = lnglats[i];
		//初始化要素
		var iconFeature = new ol.Feature({
			//点要素
			geometry: new ol.geom.Point([item.lng, item.lat]),
			//名称属性
			name: item.name,
			// code
			code: item.code,
			//数量
			number: item.count,
			id: item.id
		});
		features_arr.push(iconFeature)
		//为点要素添加样式
		iconFeature.setStyle(setClusterStyle(iconFeature));
	}
	//初始化矢量数据源
	var vectorSource = new ol.source.Vector({
		//指定要素
		features: features_arr
	});
	vectorlayer.setSource(vectorSource);
}


/**
 * @param {Object} res 要素点信息
 */
function new_style(res) {
	//创建图标样式
	var text = res.values_.number;
	var datafeatures = {
		images: '../../images/ruralWater/juhe_red.png'
	}
	if (text <= 2000) {
		datafeatures.images = "../../images/ruralWater/juhe_green.png";
	} else if (text <= 4000) {
		datafeatures.images = "../../images/ruralWater/juhe_blue.png";
	} else if (text <= 6000) {
		datafeatures.images = "../../images/ruralWater/juhe_red.png";
	} else if (text <= 8000) {
		datafeatures.images = "../../images/ruralWater/juhe_pink.png";
	} else {
		datafeatures.images = "../../images/ruralWater/juhe_purple.png";
	}
	var iconStyle = new ol.style.Style({
		image: new ol.style.Icon({
			opacity: 0.75,
			src: datafeatures.images
		}),
		text: new ol.style.Text({
			font: '14px sans-serif',
			text: String(text),
			fill: new ol.style.Fill({
				color: "#ffffff"
			})
		})
	});

	return iconStyle;
}

//设置聚类样式
function setClusterStyle(res) {

	//创建图标样式
	var text = res.values_.number;
	var name = res.values_.name;
	var datafeatures = {
		images: '../../images/ruralWater/juhe_red.png',
		name: text,
		color: "#ffffff",
		offsetY: 0
	}
	if (text <= 1 || text == undefined) {
		datafeatures.images = "../../images/ruralWater/marker_blue.png";
		datafeatures.name = name;
		datafeatures.color = "#1f44ff";
		datafeatures.offsetY = 20;
	} else if (text <= 200) {
		datafeatures.images = "../../images/ruralWater/juhe_blue.png";
	} else if (text <= 400) {
		datafeatures.images = "../../images/ruralWater/juhe_blue.png";
	} else if (text <= 600) {
		datafeatures.images = "../../images/ruralWater/juhe_red.png";
	} else if (text <= 800) {
		datafeatures.images = "../../images/ruralWater/juhe_pink.png";
	} else {
		datafeatures.images = "../../images/ruralWater/juhe_purple.png";
	}
	var iconStyle = new ol.style.Style({
		image: new ol.style.Icon({
			opacity: 0.75,
			src: datafeatures.images
		}),
		text: new ol.style.Text({
			font: '14px sans-serif',
			text: String(datafeatures.name),
			fill: new ol.style.Fill({
				color: datafeatures.color
			}),
			offsetY: datafeatures.offsetY
		})
	});

	return iconStyle;

}

/**
 * @param {Object} nav 底部导航信息
 * @description 底部导航信息渲染
 */
function setInfodata(nav) {
	$("#info_dhxx").html(nav.navname);
	var dhxxli = "";
	nav.data.forEach(function(item, index) {
		dhxxli += `<li>${item.name}：${item.val}</li>`;
	})
	$("#info_dhxx_li").html(dhxxli);
}


function xiangqing(item_id) {
	var self = plus.webview.currentWebview();
	mui.openWindow({
		url: 'villageDetails.html', //通过URL传参
		id: 'villageDetails.html', //通过URL传参
		extras: {
			maptype: "map",
			item_id: item_id
		}
	})
};
// 地图信息 end

// 定位相关
var address_obj = "";
document.addEventListener('plusready', function() {
	plus.geolocation.getCurrentPosition(function(p) {
		console.log("位置信息：" + JSON.stringify(p));
		console.log("精确度：" + p.coords.accuracy);
		address_obj = p;
	}, function(e) {
		console.log('获取位置信息异常：' + e.message);
		plus.nativeUI.toast('获取位置信息异常：' + e.message);
	}, {
		enableHighAccuracy: true,
		timeout: 30000,
		provider: 'system',
		coordsType: 'wgs84',
		// provider:'baidu',
		// coordsType:'gcj02',
		geocode: true
	});
}, false);
//初始化覆盖层标注
function label_fun(lng, lat) {
	console.log(lng, lat)
	var Gps_position = GPS.gcj_encrypt(lat, lng);
	console.log(Gps_position.lon, Gps_position.lat);
	var address = [Gps_position.lon, Gps_position.lat];
	// var address = ol.proj.fromLonLat([112.58151542648,37.807917449949]);
	var marker = new ol.Overlay({
		//位置坐标
		position: address,
		//覆盖层如何与位置坐标匹配
		positioning: 'center-center',
		//覆盖层的元素
		element: document.getElementById('marker'), //ToDo 
		//事件传播到地图视点的时候是否应该停止
		stopEvent: false
	});
	//将覆盖层添加到map中
	map.addOverlay(marker);
	$("#marker").show();
	// map.getView().setCenter(address);
	// map.getView().setZoom(14);
	map.getView().animate({
		center: address
	}, {
		zoom: 13
	});
	plus.nativeUI.showWaiting("获取附近村信息");
	// 获取位置信息对应的村信息
	var _url = root + 'api/rural/positiontake';
	var token = localStorage.getItem("token");
	mui.ajax(_url, {
		data: {
			"token": token,
			"lng": lng, // 经度
			"lat": lat, // 纬度
			"unit": 3 //默认1 单位千米
		},
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			if (data.data == "") {
				plus.nativeUI.toast("暂无搜索结果");
				return false;
			}
			console.log("----------" + JSON.stringify(data));
			map_level = data.level;
			map_nav = data.nav;
			setInfodata(map_nav);
			// 清除要素点
			cityClusters.getSource().clear();

			var arr_set = data.data;
			var arr_new_set = [];
			arr_set.forEach(function(item, index) {
				var Gps_position = GPS.gcj_encrypt(item.lat, item.lng);
				var obj = {};
				obj.name = item.name;
				obj.code = item.code;
				obj.distance = item.distance;
				obj.unit = item.unit;
				obj.lng = Gps_position.lon;
				obj.lat = Gps_position.lat;
				arr_new_set.push(obj);
			})
			addfeaturepoint(arr_set, cityClusters)
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
}

// 定位相关 end


// 返回上一步操作
var map_history_record = [{
	type: 'reload'
}];

function backFun() {
	if (map_history_record.length > 1) {
		map_history_record.pop();
	}
	plus.nativeUI.showWaiting("加载中...");
	var location_info = map_history_record[(map_history_record.length - 1) < 0 ? 0 : (map_history_record.length - 1)];
	console.log(location_info);

	if (map_history_record.length > 1) {
		map_level = location_info.map_level;
	}
	var map = location_info.map;
	var info = location_info.info;
	var lnglat = location_info.lnglat;
	var vectorlayer = location_info.vectorlayer;
	var type = location_info.type;
	mapDataFun(map, info, lnglat, vectorlayer, type)
	console.log(map_level);
} // 返回上一步操作 end


// 获取基础geojson对应信息表
function getInformationFun(vectorLayer, str) {
	console.log(str);
	vectorLayer.getSource().clear();
	vectorLayer.setSource(
		new ol.source.Vector({
			url: '../../js/ruralWater/json/' + str + '.json', //从文件加载边界等地理信息
			// url: '../../js/ruralWater/shanxi.json', //从文件加载边界等地理信息
			// url: '../../js/ruralWater/boundary.json', //从文件加载边界等地理信息
			format: new ol.format.GeoJSON(),
			projection: 'EPSG:3857'
		})
	)
}
console.log("===----====-----====---===----====")

// 获取基础geojson对应信息表 end


// 河流的添加start
//加载geoserver的WMTS服务
var heliuSever = new ol.layer.Tile({
	source: new ol.source.WMTS({
		name: 'heliu-server',
		url: "http://gis.sxjicheng.cn:8081/freexserver/htc/service/wmts",
		layer: "group_sxriver",
		style: "",
		matrixSet: "EPSG:4326",
		format: "image/png",
		wrapX: true,
		tileGrid: new ol.tilegrid.WMTS({
			origin: ol.extent.getTopLeft(projectionExtent),
			resolutions: [0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125,
				0.02197265625, 0.010986328125,
				0.0054931640625, 0.00274658203125, 0.001373291015625, 0.0006866455078125,
				0.00034332275390625,
				0.000171661376953125, 8.58306884765625e-005, 4.291534423828125e-005,
				2.1457672119140625e-005
			],
			matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
		})
	}),
	visible: true,
	className: "heliu-server",
	projection: 'EPSG:4326'
})
map.addLayer(heliuSever);
// 河流的添加end
