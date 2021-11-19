var clickStr = mui.os.ios ? 'tap' : "click";
/**
 * @param {Object} code  上级编码，默认为空
 * @param {Object} level 1地市，2区县
 */
function getCityInfo(code, level) {
	var root = localStorage.getItem("str_url");
	var token = localStorage.getItem("token");
	var _url = root + 'api/rural/citiestowns';
	var resData = {
			"token": token,
			"code": code,
			"level": level
		}
	console.log("请求路径="+_url);
	console.log("请求数据="+JSON.stringify(resData));
	if(level == 2 && code ==""){
		$('#xzqh_xian').html("");
		return false;
	}
	mui.ajax(_url, {
		data: resData,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(res) {
			console.log("接收到的数据："+JSON.stringify(res));
			if(res.code == 1){
				//成功获取地市或区县信息
				var search_info = res.data;
				var search_html = '<li data_type_id="" data-level="'+level+'">全部</li>';
				for(let i=0;i<search_info.length;i++){
					search_html += '<li data_type_id="'+search_info[i].code+'" data-level="'+level+'">'+search_info[i].name+'</li>'
				}
				if(level == 1){
					$('#xzqh_shi').html(search_html);
				}else if (level == 2){
					if(code !=""){
						$('#xzqh_xian').html(search_html);
					}else{
						$('#xzqh_xian').html("");
					}
				}else{
					
				}
				//成功获取地市或区县信息
			}else{
				mui.toast(res.msg)
			}
			
			
		},
		error:function(e){
			console.log(e);
		}
	})
}

/**
 * 列表渲染
 */
var page = 1;
var pageStaus = true;
var default_type_val = '';//查询类型
function search_tipshighlight(){
	var root = localStorage.getItem("str_url");
	var token = localStorage.getItem("token");
	// var apiUrl = "api/v3/es_search/tipshighlight";
	console.log(arguments[0])
	var apiUrl = arguments[0];
	var _url = root + arguments[0];
	var zoomLevel = map.getView().getZoom();//地图等级
	var zoomCenter = map.getView().getCenter();//地图中心点
	console.log(zoomCenter);
	// 查询类型
	var sstype_val = $("#sstype li.active").attr("data_type_id")||'';
	default_type_val = sstype_val;
	// 地市code
	var xzqh_shi_val = $("#xzqh_shi li.active").attr("data_type_id")||'';
	// 县区code
	var xzqh_xian_val = $("#xzqh_xian li.active").attr("data_type_id")||'';
	// 流域 liuyu
	var liuyu_val = $("#liuyu li.active").attr("data_type_id")||'';
	
	var showdata = {
		"token": token,
		"page": page,
		"name":$('.li_input').val(),
		"type_id":sstype_val,//所属类型
		"big_basin":liuyu_val,//所属流域
		"city":xzqh_shi_val,//地市code
		"county":xzqh_xian_val,//区县code
	}
	console.log("请求路径="+_url);
	console.log("请求数据="+JSON.stringify(showdata));
	mui.ajax(_url, {
		data: showdata,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			console.log("----------" + JSON.stringify(data));
			if(data.code == 1){
				if (data.data == "") {
					plus.nativeUI.toast("暂无搜索结果");
					return false;
				}
				console.log(apiUrl)
				
				// 所属流域
				// console.log(JSON.stringify(data.data.drainageArr));
				var search_ol1 = data.data.bigBasinArr;
				var search_ol1html = '<li data_type_id="">全部</li>';
				for(let i=0;i<search_ol1.length;i++){
					search_ol1html += '<li data_type_id="'+search_ol1[i].value+'">'+search_ol1[i].name+'</li>'
				}
				if(pageStaus){
					$('#liuyu').html(search_ol1html);
				}
				// 行政区划-地市渲染
				if(pageStaus){
					getCityInfo("", 1)
				}
				// 所属类型
				console.log(JSON.stringify(data.data.typeArr));
				var search_ol3 = data.data.typeArr;
				var search_ol3html = '<li data_type_id="">全部</li>';
				for(let j=0;j<search_ol3.length;j++){
					var a_class = search_ol3[j].type_id == default_type_val ? "active" : '';
					search_ol3html += '<li class="'+a_class+'" data_type_id="'+search_ol3[j].type_id+'"><div><img src="'+search_ol3[j].icon+'">'+search_ol3[j].name+"("+search_ol3[j].count+')</div></li>'
				}
				if(pageStaus){
					$('#sstype').html(search_ol3html);
				}
				
				
				
				console.log(data.data.info.length)
				if(data.data.info.length > 0){
					if (showdata.page > 1) {
						list_this.endPullupToRefresh(false);
					}
					if (showdata.page == 1) {
						$(".search_frame_list").html("");
					}
					
					//渲染列表
					var search_list = data.data.info;
					var search_html = '';
					// console.log(JSON.stringify(search_list))
					for(let i=0;i<search_list.length;i++){
							var data_tips={
								id:search_list[i].id,
								type_id:search_list[i].type_id,
								name:search_list[i].name,
								icon:search_list[i].icon,
								lng:search_list[i].lng,
								lat:search_list[i].lat,
								tips:search_list[i].tips,
							}
							var rvCode = search_list[i].rvCode || "";
							var rvGrad = search_list[i].rvGrad || "";
							
							var address_str = "地址：";
							if(search_list[i].type_id == 26){
								address_str = "河源地址：";
								data_tips.icon="../../images/big_water_network/icon-12.png";
								console.log("0000000000000000000");
								console.log(data_tips.tips);
								data_tips.tips=[];
								data_tips.tips[0]=search_list[i].tips[0];
								console.log(JSON.stringify(data_tips.tips));
							}
							if(search_list[i].highlight != ''){
								
								if(search_list[i].location != ''){
									search_html += '<li data-tips='+'\''+JSON.stringify(data_tips)+'\''+' data-rvcode="'+rvCode+'" data-rvgrad="'+rvGrad+'"><span>'+
										'<img src="'+search_list[i].icon+'">'+search_list[i].highlight+'('+search_list[i].type_name+')</span><span>描述：'+
										search_list[i].outline+'</span><span>'+address_str+search_list[i].location+'</span></li>'
								}else{
									search_html += '<li data-tips='+'\''+JSON.stringify(data_tips)+'\''+' data-rvcode="'+rvCode+'" data-rvgrad="'+rvGrad+'"><span>'+
										'<img src="'+search_list[i].icon+'">'+search_list[i].highlight+'('+search_list[i].type_name+')</span><span>描述：'+
										search_list[i].outline+'</span><span>'+address_str+'-</span></li>'
								}
								
							}
					}
					console.log(JSON.stringify(data_tips))
					$('.search_frame_list').append(search_html);
					
				}else{
					if(showdata.page > 1){
						list_this.endPullupToRefresh(true);
					}else {
						$(".search_frame_list").html("");
						$(".search_frame_list").append(
							'<div style="font-size:0.35rpx;text-align:center;color:#333333;margin-top:1rem;">暂无数据</div>'
						)
					}
				}
			}
			
			pageStaus = false;
		},
		error: function(xhr, type, errorThrown) {
			console.log('error')
		}
	})
}

