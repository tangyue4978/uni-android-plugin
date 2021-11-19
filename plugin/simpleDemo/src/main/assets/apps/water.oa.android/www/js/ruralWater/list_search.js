function dragFunc(id) {
	var Drag = document.getElementById(id);
	Drag.ontouchstart = function(event) {
		var ev = event || window.event;
		event.stopPropagation();
		var disX = ev.touches[0].clientX - Drag.offsetLeft;
		var disY = ev.touches[0].clientY - Drag.offsetTop;
		var s_height = window.screen.height;//屏幕宽高
		var s_width = window.screen.width;
		var item_w = Drag.offsetWidth;//当前元素宽高
		var item_h = Drag.offsetHeight;
		
		document.ontouchmove = function(event) {
			event.stopPropagation();
			var ev = event || window.event;
			Drag.style.right = s_width - ev.touches[0].clientX + disX - item_w + "px";
			Drag.style.bottom = s_height - ev.touches[0].clientY + disY - item_h + "px";
			Drag.style.cursor = "move";
		};
	};
	Drag.ontouchmove = function(event){
		event.preventDefault();
	}
	Drag.ontouchend = function() {
		document.ontouchmove = null;
		this.style.cursor = "default";
	};
	Drag.onclick = function(){
		$(document).scrollTop(0)//点击回到顶部
	}
};
$(function() {
	//条件查询
	$(".gpsInfo .icon_arrow").on("click", function() {
		if ($(".gpsInfo").hasClass("open")) {
			$(".gpsInfo").removeClass("open");
		} else {
			$(".gpsInfo").addClass("open");
		}
	})

})
$(document).ready(function() { //在文档加载完毕后执行
	$(window).scroll(function() { //开始监听滚动条
		var topp = $(document).scrollTop();
		if (topp > 500) {
			if($("#top_div").length != 0){
				$("#top_div").show();
			}else{
				$("body").append("<div id='top_div' class='top_back_div'>回到<br/>顶部</div>");
				setTimeout(function(){
					dragFunc('top_div');
				},200)
			}
		}else{
			if($("#top_div").length != 0){
				$("#top_div").hide();
			}else{
				
			}
		}
	})
})
