$(document).on('scroll', function() {
	// console.log('111')
	let top0 = $(this).scrollTop()
	// console.log(top0)
	var margin_ = parseInt($('.year_search').css('marginTop').slice(0, -2))
	// console.log(margin_)
	var mintop = parseInt(margin_ + 128)
	topdiv = margin_ + 50 + 'px'
	// console.log(mintop)
	if (top0 >= mintop) {
		$('.top_div').css({
			position: 'fixed',
			// 'z-index':'99',
			top: topdiv
		})
		// $('#left_div1').css({
		// 	position:'fixed',
		// 	'z-index':'99',
		// 	top:topdiv
		// })
	} else {
		$('.top_div').css({
			position: 'static',
			// 'z-index':'99',
		})
	}
	
})
// body内容滚动
	$('#right_div3').on('scroll', function() {
		let top1 = $(this).scrollTop();
		// console.log(top1)
		let left1 = $(this).scrollLeft();
		$("#left_div2").scrollTop(top1);
		$("#right_div1").scrollLeft(left1);
	})
	// 左侧滚动
	$('#left_div2').on('scroll', function() {
		let top2 = $(this).scrollTop();
		$("#right_div3").scrollTop(top2);
	})
	// 上右滚动
	$('#right_div1').on('scroll', function() {
		let left2 = $(this).scrollLeft();
		$("#right_div3").scrollLeft(left2);
	})
