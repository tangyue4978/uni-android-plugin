var clickStr = mui.os.ios ? "tap" : "click";

/**
 * 列表渲染
 */
var page = 1;
var pageStaus = true;
var itemListInfo = {};
var items = [];
function search_tipshighlight() {
    plus.nativeUI.showWaiting("数据加载中...");
    var root = localStorage.getItem("str_url");
    var token = localStorage.getItem("token");
    // var apiUrl = "api/v3/es_search/tipshighlight";
    console.log(arguments[0]);
    var apiUrl = arguments[0];
    var _url = root + arguments[0];
    var layersName = arguments[2];
    console.log(layersName);
    var zoomLevel = map.getView().getZoom(); //地图等级
    var zoomCenter = map.getView().getCenter(); //地图中心点
    console.log(zoomCenter);
    // 查询类型
    var sstype_val = [];
    for (let m = 0; m < $("#sstype li.active").length; m++) {
        sstype_val.push($("#sstype li.active").eq(m).attr("data_type_id"));
    }
    sstype_val = sstype_val.join(",");
    // 流域 liuyu
    var liuyu_val = [];
    for (let n = 0; n < $("#belongLiuyu li.active").length; n++) {
        liuyu_val.push($("#belongLiuyu li.active").eq(n).attr("data_type_id"));
    }
    liuyu_val = liuyu_val.join(",");
    // 子流域
    var liuyuSon_val = [];
    for (let j = 0; j < $("#belongLiuyuSon li.active").length; j++) {
        liuyuSon_val.push($("#belongLiuyuSon li.active").eq(j).attr("data_type_id"));
    }
    liuyuSon_val = liuyuSon_val.join(",");
    // 河流
    var heliu_val = [];
    for (let i = 0; i < $("#river li.active").length; i++) {
        heliu_val.push($("#river li.active").eq(i).attr("data_type_id"));
    }
    heliu_val = heliu_val.join(",");
    var showdata = {
        token: token,
        page: page,
        page_size: 10,
        name: $(".li_input").val(),
        type_id: sstype_val || "", //所属类型
        big_basin: liuyu_val || "", //所属流域
        river_system_custom_code: liuyuSon_val || "", //所属子流域
        river_custom_code: heliu_val || "", //所属河流
    };
    console.log("请求路径=" + _url);
    console.log("请求数据=" + JSON.stringify(showdata));
    mui.ajax(_url, {
        data: showdata,
        datatype: "json", //服务器返回json格式数据
        type: "post", //HTTP请求类型
        success: function (data) {
            plus.nativeUI.closeWaiting();
            console.log("----------" + JSON.stringify(data));
            if (data.code == 1) {
                if (data.data == "") {
                    plus.nativeUI.toast("暂无搜索结果");
                    return false;
                }
                // 总计
                $(".totals_box .totals").text(data.data.total);
                // 所属河流
                var search_ol2 = data.data.RiverArr;
                var search_ol2html = '<li data_type_id="">全部</li>';
                for (let i = 0; i < search_ol2.length; i++) {
                    search_ol2html += '<li data_type_id="' + search_ol2[i].value + '">' + search_ol2[i].name + "</li>";
                }
                if (pageStaus) {
                    $("#river").html(search_ol2html);
                }

                // 所属类型
                // console.log(JSON.stringify(data.data.typeArr));
                var search_ol3 = data.data.typeArr;
                var search_ol3html = '<li data_type_id="">全部</li>';
                for (let j = 0; j < search_ol3.length; j++) {
                    search_ol3html +=
                        '<li data_type_id="' +
                        search_ol3[j].type_id +
                        '"><div><img src="' +
                        search_ol3[j].icon +
                        '">' +
                        search_ol3[j].name +
                        "(" +
                        search_ol3[j].count +
                        ")</div></li>";
                }
                if (pageStaus) {
                    $("#sstype").html(search_ol3html);
                }
                // 所属流域
                var search_ol1 = data.data.bigBasinArr;
                var huanghe = data.data.bigBasinArr.huang_he;
                var haihe = data.data.bigBasinArr.hai_he;
                var search_ol1html =
                    '<li data_type_id="">全部</li><li data_type_id="' +
                    huanghe.value +
                    '">' +
                    huanghe.name +
                    '</li><li data_type_id="' +
                    haihe.value +
                    '">' +
                    haihe.name +
                    "</li>";
                if (pageStaus) {
                    $("#belongLiuyu").html(search_ol1html);
                }
                var search_ol4html;
                if (liuyuSon_val == "") {
                    if (liuyu_val == 1) {
                        // 黄河流域
                        var huangheSon = huanghe.son;
                        console.log(JSON.stringify(huangheSon));
                        search_ol4html = '<li data_type_id="">全部</li>';
                        for (let i = 0; i < huangheSon.length; i++) {
                            search_ol4html +=
                                '<li data_type_id="' + huangheSon[i].value + '">' + huangheSon[i].name + "</li>";
                        }
                    } else if (liuyu_val == 2) {
                        // 海河流域
                        var haiheSon = haihe.son;
                        console.log(JSON.stringify(haiheSon));
                        search_ol4html = '<li data_type_id="">全部</li>';
                        for (let i = 0; i < haiheSon.length; i++) {
                            search_ol4html +=
                                '<li data_type_id="' + haiheSon[i].value + '">' + haiheSon[i].name + "</li>";
                        }
                    }
                    $("#belongLiuyuSon").html(search_ol4html);
                }
                console.log(data.data.info.length);

                var search_list = data.data.info;
                if (search_list.length > 0) {
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
                    // 	if(scrollHeight <= totalHeight){
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
                    var search_html = "";
                    items = [];
                    for (let i = 0; i < search_list.length; i++) {
                        var data_tips = {
                            id: search_list[i].id,
                            type_id: search_list[i].type_id,
                            name: search_list[i].name,
                            icon: search_list[i].icon,
                            lng: search_list[i].lng,
                            lat: search_list[i].lat,
                            tips: search_list[i].tips,
                        };

                        if (search_list[i].highlight != "") {
                            var search_list_data = search_list[i].describe_label;
                            var search_list_data_html = "";
                            for (let j = 0; j < search_list_data.length; j++) {
                                search_list_data_html +=
                                    "<span>" + search_list_data[j].name + "：" + search_list_data[j].value + "</span>";
                            }

                            search_html +=
                                "<li data-tips=" +
                                "'" +
                                JSON.stringify(data_tips) +
                                "'" +
                                "><span>" +
                                '<img src="' +
                                search_list[i].icon +
                                '">' +
                                search_list[i].highlight +
                                "(" +
                                search_list[i].type_name +
                                ")</span>" +
                                search_list_data_html +
                                "</li>";
                        }
                        items.push(data_tips);
                    }
                    // console.log(JSON.stringify(data_tips))
                    $(".search_frame_list").append(search_html);
                    console.log(JSON.stringify(items));
                    city_dian_fun(items, layersName);
                } else {
                    // 阻止上拉刷新
                    // $('.search_frame_inner').on('scroll',function(){
                    // 	event.preventDefault()
                    // 	mui(".search_frame_inner").pullRefresh().disablePullupToRefresh();
                    // })
                    if (showdata.page > 1) {
                        // list_this.endPullupToRefresh(true);
                        plus.nativeUI.toast("没有更多数据了");
                        // $(".search_frame_list").append(
                        // 	'<div style="font-size:0.35rpx;text-align:center;color:#777777;font-weight:bold;margin:0.2rem 0 0.4rem;">没有更多数据了</div>'
                        // )
                    } else {
                        $(".search_frame_list").html("");
                        $(".search_frame_list").append(
                            '<div style="font-size:0.35rpx;text-align:center;color:#333333;margin-top:1rem;">暂无数据</div>'
                        );
                    }
                }
            } else {
                plus.nativeUI.toast(data.msg);
            }

            pageStaus = false;
        },
        error: function (xhr, type, errorThrown) {
            console.log("error");
        },
    });
}

