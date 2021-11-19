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
	source: new ol.source.XYZ({
		url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=6&x={x}&y={y}&z={z}',
	})
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
        maxZoom: 18,
        // minZoom: 1
    }),
});
