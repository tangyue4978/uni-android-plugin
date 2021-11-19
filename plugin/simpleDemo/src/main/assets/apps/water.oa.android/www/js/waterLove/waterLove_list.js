// 获取基础信息
var token = localStorage.getItem("token");
var page = 1;
var list_this = "";
var data_info = {};
var shaixuanindex = 0; //筛选蓝快index
// 列表渲染
var page_status = true;
var root = localStorage.getItem("str_url");

if (root == "" || root == undefined || root == null) {
    mui.openWindow({
        url: "login.html?cid=1", //通过URL传参
        id: "login.html?cid=1", //通过URL传参
    });
}

mui.plusReady(function () {
    var self = plus.webview.currentWebview();
    plus.nativeUI.showWaiting("加载中...");
    data_info.token = token;
    data_info.page = page;
    data_info.type = self.type;
    data_info.status = self.status;
    data_info.level_value = self.level_value;
    switch (self.type) {
        case "2":
            $("#type_select option").eq(0).attr("selected", "selected");
            break;
        case "3":
            $("#type_select option").eq(1).attr("selected", "selected");
            break;
        case "4":
            $("#type_select option").eq(2).attr("selected", "selected");
            break;
        default:
            $("#type_select option").eq(0).attr("selected", "selected");
            break;
    }

    switch (self.status) {
        case "1":
            $("#status_select option").eq(0).attr("selected", "selected");
            break;
        case "3":
            $("#status_select option").eq(1).attr("selected", "selected");
            break;
        case "12":
            $("#status_select option").eq(2).attr("selected", "selected");
            break;
        case "24":
            $("#status_select option").eq(3).attr("selected", "selected");
            break;
        case "72":
            $("#status_select option").eq(4).attr("selected", "selected");
            break;
        default:
            $("#status_select option").eq(0).attr("selected", "selected");
            break;
    }
    data_info.areaCode = self.areaCode;
    setTimeout(function () {
        // $("#city_select").val(self.areaCode);
        $("#city_select").val(self.area_name);
        $("#city_select").attr("data-code",self.areaCode);
    }, 1000);
    // $("#city_select option").eq(0).text(self.areaname)
    data_info.pageSize = 15;
	data_info.station_name = $("#username").val();
    list(data_info);
	
	var area_info = {"token": token}
	var itemObj = {
		"itemid" : "#city_select"
	}
	getArea(data_info, itemObj)
});

