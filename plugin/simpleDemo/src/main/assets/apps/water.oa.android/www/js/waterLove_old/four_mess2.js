// 获取基础信息
var root = localStorage.getItem("str_url");
if (root == "" || root == undefined || root == null) {
    mui.openWindow({
        url: "login.html?cid=1", //通过URL传参
        id: "login.html?cid=1", //通过URL传参
    });
}

var token = localStorage.getItem("token");
var page = 1;
var list_this = "";
var data_info = {};
var page_status = true; //判断是否是第一次加载页面，第一次加载需要插入筛选条件，否则不插入
mui.plusReady(function () {
    var self = plus.webview.currentWebview();
    console.log("type=" + self.type_id);
    if (self.type_id == undefined) {
        self.type_id = 0;
    }
    plus.nativeUI.showWaiting("加载中...");
    data_info.token = token;
    data_info.page = page;
    data_info.city_code = "";
    data_info.date = "";
    data_info.keywords = "";
    data_info.basin_code = "";
    data_info.report_status = "";
    data_info.search_status = 0; //控制条件查询 0插入条件，否则不插入;
    list(data_info);
});

function list(data_info) {
    console.log(JSON.stringify(data_info));
    var _url = root + "api/v3/water_rain_condition/rivercourselist";
    mui.ajax(_url, {
        data: data_info,
        datatype: "json", //服务器返回json格式数据
        type: "post", //HTTP请求类型
        success: function (data) {
            console.log(JSON.stringify(data));
            plus.nativeUI.closeWaiting();
            if (data.code == 1) {
                data_list = data.data.result;
                //处理搜索项
                if (page_status) {
                    data.data.city.forEach(function (item, index) {
                        $("#city_sort").append('<option value="' + item.value + '">' + item.name + "</option>");
                    });
                    data.data.basinArr.forEach(function (item, index) {
                        $("#liuyu_sort").append('<option value="' + item.value + '">' + item.name + "</option>");
                    });
                    // 日期
                    var begin = data.data.dateRage.minDate.split("-");
                    var end = data.data.dateRage.maxDate.split("-");
                    document.querySelector("#statics_input1").addEventListener("tap", function () {
                        var dtpicker = new mui.DtPicker({
                            type: "date",
                            beginDate: new Date(begin), //设置开始日期
                            endDate: new Date(end), //设置结束日期
                        });
                        dtpicker.setSelectedValue($("#statics_input1").val());
                        dtpicker.show(function (e) {
                            console.log(e.text);
                            var data = e.text;
                            $("#statics_input1").html("<option value=" + data + ">" + data + "</option>");
                            shaixuanFun();
                        });
                    });

                    //上报状态
                    var onlineStatus = data.data.report_status;
                    var report_html = "";
                    for (let i = 0; i < onlineStatus.length; i++) {
                        console.log(JSON.stringify(onlineStatus[i].value));
                        report_html +=
                            '<option value="' + onlineStatus[i].value + '">' + onlineStatus[i].name + "</option>";
                    }
                    $("#online_sort").html(report_html);
                }

                if (data_list.length > 0) {
                    if (page > 1) {
                        list_this.endPullupToRefresh(false);
                    }
                    if (page == 1) {
                        $(".lists").html(""); //清空列表注意检查类名是否正确
                    }

                    $(".list_number span").text(data.data.count);
                    data_list.forEach(function (item, index) {
                        if (item.report_text != "") {
                            var li_html =
                                '<li class="lists_li" onclick="xiangqing(' +
                                item.id +
                                ')">' +
                                '<ul class="lists_data">' +
                                '<li class="lists_data_head">' +
                                '<span class="lists_data_head_l">' +
                                item.name +
                                "</span>" +
                                '<span class="lists_data_head_r">' +
                                item.city +
                                " " +
                                item.county +
                                '<span class="lists_data_head_status" style="background-color: #3A76F1;">' +
                                item.report_text +
                                "</span>" +
                                "</span>" +
                                "</li>" +
                                "<li>" +
                                "<span>" +
                                item.address +
                                "</span>" +
                                "</li>" +
                                "<li>" +
                                "<span>水位(m):" +
                                item.stage +
                                "</span>&nbsp;&nbsp;&nbsp;&nbsp;" +
                                "<span>流量(m³/s):" +
                                item.flow +
                                "</span>" +
                                "</li>" +
                                "<li>" +
                                "<span>更新时间:" +
                                item.updateAt +
                                "</span>" +
                                "</li>" +
                                "</ul>" +
                                "</li>";
                        } else {
                            var li_html =
                                '<li class="lists_li" onclick="xiangqing(' +
                                item.id +
                                ')">' +
                                '<ul class="lists_data">' +
                                '<li class="lists_data_head">' +
                                '<span class="lists_data_head_l">' +
                                item.name +
                                "</span>" +
                                '<span class="lists_data_head_r">' +
                                item.city +
                                " " +
                                item.county +
                                "</span>" +
                                "</li>" +
                                "<li>" +
                                "<span>" +
                                item.address +
                                "</span>" +
                                "</li>" +
                                "<li>" +
                                "<span>水位(m):" +
                                item.stage +
                                "</span>&nbsp;&nbsp;&nbsp;&nbsp;" +
                                "<span>流量(m³/s):" +
                                item.flow +
                                "</span>" +
                                "</li>" +
                                "<li>" +
                                "<span>更新时间:" +
                                item.updateAt +
                                "</span>" +
                                "</li>" +
                                "</ul>" +
                                "</li>";
                        }

                        $(".lists").append(li_html);
                    });
                } else {
                    if (page > 1) {
                        list_this.endPullupToRefresh(true);
                    } else {
                        $(".list_number span").text(data.data.count);
                        $(".lists").html(
                            '<a style="font-size:0.35rpx;text-align:center;padding:1rem 0rem;width:100%;display:block;background:#ffffff;">暂无数据</a>'
                        );
                    }
                }
            } else {
                if (page > 1) {
                    list_this.endPullupToRefresh(true);
                }
                plus.nativeUI.toast(data.msg);
            }
            page_status = false;
        },
        error: function (xhr, type, errorThrown) {
            console.log(errorThrown);
            plus.nativeUI.closeWaiting();
        },
    });
}

