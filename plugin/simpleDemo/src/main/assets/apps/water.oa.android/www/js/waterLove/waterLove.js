// 顶部导航栏点击事件
$(".section .mapBox .top_nav .nav_ul_box").on("click", ".nav_li_item", function () {
    removeLayer(); // 清除图层方法
    removeTips(); //清除弹窗方法
    resetCZ(); //重置地图中心点和层级
    $("#change_base_map_box_id").removeClass("active"); //隐藏切换底图
    $(".right_posi").css({ bottom: "1.35rem" });
    let topNavName = $(this).attr("data-qname");
    $(this).addClass("active").siblings().removeClass("active");
    $(`.right_bar .right_bar_center .${topNavName}`).show().siblings().hide();
    // 切换地图
    topNavName === "jiangshui"
        ? TileWMSLayer_base.setSource(base_source["dzMap_source"])
        : TileWMSLayer_base.setSource(base_source["yxMap_source"]);
    $(".search_frame").css({ display: "none" }); //隐藏搜索框
    $(".search_frameJs").css({ display: "none" }); // 隐藏降水信息提示

    //发送网络请求
    // 降水
    if (topNavName === "jiangshui") {
        jsInit();
    }
    // 河道水情
    if (topNavName === "hdsq") {
        hdsqInit();
    }
    // 水库水情
    if (topNavName === "sksq") {
        sksqInit();
    }
});

// 右侧导航栏点击事件
$(".right_bar .right_bar_center ul").on("click", "li", function () {
    $(".search_table_box").removeClass("active");
    $(".search_arrows .icon_arrows").removeClass("active");

    let status = $(this).hasClass("active");
    let ulClass = $(this).parent().attr("class");
    let rightNavName = $(this).attr("data-qname");
    let type = $(this).attr("data-id");
    if (rightNavName === "list" || rightNavName === "warn") {
        return;
    }
    // 降水右侧点击事件
    if (ulClass === "jiangshui") {
        let rightNum = rightNavName.match(/\d+/g)[0];
        removeLayer(); //清除所有图层
        removeTips(); //清除所有提示框
        map.getOverlays().clear(); //清除地图弹框
        $(this).addClass("active").siblings().removeClass("active");
        let jsobj = {
            param: { type: 1, token, hour_type: rightNum, level_value: "" },
            layersname: rightNavName,
            param_str: `data-qname=${rightNavName}`,
            url: root + "api/v4/water_rain_condition/precipitation",
        };
        console.log(JSON.stringify(jsobj));
        jc_info_fun(jsobj);
        warningStatus ? $("#warning_status").addClass("active") : $("#warning_status").removeClass("active");
    }
    // 河道水情右侧点击事件
    if (ulClass === "hdsq") {
        let hdobj = {
            param: { type, token },
            layersname: rightNavName,
            param_str: `data-qname=${rightNavName}`,
            url: root + "api/v3/water_rain_condition/map",
        };
        if (status === false) {
            if (rightNavName === "fhqt") {
                removeLayer(); //清除所有图层
                removeTips(); //清除所有弹窗
                removeRightActive(); //清除右侧所有选中状态
                resetCZ(); //重置地图中心点和层级
                hdsqInit(); //初始化地图信息
            } else if (rightNavName === "qhdt") {
            } else if (rightNavName === "search") {
                $(this).addClass("active");
            } else {
                $(this).addClass("active");
                jc_info_fun(hdobj);
            }
        } else {
            if (rightNavName === "qhdt") {
                $(".change_base_map_list .imglist").removeClass("active");
            } else {
                $(this).removeClass("active");
                removeLayerName(rightNavName);
                removeRightName(rightNavName);
                map.getOverlays().clear(); //清除地图弹框
            }
        }
    }
    // 水库水情右侧点击事件
    if (ulClass === "sksq") {
        let scale_type; //水库类型
        rightNavName === "dxsk"
            ? (scale_type = 1)
            : rightNavName === "zxsk"
            ? (scale_type = 2)
            : rightNavName === "xyxsk"
            ? (scale_type = 4)
            : rightNavName === "xexsk"
            ? (scale_type = 5)
            : "";
        console.log(rightNavName);
        console.log(scale_type);
        scale_type = scale_type || 1;
        let skobj = {
            param: { type, token, scale_type },
            layersname: rightNavName,
            param_str: `data-qname=${rightNavName}`,
            url: root + "api/v4/water_rain_condition/map",
        };
        if (status === false) {
            if (rightNavName === "fhqt") {
                removeLayer(); //清除所有图层
                removeTips(); //清除所有弹窗
                removeRightActive(); //清除右侧所有选中状态
                let skobj = {
                    param: { type: 5, token, scale_type },
                    layersname: "skcz",
                    param_str: 'data-qname="skcz"',
                    url: root + "api/v3/water_rain_condition/map",
                };
                $(".search_frame").css({ display: "none" });
                jc_info_fun(skobj);
                $(`.right_bar .right_bar_center ul li[${skobj.param_str}]`)
                    .addClass("active")
                    .siblings()
                    .removeClass("active");
            } else if (rightNavName === "qhdt") {
            } else if (rightNavName === "search") {
                $(this).addClass("active");
            } else {
                $(this).addClass("active");
                jc_info_fun(skobj);
            }
        } else {
            if (rightNavName === "qhdt") {
                $(".change_base_map_list .imglist").removeClass("active");
            } else {
                $(this).removeClass("active");
                removeLayerName(rightNavName);
                removeRightName(rightNavName);
                map.getOverlays().clear(); //清除地图弹框
            }
        }
    }
});

