//加载天地图的WMTS服务
var projection = ol.proj.get("EPSG:4326");
var projectionExtent = projection.getExtent();
var size = ol.extent.getWidth(projectionExtent) / 256;
var resolutions = [];
for (var z = 0; z < 19; ++z) {
    resolutions[z] = size / Math.pow(2, z);
}
var base_source = {};
//加载geoserver的WMS服务
base_source.ArcGISMap_source = new ol.source.TileArcGISRest({
    url: "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunity_Mobile/MapServer",
});

// 晕眩地图数据源
base_source.yxMap_source = new ol.source.WMTS({
    name: "中国矢量1-4级",
    url: "http://t{0-6}.tianditu.com/ter_c/wmts?tk=470a3cb94a3196e6c324a42bf6afcb77",
    layer: "ter",
    style: "default",
    matrixSet: "c",
    format: "tiles",
    wrapX: true,
    tileGrid: new ol.tilegrid.WMTS({
        origin: ol.extent.getTopLeft(projectionExtent),
        //resolutions: res.slice(0, 15),
        resolutions: resolutions,
        matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    }),
});
// 卫星地图数据源
base_source.wxMap_source = new ol.source.WMTS({
    name: "tms_world",
    url: "http://gis.sxjicheng.cn:8081/freexserver/htc/service/wmts",
    layer: "tms_world",
    style: "",
    matrixSet: "EPSG:4326",
    format: "image/png",
    wrapX: true,
    tileGrid: new ol.tilegrid.WMTS({
        origin: ol.extent.getTopLeft(projectionExtent),
        resolutions: [
            0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625,
            0.00274658203125, 0.001373291015625, 0.0006866455078125, 0.00034332275390625, 0.000171661376953125,
            8.58306884765625e-5, 4.291534423828125e-5, 2.1457672119140625e-5, 1.0728836059570313e-5,
            5.36441802978515625e-6, 2.682209014892578e-6, 1.341104507446289e-6,
        ],
        matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    }),
});
// 电子地图数据源
base_source.dzMap_source = new ol.source.WMTS({
    name: "map_world",
    url: "http://gis.sxjicheng.cn:8081/freexserver/htc/service/wmts",
    layer: "map_world",
    style: "",
    matrixSet: "EPSG:4326",
    format: "image/png",
    wrapX: true,
    tileGrid: new ol.tilegrid.WMTS({
        origin: ol.extent.getTopLeft(projectionExtent),
        resolutions: [
            0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625,
            0.00274658203125, 0.001373291015625, 0.0006866455078125, 0.00034332275390625, 0.000171661376953125,
            8.58306884765625e-5, 4.291534423828125e-5, 2.1457672119140625e-5, 1.0728836059570313e-5,
            5.36441802978515625e-6, 2.682209014892578e-6, 1.341104507446289e-6,
        ],
        matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    }),
});
var TileWMSLayer_base = new ol.layer.Tile({
    source: base_source.yxMap_source,
    visible: true,
    className: "baseMap",
    projection: "EPSG:4326",
});
var TitleWMSLayer_base_bz = new ol.layer.Tile({
    source: new ol.source.WMTS({
        name: "中国矢量注记1-4级",
        url: "http://t{0-6}.tianditu.com/cva_c/wmts?tk=470a3cb94a3196e6c324a42bf6afcb77",
        layer: "cva",
        style: "default",
        matrixSet: "c",
        format: "tiles",
        wrapX: true,
        tileGrid: new ol.tilegrid.WMTS({
            origin: ol.extent.getTopLeft(projectionExtent),
            resolutions: resolutions,
            matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
        }),
    }),
});

var waterQualitylayers = {};
//整个地图
var map_info_obj = {
    center: [112.387029, 37.872418], //地图中心点
    zoom: 6.8, //地图级别
    map_level: 9, //上传地图等级，分为三个阶段，1-9传9，10-13传13，14-17传17
    mapdata: {}, //每个等级下的对应数据
    totalData: {}, //各个图层下的总数据
    token: localStorage.getItem("token"),
    root: localStorage.getItem("str_url"),
};
if(devInfo.h_w_pixel<=1.7){
	map_info_obj.center = [112.68539013705045,37.735530161908656];
	map_info_obj.zoom = 7.25;
}
var map = new ol.Map({
    interactions: ol.interaction.defaults({
        pinchRotate: false, // 移动端禁止地图旋转
    }),
    // layers: [TileWMSLayer,TitleWMSLayer_bz],//TileWMSLayer,TitleWMSLayer_bz,
    layers: [TileWMSLayer_base, TitleWMSLayer_base_bz],
    target: "map",
    view: new ol.View({
        center: map_info_obj.center,
        projection: projection,
        zoom: map_info_obj.zoom,
        maxZoom: 14,
        minZoom: 1,
    }),
});

