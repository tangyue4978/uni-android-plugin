var clickStr = mui.os.ios ? "tap" : "click";
// 管理对象显示隐藏
var defaultId = "managementObjects";
$("body").on(clickStr, ".nav_ul_box .isShow", function() {
	//清除地图动画
	$("#marker").hide();
	// 清除类型样式
	$(".position").css("display", "none");
	$(".map_type_box .item_type").css("border", "none");
	$(".position_ul li").removeClass().find("span:last-child").css("display", "none");

	//隐藏搜索框和搜索列表
	$(".search_frame").css("display", "none");
	$(".so_li_box").find("a").removeClass("active");

	//清空搜索框
	$(".li_input").val("");
	//清除搜索地图渲染
	if (waterQualitylayers["searchLayer"]) {
		waterQualitylayers["searchLayer"].getSource().clear();
		map.removeLayer(waterQualitylayers["searchLayer"]);
	}
	if (waterQualitylayers["searchLayers"]) {
		waterQualitylayers["searchLayers"].getSource().clear();
		map.removeLayer(waterQualitylayers["searchLayers"]);
	}

	var objItem = $(this).attr("data-type");
	if (objItem !== "fanghongimportant") {
		//还原中心点
		resetCZ();
	}
	if (defaultId != objItem) {
		// 切换地图大分类时清空所有图层及选中效果
		defaultId = objItem;
		$(".list_box .list_li").removeClass("active");
	}

	if ($(this).hasClass("active_tow")) {
		if (objItem && objItem !== undefined) {
			if ($(this).hasClass("active")) {
				$("#" + objItem).removeClass("active");
				$(this).removeClass("active");
			} else {
				$(".nav_ul_box .isShow").removeClass("active");
				$(".mapBox .list_box").removeClass("active");
				$("#" + objItem).addClass("active");
				$(this).addClass("active");
			}
		}
	} else {
		$(".nav_ul_box .isShow").removeClass("active_tow");
		$(".nav_ul_box .isShow").removeClass("active");
		$(".mapBox .list_box").removeClass("active");
		$(this).addClass("active_tow");
		$("#" + objItem).addClass("active");
		$(this).addClass("active");
		allIsLayers($(this).attr("data-type")); //切换选项卡隐藏所有图层
		isLayers(objItem); //显示当前选项卡下图层
	}
	showHidelegend(); // 控制图例显示隐藏

	// 控制显示侧边栏
	if ($(".top_nav .nav_ul_box .active_tow[data-type=fanghongimportant]").length > 0) {
		$(".tips_wrap").html("");
		$(".right_bar").css("display", "none");
		$(".right_bar .right_bar_center ul li").removeClass("active");
	} else {
		$(".right_bar").css("display", "block");
	}
});
// 是否选中管理对象
$("body").on(clickStr, ".list_ul .list_li", function(e) {
	e.stopPropagation();
	e.preventDefault();

	//清除搜索地图渲染
	var pid = $(this).parents(".list_box").attr("id");
	var qname = $(this).text();
	let liName = $(this).attr("data-qname");
	let $li = $(".right_bar_center ul li[data-qname='" + liName + "']");
	if (pid == "fanghongimportant") {
		if ($(this).hasClass("active")) {
			$(this).removeClass("active");
		} else {
			$("#" + pid + " .list_li").removeClass("active");
			$(this).addClass("active");
		}
		isLayersOne($(this));
	} else {
		if ($(this).hasClass("active")) {
			$(this).removeClass("active");
			$li.removeClass("active");
		} else {
			if (liName == "shp_irrigation,shp_irrigation2") {
				$(".tips_wrap").append(`
					<div class="tips_item" data-qname="shp_irrigation,shp_irrigation2">
						<span class="tips_title">当前选择:&nbsp;</span>
						<span class="tips_text">大型灌区13处</span>
						<span class="wrong" onclick="del_tips(this)">×</span>
					</div>
				`);
			}
			$(this).addClass("active");
			$li.addClass("active");
		}
		isLayersOneOld($(this));
	}
	//控制太原都市区时放大都市区区域
	if (qname === "太原都市区") {
		map.getView().setCenter([112.667029, 37.872418]);
		map.getView().setZoom(9);
	} else {
		// map.getView().setCenter([112.557029, 37.872418]);
		resetCZ();
	}

	//控制太原都市区时放大都市区区域
	if (qname === "交通网络") {
		$("#map").css("background-color", "#f0f0f0");
	} else {
		$("#map").css("background-color", "#C3E2AE");
	}
	// var id = $(this).closest(".list_box").attr("id");
	// isLayers($(this));

	// 还原图例所有样式
	$(".legend_box").css("width", "5rem");
	$(".turn_img").css("transform", "rotate(180deg)");
	$(".legend_ul_box").css("display", "block");
	showHidelegend(); // 控制图例显示隐藏
});
// 点击隐藏信息
$("body").on(clickStr, ".list_box", function() {
	event.stopPropagation();
	event.preventDefault();
	$(this).removeClass("active");
	$(".nav_ul_box .nav_li_item").removeClass("active");
});
var river_features = {};
var layer_base = [
	// {type_id:["managementObjects"],tname:"山西边界",listshow:false,images:"../../images/big_water_network/icon-26-shenjie.png",name:"shanxi_shen",width:7,visibility:true,bgcolor:"rgba(255,255,255,0)",color:"#D5B9A1",jsonUrl:"../../js/map/json/line_shen.json"},
	// {type_id:["managementObjects"],tname:"地市边界",listshow:false,images:"../../images/big_water_network/icon-27-shijie.png",name:"shanxi_shi",width:1,visibility:true,bgcolor:"rgba(255,255,255,0)",color:"#aaaaaa",jsonUrl:"../../js/map/json/line_shi.json"},
	// {type_id:["managementObjects"],tname:"县区边界",listshow:false,images:"../../images/big_water_network/icon-28-xianjie.png",name:"shanxixian",width:1,visibility:false,bgcolor:"rgba(255,255,255,0)",color:"#2EA2F5",jsonUrl:"../../js/map/json/line_xian.json"},
	//{type_id:["managementObjects"],tname:"山西河流",listshow:false,images:"../../images/big_water_network/icon-11-sjhl.png",name:"rivers_sxhl",width:1,visibility:true,color:"#BFE9FF",jsonUrl:"../../js/ruralWater/json/shanxi_river.json"},
	// {type_id:["managementObjects"],tname:"二级河流",listshow:false,images:"../../images/big_water_network/icon-09-ejhl.png",name:"rivers_level2",width:2,visibility:true,color:"#0072FF",jsonUrl:"../../js/ruralWater/json/secondary_river.json"},
	// {type_id:["managementObjects"],tname:"一级河流",listshow:false,images:"../../images/big_water_network/icon-08-yjhl.png",name:"rivers_level1",width:1,visibility:true,bgcolor:"#7d91ff",color:"#7d91ff",jsonUrl:"../../js/ruralWater/json/primary_river.json"},
	// {type_id:["managementObjects"],tname:"三级河流",listshow:false,images:"../../images/big_water_network/icon-10-sjhl.png",name:"rivers_level3",width:1,visibility:true,color:"#0072FF",jsonUrl:"../../js/ruralWater/json/tertiary_river.json"},
	// {type_id:["managementObjects"],tname:"四级河流",listshow:false,images:"../../images/big_water_network/icon-11-sjhl.png",name:"rivers_level4",width:1,visibility:true,color:"rgba(0,114,255,0.3)",jsonUrl:"../../js/ruralWater/json/band_river.json"},
	// {type_id:["managementObjects"],tname:"四级河流",listshow:false,datatype,images:"../../images/big_water_network/icon-11-sjhl.png",name:"rivers_level4",width:1,visibility:true,color:"rgba(0,114,255,0.3)",jsonUrl:"../../js/ruralWater/json/band_river.json"},
	{
		type_id: ["managementObjects"],
		tname: "山西边界",
		listshow: true,
		datatype: "WMTS",
		name: "shanxi_shen",
		visibility: true,
		fontSize: 14,
		serverInfo: {
			WMTS: {
				url: "http://gis.sxjicheng.cn:8081/freexserver/htc/service/wmts",
				type: "WMTS",
				layer: "line_pink",
			},
			WFS: {
				url: "",
				type: "WFS",
				layer: "",
			},
		},
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
			WMTS: {
				url: "http://gis.sxjicheng.cn:8081/freexserver/htc/service/wmts",
				// url:"http://www.zhuoyukeji.cn:8081/freexserver/htc/service/wmts",
				type: "WMTS",
				// layer: "shanxi山脉水系",
				layer: "group_sxriver",
			},
			WFS: {
				url: "",
				type: "WFS",
				layer: "",
			},
		},
	},
	// {
	//     type_id: ["managementObjects"],
	//     tname: "闪烁河流",
	//     listshow: true,
	//     // datatype: "WMTS",
	//     datatype: "WFS",
	//     name: "sxdata_river",
	//     visibility: true,
	//     fontSize: 14,
	//     color: "rgba(0,255,0,1)",
	//     width: "3",
	//     serverInfo: {
	//         WMTS: {
	//             url: "http://gis.sxjicheng.cn:8081/freexserver/htc/service/wmts",
	//             // url:"http://www.zhuoyukeji.cn:8081/freexserver/htc/service/wmts",
	//             type: "WMTS",
	//             // layer: "shanxi山脉水系",
	//             layer: "sxdata_river",
	//         },
	//         WFS: {
	//             url: "http://gis.sxjicheng.cn:8081/freexserver/wfs?service=WFS&version=1.0.0&request=GetFeature&typename=sxdata_river&outputFormat=application/json&CQL_FILTER=ID=%27CGAA0000000L%27",
	//             // url: "http://gis.sxjicheng.cn:8081/freexserver/wfs?service=WFS&version=1.0.0&request=GetFeature&typename=sxdata_river&outputFormat=application/json",
	//             type: "WFS",
	//             layer: "sxdata_river",
	//         },
	//     }
	// }
];
var showMapLayers = {}; //对象下的每组数据信息
var showMapType = []; //水利地图类型，管理对象，大水网，防洪重点
for (var i = 0; i < layer_base.length; i++) {
	// 添加shp文件信息
	waterQuality(layer_base[i]);
}
for (var i = 0; i < layersInfo.length; i++) {
	// 添加shp文件信息
	if (layersInfo[i].visibility == true) {
		waterQuality(layersInfo[i]);
	}

	if (layersInfo[i].type_id != "managementObjects") {
		// waterQualitylayers[layersInfo[i].name].setVisible(false);
	}

	// 添加列表信息
	var listdata = layersInfo[i];
	listdata.index = i;
	addlist(listdata); //添加显示隐藏按钮
	legendDom(listdata); //添加图例列表
	legendDom2(listdata); //添加图例列表--专题地图
	// 根据map类型数据分类
	if (showMapType.indexOf(listdata.type_id[0]) == -1) {
		showMapType.push(listdata.type_id[0]);
		showMapLayers[listdata.type_id[0]] = [];
		showMapLayers[listdata.type_id[0]].push(listdata);
	} else {
		showMapLayers[listdata.type_id[0]].push(listdata);
	}
}
// console.log(JSON.stringify(showMapLayers));
if (showMapType.length > 0) {
	mui.plusReady(function() {
		// isLayers(showMapType[0]);
		// 侧边栏相关水库的数量
		jc_info_fun2();
	});
}
// 地图信息 end

