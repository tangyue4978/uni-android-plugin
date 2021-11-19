var clickStr = mui.os.ios ? 'tap' : "click";

// 管理对象显示隐藏
$("body").on(clickStr, ".nav_ul_box .isShow", function() {
	var objItem = $(this).attr("data-type");
	console.log(objItem);
	if (objItem && objItem !== undefined) {
		if ($(this).hasClass("active")) {
			$("#" + objItem).removeClass("active")
			$(this).removeClass("active")
		} else {
			$(".nav_ul_box .isShow").removeClass("active");
			$(".mapBox .list_box").removeClass("active");
			$("#" + objItem).addClass("active")
			$(this).addClass("active")
		}
	}
	// allIsLayers(false);//切换选项卡隐藏所有图层
	// isLayers(objItem);//显示当前选项卡下图层
})
// 是否选中管理对象
$("body").on(clickStr, ".list_ul .list_li", function(e) {
	e.stopPropagation();
	e.preventDefault();
	if ($(this).hasClass("active")) {
		$(this).removeClass("active");
	} else {
		$(this).addClass("active")
	}
	isLayers($(this))
})
// 点击隐藏信息
$("body").on(clickStr, ".list_box", function() {
	event.stopPropagation();
	event.preventDefault();
	$(this).removeClass("active");
	$(".nav_ul_box .nav_li_item").removeClass("active");
})


