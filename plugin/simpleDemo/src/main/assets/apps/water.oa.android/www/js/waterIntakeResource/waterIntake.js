// 管理对象显示隐藏
var clickStr = mui.os.ios ? "tap" : "click";
$("body").on(clickStr, ".nav_ul_box .isShow", function () {
    var objItem = $(this).attr("data-type");
    if (objItem && objItem !== undefined) {
        if ($(this).hasClass("active")) {
            // $("#" + objItem).removeClass("active");
            // $(this).removeClass("active");
        } else {
            clearLayersAll();
            if (objItem == "change_map_dxs") {
                dxsInit();
            } else {
                qyshInit();
            }
        }
    }
});
// 返回全图方法
function resetMap() {
    clearLayersAll();
    let topNavName = $(".top_nav .nav_ul_box li.active").attr("data-type");
    if (topNavName === "change_map_dxs") {
        dxsInit();
    } else {
        qyshInit();
    }
}
// 地下水初始化地图方法
function dxsInit() {
    $(".nav_ul_box .isShow[data-type = change_map_dxs]").addClass("active");
    $(".nav_ul_box .isShow[data-type = change_map_qysh]").removeClass("active");
    $(".change_map_dxs").css("display", "flex");
    $(".change_map_qysh").css("display", "none");
    $(".right_bar .right_bar_center").addClass("heightauto");
    jc_info_fun(2, "dxsjcz", 'data-qname="dxsjcz"', "api/v3/water_rain_condition/map");
    $(".right_bar ul li[data-qname=dxsjcz]").addClass("active");
}
// 取用水户初始地图化方法
function qyshInit() {
    $(".nav_ul_box .isShow[data-type = change_map_dxs]").removeClass("active");
    $(".nav_ul_box .isShow[data-type = change_map_qysh]").addClass("active");
    $(".change_map_dxs").css("display", "none");
    $(".change_map_qysh").css("display", "flex");
    $(".right_bar .right_bar_center").removeClass("heightauto");
    jc_info_fun(5, "rivers_guojialevle", 'data-qname="rivers_guojialevle"', "api/v3/licence/mapNew");
    $(".right_bar ul li[data-qname=rivers_guojialevle]").addClass("active");
}

// 清除相关数据
function clearLayersAll() {
    $(".tips_wrap").html(""); //清除tips提示
    $(".right_bar .right_bar_center ul li").removeClass("active"); //清除tips提示
    // 清除不相关图层
    for (var i = map.getLayers()["array_"].length - 1; i > 5; i--) {
        map.removeLayer(map.getLayers()["array_"][i]);
    }
    map.getOverlays().clear();
    //还原中心点
    resetCZ()
}

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
                    resolutions: [
                        0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125,
                        0.0054931640625, 0.00274658203125, 0.001373291015625, 0.0006866455078125, 0.00034332275390625,
                        0.000171661376953125, 8.58306884765625e-5, 4.291534423828125e-5, 2.1457672119140625e-5,
                    ],
                    matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
                }),
            }),
            visible: item.visibility,
            // visible:false,
            className: item.name,
            // source: new ol.source.OSM(),
            projection: "EPSG:4326",
        });
        map.addLayer(waterQualitylayers[item.name]);
    } else {
        // 一级河流
        waterQualitylayers[item.name] = new ol.layer.Vector({
            source: new ol.source.Vector({
                url: item.jsonUrl, //从文件加载一级河流
                format: new ol.format.GeoJSON(),
            }),
            visible: item.visibility,
            className: item.name,
            projection: "EPSG:4326",
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: item.bgcolor,
                }),
                stroke: new ol.style.Stroke({
                    color: item.color,
                    width: item.width,
                }),
            }),
        });
        map.addLayer(waterQualitylayers[item.name]);
    }
}
var layersInfo = [
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
        type_id: ["bigwaternetwork"],
        tname: "山西边界",
        listshow: false,
        name: "shanxiBoundary1",
        width: 1,
        visibility: true,
        bgcolor: "rgba(255,255,255,0)",
        color: "#aaaaaa",
        jsonUrl: "../../js/ruralWater/shanxi.json",
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
];
for (var i = 0; i < layersInfo.length; i++) {
    waterQuality(layersInfo[i]);
}
// 控制地图显示隐藏
$("body").on(clickStr, ".right_bar .change_map_dxs", function () {
    var that = $(this);
    var activeStatus = that.hasClass("active");
    activeStatus ? that.removeClass("active") : that.addClass("active");
    isLayers(that);
});
$("body").on(clickStr, ".right_bar .change_map_qysh", function () {
    var that = $(this);
    if (that.attr("data-listatus") == 1) {
        // 页面跳转不执行后面的接口调用方法
        return false;
    }
    var activeStatus = that.hasClass("active");
    activeStatus ? that.removeClass("active") : that.addClass("active");
    isLayers(that);
});
// 控制地图显示隐藏 end
// 控制显示隐藏「
function isLayers(that) {
    // 切换管理对象的时候清除所有的弹出层
    map.getOverlays().clear();
	//还原中心点
    resetCZ()
    var activeStatus = that.hasClass("active");
    // activeStatus ? that.removeClass("active") : that.addClass("active")
    var itemQname = that.attr("data-qname");
    // var itemType = that.attr("data-type");
    var itemId = that.attr("data-id");
    console.log(activeStatus);
    if (activeStatus) {
        // activeStatus ? that.removeClass("active") : that.addClass("active")
        //渲染当前图层
        // if (waterQualitylayers[itemQname] != undefined) {
        //     waterQualitylayers[itemQname].setVisible(true);
        // } else {
        plus.nativeUI.showWaiting("数据加载中...");
        var param_str = 'data-qname="' + that.attr("data-qname") + '"';
        if (that.hasClass("change_map_dxs")) {
            var url = "api/v3/water_rain_condition/map";
        }
        if (that.hasClass("change_map_qysh")) {
            var url = "api/v3/licence/mapNew";
        }
        jc_info_fun(itemId, itemQname, param_str, url);
        // }
    } else {
        // activeStatus ? that.removeClass("active") : that.addClass("active")
        if (waterQualitylayers[itemQname] != undefined) {
            map.removeLayer(waterQualitylayers[itemQname]);
            waterQualitylayers[itemQname] = undefined;
            // 清除当前选择弹框
            $(".tips_wrap")
                .find(".tips_item[data-qname = '" + that.attr("data-qname") + "']")
                .remove();
        }
    }
}

