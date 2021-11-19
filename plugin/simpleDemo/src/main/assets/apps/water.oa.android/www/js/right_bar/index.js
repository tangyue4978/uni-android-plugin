// 侧边栏兼容ipad
if(devInfo.h_w_pixel<=1.7){
	var zoomStr = (devInfo.h_w_pixel/1.7).toFixed(3);
	$(".right_bar").css("zoom",zoomStr);
}
var clickStr = mui.os.ios ? "tap" : "click";
// 添加展开收起图标
$(".right_bar").append(`<!-- 展开收起 -->
	<div class="open_box">
		<div class="icon_item"></div>
		<div class="text_item">收起</div>
		<!-- 上面收起，下面展开 -->
		<div class="icon_item2"></div>
		<div class="text_item2">展开</div>
	</div>
	<!-- 展开收起 end -->`);
$(".right_bar").on(clickStr, ".open_box", function () {
    var status = $(".right_bar .open_box").hasClass("active");
    if (!status) {
        $(".right_bar .open_box").addClass("active");
        $(".right_bar .right_bar_top").css("display", "none");
        $(".right_bar .right_bar_center").css("display", "none");
        $(".right_bar .right_bar_btm").css("display", "none");
    } else {
        $(".right_bar .open_box").removeClass("active");
        $(".right_bar .right_bar_top").css("display", "flex");
        $(".right_bar .right_bar_center").css("display", "flex");
        $(".right_bar .right_bar_btm").css("display", "flex");
    }
});
// 添加展开收起图标end
$(function () {
    //右侧导航图标点击显示高亮效果
    let $li = $(".right_bar_center ul li");
    $("body").on(clickStr, ".right_bar_center ul li", function () {
        let activeClass = $(this).hasClass("active");
        // let liType = $(this).attr("data-li");
        let liName = $(this).attr("data-qname");
        $("#managementObjects .list_ul .list_li[data-qname='" + liName + "']").trigger(clickStr);
        if ($(this).attr("id") == "change_map_mark") {
            if (activeClass) {
                $(this).removeClass("active");
            } else {
                $(this).addClass("active");
            }
        }
    });

    //监听右侧导航栏滚动事件
    let $right_bar_height = $(".right_bar_center").height();
    $(".right_bar_center").scroll(function () {
        // 判断上箭头显隐
        if ($(".right_bar_center ").scrollTop() === 0) {
            $(".right_bar_top .img").css("display", "none");
        } else {
            $(".right_bar_top .img").css("display", "block");
        }
        // 判断下箭头显隐
        let $ul_height = $(".right_bar_center ul").height();
        let btmHeight = $ul_height - $right_bar_height;
        if ($(".right_bar_center ").scrollTop() + 5 >= btmHeight) {
            $(".right_bar_btm .img").css("display", "none");
        } else {
            $(".right_bar_btm .img").css("display", "block");
        }
    });

    //右侧导航上下箭头点击事件
    $(".right_bar_top").on("click", function () {
        // 让下箭头显示
        $(".right_bar_btm .img").css("display", "block");

        $(".right_bar_center ").scrollTop($(".right_bar_center ").scrollTop() - $right_bar_height);
        // 判断是否滚动到顶部
        if ($(".right_bar_center ").scrollTop() === 0) {
            $(".right_bar_top .img").css("display", "none");
        } else {
            $(".right_bar_top .img").css("display", "block");
        }
    });
    $(".right_bar_btm").on("click", function () {
        let $ul_height = $(".right_bar_center ul").height();
        let btmHeight = $ul_height - $right_bar_height;

        // 上箭头显示
        $(".right_bar_top .img").css("display", "block");

        $(".right_bar_center ").scrollTop($(".right_bar_center ").scrollTop() + $right_bar_height);
        // 判断是否滚动到底部
        if ($(".right_bar_center ").scrollTop() + 5 >= btmHeight) {
            $(".right_bar_btm .img").css("display", "none");
        } else {
            $(".right_bar_btm .img").css("display", "block");
        }
    });
});

/**
 * @description 删除已选择提示框，并清除图层
 */
function del_tips(that) {
    let liName = $(that).parent(".tips_item").attr("data-qname");
    $(that).parent(".tips_item").remove();
    $("#managementObjects .list_ul .list_li[data-qname*='" + liName + "']").trigger(clickStr);
}
