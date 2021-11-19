var root = localStorage.getItem("str_url");
console.log(root);
if (root == "" || root == undefined || root == null) {
    mui.openWindow({
        url: "login.html?cid=1", //通过URL传参
        id: "login.html?cid=1", //通过URL传参
    });
}
var token = localStorage.getItem("token");
console.log(token);
var page = 1;
var list_this = "";
var pageStatus = true;
var page_status = true;
var data_info = {};
var countyObj = {};
mui.plusReady(function () {
    var self = plus.webview.currentWebview();
    if (self.type_id == undefined) {
        self.type_id = 0;
    }
    plus.nativeUI.showWaiting("加载中...");
    data_info.token = token;
    data_info.page = page;
    data_info.pageSize = 15;
    data_info.cityCode = $("#citys").val();
    data_info.county = $("#count").val();
    data_info.backboneType = $("#types").val();
    countyObj.token = token;
    countyObj.county = $("#citys").val();
    list(data_info);
});
$("#citys").on("change", function () {
    // 请求前清空请求参数
    data_info.county = $("#count").val("");
    data_info.backboneType = $("#types").val("");
    // 发送请求
    submit_fun(data_info);
    countyObj.county = $("#citys").val();
    counts(countyObj);
});
$("#count").on("change", submit_fun);
$("#types").on("change", submit_fun);

function list(data_info) {
    var _url = root + "api/v3/fetchwaters/backbone/index";
    console.log(JSON.stringify(data_info));
    mui.ajax(_url, {
        data: data_info,
        datatype: "json", //服务器返回json格式数据
        type: "post", //HTTP请求类型
        success: function (data) {
            console.log(JSON.stringify(data));
            plus.nativeUI.closeWaiting();
            if (data.code == 1) {
                if (data.data.result.length > 0) {
                    if (page > 1) {
                        list_this.endPullupToRefresh(false);
                    }
                    if (page == 1) {
                        $(".lists").html("");
                    }
                    // 数据总计
                    $(".all_num").text(data.data.count);

                    if (pageStatus) {
                        //地市编码
                        var cityCode = data.data.city;
                        for (let i = 0; i < cityCode.length; i++) {
                            $("#citys").append(
                                '<option value="' +
                                    cityCode[i].value +
                                    '">' +
                                    cityCode[i].name +
                                    "</option>"
                            );
                        }
                        // 类型
                        var typeCode = data.data.backboneType;
                        for (key in typeCode) {
                            $("#types").append(
                                '<option value="' + key + '">' + typeCode[key] + "</option>"
                            );
                        }
                    }
                    // 列表
                    var listCode = data.data.result;
                    var list_html = "";
                    for (let j = 0; j < listCode.length; j++) {
                        switch (listCode[j].backboneType) {
                            case "骨干坝":
                                list_html +=
                                    '<li class="lists_li" onclick="xiangqing(' +
                                    listCode[j].id +
                                    ')">' +
                                    '<div class="lists_data">' +
                                    listCode[j].name +
                                    '<span class="lists_data_city">' +
                                    listCode[j].city +
                                    "</span></div>" +
                                    '<div class="lists_data lists_data1">' +
                                    listCode[j].backboneType +
                                    "</div>" +
                                    '<div class="lists_data"><span>' +
                                    listCode[j].bigBasinName +
                                    "</span><span>" +
                                    listCode[j].controlAcreage +
                                    "</span></div>" +
                                    '<div class="lists_data"><span>' +
                                    listCode[j].sumCapacity +
                                    "</span><span>" +
                                    listCode[j].capacitySediment +
                                    "</span></div></li>";
                                break;
                            case "中型坝":
                                list_html +=
                                    '<li class="lists_li" onclick="xiangqing(' +
                                    listCode[j].id +
                                    ')">' +
                                    '<div class="lists_data">' +
                                    listCode[j].name +
                                    '<span class="lists_data_city">' +
                                    listCode[j].city +
                                    "</span></div>" +
                                    '<div class="lists_data lists_data2">' +
                                    listCode[j].backboneType +
                                    "</div>" +
                                    '<div class="lists_data"><span>' +
                                    listCode[j].bigBasinName +
                                    "</span><span>" +
                                    listCode[j].controlAcreage +
                                    "</span></div>" +
                                    '<div class="lists_data"><span>' +
                                    listCode[j].sumCapacity +
                                    "</span><span>" +
                                    listCode[j].capacitySediment +
                                    "</span></div></li>";
                                break;
                            case "拦沙坝":
                                list_html +=
                                    '<li class="lists_li" onclick="xiangqing(' +
                                    listCode[j].id +
                                    ')">' +
                                    '<div class="lists_data">' +
                                    listCode[j].name +
                                    '<span class="lists_data_city">' +
                                    listCode[j].city +
                                    "</span></div>" +
                                    '<div class="lists_data lists_data3">' +
                                    listCode[j].backboneType +
                                    "</div>" +
                                    '<div class="lists_data"><span>' +
                                    listCode[j].bigBasinName +
                                    "</span><span>" +
                                    listCode[j].controlAcreage +
                                    "</span></div>" +
                                    '<div class="lists_data"><span>' +
                                    listCode[j].sumCapacity +
                                    "</span><span>" +
                                    listCode[j].capacitySediment +
                                    "</span></div></li>";
                                break;
                            case "其他":
                                list_html +=
                                    '<li class="lists_li" onclick="xiangqing(' +
                                    listCode[j].id +
                                    ')">' +
                                    '<div class="lists_data">' +
                                    listCode[j].name +
                                    '<span class="lists_data_city">' +
                                    listCode[j].city +
                                    "</span></div>" +
                                    '<div class="lists_data lists_data3">' +
                                    listCode[j].backboneType +
                                    "</div>" +
                                    '<div class="lists_data"><span>' +
                                    listCode[j].bigBasinName +
                                    "</span><span>" +
                                    listCode[j].controlAcreage +
                                    "</span></div>" +
                                    '<div class="lists_data"><span>' +
                                    listCode[j].sumCapacity +
                                    "</span><span>" +
                                    listCode[j].capacitySediment +
                                    "</span></div></li>";
                                break;
                            default:
                                break;
                        }
                    }
                    $(".lists").append(list_html);
                } else {
                    if (page > 1) {
                        list_this.endPullupToRefresh(true);
                    } else {
                        $(".all_num").text("0");
                        $(".lists").html(
                            '<div style="width: 96%;height: 2.4rem;margin:0 auto;background-color: #ffffff;box-shadow: 2px 2px 6px 0px rgba(0, 0, 0, 0.06);border-radius: 0.2rem;font-size:0.3rem;text-align:center;line-height: 2.4rem;">暂无数据</div>'
                        );
                    }
                }
            }
            pageStatus = false;
        },
        error: function (xhr, type, errorThrown) {
            plus.nativeUI.closeWaiting();
            console.log(errorThrown);
        },
    });
}

