function funColumnBz1(data) {
    var chart = Highcharts.chart(data.id, {
        chart: {
            backgroundColor: null,
            colors: "#3f60e4",
            type: "spline",
        },
        colors: data.colors,
        credits: {
            enabled: false, // 禁用版权信息
        },
        title: {
            text: data.text,
            align: "center",
            style: {
                color: "#333333",
                fontSize: 14,
            },
        },
        subtitle: {
            floating: true,
            verticalAlign: "bottom",
        },
        xAxis: {
            tickWidth: 0, //去掉刻度
            lineColor: "#8c8c8c",
            labels: {
                // enabled:false
            },
            categories: data.categories,
        },
        // tooltip: {
        //     enabled: true,
        // },
        yAxis: {
            lineColor: "#8c8c8c",
            lineWidth: 1,
            title: {
                text: null,
                style: {
                    color: "#8c8c8c",
                },
                x: 30,
                y: -55,
                rotation: 360,
            },
            gridLineWidth: 1,
            // plotLines: plotLines,
            labels: {
                style: {
                    color: "#8c8c8c",
                    fontSize: 10,
                },
                format: "{value}",
            },
        },
        legend: {
            enabled: false,
        },
        plotOptions: {
            // dataLabels: {
            //     enabled: false,
            // },
            // line: {
            //     marker: {
            //         enabled: false,
            //     },
            // },
            // ,
            // series:{
            // 	color:data.colors
            // }
        },
        series: data.series,
        // colors:['#0aceff']
    });
}
$("body").on("click", ".button_box1", function () {
    $(this).addClass("active");
    $(this).siblings().removeClass("active");
});

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
    list(self.item_id);
});
//头部
function list(id) {
    var _url = root + "api/v3/water_quality/detail";
    mui.ajax(_url, {
        type: "post", //HTTP请求类型
        dataType: "json", //服务器返回json格式数据
        data: {
            token: token,
            id: id,
        },
        success: function (data) {
            console.log(JSON.stringify(data));
            $("#title").text(data.data.station.name);
            $("#address").text(data.data.station.address);

            //水位监测数据
            var series = data.data.statistics.series;
            for (let i = 0; i < series.length; i++) {
                if (series[i].data == "") {
                    $(".button_box")
                        .css("position", "relative")
                        .append(
                            '<img src="../../images/unmoment.png" style="width:3.95rem;position:absolute;top:-3rem;">'
                        );
                } else {
                    // 按钮组
                    var buttons = data.data.graphical;
                    buttons.forEach(function (item, index) {
                        if (item.name == "COD") {
                            $(".button_box").append(
                                '<button type="button" class="button_box1 active" onclick="graph(' +
                                    id +
                                    ",'" +
                                    item.value +
                                    "')\">" +
                                    item.name +
                                    "</button>"
                            );
                        } else {
                            $(".button_box").append(
                                '<button type="button" class="button_box1" onclick="graph(' +
                                    id +
                                    ",'" +
                                    item.value +
                                    "')\">" +
                                    item.name +
                                    "</button>"
                            );
                        }
                    });
                    funColumnBz1(data.data.statistics);
                }
            }
            //监测信息
            if (data.data.detail == "") {
                $(".deal_with").css("display", "none");
            } else {
                data.data.data.forEach(function (item, index) {
                    $(".table_header").append("<th>" + item + "</th>");
                });
                data.data.detail.forEach(function (item, index) {
                    var tr_html = "<tr>";
                    for (key in item) {
                        tr_html += "<td>" + item[key] + "</td>";
                    }
                    tr_html += "</tr>";
                    $(".deal_table").append(tr_html);
                });
            }
        },
        error: function (error) {
            console.log(error);
        },
    });
}
//曲线图
function graph(id, field) {
    var _url = root + "api/v3/water_quality/field";
    mui.ajax(_url, {
        type: "post", //HTTP请求类型
        dataType: "json", //服务器返回json格式数据
        data: {
            token: token,
            id: id,
            field: field,
        },
        success: function (data) {
            //水位监测数据
            funColumnBz1(data.data);
        },
        error: function (error) {
            console.log(error);
        },
    });
}
//监测信息