/**
 * 	================== 通过接口获取数据信息 end================
 */
map.on("click", function(e) {
	map.getOverlays().clear();
	//在点击时获取像素区域
	var pixel = map.getEventPixel(e.originalEvent);
	map.forEachFeatureAtPixel(pixel, function(feature, layersname) {
		var coodinate = e.coordinate;
		console.log(coodinate);
		console.log(map.getView().getCenter());
		console.log(map.getView().getZoom());
		var item_info = feature.values_;
		//设置弹出框内容，可以HTML自定义
		if (
			layersname.className_ == "qihe" ||
			layersname.className_ == "fivel_akes" ||
			layersname.className_ == "fivel_akes_zi" ||
			layersname.className_ == "qihe-zi"
		) {
			xiangqing(layersname.className_, item_info);
		}
		// 大型灌区
		if (layersname.className_ == "shp_irrigation") {
			var obj = {
				layer: item_info.layer,
				item_info: item_info,
				className_: "shp_irrigation",
			};
			callAddPopup(obj);
		}
		// 中型灌区
		if (layersname.className_ == "shp_medium_irr") {
			var obj = {
				layer: layersname.className_,
				item_info: item_info,
				className_: "shp_medium_irr",
			};
			callAddPopup(obj);
		}

		// xiangqing(layersname.className_,feature.values_)
	});
});

