var clickStr = mui.os.ios ? 'tap' : "click";
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
map.addLayer(vectorLayers);
/**
 * @description 添加layers图层添加灌区信息
 * @param {Object} new_url
 * @param {Object} new_name
 */
function addlayersFun(item){
	// point点，默认面，线信息
	if(item.datatype == "point"){
		$.ajaxSettings.async = false;// 设置getJson同步
		var geojsonObject = $.getJSON(item.jsonUrl,function(res){
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
				visible:item.visibility,
				// visible:false,
				className: item.name,
				projection: 'EPSG:4326'
			})
			map.addLayer(waterQualitylayers[item.name]);
		})
	}else if(item.datatype == "WMTS"){
		//加载geoserver的WMTS服务
		waterQualitylayers[item.name] = new ol.layer.Tile({
			
			source: new ol.source.WMTS({
				name: item.serverInfo.WMTS.layer,
				url: item.serverInfo.WMTS.url,
				layer: item.serverInfo.WMTS.layer,
				// name:"image_global_world",
				// url:"http://www.zhuoyukeji.cn:8081/freexserver/htc/service/wmts",
				// layer:"image_global_world",
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
			visible:item.visibility,
			// visible:false,
			className: item.name,
			// source: new ol.source.OSM(),
			projection: 'EPSG:4326'
		})
		map.addLayer(waterQualitylayers[item.name]);
	}else if(item.datatype == "WMS"){
		//加载geoserver的WMS服务
		waterQualitylayers[item.name] = new ol.layer.Tile({
			source : new ol.source.TileWMS({
				// 注意链接公司无线要在同一个局域网
				// url:"http://192.168.1.251:8088/freexserver/wms",
				// params: {'LAYERS': 'shuiligongcheng'},
				url: item.serverInfo.WMS.url,
				params: {'LAYERS': item.serverInfo.WMS.layers},
			}),
			visible:item.visibility,
			// visible:false,
			className: item.name,
			// source: new ol.source.OSM(),
			projection: 'EPSG:4326'
		})
		map.addLayer(waterQualitylayers[item.name]);
	}else if(item.datatype == "WFS"){
		waterQualitylayers[item.name] = new ol.layer.Vector({
			source: new ol.source.Vector({
				url: item.serverInfo.WFS.url, //从文件加载一级河流
				format: new ol.format.GeoJSON()
			}),
			visible:item.visibility,
			// visible:false,
			className: item.name,
			projection: 'EPSG:4326',
			// style: new ol.style.Style({
			// 	fill:new ol.style.Fill({
			// 		color:item.bgcolor,
			// 		width:item.width
			// 	}),
			// 	stroke: new ol.style.Stroke({
			// 		lineDash:item.lineDash||[],
			// 		color: item.color,
			// 		width:item.width
			// 	})
			// })
		});
		map.addLayer(waterQualitylayers[item.name]);
		
		// if(item.planeImg){
		// 	planeFun(item.name,item.planeImg,item)
		// }
	}else{
		waterQualitylayers[item.name] = new ol.layer.Vector({
			source: new ol.source.Vector({
				url: item.jsonUrl, //从文件加载一级河流
				format: new ol.format.GeoJSON()
			}),
			visible:item.visibility,
			// visible:false,
			className: item.name,
			projection: 'EPSG:4326',
			style: new ol.style.Style({
				fill:new ol.style.Fill({
					color:item.bgcolor,
					width:item.width
				}),
				stroke: new ol.style.Stroke({
					color: item.color,
					width:item.width
				})
			})
		});
		map.addLayer(waterQualitylayers[item.name]);
		
		if(item.planeImg){
			planeFun(item.name,item.planeImg,item)
		}
	}
}

//文字标注样式start
/**
 * @param {Object} feature
 * @description 创建标签的样式
 */
function point_set(feature) {
	var text = feature.values_.name;
	var item = feature.values_.item;
	var bgcoloor = null;
	var stroke = null;
	var fontSize = feature.values_.item.fontSize || 10;
	if(feature.values_.item.bgcolor && feature.values_.item.bgcolor != null){
		bgcoloor = new ol.style.Fill({
			color: feature.values_.item.bgcolor
		})
	}
	if(feature.values_.item.stroke && feature.values_.item.stroke != null){
		stroke = new ol.style.Stroke({
			color: feature.values_.item.stroke,
			width:feature.values_.item.stroke_width||1
		})
	}
	//返回一个样式
	if(item.images && item.images != undefined){
		var scale_p = item.width || 1
		var iconStyle = new ol.style.Style({
			image: new ol.style.Icon({
				opacity: 0.8,
				scale:scale_p,
				src: item.images
			})
			,text: new ol.style.Text({
				font: fontSize+'px sans-seri',
				text: String(text),
				fill: new ol.style.Fill({
					color: item.color
				}),
				textAlign:"left",
				// offsetY: 20,
				offsetX: 5
				,backgroundFill: bgcoloor,
				stroke: stroke
			})
		});
	}else{
		var iconStyle = new ol.style.Style({
			image: new ol.style.Circle({
				radius: item.width,
				scale:2,
				fill: new ol.style.Fill({
					color: item.color
				})
			})
			,text: new ol.style.Text({
				font: fontSize+'px sans-seri',
				text: String(text),
				fill: new ol.style.Fill({
					color: item.color
				}),
				textAlign:"left",
				// offsetY: 20,
				offsetX: 5
				,backgroundFill: bgcoloor,
				stroke: stroke
			})
			
		});
	}
	return iconStyle;
};
//文字标注样式end
var big_map_irrigated = [
	{
		type_id: ["managementObjects"],
		tname: "大型灌区",
		listshow: true,
		// datatype: "WMTS",
		datatype: "WFS",
		name: "shp_irrigation",
		visibility: true,
		fontSize: 14,
		bgcolor:"rgba(158,193,171,0.5)",
		color:"#297572",
		planeImg:"../../images/bg_map/gqxx4.png",
		serverInfo: {
			"WMTS": { 
				url: "http://gis.sxjicheng.cn:8081/freexserver/htc/service/wmts",
				// url:"http://www.zhuoyukeji.cn:8081/freexserver/htc/service/wmts",
				type: "WMTS",
				// layer: "shanxi山脉水系",
				layer: "shp_irrigation"
			},
			"WFS": {
				url: "http://gis.sxjicheng.cn:8081/freexserver/wfs?service=WFS&version=1.0.0&request=GetFeature&typename=shp_irrigation&outputFormat=application/json&srsname=EPSG:4326",
				type: "WFS",
				layer: "shp_irrigation"
			}
		}
	},
	{
		type_id: ["managementObjects"],
		tname: "大型灌区",
		listshow: true,
		datatype: "WMTS",
		// datatype: "WFS",
		name: "shp_irrigation2",
		visibility: true,
		fontSize: 14,
		bgcolor:"rgba(158,193,171,0.5)",
		color:"#297572",
		planeImg:"../../images/bg_map/gqxx4.png",
		serverInfo: {
			"WMTS": { 
				url: "http://gis.sxjicheng.cn:8081/freexserver/htc/service/wmts",
				// url:"http://www.zhuoyukeji.cn:8081/freexserver/htc/service/wmts",
				type: "WMTS",
				// layer: "shanxi山脉水系",
				layer: "shp_irrigation"
			},
			"WFS": {
				url: "http://gis.sxjicheng.cn:8081/freexserver/wfs?service=WFS&version=1.0.0&request=GetFeature&typename=shp_irrigation&outputFormat=application/json&srsname=EPSG:4326&bbox=110.8552664995167,35.2170464974118,114.48931872382224,40.053696037564016,EPSG:4326",
				type: "WFS",
				layer: "shp_irrigation"
			}
		}
	},
	{
		type_id: ["managementObjects"],
		tname: "河流",
		listshow: true,
		datatype: "WMTS",
		// datatype: "WFS",
		name: "heliu-server",
		visibility: true,
		fontSize: 14,
		serverInfo: {
			"WMTS": { 
				url: "http://gis.sxjicheng.cn:8081/freexserver/htc/service/wmts",
				// url:"http://www.zhuoyukeji.cn:8081/freexserver/htc/service/wmts",
				type: "WMTS",
				// layer: "shanxi山脉水系",
				layer: "group_sxriver"
			},
			"WFS": {
				url: "",
				type: "WFS",
				layer: ""
			}
		}
	},
]
var xiangqinParameter = {};
for (var i = 0; i < big_map_irrigated.length; i++) {
	addlayersFun(big_map_irrigated[i])
	xiangqinParameter[big_map_irrigated[i].name] = big_map_irrigated[i][big_map_irrigated[i].name]
}
console.log(JSON.stringify(xiangqinParameter));

// map.on('click', function(e) {
// 	//在点击时获取像素区域
// 	var pixel = map.getEventPixel(e.originalEvent);
// 	console.log(pixel);
// 	map.forEachFeatureAtPixel(e.pixel, function(feature, layersname) {
// 		var coodinate = e.coordinate;
// 		//设置弹出框内容，可以HTML自定义
// 		console.log(feature, layersname)
// 		// xiangqing(layersname.className_,feature.values_)
// 	});
	
// });

// 地图缩放监听
map.getView().on('change:resolution', function(){
	// 重新设置图标的缩放率，基于层级20来做缩放
	console.log("地图等级"+map.getView().getZoom());
})
	

//山西边界
var shanxiBoundary = new ol.layer.Vector({
	source: new ol.source.Vector({
		url: '../../js/ruralWater/shanxi.json', //从文件加载边界等地理信息
		format: new ol.format.GeoJSON(),
	}),
	style: new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: "#8E9391"
		})
	}),
	className: "shanxi_boundary",
	projection: 'EPSG:4326'
});

