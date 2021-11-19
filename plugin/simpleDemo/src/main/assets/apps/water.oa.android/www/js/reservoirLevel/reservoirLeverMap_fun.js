var clickStr = mui.os.ios ? 'tap' : "click";
/**
 * 列表渲染
 */
var page = 1;
var pageStaus = true;
function search_reservoir(){
	var root = localStorage.getItem("str_url");
	var token = localStorage.getItem("token");
	console.log(arguments)
	var apiUrl = arguments[0];
	var _url = root + arguments[0];
	var layersName = arguments[2];
	var zoomLevel = map.getView().getZoom();//地图等级
	var zoomCenter = map.getView().getCenter();//地图中心点
	console.log(zoomCenter);
	// 查询类型
	var sstype_val = [];
	for(let m=0;m<$("#sstype li.active").length;m++){
		sstype_val.push($("#sstype li.active").eq(m).attr("data_type_id"))
	}
	sstype_val = sstype_val.join('_')
	// 流域 liuyu
	var liuyu_val = [];
	for(let n=0;n<$("#belongLiuyu li.active").length;n++){
		liuyu_val.push($("#belongLiuyu li.active").eq(n).attr("data_type_id"))
	}
	liuyu_val = liuyu_val.join('_')
	// 子流域
	var liuyuSon_val = [];
	for(let j=0;j<$("#belongLiuyuSon li.active").length;j++){
		liuyuSon_val.push($("#belongLiuyuSon li.active").eq(j).attr("data_type_id"))
	}
	liuyuSon_val = liuyuSon_val.join('_')
	// 河流
	var heliu_val = [];
	for(let i=0;i<$("#river li.active").length;i++){
		heliu_val.push($("#river li.active").eq(i).attr("data_type_id"))
	}
	heliu_val = heliu_val.join('_')
	var showdata = {
		"token": token,
		"page": page,
		"page_size":10,
		"name":$('.li_input').val(),
		'scaleType':sstype_val || '',             //所属类型
		"bigBasin":liuyu_val || '',//所属流域
		"riverSystem":liuyuSon_val || '',//所属子流域
		"riverCustom":heliu_val || '',//所属河流
	}
	console.log("请求路径="+_url);
	console.log("请求数据="+JSON.stringify(showdata));
	$.ajax({
		url:_url,
		data: showdata,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			console.log("----------" + JSON.stringify(data));
			if(data.code == 1){
				// if (data.data.info == "") {
				// 	plus.nativeUI.toast("暂无搜索结果");
				// 	return false;
				// }
				// 总计
				$('.totals_box .totals').text(data.data.total)
				
				// 所属河流
				var search_ol2 = data.data.riverArr;
				var search_ol2html = '<li data_type_id="">全部</li>';
				for(let i=0;i<search_ol2.length;i++){
					search_ol2html += '<li data_type_id="'+search_ol2[i].value+'">'+search_ol2[i].name+'</li>'
				}
				if(pageStaus){
					$('#river').html(search_ol2html);
				}
				
				// 所属类型
				var search_ol3 = data.data.scaleType;
				var search_ol3html = '<li data_type_id="">全部</li>';
				for(let j=0;j<search_ol3.length;j++){
					search_ol3html += '<li data_type_id="'+search_ol3[j].value+'"><div>' +search_ol3[j].name +"</div></li>"
				}
				if(pageStaus){
					$('#sstype').html(search_ol3html);
				}
				// 所属流域
				var search_ol1 = data.data.bigBasinArr;
				var huanghe = data.data.bigBasinArr.huang_he;
				var haihe = data.data.bigBasinArr.hai_he;
				var search_ol1html = '<li data_type_id="">全部</li><li data_type_id="'+huanghe.value+'">'+
				huanghe.name+'</li><li data_type_id="'+haihe.value+'">'+haihe.name+'</li>';
				if(pageStaus){
					$('#belongLiuyu').html(search_ol1html);
				}
				var search_ol4html;
				if(liuyuSon_val == ''){
					if(liuyu_val == 1){
						// 黄河流域
						var huangheSon = huanghe.son
						console.log(JSON.stringify(huangheSon))
						search_ol4html = '<li data_type_id="">全部</li>';
						for(let i=0;i<huangheSon.length;i++){
							search_ol4html += '<li data_type_id="'+huangheSon[i].value+'">'+huangheSon[i].name+'</li>'
						}
					}else if(liuyu_val == 2){
						// 海河流域
						var haiheSon = haihe.son
						console.log(haiheSon)
						console.log(JSON.stringify(haiheSon))
						search_ol4html = '<li data_type_id="">全部</li>';
						for(let i=0;i<haiheSon.length;i++){
							
							search_ol4html += '<li data_type_id="'+haiheSon[i].value+'">'+haiheSon[i].name+'</li>'
						}
					}
					$('#belongLiuyuSon').html(search_ol4html);
				}
				console.log(data.data.info.length)
				
				var search_list = data.data.info;
				if(search_list.length > 0){
					// 开启上拉刷新
					var totalHeight = 0;
					// $('.search_frame_inner').on('scroll',function(){
					// 	event.preventDefault()
					// 	// 距离顶部的距离
					// 	var itemToTop = $(this).scrollTop()
					// 	// 可视区的高度
					// 	var  itemHeight = $(this)[0].clientHeight
					// 	// 滚动条的总高度
					// 	var scrollHeight = $(this)[0].scrollHeight;
					// 	totalHeight = itemToTop+itemHeight+20;
					// 	// console.log(scrollHeight <= totalHeight)
					// 	if(scrollHeight <= totalHeight){
					// 		// console.log(scrollHeight)
					// 		// console.log(totalHeight)
					// 		console.log('11111111111111111111')
					// 		totalHeight += 20;
					// 		mui(".search_frame_inner").pullRefresh().enablePullupToRefresh();
					// 	}else{
					// 		setTimeout(function(){
					// 			mui(".search_frame_inner").pullRefresh().disablePullupToRefresh();
					// 		},2000)
					// 	}
					// })
					// 清除图层方法调用
					removeSearchLayer();
					if (showdata.page > 1) {
						// list_this.endPullupToRefresh(false);
					}
					if (showdata.page == 1) {
						$(".search_frame_list").html("");
					}
					
					//渲染列表
					var search_html = '';
					items = [];
					for(let i=0;i<search_list.length;i++){
						var data_tips={
							id:search_list[i].id,
							// type_id:search_list[i].type_id,
							name:search_list[i].name,
							icon:search_list[i].icon,
							lng:search_list[i].lng,
							lat:search_list[i].lat,
							tips:search_list[i].tips,
							scaleType:search_list[i].scaleType
						}
							
						if(search_list[i].highlight != ''){
							var search_list_data = search_list[i].tips;
							var search_list_data_html = ''
							search_list_data_html += '<span>'+search_list_data[0].value+'</span>'
							// for(let j=0;j<search_list_data.length;j++){
							// 	search_list_data_html += '<span>'+search_list_data[0].name+'：'+search_list_data[j].value+'</span>'
							// }
							
							search_html += '<li data-tips='+'\''+JSON.stringify(data_tips)+'\''+'><span>'+
								'<img src="'+search_list[i].icon+'">'+search_list_data_html+'</span>'+'<span>所在流域：'+search_list[i].bigBasin + '</br>水位：' + search_list[i].dataUpdateWater+'</li>'
							
						}
						items.push(data_tips)
					}
					console.log(JSON.stringify(data_tips))
					$('.search_frame_list').append(search_html);
					console.log(JSON.stringify(items))
					city_dian_fun(items, layersName);
				}else{
					// 阻止上拉刷新
					// $('.search_frame_inner').on('scroll',function(){
					// 	event.preventDefault()
					// 	mui(".search_frame_inner").pullRefresh().disablePullupToRefresh();
					// })
					if(showdata.page > 1){
						// list_this.endPullupToRefresh(true);
						plus.nativeUI.toast('没有更多数据了');
						// mui.toast('没有更多数据了',{ duration:'long', type:'div' })
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

//清除所有地图图层方法
function removeLayer() {
    for (let i = map.getLayers()["array_"].length - 1; i > 3; i--) {
        map.removeLayer(map.getLayers()["array_"][i]);
    }
    // 清除所有弹出层
    map.getOverlays().clear();
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


// 搜索框遮罩层的点击事件
$(".search_frame_inner_zwf").on(clickStr,function(){
	// console.log(3434)
	$(".item_type").removeClass('activeBox');
	$(".item_type").css('border','none');
	$(".position").css('display','none');
	$(".search_frame_inner_zwf").removeClass("active")
})

// 初始化上拉刷新
// mui.init({
// 	pullRefresh: {
// 		container: ".search_frame_inner", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
// 		up: {
// 			height: "50px", //可选.默认50.触发上拉加载拖动距离
// 			auto: false, //可选,默认false.自动上拉加载一次
// 			contentdown: "上拉显示更多",
// 			contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
// 			contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
// 			callback: up_fun //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
// 		}
// 	}
// });

// 监听滚动条
function scrollRefresh(item,BottomDistance){
	
	$(item).on("scroll",function(){
		var item_scrollHeight = $(item)[0].scrollHeight;
		var item_height = $(item).height();
		var distance = Number(BottomDistance) || 10;
		var itemTop = $(item).scrollTop();
		// console.log("s============================");
		// console.log("scrollTop			="+itemTop);
		// console.log("item_scrollHeight	="+item_scrollHeight);
		// console.log("item_height		="+item_height);
		// console.log("distance			="+distance);
		// console.log("e============================");
		var status = itemTop >= item_scrollHeight - item_height - distance;
		// console.log(status);
		if(status){
			up_fun()
		}
	})
}
scrollRefresh(".search_frame_inner")
// 上拉刷新的方法
var list_this = null;
function up_fun() {
	page++;
	// pageStaus = true;
	console.log("上拉加载成功");
	var self = plus.webview.currentWebview();
	console.log(page)
	list_this = this;
	var val = $(".li_input").val();
	search_reservoir(dataUrls,page,"searchLayers",val)
}


// 点击列表渲染地图
var item_info = {};
$('.search_frame_list').on(clickStr,'li',function(){
	var item = [];
	console.log($(this).attr('data-tips'))
	item_info = JSON.parse($(this).attr('data-tips'))
	//列表点击选中设置中心点
	var zoomCenter = map.getView().getCenter();//地图中心点
	console.log(zoomCenter);
	console.log(item_info.lng,item_info.lat);
	if(Math.abs(zoomCenter[0]-item_info.lng) > 2 || Math.abs(zoomCenter[1]-item_info.lat) > 2 ){
		map.getView().animate({center:map_info_obj.center,zoom:map_info_obj.zoom,duration:800},{center: [item_info.lng, item_info.lat], zoom: 8.5,duration:800});
	}else{
		map.getView().animate({center: [item_info.lng, item_info.lat],duration:800},{zoom:8.5,duration:800})
	}
	// 选中收缩搜索框
	$(".search_frame").css({ height: "1.35rem" });
	$(".search_frame .icon_arrow").css("transform", "rotateZ(360deg)");
	$(".icon_arrow").addClass("activei");
	//地图渲染参数
	item.push(item_info);
	console.log(JSON.stringify(item));
	$(this).find('span').css('color','#F35117').attr('class','activet');
	$(this).siblings().find('span').css('color','#999999').attr('class','');
	city_dian_fun(item, 'searchLayer');
})

var dataUrls = $(".search_frame").attr("data-url");
function souFun(that){
  // console.log('111')
  map.getOverlays().clear();
  
  //还原中心点
  resetCZ()
  // 清除类型样式
  $(".position").css("display", "none");
  $(".map_type_box .item_type").css("border", "none");
  $(".position_ul li").removeClass().find("span:last-child").css("display", "none");
 // 清除图层方法调用
 removeSearchLayer();
  if($(that).hasClass('active')){
    $(that).removeClass('active')
    $('.search_frame').css({
      'display':'none'
    })
  }else{
	 // 清除所有图层
	 removeLayer()
	 // 添加河流的服务
	 if (waterQualitylayers["heliu-server"] != undefined) {
	     waterQuality(layersInfo[2]);
	     waterQualitylayers["heliu-server"].setVisible(true);
	 }
    $(that).addClass('active')
    // 清除侧边栏其他选中效果
    $(".right_bar_center ul li[data-type=yjcsk]").removeClass("active");
    $(".right_bar_center ul li[data-type=wjcsk]").removeClass("active");
    $(".right_bar_center ul li[data-type=sk]").removeClass("active");
    
	$(".search_frame").css({ display: "block", height: "7rem" });
	$(".search_frame .icon_arrow").css("transform", "rotateZ(180deg)");
	$(".icon_arrow").removeClass("activei");
	// 默认禁止上拉刷新
	prohibitRefresh();
    var val = $(".li_input").val();
	page = 1;
	pageStaus = true;
    search_reservoir(dataUrls, page, "searchLayers", val);
	
  }
}

function searchFun() {
    myFunction();
}
// input框改变时触发
function myFunction() {
    map.getOverlays().clear();
    var val = $(".li_input").val();
    // if (val == "") {
    //     plus.nativeUI.toast("请输入关键字");
    //     return false;
    // }
    //还原中心点
    resetCZ()
    // 清除图层方法调用
    removeSearchLayer();
    $(".search_frame_inner").animate({ scrollTop: 0 }, 1000); //回到顶端
    $(".search_frame_list span").css("color", "#999999").attr("class", "");

    //pullup-container为在mui.init方法中配置的pullRefresh节点中的container参数；
    //注意：refresh()中需传入true
    mui(".search_frame_inner").pullRefresh().refresh(true);
    page = 1;
    pageStaus = true;
    search_reservoir(dataUrls, page, "searchLayers1", val);
}
// 清除地图弹框图层
map.on("click", function (e) {
    map.getOverlays().clear();
});
// 清除搜索框的图层方法
function removeSearchLayer() {
    // 清除所有弹出层
    map.getOverlays().clear();
    if (waterQualitylayers["searchLayer"]) {
        waterQualitylayers["searchLayer"].getSource().clear();
        map.removeLayer(waterQualitylayers["searchLayer"]);
        waterQualitylayers["searchLayer"] = undefined;
    }
    if (waterQualitylayers["searchLayers"]) {
        waterQualitylayers["searchLayers"].getSource().clear();
        map.removeLayer(waterQualitylayers["searchLayers"]);
        waterQualitylayers["searchLayers"] = undefined;
    }
    if (waterQualitylayers["searchLayers1"]) {
        waterQualitylayers["searchLayers1"].getSource().clear();
        map.removeLayer(waterQualitylayers["searchLayers1"]);
        waterQualitylayers["searchLayers1"] = undefined;
    }
}

// 选择具体类型
$('.position_ul').on(clickStr,'li',function(){
	// 清除图层方法调用
	removeSearchLayer();
	if($(this).index() > 0){
		// 切换选项
		if($(this).hasClass('active')){
			$(this).removeClass('active')
		}else{
			$(this).addClass('active')
		}
		// 判断是否全部选中
		var parentUl = $(this).parent().prop('id');
		allSelectFun(parentUl)
		if($(this).parent().attr('id') == 'belongLiuyu'){
			$('#belongLiuyuSon').html('')
		}
	}else{
		if($(this).hasClass('actives')){
			$(this).removeClass('actives').siblings().removeClass('active')
		}else{
			$(this).addClass('actives').siblings().addClass('active')
		}
	}
	page = 1;
	// 重置page 列表滚动条，重置上拉加载
	$('.search_frame_inner').scrollTop(0)
	// mui('.search_frame_inner').pullRefresh().refresh(true);
	search_reservoir(dataUrls,page,"searchLayers")
})

// 判断是否全部选中的方法
function allSelectFun(idName){
	console.log($('#'+idName))
	var liDom = $('#'+idName).children().length -1;
	var liActive = $('#'+idName).find('li.active').length
	if(liActive == liDom){
		$('#'+idName).find('li').eq(0).addClass('actives')
	}else{
		$('#'+idName).find('li').eq(0).removeClass('actives')
	}
}

// input框聚焦时触发
function inputFocus() {
    // 聚焦搜索框样式
    // $(".search_frame").css({ top: "7rem" });
    console.log($(".icon_arrow").hasClass("activei"));
    if (!$(".icon_arrow").hasClass("activei")) {
        $(".search_frame").css({ height: "1.35rem" });
    }
}
// input框失焦时触发
function inputBlur() {
    // 聚焦隐藏类型列表
    $(".position").css("display", "none");
    $(".map_type_box .item_type").css("border", "none");
    // 聚焦搜索框样式
    // $(".search_frame").css({ top: "7rem" });
    console.log($(".icon_arrow").hasClass("activei"));
    if (!$(".icon_arrow").hasClass("activei")) {
      $(".search_frame").css({ height: "7rem" });
      // $(".search_frame .icon_arrow").css("transform", "rotateZ(180deg)");
      // $(".icon_arrow").removeClass("activei");
    }
}
// 搜索框箭头点击事件
$(".icon_arrow").on(clickStr, function () {
	if ($(this).hasClass("activei")) {
		$(".search_frame").css({ height: "7rem" });
		$(".search_frame .icon_arrow").css("transform", "rotateZ(180deg)");
		$(this).removeClass("activei");
	} else {
		$(".search_frame").css({ height: "1.3rem" });
		$(".search_frame .icon_arrow").css("transform", "rotateZ(360deg)");
		$(this).addClass("activei");
	}
});


// // 默认禁止上拉刷新
prohibitRefresh();
// 选中搜索时候地图移动和改变分辨率都禁止上拉加载
function prohibitRefresh() {
    try {
        // map.on("movestart", function (evt) {
        //     console.log("============================");
        //     mui(".search_frame_inner").pullRefresh().disablePullupToRefresh();
        // });
        // map.on("moveend", function (evt) {
        //     console.log("++++++++++++++++++++++++++++");
        //     mui(".search_frame_inner").pullRefresh().disablePullupToRefresh();
        // });
        // map.getView().on("change:resolution", function () {
        //     console.log("++++++++++++++++++++++++++++");
        //     mui(".search_frame_inner").pullRefresh().disablePullupToRefresh();
        // });
    } catch (e) {
        //TODO handle the exception
    }
}


// 获取手的位置拖拽搜索框
var startY = (endY = boxHeight = 0);
var boxDefaultHeight;
// 获取底部箭头和搜索框的高度
var searchBarHeight = $(".li_div").height() + $(".search_arrow").height() + 10;
document.getElementById("search_arrow").addEventListener(
    "touchstart",
    function (e) {
        startY = e.targetTouches[0].clientY;
    },
    false
);
document.getElementById("search_arrow").addEventListener(
    "touchmove",
    function (e) {
        endY = e.targetTouches[0].clientY;
        console.log(boxDefaultHeight);
        boxHeight = startY - endY + boxDefaultHeight;
        console.log(boxHeight);
        if (boxHeight <= 450 && boxHeight >= searchBarHeight) {
            $(".search_frame").css("height", boxHeight + "px");
        }
    },
    false
);
document.getElementById("search_arrow").addEventListener(
    "touchend",
    function (e) {
        boxDefaultHeight = $(".search_frame").height();
    },
    false
);



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