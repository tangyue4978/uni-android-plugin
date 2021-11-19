var clickStr = mui.os.ios ? 'tap' : "click"

// 地图信息
//起始位置
// var center = [112.6, 37.9];
// var center = [115.387029, 35.872418];
var center = [112.387029, 37.872418];

//散列点资源
var source = new ol.source.Vector();

var projection = ol.proj.get("EPSG:4326");
var projectionExtent = projection.getExtent();
var size = ol.extent.getWidth(projectionExtent) / 256;
var resolutions = [];
for (var z = 2; z < 19; ++z) {
	resolutions[z] = size / Math.pow(2, z);
}

// 电子地图数据源
var dzMap_source = new ol.source.WMTS({
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
    source: dzMap_source,
    visible: true,
    className: "baseMap",
    projection: "EPSG:4326",
});

var TitleWMSLayer_base_bz = new ol.layer.Tile({
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
            matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
        }),
    }),
});

//山西省边界
var shanxi_shen_boundary = new ol.layer.Tile({
	source: new ol.source.WMTS({
		name: "shanxi_shen",
		url: "http://gis.sxjicheng.cn:8081/freexserver/htc/service/wmts",
		layer: "group_sxboundary_pc",
		style: "",
		matrixSet: "EPSG:4326",
		format: "image/png",
		wrapX: true,
		tileGrid: new ol.tilegrid.WMTS({
			origin: ol.extent.getTopLeft(projectionExtent),
			resolutions: [0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125,
								0.0054931640625, 0.00274658203125, 0.001373291015625, 0.0006866455078125, 0.00034332275390625,
								0.000171661376953125, 8.58306884765625e-005, 4.291534423828125e-005, 2.1457672119140625e-005
							],
			matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
		})
	}),
	className: "shanxi_shen"
})
//整个地图
var map = new ol.Map({
	interactions: ol.interaction.defaults({
		pinchRotate: false // 移动端禁止地图旋转
	}),
	layers: [TileWMSLayer_base,TitleWMSLayer_base_bz,shanxi_shen_boundary],
	target: 'map',
	view: new ol.View({
		center: center,
		projection: projection,
		zoom: 6.5
	})
});

map.on(clickStr, function(e) {
	var pixel = map.getEventPixel(e.originalEvent);
	// console.log(pixel);
	map.forEachFeatureAtPixel(pixel, function(feature, vectorlayer) {
		if (vectorlayer.className_ == "feature") {
			var item_info = feature.values_;
			console.log(JSON.stringify(item_info));
			console.log(item_info.name, item_info.code, item_info.number, "====", item_info.id);
		} else {
			console.log(vectorlayer.className_);
			console.log(e.coordinate);
		}
	})
})

// 添加山西边界start
// var boundary = new ol.layer.Vector({
// 	source: new ol.source.Vector({
// 		url: "http://gis.sxjicheng.cn:8081/freexserver/wfs?service=WFS&version=1.0.0&request=GetFeature&typename=line_china&outputFormat=application/json&srsname=EPSG:4326",
// 		format: new ol.format.GeoJSON(),
// 	}),
// 	visible: true,
// 	className: 'line_china',
// 	projection: "EPSG:4326",
// 	style: new ol.style.Style({
// 		fill: new ol.style.Fill({
// 			color: '#ff0000',
// 			width: 1,
// 		}),
// 		stroke: new ol.style.Stroke({
// 			color: '#c9717f',
// 			width: 1,
// 		}),
// 	}),
// })
// map.addLayer(boundary);
// 添加山西边界end
var showdata = {};
var dataStatus = true;
mui.plusReady(function() {
	console.log(JSON.stringify(plus.device))
	console.log(JSON.stringify(plus.os))
	if(plus.device.imei){
		map.getView().setCenter([112.387029, 37.872418]);
		map.getView().setZoom(5.8);
	}else{
		map.getView().setCenter([112.387029, 37.872418]);
		map.getView().setZoom(6.5);
	}
	plus.nativeUI.showWaiting("加载中...");
	var token = localStorage.getItem("token");
	showdata.token = token;
	showdata.radar_type = $(".boxInfo .type_item.active").attr("radar_type");
	showdata.is_timesx = 2
	showdata.ymd = ""
	showdata.start_hm = ""
	showdata.end_hm = ""
	jc_info_fun(showdata)
});


