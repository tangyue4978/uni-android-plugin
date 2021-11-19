// 获取基础信息
var root = localStorage.getItem("str_url");
if (root == "" || root == undefined || root == null) {
    mui.openWindow({
        url: "login.html?cid=1", //通过URL传参
        id: "login.html?cid=1", //通过URL传参
    });
}

let data_info = {};
let page = 1;
let page_status = true; //判断是否是第一次加载页面，第一次加载需要插入筛选条件，否则不插入
mui.plusReady(function () {
    var self = plus.webview.currentWebview();
    console.log("type=" + self.type_id);
    if (self.type_id == undefined) {
        self.type_id = 0;
    }
    plus.nativeUI.showWaiting("加载中...");
    data_info.token = localStorage.getItem("token");
    data_info.page = page;
    data_info.scaleType = 0; //水库规模类型 1:大2:中3:小(小总数) 4:小1 5:小2 6:大2 可添加多个参数用' _ '连接,如需要筛选大和中等水库 1_2
    data_info.cityCode = ""; //地市code
    data_info.name = ""; //水库名称
    data_info.onlineType = 0; //监察状态 1：今日已上报 2：今日未上报 3：未监测 0全部
    data_info.searchDate = ""; //筛选的日期
    data_info.exceedType = 0; //0:全部,1:正常水位,2:超汛限水位
    list(data_info);
});

function list(data_info) {
    let _url = root + "api/v3/reservoirregimen/index";
    mui.ajax(_url, {
        data: data_info,
        datatype: "json", //服务器返回json格式数据
        type: "post", //HTTP请求类型
        success: function (data) {
            // console.log(JSON.stringify(data));
            plus.nativeUI.closeWaiting();
            if (data.code == 1) {
                data_list = data.data.data;
                //处理搜索项
                if (page_status) {
                    data.data.city.forEach((item, index) => {
                        $("#city_sort").append(`<option value=${item.cityCode}> ${item.city}</option>`);
                    });
                    data.data.scaleType.forEach(function (item, index) {
                        $("#reservoir_sort").append(`<option value=${item.scaleType}>${item.name}</option>`);
                    });
                    // 日期
                    let startDate = data.data.date;
                    let dateObj;
                    let dateArr = [];
                    for (let i = 0; i < startDate.length; i++) {
                        dateObj = {
                            value: startDate[i],
                            text: startDate[i],
                        };
                        dateArr.push(dateObj);
                    }
                    document.querySelector("#statics_input1").addEventListener("tap", function () {
                        let picker1 = new mui.PopPicker();
                        picker1.setData(dateArr);
                        picker1.pickers[0].setSelectedValue($("#statics_input1").val(), 2000);
                        picker1.show(function (e) {
                            let data_input_time1 = e[0].value;
                            console.log(e[0].value);
                            $("#statics_input1").html(
                                "<option value=" + data_input_time1 + ">" + data_input_time1 + "</option>"
                            );
                            shaixuanFun();
                        });
                    });
                }

                console.log(data_list);
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
        url: "details3.html", //通过URL传参
        id: "details3.html", //通过URL传参
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
