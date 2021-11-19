var page = 1;
mui.plusReady(function () {
    plus.nativeUI.showWaiting("加载中...");
    var val = $(".li_input").val();
    search_tipshighlight(page, "api/v3/es_search/tipshighlight", "searchLayers", val);
});

/**
 * @param {Object} code  上级编码，默认为空
 * @param {Object} level 1地市，2区县
 */
function getCityInfo(code, level) {
    var root = localStorage.getItem("str_url");
    var token = localStorage.getItem("token");
    var _url = root + "api/rural/citiestowns";
    var resData = {
        token: token,
        code: code,
        level: level,
    };
    console.log("请求路径=" + _url);
    console.log("请求数据=" + JSON.stringify(resData));
    if (level == 2 && code == "") {
        $("#xzqh_xian").html("");
        return false;
    }
    mui.ajax(_url, {
        data: resData,
        datatype: "json", //服务器返回json格式数据
        type: "post", //HTTP请求类型
        success: function (res) {
            console.log("接收到的数据：" + JSON.stringify(res));
            if (res.code == 1) {
                //成功获取地市或区县信息
                var search_info = res.data;
                var search_html = '<li data_type_id="" data-level="' + level + '">全部</li>';
                for (let i = 0; i < search_info.length; i++) {
                    search_html +=
                        '<li data_type_id="' +
                        search_info[i].code +
                        '" data-level="' +
                        level +
                        '">' +
                        search_info[i].name +
                        "</li>";
                }
                if (level == 1) {
                    $("#xzqh_shi").html(search_html);
                } else if (level == 2) {
                    if (code != "") {
                        $("#xzqh_xian").html(search_html);
                    } else {
                        $("#xzqh_xian").html("");
                    }
                } else {
                }
                //成功获取地市或区县信息
            } else {
                mui.toast(res.msg);
            }
        },
        error: function (e) {
            console.log(e);
        },
    });
}

/**
 * 列表渲染
 */
var pageStaus = true;
function search_tipshighlight() {
    var root = localStorage.getItem("str_url");
    var token = localStorage.getItem("token");
    var apiUrl = "api/v3/es_search/tipshighlight";
    var _url = root + apiUrl;
    // var zoomLevel = map.getView().getZoom();//地图等级
    // var zoomCenter = map.getView().getCenter();//地图中心点
    // console.log(zoomCenter);
    // 查询类型
    var sstype_val = $("#sstype li.active").attr("data_type_id") || "";
    // 地市code
    var xzqh_shi_val = $("#xzqh_shi li.active").attr("data_type_id") || "";
    // 县区code
    var xzqh_xian_val = $("#xzqh_xian li.active").attr("data_type_id") || "";
    // 流域 liuyu
    var liuyu_val = $("#liuyu li.active").attr("data_type_id") || "";

    var showdata = {
        token: token,
        page: page,
        name: $(".li_input").val(),
        type_id: sstype_val, //所属类型
        big_basin: liuyu_val, //所属流域
        city: xzqh_shi_val, //地市code
        county: xzqh_xian_val, //区县code
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

                //渲染总数
                $(".totals").text(data.data.total);

                // 渲染类型1
                console.log(JSON.stringify(data.data.bigBasinArr));
                var search_ol1 = data.data.bigBasinArr;
                var search_ol1html = '<li data_type_id="">全部</li>';
                for (let i = 0; i < search_ol1.length; i++) {
                    search_ol1html +=
                        '<li data_type_id="' +
                        search_ol1[i].value +
                        '">' +
                        search_ol1[i].name +
                        "(" +
                        search_ol1[i].count +
                        ")" +
                        "</li>";
                }
                if (pageStaus) {
                    console.log("======================");
                    $("#liuyu").html(search_ol1html);
                }

                // 渲染类型2
                // 行政区划-地市渲染
                if (pageStaus) {
                    getCityInfo("", 1);
                }

                // 渲染类型3
                console.log(JSON.stringify(data.data.typeArr));
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

                if (data.data.info.length > 0) {
                    if (showdata.page > 1) {
                        list_this.endPullupToRefresh(false);
                    }
                    if (showdata.page == 1) {
                        $(".search_frame_list").html("");
                    }

                    //渲染列表
                    var search_list = data.data.info;
                    var search_html = "";
                    for (let i = 0; i < search_list.length; i++) {
                        if (search_list[i].highlight != "") {
                            var address_str = "地址：";
                            if (search_list[i].type_id == 26) {
                                address_str = "河源地址：";
                            }

                            if (search_list[i].location != "") {
                                search_html +=
                                    '<li data_type_id="' +
                                    search_list[i].type_id +
                                    '" data_id="' +
                                    search_list[i].id +
                                    '"><span>' +
                                    '<img src="' +
                                    search_list[i].icon +
                                    '">' +
                                    search_list[i].highlight +
                                    "(" +
                                    search_list[i].type_name +
                                    ")</span><span>描述：" +
                                    search_list[i].outline +
                                    "</span><span>" +
                                    address_str +
                                    search_list[i].location +
                                    "</span></li>";
                            } else {
                                search_html +=
                                    '<li data_type_id="' +
                                    search_list[i].type_id +
                                    '" data_id="' +
                                    search_list[i].id +
                                    '"><span>' +
                                    '<img src="' +
                                    search_list[i].icon +
                                    '">' +
                                    search_list[i].highlight +
                                    "(" +
                                    search_list[i].type_name +
                                    ")</span><span>描述：" +
                                    search_list[i].outline +
                                    "</span><span>" +
                                    address_str +
                                    "-</span></li>";
                            }
                        }
                    }
                    $(".search_frame_list").append(search_html);
                    // console.log(search_html)
                } else {
                    if (showdata.page > 1) {
                        list_this.endPullupToRefresh(true);
                    } else {
                        $(".search_frame_list").html("");
                        $(".search_frame_list").append(
                            '<div style="font-size:0.35rpx;text-align:center;color:#333333;margin-top:1rem;padding-right: 20px;">暂无数据</div>'
                        );
                    }
                }
            }

            pageStaus = false;
        },
        error: function (xhr, type, errorThrown) {
            console.log("error");
        },
    });
}

