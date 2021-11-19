var clickStr = mui.os.ios ? "tap" : "click";
let root = localStorage.getItem("str_url");
let token = localStorage.getItem("token");

// 更改地图为电子地图
// TileWMSLayer_base.setSource(base_source["dzMap_source"]);
// 页面初始化执行
mui.plusReady(function () {
    var self = plus.webview.currentWebview();
    console.log(self);
    var id = self.type_id;
    console.log(id);
    console.log($(".top_nav .nav_ul_box #" + id + "").prop("class"));
    $(".top_nav .nav_ul_box #" + id + "")
        .trigger("click")
        .addClass("active");
    plus.nativeUI.showWaiting("数据加载中...");
    // 降水参数
    // let jsobj = {
    //     param: { type: 1, token, hour_type: 24, level_value: "" },
    //     layersname: "jiangshui24",
    //     param_str: 'data-qname="jiangshui24"',
    //     url: root + "api/v4/water_rain_condition/precipitation",
    // };
    // 初始化显示降水图层
    // jc_info_fun(jsobj);
});

// 添加地图方法
function waterQuality(item) {
    // point点，默认面，线信息
    if (item.datatype == "point") {
        $.ajaxSettings.async = false; // 设置getJson同步
        var geojsonObject = $.getJSON(item.jsonUrl, function (res) {
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

let layersInfo = [
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
        visibility: false,
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
for (let i = 0; i < layersInfo.length; i++) {
    waterQuality(layersInfo[i]);
}

// 网络请求相关方法
let perHourType = 24; //上一次的时间
let isFirst = true; //是否第一次渲染
function jc_info_fun({ param, layersname, param_str, url }, li_current) {
    console.log(url);
    plus.nativeUI.showWaiting("数据加载中...");
    mui.ajax(url, {
        data: param,
        datatype: "json", //服务器返回json格式数据
        type: "post", //HTTP请求类型
        success: function (data) {
            console.log(JSON.stringify(data));
            plus.nativeUI.closeWaiting();
            if (data.code == 1) {
                if (data.data.result_data == "") {
                    plus.nativeUI.toast("暂无搜索结果");
                    return false;
                }
                if (data.data.result) {
                    city_dian_fun(data.data.result, layersname, "Icon2");
                    // 降水提示信息插入
                    jczInfo_append(data.data.list);
                    $(".right_posi").css("bottom", $(".search_frameJs").outerHeight() + 5 + "px");
                } else if (param.riverName) {
                    city_dian_fun(data.data.result_data, layersname, "riverName");
                } else {
                    city_dian_fun(data.data.result_data, layersname);
                }

                // 降水右侧导航栏数据列表添加总数
                if (data.data.stations_all_count) {
                    $(".right_bar_center .jiangshui .js_total").html(`${data.data.stations_all_count}`);
                }
                // 河道右侧导航栏添加数据
                if (data.data.river_type) {
                    $(".right_bar_center .hdsq .hdcz").html(`${data.data.river_type[0].count}`);
                    $(".right_bar_center .hdsq .hdcz_shuiweizhan").html(`${data.data.river_type[1].count}`);
                    $(".right_bar_center .hdsq .hdsq_cbzsw").html(`${data.data.river_type[2].count}`);
                    $(".right_bar_center .hdsq .hdsq_cjjsw").html(`${data.data.river_type[3].count}`);
                }
                // 水库右侧导航栏添加数据
                if (data.data.scale_type) {
                    $(".right_bar_center .sksq .dxsk").html(`${data.data.scale_type[0].count}`);
                    $(".right_bar_center .sksq .zxsk").html(`${data.data.scale_type[1].count}`);
                    $(".right_bar_center .sksq .xyxsk").html(`${data.data.scale_type[2].count}`);
                    $(".right_bar_center .sksq .xexsk").html(`${data.data.scale_type[3].count}`);
                }

                // 渲染地图图例
                if (perHourType == param.hour_type) {
                    if (isFirst === true) {
                        let levelStatus = param.level_value;
                        if (data.data.levelList) {
                            let levelList = data.data.levelList;
                            for (let i = 0; i < levelList.length; i++) {
                                $(".lengend_screen .lengend_screen_box").append(`
                                    <li data-level='${levelList[i].level_value}'>
                                        <span class="lengend_screen_point" style="background-color: ${levelList[i].bg_color};"></span>
                                        <span>${levelList[i].name}</span>
                                    </li>
                                `);
                            }
                            if (levelStatus && levelStatus != undefined) {
                                levelStatus = levelStatus - 1;
                                $(".lengend_screen .lengend_screen_box li").eq(levelStatus).addClass("lenActive");
                            }
                        }

                        isFirst = false;
                    }
                } else {
                    perHourType = param.hour_type;
                    $(".lengend_screen .lengend_screen_box").html("");
                    let levelStatus = param.level_value;
                    if (data.data.levelList) {
                        let levelList = data.data.levelList;
                        for (let i = 0; i < levelList.length; i++) {
                            $(".lengend_screen .lengend_screen_box").append(`
                                <li data-level='${levelList[i].level_value}'>
                                    <span class="lengend_screen_point" style="background-color: ${levelList[i].bg_color};"></span>
                                    <span>${levelList[i].name}</span>
                                </li>
                            `);
                        }
                        if (levelStatus && levelStatus != undefined) {
                            levelStatus = levelStatus - 1;
                            $(".lengend_screen .lengend_screen_box li").eq(levelStatus).addClass("lenActive");
                        }
                    }
                }
                $(".lengend_screen").css("bottom", $(".search_frameJs").outerHeight() + 10 + "px");
            } else {
                plus.nativeUI.toast(data.msg);
            }
        },
        error: function (xhr, type, errorThrown) {
            console.log("error");
            plus.nativeUI.closeWaiting();
            plus.nativeUI.toast("网络不稳定，请检查网络");
        },
    });
}
// 是否开启警示提示
var warningStatus = true;
function warningFun() {
    layername = $(".jiangshui .times.active").attr("data-qname");
    if (warningStatus) {
        march(layername);
    }
    warningStatus = !warningStatus;
    warningStatus ? $("#warning_status").addClass("active") : $("#warning_status").removeClass("active");
    let rightNavName = $(this).attr("data-qname");
}
// 重新设置图层样式
function march(layername) {
    // if (warningStatus) {
    //     setTimeout(function () {
    //         march(layername);
    //     }, 10000);
    // waterQualitylayers[layername].setStyle(iconStyle_set2);
    // for (let i in jsfeatureArr) {
    // 	jsfeatureArr[i].setStyle(iconStyle_set2);
    // }
    //} else {
    map.getOverlays().clear();
    waterQualitylayers[layername].setStyle(iconStyle_set2);
    //}
}

// 添加点信息方法
var jsfeatureArr = [];
function city_dian_fun(arr, layername, setIcon) {
    jsfeatureArr = [];
    console.log(layername);
    var vectorSource = new ol.source.Vector({}); //创建数据源
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
            type: setIcon,
        });
        if (item_info.warning_precipitation != "") {
            jsfeatureArr.push(feature);
        }
        vectorSource.addFeature(feature);

        if (layername == "searchLayer") {
            var items = {
                item: item_info,
            };
            map.getOverlays().clear();
            var vectorLayers = { className_: layername };
            addPopup(items, vectorLayers, -125);
        }
    }
    //创建图标层
    // 普通map渲染模式
    let setIconStyle;
    if (setIcon == "Icon2") {
        setIconStyle = iconStyle_set2;
    } else if (setIcon == "riverName") {
        setIconStyle = iconStyle_set;
    } else {
        setIconStyle = iconStyle_set;
    }
    waterQualitylayers[layername] = new ol.layer.Vector({
        source: vectorSource,
        style: setIconStyle,
        className: layername,
    });
    // 超过50mm的动画渲染
    if (setIcon == "Icon2") {
        setTimeout(function () {
            march(layername);
        }, 1000);
    }

    map.addLayer(waterQualitylayers[layername]);

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

/**
 * @param {Object} feature
 * @description 创建标签的样式
 */
function iconStyle_set(feature) {
    var text = feature.values_.name;
    var images = feature.values_.item.icon;
    var layersSetIcon = feature.values_.type;
    var item = feature.values_.item;
    var zoom = map.getView().getZoom();
    var opacity = 1;
    var scale = 0.3;
    if (!item.type_zoom || item.type_zoom <= zoom) {
    } else {
        text = "";
        // opacity = 4 / item.type_zoom / 2;
        scale = 0.4;
    }
    if (feature.values_.item.scale === "大型") {
		scale = 0.5 + (zoom/9 - 1)
        opacity = 1;
    } else if (feature.values_.item.scale === "中型") {
		scale = 0.4 + (zoom/9 - 1)
        opacity = 1;
    } else if (feature.values_.item.scale === "小1型" || feature.values_.item.scale === "小2型") {
		scale = 0.3 + (zoom/9 - 1)
        opacity = 1;
    }
    if (feature.values_.item.stationType === 1) {
        scale = 0.2;
    }
    if (layersSetIcon == "riverName") {
        scale = scale;
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
        }),
    });

    return iconStyle;
}
/**
 * @param {Object} feature
 * @description 创建标签的样式
 */