function jc_info_fun() {
	var root = localStorage.getItem("str_url");
	var _url = root + 'api/v4/weather/radarchart';
	var zoomLevel = map.getView().getZoom(); //地图等级
	var zoomCenter = map.getView().getCenter(); //地图等级
	console.log(zoomCenter);
	console.log(_url);
	console.log(JSON.stringify(showdata));
	mui.ajax(_url, {
		data: showdata,
		datatype: "json", //服务器返回json格式数据
		type: "post", //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			console.log("----------" + JSON.stringify(data));
			if (data.data == "") {
				plus.nativeUI.toast("暂无搜索结果");
				return false;
			}
			if (data.code == 1) {
				// 滚动条内容
				$(".scrollBar .progress_box .sign").html("")
				data.data.data.timeConf.scrollTitleArr.map((item) =>{
					$(".scrollBar .progress_box .sign").append(`
						<li>${item}</li>
					`)
				})
				
				// 实况图
				$(".randar").html("")
				if(showdata.radar_type == 1){
					var diagram = {
						minlon: 73.04325636691654,//左边
						minlat: 13.0721748010157825,//下边
						maxlon: 135.44916634222494,//右边
						maxlat: 56.3086243810418,//上边
						imgurl: "data.data.data.imagesArr[0]"
					}
					gethottu(diagram, "tqyb")
					
					imgArrs = data.data.data.imagesArr;
					$('.controls').removeClass('active').attr('src', '../../images/meteorological/zanting.png')
					timer = setInterval(function(){
						start(data.data.data.imagesArr)
					},200)
					$(".scrollBar").css("display","flex")
					$(".scrollBar").css("bottom","0.3rem")
					$(".right_posi").css("display","block")
				}else{
					console.log(data.data.data.imagesArr.length)
					if(data.data.data.imagesArr.length !== 0){
						if(data.data.data.imagesArr.length !== 1){
							$(".scrollBar").css("display","flex")
						}
						for(let i=0;i<data.data.data.imagesArr.length;i++){
							$(".randar").append(`
								<img class="randar_img" src="${data.data.data.imagesArr[i]}" >
							`)
						}
						imgArrs = data.data.data.imagesArr;
						$('.controls').removeClass('active').attr('src', '../../images/meteorological/zanting.png')
						timer = setInterval(function(){
							start(data.data.data.imagesArr)
						},200)
					}else{
						$(".randar").html(`
							<div style="width:40%;margin:4rem auto;text-align:center;font-size:0.28rem;color:#ccc;">暂无数据</div>
						`)
						$(".scrollBar").css("display","none")
					}
					$(".right_posi").css("display","none")
					$(".scrollBar").css("bottom","3.2rem")
				}
				
				var timeDatas = data.data.data.timeConf;
				// 日期
				$("#statics_input1").val(timeDatas.dateSelect.ymd);
				if(timeDatas.dateRange.minData || timeDatas.dateRange.minData != undefined){
					var datatime1S = timeDatas.dateRange.minData.split("-").join(',');
				}else{
					var datatime1S = '';
				}
				if(timeDatas.dateRange.maxData || timeDatas.dateRange.maxData != undefined){
					var datatime1E = timeDatas.dateRange.maxData.split("-").join(",");
				}else{
					var datatime1E = "";
				}
				var dtpicker1 = new mui.DtPicker({
					type: "date",
					beginDate: new Date(datatime1S),//设置开始日期 
					endDate: new Date(datatime1E),//设置结束日期
				});
				// 开始时间
				var datatime2S = timeDatas.dateSelect.start_hm;
				$("#statics_input2").val(datatime2S);
				var dtpicker2 = new mui.DtPicker({
					type: "time",
				});
				// 结束时间
				var datatime3S = timeDatas.dateSelect.end_hm;
				$("#statics_input3").val(datatime3S);
				var dtpicker3 = new mui.DtPicker({
					type: "time",
				});
				if(dataStatus){
					// 日期
					console.log(dtpicker1)
					document.querySelector("#statics_input1").addEventListener("click", function() {
						dtpicker1.show(function(items) {
							var times = items.y.text + "-" + items.m.text+ "-" + items.d.text
							$("#statics_input1").val(times);
						});
						
					});
					// 开始时间
					document.querySelector("#statics_input2").addEventListener("click", function() {
						dtpicker2.show(function(items) {
							$("#statics_input2").val(items.text);
						});
					});
					// 结束时间
					document.querySelector("#statics_input3").addEventListener("click", function() {
						dtpicker3.show(function(items) {
							$("#statics_input3").val(items.text);
						});
					});
				}
				
				dataStatus = false
			}
		},
		error: function(xhr, type, errorThrown) {
			console.log("error");
		},
	});
}

