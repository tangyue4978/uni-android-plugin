var clickStr = mui.os.ios ? "tap" : "click";
// 管理对象显示隐藏
$("body").on(clickStr, ".nav_ul_box .isShow", function () {
    var objItem = $(this).attr("data-type");
    console.log($(this).attr("class"));
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
        allIsLayers($(this).attr("data-type")); //切换选项卡隐藏所有图层
        isLayers(objItem); //显示当前选项卡下图层
    }

    showHidelegend(); // 控制图例显示隐藏
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
        $(this).addClass("active");
        $li.addClass("active");
    }
    // var id = $(this).closest(".list_box").attr("id");
    // isLayers($(this));

    isLayersOne($(this));
    showHidelegend(); // 控制图例显示隐藏
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
	console.log(item.datatype+item.tname);
    // 一级河流
    // point点，默认面，线信息
    if (item.datatype == "point") {
        $.ajaxSettings.async = false; // 设置getJson同步
        var geojsonObject = $.getJSON(item.jsonUrl, function (res) {
            var vectorSource = new ol.source.Vector({});
            console.log(res);
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
    }else if (item.datatype == "WFS") {
		var newstyle = new ol.style.Style({
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
        waterQualitylayers[item.name] = new ol.layer.Vector({
            source: new ol.source.Vector({
                url: item.serverInfo.WFS.url, //从文件加载一级河流
                format: new ol.format.GeoJSON(),
            }),
            visible: item.visibility,
            // visible:false,
            className: item.name,
            projection: "EPSG:4326",
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
			style:item.style||newstyle
        });
        map.addLayer(waterQualitylayers[item.name]);

        // if(item.planeImg){
        // 	planeFun(item.name,item.planeImg,item)
        // }
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
        var dataid = addobj.apitype || "";
        var id = addobj.group_id || addobj.name;
        var legend = addobj.legend || "";

        if (addobj.listshow) {
            if ($("#" + item + " .list_ul #" + id).length) {
                var group_id = $("#" + item + " .list_ul #" + id);
                var qname_group_id = group_id.attr("data-qname") + "," + addobj.name;
                group_id.attr("data-qname", qname_group_id);
                var qname_group_index = group_id.attr("data-index") + "," + addobj.index;
                group_id.attr("data-index", qname_group_index);
            } else {
                $("#" + item + " .list_ul").append(
                    "<li id=" +
                        id +
                        ' class="list_li ' +
                        isshow +
                        '" data-index="' +
                        addobj.index +
                        '" data-qname="' +
                        addobj.name +
                        '" data-type="' +
                        addobj.datatype +
                        '" data-id="' +
                        dataid +
                        '" data-legend="' +
                        legend +
                        '">' +
                        img +
                        addobj.tname +
                        "</li>"
                );
            }
            // console.log($(".list_ul").html());
        }
    });
}

/**
 * @description 添加图例
 * @param {Object} data
 */
function legendDom(res) {
    if (res.legend && res.legend != undefined) {
        if (res.legend_img == "" || res.legend_img == undefined) {
            return false;
        }
        var id = res.legend;
        var data_group = res.legend_group || "";
        var name = res.legend_group_name || res.legendname;
        var legend_li = `<li class="legend_li" data-group = "${data_group}">
							<img class="legend_img" src="${res.legend_img}" alt="">
							<span class="legend_span">${name}</span>
						</li>`;

        if ($("#" + id).length) {
            var data_group_length = $(
                "#" + id + " .legend_ul .legend_li[data-group = '" + data_group + "']"
            ).length;
            if (data_group_length > 0 && data_group != "") {
                return false;
            } else {
                $("#" + id + " .legend_ul").append(legend_li);
            }
        } else {
            var legend_box = `<div class="legend_box" id="${id}">
									<h6 class="legend_h6">${res.tname}</h6>
									<ul class="legend_ul">
										${legend_li}
									</ul>
								</div>`;
            $(".legend_section").append(legend_box);
        }
    }
}

/**
 * @param {Object} feature
 * @description 创建标签的样式
 */
function point_set(feature) {
    var text = feature.values_.name;
    var item = feature.values_.item;
    var bgcoloor = null;
    var stroke = null;
    var fontSize = feature.values_.item.fontSize || 10;
    if (feature.values_.item.bgcolor && feature.values_.item.bgcolor != null) {
        bgcoloor = new ol.style.Fill({
            color: feature.values_.item.bgcolor,
        });
    }
    if (feature.values_.item.stroke && feature.values_.item.stroke != null) {
        stroke = new ol.style.Stroke({
            color: feature.values_.item.stroke,
            width: feature.values_.item.stroke_width || 1,
        });
    }
    //返回一个样式
    if (item.images && item.images != undefined) {
        var scale_p = item.width || 1;
        var iconStyle = new ol.style.Style({
            image: new ol.style.Icon({
                opacity: 1,
                scale: scale_p,
                src: item.images,
            }),
            text: new ol.style.Text({
                font: fontSize + "px sans-seri",
                text: String(text),
                fill: new ol.style.Fill({
                    color: item.color,
                }),
                textAlign: "left",
                // offsetY: 20,
                offsetX: 5,
                backgroundFill: bgcoloor,
                stroke: stroke,
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
                font: fontSize + "px sans-seri",
                text: String(text),
                fill: new ol.style.Fill({
                    color: item.color,
                }),
                textAlign: "left",
                // offsetY: 20,
                offsetX: 5,
                backgroundFill: bgcoloor,
                stroke: stroke,
            }),
        });
    }
    return iconStyle;
}

// 山西大水网总信息
var layersInfo = [
    // 管理对象
    // 七河五湖
	{
	    type_id: ["managementObjects"],
		group_id: "group_qh",
	    tname: "七河",
	    listshow: true,
	    // datatype: "WMTS",
	    datatype: "WFS",
	    name: "qihe",
	    visibility: true,
	    fontSize: 14,
	    width: 2,
	    bgcolor: "#53d5ff",
	    color: "#53d5ff",
	    planeImg: "../../images/bg_map/gqxx4.png",
	    serverInfo: {
	        WMTS: {
	            url: "http://gis.sxjicheng.cn:8081/freexserver/htc/service/wmts",
	            // url:"http://www.zhuoyukeji.cn:8081/freexserver/htc/service/wmts",
	            type: "WMTS",
	            // layer: "shanxi山脉水系",
	            layer: "七河",
	        },
	        WFS: {
	            url: "http://gis.sxjicheng.cn:8081/freexserver/wfs?service=WFS&version=1.0.0&request=GetFeature&typename=七河&outputFormat=application/json&srsname=EPSG:4326",
	            type: "WFS",
	            layer: "七河",
	        },
	    },
		style:function(feature){
			var param = {
			    layer: feature, //想要改变的对象
			    max: 8, //高亮的次数需要为双数6/2 =3次
			    time: 500, //高亮的频率800ms
			    color1: "#f39b45", //高亮的颜色
			    color2: "#00a1fe", //河流默认颜色(需要与河流的颜色相同);
			};
			console.log(param)
			mapHighlight(param);
		}
	},
    {
        type_id: ["managementObjects"],
    	group_id: "group_wh",
        tname: "五湖",
        listshow: true,
        // datatype: "WMTS",
        datatype: "WFS",
        name: "fivel_akes",
        visibility: false,
        fontSize: 14,
        width: 2,
        bgcolor: "rgba(83,213,255,0.5)",
        color: "#53d5ff",
        planeImg: "../../images/bg_map/gqxx4.png",
        serverInfo: {
            WMTS: {
                url: "http://gis.sxjicheng.cn:8081/freexserver/htc/service/wmts",
                // url:"http://www.zhuoyukeji.cn:8081/freexserver/htc/service/wmts",
                type: "WMTS",
                // layer: "shanxi山脉水系",
                layer: "五湖",
            },
            WFS: {
                url: "http://gis.sxjicheng.cn:8081/freexserver/wfs?service=WFS&version=1.0.0&request=GetFeature&typename=五湖&outputFormat=application/json&srsname=EPSG:4326",
                type: "WFS",
                layer: "五湖",
            },
        },
    },
    {
        type_id: ["managementObjects"],
    	group_id: "group_wh",
        tname: "五湖",
        listshow: true,
        datatype: "WMTS",
        // datatype: "WFS",
        name: "fivel_akes-zi",
        visibility: false,
        fontSize: 14,
        width: 2,
        bgcolor: "rgba(83,213,255,0.5)",
        color: "#53d5ff",
        planeImg: "../../images/bg_map/gqxx4.png",
        serverInfo: {
            WMTS: {
                url: "http://gis.sxjicheng.cn:8081/freexserver/htc/service/wmts",
                // url:"http://www.zhuoyukeji.cn:8081/freexserver/htc/service/wmts",
                type: "WMTS",
                // layer: "shanxi山脉水系",
                layer: "五湖",
            },
            WFS: {
                url: "http://gis.sxjicheng.cn:8081/freexserver/wfs?service=WFS&version=1.0.0&request=GetFeature&typename=五湖&outputFormat=application/json&srsname=EPSG:4326",
                type: "WFS",
                layer: "五湖",
            },
        },
    },
	{
	    type_id: ["managementObjects"],
	    tname: "七河流域",
	    listshow: true,
	    datatype: "WMTS",
	    name: "qiheliuyu1",
	    visibility: false,
	    fontSize: 14,
	    bgcolor: "rgba(128, 213, 235, 0.7)",
	    color: "#80D5EB",
	    // planeImg: "../../../images/big_water_network/icon_riverLake.png",
	    serverInfo: {
	        WMTS: {
	            url: "http://gis.sxjicheng.cn:8081/freexserver/htc/service/wmts",
	            type: "WMTS",
	            layer: "七河流域_pc",
	        },
	        WFS: {
	            url: "http://gis.sxjicheng.cn:8081/freexserver/wfs?service=WFS&version=1.0.0&request=GetFeature&typename=七河流域_pc&outputFormat=application/json&srsname=EPSG:4326",
	            type: "WFS",
	            layer: "七河流域_pc",
	        },
	    },
	},
    {
        type_id: ["managementObjects"],
        tname: "相关水库",
        apiUrl: "api/v4/reservoir/map",
        apitype: 2,
        listshow: true,
        images: "../../images/big_water_network/icon-14.png",
        name: "icon-14",
        datatype: "point",
        width: 0.6,
        visibility: false,
        color: "#ff9900",
    },
];
var layer_base = [
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
        tname: "地市边界",
        listshow: false,
        images: "../../images/big_water_network/icon-27-shijie.png",
        name: "shanxi_shi",
        width: 1,
        visibility: true,
        bgcolor: "rgba(255,255,255,0)",
        color: "#aaaaaa",
        jsonUrl: "../../js/map/json/line_shi.json",
    },
    {
        type_id: ["managementObjects"],
        tname: "县区边界",
        listshow: false,
        images: "../../images/big_water_network/icon-28-xianjie.png",
        name: "shanxixian",
        width: 1,
        visibility: false,
        bgcolor: "rgba(255,255,255,0)",
        color: "#2EA2F5",
        jsonUrl: "../../js/map/json/line_xian.json",
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
var showMapLayers = {}; //对象下的每组数据信息
var showMapType = []; //水利地图类型，管理对象，大水网，防洪重点
for (var i = 0; i < layer_base.length; i++) {
    // 添加shp文件信息
    waterQuality(layer_base[i]);
}
for (var i = 0; i < layersInfo.length; i++) {
    // 添加shp文件信息
    waterQuality(layersInfo[i]);
    if (layersInfo[i].type_id != "managementObjects") {
        waterQualitylayers[layersInfo[i].name].setVisible(false);
    }

    // 添加列表信息
    var listdata = layersInfo[i];
    listdata.index = i;
    addlist(listdata); //添加显示隐藏按钮
    legendDom(listdata); //添加图例列表

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
    mui.plusReady(function () {
		jc_info_fun2() //相关水库侧边栏数量
        // isLayers(showMapType[0]);
    });
}
// 地图信息 end

// 控制显示隐藏「
function isLayers(id) {
    // var item = $("#"+id+" .list_obj .list_ul .list_li");
    var item = showMapLayers[id];
    for (var i = 0; i < item.length; i++) {
        var activeStatus = item[i].visibility;
        var itemQname = item[i].name;
        if (activeStatus) {
            waterQualitylayers[itemQname].setVisible(true);
        } else {
            if (item[i].jsonUrl) {
                waterQualitylayers[itemQname].setVisible(false);
            } else {
                // console.log(item[i].apitype,item[i].apiUrl,item[i].name);
                // var self = plus.webview.currentWebview();
                // plus.nativeUI.showWaiting("加载中...");
                // jc_info_fun(item[i].apitype,item[i].apiUrl,item[i].name);
                // if(waterQualitylayers[itemQname]){
                // }else{
                // }
            }
        }
    }
}
// 控制显示隐藏「
function isLayersOne(that) {
    // 切换管理对象的时候清除所有的弹出层
    map.getOverlays().clear();
    // 还原中心点
    resetCZ()
    // var item = $(".list_obj .list_ul .list_li");
    // for (var i = 0; i < item.length; i++) {
    var activeStatus = that.hasClass("active");
    var itemQname = that.attr("data-qname").split(",");
    var dataId = that.attr("data-id");
    var dataIndex = that.attr("data-index");
    var itemId = dataId ? dataId.split(",") : "";
    var itemIndex = dataIndex ? dataIndex.split(",") : "";
    if (activeStatus) {
        // console.log(waterQualitylayers[itemQname]);
        for (var i = 0; i < itemQname.length; i++) {
            layersInfo[itemIndex[i]].visibility = activeStatus;
            // if (waterQualitylayers[itemQname[i]] != undefined) {
            // 	// waterQualitylayers[itemQname[i]].setVisible(true)
            // } else {
            // 	plus.nativeUI.showWaiting("数据加载中...");
            // 	jc_info_fun(itemId[i],layersInfo[dataIndex].apiUrl, itemQname[i]);
            // }
			console.log(layersInfo[itemIndex[i]].apiUrl != undefined && layersInfo[itemIndex[i]] != undefined);
            if (layersInfo[itemIndex[i]].apiUrl != undefined && layersInfo[itemIndex[i]] != undefined) {
                plus.nativeUI.showWaiting("数据加载中...");
                jc_info_fun(
                    layersInfo[itemIndex[i]].apitype,
                    layersInfo[itemIndex[i]].apiUrl,
                    itemQname[i]
                );
            } else {
                waterQuality(layersInfo[itemIndex[i]]);
            }
        }
    } else {
        for (var i = 0; i < itemQname.length; i++) {
            if (waterQualitylayers[itemQname[i]] != undefined) {
                // waterQualitylayers[itemQname[i]].setVisible(false)
                waterQualitylayers[itemQname[i]].getSource().clear();
                map.removeLayer(waterQualitylayers[itemQname[i]]);
                // waterQuality(item)
            }
        }
    }
    // }
}

// 控制图例显示隐藏
function showHidelegend() {
    // 控制图例显示隐藏
    var typeid = $(".active_tow").attr("data-type");
    var legend = $("#" + typeid + " .list_li.active[data-legend != '']");
    console.log(legend.length);
    $(".legend_section .legend_box").removeClass("active"); //隐藏所有图例
    legend.each(function (index, item) {
        var showid = $(item).attr("data-legend");
        $("#" + showid).addClass("active"); //显示选中的图例
    });
    //$("#legend_dsw").removeClass("active");//强制隐藏大水网图例，因暂时没有图标，待图标补齐后删除这句话即可
}
// 控制全部显示/隐藏「
function allIsLayers(datatype) {
    for (var i = 0; i < layersInfo.length; i++) {
        var objname = layersInfo[i].type_id[0];
        if (objname == datatype) {
            if (waterQualitylayers[layersInfo[i].name]) {
                if (layersInfo[i].visibility) {
                    waterQualitylayers[layersInfo[i].name].setVisible(true);
                } else {
                    waterQualitylayers[layersInfo[i].name].setVisible(false);
                }
            }
        } else {
            if (waterQualitylayers[layersInfo[i].name]) {
                waterQualitylayers[layersInfo[i].name].setVisible(false);
            }
        }
    }
}

/**
 * 	==================通过接口获取数据信息================
 */

//取用水户列表api
function jc_info_fun(type, apiUrl, layersname) {
    console.log(type, apiUrl, layersname);
    var root = localStorage.getItem("str_url");
    var token = localStorage.getItem("token");
    var _url = root + apiUrl;
    var zoomLevel = map.getView().getZoom(); //地图等级
    var zoomCenter = map.getView().getCenter(); //地图等级
    console.log(zoomCenter);
    var showdata = {
        token: token,
        type: type,
        map_level: 6,
        center_lon: zoomCenter[0],
        center_lat: zoomCenter[1],
    };
    console.log(_url);
    console.log(JSON.stringify(showdata));
    mui.ajax(_url, {
        data: showdata,
        datatype: "json", //服务器返回json格式数据
        type: "post", //HTTP请求类型
        success: function (data) {
            plus.nativeUI.closeWaiting();
            console.log("----------" + JSON.stringify(data));
            if (data.data == "") {
                plus.nativeUI.toast("暂无搜索结果");
                return false;
            }
            console.log("+++++++++++++++++++++++++++++++++++");
            if (apiUrl == "api/v4/reservoir/map") {
                city_dian_fun(data.data.reservoirRepo, layersname);
            } else {
                city_dian_fun(data.data, layersname);
            }
        },
        error: function (xhr, type, errorThrown) {
            console.log("error");
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
            name: item_info.applicant_name || item_info.name,
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
    var text = feature.values_.name;
    var images = feature.values_.item.icon || feature.values_.item.image;

    var item = feature.values_.item;
    var zoom = map.getView().getZoom();
    var opacity = 1;
    var scale = 0.3;
    /* if (!item.type_zoom || item.type_zoom <= zoom) {
    } else {
        text = "";
        opacity = 8 / item.type_zoom / 2;
        scale = 0.3;
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
                color: feature.values_.item.color || "#2EA2F5",
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

/**
 * 	================== 通过接口获取数据信息 end================
 */

map.getView().on("change:resolution", function () {
    // 重新设置图标的缩放率，基于层级20来做缩放
    // zoomLevelFun()
    var mapExtent = map.getView().calculateExtent(map.getSize());
    var point = ol.extent.getCenter(mapExtent);
    (point = ol.proj.transform([point[0], point[1]], "EPSG:3857", "EPSG:4326")),
        console.log("中心点=" + point);
    console.log("getSize=" + map.getSize());
});

map.on(clickStr, function (e) {
    //在点击时获取像素区域
    var pixel = map.getEventPixel(e.originalEvent);
    map.forEachFeatureAtPixel(pixel, function (feature, layersname) {
        console.log(layersname.className_);
        var coodinate = e.coordinate;
        //设置弹出框内容，可以HTML自定义
        if (layersname.className_ == "icon-14") {
            console.log(JSON.stringify(feature));
        } else {
            xiangqing(layersname.className_, feature.values_);
        }
    });
});

/**
 * @description 地图点跳转详情
 */
function xiangqing(className, valueObj) {
    if (className == "shanxi_shi" || className == "shanxi_shen") {
    } else {
        console.log("==================地图信息");
        // console.log(JSON.stringify(valueObj));
        console.log(className);
        switch (className) {
            case "qihe": //七河
                console.log(JSON.stringify(valueObj.Id));
                jump_xiangqing(1, valueObj.Id);
                break;
            case "qihe-zi": //七河
                jump_xiangqing(1, valueObj.item_info.properties.id);
                break;
            case "fivel_akes": //五湖
                jump_xiangqing(2, valueObj.Id);
                break;
            case "fivel_akes-zi": //五湖
                jump_xiangqing(2, valueObj.item_info.properties.id);
                break;
            case "icon-14": //相关水库
                jump_xiangqing(3, valueObj);
                break;
            default:
                console.log(className);
                break;
        }
    }
}

function jump_xiangqing(typeId, itemId) {
    var self = plus.webview.currentWebview();
    var url = "";
    var params = {
        item_id: itemId,
    };
    switch (typeId) {
        case 1: //七河详情
            url = "/pages/riverLake/qihu_detail.html";
            break;
        case 2: //五胡详情
            url = "/pages/riverLake/wuhu_detail.html";
            break;
        case 3: //水库详情
            url = "/pages/reservoirLevel/details.html";
            break;
        default:
            break;
    }
    mui.openWindow({
        url: url, //通过URL传参
        id: url, //通过URL传参
        extras: params,
    });
}
var layerName_arr = ["icon-14"];
selectFun(layerName_arr, -135);

// 侧边栏相关水库的数量
function jc_info_fun2() {
    var root = localStorage.getItem("str_url");
    var token = localStorage.getItem("token");
    var _url = root + 'api/v3/reservoir/related';
    var showdata = {
        token: token
    };
    console.log(_url);
    console.log(JSON.stringify(showdata));
    mui.ajax(_url, {
        data: showdata,
        datatype: "json", //服务器返回json格式数据
        type: "post", //HTTP请求类型
        success: function (data) {
            plus.nativeUI.closeWaiting();
            console.log("----------" + JSON.stringify(data));
            if (data.data == "") {
                plus.nativeUI.toast("暂无搜索结果");
                return false;
            }
            // 处理侧边栏添加数量
			for(let i=0;i<data.data.rightStatistics.length;i++){
				$('.right_bar .right_bar_center ul .list_li .counts').eq(i).html(data.data.rightStatistics[i].count)
			}
        },
        error: function (xhr, type, errorThrown) {
            console.log("error");
        },
    });
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

// 七河服务样式
function qihe_iconStyle2(param) {
    // console.log(param);
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
        // param.layer.setStyle(qihe_iconStyle);
		waterQualitylayers["qihe"].getSource().clear();
		map.removeLayer(waterQualitylayers["qihe"]);
		$("#managementObjects .list_ul .list_li[data-qname*='qihe']").removeClass("active");
		$(".right_bar_center ul li[data-qname*='qihe']").removeClass("active");
		
    }
}