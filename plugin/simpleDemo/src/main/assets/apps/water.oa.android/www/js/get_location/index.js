// 定位相关   开始
var address_obj = "";
document.addEventListener(
    "plusready",
    function () {
        plus.geolocation.getCurrentPosition(
            function (p) {
                console.log("位置信息：" + JSON.stringify(p));
                console.log("精确度：" + p.coords.accuracy);
                address_obj = p;
            },
            function (e) {
                console.log("获取位置信息异常：" + e.message);
                plus.nativeUI.toast("获取位置信息异常：" + e.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 30000,
                provider: "system",
                coordsType: "wgs84",
                // provider:'baidu',
                // coordsType:'gcj02',
                geocode: true,
            }
        );
    },
    false
);
//初始化覆盖层标注
function label_fun(lng, lat) {
    //console.log(lng, lat);
    var Gps_position = GPS.gcj_encrypt(lat, lng);
    //console.log(Gps_position.lon, Gps_position.lat);
    var address = [Gps_position.lon, Gps_position.lat];
    // var address = ol.proj.fromLonLat([112.58151542648,37.807917449949]);
    if ($("#location").length <= 0) {
        $("body").append(`<div id="location" class="location"></div>`);
    }
    var location = new ol.Overlay({
        //位置坐标
        position: address,
        //覆盖层如何与位置坐标匹配
        positioning: "center-center",
        //覆盖层的元素
        element: document.getElementById("location"), //ToDo
        //事件传播到地图视点的时候是否应该停止
        stopEvent: false,
    });
    //将覆盖层添加到map中
    map.addOverlay(location);
    $("#location").show();
    // map.getView().setCenter(address);
    // map.getView().setZoom(14);
    map.getView().animate(
        {
            center: address,
        },
        {
            zoom: 13,
        }
    );
}

// 定位相关   结束
