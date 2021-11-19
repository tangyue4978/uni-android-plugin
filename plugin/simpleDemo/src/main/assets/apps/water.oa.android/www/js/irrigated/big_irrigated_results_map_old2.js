var clickStr = mui.os.ios ? "tap" : "click";

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

        if (item.planeImg) {
            planeFun(item.name, item.planeImg, item);
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
                opacity: 0.8,
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
    {
        type_id: ["managementObjects"],
        tname: "大型灌区",
        listshow: true,
        // datatype: "WMTS",
        datatype: "WFS",
        name: "shp_irrigation",
        visibility: true,
        fontSize: 14,
        bgcolor: "rgba(158,193,171,0.5)",
        color: "#297572",
        planeImg: "../../images/bg_map/gqxx4.png",
        serverInfo: {
            WMTS: {
                url: "http://gis.sxjicheng.cn:8081/freexserver/htc/service/wmts",
                // url:"http://www.zhuoyukeji.cn:8081/freexserver/htc/service/wmts",
                type: "WMTS",
                // layer: "shanxi山脉水系",
                layer: "shp_irrigation_13",
            },
            WFS: {
                url: "http://gis.sxjicheng.cn:8081/freexserver/wfs?service=WFS&version=1.0.0&request=GetFeature&typename=shp_irrigation_13&outputFormat=application/json&srsname=EPSG:4326",
                type: "WFS",
                layer: "shp_irrigation_13",
            },
        },
    },
    {
        type_id: ["managementObjects"],
        tname: "大型灌区",
        listshow: true,
        datatype: "WMTS",
        // datatype: "WFS",
        name: "shp_irrigation2",
        visibility: true,
        fontSize: 14,
        bgcolor: "rgba(158,193,171,0.5)",
        color: "#297572",
        planeImg: "../../images/bg_map/gqxx4.png",
        serverInfo: {
            WMTS: {
                url: "http://gis.sxjicheng.cn:8081/freexserver/htc/service/wmts",
                // url:"http://www.zhuoyukeji.cn:8081/freexserver/htc/service/wmts",
                type: "WMTS",
                // layer: "shanxi山脉水系",
                layer: "shp_irrigation_13",
            },
            WFS: {
                url: "http://gis.sxjicheng.cn:8081/freexserver/wfs?service=WFS&version=1.0.0&request=GetFeature&typename=shp_irrigation&outputFormat=application/json&srsname=EPSG:4326&bbox=110.8552664995167,35.2170464974118,114.48931872382224,40.053696037564016,EPSG:4326",
                type: "WFS",
                layer: "shp_irrigation",
            },
        },
    },
    {
        type_id: ["managementObjects"],
        tname: "中型灌区",
        listshow: true,
        // datatype: "WMTS",
        datatype: "WFS",
        name: "shp_medium_irr",
        visibility: false,
        fontSize: 14,
        bgcolor: "rgba(158,193,171,0.5)",
        color: "#297572",
        planeImg: "../../images/bg_map/gqxx4.png",
        serverInfo: {
            WMTS: {
                url: "http://gis.sxjicheng.cn:8081/freexserver/htc/service/wmts",
                // url:"http://www.zhuoyukeji.cn:8081/freexserver/htc/service/wmts",
                type: "WMTS",
                // layer: "shanxi山脉水系",
                layer: "shp_medium_irr",
            },
            WFS: {
                url: "http://gis.sxjicheng.cn:8081/freexserver/wfs?service=WFS&version=1.0.0&request=GetFeature&typename=shp_medium_irr&outputFormat=application/json&srsname=EPSG:4326",
                type: "WFS",
                layer: "shp_medium_irr",
            },
        },
    },
    {
        type_id: ["managementObjects"],
        tname: "中型灌区",
        listshow: true,
        datatype: "WMTS",
        // datatype: "WFS",
        name: "shp_medium_irr2",
        visibility: false,
        fontSize: 14,
        bgcolor: "rgba(158,193,171,0.5)",
        color: "#297572",
        planeImg: "../../images/bg_map/gqxx4.png",
        serverInfo: {
            WMTS: {
                url: "http://gis.sxjicheng.cn:8081/freexserver/htc/service/wmts",
                // url:"http://www.zhuoyukeji.cn:8081/freexserver/htc/service/wmts",
                type: "WMTS",
                // layer: "shanxi山脉水系",
                layer: "shp_medium_irr",
            },
            WFS: {
                url: "http://gis.sxjicheng.cn:8081/freexserver/wfs?service=WFS&version=1.0.0&request=GetFeature&typename=shp_irrigation&outputFormat=application/json&srsname=EPSG:4326&bbox=110.8552664995167,35.2170464974118,114.48931872382224,40.053696037564016,EPSG:4326",
                type: "WFS",
                layer: "shp_medium_irr",
            },
        },
    },
    // {type_id:["managementObjects"],group_id:"group_dxgq",tname:"大型灌区",listshow:true,images:"../../images/big_water_network/icon-01.png",name:"gq_icon_01",width:0.6,visibility:true,bgcolor:"rgba(158,193,171,0.5)",color:"#297572",jsonUrl:"../../js/ruralWater/irrigated_big_map/bzyhgq.json",planeImg:"../../images/bg_map/gqxx4.png"},
    // {type_id:["managementObjects"],group_id:"group_dxgq",tname:"大型灌区",listshow:true,images:"../../images/big_water_network/icon-01.png",name:"gq_icon_02",width:0.6,visibility:true,bgcolor:"rgba(158,193,171,0.5)",color:"#297572",jsonUrl:"../../js/ruralWater/irrigated_big_map/ctgq.json",planeImg:"../../images/bg_map/gqxx4.png"},
    // {type_id:["managementObjects"],group_id:"group_dxgq",tname:"大型灌区",listshow:true,images:"../../images/big_water_network/icon-01.png",name:"gq_icon_03",width:0.6,visibility:true,bgcolor:"rgba(158,193,171,0.5)",color:"#297572",jsonUrl:"../../js/ruralWater/irrigated_big_map/dydgq.json",planeImg:"../../images/bg_map/gqxx4.png"},
    // {type_id:["managementObjects"],group_id:"group_dxgq",tname:"大型灌区",listshow:true,images:"../../images/big_water_network/icon-01.png",name:"gq_icon_04",width:0.6,visibility:true,bgcolor:"rgba(158,193,171,0.5)",color:"#297572",jsonUrl:"../../js/ruralWater/irrigated_big_map/fhgq.json",planeImg:"../../images/bg_map/gqxx4.png"},
    // {type_id:["managementObjects"],group_id:"group_dxgq",tname:"大型灌区",listshow:true,images:"../../images/big_water_network/icon-01.png",name:"gq_icon_05",width:0.6,visibility:true,bgcolor:"rgba(158,193,171,0.5)",color:"#297572",jsonUrl:"../../js/ruralWater/irrigated_big_map/jmkgqh.json",planeImg:"../../images/bg_map/gqxx4.png"},
    // {type_id:["managementObjects"],group_id:"group_dxgq",tname:"大型灌区",listshow:true,images:"../../images/big_water_network/icon-01.png",name:"gq_icon_06",width:0.6,visibility:true,bgcolor:"rgba(158,193,171,0.5)",color:"#297572",jsonUrl:"../../js/ruralWater/irrigated_big_map/sghgq.json",planeImg:"../../images/bg_map/gqxx4.png"},
    // {type_id:["managementObjects"],group_id:"group_dxgq",tname:"大型灌区",listshow:true,images:"../../images/big_water_network/icon-01.png",name:"gq_icon_07",width:0.6,visibility:true,bgcolor:"rgba(158,193,171,0.5)",color:"#297572",jsonUrl:"../../js/ruralWater/irrigated_big_map/wyhgq.json",planeImg:"../../images/bg_map/gqxx4.png"},
    // {type_id:["managementObjects"],group_id:"group_dxgq",tname:"大型灌区",listshow:true,images:"../../images/big_water_network/icon-01.png",name:"gq_icon_08",width:0.6,visibility:true,bgcolor:"rgba(158,193,171,0.5)",color:"#297572",jsonUrl:"../../js/ruralWater/irrigated_big_map/xhgq.json",planeImg:"../../images/bg_map/gqxx4.png"},
    // {type_id:["managementObjects"],group_id:"group_dxgq",tname:"大型灌区",listshow:true,images:"../../images/big_water_network/icon-01.png",name:"gq_icon_09",width:0.6,visibility:true,bgcolor:"rgba(158,193,171,0.5)",color:"#297572",jsonUrl:"../../js/ruralWater/irrigated_big_map/ycszcyhgq.json",planeImg:"../../images/bg_map/gqxx4.png"},
    // {type_id:["managementObjects"],group_id:"group_dxgq",tname:"大型灌区",listshow:true,images:"../../images/big_water_network/icon-01.png",name:"gq_icon_10",width:0.6,visibility:true,bgcolor:"rgba(158,193,171,0.5)",color:"#297572",jsonUrl:"../../js/ruralWater/irrigated_big_map/ymkgq.json",planeImg:"../../images/bg_map/gqxx4.png"},
    // {type_id:["managementObjects"],group_id:"group_dxgq",tname:"大型灌区",listshow:true,images:"../../images/big_water_network/icon-01.png",name:"gq_icon_11",width:0.6,visibility:true,bgcolor:"rgba(158,193,171,0.5)",color:"#297572",jsonUrl:"../../js/ruralWater/irrigated_big_map/fxgq.json",planeImg:"../../images/bg_map/gqxx4.png"},
    // {type_id:["managementObjects"],group_id:"group_dxgq",tname:"大型灌区",listshow:true,images:"../../images/big_water_network/icon-01.png",name:"gq_icon_12",width:0.6,visibility:true,bgcolor:"rgba(158,193,171,0.5)",color:"#297572",jsonUrl:"../../js/ruralWater/irrigated_big_map/hthgq.json",planeImg:"../../images/bg_map/gqxx4.png"},
    // {type_id:["managementObjects"],group_id:"group_dxgq",tname:"灌区标注",listshow:true,datatype:"point",name:"gqbz_wenzi",width:0.6,visibility:true,bgcolor:null,color:"#829f8f",stroke: "#ffffff",stroke_width: 2,fontSize:14,jsonUrl:"../../js/map/json/gqbz_wenzi.json"},
    {
        type_id: ["managementObjects"],
        tname: "中型灌区",
        apiUrl: "api/v3/rural_irrigation/mapNew",
        apitype: 2,
        listshow: true,
        images: "../../images/big_water_network/icon_zxsk.png",
        name: "icon_zxgq",
        datatype: "point",
        width: 0.6,
        visibility: false,
        color: "#ff9900",
        bgcolor: null,
    },
];
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
function big_html() {
    if ($(".tips_item[data-qname='shp_irrigation2,shp_irrigation']").length < 1) {
        $(".tips_wrap").append(`
			<div class="tips_item"  data-qname="shp_irrigation2,shp_irrigation">
				<span class="tips_title">当前选择:&nbsp;</span>
				<span class="tips_text">大型灌区13处</span>
				<span class="wrong" onclick="del_tips(this)">×</span>
			</div>
		`);
    }
}
mui.plusReady(function () {
    //添加提示框dom
    big_html();
	jc_info_fun2();//侧边栏数量添加
});
//河道水位站地图坐标0,"api/v4/es_search/", "searchLayer",val
function jc_info_fun(type, layersname, apiUrl) {
    console.log(type, apiUrl, layersname);
    console.log(apiUrl);
    var _url = root + apiUrl;
    var showdata = {
        token: token,
        type: type,
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
            console.log(JSON.stringify(data));
            plus.nativeUI.closeWaiting();
            // plus.nativeUI.showWaiting(JSON.stringify(data.data));
            if (data.data == "") {
                plus.nativeUI.toast("暂无搜索结果");
                return false;
            }
            if (data.data.data == undefined) {
                city_dian_fun(data.data.info, layersname);
            } else {
                city_dian_fun(data.data.data, layersname);
            }

            //添加提示框dom
            if (data.data.searchData) {
                $(".tips_wrap").append(`	
				    <div class="tips_item"  data-qname="${layersname}">
					    <span class="tips_title">当前选择:&nbsp;</span>
					    <span class="tips_text">${data.data.searchData}</span>
					    <span class="wrong" onclick="del_tips(this)">×</span>
				    </div>
			    `);
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
function xiangqing(classname, id,typeId) {
    console.log(classname, id);
    switch (classname) {
        // case "gq_icon_01"://北赵引黄灌区
        // 	jump_xiangqing(1, 9)
        // 	break;
        // case "gq_icon_02"://册田灌区
        // 	jump_xiangqing(1, 3)
        // 	break;
        // case "gq_icon_03":
        // 	jump_xiangqing(1, 8)
        // 	break;
        // case "gq_icon_04"://汾河灌区
        // 	jump_xiangqing(1, 2)
        // 	break;
        // case "gq_icon_05"://夹马口灌区
        // 	jump_xiangqing(1, 7)
        // 	break;
        // case "gq_icon_06"://桑干河灌区
        // 	jump_xiangqing(1, 4)
        // 	break;
        // case "gq_icon_07"://文峪河灌区
        // 	jump_xiangqing(1, 12)
        // 	break;
        // case "gq_icon_08"://潇河灌区
        // 	jump_xiangqing(1, 5)
        // 	break;
        // case "gq_icon_09"://尊村引黄灌区
        // 	jump_xiangqing(1, 6)
        // 	break;
        // case "gq_icon_10"://禹门口灌区
        // 	jump_xiangqing(1, 1)
        // 	break;
        // case "gq_icon_11"://汾西灌区
        // 	jump_xiangqing(1, 11)
        // 	break;
        // case "gq_icon_12"://滹沱河灌区
        // 	jump_xiangqing(1, 10)
        // 	break;
        // case "icon_zxgq"://中型灌区
        // 	jump_xiangqing(2, id)
        // 	break;
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
			jump_xiangqing(2, id);
			break;
        case "searchLayer":
			console.log(typeId)
            jump_xiangqing(typeId, id);
            break;
		case "searchLayers1":
		    jump_xiangqing(1, id);
		    break;
		case "searchLayers2":
		    jump_xiangqing(2, id);
		    break;
        case "shp_medium_irr":
            jump_xiangqing(2, id);
            break;
        default:
            break;
    }
}
// 点击跳转水电站详情
map.on("click", function (e) {
    map.getOverlays().clear();
    //在点击时获取像素区域
    var pixel = map.getEventPixel(e.originalEvent);
    map.forEachFeatureAtPixel(pixel, function (feature, vectorLayers) {
        var coodinate = e.coordinate;
        // console.log("classname="+vectorLayers.className_);
        // console.log(coodinate);
        // console.log(ol.proj.transform(e.coordinate, 'EPSG:3857', 'EPSG:4326'));
        if (vectorLayers.className_ == "shp_irrigation") {
            var item_info = feature.values_;
            console.log(JSON.stringify(feature));
            console.log(item_info.layer);
            console.log(item_info.name);
			var obj = {
				layer : item_info.layer,
				item_info : item_info,
				className_: "shp_irrigation"
			}
			callAddPopup(obj)
            // xiangqing(item_info.layer, item_info);
        } else if (vectorLayers.className_ == "shp_medium_irr") {
            var item_info = feature.values_;
			
			var obj = {
				layer : vectorLayers.className_,
				item_info : item_info,
				className_: "shp_medium_irr"
			}
			callAddPopup(obj)
            // xiangqing(vectorLayers.className_, item_info.Id);
			
        } else {
        }
    });
});

var layerName_arr = ["icon_zxgq", "searchLayer","searchLayers1","searchLayers2"];
selectFun(layerName_arr, -125);
// 地图信息 end

// 坐标组
/**
 * @param {Object} feature
 * @description 创建标签的样式
 */
function iconStyle_set(feature) {
    // console.log(JSON.stringify(feature));
    var text = feature.values_.item.name;
    var images = feature.values_.item.icon;

    var item = feature.values_.item;
    var zoom = map.getView().getZoom();
    var opacity = 1;
    var scale = 0.6;
    if (!item.type_zoom || item.type_zoom <= zoom) {
    } else {
        text = "";
        opacity = 4 / item.type_zoom / 2;
        scale = 0.4;
		
    }
	opacity = 1;
	scale = 0.4 + (zoom/9 - 1);
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
            // ,backgroundFill: new ol.style.Fill({
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
    for (var i = 0; i < pointArr.length; i++) {
        var item = pointArr[i];
        // console.log(JSON.stringify(item))
        var feature = new ol.Feature({
            geometry: new ol.geom.Point([item.lng, item.lat]),
            name: item.applicant_name,
            // code: item.code,
            item: item,
        });
        vectorSource.addFeature(feature);
        //为点要素添加样式
        // feature.setStyle(iconStyle_set(feature,layername));
        if (layername == "searchLayers") {
            var item_info = {
                item: item,
            };
            map.getOverlays().clear();
			layername = layername + item.type_id;
            var vectorLayers = { className_: layername };
            addPopup(item_info, vectorLayers, -125);
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

// 管理对象显示隐藏
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

    // for (let i = 0; i < $(".list_li").length; i++) {
    //     if (i != $(this).index()) {
    //         // if ($(".list_li").eq(i).hasClass("active")) {
    //             $(".list_li").eq(i).removeClass("active");
    // let liNamestr =$(".list_li").eq(i).attr("data-qname");
    // $(".right_bar_center ul li[data-qname='"+liNamestr+"']").removeClass("active");
    // $(".tips_wrap").html("");
    //         // }
    //     }
    // }

    if ($(this).hasClass("active")) {
        $(this).removeClass("active");
        $li.removeClass("active");
        // 清除当前选择弹框
        if (liName.indexOf("icon_zxgq") != -1) {
            $(".tips_wrap").find(".tips_item[data-qname = 'icon_zxgq']").remove();
        } else {
            $(".tips_wrap")
                .find(".tips_item[data-qname = 'shp_irrigation2,shp_irrigation']")
                .remove();
        }
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
	resetAnimate()
    var activeStatus = that.hasClass("active");
    var itemQname = that.attr("data-qname").split(",");
    var itemId = that.attr("data-id");
    // for (var i = map.getLayers()["array_"].length - 1; i > 4; i--) {
    //     waterQualitylayers[map.getLayers()["array_"][i]["className_"]].setVisible(false);
    // }
    for (var i = 0; i < itemQname.length; i++) {
        if (activeStatus) {
            if (itemQname[i] == "icon_zxgq") {
                plus.nativeUI.showWaiting("数据加载中...");
                jc_info_fun(2, itemQname[i], "api/v3/rural_irrigation/mapNew");
            } else if (itemQname[i] == "shp_irrigation2" || itemQname[i] == "shp_irrigation") {
                waterQualitylayers[itemQname[i]].setVisible(true);
                big_html();
            }
        } else {
            if (waterQualitylayers[itemQname[i]] != undefined) {
                waterQualitylayers[itemQname[i]].setVisible(false);
            }
        }
    }
}

function jump_xiangqing(typeId, id) {
    var self = plus.webview.currentWebview();
    var url = "";
    console.log(Number(typeId));
    var params = {
        item_id: id,
    };
    switch (Number(typeId)) {
        case 1: //大型灌区详情
            console.log("typeId=1");
            url = "/pages/irrigated/searchDetails.html";
            params = {
                item_id: id,
                type: "big_irrigatedArea",
            };
            break;
        case 2: //中型灌区详情
            url = "/pages/irrigated/searchDetails.html";
            params = {
                item_id: id,
                type: "query_irrigatedArea",
            };
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
 * @description 搜索框
 */
var dataUrls = $(".search_frame").attr("data-url");
function soFun(self) {
    // 清除所有遮罩层
    map.getOverlays().clear();
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
	resetCZ()
    //清空搜索框
    $(".li_input").val("");
    //清除搜索地图渲染
    if (waterQualitylayers["searchLayer"]) {
        waterQualitylayers["searchLayer"].getSource().clear();
        map.removeLayer(waterQualitylayers["searchLayer"]);
    }
    if (waterQualitylayers["searchLayers1"] || waterQualitylayers["searchLayers2"]) {
        waterQualitylayers["searchLayers1"].getSource().clear();
		waterQualitylayers["searchLayers2"].getSource().clear();
        map.removeLayer(waterQualitylayers["searchLayers1"]);
		map.removeLayer(waterQualitylayers["searchLayers2"]);
    }
    var that = $(self);
    if (that.hasClass("active")) {
        that.removeClass("active");
        $(".search_frame").css("display", "none");
    } else {
        that.addClass("active");
        $(".search_frame").css({ display: "block", height: "76%" });
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
    map.getOverlays().clear();
    var val = $(".li_input").val();
    if (val == "") {
        plus.nativeUI.toast("请输入关键字");
        return false;
    }
    //还原中心点
    resetCZ()
    //列表点击选中缩放列表框
    $(".search_frame").css("height", "1.8rem");
    $(".search_frame .icon_arrow").css("transform", "rotateZ(360deg)");
    $(".icon_arrow").addClass("activei");
    //清除搜索地图图层
    if (waterQualitylayers["searchLayer"]) {
        waterQualitylayers["searchLayer"].getSource().clear();
        map.removeLayer(waterQualitylayers["searchLayer"]);
    }
    if (waterQualitylayers["searchLayers1"] || waterQualitylayers["searchLayers2"]) {
        waterQualitylayers["searchLayers1"].getSource().clear();
    	waterQualitylayers["searchLayers2"].getSource().clear();
        map.removeLayer(waterQualitylayers["searchLayers1"]);
    	map.removeLayer(waterQualitylayers["searchLayers2"]);
    }
    jc_info_fun(0, "searchLayer", "api/v4/rural_irrigation/map", val);
}

// 聚焦隐藏类型列表
$(".li_div .li_input").focus(function () {
    $(".position").css("display", "none");
    $(".map_type_box .item_type").css("border", "none");
});
function myFunction() {
    $(".search_frame_list span").css("color", "#999999").attr("class", "");
    var val = $(".li_input").val();
    if (val != "") {
        $(".search_frame").css({ display: "block", height: "76%" });
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

$(".icon_arrow").on(clickStr, function () {
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
// 地图监听层级改变

map.getView().on("change:resolution", function () {
    if ($("#zxgq_li").hasClass("active")) {
        // if(layername == "icon_zxgq"){
        if (map.getView().getZoom() >= 8) {
            waterQualitylayers["shp_medium_irr"].setVisible(true);
            waterQualitylayers["shp_medium_irr2"].setVisible(true);
			waterQualitylayers["icon_zxgq"].setVisible(false);
        } else {
            waterQualitylayers["shp_medium_irr"].setVisible(false);
            waterQualitylayers["shp_medium_irr2"].setVisible(false);
			waterQualitylayers["icon_zxgq"].setVisible(true);
        }
        // }else{
        // 	waterQualitylayers[layername].setVisible(false)
        // }
    }
});


// 大中型灌区弹窗
function callAddPopup(obj){
	// console.log(JSON.stringify(obj));
	var popData = {
	    token: token
	};
	// 大型灌区shp_irrigation
	if(obj.className_ =="shp_irrigation"){
		var _url = root + "api/v4/rural_irrigation/large_tips";
		popData.name = obj.item_info.name;
	}
	// 中型灌区shp_medium_irr
	if(obj.className_ =="shp_medium_irr"){
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
	    success: function (data) {
	        console.log(JSON.stringify(data));
	        plus.nativeUI.closeWaiting();
	        // plus.nativeUI.showWaiting(JSON.stringify(data.data));
	        if (data.data == "") {
	            plus.nativeUI.toast("暂无弹窗信息");
				
				// 大型灌区shp_irrigation
				if(obj.className_ =="shp_irrigation"){
					xiangqing(obj.item_info.layer, obj.item_info);
				}
				// 中型灌区shp_medium_irr
				if(obj.className_ =="shp_medium_irr"){
					xiangqing(obj.className_, obj.item_info.Id);
				}
	            return false;
	        }
	        // addPopup(item_info, vectorLayers, layers)
	        
	        
			// 大型灌区shp_irrigation
			if(obj.className_ =="shp_irrigation"){
				var vectorLayers = { className_: obj.item_info.layer };
			}
			// 中型灌区shp_medium_irr
			if(obj.className_ =="shp_medium_irr"){
				var vectorLayers = { className_: obj.className_ };
			}
	        addPopup(data.data.result,vectorLayers,"")
	        
			
	    },
	    error: function (xhr, type, errorThrown) {
	        console.log("error");
	        plus.nativeUI.closeWaiting();
	        plus.nativeUI.toast("网络不稳定，请检查网络");
	    },
	});
	
}


// 侧边栏灌区的数量
function jc_info_fun2() {
    var root = localStorage.getItem("str_url");
    var token = localStorage.getItem("token");
    var _url = root + 'api/v3/rural_irrigation/right_statistics';
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