// 获取基础信息
var root = localStorage.getItem("str_url");
console.log(root);
if (root == "" || root == undefined || root == null) {
    mui.openWindow({
        url: "login.html?cid=1", //通过URL传参
        id: "login.html?cid=1", //通过URL传参
    });
}
var token = localStorage.getItem("token");
mui.plusReady(function () {
    plus.nativeUI.showWaiting("数据加载中...");
    // jc_info_fun(5, "rivers_guojialevle",'data-qname="rivers_guojialevle"',"api/v3/licence/mapNew");
    jc_info_fun(2, "dxsjcz", 'data-qname="dxsjcz"', "api/v3/water_rain_condition/map");
});
//取用水户列表api
function jc_info_fun(type, layersname, param_str, url) {
    plus.nativeUI.showWaiting("数据加载中...");
    var _url = root + url;
	console.log(_url);
	console.log("token="+token+";type="+ type);
    mui.ajax(_url, {
        data: {
            token: token,
            type: type,
        },
        datatype: "json", //服务器返回json格式数据
        type: "post", //HTTP请求类型
        success: function (data) {
            plus.nativeUI.closeWaiting();
            if (data.data == "") {
                plus.nativeUI.toast("暂无搜索结果");
                return false;
            }
            var dataArr = data.data.data || data.data.result_data;
            city_dian_fun(dataArr, layersname);

            if (data.data.searchData) {
                $(".tips_wrap").append(`
					<div class="tips_item" ${param_str}>
						<span class="tips_title">当前选择:&nbsp;</span>
						<span class="tips_text">${data.data.searchData}</span>
						<span class="wrong" onclick="del_tips(this)">×</span>
					</div>
				`);
            }
			
			// 处理侧边栏添加数量
			console.log(layersname)
			if(layersname == 'dxsjcz'){
				// 地下水
				$('.right_bar .right_bar_center ul .change_map_dxs .counts').html(data.data.stage_type[0].count)
			}else{
				console.log(JSON.stringify(data.data.rightStatistics))
				for(let i=0;i<data.data.rightStatistics.length;i++){
					$('.right_bar .right_bar_center ul .change_map_qysh .counts').eq(i).html(data.data.rightStatistics[i].count)
				}
			}
			// 取用水户
		},
        error: function (xhr, type, errorThrown) {
            console.log("error");
            plus.nativeUI.closeWaiting();
            plus.nativeUI.toast("网络不稳定，请检查网络");
        },
    });
}
// 基础信息 end