function iconStyle_set2(feature) {
    var item = feature.values_.item;
    var val = item.value || item.speed;
    var text = val + "\r\n" + item.station_name;
    var zoom = map.getView().getZoom();
    var opacity = 1;
    var scale = 0.3;
    if (item.layername == "fengxiangfengsu") {
        var styleImage = new ol.style.Icon({
            opacity: opacity,
            scale: scale,
            rotation: item.direction,
            src: item.image,
        });
    } else {
        var that_color = item.rainfall_color;
        // 雨量超过50的动画(item.warning_precipitation.value >= 50)
        if (item.warning_precipitation != "" && warningStatus) {
            let marker_id = "marker_" + item.station_code;
            if ($("#" + marker_id).length == 0) {
                var sHtml = `<div id="${marker_id}" class="marker50" ></div>`;
                $("#body").append(sHtml);
                var marker = new ol.Overlay({
                    id: marker_id,
                    //位置坐标
                    position: [Number(item.lng), Number(item.lat)],
                    //覆盖层如何与位置坐标匹配
                    positioning: "center-center",
                    //覆盖层的元素
                    element: document.getElementById(marker_id), //ToDo
                    className: marker_id, // 覆盖物在覆盖层的类名
                    stopEvent: false,
                });
                map.addOverlay(marker);
            }
            // if(new Date().getSeconds() % 2 == 0){
            // 	that_color = item.rainfall_color;
            // }else{
            // 	that_color = "#ff0000";
            // }
        }
        // 雨量超过50的动画
        var styleImage = new ol.style.Circle({
            radius: map.getView().getZoom() / 3,
            fill: new ol.style.Fill({
                color: that_color,
            }),
            stroke: new ol.style.Stroke({
                color: "#747576",
                width: 1,
            }),
        });
    }
    //返回一个样式
    var iconStyle = new ol.style.Style({
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
        }),
    });
    return iconStyle;
}

