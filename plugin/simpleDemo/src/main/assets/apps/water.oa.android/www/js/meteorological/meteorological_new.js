var clickStr = mui.os.ios ? 'tap' : "click";
// TileWMSLayer.setVisible(false)
$("head").append("<style>#map{background-color: #f0f0f0;}</style>")

// 信息显示
$("body").on(clickStr, ".search_header_box .icon_arrow", function() {
	if ($(this).hasClass("active")) {
		$(this).removeClass("active");
		$(".search_header_box .search_table_box").removeClass("active");
	} else {
		$(this).addClass("active");
		$(".search_header_box .search_table_box").addClass("active");
	}
})

// 小时切换
$("body").on(clickStr, ".tab_type .span", function() {
	// 切换管理对象的时候清除所有的弹出层
	map.getOverlays().clear();
	// 还原中心点
	resetCZ()
	$(".tab_type .span").removeClass("active");
	//$(".tab_type .point .span").addClass("active");
	$(this).addClass("active");
	var list_item = $("#managementObjects .list_li.active");
	var id = list_item.attr("data-id");
	var itemQname = list_item.attr("data-qname");

	try {
		waterQualitylayers[itemQname].getSource().clear();
		map.removeLayer(waterQualitylayers[itemQname]);
		map.removeLayer(waterQualitylayers[itemQname + "_1"]);
	} catch (e) {
		//TODO handle the exception
	}
	jc_info_fun(id, itemQname);
})

