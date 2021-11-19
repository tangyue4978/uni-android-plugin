// 管理对象显示隐藏
$("body").on("click",".nav_ul_box .isShow",function(){
	var objItem = $(this).attr("data-type");
	if(objItem && objItem !== undefined){
		if($(this).hasClass("active")){
			$("#"+objItem).removeClass("active")
			$(this).removeClass("active")
		}else{
			$("#"+objItem).addClass("active")
			$(this).addClass("active")
		}
	}
})
// 是否选中管理对象
$("body").on("click",".list_ul .list_li",function(e){
	e.stopPropagation();
	e.preventDefault();
	if($(this).hasClass("active")){
		$(this).removeClass("active")
	}else{
		$(this).addClass("active")
	}
})
$("body").on("click",".list_box",function(){
	event.stopPropagation();
	event.preventDefault();
	$(this).removeClass("active");
	$(".nav_ul_box .nav_li_item").removeClass("active");
})