mui.init({
    pullRefresh: {
        container: ".search_frame_inner", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
        up: {
            height: "50px", //可选.默认50.触发上拉加载拖动距离
            auto: false, //可选,默认false.自动上拉加载一次
            contentdown: "上拉显示更多",
            contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
            contentnomore: "没有更多数据了", //可选，请求完毕若没有更多数据时显示的提醒内容；
            callback: up_fun, //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
        },
    },
});

function up_fun() {
    page++;
    // pageStaus = true;
    console.log("上拉加载成功");
    var self = plus.webview.currentWebview();
    console.log(page);
    search_tipshighlight();
    list_this = this;
}

// 点击类型判断
$(".map_type_box").on("click", ".item_type", function () {
    var index = $(this).index();
    console.log(index);
    $(".position").scrollTop(0);
    if ($(this).hasClass("activeBox")) {
        // 清除当前类名activeBox
        $(this).removeClass("activeBox");
        // 清除当前选中样式
        $(this).css("border", "none");
        // 隐藏当前所选分类盒子
        $(this).siblings(".position").css("display", "none");
    } else {
        // 默认全部清除类名activeBox
        $(".map_type_box .item_type").removeClass("activeBox");
        // 当前添加类名activeBox
        $(this).addClass("activeBox");
        // 当前分类的选中样式
        $(this).css("border-bottom", "2px solid #F8E601").siblings().css("border", "none");
        // 显示所选子分类的盒子
        $(this).siblings(".position").css("display", "block");
        // 显示当前所选子分类
        $(".position")
            .find(".position_item")
            .eq(index)
            .css("display", "block")
            .siblings(".position_item")
            .css("display", "none");
    }
    if ($(".map_type_box .item_type.activeBox").length > 0) {
        // 显示遮罩层
        $(".search_frame_inner_zwf").addClass("active");
    } else {
        // 隐藏遮罩层
        $(".search_frame_inner_zwf").removeClass("active");
    }
});
// 列表遮罩层
$(".search_frame_inner_zwf").on("click", function () {
    console.log(3434);
    // 清除分类选中类名activeBox
    $(".item_type").removeClass("activeBox");
    // 清除分类选中样式
    $(".item_type").css("border", "none");
    // 隐藏子分类盒子
    $(".position").css("display", "none");
    // 取消遮罩层
    $(".search_frame_inner_zwf").removeClass("active");
});
// 选择具体类型
$(".position_ul").on("click", "li", function () {
    // 获取地市的等级【市1，区县2】
    var level = $(this).attr("data-level");
    // 切换选项，子选项选中效果
    $(this).attr("class", "active").siblings().attr("class", "");
    // 重置page 列表滚动条，重置上拉加载
    page = 1;
    $(".search_frame_inner").scrollTop(0);
    mui(".search_frame_inner").pullRefresh().refresh(true);
    console.log(level);
    if (level == 1) {
        // 行政区划-地市渲染
        var shi_code = $("#xzqh_shi li.active").attr("data_type_id");
        console.log(shi_code);
        getCityInfo(shi_code, 2);
        setTimeout(function () {
            search_tipshighlight();
        }, 800);
    } else {
        search_tipshighlight();
    }
});

