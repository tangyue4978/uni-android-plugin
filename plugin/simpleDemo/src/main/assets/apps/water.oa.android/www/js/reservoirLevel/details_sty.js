// 初始化图表方法
let lineData;
let barData;
function initChart(obj_data) {
    mui.ajax(root + "api/v3/reservoir/waterFlow", {
        data: obj_data,
        datatype: "json", //服务器返回json格式数据
        type: "post", //HTTP请求类型
        success: function (data) {
            console.log(JSON.stringify(data.data));
            lineData = data.data.lineData;
            barData = data.data.barData;
        },
    });
}
// 统计图表点击事件
$(".infos_top .chart_enter").on("click", function () {
    if (lineData === undefined) {
        return;
    } else {
        $(".chart_popup_wrap").css({ display: "flex" });
        line(lineData);
    }
});
// 统计图表弹窗关闭事件
$(".chart_popup_wrap .close").on("click", function () {
    $(".chart_popup_wrap").hide();
});

// 统计图表选择框点击事件
$(".chart_popup_wrap .chart_select .select_item").on("click", function () {
    $(this).addClass("active").siblings().removeClass("active");
    let name = $(this).attr("data-name");
    if (name === "water_line") {
        $(".chart_popup_wrap .chart_wrap .bar").hide();
        $(".chart_popup_wrap .chart_wrap .line").show();
    } else {
        $(".chart_popup_wrap .chart_wrap .line").hide();
        $(".chart_popup_wrap .chart_wrap .bar").show();
        bar(barData);
    }
});
// 折线图
function line(lineData) {
    let { categories, serie1, serie2, serie3, serie4, serie5 } = lineData;
    var chart = Highcharts.chart("line", {
        chart: {
            height: "100%",
            margin: [30, 40, 130, 40],
            spacing: [30, 0, 46, 0],
            plotBackgroundColor: {
                linearGradient: { x1: 0.5, x2: 0.5, y1: 0, y2: 1 },
                stops: [
                    [0, "rgb(255, 255, 255)"],
                    [1, "rgb(117, 185, 255)"],
                ],
            },
        },
        title: {
            text: "",
        },
        credits: {
            enabled: false,
        },
        xAxis: [
            {
                categories: categories,
                lineWidth: 1,
                lineColor: "#000",
            },
        ],
        yAxis: [
            {
                title: {
                    text: "水位(m)",
                    floating: true,
                    rotation: 0,
                    x: 30,
                    y: -82,
                },
                lineWidth: 1,
                lineColor: "#000",
                gridLineDashStyle: "ShortDash",
                gridLineColor: "#6ba5e3",
                min: serie1.scale.min,
                max: serie1.scale.max,
            },
            {
                title: {
                    text: "流量(m³)",
                    floating: true,
                    rotation: 0,
                    x: -24,
                    y: -82,
                },
                opposite: true,
                lineWidth: 1,
                lineColor: "#000",
                gridLineDashStyle: "ShortDash",
                gridLineColor: "#6ba5e3",
                min: serie4.scale.min,
                max: serie4.scale.max,
            },
        ],
        legend: {
            itemDistance: 0,
        },
        labelOptions: {
            backgroundColor: "rgba(255,255,255,0.5)",
            verticalAlign: "top",
            y: 15,
        },
        series: [
            {
                name: serie1.name,
                type: "line",
                yAxis: serie1.type,
                data: serie1.data,
                tooltip: {
                    valueSuffix: "m",
                },
            },
            {
                name: serie2.name,
                type: "line",
                yAxis: serie2.type,
                data: serie2.data,
                tooltip: {
                    valueSuffix: "m",
                },
            },
            {
                name: serie3.name,
                type: "line",
                yAxis: serie3.type,
                data: serie3.data,
                tooltip: {
                    valueSuffix: "m",
                },
            },
            {
                name: serie4.name,
                type: "line",
                yAxis: serie4.type,
                data: serie4.data,
                tooltip: {
                    valueSuffix: "m³",
                },
            },
            {
                name: serie5.name,
                type: "line",
                yAxis: serie5.type,
                data: serie5.data,
                tooltip: {
                    valueSuffix: "m³",
                },
            },
        ],
    });
}

// 柱状图
function bar(barData) {
    let { categories, serie } = barData;
    let chart = Highcharts.chart("bar", {
        chart: {
            type: "column",
            height: "100%",
            margin: [40, 20, 120, 40],
            spacing: [0, 0, 50, 0],
        },
        title: {
            text: "",
        },
        credits: {
            enabled: false,
        },
        legend: {
            symbolRadius: 0,
        },
        xAxis: {
            categories: categories,
            crosshair: true,
            lineWidth: 1,
            lineColor: "#000",
        },
        yAxis: {
            min: 0,
            title: {
                text: "蓄水量(百万m³)",
                floating: true,
                rotation: 0,
                x: 52,
                y: -90,
            },
            lineWidth: 1,
            lineColor: "#000",
            gridLineDashStyle: "ShortDash",
            gridLineColor: "#abbbdb",
            min: serie.scale.min,
            max: serie.scale.max,
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat:
                '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f}(百万m³)</b></td></tr>',
            footerFormat: "</table>",
            shared: true,
            useHTML: true,
        },
        plotOptions: {
            column: {
                borderWidth: 0,
                color: {
                    linearGradient: { x1: 0, x2: 1, y1: 0.5, y2: 0.5 },
                    stops: [
                        [0, "#41c4e5"],
                        [0.5, "#fff"],
                        [1, "#41c4e5"],
                    ],
                },
            },
        },
        series: [serie],
    });
}