// 进度条start
$('.controls').on('click', function() {
	if ($(this).hasClass('active')) {
		$(this).removeClass('active').attr('src', '../../images/meteorological/zanting.png')
		timer = setInterval(function(){
			start(imgArrs)
		},200)
	} else {
		$(this).addClass('active').attr('src', '../../images/meteorological/kaishi.png')
		pause()
	}
})
var timer;
var index = 0;
var widthAdd = 0;//进度条的宽度
var imgArrs = [];//图片数组
function start(imaArr) {
	// console.log(imaArr)
	// console.log(index)
	if(index > imaArr.length-1){
		index = 0
	}else{
		if(arguments[1]){
			index = arguments[1]
		}else{
			index++
		}
	}
	
	if(showdata.radar_type == 1){
		var diagram = {
			minlon: 73.04325636691654,//左边
			minlat: 13.0721748010157825,//下边
			maxlon: 135.44916634222494,//右边
			maxlat: 56.3086243810418,//上边
			imgurl: imaArr[index]
		}
		changeSource(diagram,"tqyb")
	}else{
		$(".randar .randar_img").eq(index).show().siblings().hide();
	}
	widthAdd = Number((100 /imaArr.length).toFixed(2)) * index;
	$('.progress1_bar').width(widthAdd + '%')
	
}

function pause() {
	clearInterval(timer)
}
var startX;
var endX;
var defaulWidth;
var totalWidth = $('.progress1').width();//进度条的总宽度
$('.progress1').on('touchstart', function(e) {
	startX = e.originalEvent.touches[0].clientX;
	console.log(startX)
	pause()
	$('.controls').addClass('active').attr('src', '../../images/meteorological/kaishi.png')
}).on('touchmove', function(e) {
	e.preventDefault();
	endX = e.originalEvent.touches[0].clientX;
	console.log(endX)
	
}).on('touchend',function(e){
	defaulWidth = (endX - startX) / (totalWidth / Number(imgArrs.length)) || 0;
	console.log('11111111111111111111111'+defaulWidth)
	index = defaulWidth + index
	index = Math.floor(index)
	console.log('------------------------------',index)
	start(imgArrs,index)
})

var waterQualitylayers = {};

//修复在地图中增加按数值区域范围显示分布图
function gethottu(diagram, layersname) {
	// 图片信息
	//静态图片资源
	//console.log(JSON.stringify(diagram)); 
	let lonlat = [Number(diagram.minlon), Number(diagram.minlat), Number(diagram.maxlon), Number(diagram.maxlat)];
	let imgurl = diagram.imgurl;
	let source = new ol.source.ImageStatic({
		url: imgurl, //图片网址
		projection: 'EPSG:4326', //投影
		imageExtent: lonlat //图像坐标[minLon,minLat,maxLon,maxLat]
	})
	waterQualitylayers[layersname] = new ol.layer.Image({
		source: source, //该层的来源
		// zIndex:1,//图层渲染的Z索引,默认按加载顺序叠加
		extent: lonlat, //图层渲染范围，可选值，默认渲染全部
		visible: true, //是否显示，默认为true
		opacity: 0.8, //透明度，默认为1
	})
	map.addLayer(waterQualitylayers[layersname]);
}

