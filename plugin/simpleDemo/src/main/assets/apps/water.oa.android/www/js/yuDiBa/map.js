var clickStr = mui.os.ios ? 'tap' : "click";
var layersInfo = [{
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
		type_id: ["bigwaternetwork"],
		tname: "山西边界",
		listshow: false,
		name: "shanxiBoundary1",
		width: 1,
		visibility: true,
		bgcolor: "rgba(255,255,255,0)",
		color: "#aaaaaa",
		jsonUrl: "../../js/ruralWater/shanxi.json"
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
];

for (var i = 0; i < layersInfo.length; i++) {
	// console.log(JSON.stringify(layersInfo[i]))
	waterQuality(layersInfo[i])
}
// 添加河流信息
// 添加河流信息
function waterQuality(item) {
	if (item.datatype == "WMTS") {
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
					resolutions: [0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125,
						0.02197265625, 0.010986328125,
						0.0054931640625, 0.00274658203125, 0.001373291015625,
						0.0006866455078125, 0.00034332275390625,
						0.000171661376953125, 8.58306884765625e-005, 4.291534423828125e-005,
						2.1457672119140625e-005
					],
					matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
				})
			}),
			visible: item.visibility,
			// visible:false,
			className: item.name,
			// source: new ol.source.OSM(),
			projection: 'EPSG:4326'
		})
		map.addLayer(waterQualitylayers[item.name]);
	} else {
		// 一级河流
		waterQualitylayers[item.name] = new ol.layer.Vector({
			source: new ol.source.Vector({
				url: item.jsonUrl, //从文件加载一级河流
				format: new ol.format.GeoJSON()
			}),
			visible: item.visibility,
			// visible:false,
			className: item.name,
			projection: 'EPSG:4326',
			style: new ol.style.Style({
				fill: new ol.style.Fill({
					color: item.bgcolor,
					width: item.width
				}),
				stroke: new ol.style.Stroke({
					color: item.color,
					width: item.width
				})
			})
		});
		map.addLayer(waterQualitylayers[item.name]);
	}

}


// 获取基础信息
var root = localStorage.getItem("str_url");
if (root == "" || root == undefined || root == null) {
	// mui.openWindow({
	// 	url: 'login.html?cid=1', //通过URL传参
	// 	id: 'login.html?cid=1', //通过URL传参
	// })
}
var token = localStorage.getItem("token");
mui.plusReady(function() {
	plus.nativeUI.showWaiting("数据加载中...");
	jc_info_fun(1, "guganba", ' data-qname="guganba"');

});

//河道水位站地图坐标
function jc_info_fun(type, layersname, param_str) {
	var _url = root + 'api/v3/fetchwater/backboneProjectNew';
	var datainfo = {
		"token": map_info_obj.token,
		"type": type,
		// "map_level": map_info_obj.map_level,
		"center_lon": map_info_obj.center[0],
		"center_lat": map_info_obj.center[1]
	}
	console.log(_url);
	console.log(JSON.stringify(datainfo))
	mui.ajax(_url, {
		data: datainfo,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			if (data.code == 1) {
				console.log(JSON.stringify(data.data));

				if (data.data == "") {
					plus.nativeUI.toast("暂无搜索结果");
					return false;
				}
				// 监测站数据显示
				city_dian_fun(data.data.data, layersname);
				// 弹窗当前选择
				if(data.data.searchData){
					$(".tips_wrap").append(`
						<div class="tips_item" ${param_str}>
							<span class="tips_title">当前选择:&nbsp;</span>
							<span class="tips_text">${data.data.searchData}</span>
							<span class="wrong" onclick="del_tips(this)">×</span>
						</div>
					`);
				}
				// 弹窗当前选择 end
				// 处理侧边栏添加数量
				for(let i=0;i<data.data.rightStatistics.length;i++){
					$('.right_bar .right_bar_center ul .list_lis .counts').eq(i).html(data.data.rightStatistics[i].count)
				}
			} else {
				plus.nativeUI.toast(data.msg);
			}
		},
		error: function(xhr, type, errorThrown) {
			console.log('error');
			plus.nativeUI.closeWaiting();
			plus.nativeUI.toast("网络不稳定，请检查网络");
		}
	})
}


// 基础信息 end

// 水电站位置
function city_dian_fun(arr, layername) {
	var vectorSource = new ol.source.Vector({}); //创建数据源
	var pointArr = arr;
	for (var i = 0; i < pointArr.length; i++) {
		var item_info = pointArr[i];
		// console.log(JSON.stringify(item_info))
		var feature = new ol.Feature({
			geometry: new ol.geom.Point([item_info.lng, item_info.lat]),
			name: item_info.name,
			// code: item_info.code,
			item: item_info
		});
		vectorSource.addFeature(feature);

		//为点要素添加样式
		// feature.setStyle(iconStyle_set(feature,layername));

	}

	//创建图标层
	// 普通map渲染模式
	waterQualitylayers[layername] = new ol.layer.Vector({
		source: vectorSource,
		style: iconStyle_set,
		className: layername
	});
	map.addLayer(waterQualitylayers[layername]); //市级

}
// 坐标组
/**
 * @param {Object} feature
 * @description 创建标签的样式
 */
