/**
 * @description 水利地图用到的方法
 * //地图常用方法
 */

// 添加河流信息
/**
 * @description  根据配置信息向地图添加图层
 * 配置信息查看map_data.js中的layersInfo数据
 * @param {Object} item 图层数据参数对象
 */
function waterQuality(item) {
    // console.log(JSON.stringify(item))
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
    } else if (item.datatype == "WMS") {
        //加载geoserver的WMS服务
        waterQualitylayers[item.name] = new ol.layer.Tile({
            source: new ol.source.TileWMS({
                // 注意链接公司无线要在同一个局域网
                // url:"http://192.168.1.251:8088/freexserver/wms",
                // params: {'LAYERS': 'shuiligongcheng'},
                url: item.serverInfo.WMS.url,
                params: { LAYERS: item.serverInfo.WMS.layers },
            }),
            visible: item.visibility,
            // visible:false,
            className: item.name,
            // source: new ol.source.OSM(),
            projection: "EPSG:4326",
        });
        map.addLayer(waterQualitylayers[item.name]);
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
    } else if (item.datatype == "TDT") {
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
                    matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
                }),
            }),
        });
        map.addLayer(waterQualitylayers[item.name]);
    } else if (item.datatype == "WFS") {
        waterQualitylayers[item.name] = new ol.layer.Vector({
            source: new ol.source.Vector({
                url: item.serverInfo.WFS.url, //从文件加载一级河流
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
                    lineDash: item.lineDash || [],
                    color: item.color,
                    width: item.width,
                }),
            }),
        });
        map.addLayer(waterQualitylayers[item.name]);

        if (item.planeImg) {
            planeFun(item.name, item.planeImg, item);
        }
		
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
                    lineDash: item.lineDash || [],
                    color: item.color,
                    width: item.width,
                }),
            }),
        });
        map.addLayer(waterQualitylayers[item.name]);

        if (item.planeImg) {
            planeFun(item.name, item.planeImg, item);
        }
    }
}

/**
 * @description // 设置面的背景图
 * @param {Object} name
 * @param {Object} planeImg
 */