//清除所有地图图层方法
function removeLayer() {
    for (let i = map.getLayers()["array_"].length - 1; i > 5; i--) {
        map.removeLayer(map.getLayers()["array_"][i]);
    }
    // 清除所有弹出层
    map.getOverlays().clear();
}

//清除所有弹窗方法
function removeTips() {
    $(".section .mapBox .tips_wrap").empty();
}

// 清除右侧栏所有的显示
function removeRightActive() {
    $(".right_bar_center ul li").removeClass("active");
}
//弹窗关闭方法
function close_tips(that) {
    let liName = $(that).parent(".tips_item").attr("data-qname");
    $(that).parent(".tips_item").remove();
    $(`.right_bar_center ul li[data-qname=${liName}]`).removeClass("active");
    removeLayerName(liName);
    map.getOverlays().clear(); //清除地图弹框
}

//根据图层名清除对应图层方法
function removeLayerName(name) {
    waterQualitylayers[name].getSource().clear();
    map.removeLayer(waterQualitylayers[name]);
    waterQuality[name] = undefined;
}
//根据名称清除对应弹窗方法
function removeRightName(name) {
    $(`.tips_wrap div[data-qname=${name}]`).remove();
}

var layerName_arr = ["jiangshui1", "jiangshui3", "jiangshui12", "jiangshui24", "jiangshui72"];
selectFun(layerName_arr, -95, "Circle", "rainfall_color");