// 添加河流信息
function waterQuality(item) {
	// 一级河流
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

/**
 * @description 添加list信息向dom节点追加数据
 * @param {Object} addobj
 */
function addlist(addobj) {
	// <li class="list_li">机井</li>
	addobj.type_id.forEach(function(item, index) {
		console.log(item, index);
		var isshow = addobj.visibility ? " active" : " ";
		var img = addobj.images ? '<img class="icon_img" src="' + addobj.images + '" >' : "";
		$("#" + item + " .list_ul").append('<li class="list_li ' + isshow + '" data-index="' + addobj.index +
			'" data-qname="' + addobj.name + '" data-type="' + addobj.datatype + '">' + img + addobj.tname + '</li>')
	})
}

/**
 * @param {Object} feature
 * @description 创建标签的样式
 */
function point_set(feature) {
	var text = feature.values_.name;
	var item = feature.values_.item;
	var stroke = null;
	if(feature.values_.item.stroke && feature.values_.item.stroke != null){
		stroke = new ol.style.Stroke({
			color: feature.values_.item.stroke,
			width:feature.values_.item.stroke_width||1
		})
	}
	//返回一个样式
	// console.log(JSON.stringify(feature))
	if (item.images && item.images != undefined) {
		var scale_p = item.width || 1
		var iconStyle = new ol.style.Style({
			image: new ol.style.Icon({
				opacity: 0.8,
				scale: scale_p,
				src: item.images
			}),
			text: new ol.style.Text({
				font: '10px sans-seri',
				text: String(text),
				fill: new ol.style.Fill({
					color: item.color
				}),
				textAlign: "left",
				// offsetY: 20,
				offsetX: 5,
				stroke: stroke
			})
		});
	} else {
		var iconStyle = new ol.style.Style({
			image: new ol.style.Circle({
				radius: item.width,
				scale: 2,
				fill: new ol.style.Fill({
					color: item.color
				})
			}),
			text: new ol.style.Text({
				font: '14px sans-seri',
				text: String(text),
				fill: new ol.style.Fill({
					color: item.color
				}),
				textAlign: "left",
				// offsetY: 20,
				offsetX: 5,
				stroke: stroke
			})
		});
	}
	return iconStyle;
};

// 山西大水网总信息
var layersInfo = [
	{type_id:["bigwaternetwork"],tname:"山西边界",listshow:false,name:"shanxiBoundary1",width:1,visibility:true,bgcolor:"rgba(255,255,255,0)",color:"#aaaaaa",jsonUrl:"../../js/ruralWater/shanxi.json"},
	//{type_id:["bigwaternetwork"],tname:"山西河流",listshow:false,images:"../../images/big_water_network/icon-11-sjhl.png",name:"rivers_big_sxhl",width:1,visibility:true,bgcolor:"rgba(255,255,255,0)",color:"#BFE9FF",jsonUrl:"../../js/ruralWater/json/shanxi_river.json"},
	{
		type_id: ["managementObjects"],
		tname: "山西边界",
		listshow: true,
		datatype: "WMTS",
		name: "shanxi_shen",
		visibility: true,
		fontSize: 14,
		serverInfo: {
			"WMTS": { 
				url: "http://gis.sxjicheng.cn:8081/freexserver/htc/service/wmts",
				type: "WMTS",
				layer: "line_pink"
			},
			"WFS": {
				url: "",
				type: "WFS",
				layer: ""
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
	{
		type_id: ["managementObjects"],
		tname: "大型灌区",
		listshow: true,
		// datatype: "WMTS",
		datatype: "WFS",
		name: "shp_irrigation",
		visibility: false,
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
		visibility: false,
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
	{type_id:["managementObjects"],tname:"千人以上供水工程",apiUrl:"api/v3/supply_project_information/index",apitype:0,listshow:true,images:"../../images/big_water_network/icon-15.png",name:"icon_15",datatype:"point",width:0.6,visibility:false,color:"#ff9900"},
	{type_id:["managementObjects"],tname:"千吨万人供水工程",apiUrl:"api/v3/supply_project_information/thousands_people_tons",apitype:0,listshow:true,images:"../../images/big_water_network/icon-16.png",name:"icon_16",datatype:"point",width:0.6,visibility:false,color:"#ff9900"},
	{type_id:["managementObjects"],tname:"水电站",apiUrl:"api/v3/hydropower_station/map",apitype:0,listshow:true,images:"../../images/big_water_network/icon-17.png",name:"icon_17",datatype:"point",width:0.6,visibility:false,color:"#ff9900"},
	{type_id:["managementObjects"],tname:"泵站",apiUrl:"api/v4/water_gate_pump/pump",apitype:0,listshow:true,images:"../../images/big_water_network/icon-23.png",name:"icon_23",datatype:"point",width:0.6,visibility:false,color:"#ff9900"},
	{type_id:["managementObjects"],tname:"水闸",apiUrl:"api/v4/water_gate_pump/gate",apitype:0,listshow:true,images:"../../images/big_water_network/icon-24.png",name:"icon_24",datatype:"point",width:0.6,visibility:false,color:"#ff9900"},
];
for (var i = 0; i < layersInfo.length; i++) {
	// 添加shp文件信息
	waterQuality(layersInfo[i])

}

// 获取基础信息
var root = localStorage.getItem("str_url");
// if (root == "" || root == undefined || root == null) {
// 	mui.openWindow({
// 		url: 'login.html?cid=1', //通过URL传参
// 		id: 'login.html?cid=1', //通过URL传参
// 	})
// }
var token = localStorage.getItem("token");
mui.plusReady(function() {
	// jc_info_fun(3, "gsp")
});


// 地图信息 end



// 控制显示隐藏「
function isLayers(that) {
	// var item = $(".list_obj .list_ul .list_li");
	// for (var i = 0; i < item.length; i++) {
	var activeStatus = that.hasClass("active");
	var itemQname = that.attr("data-qname").split(",");
	var dataId = that.attr("data-id");
	var dataUrl = that.attr("data-url");
	var itemId = dataId ? dataId.split(",") : '';
	if (activeStatus) {
		// console.log(waterQualitylayers[itemQname]);
		for (var i = 0; i < itemQname.length; i++) {
			if (waterQualitylayers[itemQname[i]] != undefined) {
				waterQualitylayers[itemQname[i]].setVisible(true);
			} else {
				plus.nativeUI.showWaiting("数据加载中...");
				jc_info_fun(itemId[i],dataUrl ,itemQname[i]);
			}
		}

	} else {
		for (var i = 0; i < itemQname.length; i++) {
			if (waterQualitylayers[itemQname[i]] != undefined) {
				waterQualitylayers[itemQname[i]].setVisible(false)
			}
		}
	}
	// }
}


var map_level = "";
//取用水户列表api
function jc_info_fun(type,url,layersname) {
	console.log(type);
	var root = localStorage.getItem("str_url");
	var token = localStorage.getItem("token");
	
	var _url = root + url;
	var new_header = {
			"token": token,
			"type": type,
			"map_level":"7",
			"center_lon":"112.557029", 
			"center_lat":"37.872418"
		}
	console.log(_url)
	mui.ajax(_url, {
		data: new_header,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			console.log("----------" + JSON.stringify(data));
			if (data.data == "") {
				plus.nativeUI.toast("暂无搜索结果");
				return false;
			}
			if(layersname == "zhirancun"){
				map_level = data.level;
				map_nav = data.nav;
				city_dian_fun_zhirancun(data.data,"zhirancun");
			}else if(layersname == "zxgq" || layersname == "icon_23" || layersname == "icon_24"){
				resetCZ()
				city_dian_fun(data.data.data, layersname);
			}else{
				resetCZ()
				city_dian_fun(data.data, layersname);
			}
			
		},
		error: function(xhr, type, errorThrown) {
			console.log('error')
			plus.nativeUI.closeWaiting();
			plus.nativeUI.toast("网络不稳定，请检查网络");
		}
	})
}
// 基础信息 end


function resetCZ() {
    map.getView().setCenter(map_info_obj.center);
    map.getView().setZoom(map_info_obj.zoom);
}


// 点的位置
function city_dian_fun(arr, layername) {
	var vectorSource = new ol.source.Vector({});
	var pointArr = arr;
	console.log(JSON.stringify(pointArr));
	for (var i = 0; i < pointArr.length; i++) {
		var item_info = pointArr[i];
		var feature = new ol.Feature({
			geometry: new ol.geom.Point([item_info.lng, item_info.lat]),
			name: item_info.name,
			item: item_info
		});
		vectorSource.addFeature(feature);

		//为点要素添加样式
		// feature.setStyle(iconStyle_set(feature));

	}

	//创建图标层
	waterQualitylayers[layername] = new ol.layer.Vector({
		source: vectorSource,
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
	var opacity = 1;
	var scale = 0.6;
	if(!item.type_zoom || item.type_zoom<=zoom){
		
	}else{
		text ="";
		opacity = 4 / item.type_zoom / 2;
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
			font: '14px sans-seri',
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








// 市级点
function city_dian_fun_zhirancun(arr,layername) {
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
	waterQualitylayers[layername] = new ol.layer.Vector({
		source: vectorSource,
		style: function(res) {
			return new_style(res);
		},
		className: "zhirancunfeature"
	});
	map.addLayer(waterQualitylayers[layername]); //市级
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



map.on(clickStr, function(e) {
	var pixel = map.getEventPixel(e.originalEvent);
	// console.log(pixel);
	map.forEachFeatureAtPixel(pixel, function(feature, vectorlayer) {
		var item_info = feature.values_;
		if (vectorlayer.className_ == "zhirancunfeature") {
			
			console.log(item_info.name, item_info.code, item_info.number, "====", item_info.id);

			if (map_level >= 4) {
				console.log("第三级暂无点击数据————————" + map_level);
				xiangqing(item_info.code)
			} else {
				plus.nativeUI.showWaiting("数据加载中...");
				mapDataFun(map, feature.values_, e.coordinate, vectorlayer);
			}

		}else if(vectorlayer.className_ == "shanxiBoundary1"){
			
		}else {
			
			console.log(item_info.layer);
			console.log(vectorlayer.className_);
			switch (vectorlayer.className_) {
				case "shp_irrigation":
					if(item_info.layer == "bzyhgq"){//北赵引黄灌区
						jump_xiangqing(1, 9)
					}else if(item_info.layer == "ctgq"){//册田灌区
						jump_xiangqing(1, 3)
					}else if(item_info.layer == "dydgq"){//大禹渡灌区
						jump_xiangqing(1, 8)
					}else if(item_info.layer == "fhgq"){//汾河灌区
						jump_xiangqing(1, 2)
					}else if(item_info.layer == "jmkgqh"){//夹马口灌区
						jump_xiangqing(1, 7)
					}else if(item_info.layer == "sghgq"){//桑干河灌区
						jump_xiangqing(1, 4)
					}else if(item_info.layer == "wyhgq"){//文峪河灌区
						jump_xiangqing(1, 12)
					}else if(item_info.layer == "xhgq"){//潇河灌区
						jump_xiangqing(1, 5)
					}else if(item_info.layer == "ycszcyhgq"){//尊村引黄灌区
						jump_xiangqing(1, 6)
					}else if(item_info.layer == "ymkgq"){//禹门口灌区
						jump_xiangqing(1, 1)
					}else if(item_info.layer == "fxgq"){//汾西灌区
						jump_xiangqing(1, 11)
					}else if(item_info.layer == "hthgq"){//滹沱河灌区
						jump_xiangqing(1, 10)
					}else{//其他
						console.log(item_info.layer+item_info.name)
					}
					break;
				case "zxgq"://中型灌区
					jump_xiangqing(2, item_info.item.id)
					break;
				case "icon_16"://千吨万人供水工程
					jump_xiangqing(8, item_info.item.id)
					break;
				case "icon_02_gj"://国家级取水单位
					jump_xiangqing(5, item_info.item.id)
					break;
				case "icon_03_sj"://省级取水单位
					jump_xiangqing(6, item_info.item.id)
					break;
				case "icon_17"://水电站
					jump_xiangqing(17, item_info.item.id)
					break;
				case "icon_23"://泵站
					jump_xiangqing(11, item_info.item.id)
					break;
				case "icon_24"://水闸
					jump_xiangqing(10, item_info.item.id)
					break;
				case "icon_21"://入河排污口
					jump_xiangqing(12, item_info.item.id)
					break;
				case "icon_25"://河湖取水口
					jump_xiangqing(13, item_info.item.id)
					break;
				case "icon_04"://地下水监测站
					jump_xiangqing(18, item_info.item.id)
					break;
				case "icon_05"://河道测站
					jump_xiangqing(19, item_info.item.id)
					break;
				case "icon_07"://河长公示牌
					jump_xiangqing(20, item_info.item.id)
					break;
				case "icon_12"://水质站点
					jump_xiangqing(21, item_info.item.id)
					break;
				case "icon_22"://骨干淤地坝
				case "icon_15"://千人以上供水工程
					jump_xiangqing(7, item_info.item.id)
					break;
				case "icon_13_dx2"://大型水库
				case "icon_13_zx2"://中型水库
					jump_xiangqing(22, item_info.item.id)
					break;
				case "icon_18"://地表水水源地
				default:
					console.log(vectorlayer.className_);
					break;
			}
		}
	})
})


/**
 * @param {Object} map
 */
function mapDataFun(map, info, lnglat, vectorlayer,type) {
	console.log(map, info, lnglat, vectorlayer);
	
	if(type == "reload"){		location.reload();		return false;	}	
	
	
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
			// 清除要素点
			vectorlayer.getSource().clear();
			addfeaturepoint(data.data, vectorlayer)
		},
		error: function(xhr, type, errorThrown) {}
	})
	

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
	if (text <= 1||text == undefined) {
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
			offsetY: datafeatures.offsetY,
		})
	});

	return iconStyle;

}



function xiangqing(item_id) {
	var self = plus.webview.currentWebview();
	mui.openWindow({
		url: '../ruralWater/villageDetails.html', //通过URL传参
		id: '../ruralWater/villageDetails.html', //通过URL传参
		extras: {
			maptype: "map",
			item_id: item_id
		}
	})
};


function jump_xiangqing(typeId, itemId) {
	var self = plus.webview.currentWebview();
	var url = '';
	console.log(typeId);
	var params = {
			item_id: itemId
		};
	switch (typeId) {
		case 1://大型灌区详情
			console.log('typeId=1');
			url = '/pages/irrigated/searchDetails.html';
			params = {
				item_id: itemId,
				type: 'big_irrigatedArea'
			};
			break;
		case 2://中型灌区详情
			url = '/pages/irrigated/searchDetails.html';
			params = {
				item_id: itemId,
				type: 'query_irrigatedArea'
			};
			break;
		case 3:
		case 4:
			url = '/pages/reservoirLevel/details.html';
			params = {
				item_id: itemId,
			};
			break;
		case 5:
		case 6:
			url = '/pages/waterIntake/waterIntake_detail.html';
			params = {
				item_id: itemId,
			};
			break;
		case 7:
		case 8:
			url = '/pages/ruralWater/searchDetails.html';
			params = {
				item_id: itemId,
				type: 'query_supWater'
			};
			break;
		case 9:
			url = '/pages/map/searchDetails-zhigou.html';
			break;
		case 10:
			url = '/pages/map/gatelist.html';
			break;
		case 11:
			url = '/pages/map/pumplist.html';
			break;
		case 12:
			url = '/pages/map/searchDetails-paiwu.html';
			break;
		case 13:
			url = '/pages/map/searchDetails-qushuikou.html';
			break;
		case 14:
			url = '/pages/map/searchDetails-difang.html';
			break;
		case 15:
			url = '/pages/map/callwater.html';
			break;
		case 16:
			url = '/pages/map/elecwell.html';
			break;
		case 17:
			url = '/pages/ruralWater/searchDetails.html';
			params = {
				item_id: itemId,
				type: 'hydropower_station_list'
			};
			break;
		case 18://地下水监测站
			url = '/pages/waterLove/details.html';
			break;
		case 19://河道测站
			url = '/pages/waterLove/details2.html';
			break;
		case 20://公示牌
			url = "/pages/riverChief/billboard_detail.html";
			break;
		case 21://水质站点
			url = "/pages/waterQuality/four_mess_detail.html";
			break;
		case 22://水库详情
			url = "/pages/reservoirLevel/details.html";
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