function list(data_info) {
    //console.log(JSON.stringify(data_info));
    let _url = root + "api/v4/weather/list_v2";
    // var _url = root + 'api/v3/weatherdata/weather/list';
    mui.ajax(_url, {
        data: data_info,
        datatype: "json", //服务器返回json格式数据
        type: "post", //HTTP请求类型
        success: function (data) {
            plus.nativeUI.closeWaiting();
            if (data.code == 1) {
                // 处理数量
                $(".total_span").text(data.data.count);
                // 处理数据列表
                let info_arr = data.data.data;
                let data_title = data.data.tableTitle;
                if (info_arr.length > 0) {
                    $(".list_wrap .tips").hide();
                    if (page > 1) {
                        list_this.endPullupToRefresh(false);
                    }
                    if (page == 1) {
                        $(".list_wrap .list_l").empty(); //清空列表注意检查类名是否正确
                        $(".list_wrap .list_r").empty(); //清空列表注意检查类名是否正确
                        data_title.map((item, index) => {
                            if (index === 0) {
                                $(".list_title .list_l").append(`
                                    <div class="row_item">${item}</div>
                                `);
                            } else {
                                $(".list_title .list_r").append(`
                                    <div class="row_item">${item}</div>
                                `);
                            }
                        });
                    }
                    let status = $("#status_select").val();
                    let selectval = $("#type_select").attr("data-id");
                    info_arr.map((item) => {
                        $(".list_content .list_l").append(`
                            <div class="row row${
                                item[0].value.match(/\d+/g)[0]
                            }" onclick="xiangqing('${selectval}','${status}','${
                            item[0].value.match(/\(([^)]*)\)/)[1]
                        }')"></div>
                        `);
                        $(".list_content .list_r").append(`
                            <div class="row row${
                                item[0].value.match(/\d+/g)[0]
                            }" onclick="xiangqing('${selectval}','${status}','${
                            item[0].value.match(/\(([^)]*)\)/)[1]
                        }')"></div>
                        `);

                        item.map((item1, index1) => {
                            /* if (index1 === 0) {
                                $(`.list_content .list_l .row${item[0].value.match(/\d+/g)[0]}`).append(`
                                    <div class="row_item">${item1.value.split("(")[0]}</div>
                                `);
                            } else { */
                                $(`.list_content .list_r .row${item[0].value.match(/\d+/g)[0]}`).append(`
                                    <div class="row_item">${item1.value.split("(")[0]}</div>
                                `);
                            // }
                        });
                    });
                } else {
                    if (page > 1) {
                        list_this.endPullupToRefresh(true);
                    } else {
                        $(".list_wrap .list_l").empty(); //清空列表注意检查类名是否正确
                        $(".list_wrap .list_r").empty(); //清空列表注意检查类名是否正确
                        $(".list_wrap .tips").show();
                    }
                }

                // 处理select
                var select_option = data.data.select;
                // 处理降雨等级
                var level_value_option = select_option.level_value;
                if (level_value_option.length > 0) {
                    $("#level_value").html("");
                    for (var i = 0; i < level_value_option.length; i++) {
                        $("#level_value").append(
                            `<option value="${level_value_option[i].value}">${level_value_option[i].name}</option>`
                        );
                    }
                    $("#level_value").val(select_option.current_level_value_);
                }
            } else {
                if (page > 1) {
                    list_this.endPullupToRefresh(true);
                }
                plus.nativeUI.toast(data.msg);
            }
        },
        error: function (xhr, type, errorThrown) {
            console.log();
            plus.nativeUI.closeWaiting();
        },
    });
}

function xiangqing(selectval, status, stationCode) {
    console.log(selectval, status, stationCode);
    var self = plus.webview.currentWebview();
    mui.openWindow({
        url: "./waterLove_detail.html", //通过URL传参
        id: "./waterLove_detail.html", //通过URL传参
        extras: {
            selectval: selectval,
            status: status,
            station_code: stationCode,
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
    list_this = this;
    page++;
    console.log("上拉加载成功");
    var self = plus.webview.currentWebview();
    data_info.page = page;
    list(data_info);
}

// 上拉加载 end

// 筛选信息
function shaixuanFun() {
    // 重置上拉加载
    mui(".mui-content").pullRefresh().refresh(true);
    plus.nativeUI.showWaiting("加载中...");
    $(document).scrollTop(0); //重置滚动条的top值为0
    page = 1;
    data_info.page = page;
    data_info.type = $("#type_select").attr("data-id");
    data_info.status = $("#status_select").val();
    // data_info.areaCode = $("#city_select").val();
    data_info.areaCode = $("#city_select").attr("data-code");
    data_info.level_value = $("#level_value").val();
    data_info.pageSize = 15;
	data_info.station_name = $("#username").val();
    list(data_info);
}
$("#type_select").on("change", shaixuanFun);
$("#status_select").on("change", shaixuanFun);
$("#city_select").on("change", shaixuanFun);
$("#level_value").on("change", shaixuanFun);

// 放大镜按钮点击事件与键盘事件
$("#search").on("click", function () {
    var search_value = $(this).prev().val();
    // if (search_value == "") {
    //     $(this).prev().focus();
    // } else {
        shaixuanFun();
    // }
});
$("#search").prev().keypress(function (event) {
	var e = event || window.event || arguments.callee.caller.arguments[0];
	console.log(e.keyCode);
	if (e && e.keyCode == 13) {
		// 按 Enter
		//要做的事情
		console.log(11);
		$("#search").prev().blur();
		// var val_info = $("#search").prev().val();
		// if (val_info != "" && val_info != undefined) {
			shaixuanFun();
		// }
	}
});
// 放大镜按钮点击事件与键盘事件
