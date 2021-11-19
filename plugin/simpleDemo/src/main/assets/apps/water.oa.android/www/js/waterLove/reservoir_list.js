var page_status = true;
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
var shaixuanindex = 0; //筛选蓝快index
var page_status = true;
mui.plusReady(function () {
    var self = plus.webview.currentWebview();
    plus.nativeUI.showWaiting("加载中...");
    data_info.token = token;
    data_info.page = page;
    data_info.cityCode = "";
    data_info.scaleType = "";
    data_info.onlineType = "";
    data_info.name = "";
    data_info.searchDate = "";
    data_info.exceedType = 0;
    // data_info.search_status = 0; //控制条件查询 0插入条件，否则不插入;

    list(data_info);
	
	var area_info = {"token": token}
	getArea(data_info)
});

function list(data_info) {
    console.log(JSON.stringify(data_info));
    var _url = root + "api/v4/reservoirregimen/index";
    console.log(_url);
    mui.ajax(_url, {
        data: data_info,
        datatype: "json", //服务器返回json格式数据
        type: "post", //HTTP请求类型
        success: function (data) {
            console.log(JSON.stringify(data));

            //处理概要统计
            var arr = data.data.statics;
            $("#header_lists").html("");
            $("#header_list").html("");
            for (var i = 0; i < arr.length; i++) {
                var active = shaixuanindex == i ? " active " : "333";
                var sname = arr[i].name;
                var sType = arr[i].scaleType;
                console.log(data.data.scaleType[i].scaleType);
                $("#header_lists").append(
                    '<li class="' +
                        active +
                        '" data-name="' +
                        data.data.scaleType[i].scaleType +
                        '"><span>' +
                        sname +
                        "水库</span></li>"
                );
                $("#header_list").append(
                    '<li class="' + active + '" data-name="' + data.data.scaleType[i].scaleType + '">' + sType + "</li>"
                );
            }

            var arr1 = "";
            console.log(data.data.listSummaryVal);
            for (i = 0; i < data.data.listSummaryVal.length; i++) {
                arr1 +=
                    '<tr id="biao_tableth"><th class="texr">' +
                    data.data.listSummaryKey[i] +
                    '</th><td class="texl">' +
                    data.data.listSummaryVal[i] +
                    "</td></tr>";
            }
            $(".biao_table").html(arr1);
            plus.nativeUI.closeWaiting();
            if (data.code == 1) {
                $(".all_num").html(data.data.count);
                data_list = data.data.data;
                // console.log(data_list);
                if (data_list.length > 0) {
                    if (page > 1) {
                        list_this.endPullupToRefresh(false);
                    }
                    // if (page == 1) {
                    // 	// $(".info_list").html("");
                    // 	// var infolists = '';
                    // 	console.log(page);
                    // }
                    if (page_status) {
                        data.data.city.forEach(function (item, index) {
                            $("#city_sort").append('<option value="' + item.cityCode + '">' + item.city + "</option>");
                        });
                        data.data.scaleType.forEach(function (item, index) {
                            var selected = item.scaleType == data_info.type ? " selected" : " ";
                            $("#type_sort").append(
                                '<option value="' +
                                    item.scaleType +
                                    '" ' +
                                    selected +
                                    '  data_index="' +
                                    index +
                                    '">' +
                                    item.name +
                                    "</option>"
                            );
                        });

                        // 日期start
                        var startDate = data.data.date;
                        var dateObj;
                        var dateArr = [];
                        for (let i = 0; i < startDate.length; i++) {
                            dateObj = {
                                value: startDate[i],
                                text: startDate[i],
                            };
                            dateArr.push(dateObj);
                        }
                        console.log(JSON.stringify(dateArr[dateArr.length - 1].value));
                        document.querySelector("#statics_input1").addEventListener("tap", function () {
                            var picker1 = new mui.PopPicker();
                            picker1.setData(dateArr);
                            picker1.pickers[0].setSelectedValue($("#statics_input1").val(), 2000);
                            picker1.show(function (e) {
                                var data_input_time1 = e[0].value;
                                console.log(e[0].value);
                                $("#statics_input1").html(
                                    "<option value=" + data_input_time1 + ">" + data_input_time1 + "</option>"
                                );
                                shaixuanFun();
                            });
                        });
                        // 日期end
                    }
                    let newData = [];
                    let infolists = "";
                    let htmlLeft = "";
                    let htmlRight = "";
                    // shaixuanFun()
                    // console.log("111");
                    // console.log(data_list);
                    // console.log(page);
                    if (data_list.length > 0) {
                        data_list.forEach(function (current, index) {
                            // console.log(current)
                            htmlLeft += '<tr onclick="xiangqing(' + current[0].value + ')">';
                            htmlLeft += "<td>" + current[1].value + "</td>";
                            htmlLeft += "</tr>";
                        });
                        data_list.map((item) => {
                            // number 代表编号 stationName 代表站名 updateTime 代表时间 waterLevel 代表水位 superBit 代表超汛限 waterStorage 代表蓄水量 basin 代表流域 address 代表地址
                            newData.push({
                                number: item[0].value,
                                stationName: item[1].value,
                                updateTime: item[2].value,
                                waterLevel: item[3].value,
                                superBit: item[4].value,
                                waterStorage: item[5].value,
                                basin: item[6].value,
                                address: item[7].value,
                            });
                        });
                        // console.log(newData);
                        for (let i = 0; i < newData.length; i++) {
                            htmlRight += '<tr onclick="xiangqing(' + newData[i].number + ')">';
                            htmlRight += "<td>" + newData[i].updateTime + "</td>";
                            htmlRight += "<td>" + newData[i].waterLevel + "</td>";
                            htmlRight += "<td>" + newData[i].superBit + "</td>";
                            htmlRight += "<td>" + newData[i].waterStorage + "</td>";
                            htmlRight += "<td>" + newData[i].basin + "</td>";
                            htmlRight += "<td>" + newData[i].address + "</td>";
                            htmlRight += "</tr>";
                        }
                        if (page == 1) {
                            $("#bottom-div img").remove();
                            $("#left-table2").html("");
                            $("#right-table2").html("");
                            $("#left-table2").append(htmlLeft);
                            $("#right-table2").append(htmlRight);
                        } else {
                            $("#left-table2").append(htmlLeft);
                            $("#right-table2").append(htmlRight);
                        }
                        $(document).on("scroll", function () {
                            let top0 = $(this).scrollTop();
                            // let offsettop = $('.all').offsetTop()
                            // let diftop = $('.all')[0].offsetTop() - 232
                            // console.log(diftop)
                            var margin_ = parseInt($(".biao").css("marginTop").split("px")[0]);
                            // console.log(margin_);
                            mintop = parseInt(margin_ + 56);
                            // console.log(mintop)
                            alltop = margin_ + "px";
                            topdiv = margin_ + 12 + "px";
                            masktop = margin_ - 20 + "px";
                            // console.log(top0)
                            if (top0 >= mintop) {
                                $(".all").css({
                                    position: "fixed",
                                    top: alltop,
                                });
                                $("#top-div").css({
                                    position: "fixed",
                                    top: topdiv,
                                });
                                $("#mask").css({
                                    position: "fixed",
                                    display: "block",
                                    top: masktop,
                                });
                            } else {
                                $("#top-div").css({
                                    position: "static",
                                });
                                $(".all").css({
                                    position: "static",
                                });
                                $("#bottom-div").css({
                                    position: "static",
                                });
                                $("#mask").css({
                                    display: "none",
                                });
                            }
                        });
                        // 滚动
                        $("#right-div2").on("scroll", function () {
                            // console.log('333')
                            // plus.nativeUI.closeWaiting();
                            let top1 = $(this).scrollTop();
                            let left1 = $(this).scrollLeft();
                            // console.log(top1)
                            $("#left-div2").scrollTop(top1);
                            $("#right-div1").scrollLeft(left1);
                        });
                        $("#left-div2").on("scroll", function () {
                            // console.log('555')
                            let top2 = $(this).scrollTop();
                            $("#right-div2").scrollTop(top2);
                        });
                        $("#right-div1").on("scroll", function () {
                            let left2 = $(this).scrollLeft();
                            $("#right-div2").scrollLeft(left2);
                        });
                    }
                } else {
                    if (page > 1) {
                        list_this.endPullupToRefresh(true);
                    } else {
                        $("#left-table2").html("");
                        $("#right-table2").html("");
						if($("#bottom-div .unmoment").length >0){
							
						}else{
							$("#bottom-div").append(
							    '<img class="unmoment" src="../../images/unmoment.png" style="width:30%;margin:0.1rem auto;"/>'
							);
						}
                       
                    }
                }
            } else {
                if (page > 1) {
                    list_this.endPullupToRefresh(true);
                }
                plus.nativeUI.toast(data.msg);
            }
            page_status = false;

            if (!plus.device.imei) {
                $("#top-div #right-div1 #right-table1").css("width", "220%");
                $("#bottom-div #right-div2 #right-table2").css({ width: "220%", "line-height": "0.4rem" });
                $("#bottom-div #left-div2 #left-table2 tr td").css("height", "0.8027rem");
            }
        },
        error: function (xhr, type, errorThrown) {
            plus.nativeUI.closeWaiting();
            console.log(type);
        },
    });
}
function xiangqing(item_id) {
    var self = plus.webview.currentWebview();
    mui.openWindow({
        url: "/pages/reservoirLevel/details_syt.html", //通过URL传参
        id: "/pages/reservoirLevel/details_syt.html", //通过URL传参
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
            height: "0", //可选.默认50.触发上拉加载拖动距离
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
    data_info.scaleType = $("#type_sort").val(); //水库规模类型 1:大2:中3:小(小总数) 4:小1 5:小2 6:大2 可添加多个参数用' _ '连接,如需要筛选大和中等水库 1_2
    // data_info.cityCode = $("#city_sort").val();
    data_info.cityCode = $("#city_sort").attr("data-code");
    data_info.onlineType = $("#online_sort").val();
    data_info.name = $("#riverName").val();
    data_info.searchDate = $("#statics_input1").val();
    data_info.exceedType = $("#exceedType").val();
    list(data_info);
}

$("#city_sort").on("change", shaixuanFun);
$("#type_sort").on("change", function () {
    var indexs = $(this).find("option:selected").attr("data_index");
    $("#header_list li").removeClass("active");
    $("#header_lists li").removeClass("active");
    shaixuanindex = indexs;
    $("#header_list li").eq(indexs).addClass("active");
    $("#header_lists li").eq(indexs).addClass("active");
    shaixuanFun();
});
$("#online_sort").on("change", shaixuanFun);
$("#exceedType").on("change", shaixuanFun);
// $("#searchRiver").on("click", shaixuanFun)
// 放大镜按钮点击事件与键盘事件
$("#searchRiver").on("click", function () {
    var search_value = $(this).prev().val();
    if (search_value == "") {
        $(this).prev().focus();
    } else {
        shaixuanFun();
    }
});
$("#searchRiver")
    .prev()
    .keypress(function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        console.log(e.keyCode);
        if (e && e.keyCode == 13) {
            // 按 Enter
            //要做的事情
            console.log(11);
            $("#searchRiver").prev().blur();
            var val_info = $("#searchRiver").prev().val();
            if (val_info != "" && val_info != undefined) {
                shaixuanFun();
            }
        }
    });
// 放大镜按钮点击事件与键盘事件

// 数据列表蓝快点击事件
$("body").on("click", "#header_list li", function () {
    $("#header_list li").removeClass("active");
    $("#header_lists li").removeClass("active");
    $(this).addClass("active");
    shaixuanindex = $(this).index();
    var index = $(this).index();
    $("#header_lists li").eq(index).addClass("active");
    var ss = $("#header_lists li").eq(index).attr("data-name");
    console.log(ss);
    $("#type_sort").val(ss);
    shaixuanFun();
});
