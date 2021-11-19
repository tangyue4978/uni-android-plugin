// 管理对象显示隐藏
var clickStr = mui.os.ios ? "tap" : "click";
$("body").on(clickStr, ".nav_ul_box .isShow", function () {
    var objItem = $(this).attr("data-type");
    if (objItem && objItem !== undefined) {
        if ($(this).hasClass("active")) {
            $("#" + objItem).removeClass("active");
            $(this).removeClass("active");
        } else {
            $("#" + objItem).addClass("active");
            $(this).addClass("active");
        }
    }
});
// 是否选中管理对象
$("body").on(clickStr, ".list_ul .list_li", function (e) {
    e.stopPropagation();
    e.preventDefault();

    // 修改右侧对应选中状态
    let liName = $(this).attr("data-qname");
    let $li = $(".right_bar_center ul li[data-qname='" + liName + "']");
    // let itemId = $(this).attr("data-id");
    if ($(this).hasClass("active")) {
        // $(`.tips_wrap .${liName}`).remove();
        $(this).removeClass("active");
        $li.removeClass("active");
    } else {
        $(this).addClass("active");
        $li.addClass("active");
    }
    isLayers($(this));
});
// 点击隐藏信息
$("body").on(clickStr, ".list_box", function () {
    event.stopPropagation();
    event.preventDefault();
    $(this).removeClass("active");
    $(".nav_ul_box .nav_li_item").removeClass("active");
});

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

// 控制显示隐藏「
function isLayers(that) {
    // 切换管理对象的时候清除所有的弹出层
    map.getOverlays().clear();
    //还原中心点
    resetCZ()
    var activeStatus = that.hasClass("active");
    var itemQname = that.attr("data-qname");
    // var itemType = that.attr("data-type");
    var itemId = that.attr("data-id");
    if (activeStatus) {
        //渲染当前图层
        if (waterQualitylayers[itemQname] != undefined) {
            waterQualitylayers[itemQname].setVisible(true);
        } else {
            plus.nativeUI.showWaiting("数据加载中...");
            var param_str = 'data-qname="' + that.attr("data-qname") + '"';
            jc_info_fun(itemId, itemQname, param_str);
        }
    } else {
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
    jc_info_fun(5, "rivers_guojialevle", 'data-qname="rivers_guojialevle"');
});
//取用水户列表api
function jc_info_fun(type, layersname, param_str) {
    plus.nativeUI.showWaiting("数据加载中...");
    var _url = root + "api/v3/licence/mapNew";

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
            city_dian_fun(data.data.data, layersname);

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
			for(let i=0;i<data.data.rightStatistics.length;i++){
				$('.right_bar .right_bar_center ul .list_li .counts').eq(i).html(data.data.rightStatistics[i].count)
			}
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
    var images = feature.values_.item.image;

    var item = feature.values_.item;
    var zoom = map.getView().getZoom();
    var opacity = 1;
    var scale = scale = 0.5 + (zoom/9 - 1);;
    if (zoom < 9) {
        text = "";
    }
   /* if (!item.type_zoom || item.type_zoom <= zoom) {
    } else {
        text = "";
        // opacity = 4 / item.type_zoom / 2;
        scale = 0.5 + (zoom/9 - 1);
    } */
    //返回一个样式
    var iconStyle = new ol.style.Style({
        image: new ol.style.Icon({
            opacity: opacity,
            scale: scale,
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
    var vectorSource = new ol.source.Vector({});
    var pointArr = arr;
    for (var i = 0; i < pointArr.length; i++) {
        var item_info = pointArr[i];
        var feature = new ol.Feature({
            geometry: new ol.geom.Point([item_info.lng, item_info.lat]),
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
];
selectFun(layerName_arr, -90);

// tips提示框 x点击事件
function del_tips(that) {
    let liName = $(that).parent().attr("data-qname");
    let $li = $(".right_bar_center ul li");
    // 管理对象li列表
    let $admin_li = $(".list_ul .list_li");

    for (let i = 0; i < $li.length; i++) {
        let liAttr = $li.eq(i).attr("data-qname");
        if (liAttr === liName) {
            $li.eq(i).removeClass("active");
        }
    }
    $(that).parent().remove();

    for (let i = 0; i < $admin_li.length; i++) {
        if ($admin_li.eq(i).attr("data-qname") === liName) {
            let quitQname = $(".list_li").eq(i).attr("data-qname");
            if (waterQualitylayers[quitQname] != undefined) {
                map.removeLayer(waterQualitylayers[quitQname]);
                waterQualitylayers[quitQname] = undefined;
            }
        }
    }
}

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