/**
 * @description 详情跳转
 * @param {Object} item_id
 */
function xiangqing(item_id) {
    var self = plus.webview.currentWebview();
    mui.openWindow({
        url: "river_detail.html", //通过URL传参
        id: "river_detail.html", //通过URL传参
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

// 筛选信息
function shaixuanFun() {
    // 重置上拉加载
    mui(".mui-content").pullRefresh().refresh(true);
    plus.nativeUI.showWaiting("加载中...");
    $(document).scrollTop(0); //重置滚动条的top值为0
    page = 1;
    data_info.token = token;
    data_info.page = page;
    data_info.city_code = $("#city_sort").val();
    data_info.date = $("#statics_input1").val();
    data_info.keywords = $("#username").val();
    data_info.basin_code = $("#liuyu_sort").val();
    data_info.report_status = $("#online_sort").val();
    list(data_info);
}
$("#city_sort").on("change", shaixuanFun);
$("#statics_input1").on("change", shaixuanFun);
// $("#search").on("click",shaixuanFun)
$("#liuyu_sort").on("change", shaixuanFun);
$("#online_sort").on("change", shaixuanFun);
// 筛选信息 end
// 放大镜按钮点击事件与键盘事件
$("#search").on("click", function () {
    var search_value = $(this).prev().val();
    if (search_value == "") {
        $(this).prev().focus();
    } else {
        shaixuanFun();
    }
});
$("#search")
    .prev()
    .keypress(function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        console.log(e.keyCode);
        if (e && e.keyCode == 13) {
            // 按 Enter
            //要做的事情
            console.log(11);
            $("#search").prev().blur();
            var val_info = $("#search").prev().val();
            if (val_info != "" && val_info != undefined) {
                shaixuanFun();
            }
        }
    });
// 放大镜按钮点击事件与键盘事件