function counts(countyObj) {
    var _url = root + "api/v3/fetchwaters/backbone/area";
    console.log(JSON.stringify(countyObj));
    mui.ajax(_url, {
        data: countyObj,
        datatype: "json", //服务器返回json格式数据
        type: "post", //HTTP请求类型
        success: function (data) {
            console.log(JSON.stringify(data));
            plus.nativeUI.closeWaiting();
            if (data.code == 1) {
                $("#count").html('<option value="">区县 </option>');

                var area = data.area;
                for (key in area) {
                    $("#count").append('<option value="' + key + '">' + area[key] + "</option>");
                }
            }
        },
        error: function (xhr, type, errorThrown) {
            plus.nativeUI.closeWaiting();
            console.log(errorThrown);
        },
    });
}

function xiangqing(item_id, item_num) {
    console.log("详情=" + item_id);
    mui.openWindow({
        url: "detail.html", //通过URL传参
        id: "detail.html", //通过URL传参
        extras: {
            item_id: item_id,
        },
    });
}

// 上拉加载
mui.init({
    pullRefresh: {
        container: ".mui-content", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
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
    console.log("上拉加载成功");
    var self = plus.webview.currentWebview();
    data_info.page = page;
    list(data_info);
    list_this = this;
}

// 上拉加载 end

function submit_fun() {
    // 重置上拉加载
    mui(".mui-content").pullRefresh().refresh(true);
    plus.nativeUI.showWaiting("加载中...");
    page = 1;
    data_info.token = token;
    data_info.page = page;
    data_info.pageSize = 15;
    data_info.cityCode = $("#citys").val();
    data_info.county = $("#count").val();
    data_info.backboneType = $("#types").val();
    console.log("--------------------", $("#types").val());
    list(data_info);
}