// 点击列表渲染地图
var item_info = {};
$(".search_frame_list").on(clickStr, "li", function () {
    var item = [];
    console.log($(this).attr("data-tips"));
    item_info = JSON.parse($(this).attr("data-tips"));
    //列表点击选中设置中心点
    var zoomCenter = map.getView().getCenter(); //地图中心点
    console.log(zoomCenter);
    console.log(item_info.lng, item_info.lat);
    if (Math.abs(zoomCenter[0] - item_info.lng) > 2 || Math.abs(zoomCenter[1] - item_info.lat) > 2) {
        map.getView().animate(
            { center: map_info_obj.center, zoom: map_info_obj.zoom, duration: 800 },
            { center: [item_info.lng, item_info.lat], zoom: 8.5, duration: 800 }
        );
    } else {
        map.getView().animate({ center: [item_info.lng, item_info.lat], duration: 800 }, { zoom: 8.5, duration: 800 });
    }
    // 选中收缩搜索框
    $(".search_frame").css({ height: "1.2rem" });
    $(".search_frame .icon_arrow").css("transform", "rotateZ(360deg)");
    $(".icon_arrow").addClass("activei");
    //地图渲染参数
    item.push(item_info);
    console.log(JSON.stringify(item));
    $(this).find("span").css("color", "#F35117").attr("class", "activet");
    $(this).siblings().find("span").css("color", "#999999").attr("class", "");
    city_dian_fun(item, "searchLayer");
});

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
function scrollRefresh(item, BottomDistance) {
    $(item).on("scroll", function () {
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
        if (status) {
            up_fun();
        }
    });
}
scrollRefresh(".search_frame_inner");
// 上拉刷新的方法
var list_this = null;
function up_fun() {
    page++;
    // pageStaus = true;
    console.log("上拉加载成功");
    var self = plus.webview.currentWebview();
    console.log(page);
    console.log(JSON.stringify(items));
    list_this = this;
    var val = $(".li_input").val();
    search_tipshighlight(dataUrls, page, "searchLayers", val);
}