function planeFun(name, planeImg, item) {
    //"../../images/bg_map/cs2.png"
    if (!planeImg) {
        return false;
    }
    var cnv = document.createElement("canvas");
    var ctx = cnv.getContext("2d");
    var img = new Image();
    img.src = planeImg;
    if (item.width && item.width > 0) {
        var stroke = new ol.style.Stroke({
            lineDash: item.lineDash || [],
            color: item.color,
            width: item.width,
        });
    } else {
        var stroke = null;
    }

    img.onload = function () {
        var pattern = ctx.createPattern(img, "repeat");
        waterQualitylayers[name].setStyle(
            new ol.style.Style({
                fill: new ol.style.Fill({
                    color: pattern,
                }),
                stroke: stroke,
            })
        );
    };
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
        var legend = addobj.legend || addobj.legendStatus || "";

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
							<span class="legend_span" data-name="${res.tname}">${name}</span>
						</li>`;

        if ($("#" + id).length) {
            var data_group_length = $("#" + id + " .legend_ul .legend_li[data-group = '" + data_group + "']").length;
            if (data_group_length > 0 && data_group != "") {
                return false;
            } else {
                $("#" + id + " .legend_ul").append(legend_li);
            }
        } else {
            var legend_box = `<div class="legend_box" id="${id}">
									<h6 class="legend_h6">
										<img class="turn_img" src="../../images/ruralWater/water_icon/icon_07_03.png" >
										<span class="turn_text" data-name="${res.tname}">${res.tname}</span>
									</h6>
									<div class="legend_ul_box">
										<ul class="legend_ul">
											${legend_li}
										</ul>
									</div>
								</div>`;
            $(".legend_section").append(legend_box);
            // console.log(legend_box)
        }
    }
}

/**
 * @description 添加图例--专题地图
 * @param {Object} data
 */
function legendDom2(res) {
    if (res.legendStatus && res.legendStatus != undefined) {
        console.log(res.legendStatus);
        var id = res.legendStatus;
        var data_group = res.legend_group || "";
        var lengendLi = res.legend_li;
        var lengendLiHtml = "";
        for (let i = 0; i < lengendLi.length; i++) {
            lengendLiHtml += `<li class="legend_li" data-group = "${data_group}">
							<img class="legend_img" src="${lengendLi[i].legend_imgs}" alt="">
							<span class="legend_span" data-name="${res.tname}">${lengendLi[i].legend_names}</span>
						</li>`;
        }
        if ($("#" + id).length) {
            var data_group_length = $("#" + id + " .legend_ul .legend_li[data-group = '" + data_group + "']").length;
            if (data_group_length > 0 && data_group != "") {
                return false;
            } else {
                $("#" + id + " .legend_ul").append(lengendLiHtml);
            }
        } else {
            var legend_boxs = `<div class="legend_box" id="${id}">
									<h6 class="legend_h6">
										<img class="turn_img" src="../../images/ruralWater/water_icon/icon_07_03.png" >
										<span class="turn_text" data-name="${res.tname}">${res.tname}</span>
									</h6>
									<div class="legend_ul_box">
										<ul class="legend_ul">
											${lengendLiHtml}
										</ul>
									</div>
								</div>`;
            $(".legend_section").append(legend_boxs);
            // console.log(legend_boxs)
        }
    }
}

/**
 * @description 图例展开收缩
 */
$(".legend_section").on("click", ".legend_box .legend_h6", function () {
    const lengendName = $(this).find(".turn_text").attr("data-name");
    console.log(lengendName);
    if ($(this).find(".turn_text").text() == "图例") {
        $(".legend_box").css("width", "5rem");
        $(".turn_img").css("transform", "rotate(180deg)");
        $(".legend_ul_box").css("display", "block");
        $(this).find(".turn_text").text(lengendName);
    } else {
        $(".legend_box").css("width", "2rem");
        $(".turn_img").css("transform", "rotate(360deg)");
        $(".legend_ul_box").css("display", "none");
        $(this).find(".turn_text").text("图例");
    }
});

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
    } else {
        stroke = new ol.style.Stroke({
            color: feature.values_.item.stroke || "#ffffff",
            width: feature.values_.item.stroke_width || 2,
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

// 控制显示隐藏「
function isLayers(id) {
    // 切换管理对象的时候清除所有的弹出层
    map.getOverlays().clear();
    // var item = $("#"+id+" .list_obj .list_ul .list_li");
    var item = showMapLayers[id];
    for (var i = 0; i < item.length; i++) {
        var activeStatus = item[i].visibility;
        var itemQname = item[i].name;
        if (activeStatus) {
            // waterQualitylayers[itemQname].setVisible(true);
        } else {
            if (item[i].jsonUrl) {
                // waterQualitylayers[itemQname].setVisible(false);
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
    // var item = $(".list_obj .list_ul .list_li");
    // for (var i = 0; i < item.length; i++) {
    // 切换管理对象的时候清除所有的弹出层
    map.getOverlays().clear();
    var activeStatus = that.hasClass("active");
    var itemQname = that.attr("data-qname").split(",");
    var dataId = that.attr("data-id");
    var dataIndex = that.attr("data-index");
    var itemId = dataId ? dataId.split(",") : "";
    var itemIndex = dataIndex ? dataIndex.split(",") : "";
    for (var i = map.getLayers()["array_"].length - 1; i > 4; i--) {
        // map.removeLayer(waterQualitylayers[itemQname[i]]);
        map.removeLayer(map.getLayers()["array_"][i]);
    }
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
            if (layersInfo[itemIndex[i]].apiUrl && layersInfo[itemIndex[i]] != undefined) {
                plus.nativeUI.showWaiting("数据加载中...");
                var param_str =
                    'data-type="' + that.attr("data-type") + '" data-qname="' + that.attr("data-qname") + '"';
                jc_info_fun(
                    layersInfo[itemIndex[i]].apitype,
                    layersInfo[itemIndex[i]].apiUrl,
                    itemQname[i],
                    undefined,
                    param_str
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
                // 清除当前选择弹框
                $(".tips_wrap")
                    .find(".tips_item[data-qname = '" + that.attr("data-qname") + "']")
                    .remove();
            }
        }
    }
    // }
}

// 控制显示隐藏「
function isLayersOneOld(that) {
    // 切换管理对象的时候清除所有的弹出层
    map.getOverlays().clear();
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
			if(itemQname[i] == "shp_medium_irr" || itemQname[i] == "shp_medium_irr2"){
				layersInfo[itemIndex[i]].visibility = false;
			}
            // if (waterQualitylayers[itemQname[i]] != undefined) {
            // 	// waterQualitylayers[itemQname[i]].setVisible(true)
            // } else {
            // 	plus.nativeUI.showWaiting("数据加载中...");
            // 	jc_info_fun(itemId[i],layersInfo[dataIndex].apiUrl, itemQname[i]);
            // }
            if (layersInfo[itemIndex[i]].apiUrl && layersInfo[itemIndex[i]] != undefined) {
                plus.nativeUI.showWaiting("数据加载中...");
                var param_str =
                    'data-type="' + that.attr("data-type") + '" data-qname="' + that.attr("data-qname") + '"';
                jc_info_fun(
                    layersInfo[itemIndex[i]].apitype,
                    layersInfo[itemIndex[i]].apiUrl,
                    itemQname[i],
                    undefined,
                    param_str
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
                // 清除当前选择弹框
                $(".tips_wrap")
                    .find(".tips_item[data-qname = '" + that.attr("data-qname") + "']")
                    .remove();
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
        console.log($(item).text());
        $(".turn_text").text($(item).text());
    });
    //$("#legend_dsw").removeClass("active");//强制隐藏大水网图例，因暂时没有图标，待图标补齐后删除这句话即可
}
// 控制全部显示/隐藏「
function allIsLayers(datatype) {
    console.log("=================++=+=+===");
    console.log(datatype);
    console.log(map.getLayers()["array_"].length);
    for (var i = map.getLayers()["array_"].length - 1; i > 4; i--) {
        // map.removeLayer(waterQualitylayers[itemQname[i]]);
        console.log(i);
        console.log(map.getLayers()["array_"][i]["className"]);
        map.removeLayer(map.getLayers()["array_"][i]);
    }
    // for (var i = 0; i < layersInfo.length; i++) {
    // 	var objname = layersInfo[i].type_id[0];
    // 	if(objname == datatype ){
    // 		if(waterQualitylayers[layersInfo[i].name]){
    // 			if(layersInfo[i].visibility){
    // 				waterQualitylayers[layersInfo[i].name].setVisible(true);
    // 			}else{
    // 				waterQualitylayers[layersInfo[i].name].setVisible(false);
    // 			}

    // 		}

    // 	}else{
    // 		if(waterQualitylayers[layersInfo[i].name]){
    // 			waterQualitylayers[layersInfo[i].name].setVisible(false);
    // 		}
    // 	}
    // }
}

/**
 * 	==================通过接口获取数据信息================
 */

//取用水户列表api
function jc_info_fun(type, apiUrl, layersname, val, param_str) {
    console.log(type, apiUrl, layersname);
    console.log(layersname);
    console.log(arguments[3]);
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
    if (arguments[3] != undefined) {
        showdata.name = arguments[3];
    }
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
            } else if (
                apiUrl == "api/v3/rural_irrigation/mapNew" ||
                apiUrl == "api/v3/fetchwater/backboneProjectNew" ||
                apiUrl == "api/v3/licence/mapNew" ||
                apiUrl == "api/v4/water_gate_pump/pump" ||
                apiUrl == "api/v4/water_gate_pump/gate"
            ) {
                city_dian_fun(data.data.data, layersname);
            } else if (apiUrl == "api/v3/water_rain_condition/map" || apiUrl == "api/v3/water_quality/index") {
                city_dian_fun(data.data.result_data, layersname);
            } else {
                if (showdata.name != undefined) {
                    city_dian_fun(data.data.info, layersname);
                } else {
                    city_dian_fun(data.data, layersname);
                }
            }
            // 弹窗当前选择
            // $(".tips_wrap").html('')
            console.log(JSON.stringify(data.data.searchData));
            var searchData = data.data.searchData || data.searchData;
            if (searchData) {
                $(".tips_wrap").append(`
					<div class="tips_item" ${param_str}>
						<span class="tips_title">当前选择:&nbsp;</span>
						<span class="tips_text">${searchData}</span>
						<span class="wrong" onclick="del_tips(this)">×</span>
					</div>
				`);
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
    // console.log("条数="+JSON.stringify(pointArr));
    console.log(layername);
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

        if (layername == "searchLayers") {
            // 为点添加动画效果
            var item = {
                item: item_info,
            };
            map.getOverlays().clear();
            var vectorLayers = { className_: layername };
            addPopup(item, vectorLayers);
        }
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
    // console.log(JSON.stringify(feature.values_.item));
    var text = feature.values_.name;
    var images = feature.values_.item.icon || feature.values_.item.image || "./../../images/waterQuality/icon_red.png";

    var item = feature.values_.item;
    var zoom = map.getView().getZoom();
    var opacity = 1;
    var scale = 0.4;
	var opacity = 1;
	/* if (!item.type_zoom || item.type_zoom <= zoom) {
	    } else {
	        text = "";
	        opacity = 12 / item.type_zoom / 2;
	        scale = 0.4;
	    } */
    // if (!item.type_zoom || item.type_zoom <= zoom) {
    // } else {
    //     text = "";
    //     opacity = 12 / item.type_zoom / 2;
    //     scale = 0.4;
    // }
	const scaleTypes = Number(feature.values_.item.scaleType)
	if(scaleTypes === 1 || scaleTypes === 6){
		scale = 0.5 + (zoom/9 - 1)
	}else if(scaleTypes === 2){
		scale = 0.4 + (zoom/9 - 1)
	}
	
	if(waterQualitylayers["icon_04"] != undefined || 
		waterQualitylayers["icon_zxgq"] != undefined ||
		waterQualitylayers["icon_22"] != undefined || 
		waterQualitylayers["icon_23"] != undefined
	){scale = 0.4 + (zoom/9 - 1)}
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


// 侧边栏相关水库的数量
function jc_info_fun2() {
    var root = localStorage.getItem("str_url");
    var token = localStorage.getItem("token");
    var _url = root + 'api/v3/map_right_statistics/';
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
function qihe_iconStyle(feacture) {
    var newstyle = new ol.style.Style({
        // fill: new ol.style.Fill({
        //     color: "#ff0000",
        //     width: 5,
        // }),
        stroke: new ol.style.Stroke({
            color: "rgba(2,114,255,0.5)",
            width: 3,
        })
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
            width: 3,
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