// 点击列表渲染地图
var item_info = {};
$('.search_frame_list').on(clickStr,'li',function(){
	var item = [];
	if(waterQualitylayers["searchLayer"]){
		waterQualitylayers["searchLayer"].getSource().clear()
		map.removeLayer(waterQualitylayers["searchLayer"]);
	}
	if(waterQualitylayers["searchLayers"]){
		waterQualitylayers["searchLayers"].getSource().clear()
		map.removeLayer(waterQualitylayers["searchLayers"]);
	}
	console.log($(this).attr('data-tips'))
	item_info = JSON.parse($(this).attr('data-tips'))
	if(item_info.type_id == 26){
		var rvcode = $(this).attr('data-rvcode');
		var rvgrad = $(this).attr('data-rvgrad');
		console.log("rvcode=================");
		console.log(rvcode);
		var new_fzhl = {
		    type_id: ["managementObjects"],
		    tname: "闪烁河流",
		    listshow: true,
		    // datatype: "WMTS",
		    datatype: "WFS",
		    name: "山西河流",
		    visibility: true,
		    fontSize: 14,
		    color: "rgba(2,114,255,0.5)",
		    width: "3",
		    serverInfo: {
		        WMTS: {
		            url: "http://gis.sxjicheng.cn:8081/freexserver/htc/service/wmts",
		            // url:"http://www.zhuoyukeji.cn:8081/freexserver/htc/service/wmts",
		            type: "WMTS",
		            // layer: "shanxi山脉水系",
		            layer: "山西河流",
		        },
		        WFS: {
		            url: "http://gis.sxjicheng.cn:8081/freexserver/wfs?service=WFS&version=1.0.0&request=GetFeature&typename=山西河流&outputFormat=application/json&CQL_FILTER=ID=%27"+rvcode+"%27",
		            // url: "http://gis.sxjicheng.cn:8081/freexserver/wfs?service=WFS&version=1.0.0&request=GetFeature&typename=山西河流&outputFormat=application/json",
		            type: "WFS",
		            layer: "山西河流",
		        },
		    }
		}
		try{
			if(waterQualitylayers["山西河流"] != undefined){
				waterQualitylayers["山西河流"].getSource().clear()
				map.removeLayer(waterQualitylayers["山西河流"]);
				waterQualitylayers["山西河流"] == undefined
			}
		}catch(e){
			//TODO handle the exception
			console.log(e);
		}
		waterQuality(new_fzhl);
		console.log(waterQualitylayers["山西河流"].getSource().getFeatures());
		setTimeout(function(){
			var feature = waterQualitylayers["山西河流"].getSource().getFeatures()[0];
			console.log("============================");
			var level_hl = waterQualitylayers["山西河流"].getSource().getFeatures()[0].values_.ADJ_RV_GRA;
			console.log(level_hl);
			rvgrad = level_hl;
			var param = {
			    layer: feature, //想要改变的对象
			    max: 10, //高亮的次数需要为双数6/2 =3次
			    time: 500, //高亮的频率800ms
			    color1: "#f39b45", //高亮的颜色
			    color2: "#00a1fe", //河流默认颜色(需要与河流的颜色相同);
			};
			mapHighlight(param);
			if(rvgrad == 1){
				map.getView().animate({zoom: 7});
			}else if(rvgrad == 2){
				map.getView().animate({zoom: 7});
			}else if(rvgrad == 3){
				map.getView().animate({zoom: 8});
			}else if(rvgrad == 4){
				map.getView().animate({zoom: 9});
			}else if(rvgrad == 5){
				map.getView().animate({zoom: 10});
			}else if(rvgrad == 6){
				map.getView().animate({zoom: 11});
			}else{
				map.getView().animate({zoom: 10});
			}
			
			
		},2000)
	}
	//列表点击选中设置中心点
	// map.getView().animate({center: [112.337029,37.872418], zoom: 7})
	var zoomCenter = map.getView().getCenter();//地图中心点
	console.log(zoomCenter);
	console.log(item_info.lng,item_info.lat);
	// if(Math.abs(zoomCenter[0]-item_info.lng) > 2 || Math.abs(zoomCenter[1]-item_info.lat) > 2 ){
	// 	map.getView().animate({center:map_info_obj.center,zoom:map_info_obj.zoom,duration:800},{center: [item_info.lng, item_info.lat], zoom: 8.5,duration:800});
	// }else{
	// 	map.getView().animate({center: [item_info.lng, item_info.lat],duration:800},{zoom:8.5,duration:800})
	// }
	// map.getView().animate({center: [item_info.lng, item_info.lat], zoom: 8})
	//列表点击选中缩放列表框
	$('.search_frame').css('height','1.8rem');
	$('.search_frame .icon_arrow').css('transform','rotateZ(360deg)');
	$('.icon_arrow').addClass('activei');
	//地图渲染参数
	item.push(item_info);
	console.log(JSON.stringify(item));
	$(this).find('span').css('color','#F35117').attr('class','activet');
	$(this).siblings().find('span').css('color','#999999').attr('class','');
	city_dian_fun(item, 'searchLayers');
})


