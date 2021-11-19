// 列表渲染
var page_status = true;
// 获取基础信息
var root = localStorage.getItem("str_url");
if (root == "" || root == undefined || root == null) {
    // mui.openWindow({
    // 	url: 'login.html?cid=1', //通过URL传参
    // 	id: 'login.html?cid=1', //通过URL传参
    // })
}
// $("#type_select:first").val()=self.type.text;
// $("#status_select:first").val()=self.status_text;
var token = localStorage.getItem("token");
var page = 1;
var list_this = "";
var data_info = {};
var shaixuanindex = 0; //筛选蓝快index
mui.plusReady(function () {
    var self = plus.webview.currentWebview();
    plus.nativeUI.showWaiting("加载中...");
    data_info.token = token;
    data_info.page = page;
    data_info.type = self.type;
    data_info.status = self.status;

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
    data_info.areaCode = $("#city_select").attr("data-code");
    // $("#type_select option").eq(0).html(self.type_text)
    // $("#status_select option").eq(0).html(self.status_text)
    data_info.pageSize = 15;

    list(data_info);
	
	var area_info = {"token": token}
	var itemObj = {
		"itemid" : "#city_select"
	}
	getArea(data_info, itemObj)
});

function list(data_info) {
    // var _url = root + 'api/v3/weatherdata/weather/list';
    var _url = root + "api/v4/weather/list_v2";
    console.log(_url);
    console.log(JSON.stringify(data_info));
    mui.ajax(_url, {
        data: data_info,
        datatype: "json", //服务器返回json格式数据
        type: "post", //HTTP请求类型
        success: function (data) {
			console.log(JSON.stringify(data));
            plus.nativeUI.closeWaiting();
            if (data.code == 1) {
				
                $(".total_span").text(data.data.count);
                let info_arr = data.data.data;
                if (info_arr.length > 0) {
					let data_title = data.data.data[0].map((item) => {
					    return item.text;
					});
                    let status = $("#status_select").val();
                    let selectval = $("#type_select").val();

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
                    info_arr.map((item) => {
                        $(".list_content .list_l").append(`
                            <div class="row row${item[0].value.match(/\d+/g)[0]}"
                            onclick="xiangqing('${selectval}','${status}','${item[2].value}')"></div>
                        `);
                        $(".list_content .list_r").append(`
                            <div class="row row${item[0].value.match(/\d+/g)[0]}" 
                            onclick="xiangqing('${selectval}','${status}','${item[2].value}')">
                            </div>
                        `);
                        item.map((item1, index1) => {
                            if (index1 === 0) {
                                $(`.list_content .list_l .row${item[0].value.match(/\d+/g)[0]}`).append(`
                                    <div class="row_item">${item1.value.split("(")[0]}</div>
                                `);
                            } else {
                                $(`.list_content .list_r .row${item[0].value.match(/\d+/g)[0]}`).append(`
                                    <div class="row_item">${item1.value}</div>
                                `);
                            }
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
    var self = plus.webview.currentWebview();
    mui.openWindow({
        url: "detail.html", //通过URL传参
        id: "detail.html", //通过URL传参
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
    data_info.type = $("#type_select").val();
    data_info.status = $("#status_select").val();
    // data_info.areaCode = $("#city_select").val();
    data_info.areaCode = $("#city_select").attr("data-code");
    data_info.pageSize = 15;
    list(data_info);
}
$("#type_select").on("change", shaixuanFun);
$("#status_select").on("change", shaixuanFun);
$("#city_select").on("change", shaixuanFun);
