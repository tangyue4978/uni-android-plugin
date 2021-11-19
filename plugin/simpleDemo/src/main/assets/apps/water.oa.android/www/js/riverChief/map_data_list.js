$(function() {
	document.addEventListener("plusready", () => {
		// fetchStatisticsData()
		handleSearchListener()
		handleScroolEvent()
	})
})

let pageSize = 10; // 分页页数
let pageNum = 1; // 当前页数

/**
 * @function handleSearchListener
 * @description 监听搜索
 */
const handleSearchListener = function() {
	// 类型
	$('.select_type').on('change', function() {
		pageNum = 1
		mui('.list').pullRefresh().scrollTo(0, 0, 0)
		mui('.list').pullRefresh().refresh(true)
		$('.list_container .lists').empty()

		fetchStatisticsData()
	})

	// 城市
	$('.select_city').on('change', function() {
		pageNum = 1
		mui('.list').pullRefresh().scrollTo(0, 0, 0)
		mui('.list').pullRefresh().refresh(true)
		$('.list_container .lists').empty()

		fetchStatisticsData()
	})

	// 河流名称
	$('.search_name').off('keydown').on('keydown', function(e) {
		let keycode = e.keyCode;
		var searchName = $(this).val();

		if (keycode == '13') {
			e.preventDefault();

			$('.search_name').blur()

			pageNum = 1 // 当前页数
			$('.list_container .lists').empty()
			// 请求搜索接口
			fetchStatisticsData()
		}
	})
}

/**
 * @function handleScroolEvent
 * @description 滚动到底部监听
 */
const handleScroolEvent = function() {
	// 上拉加载
	mui.init({
		pullRefresh: {
			container: ".list", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
			up: {
				height: "50px", //可选.默认50.触发上拉加载拖动距离
				auto: true, // 可选,默认false.自动上拉加载一次
				contentdown: "上拉显示更多",
				contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
				contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
				callback: () => {
					pageNum ++
					fetchStatisticsData()
				} // 必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
			}
		}
	});
	
	// $('.lists').on('scroll', function(e) {
	// 	let $scrollTop = $(this).scrollTop()
	// 	let $scrollHeight = $(this)[0].scrollHeight
	// 	let $height = $(this)[0].clientHeight

	// 	if ($scrollTop + $height + 20 >= $scrollHeight) {
	// 		pageNum += 1
	// 		fetchStatisticsData()
	// 		$('.lists').off('scroll')
	// 	}
	// })
}


/**
 * @function fetchStatisticsData
 * @description 查询统计数据
 */