/**
 * @description 地图点跳转详情
 */
function xiangqing(className, valueObjId) {
	if (className == "shanxi_shi" || className == "shanxi_shen") {} else {
		console.log("==================地图信息");
		console.log(JSON.stringify(valueObjId));
		console.log(className);
		switch (className) {
			case "bzyhgq": //北赵引黄灌区
				jump_xiangqing(1, 9);
				break;
			case "ctgq": //册田灌区
				jump_xiangqing(1, 3);
				break;
			case "dydgq": //大禹渡灌区
				jump_xiangqing(1, 8);
				break;
			case "fhgq": //汾河灌区
				jump_xiangqing(1, 2);
				break;
			case "jmkgqh": //夹马口灌区
				jump_xiangqing(1, 7);
				break;
			case "sghgq": //桑干河灌区
				jump_xiangqing(1, 4);
				break;
			case "wyhgq": //文峪河灌区
				jump_xiangqing(1, 12);
				break;
			case "xhgq": //潇河灌区
				jump_xiangqing(1, 5);
				break;
			case "ycszcyhgq": //尊村引黄灌区
				jump_xiangqing(1, 6);
				break;
			case "ymkgq": //禹门口灌区
				jump_xiangqing(1, 1);
				break;
			case "fxgq": //汾西灌区
				jump_xiangqing(1, 11);
				break;
			case "hthgq": //滹沱河灌区
				jump_xiangqing(1, 10);
				break;
			case "jmkgqjsgkjgcgq": //夹马口灌区节水改扩建工程灌区
				jump_xiangqing(1, 13);
				break;
			case "icon_zxgq": //中型灌区
			case "shp_medium_irr":
				jump_xiangqing(2, valueObjId);
				break;
			case "icon_16": //千吨万人供水工程
				jump_xiangqing(8, valueObjId);
				break;
			case "icon_02_gj": //国家级取水单位
				jump_xiangqing(5, valueObjId);
				break;
			case "icon_03_sj": //省级取水单位
				jump_xiangqing(6, valueObjId);
				break;
			case "icon_17": //水电站
				jump_xiangqing(17, valueObjId);
				break;
			case "icon_23": //泵站
				jump_xiangqing(11, valueObjId);
				break;
			case "icon_24": //水闸
				jump_xiangqing(10, valueObjId);
				break;
			case "icon_21": //入河排污口
				jump_xiangqing(12, valueObjId);
				break;
			case "icon_25": //河湖取水口
				jump_xiangqing(13, valueObjId);
				break;
			case "icon_04": //地下水监测站
				jump_xiangqing(18, valueObjId);
				break;
			case "icon_05": //河道水文站
			case "hdcz_shuiweizhan": //河道水位站
				jump_xiangqing(19, valueObjId);
				break;
			case "icon_07": //河长公示牌
				jump_xiangqing(20, valueObjId);
				break;
			case "icon_12": //水质站点
				jump_xiangqing(21, valueObjId);
				break;
			case "icon_15": //千人以上供水工程
				jump_xiangqing(7, valueObjId);
				break;
			case "icon_13_dx2": //大型水库
			case "icon_13_zx2": //中型水库
				jump_xiangqing(22, valueObjId);
				break;
			case "qihe": //七河
				jump_xiangqing(23, valueObjId.Id);
				break;
			case "qihe-zi": //七河
				console.log(valueObjId.item_info.properties.id);
				jump_xiangqing(23, valueObjId.item_info.properties.id);
				break;
			case "fivel_akes": //五湖
				jump_xiangqing(24, valueObjId.Id);
				break;
			case "fivel_akes-zi": //五湖
				jump_xiangqing(24, valueObjId.item_info.properties.id);
				break;
			case "icon-14": //相关水库
				jump_xiangqing(3, valueObj.item.id);
				break;
			case "searchLayer": //搜索问题
				// console.log(arguments[2])
				jump_xiangqing(arguments[2], valueObjId);
				break;
			case "searchLayers": //搜索列表
				jump_xiangqing(arguments[2], valueObjId);
				break;
			case "icon_18": //地表水水源地
				break;
			case "icon_22": //骨干淤地坝
			case "icon_021": //淤堤坝
			case "icon_022":
			case "icon_023":
				jump_xiangqing(25, valueObjId);
				break;

			default:
				console.log(className);
				break;
		}
		// jump_xiangqing(typeId, itemId)
	}
}

