
//加载天地图的WMTS服务
var projection = ol.proj.get("EPSG:4326");
var projectionExtent = projection.getExtent();
var size = ol.extent.getWidth(projectionExtent) / 256;
var resolutions = [];
for (var z = 2; z < 19; ++z) {
	resolutions[z] = size / Math.pow(2, z);
}


//加载geoserver的WMS服务
// var TileWMSLayer = new ol.layer.Tile({
// 	source : new ol.source.TileArcGISRest({
// 		url: "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunity_Mobile/MapServer"
// 	}),
// 	projection: 'EPSG:4326'
// })
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

//山西边界
var shanxiBoundary = new ol.layer.Vector({
	source: new ol.source.Vector({
		url: '../../js/ruralWater/shanxi.json', //从文件加载边界等地理信息
		format: new ol.format.GeoJSON(),
		
	}),
	style: new ol.style.Style({
		fill:new ol.style.Fill({
			color:"rgba(255,255,255,0.5)"
		}),
		stroke: new ol.style.Stroke({
			color: "#ffa300",
			width:3
		})
	}),
	className: "shanxi_boundary",
	projection: 'EPSG:4326'
});
var waterQualitylayers = {}
//整个地图
var map = new ol.Map({
	interactions: ol.interaction.defaults({
		pinchRotate: false // 移动端禁止地图旋转
	}),
	layers: [TileWMSLayer,shanxiBoundary],
	target: 'map',
	view: new ol.View({
		center: [112.557029,37.872418],
		projection: projection,
		zoom: 6.8,
		maxZoom: 17,
		minZoom: 1
	})
});

// 管理对象显示隐藏
$("body").on("click",".nav_ul_box .isShow",function(){
	var objItem = $(this).attr("data-type");
	if(objItem && objItem !== undefined){
		if($(this).hasClass("active")){
			$("#"+objItem).removeClass("active")
			$(this).removeClass("active")
		}else{
			$("#"+objItem).addClass("active")
			$(this).addClass("active")
		}
	}
})
// 是否选中管理对象
$("body").on("click",".list_ul .list_li",function(e){
	e.stopPropagation();
	e.preventDefault();
	if($(this).hasClass("active")){
		$(this).removeClass("active");
	}else{
		$(this).addClass("active")
	}
	isLayers()
})
// 点击隐藏信息
$("body").on("click",".list_box",function(){
	event.stopPropagation();
	event.preventDefault();
	$(this).removeClass("active");
	$(".nav_ul_box .nav_li_item").removeClass("active");
})


// 添加河流信息
function waterQuality(item){
	// 一级河流
	if(item.datatype == "point"){
		$.ajaxSettings.async = false;// 设置getJson同步
		var geojsonObject = $.getJSON(item.jsonUrl,function(res){
			console.log(JSON.stringify(res));
			var vectorSource = new ol.source.Vector({});
			for (var i = 0; i < res.features.length; i++) {
				var item_info = res.features[i];
				var feature = new ol.Feature({
					geometry: new ol.geom.Point(item_info.geometry.coordinates),
					name: item_info.properties.name,
					item: item,
					item_info: item_info
				});
				vectorSource.addFeature(feature);
				//为点要素添加样式
				feature.setStyle(point_set(feature));
			}
			
			waterQualitylayers[item.name] = new ol.layer.Vector({
				source: vectorSource,
				visibility:item.visibility,
				className: item.name,
				projection: 'EPSG:4326'
			})
			map.addLayer(waterQualitylayers[item.name]);
		})
	}else{
		waterQualitylayers[item.name] = new ol.layer.Vector({
			source: new ol.source.Vector({
				url: item.jsonUrl, //从文件加载一级河流
				format: new ol.format.GeoJSON()
			}),
			visibility:item.visibility,
			className: item.name,
			projection: 'EPSG:4326',
			style: new ol.style.Style({
				fill:new ol.style.Fill({
					color:item.color,
					width:item.width
				}),
				stroke: new ol.style.Stroke({
					color: item.color,
					width:item.width
				})
			})
		});
		map.addLayer(waterQualitylayers[item.name]);
	}	
}
/**
 * @param {Object} feature
 * @description 创建标签的样式
 */
function point_set(feature) {
	var text = feature.values_.name;
	var item = feature.values_.item;
	//返回一个样式
	console.log(JSON.stringify(feature))
	var iconStyle = new ol.style.Style({
		image: new ol.style.Circle({
			radius: item.width,
			scale:2,
			fill: new ol.style.Fill({
				color: item.color
			})
		})
		,text: new ol.style.Text({
			font: '10px sans-seri',
			text: String(text),
			fill: new ol.style.Fill({
				color: item.color
			}),
			textAlign:"left",
			// offsetY: 20,
			offsetX: 5
		})
	});
	return iconStyle;
};

