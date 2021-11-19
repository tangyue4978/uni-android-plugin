//加载天地图的WMTS服务
var projection = ol.proj.get("EPSG:4326");
var projectionExtent = projection.getExtent();
var size = ol.extent.getWidth(projectionExtent) / 256;
var resolutions = [];
for (var z = 2; z < 19; ++z) {
    resolutions[z] = size / Math.pow(2, z);
}

//加载geoserver的WMS服务
// var TileWMSLayer = new ol.layer.Tile({
// 	source : new ol.source.TileArcGISRest({
// 		url: "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunity_Mobile/MapServer"
// 	}),
// 	projection: 'EPSG:4326'
// })

// 地形晕渲_经纬度投影
var TileWMSLayer = new ol.layer.Tile({
    source: new ol.source.WMTS({
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
	}),
});
var TitleWMSLayer_bz = new ol.layer.Tile({
    source: new ol.source.WMTS({
        name: "中国矢量注记1-4级",
        url: "https://t{0-6}.tianditu.com/cva_c/wmts?tk=470a3cb94a3196e6c324a42bf6afcb77",
        layer: "cva",
        style: "default",
        matrixSet: "c",
        format: "tiles",
        wrapX: true,
        tileGrid: new ol.tilegrid.WMTS({
            origin: ol.extent.getTopLeft(projectionExtent),
            resolutions: resolutions,
            matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        }),
    }),
});

//整个地图
var map_info_obj = {
    center: [112.387029, 37.872418], //地图中心点
    zoom: 9, //地图级别
    map_level: 9, //上传地图等级，分为三个阶段，1-9传9，10-13传13，14-17传17
    mapdata: {}, //每个等级下的对应数据
    totalData: {}, //各个图层下的总数据
    token: localStorage.getItem("token"),
    root: localStorage.getItem("str_url"),
};
var map = new ol.Map({
    interactions: ol.interaction.defaults({
        pinchRotate: false, // 移动端禁止地图旋转
    }),
    layers: [TileWMSLayer],
    target: "map",
    view: new ol.View({
        center: map_info_obj.center,
        projection: projection,
        zoom: map_info_obj.zoom,
        // maxZoom: 17,
        // minZoom: 1
    }),
});
