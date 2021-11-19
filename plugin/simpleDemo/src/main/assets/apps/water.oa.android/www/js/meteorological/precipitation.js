map.getView().setZoom(5.9);
//头部切换
$(".tab_box li").click(function() {
	if($(this).hasClass("tab_active")){
		if($(this).hasClass("active")){
			$(this).removeClass("active")
		}else{
			$(this).addClass("active")
		}
	}else{
		$(this).addClass("tab_active").siblings().removeClass("tab_active"); //切换选中的按钮高亮状态
		$(this).addClass("active").siblings().removeClass("active"); //切换选中的按钮高亮状态
		pageStatus = true;
		var typeStatus = $(".tab_box li.tab_active").attr("data-rain");
		
		if(typeStatus == 0){//山西预报图
			$("#map").css("display","block");
			$(".map_info_title").css("display","block");
			$(".map_info_img").css("display","block");
			// $(".right_bar .right_bar_center ").css("height","auto");
			try{
				plus.nativeUI.showWaiting("加载中...");
				map.removeLayer(waterQualitylayers["vectorLayer"]);
			}catch(e){
				//TODO handle the exception
				console.log("清除图层错误")
			}
			shanxiyubaoRightBar();//插入右侧类型选项
			data_info.type = 24;
			getForecast(data_info)
		}else{
			$("#map").css("display","none");
			$(".map_info_title").css("display","none");
			$(".map_info_img").css("display","none");
			// $(".right_bar .right_bar_center ").css("height","4rem");
			data_info.rain_type = typeStatus;
			data_info.hour_type = 1;
			list(data_info);
			
		}
	}
	
	
});
// 侧边栏切换日期
$(".tab_box ").on("click",".boxInfo .type_item",function(){
	console.log('********************')
	$(this).addClass('active').siblings().removeClass('active')
	var typeStatus = $(".tab_box li.tab_active").attr("data-rain");
	if(typeStatus == 0){//山西预报图
		try{
			plus.nativeUI.showWaiting("加载中...");
			map.removeLayer(waterQualitylayers["vectorLayer"]);
		}catch(e){
			//TODO handle the exception
			console.log("清除图层错误")
		}
		data_info.type = $(this).attr("data-type");
		getForecast(data_info)
	}else{
		data_info.rain_type = typeStatus;
		data_info.hour_type = $(this).attr("data-type");
		list(data_info);
	}
})


var root = localStorage.getItem("str_url");
console.log(root)
if (root == "" || root == undefined || root == null) {
	mui.openWindow({
		url: 'login.html?cid=1', //通过URL传参
		id: 'login.html?cid=1', //通过URL传参
	})
}
var token = localStorage.getItem("token");
console.log(token);
var page = 1;
var list_this = '';
var pageStatus = true;
var data_info = {};
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	if (self.type_id == undefined) {
		self.type_id = 0;
	}
	plus.nativeUI.showWaiting("加载中...");
	data_info.token = token;
	var typeStatus = $(".tab_box li.tab_active").attr("data-rain");
	if(typeStatus == 0){//山西预报图
		$("#map").css("display","block");
		$(".map_info_title").css("display","block");
		$(".map_info_img").css("display","block");
		// $(".right_bar .right_bar_center ").css("height","auto");
		shanxiyubaoRightBar();//插入右侧类型选项
		data_info.type = 24;
		getForecast(data_info)
	}else{
		$("#map").css("display","none");
		$(".map_info_title").css("display","none");
		$(".map_info_img").css("display","none");
		// $(".right_bar .right_bar_center ").css("height","4rem");
		data_info.rain_type  = typeStatus;
		data_info.hour_type = 1;
		list(data_info);
	}
	
});
// $("#city").on("change", submit_fun);