mui.init({
	pullRefresh: {
		container: ".search_frame_inner", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
		up: {
			height: "50px", //可选.默认50.触发上拉加载拖动距离
			auto: false, //可选,默认false.自动上拉加载一次
			contentdown: "上拉显示更多",
			contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
			contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
			callback: up_fun //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
		}
	}
});
function up_fun() {
	page++;
	// pageStaus = true;
	console.log("上拉加载成功");
	var self = plus.webview.currentWebview();
	console.log(page)
	search_tipshighlight(dataUrls)

	list_this = this;
}

// 点击类型判断
$('.map_type_box').on(clickStr,'.item_type',function(){
	var index = $(this).index();
	console.log(index);
	$('.position').scrollTop(0);
	if($(this).hasClass('activeBox')){
		$(this).removeClass('activeBox');
		$(this).css('border','none');
		$(this).siblings('.position').css('display','none');
	}else{
		$('.map_type_box .item_type').removeClass('activeBox');
		$(this).addClass('activeBox');
		$(this).css('border-bottom','2px solid #F8E601').siblings().css('border','none');
		$(this).siblings('.position').css('display','block');
		$('.position').find('.position_item').eq(index).css('display','block').siblings(".position_item").css('display','none');
	}
	if($(".map_type_box .item_type.activeBox").length>0){
		$(".search_frame_inner_zwf").addClass("active")
	}else{
		$(".search_frame_inner_zwf").removeClass("active")
	}
})
$(".search_frame_inner_zwf").on(clickStr,function(){
	console.log(3434)
	$(".item_type").removeClass('activeBox');
	$(".item_type").css('border','none');
	$(".position").css('display','none');
	$(".search_frame_inner_zwf").removeClass("active")
})
// 选择具体类型
$('.position_ul').on(clickStr,'li',function(){
	var level = $(this).attr("data-level");
	// 切换选项
	if($(this).hasClass("active")){
		$(this).attr('class','')
	}else{
		$(this).attr('class','active').siblings().attr('class','')
	}
	// 重置page 列表滚动条，重置上拉加载
	page = 1;
	$('.search_frame_inner').scrollTop(0)
	mui('.search_frame_inner').pullRefresh().refresh(true);
	console.log(level)
	if(level == 1){
		// 行政区划-地市渲染
		var shi_code = $("#xzqh_shi li.active").attr("data_type_id");
		console.log(shi_code)
		getCityInfo(shi_code, 2);
		setTimeout(function(){
			search_tipshighlight(dataUrls);
		},800)
	}else{
		search_tipshighlight(dataUrls)
	}
	// 
})