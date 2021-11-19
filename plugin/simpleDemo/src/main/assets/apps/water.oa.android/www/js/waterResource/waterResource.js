
// 地图信息
var map = null;
var projection = ol.proj.get("EPSG:4326"); //4326坐标
var projectionExtent = projection.getExtent();
var size = ol.extent.getWidth(projectionExtent) / 256;
var resolutions = [];
for (var z = 0; z < 16; ++z) {
	resolutions[z] = size / Math.pow(2, z);
}
	//地理坐标
	var center = [112.6, 37.9];
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
	// 	source : new ol.source.TileArcGISRest({
	// 		url: "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunity_Mobile/MapServer"
	// 	}),
	// 	projection: 'EPSG:4326'
	// })
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


var layers = [TileWMSLayer,vectorLayers];
//初始化地图
map = new ol.Map({
	interactions: ol.interaction.defaults({
		pinchRotate: false // 移动端禁止地图旋转
	}),
	layers: layers,
	target: 'map',
	view: new ol.View({
		projection: projection,
		center: ol.proj.transform(center, 'EPSG:4326', 'EPSG:4326'),
		zoom: 6.7,
		maxZoom: 16,
		minZoom: 0
	})
});
/**
 * @description 添加layers图层添加灌区信息
 * @param {Object} new_url
 * @param {Object} new_name
 */
// function addlayersFun(new_url,new_name){
// 	var newLayer = new ol.layer.Vector({
// 		source: new ol.source.Vector({
// 			url:new_url,//从文件加载一级河流
// 			format: new ol.format.GeoJSON()
// 		}),
// 		visibility:true,
// 		className: new_name,
// 		projection: 'EPSG:3857',
// 		style:new ol.style.Style({
// 			fill:new ol.style.Fill({
// 				color:"rgba(183,197,172,0.8)"
// 			}),
// 			stroke:new ol.style.Stroke({
// 				color:"#24B963"
// 			})
// 		})
// 	});
// 	map.addLayer(newLayer);
// }
// var big_map_irrigated = [
// 	// {url:"../../js/ruralWater/json/ymkguanqu.json",name:"ymkguanqu"},
// 	// {url:"../../js/ruralWater/json/beizhaoguanqu_mian.json",name:"beizhaoguanqu"},
// 	{url:"../../js/ruralWater/irrigated_big_map/bzyhgq.json",name:"bzyhgq",bzyhgq:9,CNname:"北赵引黄灌区"},
// 	{url:"../../js/ruralWater/irrigated_big_map/ctgq.json",name:"ctgq",ctgq:3,CNname:"册田灌区"},
// 	{url:"../../js/ruralWater/irrigated_big_map/dydgq.json",name:"dydgq",dydgq:8,CNname:"大禹渡灌区"},
// 	{url:"../../js/ruralWater/irrigated_big_map/fhgq.json",name:"fhgq",fhgq:2,CNname:"汾河灌区"},
// 	{url:"../../js/ruralWater/irrigated_big_map/fxgq.json",name:"fxgq",fxgq:11,CNname:"汾西灌区"},
// 	{url:"../../js/ruralWater/irrigated_big_map/hthgq.json",name:"hthgq",hthgq:10,CNname:"滹沱河灌区"},
// 	{url:"../../js/ruralWater/irrigated_big_map/jmkgqh.json",name:"jmkgq",jmkgq:7,CNname:"夹马口灌区"},
// 	// {url:"../../js/ruralWater/irrigated_big_map/jmkgqjsgkjgcgq.json",name:"jmkgqjsgkjgcgq",jmkgqjsgkjgcgq:9,CNname:"夹马口灌区节水改扩建工程灌区"},
// 	{url:"../../js/ruralWater/irrigated_big_map/sghgq.json",name:"sghgq",sghgq:4,CNname:"桑干河灌区"},
// 	{url:"../../js/ruralWater/irrigated_big_map/wyhgq.json",name:"wyhgq",wyhgq:12,CNname:"文峪河灌区"},
// 	{url:"../../js/ruralWater/irrigated_big_map/xhgq.json",name:"xhgq",xhgq:5,CNname:"潇河灌区"},
// 	{url:"../../js/ruralWater/irrigated_big_map/ymkgq.json",name:"ymkgq",ymkgq:1,CNname:"禹门口灌区"},
// 	{url:"../../js/ruralWater/irrigated_big_map/ycszcyhgq.json",name:"ycszcyhgq",ycszcyhgq:6,CNname:"运城市尊村引黄灌区"}
// ]
// var xiangqinParameter = {};
// for (var i = 0; i < big_map_irrigated.length; i++) {
// 	addlayersFun(big_map_irrigated[i].url,big_map_irrigated[i].name)
// 	xiangqinParameter[big_map_irrigated[i].name] = big_map_irrigated[i][big_map_irrigated[i].name]
// }
// console.log(JSON.stringify(xiangqinParameter));