var layerName_arr2 = ["hdcz", "hdsq_cbzsw", "hdsq_cjjsw", "hdcz_shuiweizhan", "hdsq_hl"];
selectFun(layerName_arr2);

var layerName_arr3 = ["dxsk", "zxsk", "xyxsk", "xexsk"];
selectFun(layerName_arr3);

var layerName_arr4 = ["searchLayers", "searchLayers1", "searchLayer"];
selectFun(layerName_arr4);

// 清除搜索框的图层方法
function removeSearchLayer() {
    // 清除所有弹出层
    map.getOverlays().clear();
    //清除搜索地图渲染
    if (waterQualitylayers["searchLayer"]) {
        waterQualitylayers["searchLayer"].getSource().clear();
        map.removeLayer(waterQualitylayers["searchLayer"]);
        waterQualitylayers["searchLayer"] = undefined;
    }
    if (waterQualitylayers["searchLayers"]) {
        waterQualitylayers["searchLayers"].getSource().clear();
        map.removeLayer(waterQualitylayers["searchLayers"]);
        waterQualitylayers["searchLayers"] = undefined;
    }
    if (waterQualitylayers["searchLayers1"]) {
        waterQualitylayers["searchLayers1"].getSource().clear();
        map.removeLayer(waterQualitylayers["searchLayers1"]);
        waterQualitylayers["searchLayers1"] = undefined;
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
    removeSearchLayer();
    //还原中心点
    resetCZ();
    var that = $(self);
    if (that.hasClass("active")) {
        $(".search_frame").css("display", "none");
        mui(".search_frame_inner").pullRefresh().disablePullupToRefresh();
    } else {
        // 清除所有图层
        removeLayer();
        if (waterQualitylayers["heliu-server"] != undefined) {
            waterQuality(layersInfo[2]);
            waterQualitylayers["heliu-server"].setVisible(true);
        }
        // 清除所有弹窗
        removeTips();
        // 清除右侧所有选中状态
        removeRightActive();
        $(".search_frame").css({ display: "block", height: "6rem" });
        $(".search_frame .icon_arrow").css("transform", "rotateZ(180deg)");
        $(".icon_arrow").removeClass("activei");
        var val = $(".li_input").val();
        // 默认禁止上拉刷新
        // prohibitRefresh();
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
    // if (val == "") {
    //     plus.nativeUI.toast("请输入关键字");
    //     return false;
    // }
    //还原中心点
    resetCZ();
    // 清除图层方法调用
    removeSearchLayer();
    $(".search_frame_inner").animate({ scrollTop: 0 }, 1000); //回到顶端
    $(".search_frame_list span").css("color", "#999999").attr("class", "");

    //pullup-container为在mui.init方法中配置的pullRefresh节点中的container参数；
    //注意：refresh()中需传入true
    // mui(".search_frame_inner").pullRefresh().refresh(true);
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
    // $(".search_frame").css({ top: "7rem" });
    console.log($(".icon_arrow").hasClass("activei"));
    if (!$(".icon_arrow").hasClass("activei")) {
        $(".search_frame").css({ height: "1.2rem" });
        // $(".search_frame .icon_arrow").css("transform", "rotateZ(180deg)");
        // $(".icon_arrow").removeClass("activei");
    }
}
// input框失焦时触发
function inputBlur() {
    // 聚焦搜索框样式
    // $(".search_frame").css({ top: "7rem" });
    console.log($(".icon_arrow").hasClass("activei"));
    if (!$(".icon_arrow").hasClass("activei")) {
        $(".search_frame").css({ height: "6rem" });
    }
}

// 获取手的位置拖拽搜索框
var startY = (endY = boxHeight = 0);
var boxDefaultHeight;
// 获取底部箭头和搜索框的高度
var searchBarHeight = $(".li_div").height() + $(".search_arrow").height() + 10;
document.getElementById("search_arrow").addEventListener(
    "touchstart",
    function (e) {
        startY = e.targetTouches[0].clientY;
    },
    false
);
document.getElementById("search_arrow").addEventListener(
    "touchmove",
    function (e) {
        endY = e.targetTouches[0].clientY;
        console.log(boxDefaultHeight);
        boxHeight = startY - endY + boxDefaultHeight;
        console.log(boxHeight);
        if (boxHeight <= 450 && boxHeight >= searchBarHeight) {
            $(".search_frame").css("height", boxHeight + "px");
        }
    },
    false
);
document.getElementById("search_arrow").addEventListener(
    "touchend",
    function (e) {
        boxDefaultHeight = $(".search_frame").height();
    },
    false
);

// 默认禁止上拉刷新
// prohibitRefresh();
// 选中搜索时候地图移动和改变分辨率都禁止上拉加载
function prohibitRefresh() {
    try {
        map.on("movestart", function (evt) {
            mui(".search_frame_inner").pullRefresh().disablePullupToRefresh();
        });
        map.on("moveend", function (evt) {
            mui(".search_frame_inner").pullRefresh().disablePullupToRefresh();
        });
        map.getView().on("change:resolution", function () {
            mui(".search_frame_inner").pullRefresh().disablePullupToRefresh();
        });
    } catch (e) {
        //TODO handle the exception
    }
}

function xiangqing(classname, id) {
    switch (classname) {
        case "hdcz":
        case "hdcz_shuiweizhan":
        case "hdsq_cjjsw":
        case "hdsq_cbzsw":
        case "hdsq_hl":
            mui.openWindow({
                url: "/pages/waterLove/river_detail.html", //通过URL传参
                id: "/pages/waterLove/river_detail.html", //通过URL传参
                extras: {
                    item_id: id,
                },
            });
            break;
        case "dxsk":
        case "zxsk":
        case "xyxsk":
        case "xexsk":
            mui.openWindow({
                url: "/pages/reservoirLevel/details_syt.html", //通过URL传参
                id: "/pages/reservoirLevel/details_syt.html", //通过URL传参
                extras: {
                    item_id: id,
                },
            });
            break;
        case "jiangshui1":
        case "jiangshui3":
        case "jiangshui12":
        case "jiangshui24":
        case "jiangshui72":
            if (classname == "jiangshui1") {
                var status = 1;
            }
            if (classname == "jiangshui3") {
                var status = 3;
            }
            if (classname == "jiangshui12") {
                var status = 12;
            }
            if (classname == "jiangshui24") {
                var status = 24;
            }
            if (classname == "jiangshui72") {
                var status = 72;
            }
            mui.openWindow({
                url: "/pages/waterLove/waterLove_detail.html", //通过URL传参
                id: "/pages/waterLove/waterLove_detail.html", //通过URL传参
                extras: {
                    selectval: 1,
                    status: status,
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
                    url: "/pages/waterLove/reservoir_detail.html", //通过URL传参
                    id: "/pages/waterLove/reservoir_detail.html", //通过URL传参
                    extras: {
                        item_id: id,
                    },
                });
            } else {
                mui.openWindow({
                    url: "/pages/waterLove/river_detail.html", //通过URL传参
                    id: "/pages/waterLove/river_detail.html", //通过URL传参
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

// 降水监测站状态信息描述与数据展示
function jczInfo_append(list) {
    if (list == "undefined" || list == "" || list == null) {
        $(".search_frameJs").css("display", "none");
        return false;
    } else {
        $(".search_frameJs").css("display", "block");
    }
    if (list.data.length === 0) {
        $(".search_title").html(`
            <div style="text-align:center;">
                <span style="display:inline-block;text-align:left;">${list.highest}</span>
            </div>
        `);
        $(".search_table_box").removeClass("active");
    } else {
        $(".search_title").html(`
            <div style="text-align:center;">
                <span style="display:inline-block;text-align:left;">${list.highest}</span>
            </div>
        `);
    }

    var headitem = list.head;
    var item = list.data;
    var tr_html = "";
    var type = $(".top_nav .nav_ul_box #jiangshui").attr("data-id");
    var hour_type = $(".right_bar_center .jiangshui li.times.active").attr("data-qname");
    var type_text = $(".top_nav .nav_ul_box #jiangshui").html();
    var status_text = $(".tab_type .span.active .bar_text").html();
    if (item != "") {
        $(".search_header_boxs .icon_arrows").css("display", "block").parent().css("height", "auto");
        var th_html = "";
        for (var i = 0; i < headitem.length; i++) {
            th_html += "<th>" + headitem[i] + "</th>";
        }

        $(".search_table_box .mui-table .head").html(th_html);
        for (var i = 0; i < item.length; i++) {
            var td_str = "";
            for (var j = 0; j < item[i].area.length; j++) {
                td_str += `<span class='set_span' style='color:#3a77f0;text-decoration: underline;text-decoration-color: #3a77f0;margin-right: 5px;' data-code='${item[i].area[j].code}' onclick="xiangqing2('${type}','${hour_type}','${type_text}','${status_text}','${item[i].area[j].value}','${item[i].area[j].name}','${item[i].level_value}')">${item[i].area[j].name} </span>`;
            }
            if (td_str == "") {
                td_str = "无";
            }
            tr_html += `<tr>
						<td>${item[i].name}</td>
						<td>${td_str}</td>
						<td><span style='color:#3a77f0;text-decoration: underline;text-decoration-color: #3a77f0;' onclick="xiangqing2('${type}','${hour_type}','${type_text}','${status_text}','0','','${item[i].level_value}')">${item[i].count}</span></td>
					</tr>`;
        }
    } else {
        $(".search_header_boxs .icon_arrows").css("display", "none").parent().css("height", "0.2rem");
    }
    $("#jsInfo").html(tr_html);
}

// 重置地图中心点和层级方法
function resetCZ() {
    map.getView().setCenter(map_info_obj.center);
    map.getView().setZoom(map_info_obj.zoom);
}

function xiangqing2(type, hour_type, type_text, status_text, area_code, area_name, level_value) {
    let status = hour_type.match(/\d+/g)[0];
    mui.openWindow({
        url: "waterLove_list.html", //通过URL传参
        id: "waterLove_list.html", //通过URL传参
        extras: {
            type: type,
            status: status,
            areaCode: area_code,
            areaname: area_name,
            type_text: type_text,
            status_text: status_text,
            level_value: level_value,
        },
    });
}

// 数据列表
function jslist() {
    var type = $(".top_nav .nav_ul_box #jiangshui").attr("data-id");
    var hour_type = $(".right_bar_center .jiangshui li.times.active").attr("data-qname");
    var type_text = $(".top_nav .nav_ul_box #jiangshui").html();
    var status_text = $(".tab_type .span.active .bar_text").html();
    xiangqing2(type, hour_type, type_text, status_text, "0", "", "0");
}

// 切换降水的初始化地图方法
function jsInit() {
    $(".right_bar_center .jiangshui #warning_status").addClass("active"); //警示添加高亮
    $(".search_header_boxs .search_table_box").removeClass("active"); //降水弹窗恢复最初状态
    $(".search_frame").css("display", "none");
    $(".lengend_screen").show(); //降水图例显示
    // 降水参数
    let jsobj = {
        param: { type: 1, token, hour_type: 24, level_value: "" },
        layersname: "jiangshui24",
        param_str: 'data-qname="jiangshui24"',
        url: root + "api/v4/water_rain_condition/precipitation",
    };
    $(`.right_bar .right_bar_center ul li[${jsobj.param_str}]`).addClass("active").siblings().removeClass("active");
    jc_info_fun(jsobj);
    warningStatus ? $("#warning_status").addClass("active") : $("#warning_status").removeClass("active");
}
//切换河道水情的初始化地图方法
function hdsqInit() {
    $(".lengend_screen").hide(); //降水图例隐藏
    if (waterQualitylayers["heliu-server"] != undefined) {
        waterQuality(layersInfo[2]);
        waterQualitylayers["heliu-server"].setVisible(true);
    }
    // 添加河流服务
    var qihe_server = new ol.layer.Vector({
        source: new ol.source.Vector({
            url: "http://gis.sxjicheng.cn:8081/freexserver/wfs?service=WFS&version=1.0.0&request=GetFeature&typename=七河&outputFormat=application/json", //从文件加载一级河流
            format: new ol.format.GeoJSON(),
        }),
        visible: true,
        // visible:false,
        className: "七河",
        projection: "EPSG:4326",
        style: qihe_iconStyle,
    });
    map.addLayer(qihe_server);
    // 水文站
    let hdobj = {
        param: { type: 7, token },
        layersname: "hdcz",
        param_str: 'data-qname="hdcz"',
        url: root + "api/v3/water_rain_condition/map",
    };
    $(`.right_bar .right_bar_center ul li[${hdobj.param_str}]`).addClass("active").siblings().removeClass("active");
    jc_info_fun(hdobj);
    // 水文站 end
    // 水位站
    let hdobj_swz = {
        param: { type: 6, token },
        layersname: "hdcz_shuiweizhan",
        param_str: 'data-qname="hdcz_shuiweizhan"',
        url: root + "api/v3/water_rain_condition/map",
    };
    // $(`.right_bar .right_bar_center ul li[${hdobj_swz.param_str}]`).addClass("active");
    // jc_info_fun(hdobj_swz);
    // 水位站 end
}
// 切换水库水情的初始地图化方法
function sksqInit() {
    $(".lengend_screen").hide(); //降水图例隐藏
    if (waterQualitylayers["heliu-server"] != undefined) {
        waterQuality(layersInfo[2]);
        waterQualitylayers["heliu-server"].setVisible(true);
    }
    let skobj = {
        param: { type: 5, token, scale_type: 1 },
        layersname: "dxsk",
        param_str: 'data-qname="dxsk"',
        url: root + "api/v4/water_rain_condition/map",
    };
    $(`.right_bar .right_bar_center ul li[${skobj.param_str}]`).addClass("active").siblings().removeClass("active");
    jc_info_fun(skobj);
}

// 七河服务样式
function qihe_iconStyle(feacture) {
    console.log(feacture);
    var newstyle = new ol.style.Style({
        fill: new ol.style.Fill({
            color: "#ff0000",
            width: 5,
        }),
        stroke: new ol.style.Stroke({
            // lineDash: [20, 20],
            // lineDashOffset: lineDashOffset,
            color: "rgba(0,161,254,0.1)",
            width: 10,
        }),
    });
    return newstyle;
}
// 七河服务样式
function qihe_iconStyle2(param) {
    console.log(param);
    var color = param.max % 2 == 0 ? param.color1 : param.color2;
    var newstyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
            // lineDash: [20, 20],
            color: color,
            width: 5,
        }),
    });
    return newstyle;
}
// 七河服务高亮
function mapHighlight(param) {
    if (param.max > 0) {
        param.layer.setStyle(qihe_iconStyle2(param));
        setTimeout(function () {
            param.max--;
            mapHighlight(param);
        }, param.time);
    } else {
        param.layer.setStyle(qihe_iconStyle);
    }
}