function jump_xiangqing(typeId, itemId) {
	var self = plus.webview.currentWebview();
	var url = "";
	var params = {
		item_id: itemId,
	};
	switch (Number(typeId)) {
		case 1: //大型灌区详情
			console.log("typeId=1");
			url = "/pages/irrigated/searchDetails.html";
			params = {
				item_id: itemId,
				type: "big_irrigatedArea",
			};
			break;
		case 2: //中型灌区详情
			url = "/pages/irrigated/searchDetails.html";
			params = {
				item_id: itemId,
				type: "query_irrigatedArea",
			};
			break;
		case 3:
		case 4:
			url = "/pages/reservoirLevel/details.html";
			params = {
				item_id: itemId,
			};
			break;
		case 5:
		case 6:
			url = "/pages/waterIntake/waterIntake_detail.html";
			params = {
				item_id: itemId,
			};
			break;
		case 7:
		case 8:
			url = "/pages/ruralWater/searchDetails.html";
			params = {
				item_id: itemId,
				type: "query_supWater",
			};
			break;
		case 9: //骨干淤地坝(搜索的类型)
			// url = '/pages/map/searchDetails-zhigou.html';
			url = "/pages/yuDiBa/detail.html";
			break;
		case 10:
			url = "/pages/map/gatelist.html";
			break;
		case 11:
			url = "/pages/map/pumplist.html";
			break;
		case 12:
			url = "/pages/map/searchDetails-paiwu.html";
			break;
		case 13:
			url = "/pages/map/searchDetails-qushuikou.html";
			break;
		case 14:
			url = "/pages/map/searchDetails-difang.html";
			break;
		case 15:
			url = "/pages/map/callwater.html";
			break;
		case 16:
			url = "/pages/map/elecwell.html";
			break;
		case 17:
			url = "/pages/ruralWater/searchDetails.html";
			params = {
				item_id: itemId,
				type: "hydropower_station_list",
			};
			break;
		case 18: //地下水监测站
			url = "/pages/waterLove_old/details.html";
			break;
		case 19: //河道测站水位站
		case 23: //河道测站水文站
			url = "/pages/waterLove/river_detail.html";
			break;
		case 20: //公示牌
			url = "/pages/riverChief/billboard_detail.html";
			break;
		case 21: //水质站点
			url = "/pages/waterQuality/four_mess_detail.html";
			break;
		case 22: //水库详情
			url = "/pages/reservoirLevel/details_syt.html";
			break;
		case 23: //七河详情
			url = "/pages/riverLake/qihu_detail.html";
			break;
		case 24: //五胡详情
			url = "/pages/riverLake/wuhu_detail.html";
			break;
		case 25: //淤堤坝(管理对象的类型)
			url = "/pages/yuDiBa/detail.html";
			break;
		case 26: //河流
			url = "/pages/rivers/rivers_details.html";
			break;
		default:
			console.log(typeId);
			break;
	}
	mui.openWindow({
		url: url, //通过URL传参
		id: url, //通过URL传参
		extras: params,
	});
}