// 聚焦隐藏类型列表
$(".li_div .li_input").focus(function () {
    $(".position").css("display", "none");
    $(".map_type_box .item_type").css("border", "none");
});

function myFunction() {
    $(".search_frame_list span").css("color", "#999999").attr("class", "");
    var val = $(".li_input").val();
    if (val != "") {
        $(".search_frame").css({
            display: "block",
            height: "76%",
        });
    } else {
        // $('.search_frame').css("display","none");
    }
    //pullup-container为在mui.init方法中配置的pullRefresh节点中的container参数；
    //注意：refresh()中需传入true
    mui(".search_frame_inner").pullRefresh().refresh(true);
    page = 1;
    pageStaus = true;
    search_tipshighlight();
}

// 关键词搜索
function searchFun() {
    var val = $(".li_input").val();
    if (val == "") {
        plus.nativeUI.toast("请输入关键字");
        return false;
    }
}

// 点击列表跳转详情
var typeId = "";
var itemId = "";
$(".search_frame_list").on("click", "li", function () {
    typeId = $(this).attr("data_type_id");
    itemId = $(this).attr("data_id");
    console.log(typeId);
    console.log(itemId);
    $(this).find("span").css("color", "#F35117").attr("class", "activet");
    $(this).siblings().find("span").css("color", "#999999").attr("class", "");
    jump_xiangqing(typeId, itemId);
});

function jump_xiangqing(typeId, itemId) {
    var self = plus.webview.currentWebview();
    var url = "";
    var params = {
        item_id: itemId,
    };
    switch (Number(typeId)) {
        case 7: //千人以上供水工程
        case 8: //千吨万人供水工程
            url = "/pages/ruralWater/searchDetails.html";
            params = {
                item_id: itemId,
                type: "query_supWater",
            };
            break;
        case 19: //河道测站水位站
        case 23: //河道测站水文站
            url = "/pages/waterLove/river_detail.html";
            break;
        case 9: //骨干淤地坝(搜索的类型)
            // url = '/pages/map/searchDetails-zhigou.html';
            url = "/pages/yuDiBa/detail.html";
            break;
        case 11: //泵站
            url = "/pages/map/pumplist.html";
            break;
        case 10: //水闸
            url = "/pages/map/gatelist.html";
            break;
        case 13: //河湖取水口
            url = "/pages/map/searchDetails-qushuikou.html";
            break;
        case 18: //地下水监测站
            url = "/pages/waterLove_old/details.html";
            break;
        case 22: //水库
            url = "/pages/reservoirLevel/details_syt.html";
            break;
        case 12: //入河排污口
            url = "/pages/map/searchDetails-paiwu.html";
            break;
        case 21: //水质站点
            url = "/pages/waterQuality/four_mess_detail.html";
            break;
        case 2: //中型灌区
            url = "/pages/irrigated/searchDetails.html";
            params = {
                item_id: itemId,
                type: "query_irrigatedArea",
            };
            break;
        case 17: //水电站
            url = "/pages/ruralWater/searchDetails.html";
            params = {
                item_id: itemId,
                type: "hydropower_station_list",
            };
            break;
        case 5: //国家级取水单位
        case 6: //省级取水单位
            url = "/pages/waterIntake/waterIntake_detail.html";
            params = {
                item_id: itemId,
            };
            break;
        case 20: //公示牌
            url = "/pages/riverChief/billboard_detail.html";
            break;
        case 26: //河流
            url = "/pages/rivers/rivers_details.html";
            break;
        default:
            console.log(typeId);
            break;
    }
    mui.openWindow({
        url: url, //通过URL传参
        id: url, //通过URL传参
        extras: params,
    });
}
