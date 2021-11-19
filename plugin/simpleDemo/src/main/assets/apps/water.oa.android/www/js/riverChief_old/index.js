var clickStr = mui.os.ios ? 'tap' : "click";
// 管理对象显示隐藏
$("body").on(clickStr, ".nav_ul_box .isShow", function () {
    var objItem = $(this).attr("data-type");
    console.log(objItem);
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
    // allIsLayers(false);//切换选项卡隐藏所有图层
    // isLayers(objItem);//显示当前选项卡下图层
});
// 是否选中管理对象
$("body").on(clickStr, ".list_ul .list_li", function (e) {
    e.stopPropagation();
    e.preventDefault();
    console.log($(this).index());
    if ($(this).hasClass("active")) {
        $(this).removeClass("active");
    } else {
        $(this).addClass("active");
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
                        0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625,
                        0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625,
                        0.0006866455078125, 0.00034332275390625, 0.000171661376953125,
                        8.58306884765625e-5, 4.291534423828125e-5, 2.1457672119140625e-5,
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

/**
 * @description 添加list信息向dom节点追加数据
 * @param {Object} addobj
 */
function addlist(addobj) {
    // <li class="list_li">机井</li>
    addobj.type_id.forEach(function (item, index) {
        console.log(item, index);
        var isshow = addobj.visibility ? " active" : " ";
        var img = addobj.images ? '<img class="icon_img" src="' + addobj.images + '" >' : "";
        $("#" + item + " .list_ul").append(
            '<li class="list_li ' +
                isshow +
                '" data-index="' +
                addobj.index +
                '" data-qname="' +
                addobj.name +
                '" data-type="' +
                addobj.datatype +
                '">' +
                img +
                addobj.tname +
                "</li>"
        );
    });
}

/**
 * @param {Object} feature
 * @description 创建标签的样式
 */
function point_set(feature) {
    var text = feature.values_.name;
    var item = feature.values_.item;
    //返回一个样式
    console.log(JSON.stringify(feature));
    if (item.images && item.images != undefined) {
        var scale_p = item.width || 1;
        var iconStyle = new ol.style.Style({
            image: new ol.style.Icon({
                opacity: 0.8,
                scale: scale_p,
                src: item.images,
            }),
            text: new ol.style.Text({
                font: "10px sans-seri",
                text: String(text),
                fill: new ol.style.Fill({
                    color: item.color,
                }),
                textAlign: "left",
                // offsetY: 20,
                offsetX: 5,
            }),
        });
    } else {
        var iconStyle = new ol.style.Style({
            image: new ol.style.Circle({
                radius: item.width,
                scale: 2,
                fill: new ol.style.Fill({
                    color: item.color,
                }),
            }),
            text: new ol.style.Text({
                font: "10px sans-seri",
                text: String(text),
                fill: new ol.style.Fill({
                    color: item.color,
                }),
                textAlign: "left",
                // offsetY: 20,
                offsetX: 5,
            }),
        });
    }
    return iconStyle;
}

// 山西大水网总信息
var layersInfo = [
    // {
    // 	type_id: ["riverLakeLongSystem"],
    // 	images: "../../images/big_water_network/icon-26-shenjie.png",
    // 	name: "shanxi_shen",
    // 	tname: "山西边界",
    // 	width: 2,
    // 	visibility: true,
    // 	bgcolor: "rgba(255,255,255,0.6)",
    // 	color: "#ADB7B4",
    // 	jsonUrl: "../../js/map/json/line_shen.json"
    // },
    // {
    // 	type_id: ["riverLakeLongSystem"],
    // 	images: "../../images/big_water_network/icon-27-shijie.png",
    // 	name: "shanxi_shi",
    // 	tname: "地市边界",
    // 	width: 1,
    // 	visibility: false,
    // 	bgcolor: "rgba(255,255,255,0.3)",
    // 	color: "#ADB7B4",
    // 	jsonUrl: "../../js/map/json/line_shi.json"
    // },
    // {
    // 	type_id: ["riverLakeLongSystem"],
    // 	images: "../../images/big_water_network/icon-28-xianjie.png",
    // 	name: "shanxixian",
    // 	tname: "区县边界",
    // 	width: 1,
    // 	visibility: false,
    // 	bgcolor: "rgba(255,255,255,0.3)",
    // 	color: "#ADB7B4",
    // 	jsonUrl: "../../js/map/json/line_xian.json"
    // },
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
    // {
    //     type_id: ["bigwaternetwork"],
    //     tname: "山西边界",
    //     listshow: false,
    //     name: "shanxiBoundary1",
    //     width: 1,
    //     visibility: true,
    //     bgcolor: "rgba(255,255,255,0)",
    //     color: "#aaaaaa",
    //     jsonUrl: "../../js/ruralWater/shanxi.json",
    // },
    {
        type_id: ["riverLakeLongSystem"],
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
	{
	    type_id: ["riverLakeLongSystem"],
	    tname: "流域",
	    listshow: true,
	    datatype: "WMTS",
	    // datatype: "WFS",
	    name: "basin-server",
	    visibility: true,
	    fontSize: 14,
	    serverInfo: {
	        WMTS: {
	            url: "http://gis.sxjicheng.cn:8081/freexserver/htc/service/wmts",
	            // url:"http://www.zhuoyukeji.cn:8081/freexserver/htc/service/wmts",
	            type: "WMTS",
	            // layer: "shanxi山脉水系",
	            layer: "group_sx_river",
	        },
	        WFS: {
	            url: "",
	            type: "WFS",
	            layer: "",
	        },
	    },
	}
];
for (var i = 0; i < layersInfo.length; i++) {
    // 添加shp文件信息
    waterQuality(layersInfo[i]);
}

// 获取基础信息
var root = localStorage.getItem("str_url");
if (root == "" || root == undefined || root == null) {
    // mui.openWindow({
    //     url: "login.html?cid=1", //通过URL传参
    //     id: "login.html?cid=1", //通过URL传参
    // });
}
var token = localStorage.getItem("token");
mui.plusReady(function () {
    jc_info_fun(3, "gsp",'data-qname="gsp"');
});

// 地图信息 end

// 控制显示隐藏「
function isLayers(that) {
    // 切换管理对象的时候清除所有的弹出层
    map.getOverlays().clear();
    map.getView().animate({
        zoom: 6.8,
        center: [112.387029, 37.872418],
    });
    // var item = $(".list_obj .list_ul .list_li");
    // for (var i = 0; i < item.length; i++) {
    var activeStatus = that.hasClass("active");
    var itemQname = that.attr("data-qname").split(",");
    var dataId = that.attr("data-id");
    var itemId = dataId ? dataId.split(",") : "";
    if (activeStatus) {
        
        // console.log(waterQualitylayers[itemQname]);
        for (var i = 0; i < itemQname.length; i++) {
            if (waterQualitylayers[itemQname[i]] != undefined) {
                waterQualitylayers[itemQname[i]].setVisible(true);
            } else {
                plus.nativeUI.showWaiting("数据加载中...");
				console.log(param_str)
				var param_str =  'data-qname="'+that.attr("data-qname")+'"'
                jc_info_fun(itemId[i], itemQname[i],param_str);
                // billboard(itemId[i],10);
            }
        }
    } else {
        for (var i = 0; i < itemQname.length; i++) {
            if (waterQualitylayers[itemQname[i]] != undefined) {
                // waterQualitylayers[itemQname[i]].setVisible(false);
				map.removeLayer(waterQualitylayers[itemQname[i]]);
				waterQualitylayers[itemQname[i]] = undefined;
				// 清除当前选择弹框
				$(".tips_wrap").find(".tips_item[data-qname = '"+that.attr("data-qname")+"']").remove();
            }
        }
    }
    // }
}

//取用水户列表api
function jc_info_fun(type, layersname,param_str) {
    console.log(type);
    var root = localStorage.getItem("str_url");
    var token = localStorage.getItem("token");
    var _url = root + "api/v3/riverchief/map/";
    console.log(token);
    console.log(_url);
    console.log(type);
    mui.ajax(_url, {
        data: {
            token: token,
            type: type,
            map_level: "7",
            center_lon: "112.557029",
            center_lat: "37.872418",
        },
        datatype: "json", //服务器返回json格式数据
        type: "post", //HTTP请求类型
        success: function (data) {
            plus.nativeUI.closeWaiting();
            if (data.data == "") {
                plus.nativeUI.toast("暂无搜索结果");
                return false;
            }
            city_dian_fun(data.data, layersname);
			// 弹窗当前选择
			if(data.searchData){
				console.log(param_str)
				$(".tips_wrap").append(`
					<div class="tips_item" ${param_str}>
						<span class="tips_title">当前选择:&nbsp;</span>
						<span class="tips_text">${data.searchData}</span>
						<span class="wrong" onclick="del_tips(this)">×</span>
					</div>
				`);
			}
			// 弹窗当前选择 end
        },
        error: function (xhr, type, errorThrown) {
            console.log("error");
            plus.nativeUI.closeWaiting();
            plus.nativeUI.toast("网络不稳定，请检查网络");
        },
    });
}
// 基础信息 end

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

/**
 * @param {Object} feature
 * @description 创建标签的样式
 */
function iconStyle_set(feature) {
    // console.log(JSON.stringify(feature));
    var level = map.getView().getZoom();
    var text = feature.values_.name;
    var images = feature.values_.item.icon;

    var item = feature.values_.item;
    var zoom = map.getView().getZoom();
    var opacity = 1;
    var scale = 0.5 + (zoom/9 - 1);

    //console.log(item.type_zoom)
    if (!item.type_zoom || item.type_zoom <= zoom) {
    } else {
        text = "";
        opacity = 8 / item.type_zoom / 2;
        scale = 0.5 + (zoom/9 - 1)
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

// 详情方法
function xiangqing(classname, id) {
    var _url = "";
    switch (classname) {
        case "xhsj": //巡河事件
            _url = "/pages/riverChief/riverPatrol_detail.html";
            break;
        case "pwk": //排污口
            _url = "/pages/riverChief/drainOutlet_detail.html";
            break;
        case "gsp": //公示牌
            _url = "/pages/riverChief/billboard_detail.html";
            break;
        case "sl": //四乱
            _url = "/pages/riverChief/clear_four_mess_detail.html";
            break;
        default:
            break;
    }

    if (_url != "") {
        mui.openWindow({
            url: _url, //通过URL传参
            id: _url, //通过URL传参
            extras: {
                item_id: id,
            },
        });
    }
}
// 点击跳转水电站详情
// map.on('click', function(e) {
// 	//在点击时获取像素区域
// 	var pixel = map.getEventPixel(e.originalEvent);
// 	map.forEachFeatureAtPixel(pixel, function(feature, vectorLayers) {
// 		var coodinate = e.coordinate;
// 		if (vectorLayers.className_ == "shanxiBoundary1") {
// 			console.log("classname="+vectorLayers.className_);
// 			console.log(ol.proj.transform(e.coordinate, 'EPSG:3857', 'EPSG:4326'));
// 		}else{
// 			var item_info = feature.values_;
// 			// console.log("----------" + JSON.stringify(item_info))
// 			xiangqing(vectorLayers.className_,item_info);
// 		}

// 	});
// });
var layerName_arr = ["xhsj", "pwk", "gsp", "sl"];
selectFun(layerName_arr, -68);