map.getView().on("change:resolution", function() {
	// 重新设置图标的缩放率，基于层级20来做缩放
	// zoomLevelFun()
	var mapExtent = map.getView().calculateExtent(map.getSize());
	var mapZoom = map.getView().getZoom();
	var point = ol.extent.getCenter(mapExtent);
	// point = ol.proj.transform([point[0], point[1]], 'EPSG:4326', 'EPSG:3857'),
	if (parseInt(mapZoom) != map_info_obj.map_level) {
		// map_info_obj.zoom = parseFloat(mapZoom).toFixed(1);
		// console.log("================================");
		// console.log("中心点="+point);
		// console.log("getSize="+map.getSize());
		// console.log("map级别="+mapZoom);
		// console.log("map_info_obj.zoom="+map_info_obj.zoom);
	}
	if (map.getView().getZoom() >= 8) {
		if (waterQualitylayers["shp_medium_irr"]) {
			waterQualitylayers["shp_medium_irr"].setVisible(true);
		}
		if (waterQualitylayers["shp_medium_irr2"]) {
			waterQualitylayers["shp_medium_irr2"].setVisible(true);
		}
		if (waterQualitylayers["icon_zxgq"]) {
			waterQualitylayers["icon_zxgq"].setVisible(false);
		}
	} else {
		if (waterQualitylayers["shp_medium_irr"]) {
			waterQualitylayers["shp_medium_irr"].setVisible(false);
		}
		if (waterQualitylayers["shp_medium_irr2"]) {
			waterQualitylayers["shp_medium_irr2"].setVisible(false);
		}
		if (waterQualitylayers["icon_zxgq"]) {
			waterQualitylayers["icon_zxgq"].setVisible(true);
		}
	}
});
// 大中型水库点icon_13_dx2|icon_13_zx2
//中型灌区点icon_zxgq
// 淤地坝icon_22
// 千吨万人icon_16
// 地下水测站icon_04
// 河道水文站icon_05
// 河道水位站hdcz_shuiweizhan
// 水质icon_12
// 取水单位国家级icon_02_gj，省级icon_03_sj
// 水电站icon_17
// 千人以上icon_15
// 泵站icon_23
// 水闸icon_24
// 河湖取水口icon_25
// 入河排污口icon_21
// 地表水源icon_18
// 河长公示牌icon_07
var layerName_arr = [
	"icon_13_dx2",
	"icon_13_zx2",
	"icon_zxgq",
	"icon_22",
	"icon_16",
	"icon_04",
	"icon_05",
	"hdcz_shuiweizhan",
	"icon_12",
	"icon_02_gj",
	"icon_03_sj",
	"icon_17",
	"icon_15",
	"icon_23",
	"icon_24",
	"icon_25",
	"icon_21",
	"icon_18",
	"icon_07",
	"searchLayer",
	"searchLayers",
];
selectFun(layerName_arr);

