var clickStr = mui.os.ios ? "tap" : "click";
// 信息显示
$("body").on(clickStr, ".search_header_boxs .icon_arrows", function () {
    if ($(this).hasClass("active")) {
        $(this).removeClass("active");
        $(".search_header_boxs .search_table_box").removeClass("active");
    } else {
        $(this).addClass("active");
        $(".search_header_boxs .search_table_box").addClass("active");
    }
});

// 小时切换
$("body").on(clickStr, ".tab_type .span", function () {
    // 切换管理对象的时候清除所有的弹出层
    map.getOverlays().clear();
    map.getView().animate({
        zoom: 6.8,
        center: [112.387029, 37.872418],
    });
    $(".rightTabs .tab_type div").removeClass("show");
    $(".rightTabs .tab_type div").addClass("hide");
    $(".mui-icon").removeClass("mui-icon-arrowup");
    $(".mui-icon").addClass("mui-icon-arrowdown");
    $(".tab_type .span").removeClass("active");
    // $(".tab_type .point .span").addClass("active");
    $(this).addClass("active");
    var list_item = $(".top_nav .nav_ul_box #jiangshui");
    var id = list_item.attr("data-id");
    var itemQname = list_item.attr("data-qname");

    try {
        waterQualitylayers[itemQname].getSource().clear();
        map.removeLayer(waterQualitylayers[itemQname]);
        map.removeLayer(waterQualitylayers[itemQname + "_1"]);
    } catch (e) {
        //TODO handle the exception
    }
    var param_str = 'data-qname="' + $(this).attr("data-qname") + '"';
    jc_info_fun2(id, itemQname, param_str);
});

