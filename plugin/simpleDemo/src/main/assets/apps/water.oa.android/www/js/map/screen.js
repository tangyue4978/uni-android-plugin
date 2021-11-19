// 筛选js

if($(".more_box .more_img")&&$(".more_box .more_img").length > 0){
	$("body").on("click",".more_box .more_img",function(){
		var dataclass = $(this).attr("data-class");
		var status = $(this).hasClass("active"); 
		if(status){
			$(this).removeClass("active");
			$(".sort.start .sort_list.hide").css("display","none");
			$(".sort.start").removeClass("selectauto");
		}else{
			$(this).addClass("active");
			$(".sort.start .sort_list.hide").css("display","block");
			$(".sort.start").addClass("selectauto");
		}
		list_up_down(status,dataclass)
	})
}

/**
 * @param {true/false} status 展开显示状态
 * @param {string} dataclass
 */
function list_up_down(status,dataclass){
	switch (dataclass){
		case "waterlove":
			if(status){
				$(".number_total").css("top","2.7rem")
				$('.list_wrap').css('top','3.55rem')
			}else{
				$(".number_total").css("top","3.5rem")
				$('.list_wrap').css('top','4.35rem')
			}
			break;
		// 灌区
		case "list":
			if(status){
				$(".list_number").css("top","2.68rem")
				$('.lists').css('margin-top','0.4rem')
			}else{
				$(".list_number").css("top","4.2rem")
				$('.lists').css('margin-top','1.92rem')
			}
			break;
		// 河湖长名录
		case "hb_all":
			if(status){
				$(".content_box").css("height","2.8rem")
				$(".all").css("top","4rem")
				$('.list').css('margin-top','5.2rem')
			}else{
				$(".content_box").css("height","3.6rem")
				$(".all").css("top","4.8rem")
				$('.list').css('margin-top','6rem')
			}
			break;
		//事件信息
		case "event":
			if(status){
				$(".all3").css("top","2.6rem")
				$('.list').css("margin-top",'3.6rem')
			}else{
				$(".all3").css("top","4.2rem")
				$('.list').css("margin-top",'5.2rem')
			}
			break;
		//巡查
		case "xuncha":
			if(status){
				$(".all3").css("top","2.6rem")
				$('.list').css("margin-top",'3.6rem')
			}else{
				$(".all3").css("top","3.5rem")
				$('.list').css("margin-top",'4.5rem')
			}
			break;
		//巡河管理
		//排污口
		case "drainOutlet":
			if(status){
				$(".all3").css("top","2.68rem")
				$('.list').css("margin-top",'3.68rem')
			}else{
				$(".all3").css("top","3.48rem")
				$('.list').css("margin-top",'4.48rem')
			}
			break;
		//清四乱
		case "clear_four_mess":
			if(status){
				$(".statics").css("top","3rem");
				$('.all').css('top',"4.7rem");
				$('.list').css('margin-top',"5.7rem");
			}else{
				$(".statics").css("top","3.7rem");
				$('.all').css('top',"5.32rem");
				$('.list').css('margin-top',"6.32rem");
			}
			break;
		//取水口
		case "list1":
			if(status){
				$('.all').css('top',"2.68rem");
				$('.list').css('margin-top','3.68rem');
			}else{
				$('.all').css('top',"3.48rem");
				$('.list').css('margin-top','4.68rem');
			}
			break;
		// 地下水
		case "waterLove1":
			if(status){
				$('.list_number').css('top',"2.6rem");
				$('.list').css('margin-top',"0rem");
			}else{
				$('.list_number').css('top',"4rem");
				$('.list').css('margin-top',"2rem");
			}
			break;
		//河道水情
		case "list2":
			if(status){
				$('.list_number').css('top',"2.65rem");
				$('.list').css('margin-top',"0.5rem");
			}else{
				$('.list_number').css('top',"4rem");
				$('.list').css('margin-top',"1.7rem");
			}
			break;
		//水利地图
		case "list3":
			if(status){
				$('.list.repair').css('padding-top',"2.8rem");
			}else{
				$('.list.repair').css('padding-top',"3.5rem");
			}
			break;
		//水库
		case "waterLsit":
			if(status){
				$('.statics').css('top',"3rem");
				$('.biao').css('margin-top','5rem');
			}else{
				$('.statics').css('top',"3.7rem");
				$('.biao').css('margin-top','5.7rem');
			}
			break;
		case "warningLsit":
			if(status){
				$(".listBox").css("margin-top",'2.8rem')
			}else{
				$(".listBox").css("margin-top",'3.5rem')
			}
			break;
		default:
			console.log("未处理"+dataclass);
			break;
	}
}