// $("head").append("<style>#map{background-color: #C3E2AE;}</style>")
$("#map").css("background-color", "#C3E2AE");

// if ($("#layer_level")) {
// 	var zoom = map.getView().getZoom().toFixed(1);
// 	$("#layer_level").html(zoom);
// 	map.getView().on('change:resolution', function(e) {
// 		var zoom = map.getView().getZoom().toFixed(1);
// 		$("#layer_level").html(zoom);
// 	});
// }

// 切换底图
$("body").on("click", ".change_base_map_list .imglist", function () {
    var Layer_base = $(this).attr("data-source") || "yxMap_source";
    if (Layer_base == "yxMap_source") {
        $("#map").css("background", "#C3E2AE");
        map.getView().setMaxZoom(14);
    } else {
        map.getView().setMaxZoom(18);
        $("#map").css("background", "url(../../images/bg_map/map_repeat.png) transparent");
        $("#map").css("background-size", "30px 30px");
    }
    console.log("当前图层=======" + Layer_base);
    TileWMSLayer_base.getSource().clear();
    TileWMSLayer_base.setSource(base_source[Layer_base]);
    $(this).addClass("active").siblings().removeClass("active");
});

/**
 * @description 放大
 */
function zoomInFun() {
    $(".ol-zoom .ol-zoom-in").click();
}
/**
 * @description 缩小
 */
function zoomOutFun() {
    $(".ol-zoom .ol-zoom-out").click();
}

// 添加边界线外遮罩
function addMapShade() {
    $.getJSON("../../js/map/json/line_shen.json", (data) => {
        // 添加地图遮罩
        let geoJson = new ol.format.GeoJSON();
        //获取边界数据MultiPolygon数组
        let ft = geoJson.readFeatures(data)[0];
        //获取绘制边界数据的数组，我的是数组中的第一个所以取[1]
        let linearRing = new ol.geom.Polygon(ft.getGeometry().getCoordinates());
        // 全球范围（太卡 抛弃）改取当前视窗的范围
        let extent = [-180, -90, 180, 90];
        //let polygonRing = ol.geom.Polygon.fromExtent(linearRing.getExtent()); //获取Polygon的范围，太小因此改用视窗范围
        //获取当前窗口的范围
        // let extent = map.getView().calculateExtent();
        //不想看到视窗外部线条因此做了计算
        // for (let i = 0; i < extent.length; i++) {
        //     extent[0] = extent[0] - 0.04; //左
        //     extent[1] = extent[1] - 0.04; //下
        //     extent[2] = extent[2] + 0.04; //右
        //     extent[3] = extent[3] + 0.04; //上
        // }
        //针对视窗范围设置Extent
        let polygonRing = new ol.geom.Polygon.fromExtent(extent);
        //把视窗范围添加至边界线中也就是确定外环位置
        polygonRing.appendLinearRing(linearRing);
        //把数据生成Feature
        let Polygons = new ol.Feature({
            geometry: polygonRing,
        });
        //实例化一个矢量图层Vector作为绘制层
        let vectorSource = new ol.source.Vector({
            features: [Polygons],
        });

        //创建一个图层并设置填充样式
        let vector = new ol.layer.Vector({
            source: vectorSource,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: "rgba(255,255,255,0.4)",
                }),
                // stroke: new ol.style.Stroke({
                //     lineDash: [1, 2, 3, 4, 5],
                //     color: "#ffcc33",
                //     width: 4,
                // }),
            }),
        });
        //设置图层层级
        // vector.setZIndex(10);
        //添加至地图
        map.addLayer(vector);
    });
}
addMapShade();

function calcScaleFun(min,max){
	var min = min || 0.4 ,max = max||3;
	// var 0.4 = 9*x+b
	// var 3 = 14*x+b
	// min = 9*x+b
	// max = 14*x+b
	var x = (max - min) / 5; 
	var b = max - (14 * x);
	var zoom = map.getView().getZoom();
	var scale = x * zoom + b;
	return scale;
}