function iconStyle_set(feature) {
	// console.log(JSON.stringify(feature.values_.item));

	var item = feature.values_.item;
	// var val = item.value || item.speed;
	var text = item.name
	var images = feature.values_.item.image;
	var zoom = map.getView().getZoom();
	var opacity = 1;
	var scale;
	// if (!item.type_zoom || item.type_zoom <= zoom) {

	// } else {
	// 	text = "";
	// 	opacity = 6 / item.type_zoom / 2;
	// 	scale = 0.26;
	// }
	//返回一个样式
	var iconStyle = new ol.style.Style({
		image: new ol.style.Icon({
			opacity: opacity,
			scale: calcScaleFun(0.4,1),
			src: images
		}),
		text: new ol.style.Text({
			font: '12px sans-seri',
			// text: String(text),
			fill: new ol.style.Fill({
				color: feature.values_.item.color || "#2EA2F5"
			}),
			offsetY: 20,
			stroke: new ol.style.Stroke({
				color: feature.values_.item.stroke || "#ffffff",
				width: feature.values_.item.stroke_width || 2
			})
			// backgroundFill: new ol.style.Fill({
			// 	color: '#ffffff'
			// })
		})
	});

	return iconStyle;
};

// 详情方法
function xiangqing(classname, id) {
	console.log(classname);
	switch (classname) {
		case "guganba":
		case "zhongxingba":
		case "lanshaba":
			mui.openWindow({
				url: '/pages/yuDiBa/detail.html', //通过URL传参
				id: '/pages/yuDiBa/detail.html', //通过URL传参
				extras: {
					item_id: id
				}
			})
			break;
		default:
			console.log("====================图层名称===========");
			// console.log(classname);
			break;
	}
};

// 管理对象显示隐藏
$("body").on(clickStr, ".nav_ul_box .isShow", function() {
	var objItem = $(this).attr("data-type");
	if (objItem && objItem !== undefined) {
		if ($(this).hasClass("active")) {
			$("#" + objItem).removeClass("active")
			$(this).removeClass("active")
		} else {
			$("#" + objItem).addClass("active")
			$(this).addClass("active")
		}
	}
})
// 是否选中管理对象
$("body").on(clickStr, ".list_ul .list_li", function(e) {
	e.stopPropagation();
	e.preventDefault();
	// 修改右侧对应选中状态
	let liName = $(this).attr("data-qname");
	let $li = $(".right_bar_center ul li[data-qname='"+liName+"']");
	
	if ($(this).hasClass("active")) {
	    $(this).removeClass("active");
		$li.removeClass("active")
	} else {
		$(this).addClass("active");
		$li.addClass("active")
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

// 控制显示隐藏「
function isLayers(that) {
	// 切换管理对象的时候清除所有的弹出层
	map.getOverlays().clear();
	// 还原中心点
	resetCZ()
	var activeStatus = that.hasClass("active");
	var itemQname = that.attr("data-qname");
	// var itemType = that.attr("data-type");
	var itemId = that.attr("data-id");
	console.log(itemQname)
	console.log(itemId)
	if (activeStatus) {
		if (waterQualitylayers[itemQname] != undefined) {
			waterQualitylayers[itemQname].setVisible(true);
		} else {
			plus.nativeUI.showWaiting("数据加载中...");
			var param_str =  'data-type="'+that.attr("data-type")+'" data-qname="'+itemQname+'"'
			jc_info_fun(itemId, itemQname,param_str);
		}	
	} else {
		if (waterQualitylayers[itemQname] != undefined) {
			// waterQualitylayers[itemQname[i]].setVisible(false);
			waterQualitylayers[itemQname].getSource().clear();
			map.removeLayer(waterQualitylayers[itemQname]);
			waterQualitylayers[itemQname] = undefined;
			// 清除当前选择弹框
			$(".tips_wrap").find(".tips_item[data-qname = '"+itemQname+"']").remove();
		}
	}
	
}




map.getView().on('change:resolution', function() {
	// 重新设置图标的缩放率，基于层级20来做缩放
	// zoomLevelFun()
	var mapExtent = map.getView().calculateExtent(map.getSize());
	var mapZoom = map.getView().getZoom();
	var point = ol.extent.getCenter(mapExtent);
	$(".level_box_info").html(mapZoom);
	// point = ol.proj.transform([point[0], point[1]], 'EPSG:4326', 'EPSG:3857'),
	if (parseInt(mapZoom) != map_info_obj.map_level) {
		map_info_obj.zoom = parseFloat(mapZoom).toFixed(1);
		// console.log("================================");
		// console.log("中心点="+point);
		// console.log("getSize="+map.getSize());
		// console.log("map级别="+mapZoom);
		// console.log("map_info_obj.zoom="+map_info_obj.zoom);
	}
	map_info_obj.center = point;
	map_info_obj.zoom = mapZoom;
	if (mapZoom <= 9) {
		map_info_obj.map_level = 9;
	} else if (mapZoom > 9 && mapZoom <= 13) {
		map_info_obj.map_level = 13;
	} else {
		map_info_obj.map_level = 17;
	}

})
var layerName_arr = ["guganba","zhongxingba","lanshaba"];
selectFun( layerName_arr , -110)

// 还原中心点
function resetCZ() {
    map.getView().setCenter(map_info_obj.center||[112.387029, 37.872418]);
    map.getView().setZoom(map_info_obj.zoom||6.8);
}
// 动画还原中心点
function resetAnimate() {
	map.getView().animate({
	    zoom: map_info_obj.zoom||6.8,
	    center: map_info_obj.center||[112.387029, 37.872418],
	});
}