// 详情方法
function xiangqing(classname, id) {
    switch (classname) {
        case "rivers_guojialevle": //国家级
        case "rivers_shenlevle": //省级
        case "rivers_dazhongguanqu": //大中型灌区
        case "rivers_meikuangkaicaipaishui": //煤矿开采排水
        case "rivers_rongyandaquanqushui": //岩溶大泉取水
        case "rivers_other": //其他
            mui.openWindow({
                url: "waterIntake_detail.html", //通过URL传参
                id: "waterIntake_detail.html", //通过URL传参
                extras: {
                    item_id: id,
                },
            });
            break;
        case "dxsjcz":
            mui.openWindow({
                url: "/pages/waterLove_old/details.html", //通过URL传参
                id: "/pages/waterLove_old/details.html", //通过URL传参
                extras: {
                    item_id: id,
                },
            });
            break;
        default:
            break;
    }
}
// 点击跳转水电站详情
// map.on('click', function(e) {
// 	//在点击时获取像素区域
// 	var pixel = map.getEventPixel(e.originalEvent);
// 	console.log(pixel)
// 	map.forEachFeatureAtPixel(pixel, function(feature, vectorLayers) {
// 		var coodinate = e.coordinate;
// 		console.log(coodinate);
// 		console.log(vectorLayers.className_);
// 		if (vectorLayers.className_ != "shanxi_boundary") {
// 			var item_info = feature.values_;
// 			console.log("----------" + JSON.stringify(item_info))
// 			xiangqing(vectorLayers.className_, item_info);
// 		} else {
// 			console.log(e.coordinate);
// 		}
// 	});
// });
// 地图信息 end

// 坐标组
/**
 * @param {Object} feature
 * @description 创建标签的样式
 */
function iconStyle_set(feature) {
    // console.log(JSON.stringify(feature));
    var text = feature.values_.name;
    var images = feature.values_.item.image || feature.values_.item.icon;

    var item = feature.values_.item;
    var zoom = map.getView().getZoom();
    var opacity = 1;
    var scale;
    // if (zoom < 9) {
    //     text = "";
    // }
    // if (!item.type_zoom || item.type_zoom <= zoom) {
    // } else {
    //     text = "";
    //     opacity = 4 / item.type_zoom / 2;
    //     scale = 0.4;
    // }
    //返回一个样式
    var iconStyle = new ol.style.Style({
        image: new ol.style.Icon({
            opacity: opacity,
            scale: calcScaleFun(0.45,1),
            src: images,
        }),
        text: new ol.style.Text({
            font: "12px sans-seri",
            // text: String(text),
            fill: new ol.style.Fill({
                color: "#2EA2F5",
            }),
            offsetY: 20,
            stroke: new ol.style.Stroke({
                color: feature.values_.item.stroke || "#ffffff",
                width: feature.values_.item.stroke_width || 2,
            }),
            // backgroundFill: new ol.style.Fill({
            // 	color: '#ffffff'
            // })
        }),
    });

    return iconStyle;
}
// 点的位置
function city_dian_fun(arr, layername) {
    console.log(arr.length);
    var vectorSource = new ol.source.Vector({});
    var pointArr = arr;
    var lng;
    var lat;
    for (var i = 0; i < pointArr.length; i++) {
        var item_info = pointArr[i];
        lng = item_info.lng || item_info.lg;
        lat = item_info.lat || item_info.lt;
        var feature = new ol.Feature({
            geometry: new ol.geom.Point([lng, lat]),
            name: item_info.applicant_name,
            item: item_info,
        });
        vectorSource.addFeature(feature);

        //为点要素添加样式
        // feature.setStyle(iconStyle_set(feature));
    }

    //创建图标层
    waterQualitylayers[layername] = new ol.layer.Vector({
        source: vectorSource,
        style: iconStyle_set,
        className: layername,
    });
    map.addLayer(waterQualitylayers[layername]); //市级
}

var layerName_arr = [
    "rivers_guojialevle",
    "rivers_shenlevle",
    "rivers_dazhongguanqu",
    "rivers_meikuangkaicaipaishui",
    "rivers_rongyandaquanqushui",
    "rivers_other",
    "dxsjcz",
];
selectFun(layerName_arr, -90);

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