// 山西大水网总信息
var layersInfo =[
	
	{name:"big_water_network_1",tname:"大水网供水区1",visibility:true,color:"#FFFFCB",jsonUrl:"../../js/shanxi_water_network/layers_json/big_water_network_1.json"},
	{name:"big_water_network_2",tname:"大水网供水区2",visibility:true,color:"#FFE7FF",jsonUrl:"../../js/shanxi_water_network/layers_json/big_water_network_2.json"},
	{name:"big_water_network_3",tname:"大水网供水区3",visibility:true,color:"#E5F8FF",jsonUrl:"../../js/shanxi_water_network/layers_json/big_water_network_3.json"},
	{name:"big_water_network_4",tname:"大水网供水区4",visibility:true,color:"#F0FFE0",jsonUrl:"../../js/shanxi_water_network/layers_json/big_water_network_4.json"},
	// {name:"fanghongzhongdian",tname:"山洪地质灾害高发区及防御重点区域",visibility:true,color:"#ff00ff",jsonUrl:"../../js/shanxi_water_network/layers_json/fanghongzhongdian.json"},
	// {name:"fanghong",tname:"山洪灾害易发区",visibility:true,color:"#ff00ff",jsonUrl:"../../js/shanxi_water_network/layers_json/fanghong.json"},
	{name:"backbone_water_supply",tname:"骨干供水工程",visibility:true,color:"#FC0203",jsonUrl:"../../js/shanxi_water_network/layers_json/backbone_water_supply.json"},
	{name:"karst_spring",tname:"岩溶大泉供水工程",visibility:true,color:"#0DFC0E",jsonUrl:"../../js/shanxi_water_network/layers_json/karst_spring.json"},
	{name:"tow_vertical_and_ten_horizontal_water_network",tname:"两纵十横水网",width:5,visibility:true,color:"#0DFC0E",jsonUrl:"../../js/shanxi_water_network/layers_json/tow_vertical_and_ten_horizontal_water_network.json"},
	{name:"rivers_level1",tname:"一级河流",width:2,visibility:true,color:"#0086FD",jsonUrl:"../../js/waterQuality/rivers/rivers_level1.json"},
	{name:"rivers_level2",tname:"二级河流",width:2,visibility:true,color:"#0086FD",jsonUrl:"../../js/waterQuality/rivers/rivers_level2.json"},
	{name:"rivers_level3",tname:"三级河流",width:2,visibility:true,color:"#0086FD",jsonUrl:"../../js/waterQuality/rivers/rivers_level3.json"},
	{name:"rivers_level4",tname:"四级河流",visibility:true,color:"#0086FD",jsonUrl:"../../js/waterQuality/rivers/rivers_level4.json"},
	// {name:"spring_water",datatype:"point",tname:"泉水",width:5,visibility:true,color:"#0086ff",jsonUrl:"../../js/shanxi_water_network/layers_json/spring_water.json"},
	{name:"emergency_water_source",datatype:"point",tname:"应急水源供水工程",width:5,visibility:true,color:"#fe0000",jsonUrl:"../../js/shanxi_water_network/layers_json/emergency_water_source.json"}
];
for (var i = 0; i < layersInfo.length; i++) {
	waterQuality(layersInfo[i])
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
	
});


// 地图信息 end


// 坐标组
/**
 * @param {Object} feature
 * @description 创建标签的样式
 */
function iconStyle_set(feature) {
	var text = feature.values_.name;
	var images = "./../../images/waterQuality/icon_red.png";
	
	//返回一个样式
	var iconStyle = new ol.style.Style({
		image: new ol.style.Icon({
			opacity: 0.8,
			src: images
		}),
		text: new ol.style.Text({
			font: '12px sans-seri',
			text: String(text),
			fill: new ol.style.Fill({
				color: "#2EA2F5"
			}),
			offsetY: 20,
			backgroundFill: new ol.style.Fill({
				color: '#ffffff'
			})
		})
	});
	
	return iconStyle;
};

// 控制显示隐藏「
function isLayers(){
	var item = $(".list_obj .list_ul .list_li");
	for (var i = 0; i < item.length; i++) {
		var activeStatus = item.eq(i).hasClass("active");
		var itemQname = item.eq(i).attr("data-qname");
		var itemType = item.eq(i).attr("data-type");
		if(activeStatus){
			if(itemType == "quality"){
				waterQualitylayers[itemQname].setVisible(true)
			}else if(itemType == "qdata"){
				cityClusters.setVisible(true);
			}else{
				console.log("未知类型itemType="+itemType+";itemQname="+itemQname);
			}
		}else{
			if(itemType == "quality"){
				waterQualitylayers[itemQname].setVisible(false)
			}else if(itemType == "qdata"){
				cityClusters.setVisible(false);
			}else{
				console.log("未知类型itemType="+itemType+";itemQname="+itemQname);
			}
		}
	}
}
// isLayers();