// 添加河流信息
// 添加河流信息
function waterQuality(item) {
	// console.log(JSON.stringify(item))
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
	}
	else if(item.datatype == "WMS"){
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
	}else if(item.datatype == "TDT"){
		//加载geoserver的WMTS服务
		waterQualitylayers[item.name] = new ol.layer.Tile({
			source: new ol.source.WMTS({
				name: "中国矢量1-4级",
				url: item.serverInfo.TDT.url,
				layer: item.serverInfo.TDT.layer,
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
		map.addLayer(waterQualitylayers[item.name]);
	}
	else if(item.datatype == "WFS"){
		waterQualitylayers[item.name] = new ol.layer.Vector({
			source: new ol.source.Vector({
				url: item.serverInfo.WFS.url, //从文件加载一级河流
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
					lineDash:item.lineDash||[],
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
	else{
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
					lineDash:item.lineDash||[],
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
var layersInfo = [
	// {name:"rivers_level1",visibility:true,color:"#4d8dee",jsonUrl:"../../js/waterQuality/rivers/rivers_level1.json"},
	// {name:"rivers_level2",visibility:true,color:"#4d8dee",jsonUrl:"../../js/waterQuality/rivers/rivers_level2.json"},
	// {name:"rivers_level3",visibility:true,color:"#4d8dee",jsonUrl:"../../js/waterQuality/rivers/rivers_level3.json"},
	// {name:"floodControlArea",visibility:true,color:"rgba(194,234,255,0.7)",jsonUrl:"../../js/waterQuality/rivers/floodControlArea.json"},
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
		type_id: ["bigwaternetwork"],
		tname: "山西边界",
		listshow: false,
		name: "shanxiBoundary1",
		width: 1,
		visibility: true,
		bgcolor: "rgba(255,255,255,0.5)",
		color: "#aaaaaa",
		jsonUrl: "../../js/ruralWater/shanxi.json"
	},
	//{type_id:["bigwaternetwork"],tname:"山西河流",listshow:false,images:"../../images/big_water_network/icon-11-sjhl.png",name:"rivers_big_sxhl",width:1,visibility:true,bgcolor:"rgba(255,255,255,0)",color:"#BFE9FF",jsonUrl:"../../js/ruralWater/json/shanxi_river.json"},
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
	}

];

// 更换底图服务
TileWMSLayer_base.getSource().clear();
TileWMSLayer_base.setSource(base_source["dzMap_source"]);


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
	console.log(JSON.stringify(plus.device))
	// 还原中心点
	resetCZ()
	plus.nativeUI.showWaiting("数据加载中...");
	var self = plus.webview.currentWebview();
	console.log(self.type)
	switch (self.type) {
		// case 1:
		// 	jc_info_fun(1, "jiangshui");
		// 	// for (var i = 0; i < layersInfo.length; i++) {
		// 	// 	//console.log(JSON.stringify(layersInfo[i]))
		// 	// 	waterQuality(layersInfo[i])
		// 	// }

		// 	break;
		case 2:
			jc_info_fun(2, "qiwen");
			break;
		case 3:
			jc_info_fun(3, "fengxiangfengsu");
			break;
		case 4:
			jc_info_fun(4, "shidu");
			break;
		default:
			jc_info_fun(2, "qiwen");
			break;
	}
	for (var i = 0; i < layersInfo.length; i++) {
		//console.log(JSON.stringify(layersInfo[i]))
		waterQuality(layersInfo[i])
	}
	$("#managementObjects .list_li").removeClass("active");
	$("#managementObjects .list_li").eq(self.type - 2).addClass("active");

});
// 监测站状态信息描述与数据展示
function jczInfo_append(list) {
	if (list == "undefined" || list == '' || list == null) {
		$(".search_frame").css("display", "none")
		return false;
	} else {
		$(".search_frame").css("display", "block")
	}
	$(".search_title").html(list.highest);
	// list.list.Each(function(item,index){
	// 	//console.log(item,index)
	// })
	var headitem = list.head;
	var th_html="";
	for(var i = 0;i < headitem.length; i++) {
		th_html+='<th>'+headitem[i]+'</th>'
	}
	console.log(th_html)
	$('.search_table_box .mui-table .head').html(th_html)
	
	
	
	var item = list.data;
	console.log(item.length)
	//console.log(JSON.stringify(item));
	
	// var type = $(".top_nav .list_ul .active").attr("data-id");
	// var hour_type = $(".tab_type .point .span").attr("data-status")
	
	// console.log(type)
	// console.log(hour_type)
	
	var tr_html = "";
	var type = $(".top_nav .list_ul .active").attr("data-id");
	var hour_type = $(".tab_type .span.active").attr("data-status");
	var type_text = $(".top_nav .list_ul .active span").html();
	var status_text = $(".tab_type .span.active .bar_text").html();
	for (var i = 0; i < item.length; i++) {
		var td_str = '';
		for (var j = 0; j < item[i].area.length; j++) {
			td_str += `<span class='set_span' data-code='${item[i].area[j].code}' onclick="xiangqing2('${type}','${hour_type}','${type_text}','${status_text}','${item[i].area[j].value}','${item[i].area[j].name}')">${item[i].area[j].name} </span>`;
			
		}
		if (td_str == "") {
			td_str = "无"
		}
		tr_html += `<tr>
					<td>${item[i].name}</td>
					<td>${td_str}</td>
					<td>${item[i].count}</td>
				</tr>`
	}

	$("#jsInfo").html(tr_html);
}
//河道水位站地图坐标
function jc_info_fun(type, layersname) {
	var _url = root + 'api/v4/weather/';
	var status = $(".tab_type .span.active").attr("data-status") || '';
	var datainfo = {
		"token": map_info_obj.token,
		"type": type,
		"hour_type": status,
	}
	console.log(_url);
	console.log(JSON.stringify(datainfo))
	mui.ajax(_url, {
		data: datainfo,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			// console.log(JSON.stringify(data));
			plus.nativeUI.closeWaiting();
			$(".right_bar_center ").scrollTop(0)
			if (data.code == 1) {
				//console.log(JSON.stringify(data));
				console.log(JSON.stringify(data.data.searchData));
				if (data.data == "") {
					plus.nativeUI.toast("暂无搜索结果");
					return false;
				}
				//修复在地图中增加按数值区域范围显示分布图
				try {
					gethottu(data.data.diagram, layersname + "_1");
				} catch (e) {
					//TODO handle the exception
				}
				// gethottu(data.data.diagram,layersname+"_1");
				// 监测站数据显示
				city_dian_fun(data.data.result, layersname);
				// 弹窗当前选择
				if(data.data.searchData){
					var data_status = $(".right_bar_center .tab_type .span.active").attr("data-status");
					var param_str =  'data-status="'+data_status+'"';
					console.log(`
						<div class="tips_item" ${param_str}>
							<span class="tips_title">当前选择:&nbsp;</span>
							<span class="tips_text">${data.data.searchData}</span>
							<span class="wrong" onclick="del_tips(this)">×</span>
						</div>
					`)
					$(".tips_wrap").html(`
						<div class="tips_item" ${param_str}>
							<span class="tips_title">当前选择:&nbsp;</span>
							<span class="tips_text">${data.data.searchData}</span>
							<span class="wrong" onclick="del_tips(this)">×</span>
						</div>
					`);
				}
				// 提示信息插入
				jczInfo_append(data.data.list);
				// 图例
				//console.log($('.search_frame').outerHeight())
				$('.map_legend_img').attr('src', data.data.legend)
				$('.map_legend').css('bottom', $('.search_frame').outerHeight() + 10 + 'px')
				$('.right_posi').css('bottom', $('.search_frame').outerHeight() + 2 + 'px')
			} else {
				plus.nativeUI.toast(data.msg);
			}
		},
		error: function(xhr, type, errorThrown) {
			////console.log('error');
			plus.nativeUI.closeWaiting();
			plus.nativeUI.toast("网络不稳定，请检查网络");
		}
	})
}


var layerName_arr = ["qiwen","shidu"];
selectFun( layerName_arr , -90,"Color","#000000")
var layerName_arr2 = ["fengxiangfengsu"];
selectFun( layerName_arr2 , -105)
// 基础信息 end

// 点击跳转水电站详情
// var idStatus = '';
// map.on('click', function(e) {
// 	console.log("#"+idStatus);
// 	if(idStatus != ""){
// 		setTimeout(function(){
// 			$("#" + idStatus).remove();
// 			idStatus = ''
// 			let marker_name = $('.marker').attr('data-popup')
// 			$("#" + marker_name).remove();
// 		},5)
// 	}
// 	//在点击时获取像素区域
// 	var pixel = map.getEventPixel(e.originalEvent);
// 	map.forEachFeatureAtPixel(pixel, function(feature, vectorLayers) {
// 		var coodinate = e.coordinate;
// 		console.log(vectorLayers.className_)
// 		if(vectorLayers.className_ == 'qiwen' || vectorLayers.className_ == 'fengxiangfengsu' || vectorLayers.className_ == 'shidu'){
// 			var item_info = feature.values_;
// 			if(idStatus == ''){
// 				addPopup(item_info,vectorLayers)
// 				idStatus = $('.popup_box').attr('data-popup');
// 			}else{
// 				let popup_name = $('.popup_box').attr('data-popup')
// 				$("." + popup_name).remove();
// 				let marker_name = $('.marker').attr('data-popup')
// 				$("." + marker_name).remove();
// 				idStatus = ''
// 			}
// 		}
// 	});
// });
// 地图信息 end



// 详情方法
function xiangqing(classname, station_code) {
	//console.log(classname);
	//console.log(JSON.stringify(item_info))
	switch (classname) {
		// case "jiangshui":
		case "qiwen":
		case "fengxiangfengsu":
		case "shidu":
			mui.openWindow({
				url: '/pages/meteorological/detail.html', //通过URL传参
				id: '/pages/meteorological/detail.html', //通过URL传参
				extras: {
					selectval: $("#managementObjects .list_li.active").attr("data-id"),
					status: $(".tab_type .span.active").attr("data-status") || '',
					station_code: station_code
				}
			})
			break;
		default:
			//console.log(classname);
			break;
	}
};
	// data_info.type = $("#type_select").val();
	// data_info.status = $("#status_select").val();;
	// data_info.areaCode = $("#city_select").val();;
	
	
function xiangqing2(type,hour_type,type_text,status_text,area_code,area_name) {
	var self = plus.webview.currentWebview();

	mui.openWindow({
		url: 'list2.html', //通过URL传参
		id: 'list2.html', //通过URL传参
		extras: {
			type: type,
			status:hour_type,
			areaCode:area_code,
			areaname:area_name,
			type_text:type_text,
			status_text:status_text,
		}
	})
};

// 坐标组
/**
 * @param {Object} feature
 * @description 创建标签的样式
 */
function iconStyle_set(feature) {
	////console.log(JSON.stringify(feature.values_.item));

	var item = feature.values_.item;
	var val = item.value || item.speed;
	var text = val + "\r\n" + item.station_name;
	// var images = feature.values_.item.icon;
	var zoom = map.getView().getZoom();
	var opacity = 1;
	var scale = 0.6;
	if (!item.type_zoom || item.type_zoom <= zoom) {

	} else {
		text = "";
		opacity = 4 / item.type_zoom / 2;
		if (item.type_zoom - zoom > 1) {
			opacity = 0;
		}
		scale = 0.4;
	}
	if (item.layername == "fengxiangfengsu") {
		var styleImage = new ol.style.Icon({
			opacity: opacity,
			scale: 0.3,
			rotation: item.direction,
			src: item.image
		})
	} else {
		var styleImage = new ol.style.Circle({
			radius: 1,
			fill: null,
			stroke: new ol.style.Stroke({
				color: 'rgba(0,0,0,' + opacity + ')',
				width: 2
			})
		})
	}

	//返回一个样式
	var iconStyle = new ol.style.Style({
		// image: new ol.style.Icon({ 
		// 	opacity: opacity,
		// 	scale: scale,
		// 	src: images
		// }),
		image: styleImage,
		text: new ol.style.Text({
			font: '12px sans-seri',
			text: String(text),
			fill: new ol.style.Fill({
				color: item.t_color || "#2EA2F5"
			}),
			offsetY: 20,
			stroke: new ol.style.Stroke({
				color: item.stroke || "#ffffff",
				width: feature.values_.item.stroke_width || 2
			})
			// ,
			// backgroundFill: new ol.style.Fill({
			// 	color: '#ffffff'
			// })
		})
	});

	return iconStyle;
};
// 水电站位置
function city_dian_fun(arr, layername) {
	var vectorSource = new ol.source.Vector({}); //创建数据源
	var pointArr = arr;
	for (var i = 0; i < pointArr.length; i++) {
		var item_info = pointArr[i];
		item_info.layername = layername;
		// //console.log(JSON.stringify(item_info))
		var feature = new ol.Feature({
			geometry: new ol.geom.Point([item_info.lng, item_info.lat]),
			name: item_info.area_name,
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

	// webgl渲染模式
	// var style = {
	//     symbol: {
	// 		symbolType: 'image',
	// 		src: 'http://wateroa.sxjicheng.com:80/theme/Default/images/water_rain_icon/icon_dxscz.png',
	// 		size: [18, 18],
	// 		color: 'lightyellow',
	// 		rotateWithView: false,
	// 		offset: [0, 9]
	//     }
	// };
	// waterQualitylayers[layername] = new ol.layer.WebGLPoints({
	// 	source: vectorSource,
	// 	style: style,
	// 	disableHitDetection: false
	// });
	// map.addLayer(waterQualitylayers[layername]); //市级

}

// 管理对象显示隐藏
// $("body").on("click",".nav_ul_box .isShow",function(){
// 	var objItem = $(this).attr("data-type");
// 	if(objItem && objItem !== undefined){
// 		if($(this).hasClass("active")){
// 			$("#"+objItem).removeClass("active")
// 			$(this).removeClass("active")
// 		}else{
// 			$("#"+objItem).addClass("active")
// 			$(this).addClass("active")
// 		}
// 	}
// })
// 是否选中管理对象
$("body").on(clickStr, ".list_ul .list_li", function(e) {
	e.stopPropagation();
	e.preventDefault();
	$(".tab_type .span").removeClass('active');
	$(".tab_type .span").eq(0).addClass('active');
	if ($(this).hasClass("active")) {
		$(this).removeClass("active");
	} else {
		var active_item = $(".list_ul .list_li.active");
		if (active_item) {
			var index = active_item.index();
		}
		$(".list_ul .list_li").removeClass("active");

		if (active_item) {
			isLayers($(".list_ul .list_li").eq(index));
		}

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



//点击切换小时显示与隐藏
// $(".mui-icon").click(function() {

// 	if ($(this).hasClass('mui-icon-arrowdown')) {
// 		$('.mui-icon').addClass("mui-icon-arrowup");
// 		$('.mui-icon').removeClass("mui-icon-arrowdown");
// 		$('.rightTabs .tab_type div').removeClass("hide");
// 		$('.rightTabs .tab_type div').addClass("show");

// 	} else {
// 		$('.mui-icon').addClass("mui-icon-arrowdown");
// 		$('.mui-icon').removeClass("mui-icon-arrowup");
// 		$('.rightTabs .tab_type div').removeClass("show");
// 		$('.rightTabs .tab_type div').addClass("hide");
// 	}
// })

// $(".Timebox").on("click", function() {
// 	map.getOverlays().clear();
// 	$('.rightTabs .tab_type div').removeClass("show");
// 	$('.rightTabs .tab_type div').addClass("hide");
// 	$('.mui-icon').removeClass("mui-icon-arrowup");
// 	$('.mui-icon').addClass("mui-icon-arrowdown");
// 	$(this).addClass("active")
// })
// $('.tab_type').on('click', '.Timebox .span', function() {
// 	var index = $(this).index();
// 	var status = $(this).attr("data-status")
// 	$(".Timebox .span").removeClass("hide");
// 	$(".tab_type .point .span").attr("data-status", status)
// 	$(this).addClass("hide");
// 	var currentT = $(this).text()
// 	$('.tab_type .point .span').text(currentT);
// })



// 控制显示隐藏「
function isLayers(that) {
	// 切换管理对象的时候清除所有的弹出层
	map.getOverlays().clear();
	// 还原中心点
	resetCZ()
	// 默认关闭底部信息展示
	$(".icon_arrow").removeClass("active");
	$(".search_header_box .search_table_box").removeClass("active");
	// var item = $(".list_obj .list_ul .list_li");
	// for (var i = 0; i < item.length; i++) {
	// 图例默认展开
	$('.map_legend_img').removeClass('isHide')
	$('.turn_text').addClass('isHide')
	$(".turn_img").css('transform', 'rotate(360deg)')
	var activeStatus = that.hasClass("active");
	var itemQname = that.attr("data-qname");
	// var itemType = that.attr("data-type");
	var itemId = that.attr("data-id");
	console.log(itemQname)
	// //console.log(itemId)
	if (activeStatus) {
		// 清除其他图层数据信息
		for (var i = 0; i < $('.list_li').length; i++) {
			if($('.list_li').eq(i).attr('data-id') != itemId){
				var quitQname = $('.list_li').eq(i).attr("data-qname");
					if (waterQualitylayers[quitQname] != undefined) {
						map.removeLayer(waterQualitylayers[quitQname]);
						waterQualitylayers[quitQname] = undefined;
					}
			}	
		}
		// if(waterQualitylayers[itemQname]["values_"]["source"] != undefined){
		// 	//console.log(itemQname);
		// 	waterQualitylayers[itemQname].setVisible(true)
		// }else{
		plus.nativeUI.showWaiting("数据加载中...");
		jc_info_fun(itemId, itemQname);
		// }
	} else {
		if (waterQualitylayers[itemQname] != undefined) {
			// waterQualitylayers[itemQname].setVisible(false);
			waterQualitylayers[itemQname].getSource().clear();
			map.removeLayer(waterQualitylayers[itemQname]);
			try {
				map.removeLayer(waterQualitylayers[itemQname + "_1"]);
			} catch (e) {
				//TODO handle the exception
			}
		}
	}
	// }
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
		//console.log("中心点="+point);
		//console.log("getSize="+map.getSize());
		//console.log("map级别="+mapZoom);
		//console.log("map_info_obj.zoom="+map_info_obj.zoom);
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
//添加比例尺
function AddScaleLint() {
	var scaleLineControl = new ol.control.ScaleLine({
		Units: 'metric', //单位有5种：degrees imperial us nautical metric
	});

	map.addControl(scaleLineControl);
}

// AddScaleLint()

// map.on("moveend",function(){
// 	var listListActive = $("#managementObjects .list_ul .list_li.active");
// 	listListActive.each(function(index,item){
// 		var qname = $(item).attr("data-qname");
// 		var id = $(item).attr("data-id");
// 		//console.log(qname,id);
// 		var itemQname = qname;
// 		var itemId = id;
// 		waterQualitylayers[itemQname].getSource().clear();
// 		map.removeLayer(waterQualitylayers[itemQname]);
// 		jc_info_fun(itemId,itemQname);
// 	})

// })
//修复在地图中增加按数值区域范围显示分布图
function gethottu(diagram, layersname) {
	// 图片信息
	//静态图片资源
	//console.log(JSON.stringify(diagram));	
	let lonlat = [Number(diagram.minlon), Number(diagram.minlat), Number(diagram.maxlon), Number(diagram.maxlat)];
	let imgurl = diagram.imgurl;
	let source = new ol.source.ImageStatic({
		url: imgurl, //图片网址
		projection: 'EPSG:4326', //投影
		imageExtent: lonlat //图像坐标[minLon,minLat,maxLon,maxLat]
	})
	waterQualitylayers[layersname] = new ol.layer.Image({
		source: source, //该层的来源
		// zIndex:1,//图层渲染的Z索引,默认按加载顺序叠加
		extent: lonlat, //图层渲染范围，可选值，默认渲染全部
		visible: true, //是否显示，默认为true
		opacity: 0.8, //透明度，默认为1
	})
	map.addLayer(waterQualitylayers[layersname]);
}

$('.right_bar_center #details').on(clickStr,establish)
function establish(type,status,type_text,status_text) {
	var type = $(".top_nav .list_ul .active").attr("data-id");
	var status = $(".tab_type .span.active").attr("data-status");
	var type_text = $(".top_nav .list_ul .active span").html();
	var status_text = $(".tab_type .span.active").html();
	var self = plus.webview.currentWebview();
	mui.openWindow({
		url: 'list.html', //通过URL传参
		id: 'list.html', //通过URL传参
		extras: {
			type: type,
			status:status,
			type_text:type_text,
			status_text:status_text
		}
	})
}

/**
 * @description 图例展开收缩 
 */
$('.map_legend').on(clickStr,function() {
	if($(this).find('.map_legend_img').hasClass('isHide')){
		console.log(1)
		$(this).find('.map_legend_img').removeClass('isHide')
		$(this).find('.turn_text').addClass('isHide')
		$(".turn_img").css('transform', 'rotate(360deg)')
	}else{
		$(this).find('.map_legend_img').addClass('isHide')
		$(this).find('.turn_text').removeClass('isHide')
		$(".turn_img").css('transform', 'rotate(180deg)')
	}
})

// 还原中心点
function resetCZ() {
    
	// 是否是平板
	if(devInfo.h_w_pixel<=1.7){
		map.getView().setCenter([112.387029, 37.472418]);
		map.getView().setZoom(7.1);
	}else{
		map.getView().setCenter(map_info_obj.center||[112.387029, 37.872418]);
		map.getView().setZoom(map_info_obj.zoom||6.8);
	}
	
}
// 动画还原中心点
function resetAnimate() {
	map.getView().animate({
	    zoom: map_info_obj.zoom||6.8,
	    center: map_info_obj.center||[112.387029, 37.872418],
	});
}