// 添加河流信息
// 添加河流信息
function waterQuality(item) {
    // 一级河流
    // point点，默认面，线信息
    if (item.datatype == "point") {
        $.ajaxSettings.async = false; // 设置getJson同步
        var geojsonObject = $.getJSON(item.jsonUrl, function (res) {
            console.log(JSON.stringify(res));
            var vectorSource = new ol.source.Vector({});
            for (var i = 0; i < res.features.length; i++) {
                var item_info = res.features[i];
                var feature = new ol.Feature({
                    geometry: new ol.geom.Point(item_info.geometry.coordinates),
                    name: item_info.properties.name,
                    item: item,
                    item_info: item_info,
                });
                vectorSource.addFeature(feature);
                //为点要素添加样式
                feature.setStyle(point_set(feature));
            }

            waterQualitylayers[item.name] = new ol.layer.Vector({
                source: vectorSource,
                visible: item.visibility,
                // visible:false,
                className: item.name,
                projection: "EPSG:4326",
            });
            map.addLayer(waterQualitylayers[item.name]);
        });
    } else if (item.datatype == "WMTS") {
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
        waterQualitylayers[item.name] = new ol.layer.Vector({
            source: new ol.source.Vector({
                url: item.jsonUrl, //从文件加载一级河流
                format: new ol.format.GeoJSON(),
            }),
            visible: item.visibility,
            // visible:false,
            className: item.name,
            projection: "EPSG:4326",
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: item.bgcolor,
                    width: item.width,
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

//加载geoserver的WMTS服务
waterQualitylayers["jiangshuiBase"] = new ol.layer.Tile({
    source: new ol.source.WMTS({
        name: "中国矢量1-4级",
        url: "http://t0.tianditu.gov.cn/vec_c/wmts?tk=470a3cb94a3196e6c324a42bf6afcb77",
        layer: "vec",
        style: "default",
        matrixSet: "c",
        format: "tiles",
        wrapX: true,
        tileGrid: new ol.tilegrid.WMTS({
            origin: ol.extent.getTopLeft(projectionExtent),
            //resolutions: res.slice(0, 15),
            resolutions: resolutions,
            matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        }),
    }),
});
map.addLayer(waterQualitylayers["jiangshuiBase"]);
waterQualitylayers["jiangshuiBase"].setVisible(false);
for (var i = 0; i < layersInfo.length; i++) {
    // console.log(JSON.stringify(layersInfo[i]))
    waterQuality(layersInfo[i]);
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
mui.plusReady(function () {
    plus.nativeUI.showWaiting("数据加载中...");
    // jc_info_fun(1,"hdcz");
    jc_info_fun(2, "dxsjcz", 'data-qname="dxsjcz"');

    // jc_info_fun(3,"hdsq_cbzsw");
    // jc_info_fun(4,"hdsq_cjjsw");
});
//河道水位站地图坐标
function jc_info_fun(type, layersname, param_str) {
    console.log(type, layersname);
    var _url = root + "api/v3/water_rain_condition/map";
    console.log(_url);

    var datainfo = {
        token: map_info_obj.token,
        type: type,
        // "map_level": map_info_obj.map_level,
        center_lon: map_info_obj.center[0],
        center_lat: map_info_obj.center[1],
    };
    console.log(JSON.stringify(datainfo));
    mui.ajax(_url, {
        data: datainfo,
        datatype: "json", //服务器返回json格式数据
        type: "post", //HTTP请求类型
        success: function (data) {
            console.log("========" + JSON.stringify(data));
            plus.nativeUI.closeWaiting();
            if (data.code == 1) {
                if (data.data.result_data == "") {
                    plus.nativeUI.toast("暂无搜索结果");
                    return false;
                }
                city_dian_fun(data.data.result_data, layersname);
                console.log(JSON.stringify(data.data.searchData));
                if (data.data.searchData) {
                    $(".tips_wrap").append(`
                		<div class="tips_item" ${param_str}>
                			<span class="tips_title">当前选择:&nbsp;</span>
                			<span class="tips_text">${data.data.searchData}</span>
                			<span class="wrong" onclick="del_tips(this)">×</span>
                		</div>
                	`);
                }

                // city_dian_fun(map_info_obj.totalData[layersname],layersname);
                // 图例
                // $('.map_legend_img').attr('src', data.data.legend)
                // $('.map_legend').css('bottom', $('.search_frameJs').outerHeight() + 10 + 'px')
            } else {
                plus.nativeUI.toast(data.msg);
                console.log(JSON.stringify(data.data.searchData));
                if (data.data.searchData) {
                    $(".tips_wrap").append(`
                		<div class="tips_item" ${param_str}>
                			<span class="tips_title">当前选择:&nbsp;</span>
                			<span class="tips_text">${data.data.searchData}</span>
                			<span class="wrong" onclick="del_tips(this)">×</span>
                		</div>
                	`);
                }
            }
        },
        error: function (xhr, type, errorThrown) {
            console.log("error");
            plus.nativeUI.closeWaiting();
            plus.nativeUI.toast("网络不稳定，请检查网络");
        },
    });
}

//河道水位站地图坐标
function jc_info_fun2(type, layersname, param_str) {
    var _url = root + "api/v4/water_rain_condition/precipitation";
    // var _url = root + "api/v3/water_rain_condition/precipitation";
    var status = $(".tab_type .span.active").attr("data-status") || "";
    var datainfo = {
        token: map_info_obj.token,
        type: type,
        hour_type: status,
    };
    console.log(_url);
    console.log(JSON.stringify(datainfo));
    mui.ajax(_url, {
        data: datainfo,
        datatype: "json", //服务器返回json格式数据
        type: "post", //HTTP请求类型
        success: function (data) {
            console.log(JSON.stringify(data));
            plus.nativeUI.closeWaiting();
            if (data.code == 1) {
                //console.log(JSON.stringify(data));
                if (data.data == "") {
                    plus.nativeUI.toast("暂无搜索结果");
                    return false;
                }
                //修复在地图中增加按数值区域范围显示分布图
                try {
                    //gethottu(data.data.diagram, layersname + "_1");
                } catch (e) {
                    //TODO handle the exception
                }

                // gethottu(data.data.diagram,layersname+"_1");
                // 监测站数据显示
                city_dian_fun2(data.data.result, layersname);
                if (data.data.searchData) {
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
                //console.log($('.search_frameJs').outerHeight())
                $(".map_legend_img").attr("src", data.data.legend);
                $(".map_legend").css("bottom", $(".search_frameJs").outerHeight() + 10 + "px");
                $(".right_posi").css("bottom", $(".search_frameJs").outerHeight() + 10 + "px");
            } else {
                plus.nativeUI.toast(data.msg);
            }
        },
        error: function (xhr, type, errorThrown) {
            ////console.log('error');
            plus.nativeUI.closeWaiting();
            plus.nativeUI.toast("网络不稳定，请检查网络");
        },
    });
}

// 基础信息 end
// 详情方法

function xiangqing(classname, id) {
    switch (classname) {
        case "dxsjcz":
            mui.openWindow({
                url: "/pages/waterLove/details.html", //通过URL传参
                id: "/pages/waterLove/details.html", //通过URL传参
                extras: {
                    item_id: id,
                },
            });
            break;
        case "hdcz":
        case "hdsq_cbzsw":
        case "hdsq_cjjsw":
            mui.openWindow({
                url: "/pages/waterLove/details2.html", //通过URL传参
                id: "/pages/waterLove/details2.html", //通过URL传参
                extras: {
                    item_id: id,
                },
            });
            break;
        case "skcz":
            mui.openWindow({
                url: "/pages/waterLove/details3.html", //通过URL传参
                id: "/pages/waterLove/details3.html", //通过URL传参
                extras: {
                    item_id: id,
                },
            });
            break;
        case "jiangshui":
            mui.openWindow({
                url: "/pages/waterLove/waterLove_detail2.html", //通过URL传参
                id: "/pages/waterLove/waterLove_detail2.html", //通过URL传参
                extras: {
                    selectval: $(".top_nav .nav_ul_box #jiangshui").attr("data-id"),
                    status: $(".tab_type .span.active").attr("data-status") || "",
                    station_code: id,
                },
            });
            break;
        case "searchLayers":
        case "searchLayers1":
        case "searchLayer":
            console.log(arguments[2]);
            if (arguments[2] == 1) {
                mui.openWindow({
                    url: "/pages/waterLove/details3.html", //通过URL传参
                    id: "/pages/waterLove/details3.html", //通过URL传参
                    extras: {
                        item_id: id,
                    },
                });
            } else {
                mui.openWindow({
                    url: "/pages/waterLove/details2.html", //通过URL传参
                    id: "/pages/waterLove/details2.html", //通过URL传参
                    extras: {
                        item_id: id,
                    },
                });
            }
            break;
        default:
            break;
    }
}

var layerName_arr = ["skcz", "dxsjcz", "hdsq_cbzsw", "hdsq_cjjsw", "hdcz"];
selectFun(layerName_arr, -95);

var layerName_arr2 = ["hdcz,hdsq_cbzsw"];
selectFun(layerName_arr2, -95, "Circle", "rainfall_color");

var layerName_arr4 = ["searchLayers", "searchLayers1", "searchLayer"];
selectFun(layerName_arr4);
// 坐标组
/**
 * @param {Object} feature
 * @description 创建标签的样式
 */
function iconStyle_set(feature) {
    // console.log(JSON.stringify(feature.values_.item));
    var text = feature.values_.name;
    var images = feature.values_.item.icon;

    var item = feature.values_.item;
    var zoom = map.getView().getZoom();
    var opacity = 1;
    var scale = 0.6;
    if (!item.type_zoom || item.type_zoom <= zoom) {
    } else {
        text = "";
        opacity = 4 / item.type_zoom / 2;
        // if( item.type_zoom - zoom > 4){
        // 	opacity = 0;
        // }
        scale = 0.4;
    }
    //返回一个样式
    var iconStyle = new ol.style.Style({
        image: new ol.style.Icon({
            opacity: opacity,
            scale: scale,
            src: images,
        }),
        text: new ol.style.Text({
            font: "12px sans-seri",
            //text: String(text),
            fill: new ol.style.Fill({
                color: "#2EA2F5",
            }),
            offsetY: 20,
            stroke: new ol.style.Stroke({
                color: feature.values_.item.stroke || "#ffffff",
                width: feature.values_.item.stroke_width || 2,
            }),
            // ,
            // backgroundFill: new ol.style.Fill({
            // 	color: '#ffffff'
            // })
        }),
    });

    return iconStyle;
}

function iconStyle_set2(feature) {
    ////console.log(JSON.stringify(feature.values_.item));

    var item = feature.values_.item;
    var val = item.value || item.speed;
    var text = val + "\r\n" + item.station_name;
    // var images = feature.values_.item.icon;
    var zoom = map.getView().getZoom();
    var opacity = 1;
    var scale = 0.6;
    // if (!item.type_zoom || item.type_zoom <= zoom) {

    // } else {
    // 	text = "";
    // 	opacity = 4 / item.type_zoom / 2;
    // 	if (item.type_zoom - zoom > 1) {
    // 		opacity = 0;
    // 	}
    // 	scale = 0.4;
    // }
    if (item.layername == "fengxiangfengsu") {
        var styleImage = new ol.style.Icon({
            opacity: opacity,
            scale: 0.3,
            rotation: item.direction,
            src: item.image,
        });
    } else {
        var styleImage = new ol.style.Circle({
            radius: map.getView().getZoom() / 3,
            fill: new ol.style.Fill({
                color: item.rainfall_color,
            }),
            stroke: new ol.style.Stroke({
                color: "#747576",
                width: 1,
            }),
        });
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
            font: "12px sans-seri",
            //text: String(text),
            fill: new ol.style.Fill({
                color: item.t_color || "#2EA2F5",
            }),
            offsetY: 20,
            stroke: new ol.style.Stroke({
                color: item.stroke || "#ffffff",
                width: feature.values_.item.stroke_width || 2,
            }),
            // ,
            // backgroundFill: new ol.style.Fill({
            // 	color: '#ffffff'
            // })
        }),
    });

    return iconStyle;
}

// 水电站位置

function city_dian_fun(arr, layername) {
    var vectorSource = new ol.source.Vector({}); //创建数据源
    var pointArr = arr;
    var lng;
    var lat;
    for (var i = 0; i < pointArr.length; i++) {
        var item_info = pointArr[i];
        lng = item_info.lng || item_info.lg;
        lat = item_info.lat || item_info.lt;
        // console.log(JSON.stringify(item_info))
        var feature = new ol.Feature({
            geometry: new ol.geom.Point([lng, lat]),
            name: item_info.applicant_name,
            // code: item_info.code,
            item: item_info,
        });
        vectorSource.addFeature(feature);

        if (layername == "searchLayer") {
            console.log(layername);
            var items = {
                item: item_info,
            };
            map.getOverlays().clear();
            var vectorLayers = { className_: layername };
            addPopup(items, vectorLayers, -125);
        }

        //为点要素添加样式
        // feature.setStyle(iconStyle_set(feature,layername));
    }

    //创建图标层
    // 普通map渲染模式
    waterQualitylayers[layername] = new ol.layer.Vector({
        source: vectorSource,
        style: iconStyle_set,
        className: layername,
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

// 水电站位置
function city_dian_fun2(arr, layername) {
    var vectorSource = new ol.source.Vector({}); //创建数据源
    var pointArr = arr;
    for (var i = 0; i < pointArr.length; i++) {
        var item_info = pointArr[i];
        item_info.layername = layername;
        //console.log(JSON.stringify(item_info))
        var feature = new ol.Feature({
            geometry: new ol.geom.Point([item_info.lng, item_info.lat]),
            name: item_info.area_name,
            // code: item_info.code,
            item: item_info,
        });
        vectorSource.addFeature(feature);

        //为点要素添加样式
        // feature.setStyle(iconStyle_set(feature,layername));
    }

    //创建图标层
    // 普通map渲染模式
    waterQualitylayers[layername] = new ol.layer.Vector({
        source: vectorSource,
        style: iconStyle_set2,
        className: layername,
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
$("body").on(clickStr, ".nav_ul_box .invisible", function () {
    map.removeLayer(waterQualitylayers["jiangshui_1"]);
    map.removeLayer(waterQualitylayers["jiangshui"]);
    waterQualitylayers["jiangshui"] = undefined;
    map.removeLayer(waterQualitylayers["rgba"]);
    $(this).addClass("dataActives").next().removeClass("dataActives");
    // 隐藏管理对象选中图层
    var item = $(".list_ul .list_li");
    // item.eq(0).addClass('active');
    // $('.list_li:not(:first)').removeClass('active');
    for (let i = 0; i < item.length; i++) {
        // 清除当前选择弹框
        $(".tips_wrap").find(".tips_item[data-qname = 'jiangshui']").remove();
        if (item.eq(i).hasClass("active") && waterQualitylayers[item.eq(i).attr("data-qname")] == undefined) {
            console.log(item.eq(i).attr("data-qname"));
            console.log(item.eq(i).attr("data-id"));
            // map.removeLayer(waterQualitylayers[item.eq(i).attr('data-qname')]);
            plus.nativeUI.showWaiting("数据加载中...");
            var param_str = 'data-qname="' + item.eq(i).attr("data-qname") + '"';
            $(".tips_wrap").html("");
            jc_info_fun(item.eq(i).attr("data-id"), item.eq(i).attr("data-qname"), param_str);
        }
    }
    map.getView().animate({
        zoom: 6.8,
        center: [112.387029, 37.872418],
    });
    // 切换管理对象的时候清除所有的弹出层
    map.getOverlays().clear();
    //隐藏降水底图
    waterQualitylayers["jiangshuiBase"].setVisible(false);
    // 显示1~4级河流
    for (var i = 2; i < layersInfo.length; i++) {
        // console.log(JSON.stringify(layersInfo[i]))
        waterQualitylayers[layersInfo[i].name].setVisible(true);
    }
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

    // 切换导航栏的显示隐藏
    $(".section .right_bar .rainfall").css("display", "none");
    $(".change_map_mark").css("display", "flex");
    $(".right_posi").css("bottom", "6%");
    $(".right_bar_center ").scrollTop(0);

    $("#jiangshui").css("color", "black");
    $(".search_frameJs").removeClass("isShow");
    $(".search_frameJs").addClass("ishide");
    $(".map_legend").removeClass("isShow");
    $(".map_legend").addClass("ishide");
    $(".legend_section").removeClass("ishide");

    // 默认展开水情的图例
    $(".legend_h6").css("width", "auto");
    $(".legend_h6").find(".turn_img").css("transform", "rotate(180deg)");
    $(".legend_ul_box").css("display", "block");
    $(".legend_h6").find(".turn_text").text("水雨情");
});

// 是否选中管理对象
$("body").on(clickStr, ".list_ul .list_li", function (e) {
    e.stopPropagation();
    e.preventDefault();
    // for (let i = 0; i < $(".list_li").length; i++) {
    //     if (i != $(this).index()) {
    //         if ($(".list_li").eq(i).hasClass("active")) {
    //             $(".list_li").removeClass("active");
    //         }
    //     }
    // }
    // 修改右侧对应选中状态
    let liName = $(this).attr("data-qname");
    let $li = $(".right_bar_center ul li[data-qname='" + liName + "']");

    if ($(this).hasClass("active")) {
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

// 控制显示隐藏「
function isLayers(that) {
    // 切换管理对象的时候清除所有的弹出层
    map.getOverlays().clear();
    map.getView().animate({
        zoom: 6.8,
        center: [112.387029, 37.872418],
    });

    var activeStatus = that.hasClass("active");
    var itemQname = that.attr("data-qname");
    var itemId = that.attr("data-id");
    console.log(itemQname);
    console.log(itemId);
    if (activeStatus) {
        // 清除其他图层数据信息
        // for (var i = 0; i < $(".list_li").length; i++) {
        //     if ($(".list_li").eq(i).attr("data-id") != itemId) {
        //         var quitQname = $(".list_li").eq(i).attr("data-qname");
        //         console.log(quitQname);
        //         console.log(waterQualitylayers[quitQname]);
        //         if (waterQualitylayers[quitQname] != undefined) {
        //             map.removeLayer(waterQualitylayers[quitQname]);
        //             waterQualitylayers[quitQname] = undefined;
        //         }
        //         if (quitQname == "hdsq_cbzsw" || quitQname == "hdsq_cjjsw") {
        //             map.removeLayer(waterQualitylayers["dxsjcz"]);
        //             map.removeLayer(waterQualitylayers["hdcz"]);
        //             //map.removeLayer(waterQualitylayers[itemQname]);
        //         }
        //     }
        // }
        // if(waterQualitylayers[itemQname]["values_"]["source"] != undefined){
        // 	console.log(itemQname);
        // 	waterQualitylayers[itemQname].setVisible(true)
        // }else{
        plus.nativeUI.showWaiting("数据加载中...");
        var param_str = 'data-qname="' + that.attr("data-qname") + '"';
        jc_info_fun(itemId, itemQname, param_str);
        // }
    } else {
        if (waterQualitylayers[itemQname] != undefined) {
            // waterQualitylayers[itemQname].setVisible(false);
            // waterQualitylayers[itemQname].getSource().clear();
            map.removeLayer(waterQualitylayers[itemQname]);
        }
        // 清除当前选择弹框
        $(".tips_wrap")
            .find(".tips_item[data-qname = '" + that.attr("data-qname") + "']")
            .remove();
    }
    // }
}

map.getView().on("change:resolution", function () {
    mui(".search_frame_inner").pullRefresh().disablePullupToRefresh();
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
});
//添加比例尺
function AddScaleLint() {
    var scaleLineControl = new ol.control.ScaleLine({
        Units: "metric", //单位有5种：degrees imperial us nautical metric
    });

    map.addControl(scaleLineControl);
}

// AddScaleLint()

// map.on("moveend",function(){
// 	var listListActive = $("#managementObjects .list_ul .list_li.active");
// 	listListActive.each(function(index,item){
// 		var qname = $(item).attr("data-qname");
// 		var id = $(item).attr("data-id");
// 		console.log(qname,id);
// 		var itemQname = qname;
// 		var itemId = id;
// 		waterQualitylayers[itemQname].getSource().clear();
// 		map.removeLayer(waterQualitylayers[itemQname]);
// 		jc_info_fun(itemId,itemQname);
// 	})

// })

// 点击跳转水电站详情
map.on("click", function (e) {
    map.getOverlays().clear();
});
// 监测站状态信息描述与数据展示
function jczInfo_append(list) {
    if (list == "undefined" || list == "" || list == null) {
        $(".search_frameJs").css("display", "none");
        return false;
    } else {
        $(".search_frameJs").css("display", "block");
    }
    $(".search_title").html(list.highest);
    // list.list.Each(function(item,index){
    // 	//console.log(item,index)
    // })
    var headitem = list.head;
    console.log(headitem[0]);
    console.log(headitem[1]);
    console.log(headitem[2]);

    var item = list.data;
    //console.log(JSON.stringify(item));
    var tr_html = "";
    var type = $(".top_nav .nav_ul_box #jiangshui").attr("data-id");
    var hour_type = $(".tab_type .span.active").attr("data-status");
    var type_text = $(".top_nav .nav_ul_box #jiangshui").html();
    var status_text = $(".tab_type .span.active .bar_text").html();
    console.log(status_text);
    console.log(item);

    if (item != "") {
        $(".search_header_boxs .icon_arrows").css("display", "block").parent().css("height", "auto");
        var th_html = "";
        for (var i = 0; i < headitem.length; i++) {
            th_html += "<th>" + headitem[i] + "</th>";
        }
        console.log(th_html);
        $(".search_table_box .mui-table .head").html(th_html);
        for (var i = 0; i < item.length; i++) {
            var td_str = "";
            for (var j = 0; j < item[i].area.length; j++) {
                td_str += `<span class='set_span' data-code='${item[i].area[j].code}' onclick="xiangqing2('${type}','${hour_type}','${type_text}','${status_text}','${item[i].area[j].value}','${item[i].area[j].name}')">${item[i].area[j].name} </span>`;
            }
            if (td_str == "") {
                td_str = "无";
            }
            tr_html += `<tr>
						<td>${item[i].name}</td>
						<td>${td_str}</td>
						<td>${item[i].count}</td>
					</tr>`;
        }
    } else {
        $(".search_header_boxs .icon_arrows").css("display", "none").parent().css("height", "0.2rem");
    }
    $("#jsInfo").html(tr_html);
}

//修复在地图中增加按数值区域范围显示分布图
function gethottu(diagram, layersname) {
    // 图片信息
    //静态图片资源
    //console.log(JSON.stringify(diagram));
    let lonlat = [Number(diagram.minlon), Number(diagram.minlat), Number(diagram.maxlon), Number(diagram.maxlat)];
    let imgurl = diagram.imgurl;
    let source = new ol.source.ImageStatic({
        url: imgurl, //图片网址
        projection: "EPSG:4326", //投影
        imageExtent: lonlat, //图像坐标[minLon,minLat,maxLon,maxLat]
    });
    waterQualitylayers[layersname] = new ol.layer.Image({
        source: source, //该层的来源
        // zIndex:1,//图层渲染的Z索引,默认按加载顺序叠加
        extent: lonlat, //图层渲染范围，可选值，默认渲染全部
        visible: true, //是否显示，默认为true
        opacity: 0.8, //透明度，默认为1
    });
    map.addLayer(waterQualitylayers[layersname]);
}
setTimeout(function () {
    $("#jiangshui").click(function () {
        // 切换管理对象的时候清除所有的弹出层
        map.getOverlays().clear();
        map.getView().animate({
            zoom: 6.8,
            center: [112.387029, 37.872418],
        });

        // 切换导航栏的显示隐藏
        $(".section .right_bar .rainfall").css("display", "flex");
        $(".change_map_mark").css("display", "none");
        $(".right_posi").css("bottom", "20%");
        $(".right_bar_center ").scrollTop(0);

        // 降水图例默认展开
        $(".map_legend").find(".map_legend_img").removeClass("isHide");
        $(".map_legend").find(".turn_text").addClass("isHide");
        $(".map_legend").find(".turn_img").css("transform", "rotate(180deg)");
        if (!$(this).hasClass("dataActives")) {
            $(this).addClass("dataActives").prev().removeClass("dataActives");
            $(this).css("color", "#3a77f0");
            $(".top_nav .nav_ul_box .invisible").removeClass("active");
            $("#managementObjects").removeClass("active");
            $(".search_frameJs").removeClass("ishide");
            $(".search_frameJs").addClass("isShow");
            $(".map_legend").removeClass("ishide");
            $(".map_legend").addClass("isShow");
            $(".legend_section").addClass("ishide");
            // 清除图层方法调用
            removeLayer();
            // 隐藏搜索的列表
            $(".search_frame").css("display", "none");
            // 取消搜索的选中状态
            $(".mapSearch").removeClass("active");
            $(".mapSearch").children().removeClass("active");
            // 隐藏降水选中图层
            var item = $(".list_ul .list_li");
            for (let i = 0; i < item.length; i++) {
                console.log(item.eq(i).hasClass("active"));
                // 清除当前选择弹框
                $(".tips_wrap")
                    .find(".tips_item[data-qname = '" + item.eq(i).attr("data-qname") + "']")
                    .remove();
                if (item.eq(i).hasClass("active") && waterQualitylayers[item.eq(i).attr("data-qname")] != undefined) {
                    console.log(waterQualitylayers[item.eq(i).attr("data-qname")]);
                    // waterQualitylayers[item.eq(i).attr('data-qname')].setVisible(false)
                    map.removeLayer(waterQualitylayers[item.eq(i).attr("data-qname")]);
                    waterQualitylayers[item.eq(i).attr("data-qname")] = undefined;
                }
            }
            // 显示降水底图
            waterQualitylayers["jiangshuiBase"].setVisible(true);
            if (waterQualitylayers["jiangshui"] == undefined) {
                jc_info_fun2(1, "jiangshui", 'data-qname="jiangshui"');
            }
            // 隐藏1~4级河流
            for (var i = 0; i < layersInfo.length; i++) {
                // console.log(JSON.stringify(layersInfo[i]))
                if (i == 1) {
                    layersInfo[i].name = "rgba";
                    layersInfo[i].bgcolor = "rgba(255,255,255,0.9)";
                    waterQuality(layersInfo[i]);
                } else if (i > 1) {
                    waterQualitylayers[layersInfo[i].name].setVisible(false);
                }
            }
        }
    });
}, 1500);

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

// $('.tab_type').on('click', '.Timebox .span', function() {
// 	var index = $(this).index();
// 	var status = $(this).attr("data-status")
// 	$(".Timebox .span").removeClass("hide");
// 	$(".tab_type .point .span").attr("data-status", status)
// 	$(this).addClass("hide");
// 	var currentT = $(this).text()
// 	$('.tab_type .point .span').text(currentT);
// })

$(".bottom #details").on(clickStr, establish);

function establish(type, status, type_text, status_text) {
    var type = $(".top_nav .nav_ul_box #jiangshui").attr("data-id");
    var status = $(".tab_type .span.active").attr("data-status");
    var type_text = $(".top_nav .nav_ul_box #jiangshui").html();
    var status_text = $(".tab_type .span.active").html();
    var self = plus.webview.currentWebview();
    mui.openWindow({
        url: "waterLove_list.html", //通过URL传参
        id: "waterLove_list.html", //通过URL传参
        extras: {
            type: type,
            status: status,
            type_text: type_text,
            status_text: status_text,
        },
    });
}

function xiangqing2(type, hour_type, type_text, status_text, area_code, area_name) {
    var self = plus.webview.currentWebview();

    mui.openWindow({
        url: "waterLove_list2.html", //通过URL传参
        id: "waterLove_list2.html", //通过URL传参
        extras: {
            type: type,
            status: hour_type,
            areaCode: area_code,
            areaname: area_name,
            type_text: type_text,
            status_text: status_text,
        },
    });
}

// 返回全图事件
// 返回全图事件
$("body").on(clickStr, ".leftPosi", function () {
    console.log($(this).prev().find(".nav_li_item").eq(0).hasClass("dataActives"));
    console.log($(this).prev().find(".nav_li_item").eq(1).hasClass("dataActives"));
    var invisibles = $(this).prev().find(".nav_li_item").eq(0).hasClass("dataActives");
    var rains = $(this).prev().find(".nav_li_item").eq(1).hasClass("dataActives");
    if (rains) {
        resetCZ()
    }
    if (invisibles) {
        $(this).find("a").attr("href", "");
    }
});

/**
 * @description 水情图例展开收缩
 */
$(".legend_section").on(clickStr, ".legend_h6", function () {
    if ($(this).find(".turn_text").text() == "图例") {
        $(this).css("width", "auto");
        $(this).find(".turn_img").css("transform", "rotate(180deg)");
        $(".legend_ul_box").css("display", "block");
        $(this).find(".turn_text").text("水雨情");
    } else {
        $(this).css("width", "1.5rem");
        $(this).find(".turn_img").css("transform", "rotate(360deg)");
        $(".legend_ul_box").css("display", "none");
        $(this).find(".turn_text").text("图例");
    }
});

/**
 * @description 图例展开收缩
 */
$(".map_legend").on(clickStr, function () {
    if ($(this).find(".map_legend_img").hasClass("isHide")) {
        console.log(1);
        $(this).find(".map_legend_img").removeClass("isHide");
        $(this).find(".turn_text").addClass("isHide");
        $(this).find(".turn_img").css("transform", "rotate(180deg)");
    } else {
        $(this).find(".map_legend_img").addClass("isHide");
        $(this).find(".turn_text").removeClass("isHide");
        $(this).find(".turn_img").css("transform", "rotate(360deg)");
    }
});

// 清除地图图层方法
function removeLayer() {
    // 清除所有弹出层
    map.getOverlays().clear();
    //清除搜索地图渲染
    if (waterQualitylayers["searchLayer"]) {
        waterQualitylayers["searchLayer"].getSource().clear();
        map.removeLayer(waterQualitylayers["searchLayer"]);
    }
    if (waterQualitylayers["searchLayers"]) {
        waterQualitylayers["searchLayers"].getSource().clear();
        map.removeLayer(waterQualitylayers["searchLayers"]);
    }
    if (waterQualitylayers["searchLayers1"]) {
        waterQualitylayers["searchLayers1"].getSource().clear();
        map.removeLayer(waterQualitylayers["searchLayers1"]);
    }
}

//点击侧边栏搜索事件
var dataUrls = $(".search_frame").attr("data-url");
function soFun(self) {
    //清空搜索框
    $(".li_input").val("");
    // 清除类型样式
    $(".position").css("display", "none");
    $(".map_type_box .item_type").css("border", "none");
    $(".position_ul li").removeClass().find("span:last-child").css("display", "none");
    // 清除图层方法调用
    removeLayer();
    //选中效果
    if ($(self).parent().hasClass("active")) {
        $(self).parent().removeClass("active");
    } else {
        $(self).parent().addClass("active");
    }
    //还原中心点
    resetCZ()
    var that = $(self);
    if (that.hasClass("active")) {
        that.removeClass("active");
        $(".search_frame").css("display", "none");
        mui(".search_frame_inner").pullRefresh().disablePullupToRefresh();
    } else {
        // 清除所有其余图层
        var item = $(".list_ul .list_li");
        for (let i = 0; i < item.length; i++) {
            console.log(item.eq(i).hasClass("active"));
            // 清除当前选择弹框
            $(".tips_wrap")
                .find(".tips_item[data-qname = '" + item.eq(i).attr("data-qname") + "']")
                .remove();
            if (item.eq(i).hasClass("active") && waterQualitylayers[item.eq(i).attr("data-qname")] != undefined) {
                console.log(waterQualitylayers[item.eq(i).attr("data-qname")]);
                map.removeLayer(waterQualitylayers[item.eq(i).attr("data-qname")]);
                waterQualitylayers[item.eq(i).attr("data-qname")] = undefined;
            }
        }
        // 清除所有的选择
        $(".list_box .list_ul .list_li").removeClass("active");
        $(".right_bar .tab_type .list_li").removeClass("active");
        that.addClass("active");
        $(".search_frame").css({ display: "block", top: "400px" });
        $(".search_frame .icon_arrow").css("transform", "rotateZ(180deg)");
        $(".icon_arrow").removeClass("activei");
        var val = $(".li_input").val();
        // 默认禁止上拉刷新
        prohibitRefresh();
        page = 1;
        pageStaus = true;
        search_tipshighlight(dataUrls, page, "searchLayers", val);
    }
}
// 点击搜索事件
function searchFun() {
    myFunction();
}

// input框改变时触发
function myFunction() {
    map.getOverlays().clear();
    var val = $(".li_input").val();
    if (val == "") {
        plus.nativeUI.toast("请输入关键字");
        return false;
    }
    //还原中心点
    resetCZ()
    // 清除图层方法调用
    removeLayer();
    $(".search_frame_inner").animate({ scrollTop: 0 }, 1000); //回到顶端
    $(".search_frame_list span").css("color", "#999999").attr("class", "");

    //pullup-container为在mui.init方法中配置的pullRefresh节点中的container参数；
    //注意：refresh()中需传入true
    mui(".search_frame_inner").pullRefresh().refresh(true);
    page = 1;
    pageStaus = true;
    search_tipshighlight(dataUrls, page, "searchLayers1", val);
}
// input框聚焦时触发
function inputFocus() {
    // 聚焦隐藏类型列表
    $(".position").css("display", "none");
    $(".map_type_box .item_type").css("border", "none");
    // 聚焦搜索框样式
    $(".search_frame").css({ top: "300px" });
    $(".search_frame .icon_arrow").css("transform", "rotateZ(180deg)");
    $(".icon_arrow").removeClass("activei");
}

// 获取手的位置拖拽搜索框
$(".search_arrow").on("touchmove", function (e) {
    var boxHeight = e.originalEvent.changedTouches[0].clientY;
    // console.log(boxHeight)
    if (boxHeight >= 190 && boxHeight <= 580) {
        $(".search_frame").css("top", boxHeight + "px");
    }
});
// 搜索框箭头点击事件
$(".icon_arrow").on(clickStr, function () {
    if ($(this).hasClass("activei")) {
        $(".search_frame").css({ top: "400px" });
        $(".search_frame .icon_arrow").css("transform", "rotateZ(180deg)");
        $(this).removeClass("activei");
        if (!$(".so_li_box a").hasClass("active")) {
            $(".so_li_box a").addClass("active");
        }
    } else {
        $(".search_frame").css({ top: "580px" });
        $(".search_frame .icon_arrow").css("transform", "rotateZ(360deg)");
        $(this).addClass("activei");
        if ($(".so_li_box a").hasClass("active")) {
            $(".so_li_box a").removeClass("active");
        }
    }
});
// 默认禁止上拉刷新
prohibitRefresh();
// 选中搜索时候地图移动和改变分辨率都禁止上拉加载
function prohibitRefresh() {
    try {
        map.on("movestart", function (evt) {
            console.log("============================");
            mui(".search_frame_inner").pullRefresh().disablePullupToRefresh();
        });
        map.on("moveend", function (evt) {
            console.log("++++++++++++++++++++++++++++");
            mui(".search_frame_inner").pullRefresh().disablePullupToRefresh();
        });
        map.getView().on("change:resolution", function () {
            console.log("++++++++++++++++++++++++++++");
            mui(".search_frame_inner").pullRefresh().disablePullupToRefresh();
        });
    } catch (e) {
        //TODO handle the exception
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