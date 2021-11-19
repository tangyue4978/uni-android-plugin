//导航信息
$(".icon_arrow").on("click", function () {
    var arrow = $(this).parent();
    if ($(this).parent().hasClass("open")) {
        $(this).parent().removeClass("open").css("height", "0.3rem");
        $(this).next().hide();
        $(".gpsInfo .icon_arrows").css("bottom", "0");
    } else {
        $(this).parent().addClass("open").css("height", "auto");
        $(this).next().show();
        $(".gpsInfo .icon_arrows").css("bottom", "-5rem");
    }
});
//
var root = localStorage.getItem("str_url");
if (root == "" || root == undefined || root == null) {
    mui.openWindow({
        url: "login.html?cid=1", //通过URL传参
        id: "login.html?cid=1", //通过URL传参
    });
}
var token = localStorage.getItem("token");
mui.plusReady(function () {
    var self = plus.webview.currentWebview();
    plus.nativeUI.showWaiting("加载中...");
    vailageDetail();
    vailageDetail2();
});

//七河五湖切换
function qihe() {
    $("#qihe").addClass("tab_active");
    $(".qiheStatistics").addClass("isShow");
    $(".qiheStatistics").removeClass("ishide");
    $(".wuhuStatistics").removeClass("isShow");
    $(".wuhuStatistics").addClass("ishide");
    $("#wuhu").removeClass("tab_active");
    $("#qihenumber").removeClass("ishide");
    $("#qihenumber").addClass("isShow");
    $("#wuhunumber").removeClass("isShow");
    $("#wuhunumber").addClass("ishide");
}
function wuhu() {
    $("#qihe").removeClass("tab_active");
    $(".qiheStatistics").removeClass("isShow");
    $(".qiheStatistics").addClass("ishide");
    $(".wuhuStatistics").removeClass("ishide");
    $(".wuhuStatistics").addClass("isShow");
    $("#wuhu").addClass("tab_active");
    $("#qihenumber").removeClass("isShow");
    $("#qihenumber").addClass("ishide");
    $("#wuhunumber").removeClass("ishide");
    $("#wuhunumber").addClass("isShow");
}