map.on("click", function(e) {
	var pixel = map.getEventPixel(e.originalEvent);
	console.log(pixel);
	map.forEachFeatureAtPixel(pixel, function(feature, vectorlayer) {
		if (vectorlayer.className_ == "feature") {
			var item_info = feature.values_;
			console.log(JSON.stringify(item_info));
		} else {
			console.log(vectorlayer.className_);
			console.log(e.coordinate);
		}
		//点击图片标注跳转
		// xiangqing(xiangqinParameter[vectorlayer.className_])
	})
})

// ------标注start
/**
 * @param {string} text value值
 * @param {number} rotate  旋转角度
 */
//标注标签
function canalName(value,values) {
    var text = document.createElement('div');
	text.setAttribute('class','map_mark');
	var box1 = document.createElement('div');
	box1.innerText = value;
	if(value == '太原市'){
		box1.style.color = '#8B4407'
	}
	var box2 = document.createElement('div');
	box2.setAttribute('class','map_line');
	var box3 = document.createElement('div');
	box3.innerText = values;
	box3.setAttribute('class','map_num');
	text.appendChild(box1);
	text.appendChild(box2);
	text.appendChild(box3);
    return text;
}
// 标注数据
addTextLabel(map,textLabelArr);
/**
 * @param {Object} map map对象
 * @param {Object} obj 数据源
 */
function addTextLabel(map,obj){
	
	for (var i = 0; i < obj.length; i++) {
		var item = obj[i];
		// console.log(item.value);
		var popup = new ol.Overlay({
			position: [item.lat,item.lng],
			positioning: 'center-center',
			element: canalName(item.value,item.values),
			stopEvent: false
		})
		map.addOverlay(popup)
	}
}
// ------标注end
// ------图片标注start
//矢量标注的数据源
var vectorSource1 = new ol.source.Vector({
	features: [new ol.Feature()]
});
//矢量标注图层
vectorLayer1 = new ol.layer.Vector({
	visible: true,
	source: vectorSource1
});
map.addLayer(vectorLayer1);
marks(textLabelArr);
var longitude = latitude = null;
function marks(objs){
	for(var i=0;i<objs.length;i++){
		var photo = objs[i];
		//新建一个要素ol.Feature
		var newFeature1 = new ol.Feature({
			geometry: new ol.geom.Point([objs[i].lat,objs[i].lng]), //几何信息
		});
		newFeature1.setStyle(new ol.style.Style({
			image: new ol.style.Icon({
				anchor: [2.7, 20], //锚点
				anchorXUnits: 'fraction', //锚点X值单位
				anchorYUnits: 'pixels', //锚点Y值单位
				opacity: 0.9,
				scale: 0.7,
				src: '../../images/riverChief/mark_img.png' //图标的URL
			})
		}));
		vectorSource1.addFeature(newFeature1);
	}
	
}
// ------图片标注end
// 地图缩放监听
map.getView().on('change:resolution', function(){
	// 重新设置图标的缩放率，基于层级20来做缩放
	console.log("地图等级"+map.getView().getZoom());
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
	// jc_info_fun();
	// plus.nativeUI.showWaiting("数据加载中...");
});


// function jc_info_fun() {
// 	var _url = root + 'api/v2/hydropower_station/map';
// 	mui.ajax(_url, {
// 		data: {
// 			"token": token,
// 		},
// 		datatype: 'json', //服务器返回json格式数据
// 		type: 'post', //HTTP请求类型
// 		success: function(data) {
// 			plus.nativeUI.closeWaiting();
// 			// console.log("----------" + JSON.stringify(data));
// 		},
// 		error: function(xhr, type, errorThrown) {
// 			console.log('error')
// 		}
// 	})
// }
// 基础信息 end

//点击图片标注跳转
// function xiangqing(item_id) {
// 	if (!item_id || item_id == null || item_id == undefined) {
// 		console.log(item_id);
// 		console.log("基础信息错误");
// 		return false;
// 	}
// 	var self = plus.webview.currentWebview();
// 	mui.openWindow({
// 		url: 'searchDetails.html', //通过URL传参
// 		id: 'searchDetails.html', //通过URL传参
// 		extras: {
// 			item_id: item_id,
// 			type:"big_irrigatedArea"
// 		}
// 	})
// };
// 地图信息 end

	