/**
 * @description 搜索框
 */
var dataUrls = $(".search_frame").attr("data-url");

function soFun(self) {
	//清除地图动画
	$("#marker").hide();
	// 清除类型样式
	$(".position").css("display", "none");
	$(".map_type_box .item_type").css("border", "none");
	$(".position_ul li").removeClass().find("span:last-child").css("display", "none");
	//选中效果
	if ($(self).parent().hasClass("active")) {
		$(self).parent().removeClass("active");
	} else {
		$(self).parent().addClass("active");
	}
	//还原中心点
	resetCZ();
	//清空搜索框
	$(".li_input").val("");
	//清除搜索地图渲染
	if (waterQualitylayers["searchLayer"]) {
		waterQualitylayers["searchLayer"].getSource().clear();
		map.removeLayer(waterQualitylayers["searchLayer"]);
	}
	if (waterQualitylayers["searchLayers"]) {
		waterQualitylayers["searchLayers"].getSource().clear();
		map.removeLayer(waterQualitylayers["searchLayers"]);
	}
	var that = $(self);
	if (that.hasClass("active")) {
		that.removeClass("active");
		$(".search_frame").css("display", "none");
	} else {
		that.addClass("active");
		$(".search_frame").css({
			display: "block",
			height: "76%"
		});
		$(".search_frame .icon_arrow").css("transform", "rotateZ(180deg)");
		$(".icon_arrow").removeClass("activei");
	}
	var val = $(".li_input").val();
	mui(".search_frame_inner").pullRefresh().refresh(true);
	page = 1;
	pageStaus = true;
	search_tipshighlight(dataUrls, page, "searchLayers", val);
}

function searchFun() {
	$("#marker").hide();
	var val = $(".li_input").val();
	if (val == "") {
		plus.nativeUI.toast("请输入关键字");
		return false;
	}
	//还原中心点
	resetCZ();
	//列表点击选中缩放列表框
	$(".search_frame").css("height", "1.8rem");
	$(".search_frame .icon_arrow").css("transform", "rotateZ(360deg)");
	$(".icon_arrow").addClass("activei");
	//清除搜索地图图层
	if (waterQualitylayers["searchLayer"]) {
		waterQualitylayers["searchLayer"].getSource().clear();
		map.removeLayer(waterQualitylayers["searchLayer"]);
	}
	if (waterQualitylayers["searchLayers"]) {
		waterQualitylayers["searchLayers"].getSource().clear();
		map.removeLayer(waterQualitylayers["searchLayers"]);
	}
	var param_str = "param_str";
	jc_info_fun(10086, "api/v3/es_search/map", "searchLayer", val, param_str);
}