// 点击类型判断
$(".map_type_box").on(clickStr, ".item_type", function () {
    var index = $(this).index();
    console.log(index);
    $(".position").scrollTop(0);
    if ($(this).hasClass("activeBox")) {
        $(this).removeClass("activeBox");
        $(this).css("border", "none");
        $(this).siblings(".position").css("display", "none");
    } else {
        $(".map_type_box .item_type").removeClass("activeBox");
        $(this).addClass("activeBox");
        $(this).css("border-bottom", "2px solid #F8E601").siblings().css("border", "none");
        $(this).siblings(".position").css("display", "block");
        $(".position")
            .find(".position_item")
            .eq(index)
            .css("display", "block")
            .siblings(".position_item")
            .css("display", "none");
    }
    if ($(".map_type_box .item_type.activeBox").length > 0) {
        $(".search_frame_inner_zwf").addClass("active");
    } else {
        $(".search_frame_inner_zwf").removeClass("active");
    }
});
// 搜索框遮罩层的点击事件
$(".search_frame_inner_zwf").on(clickStr, function () {
    $(".item_type").removeClass("activeBox");
    $(".item_type").css("border", "none");
    $(".position").css("display", "none");
    $(".search_frame_inner_zwf").removeClass("active");
});
// 选择具体类型
$(".position_ul").on(clickStr, "li", function () {
    // 清除图层方法调用
    removeSearchLayer();
    if ($(this).index() > 0) {
        // 切换选项
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
        } else {
            $(this).addClass("active");
        }
        // 判断是否全部选中
        var parentUl = $(this).parent().prop("id");
        allSelectFun(parentUl);

        if ($(this).parent().attr("id") == "belongLiuyu") {
            $("#belongLiuyuSon").html("");
        }
    } else {
        if ($(this).hasClass("actives")) {
            $(this).removeClass("actives").siblings().removeClass("active");
        } else {
            $(this).addClass("actives").siblings().addClass("active");
        }
    }
    // 重置page 列表滚动条，重置上拉加载
    page = 1;
    $(".search_frame_inner").scrollTop(0);
    // mui('.search_frame_inner').pullRefresh().refresh(true);
    search_tipshighlight(dataUrls, page, "searchLayers");
});

// 判断是否全部选中的方法
function allSelectFun(idName) {
    console.log($("#" + idName));
    var liDom = $("#" + idName).children().length - 1;
    var liActive = $("#" + idName).find("li.active").length;
    if (liActive == liDom) {
        $("#" + idName)
            .find("li")
            .eq(0)
            .addClass("actives");
    } else {
        $("#" + idName)
            .find("li")
            .eq(0)
            .removeClass("actives");
    }
}