map.on(clickStr, function(e) {
	var pixel = map.getEventPixel(e.originalEvent);
	map.forEachFeatureAtPixel(pixel, function(feature, layers_name) {
		if (layers_name.className_ == "shp_irrigation") {
			var item_info = feature.values_;
			// console.log(item_info)
			console.log(item_info.layer)
			console.log(item_info.name)
			xiangqing(item_info.layer,item_info);
		}else{
			
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
	// jc_info_fun();
	// plus.nativeUI.showWaiting("数据加载中...");
});


function jc_info_fun() {
	var _url = root + 'api/v2/hydropower_station/map';
	mui.ajax(_url, {
		data: {
			"token": token,
		},
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			// console.log("----------" + JSON.stringify(data));
		},
		error: function(xhr, type, errorThrown) {
			console.log('error')
		}
	})
}
// 基础信息 end

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
// 详情方法
function xiangqing(classname,id) {
	console.log(classname,id)
	switch (classname) {
		// case "bzyhgq"://北赵引黄灌区
		// 	jump_xiangqing(1, 9)
		// 	break;
		// case "ctgq"://册田灌区
		// 	jump_xiangqing(1, 3)
		// 	break;
		// case "dydgq"://大禹渡灌区
		// 	jump_xiangqing(1, 8)
		// 	break;
		// case "fhgq"://汾河灌区
		// 	jump_xiangqing(1, 2)
		// 	break;
		// case "jmkgqh"://夹马口灌区
		// 	jump_xiangqing(1, 7)
		// 	break;
		// case "sghgq"://桑干河灌区
		// 	jump_xiangqing(1, 4)
		// 	break;
		// case "wyhgq"://文峪河灌区
		// 	jump_xiangqing(1, 12)
		// 	break;
		// case "xhgq"://潇河灌区
		// 	jump_xiangqing(1, 5)
		// 	break;
		// case "ycszcyhgq"://尊村引黄灌区
		// 	jump_xiangqing(1, 6)
		// 	break;
		// case "ymkgq"://禹门口灌区
		// 	jump_xiangqing(1, 1)
		// 	break;
		// case "fxgq"://汾西灌区
		// 	jump_xiangqing(1, 11)
		// 	break;
		// case "hthgq"://滹沱河灌区
		// 	jump_xiangqing(1, 10)
		// 	break;
		// case "icon_zxgq"://中型灌区
		// 	jump_xiangqing(2, id)
		// 	break;
		case "bzyhgq"://北赵引黄灌区
			jump_xiangqing(1, 9)
			break;
		case "ctgq"://册田灌区
			jump_xiangqing(1, 3)
			break;
		case "dydgq"://大禹渡灌区
			jump_xiangqing(1, 8)
			break;
		case "fhgq"://汾河灌区
			jump_xiangqing(1, 2)
			break;
		case "jmkgqh"://夹马口灌区
			jump_xiangqing(1, 7)
			break;
		case "sghgq"://桑干河灌区
			jump_xiangqing(1, 4)
			break;
		case "wyhgq"://文峪河灌区
			jump_xiangqing(1, 12)
			break;
		case "xhgq"://潇河灌区
			jump_xiangqing(1, 5)
			break;
		case "ycszcyhgq"://尊村引黄灌区
			jump_xiangqing(1, 6)
			break;
		case "ymkgq"://禹门口灌区
			jump_xiangqing(1, 1)
			break;
		case "fxgq"://汾西灌区
			jump_xiangqing(1, 11)
			break;
		case "hthgq"://滹沱河灌区
			jump_xiangqing(1, 10)
			break;
		case "icon_zxgq"://中型灌区
			jump_xiangqing(2, id)
			break;
		default:
			break;
	}
};
function jump_xiangqing(typeId, id) {
	var self = plus.webview.currentWebview();
	var url = '';
	console.log(typeId);
	var params = {
			item_id: id
		};
	switch (typeId) {
		case 1://大型灌区详情
			console.log('typeId=1');
			url = '/pages/irrigated/searchDetails.html';
			params = {
				item_id: id,
				type: 'big_irrigatedArea'
			};
			break;
		case 2://中型灌区详情
			url = '/pages/irrigated/searchDetails.html';
			params = {
				item_id: id,
				type: 'query_irrigatedArea'
			};
			break;
		default:
			break;
	}
	mui.openWindow({
		url: url, //通过URL传参
		id: url, //通过URL传参
		extras: params
	});
};
// 地图信息 end




// 管理对象显示隐藏
$("body").on(clickStr,".nav_ul_box .isShow",function(){
	var objItem = $(this).attr("data-type");
	console.log(objItem)
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
$("body").on(clickStr,".list_ul .list_li",function(e){
	e.stopPropagation();
	e.preventDefault();
	if($(this).hasClass("active")){
		$(this).removeClass("active");
	}else{
		$(this).addClass("active")
	}
	isLayers($(this))
})
// 点击隐藏信息
$("body").on(clickStr,".list_box",function(){
	event.stopPropagation();
	event.preventDefault();
	$(this).removeClass("active");
	$(".nav_ul_box .nav_li_item").removeClass("active");
})
// 控制显示隐藏「
function isLayers(that){
	// var item = $(".list_obj .list_ul .list_li");
	// for (var i = 0; i < item.length; i++) {
		var activeStatus = that.hasClass("active");
		var itemQname = that.attr("data-qname");
		// var itemType = that.attr("data-type");
		var itemId = that.attr("data-id");
		console.log(itemQname)
		if(activeStatus){
			// console.log(waterQualitylayers[itemQname]);
			if(waterQualitylayers[itemQname] != undefined){
				waterQualitylayers[itemQname].setVisible(true)
			}else{
				plus.nativeUI.showWaiting("数据加载中...");
				jc_info_fun(itemId,itemQname);
			}
		}else{
			if(waterQualitylayers[itemQname] != undefined){
				waterQualitylayers[itemQname].setVisible(false)
			}
		}
	// }
}


/**
 * @description // 设置面的背景图
 * @param {Object} name
 * @param {Object} planeImg
 */
function planeFun(name,planeImg,item){ //"../../images/bg_map/cs2.png"
	if(!planeImg){return false}
	var cnv = document.createElement('canvas');
	var ctx = cnv.getContext('2d');
	var img = new Image();
	img.src = planeImg;
	if(item.width && item.width >0){
		var stroke = new ol.style.Stroke({
					lineDash:item.lineDash||[],
					color: item.color,
					width:item.width
				})
	}else{
		var stroke = null;
	}
	
	img.onload = function () {
		var pattern = ctx.createPattern(img, 'repeat');
		waterQualitylayers[name].setStyle(new ol.style.Style({
			fill: new ol.style.Fill({
				color: pattern
			}),
			stroke : stroke
		}));
	};
}


