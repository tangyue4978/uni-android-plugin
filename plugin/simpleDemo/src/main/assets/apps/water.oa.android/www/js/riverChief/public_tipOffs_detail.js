// 顺序倒叙点击事件
$(".content .main .content_wrap .order_wrap").on("click", ".order", function() {
	$(this).addClass("active").siblings().removeClass("active");
});

var root = localStorage.getItem("str_url");
console.log(root)
if (root == "" || root == undefined || root == null) {
	mui.openWindow({
		url: 'login.html?cid=1', //通过URL传参
		id: 'login.html?cid=1', //通过URL传参
	})
}
var token = localStorage.getItem("token");
console.log(token);
var list_this = '';
var pageStatus = true;
var data_info = {};
mui.plusReady(function() {
	var self = plus.webview.currentWebview();

	plus.nativeUI.showWaiting("加载中...");
	data_info.token = token;
	data_info.id = self.item_id;
	list(data_info);
});

function list(data_info) {
	var cityCode = startTime = endTime = '';
	var _url = root + 'api/v3/riverchief/riverchieflakechief/report_show';
	console.log(_url);
	console.log(JSON.stringify(data_info));
	mui.ajax(_url, {
		data: data_info,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(res) {
			plus.nativeUI.closeWaiting();

			if (res.code == 1) {
				// 名称地址
				$(".head_texts").text(res.data.name_tb)
				$(".head_desc").text(res.data.name_bb)
				// 切换块
				let infos = res.data.data;
				console.log(JSON.stringify(res.data))

				infos.map((item, index) => {
					$(".main .select").append(`
						<a class="select_item" data-index="${index}" href="#item_container_${index}">${item.text}</a>
					`)
				})

				$(".main .select .select_item:first-child").addClass('active')

				// 表格渲染
				infos.map((item, index) => {
					$(".content_wrap").append(`
						<div class="base" id="item_container_${index}">
							<div class="title">
								<span class="blue"></span>
								<span class="text">${item.text}</span>
							</div>
							<div class="wrap">
								<div class="list">
								</div>
							</div>
						</div>
					`)

					item.list.map((item2, index2) => {
						$(".content_wrap .list").append(`
							<div class="line">
								<div class="left">${item2.name}</div>
								<div class="right">${item2.value}</div>
							</div>
						`)
					})
				})

				// menu 菜单点击事件监听
				clickScrollEvent()
			}

		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
}

/**
 * @funcition clickScrollEvent
 * @description menu 菜单点击（执行滚动事件）
 */
const clickScrollEvent = function() {
	// 获取每个 dom 距离顶部的高度
	let itemTopList = [] // 一个滚动高度区间，用于判别当前滚动是在哪个区间
	$('.base').each((index, elem) => {
		itemTopList.push($(elem).offset().top - $('.content_wrap').offset().top)
	})

	// 最后添加最大高度
	itemTopList.push($('.content_wrap')[0].scrollHeight - $('.content_wrap').height()) // 整体滚动高度 - 当前内容显示区域高度

	// 滚动监听
	menuStatusByScroll(itemTopList)

	$(".content .main .select").off('click').on("click", ".select_item", function() {
		// 点击后关闭滚动条监听
		$('.content_wrap').off('scroll')

		// 滚动高度计算
		let cacheDom = $($(this).attr("href")) // 需要滚动到的 dom
		let cacheScroll = $('.content_wrap').scrollTop() // 整体滚动高度
		let cacheTop = cacheScroll + (cacheDom.offset().top - $('.content_wrap').offset()
			.top) // 要滚动的高度 = 当前滚动高度 + （目标距顶部高度 - 整体距顶部高度）

		// menu 样式改变
		$(this).addClass("active").siblings().removeClass("active");

		// 滚动
		$(".main .content_wrap").animate({
			scrollTop: cacheTop + "px"
		}, 'fast', function() {
			// 滚动完成后，再次监听滚动条
			menuStatusByScroll(itemTopList)
		});

		return false;
	});
}

/**
 * @function menuStatusByScroll
 * @description 滚动引起的菜单状态改变
 */
const menuStatusByScroll = function(itemTopList = []) {
	// 监听滚动条高度，判断当前滚动在哪个区间
	$('.content_wrap').off('scroll').on('scroll', function(e) {
		let scrollTop = $(this).scrollTop()

		// 判断是否触底，触底直接修改最后一个 menu 样式
		if (scrollTop >= itemTopList[itemTopList.length - 1] - 10) { // 其中 -10 为滚动偏差
			$('.main .select .select_item').last().addClass("active").siblings().removeClass(
				"active") // 修改 menu 样式
		} else {
			// 区间遍历
			itemTopList.forEach((item, index) => {
				let topAfter = itemTopList[index + 1]

				// 区间判断
				if (scrollTop >= item - 10 && scrollTop < topAfter) { // 其中 -10 为滚动偏差
					$('.main .select .select_item').eq(index).addClass("active").siblings()
						.removeClass("active") // 修改 menu 样式
				}
			})
		}
	})
}