// 点击降水级别切换事件
$(".lengend_screen").on("click", ".lengend_screen_box li", function () {
    removeLayer(); //清除所有图层
    let rightNavName = $(".right_bar_center .jiangshui .times.active").attr("data-qname");
    let rightNum = rightNavName.match(/\d+/g)[0];

    $(this).hasClass("lenActive") ? $(this).removeClass("lenActive") : $(this).addClass("lenActive");

    let levelValue = $(".lengend_screen .lengend_screen_box li.lenActive");
    let activeLength = levelValue.length;
    let level_value = "";
    for (let i = 0; i < activeLength; i++) {
        if (i === 0) {
            level_value = levelValue.eq(i).attr("data-level");
        } else {
            level_value += "," + levelValue.eq(i).attr("data-level");
        }
    }
    let jsobj = {
        param: { type: 1, token, hour_type: rightNum, level_value },
        layersname: rightNavName,
        param_str: `data-qname=${rightNavName}`,
        url: root + "api/v4/water_rain_condition/precipitation",
    };
    jc_info_fun(jsobj);
});

// 地图点击事件(清除地图弹框图层)
map.on("click", function (e) {
    map.getOverlays().clear();
    var pixel = map.getEventPixel(e.originalEvent);
    var coodinate = e.coordinate;
    // console.log(coodinate);
    map.forEachFeatureAtPixel(pixel, function (feature, layersname) {
        var item_info = feature.values_;
        //设置弹出框内容，可以HTML自定义
        console.log(layersname.className_);
        console.log(coodinate);
        console.log(map.getView().getCenter());
        console.log(map.getView().getZoom());
        // 七河点击高亮
        if (layersname.className_ == "七河") {
            var param = {
                layer: feature, //想要改变的对象
                max: 6, //高亮的次数需要为双数6/2 =3次
                time: 500, //高亮的频率800ms
                color1: "#f39b45", //高亮的颜色
                color2: "#00a1fe", //河流默认颜色(需要与河流的颜色相同);
            };
            mapHighlight(param);
            console.log(feature.values_.name);
            $(".right_bar .right_bar_center ul li").removeClass("active");
            map.getOverlays().clear();
            try {
                removeLayerName("hdcz");
            } catch (e) {
                console.log("暂无hdcz");
            }
            try {
                removeLayerName("hdcz_shuiweizhan");
            } catch (e) {
                console.log("暂无hdcz_shuiweizhan");
            }
            try {
                removeLayerName("hdsq_cbzsw");
            } catch (e) {
                console.log("暂无hdsq_cbzsw");
            }
            try {
                removeLayerName("hdsq_cjjsw");
            } catch (e) {
                console.log("暂无hdsq_cjjsw");
            }
            try {
                removeLayerName("hdsq_hl");
            } catch (e) {
                console.log("暂无hdsq_hl");
            }
            // 水文站
            var heliucezhan = {
                param: { type: "7_6", token, riverName: feature.values_.name },
                layersname: "hdsq_hl",
                param_str: 'data-qname="hdsq_hl"',
                url: root + "api/v3/water_rain_condition/map",
            };
            jc_info_fun(heliucezhan);
        }
    });
});

// 搜索框箭头点击事件
$(".icon_arrow").on(clickStr, function () {
    if ($(this).hasClass("activei")) {
        $(".search_frame").css({ height: "6rem" });
        $(".search_frame .icon_arrow").css("transform", "rotateZ(180deg)");
        $(this).removeClass("activei");
    } else {
        $(".search_frame").css({ height: "1.2rem" });
        $(".search_frame .icon_arrow").css("transform", "rotateZ(360deg)");
        $(this).addClass("activei");
    }
});

// 信息显示
$(".search_header_boxs .icon_arrows").on(clickStr, function () {
    if ($(this).hasClass("active")) {
        $(this).removeClass("active");
        $(".search_header_boxs .search_table_box").removeClass("active");
    } else {
        $(this).addClass("active");
        $(".search_header_boxs .search_table_box").addClass("active");
    }
});

// 降水底部信息标题文字点击事件
$(".search_frameJs .search_title ").on("click", "span", function () {
    // 修改视图中心点和层级
    if ($(this).attr("lng") !== undefined) {
        map.getOverlays().clear();
        let lng = $(this).attr("lng");
        let lat = $(this).attr("lat");
        let item = JSON.parse($(this).attr("item"));
        let vectorLayers = $(".jiangshui .times.active").attr("data-qname");
        // let icon = $(this).attr("icon");
        map.getView().animate({ center: [lng, lat] }, { zoom: 10 });
        // 添加提示框方法
        addPopup({ item }, { className_: vectorLayers }, "Circle", false);
    }
    // 跳转数据列表页
    if ($(this).attr("hour_type") !== undefined) {
        let hour_type = $(this).attr("hour_type");
        let level_value = $(this).attr("level_value");
        xiangqing2("1", hour_type, "", "", "0", "", level_value);
    }
});

// 降水图例arrow点击事件
$(".lengend_screen").on("click", ".legend_l", function () {
    $(".lengend_screen .legend_l").hide();
    $(".lengend_screen .lengend_screen_box").hide();
    $(".lengend_screen .legend_r").css({ display: "flex", alignItems: "center" });
});

$(".lengend_screen").on("click", ".legend_r", function () {
    $(".lengend_screen .legend_l").show();
    $(".lengend_screen .lengend_screen_box").show();
    $(".lengend_screen .legend_r").hide();
});