//七河的统计图表start
function vailageDetail(obj_data) {
    var _url = root + "api/v3/riverchief/sevenriverfivelake/statistics";
    console.log(_url);
    mui.ajax(_url, {
        data: {
            token: token,
        },
        datatype: "json", //服务器返回json格式数据
        type: "post", //HTTP请求类型
        success: function (data) {
            plus.nativeUI.closeWaiting();
            console.log("----------" + JSON.stringify(data));
            if (data.code == 1) {
                // 七河流经
                var flowThroughHead = data.data.flowThrough.head;
                $("#qihe_city").text(flowThroughHead.city);
                $("#qihe_country").text(flowThroughHead.country);
                var flowThroughContent = data.data.flowThrough.content;
                var flowThrough = "";
                var flowThroughinner = "";
                if (flowThroughContent.length <= 4) {
                    $("#qihe_arrow01").css("display", "none");
                    for (let i = 0; i < flowThroughContent.length; i++) {
                        flowThrough +=
                            '<li class="sevenRiver_li"><div class="sevenRiver_left"><span class="name">' +
                            flowThroughContent[i].key +
                            '</span><span class="number">' +
                            flowThroughContent[i].number +
                            '</span><span>：</span></div><div class="cityName">' +
                            flowThroughContent[i].value +
                            "</div></li>";
                    }
                } else {
                    $("#qihe_arrow01").css("display", "inline-block");
                    for (let i = 0; i < flowThroughContent.length; i++) {
                        if (i < 4) {
                            flowThrough +=
                                '<li class="sevenRiver_li"><div class="sevenRiver_left"><span class="name">' +
                                flowThroughContent[i].key +
                                '</span><span class="number">' +
                                flowThroughContent[i].number +
                                '</span><span>：</span></div><div class="cityName">' +
                                flowThroughContent[i].value +
                                "</div></li>";
                        } else {
                            flowThroughinner +=
                                '<li class="sevenRiver_li"><div class="sevenRiver_left"><span class="name">' +
                                flowThroughContent[i].key +
                                '</span><span class="number">' +
                                flowThroughContent[i].number +
                                '</span><span>：</span></div><div class="cityName">' +
                                flowThroughContent[i].value +
                                "</div></li>";
                        }
                    }
                }

                $("#qihe_flowThroughContent").prepend(flowThrough);
                $("#qihe_flowThroughContentinner").append(flowThroughinner);
                // 山西沿黄市县名单
                var nameListHead = data.data.nameList.head;
                $(".citys").text(nameListHead.city);
                $(".countrys").text(nameListHead.country);
                var nameListContent = data.data.nameList.content;
                var nameList = "";
                var nameListinner = "";
                if (nameListContent.length <= 4) {
                    $(".arrow02").css("display", "none");
                    for (let i = 0; i < nameListContent.length; i++) {
                        nameList +=
                            '<li class="sevenRiver_li"><div class="sevenRiver_left"><span class="name">' +
                            nameListContent[i].key +
                            '</span><span class="number">' +
                            nameListContent[i].number +
                            '</span><span>：</span></div><div class="cityName">' +
                            nameListContent[i].value +
                            "</div></li>";
                    }
                } else {
                    $(".arrow02").css("display", "inline-block");
                    for (let i = 0; i < nameListContent.length; i++) {
                        if (i < 4) {
                            nameList +=
                                '<li class="sevenRiver_li"><div class="sevenRiver_left"><span class="name">' +
                                nameListContent[i].key +
                                '</span><span class="number">' +
                                nameListContent[i].number +
                                '</span><span>：</span></div><div class="cityName">' +
                                nameListContent[i].value +
                                "</div></li>";
                        } else {
                            nameListinner +=
                                '<li class="sevenRiver_li"><div class="sevenRiver_left"><span class="name">' +
                                nameListContent[i].key +
                                '</span><span class="number">' +
                                nameListContent[i].number +
                                '</span><span>：</span></div><div class="cityName">' +
                                nameListContent[i].value +
                                "</div></li>";
                        }
                    }
                }
                $(".nameListContent").prepend(nameList);
                $(".nameListContentinner").prepend(nameListinner);
                //七河长度统计
                var totalLength = data.data.totalLength;
                $("#totalLength").text(totalLength);
                var statistics = data.data.statistics;
                column(statistics);
                // 流域面积统计
                var totalArea = data.data.totalArea;
                $("#totalArea").text(totalArea);
                var areaStatistics = data.data.areaStatistics;
                pie(areaStatistics);
                // 平均年径流量统计
                var annualRunoff = data.data.annualRunoff;
                $(".annualRunoff").append(annualRunoff);

                console.log(annualRunoff);
            } else {
                plus.nativeUI.toast(data.msg);
            }
        },
        error: function (xhr, type, errorThrown) {
            plus.nativeUI.closeWaiting();
        },
    });
}
// 柱状图
// var obj1 = {
// 	id: 'columnContainer',
// 	categories: ['汾河', '桑干河', '滹沱河', '桑干河<br/>（桑干河、桑干河）', '汾河', '桑干河', '桑干河<br/>（唐河、沙河）'],
// 	data: [716, 338, 319, 372, 370, 199, 158]
// }
// column(obj1)

function column(obj1) {
    var chart = Highcharts.chart(obj1.id, {
        chart: {
            type: "column",
        },
        title: {
            text: null,
        },
        xAxis: {
            categories: obj1.categories,
            labels: {
                style: {
                    color: "#7B7B7B",
                    fontSize: "0.2rem",
                },
            },
        },
        yAxis: {
            min: 0,
            title: {
                text: null,
            },
            labels: {
                enabled: false,
            },
        },
        legend: {
            enabled: false,
        },
        tooltip: {
            pointFormat: "{point.y} km",
        },
        credits: {
            enabled: false,
        },
        series: [
            {
                data: obj1.data,
                dataLabels: {
                    enabled: true,
                    format: "{point.y}km",
                    style: {
                        color: "#0099FF",
                        fontSize: "0.2rem",
                    },
                },
            },
        ],
    });
}
// 饼图
// var obj2 = {
// 	id: 'pieContainer',
// 	data: [{
// 		name: '汾河流域面积39271km²',
// 		y: 39271,
// 		color: '#40C87E'
// 	}, {
// 		name: '桑干河流域面积17520km²',
// 		y: 17520,
// 		color: '#78D9E9'
// 	}, {
// 		name: '滹沱河流域面积14038km²',
// 		y: 14038,
// 		color: '#FFD452'
// 	}, {
// 		name: '漳河流域面积14996km²<br/>（浊漳河，清漳河）',
// 		y: 14996,
// 		color: '#E5AE2D'
// 	}, {
// 		name: '沁河流域面积9093km²',
// 		y: 9093,
// 		color: '#DA86FF'
// 	}, {
// 		name: '涑水河流域面积5526km²',
// 		y: 5526,
// 		color: '#FF3366'
// 	}, {
// 		name: '大清河流域面积2671km²<br/>（唐河，沙河）',
// 		y: 2671,
// 		color: '#FFC0AE'
// 	}, ]
// }
// pie(obj2)