const fetchStatisticsData = function() {
	let rootUrl = localStorage.getItem("str_url")
	let token = localStorage.getItem('token')
	let searchType = $('.select_type').val() || 1 // 搜索类型
	let cityCode = $('.select_city').val() // 城市
	let searchName = $('.search_name').val()

	plus.nativeUI.showWaiting("加载中...");

	mui.ajax(rootUrl + 'api/v3/riverchief/map/list', {
		type: 'post',
		data: handleRequestData({
			token: token,
			type: searchType,
			code: cityCode,
			page: pageNum,
			pageSize: pageSize,
			name: searchName
		}),
		dataType: 'json',
		success: res => {
			plus.nativeUI.closeWaiting()

			if (res.code == 1) {
				// console.log(JSON.stringify(res))
				let response = res.data
				let infoList = response.info
				let typeList = response.typeList
				let cityList = response.cityList

				let infoListHtml = ''
				let typeSearchHtml = ''
				let citySearchHtml = '<option value="">山西省</option>'

				if (infoList.length == 0) {
					pageNum -= 1
					mui('.list').pullRefresh().endPullupToRefresh(true);
				} else {
					mui('.list').pullRefresh().endPullupToRefresh(false);
				}

				if (searchType == 1) {
					infoList.forEach(item => {
						infoListHtml +=
							'<li class="lists_li lists_lis">' +
							'<ul class="lists_data lists_datas" onclick="navigateToDetail(' +
							item.id + ')">' +
							'<li><span class="weight">' + item.enventType + '</span></li>' +
							'<li class="position"><span class="region" style="color:' + item
							.statusColor + ';">' + item.status + '</span></li>' +
							'<li><span>所属河流：</span><span>' + item.riverName + '</span></li>' +
							'<li><span>上报人：</span><span>' + item.reporter + '</span></li>' +
							'<li class="titles"><span>上报时间：</span><span>' + item.reportTime +
							'</span></li>' +
							'</ul>' +
							'</li>'
					})
				} else if (searchType == 2) {
					infoList.forEach(item => {
						infoListHtml +=
							'<li class="lists_li lists_lis">' +
							'<ul class="lists_data" onclick="navigateToDetail(' + item.id +
							')">' +
							'<li class="titles"><span class="weight">' + item.outletName +
							'</span></li>' +
							'<li><span>排入河流名称：</span><span>' + item.drainRiverName +
							'</span></li>' +
							'<li><span>所属河系：</span><span>' + item.riverSystem + '</span></li>' +
							'<li><span>位置名称：</span><span>' + item.locAreaName + '</span></li>' +
							'</ul>' +
							'</li>'
					})
				} else if (searchType == 3) {
					infoList.forEach(item => {
						infoListHtml +=
							'<li class="lists_li lists_lis">' +
							'<ul class="lists_data lists_datas" onclick="navigateToDetail(' +
							item.id + ')">' +
							'<li class="titles"><span class="weight">' + item.riverName +
							'</span></li>' +
							'<li><span >公式牌编号：</span><span >' + item.code + '</span></li>' +
							'<li><span>所在地区：</span><span>' + item.areaName + '</span></li>' +
							'<li class="titles"><span>地址：</span><span>' + item.location +
							'</span></li>' +
							'</ul>'
						'</li>'
					})
				} else {
					infoList.forEach(item => {
						infoListHtml +=
							'<li class="lists_li lists_lis">' +
							'<ul class="lists_data lists_datas" onclick="navigateToDetail(' +
							item.id + ')">' +
							'<li><span class="weight">' + item.title + '</span></li>' +
							'<li class="titless"><span class="all_num">' + item.status +
							'</span></li>' +
							'<li><span>地址：</span><span>' + item.location + '</span></li>' +
							'<li><span>批次编码：</span><span>' + item.batchCode + '</span></li>' +
							'<li class="titlea"><span>河段地址：</span><span>' + item
							.specificLocation + '</span></li>' +
							'</ul>'
						'</li>'
					})
				}

				// 字符串拼接操作 - 搜索 - 类型
				typeList.forEach(item => {
					typeSearchHtml += `<option value="${item.value}">${item.name}</option>`
				})

				// 字符串拼接操作 - 搜索 - 省市
				cityList.forEach(item => {
					citySearchHtml += `<option value="${item.value}">${item.name}</option>`
				})

				// 搜索 option
				if (!$('.select_type').children('option').length) {
					$('.select_type').html(typeSearchHtml)
				}

				// 搜索 option
				if (!$('.select_city').children('option').length) {
					$('.select_city').html(citySearchHtml)
				}

				$('.sum_total .all_num').text(response.total)
				$('.list_container .lists').append(infoListHtml)
				
			} else {
				mui.toast(res.msg)
			}
			
			// handleScroolEvent()
		},
		error: err => {
			plus.nativeUI.closeWaiting()
			mui.toast("网络异常，接口请求失败")
			// handleScroolEvent()
		}
	})
}

/**
 * @function handleRequestData
 * @description 接口请求参数格式化
 * @param {Object} _object 请求参数
 */
const handleRequestData = function(_object) {
	let cacheObj = {}

	for (let key in _object) {
		if (_object[key]) {
			cacheObj[key] = _object[key]
		}
	}

	console.log(JSON.stringify(cacheObj))

	return cacheObj
}

/**
 * @description 跳转详情页面
 * @param {Number} item_id
 */
const navigateToDetail = function(item_id) {
	let searchType = $('.select_type').val() // 搜索类型
	let cachePageUrl = ''
	let cachePageId = ''

	switch (searchType) {
		case 1:
			cachePageUrl = 'event_detail.html'
			cachePageId = 'event_detail.html'

			break;
		case 2:
			cachePageUrl = 'drainOutlet_detail.html'
			cachePageId = 'drainOutlet_detail.html'

			break;
		case 3:
			cachePageUrl = 'billboard_detail.html'
			cachePageId = 'billboard_detail.html'

			break;
		default:
			cachePageUrl = 'clear_four_mess_detail.html'
			cachePageId = 'clear_four_mess_detail.html'
	}

	mui.openWindow({
		url: cachePageUrl, //通过URL传参
		id: cachePageId, //通过URL传参
		extras: {
			item_id: item_id,
		}
	})
}