// 聚焦隐藏类型列表
// $(".li_div .li_input").focus(function () {
//     $(".position").css("display", "none");
//     $(".map_type_box .item_type").css("border", "none");
// });
// oninput="debounce(myFunction,500)"
// 防抖
function debounce(fun, wait = 1500) { //ES6语法 wait=1500 设置参数默认值，如果没有输入wait就会使用1500
	console.log(wait);
	let timeout = null
	return function() {
		if (timeout) { //如果存在定时器就清空
			clearTimeout(timeout)
		}
		timeout = setTimeout(function() {
			fun()
		}, wait)
	}

}
document.getElementById('li_input').addEventListener('input',debounce(myFunction,500))
function myFunction() {
	console.log("111111")
	$(".search_frame_list span").css("color", "#999999").attr("class", "");
	var val = $(".li_input").val();
	if (val != "") {
		$(".search_frame").css({
			display: "block",
			height: "76%"
		});
		$(".search_frame .icon_arrow").css("transform", "rotateZ(180deg)");
		$(".icon_arrow").removeClass("activei");
	} else {
		// $('.search_frame').css("display","none");
	}
	//pullup-container为在mui.init方法中配置的pullRefresh节点中的container参数；
	//注意：refresh()中需传入true
	mui(".search_frame_inner").pullRefresh().refresh(true);
	page = 1;
	pageStaus = true;
	search_tipshighlight(dataUrls);
}

$(".icon_arrow").on(clickStr, function() {
	$("#marker").hide();
	if ($(this).hasClass("activei")) {
		$(".search_frame").css("height", "76%");
		$(".search_frame .icon_arrow").css("transform", "rotateZ(180deg)");
		$(this).removeClass("activei");
		if (!$(".so_li_box a").hasClass("active")) {
			$(".so_li_box a").addClass("active");
		}
	} else {
		$(".search_frame").css("height", "1.8rem");
		$(".search_frame .icon_arrow").css("transform", "rotateZ(360deg)");
		$(this).addClass("activei");
		if ($(".so_li_box a").hasClass("active")) {
			$(".so_li_box a").removeClass("active");
		}
	}
});

// 大中型灌区弹窗
function callAddPopup(obj) {
	var root = localStorage.getItem("str_url");
	var token = localStorage.getItem("token");
	console.log(JSON.stringify(obj));
	var popData = {
		token: token,
	};
	// 大型灌区shp_irrigation
	if (obj.className_ == "shp_irrigation") {
		var _url = root + "api/v4/rural_irrigation/large_tips";
		popData.name = obj.item_info.name;
	}
	// 中型灌区shp_medium_irr
	if (obj.className_ == "shp_medium_irr") {
		var _url = root + "api/v4/rural_irrigation/irrigation_tips";
		popData.id = obj.item_info.Id;
	}

	plus.nativeUI.showWaiting("位置信息获取中...");
	console.log(_url);
	console.log(JSON.stringify(popData));
	mui.ajax(_url, {
		data: popData,
		datatype: "json", //服务器返回json格式数据
		type: "post", //HTTP请求类型
		success: function(data) {
			console.log(JSON.stringify(data));
			plus.nativeUI.closeWaiting();
			// plus.nativeUI.showWaiting(JSON.stringify(data.data));
			if (data.data == "") {
				plus.nativeUI.toast("暂无弹窗信息");

				// 大型灌区shp_irrigation
				if (obj.className_ == "shp_irrigation") {
					xiangqing(obj.item_info.layer, obj.item_info);
				}
				// 中型灌区shp_medium_irr
				if (obj.className_ == "shp_medium_irr") {
					xiangqing(obj.className_, obj.item_info.Id);
				}
				return false;
			}
			// addPopup(item_info, vectorLayers, layers)

			// 大型灌区shp_irrigation
			if (obj.className_ == "shp_irrigation") {
				var vectorLayers = {
					className_: obj.item_info.layer
				};
			}
			// 中型灌区shp_medium_irr
			if (obj.className_ == "shp_medium_irr") {
				var vectorLayers = {
					className_: obj.className_
				};
			}
			addPopup(data.data.result, vectorLayers, "");
		},
		error: function(xhr, type, errorThrown) {
			console.log("error");
			plus.nativeUI.closeWaiting();
			plus.nativeUI.toast("网络不稳定，请检查网络");
		},
	});
}

// 还原中心点
function resetCZ() {
	map.getView().setCenter(map_info_obj.center || [112.387029, 37.872418]);
	map.getView().setZoom(map_info_obj.zoom || 6.8);
}
// 动画还原中心点
function resetAnimate() {
	map.getView().animate({
		zoom: map_info_obj.zoom || 6.8,
		center: map_info_obj.center || [112.387029, 37.872418],
	});
}