function pie(obj2) {
    Highcharts.chart(obj2.id, {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: "pie",
        },
        title: {
            text: null,
        },
        tooltip: {
            pointFormat: "",
            shared: true,
        },
        credits: {
            enabled: false,
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: "pointer",
                dataLabels: {
                    enabled: true,
                    style: {
                        fontSize: "0.18rem",
                    },
                    formatter: function () {
                        if (this.point.name == "汾河流域面积39271km²") {
                            return '<span style="color:#40C87E">' + (this.y / 1031.15).toFixed(2) + "%</span>";
                        } else if (this.point.name == "桑干河流域面积17520km²") {
                            return '<span style="color:#78D9E9">' + (this.y / 1031.15).toFixed(2) + "%</span>";
                        } else if (this.point.name == "滹沱河流域面积14038km²") {
                            return '<span style="color:#FFD452">' + (this.y / 1031.15).toFixed(2) + "%</span>";
                        } else if (this.point.name == "漳河流域面积14996km²<br/>（浊漳河，清漳河）") {
                            return '<span style="color:#E5AE2D">' + (this.y / 1031.15).toFixed(2) + "%</span>";
                        } else if (this.point.name == "沁河流域面积9093km²") {
                            return '<span style="color:#DA86FF">' + (this.y / 1031.15).toFixed(2) + "%</span>";
                        } else if (this.point.name == "涑水河流域面积5526km²") {
                            return '<span style="color:#FF3366">' + (this.y / 1031.15).toFixed(2) + "%</span>";
                        } else if (this.point.name == "大清河流域面积2671km²<br/>（唐河，沙河）") {
                            return '<span style="color:#FFC0AE">' + (this.y / 1031.15).toFixed(2) + "%</span>";
                        }
                    },
                },
                showInLegend: true,
            },
        },
        legend: {
            enabled: true,
            itemDistance: 10,
            symbolHeight: 13,
            symbolWidth: 13,
            symbolRadius: 1,
            itemMarginBottom: 10,
            itemStyle: {
                fontSize: "0.2rem",
                color: "#7b7b7b",
                letterSpacing: 0,
            },
            y: 10,
        },
        series: [
            {
                type: "pie",
                colorByPoint: true,
                data: obj2.data,
            },
        ],
    });
}
//七河的统计图表end

//五湖的统计图表start
function vailageDetail2(obj_data) {
    var _url = root + "api/v3/riverchief/fivelake/statistics";
    console.log(_url);
    mui.ajax(_url, {
        data: {
            token: token,
        },
        datatype: "json", //服务器返回json格式数据
        type: "post", //HTTP请求类型
        success: function (data) {
            plus.nativeUI.closeWaiting();
            console.log("----------" + JSON.stringify(data));
            if (data.code == 1) {
                // 五湖涉及市县(市、区)
                var flowThroughHead = data.data.involve.head;
                $("#wuhu_city").text(flowThroughHead.city);
                $("#wuhu_country").text(flowThroughHead.country);
                $(".area").text(flowThroughHead.waterArea);
                $(".population").text(flowThroughHead.population);
                var flowThroughContent = data.data.involve.content;
                var flowThrough = "";
                var flowThroughinner = "";
                if (flowThroughContent.length <= 4) {
                    $("#wuhu_arrow01").css("display", "none");
                    for (let i = 0; i < flowThroughContent.length; i++) {
                        flowThrough +=
                            '<li class="sevenRiver_li"><div class="sevenRiver_left"><span class="name">' +
                            flowThroughContent[i].key +
                            '</span><span class="number">' +
                            flowThroughContent[i].number +
                            '</span><span>：</span></div><div class="cityName">' +
                            flowThroughContent[i].value +
                            "</div></li>";
                    }
                } else {
                    $("#wuhu_arrow01").css("display", "inline-block");
                    for (let i = 0; i < flowThroughContent.length; i++) {
                        if (i < 4) {
                            flowThrough +=
                                '<li class="sevenRiver_li"><div class="sevenRiver_left"><span class="name">' +
                                flowThroughContent[i].key +
                                '</span><span class="number">' +
                                flowThroughContent[i].number +
                                '</span><span>：</span></div><div class="cityName">' +
                                flowThroughContent[i].value +
                                "</div></li>";
                        } else {
                            flowThroughinner +=
                                '<li class="sevenRiver_li"><div class="sevenRiver_left"><span class="name">' +
                                flowThroughContent[i].key +
                                '</span><span class="number">' +
                                flowThroughContent[i].number +
                                '</span><span>：</span></div><div class="cityName">' +
                                flowThroughContent[i].value +
                                "</div></li>";
                        }
                    }
                }

                $("#wuhu_flowThroughContent").prepend(flowThrough);
                $("#wuhu_flowThroughContentinner").append(flowThroughinner);
                // 湖泊类型
                var lakeType = data.data.lakeType;
                pie2(lakeType);
                //七河长度统计
                var statistics_num = data.data.statistics.num;
                $(".area1").text(statistics_num.plan);
                $(".area2").text(statistics_num.key);
                var statistics_column = data.data.statistics.column;
                column2(statistics_column);
            } else {
                plus.nativeUI.toast(data.msg);
            }
        },
        error: function (xhr, type, errorThrown) {
            plus.nativeUI.closeWaiting();
        },
    });
}
// 柱状图
// var obj1 = {
// 	id: 'columnContainer2',
// 	categories: ['晋阳湖', '漳泽湖', '云竹湖', '盐湖', '伍姓湖'],
// 	data:[{
// 			name: '规划范围',
// 			data: [157.6, 3233, 408.55, 1237, 5774],
// 			color: '#0099FF'
// 		}, {
// 			name: '重点规划范围',
// 			data: [19.3, 126.1, 158.47, 230, 45],
// 			color: '#FF9900'
// 		}]
// 	}
// column(obj1)

