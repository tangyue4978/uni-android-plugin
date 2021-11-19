var clickStr = mui.os.ios ? "tap" : "click";
// 管理对象显示隐藏
$("body").on(clickStr, ".nav_ul_box .isShow", function () {
    var objItem = $(this).attr("data-type");
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
	
    // 修改右侧对应选中状态
    let liName = $(this).attr("data-qname");
    let $li = $(".right_bar_center ul li[data-qname='" + liName + "']");
    if ($(this).hasClass("active")) {
        $(this).removeClass("active");
        $li.removeClass("active");
    } else {
        var qname = $(this).attr("data-type");
        $(this).addClass("active");
        $li.addClass("active");
        // 互斥
        if (qname == "yjcsk") {
            $(".list_ul .list_li[data-type=sk]").removeClass("active");
            $(".list_ul .list_li[data-type=wjcsk]").removeClass("active");
            //右侧选中状态
            $(".right_bar_center ul li[data-type=sk]").removeClass("active");
            $(".right_bar_center ul li[data-type=wjcsk]").removeClass("active");
            // 当前选择清除
            $(".tips_wrap .tips_item[data-type=sk]").remove();
            $(".tips_wrap .tips_item[data-type=wjcsk]").remove();
        } else if (qname == "wjcsk") {
            $(".list_ul .list_li[data-type=sk]").removeClass("active");
            $(".list_ul .list_li[data-type=yjcsk]").removeClass("active");
            //右侧选中状态
            $(".right_bar_center ul li[data-type=sk]").removeClass("active");
            $(".right_bar_center ul li[data-type=yjcsk]").removeClass("active");
            // 当前选择清除
            $(".tips_wrap .tips_item[data-type=sk]").remove();
            $(".tips_wrap .tips_item[data-type=yjcsk]").remove();
        } else {
            $(".list_ul .list_li[data-type=yjcsk]").removeClass("active");
            $(".list_ul .list_li[data-type=wjcsk]").removeClass("active");
            //右侧选中状态
            $(".right_bar_center ul li[data-type=yjcsk]").removeClass("active");
            $(".right_bar_center ul li[data-type=wjcsk]").removeClass("active");
            // 当前选择清除
            $(".tips_wrap .tips_item[data-type=yjcsk]").remove();
            $(".tips_wrap .tips_item[data-type=wjcsk]").remove();
        }
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

/**
 * @description 添加list信息向dom节点追加数据
 * @param {Object} addobj
 */
function addlist(addobj) {
    // <li class="list_li">机井</li>
    addobj.type_id.forEach(function (item, index) {
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
    // {type_id:["riverLakeLongSystem"],images:"../../images/big_water_network/icon-27-shijie.png",name:"shanxi_shi",tname:"地市边界",width:1,visibility:true,bgcolor:"rgba(255,255,255,0)",color:"#548FBE",jsonUrl:"../../js/map/json/line_shi.json"},
    // {type_id:["riverLakeLongSystem"],images:"../../images/big_water_network/icon-28-xianjie.png",name:"shanxixian",tname:"区县边界",width:1,visibility:false,bgcolor:"rgba(255,255,255,0.3)",color:"#ADB7B4",jsonUrl:"../../js/map/json/line_xian.json"}
    {
        type_id: ["managementObjects"],
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
    // 	type_id: ["managementObjects"],
    // 	tname: "山西边界",
    // 	listshow: false,
    // 	name: "shanxiBoundary2",
    // 	width: 7,
    // 	visibility: true,
    // 	bgcolor: "rgba(255,255,255,0)",
    // 	color: "#D5B9A1",
    // 	jsonUrl: "../../js/map/json/line_shen.json"
    // },
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
    // 	type_id: ["managementObjects"],
    // 	tname: "大中型水库",
    // 	listshow: true,
    // 	images: "../../images/big_water_network/icon-13.png",
    // 	name: "icon_13",
    // 	width: 0.6,
    // 	visibility: true,
    // 	bgcolor: "rgba(115,178,255,0.5)",
    // 	color: "#73B2FF",
    // 	jsonUrl: "../../js/map/json/dazhongxingshuiku.json"
    // },
    {
        type_id: ["managementObjects"],
        group_id: "group_liuyu",
        tname: "大型水库",
        listshow: true,
        datatype: "WMTS",
        // datatype: "WFS",
        name: "icon_13",
        visibility: true,
        bgcolor: "rgba(115, 223, 255, 0.3)",
        color: "#ff0000",
        fontSize: 14,
        jsonUrl: "",
        images: "../../images/big_water_network/icon-13.png",
        serverInfo: {
            WMTS: {
                url: "http://gis.sxjicheng.cn:8081/freexserver/htc/service/wmts",
                // url:"http://www.zhuoyukeji.cn:8081/freexserver/htc/service/wmts",
                type: "WMTS",
                layer: "shp_daxingshuiku",
            },
            WFS: {
                url: "http://gis.sxjicheng.cn:8081/freexserver/wfs?service=WFS&version=1.0.0&request=GetFeature&typename=sxdata_bast&outputFormat=application/json&srsname=EPSG:4326&bbox=110.8552664995167,35.2170464974118,114.48931872382224,40.053696037564016,EPSG:4326",
                type: "WFS",
                layer: "sxdata_bast",
            },
        },
    },
    {
        type_id: ["managementObjects"],
        group_id: "group_liuyu",
        tname: "中型水库",
        listshow: true,
        datatype: "WMTS",
        // datatype: "WFS",
        name: "icon_14",
        visibility: false,
        bgcolor: "rgba(115, 223, 255, 0.3)",
        color: "#ff0000",
        fontSize: 14,
        jsonUrl: "",
        images: "../../images/big_water_network/icon-13.png",
        serverInfo: {
            WMTS: {
                url: "http://gis.sxjicheng.cn:8081/freexserver/htc/service/wmts",
                type: "WMTS",
                layer: "shp_m_reservoir",
            },
            WFS: {
                url: "http://gis.sxjicheng.cn:8081/freexserver/wfs?service=WFS&version=1.0.0&request=GetFeature&typename=shp_m_reservoir&outputFormat=application/json&srsname=EPSG:4326&bbox=110.8552664995167,35.2170464974118,114.48931872382224,40.053696037564016,EPSG:4326",
                type: "WFS",
                layer: "shp_m_reservoir",
            },
        },
    },
];
for (var i = 0; i < layersInfo.length; i++) {
    // 添加shp文件信息
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
    jc_info_fun(1, "dxsk", 'data-type="sk" data-qname="dxsk,icon_13"');
});

var layerName_arr = [
	"searchLayers",
	 "searchLayers1", 
	 "searchLayer",
	 "dxsk",
	 "zxsk",
	 "xyxsk",
	 "xexsk",
	 "wjcsbsj",
	 "yjcsbsj"
	 
];
selectFun(layerName_arr);

// 地图信息 end

// 控制显示隐藏「
function isLayers(that) {
    // 切换管理对象的时候清除所有的弹出层
    map.getOverlays().clear();
   // 还原中心点
   resetCZ()
    var activeStatus = that.hasClass("active");
    var itemQname = that.attr("data-qname").split(",");
    var dataId = that.attr("data-id");
    var datatype = that.attr("data-type");
    var quit = "";
    var itemId = dataId ? dataId.split(",") : "";
    console.log(activeStatus);
    if (activeStatus) {
        // 互斥
        if (datatype == "sk") {
            quit = $(".list_ul .list_li[data-type = yjcsk],.list_ul .list_li[data-type = wjcsk]");
        } else if (datatype == "yjcsk") {
            quit = $(".list_ul .list_li[data-type = sk],.list_ul .list_li[data-type = wjcsk]");
        } else {
            quit = $(".list_ul .list_li[data-type = sk],.list_ul .list_li[data-type = yjcsk]");
        }
        //渲染当前图层
        var mian_arr = ["icon_13", "icon_14"];
        for (var i = 0; i < quit.length; i++) {
            var quitQname = quit.eq(i).attr("data-qname").split(",");
            for (var j = 0; j < quitQname.length; j++) {
                console.log(quitQname[j]);
                console.log(waterQualitylayers[quitQname[j]]);
                console.log(mian_arr.indexOf(quitQname[j]));
                if (waterQualitylayers[quitQname[j]] != undefined) {
                    if (waterQualitylayers[quitQname[j]] != undefined && mian_arr.indexOf(quitQname[j]) != -1) {
                        console.log(quitQname[j]);
                        waterQualitylayers[quitQname[j]].setVisible(false);
                    } else {
                        console.log("aaaaaaaaaaaa");
                        waterQualitylayers[quitQname[j]].getSource().clear();
                        map.removeLayer(waterQualitylayers[quitQname[j]]);
                        waterQualitylayers[quitQname[j]] = undefined;
                    }
                }
            }
        }
        for (var i = 0; i < itemQname.length; i++) {
            if (waterQualitylayers[itemQname[i]] != undefined) {
                waterQualitylayers[itemQname[i]].setVisible(true);
            } else {
                plus.nativeUI.showWaiting("数据加载中...");
                var param_str =
                    'data-type="' + that.attr("data-type") + '" data-qname="' + that.attr("data-qname") + '"';
                jc_info_fun(itemId[i], itemQname[i], param_str);
            }
        }
    } else {
        var mian_arr = ["icon_13", "icon_14"];
        for (var i = 0; i < itemQname.length; i++) {
            if (waterQualitylayers[itemQname[i]] != undefined) {
                if (mian_arr.indexOf(itemQname[i]) != -1) {
                    waterQualitylayers[itemQname[i]].setVisible(false);
                } else {
                    waterQualitylayers[itemQname[i]].getSource().clear();
                    map.removeLayer(waterQualitylayers[itemQname[i]]);
                    waterQualitylayers[itemQname[i]] = undefined;
                    // 清除当前选择弹框
                    $(".tips_wrap")
                        .find(".tips_item[data-qname = '" + that.attr("data-qname") + "']")
                        .remove();
                }
            }
        }
    }
}

//取用水户列表api

function jc_info_fun(type, layersname, param_str) {
    plus.nativeUI.showWaiting("数据加载中...");
    var root = localStorage.getItem("str_url");
    var token = localStorage.getItem("token");
    var _url = root + "api/v4/reservoir/map";
    console.log(token);
    console.log(_url);
    console.log(type);
    mui.ajax(_url, {
        data: {
            token: token,
            type: type,
        },
        datatype: "json", //服务器返回json格式数据
        type: "post", //HTTP请求类型
        success: function (data) {
            // console.log("==========" + JSON.stringify(data));
            plus.nativeUI.closeWaiting();
            if (data.data == "") {
                plus.nativeUI.toast("暂无搜索结果");
                return false;
            }
            city_dian_fun(data.data.reservoirRepo, layersname);

            // 弹窗当前选择
            if (data.data.searchData) {
                $(".tips_wrap").append(`
					<div class="tips_item" ${param_str}>
						<span class="tips_title">当前选择:&nbsp;</span>
						<span class="tips_text">${data.data.searchData}</span>
						<span class="wrong" onclick="del_tips(this)">×</span>
					</div>
				`);
            }

            // 弹窗当前选择 end
			// 处理侧边栏
			// 水库座数
			var counts = data.data.scale_type
			// console.log(counts)
			for(var i = 0;i<counts.length;i++){
				$('.right_bar .right_bar_center ul .list_li .counts').eq(i).html(counts[i].count)
			}
			
			
			
        },
        error: function (xhr, type, errorThrown) {
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
    for (var i = 0; i < pointArr.length; i++) {
        var item_info = pointArr[i];
        var feature = new ol.Feature({
            geometry: new ol.geom.Point([item_info.lng, item_info.lat]),
            name: item_info.name,
            item: item_info,
        });
        vectorSource.addFeature(feature);
		if(layername == 'searchLayer'){
		    var items = {
		      item:item_info
		    }
		    map.getOverlays().clear();
		    var vectorLayers ={className_:layername}
		    addPopup(items,vectorLayers,-125)
		}
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
    var text = feature.values_.name;
    var images = feature.values_.item.icon;
    // var item = feature.values_.item;
    var zoom = map.getView().getZoom();
    var scale = 0.6;
    // var opacity = feature.values_.item.scale == "大型" ? 0 : 0.8;
    // console.log(feature.values_.item.scaleType);
    // feature.values_.item.scale === "小1型" || feature.values_.item.scale === "小2型" ? (scale = 0.3) : (scale = 0.6);
	const scaleTypes = Number(feature.values_.item.scaleType)
	if(scaleTypes === 1 || scaleTypes === 6){
		scale = 0.5 + (zoom/9 - 1)
	}else if(scaleTypes === 2){
		scale = 0.4 + (zoom/9 - 1)
	}else if(scaleTypes === 4 || scaleTypes === 5){
		scale = 0.35 + (zoom/9 - 1)
	}
	let opacity = 1;
    // if (!item.type_zoom || item.type_zoom <= zoom) {
    //     opacity = 1;
    // } else {
    //     text = "";
    //     opacity = 4 / item.type_zoom / 2;
    //     scale = 0.4;
    // }
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
            // 	color: null
            // })
        }),
        zIndex: Infinity,
    });

    return iconStyle;
}

// 详情方法
function xiangqing(classname, item_id) {
    switch (classname) {
        case "dxsk":
        // case "icon_13":
		case 'searchLayer':
		case 'searchLayers':
		case 'searchLayers1':
        case "zxsk":
        case "xyxsk":
        case "xexsk":
        case "wjcsbsj":
        case "yjcsbsj":
            mui.openWindow({
                url: "details_syt.html", //通过URL传参
                id: "details_syt.html", //通过URL传参
                extras: {
                    item_id: item_id,
                },
            });
            break;
        default:
            break;
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