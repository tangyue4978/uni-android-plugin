// 选择框点击事件
$(".content .main .select").on("click", ".select_item", function () {
    $(this).addClass("active").siblings().removeClass("active");
    let index = $(this).index();
    let $dom = $(".content .main .content_wrap>div").eq(index);
    $dom.show().siblings().hide();
    $dom.find(".order_wrap .order").eq(0).addClass("active").siblings().removeClass("active");
});
// 顺序倒叙点击事件
$(".content .main .content_wrap .order_wrap").on("click", ".order", function () {
    $(this).addClass("active").siblings().removeClass("active");
});