function list(data_info) {
	console.log(JSON.stringify(data_info))
	var _url = root + 'api/v4/precipitation/index_v2';
	//24小时预报
	mui.ajax(_url, {
		data: data_info,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			console.log(JSON.stringify(data));
			// plus.nativeUI.closeWaiting();
			$(".lists_img_box").html("")
			if(data.code == 1){
				// 侧边栏
				var sides = data.data.hour_select_arr;
				console.log("===========",pageStatus)
				if(pageStatus){
					// $(".right_bar_center ul").html("")
					// for(let i=0;i<sides.length;i++){
					// 	$(".right_bar_center ul").append(`
					// 		<li class="list_li" data-li="tips" data-type="${sides[i].value}">
					// 			<img class="icon_img icon1" src="../../images/yc/clock-1.png">
					// 			<img class="icon_img icon2" src="../../images/yc/clock-2.png">
					// 			<span class="bar_text">${sides[i].name}</span>
					// 		</li>
					// 	`)
					// }
					// $(".right_bar .right_bar_center .list_li").eq(0).addClass('active')
					
					$(".tab_box .tab_active .boxInfo").html("")
					for(let i=0;i<sides.length;i++){
						$(".tab_box .tab_active .boxInfo").append(`
							<div class="type_item" data-type="${sides[i].value}">${sides[i].name}</div>
						`)
					}
					$(".tab_box .tab_active .boxInfo .type_item").eq(0).addClass('active')
				}
				
				// 图片
				$(".lists_img_box").append('<img src="' + data.data.url + '" class="lists_img">');
				// 内容标题
				var typeStatus = $(".tab_box li.tab_active").attr("data-rain");
				if(typeStatus == 1){
					var typeStr = "关于全国降水预报图";
				}else if(typeStatus == 2){
					var typeStr = "关于欧洲降水预报图";
				}else{
					var typeStr = "";
				}
				$(".lists_span_title").text(typeStr)
				// 内容
				$(".lists_span").text(data.data.text);
				pageStatus = false;
			}
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	});
}


function getForecast(data_info){
	var url = "api/v5/precipitationForecast/";
	console.log(root+url);
	console.log(JSON.stringify(data_info));
	$.ajax({
		url:root+url,
		type:"POST",
		data:data_info,
		success:function(res){
			var resData = JSON.parse(res.data);
			// var type = $(".right_bar_center ul .list_li.active").attr("data-type");
			var type = $(".tab_box .tab_active .boxInfo .type_item.active").attr("data-type");
			// var hour ="";
			// if (resData.date.hour >= 5 && resData.date.hour < 16) {
			//    hour = 6
			// } else {
			//    hour = 17
			// }
			// var str = `降水 ${type}小时预报:${resData.date.year}年${resData.date.monthValue}月${resData.date.dayOfMonth}日${hour}时发布`;
			$(".map_info_title").html(res.reportDate);
			qixingFun(JSON.parse(res.data))
			plus.nativeUI.closeWaiting();
		},
		error:function(err){
			console.log("加载失败")
			plus.nativeUI.closeWaiting();
		}
	})
}

//插入山西预报右侧选项
function shanxiyubaoRightBar(){
	var right_list =[{
		"value":24,
		"name":"24小时"
	},{
		"value":48,
		"name":"48小时"
	},{
		"value":72,
		"name":"72小时"
	}];
	// $(".right_bar_center ul").html("");
	// $(".right_bar_center ul").append(`
	// 	<li class="list_li" onclick="location.reload()">
	// 		<img class="icon_img icon1" src="../../images/right_bar/return.png">
	// 		<img class="icon_img icon2" src="../../images/right_bar/return_act.png">
	// 		<span class="bar_text">返回全图</span>
	// 	</li>
	// `)
	// for(let i=0;i<right_list.length;i++){
	// 	$(".right_bar_center ul").append(`
	// 		<li class="list_li" data-li="tips" data-type="${right_list[i].value}">
	// 			<img class="icon_img icon1" src="../../images/yc/clock-1.png">
	// 			<img class="icon_img icon2" src="../../images/yc/clock-2.png">
	// 			<span class="bar_text">${right_list[i].name}</span>
	// 		</li>
	// 	`)
	// }
	// $(".right_bar .right_bar_center .list_li").eq(1).addClass('active')
	$(".tab_box .tab_active .boxInfo").html("")
	for(let i=0;i<right_list.length;i++){
		$(".tab_box .tab_active .boxInfo").append(`
			<div class="type_item" data-type="${right_list[i].value}">${right_list[i].name}</div>
		`)
	}
	$(".tab_box .tab_active .boxInfo .type_item").eq(0).addClass('active')
}


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
				layer: "group_气象降水",
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
	}
];
for (var i = 0; i < layer_base.length; i++) {
	// 添加shp文件信息
	waterQuality(layer_base[i]);
}

function waterQuality(item) {
	if (item.datatype == "WMTS") {
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
					lineDash: item.lineDash || [],
					color: item.color,
					width: item.width,
				}),
			}),
		});
		map.addLayer(waterQualitylayers[item.name]);

		// if (item.planeImg) {
		//     planeFun(item.name, item.planeImg, item);
		// }
	}
}