function changeSource(diagram,layersname){
	// console.log(layersname)
	// console.log(waterQualitylayers[layersname])
	var lonlat = [Number(diagram.minlon), Number(diagram.minlat), Number(diagram.maxlon), Number(diagram.maxlat)];
	var imgurl = diagram.imgurl;
	var source = new ol.source.ImageStatic({
		url:imgurl, //图片网址
		projection: 'EPSG:4326', //投影
		imageExtent: lonlat //图像坐标[minLon,minLat,maxLon,maxLat]
	})
	waterQualitylayers[layersname].setSource(source)
}
// 进度条end

// 顶部二级切换
$(".nav_ul_box .boxInfo .type_item").on(clickStr,function(){
	event.stopPropagation()
	if(!$(this).hasClass("active")){
		$(this).addClass("active").siblings().removeClass("active")
		if($(this).parents(".nav_li_item").hasClass('active')){
			$(this).parents(".nav_li_item").removeClass('active')
		}else{
			$(this).parents(".nav_li_item").addClass('active')
		}
	}
	console.log($(this).attr("data-type"))
	pause()
	$('.controls').addClass('active').attr('src', '../../images/meteorological/kaishi.png')
	plus.nativeUI.showWaiting("加载中...");
	$(".scrollBar").css("display","none");//切换侧边栏的时候，隐藏滚动条
	switch ($(this).attr("data-type")){
		case "leida":
			map.addLayer(TileWMSLayer_base)
			map.addLayer(TitleWMSLayer_base_bz)
			map.addLayer(shanxi_shen_boundary)
			$(".radarLengend").show()
			$(".mapBox #map").show();
			$(".randar").hide()
			$(".screen").hide()
			break;
		case "weixing":
			removeLayer()
			break;
		case "jiangyu":
			removeLayer()
			break;
		default:
			break;
	}
	index = 0;
	showdata.radar_type = $(this).attr("radar_type");
	showdata.is_timesx = 2
	showdata.ymd = ""
	showdata.start_hm = ""
	showdata.end_hm = ""
	jc_info_fun(showdata)
})

// 头部切换事件
$(".top_nav .nav_li_item.situation").on('click',function(){
	if($(this).hasClass('active')){
		$(this).removeClass('active')
	}else{
		$(this).addClass('active')
	}
})
//清除所有地图图层方法
function removeLayer() {
	console.log(map.getLayers())
	console.log(map.getLayers()["array_"].length)
    for (let i = map.getLayers()["array_"].length; i >= 0; i--) {
        map.removeLayer(map.getLayers()["array_"][i]);
    }
    $(".radarLengend").hide()
	$(".mapBox #map").hide();
	$(".randar").show()
	$(".screen").show()
}

// 图例点击事件
$(".radarLengend").on(clickStr,function(){
	if($(this).hasClass('active')){
		$(this).removeClass("active")
		$(this).find(".radarLengend_out").hide()
		$(this).find(".radarLengend_inn").show()
	}else{
		$(this).addClass("active")
		$(this).find(".radarLengend_out").show()
		$(this).find(".radarLengend_inn").hide()
	}
})

// 筛选
$(".screen_bot_right").on(clickStr,function(){
	pause()
	$('.controls').addClass('active').attr('src', '../../images/meteorological/kaishi.png')
	showdata.is_timesx = 1
	showdata.ymd = $("#statics_input1").val()
	showdata.start_hm = $("#statics_input2").val()
	showdata.end_hm = $("#statics_input3").val()
	jc_info_fun(showdata)
})

// 回到当前
$(".screen .screen_reset").on(clickStr,function(){
	pause()
	$('.controls').addClass('active').attr('src', '../../images/meteorological/kaishi.png')
	index = 0;
	showdata.radar_type = $(".boxInfo .type_item.active").attr("radar_type");
	showdata.is_timesx = 2
	showdata.ymd = ""
	showdata.start_hm = ""
	showdata.end_hm = ""
	jc_info_fun(showdata)
})