function column2(obj3) {
    var chart = Highcharts.chart(obj3.id, {
        chart: {
            type: "column",
        },
        title: {
            text: null,
        },
        xAxis: {
            categories: obj3.categories,
            labels: {
                style: {
                    color: "#7B7B7B",
                    fontSize: "0.2rem",
                },
            },
        },
        yAxis: {
            min: 0,
            title: {
                text: null,
            },
            labels: {
                enabled: false,
            },
        },
        legend: {
            enabled: true,
            itemDistance: 80,
            symbolHeight: 13,
            symbolWidth: 13,
            symbolRadius: 1,
            itemMarginBottom: 10,
            itemStyle: {
                fontSize: "0.2rem",
                color: "#7b7b7b",
                letterSpacing: 0,
            },
            y: 10,
        },
        plotOptions: {
            column: {
                dataLabels: {
                    enabled: true,
                    allowPointSelect: true,
                    style: {
                        fontSize: "0.18rem",
                        fontWeight: "normal",
                        textOutline: "none",
                    },
                    formatter: function () {
                        if (this.series.name == "规划范围") {
                            return '<span style="color:#0099FF">' + this.y + "km²</span>";
                        } else if (this.series.name == "重点规划范围") {
                            return '<span style="color:#FF9900">' + this.y + "km²</span>";
                        }
                    },
                },
            },
        },
        tooltip: {
            pointFormat: "{point.y} km²",
        },
        credits: {
            enabled: false,
        },
        series: obj3.data,
    });
}
// 饼图

function pie2(obj4) {
    Highcharts.chart(pieContainer2, {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: "pie",
            margin: [20, 20, 120, 20],
        },
        title: {
            text: null,
        },
        tooltip: {
            pointFormat: "",
            shared: true,
        },
        credits: {
            enabled: false,
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: "pointer",
                dataLabels: {
                    enabled: true,
                    style: {
                        fontSize: "0.18rem",
                    },
                    formatter: function () {
                        if (this.point.name == "人工湖泊 1个") {
                            return '<span style="color:#FFD452">' + this.y / 0.05 + "%</span>";
                        } else if (this.point.name == "水库型湖泊 2个") {
                            return '<span style="color:#78D9E9">' + this.y / 0.05 + "%</span>";
                        } else if (this.point.name == "天然湖泊 2个") {
                            return '<span style="color:#40C87E">' + this.y / 0.05 + "%</span>";
                        }
                    },
                },
                showInLegend: true,
            },
        },
        legend: {
            enabled: true,
            itemDistance: 60,
            symbolHeight: 13,
            symbolWidth: 13,
            symbolRadius: 1,
            itemMarginBottom: 10,
            itemStyle: {
                fontSize: "0.2rem",
                color: "#7b7b7b",
                letterSpacing: 0,
            },
            y: 10,
        },
        series: [
            {
                type: "pie",
                colorByPoint: true,
                data: obj4.data,
            },
        ],
    });
}

//五湖的统计图表end
