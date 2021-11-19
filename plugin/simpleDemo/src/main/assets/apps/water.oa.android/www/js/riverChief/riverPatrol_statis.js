$(function() {
	document.addEventListener("plusready", () => {
		tabClickListener()
		fetchPatrolData()
		handleSearchListener()
		handleScroolEvent()
	})
})

let rootUrl = ''
let token = '';
let currentTab = 0 // 当前 tab
let searchDate = ''; // 搜索时间
let resParentname = ''; // 上级河流名称
let riverName = ''; // 河流名称
let cityCode = ''; // 城市编码
let personLevel = ''; // 河长级别
let pageSize = 15; // 分页页数
let pageNum = 1; // 当前页数

/**
 * @function tabClickListener
 * @description 监听顶部 tab 栏切换
 */
const tabClickListener = function() {
	$('.mui-content .main .nav .nav_item').on('click', function() {
		currentTab = $(this).index()

		$(this).addClass('active').siblings().removeClass('active')
		$('.table_wrap .sort_table').eq(currentTab).show().siblings('.sort_table').hide()
		
		searchDate = '' // 搜索时间
		resParentname = '' // 上级河流名称
		riverName = '' // 河流名称
		cityCode = '' // 城市编码
		personLevel = '' // 河长级别
		pageNum = 1 // 当前页数
		
		$('.table .table_body').empty()

		// 数据查询
		fetchPatrolData(currentTab)
		handleSearchListener()
	})
}


const handleScroolEvent = function() {
	$('.table_wrap').on('scroll', function(e) {
		let $scrollTop = $(this).scrollTop()
		let $scrollHeight = $(this)[0].scrollHeight
		let $height = $(this)[0].clientHeight
		
		if ($scrollTop + $height + 20 >= $scrollHeight) {
			if (currentTab != 1) {
				pageNum += 1
				fetchPatrolData()
			}
		}
	})
}

/**
 * @function handleSearchListener
 * @description 监听搜索
 */
const handleSearchListener = function() {
	// 时间
	$('.select_date').off('change').on('change', function() {
		pageNum = 1 // 当前页数
		$('.table .table_body').empty()
		fetchPatrolData()
	})

	// 河流等级
	$('.select_river_level').off('change').on('change', function() {
		pageNum = 1 // 当前页数
		$('.table .table_body').empty()
		fetchPatrolData()
	})

	// 河流名称
	$('.input_river_name').off('keydown').on('keydown', function(e) {
		let keycode = e.keyCode;
		var searchName = $(this).val();
		
		if (keycode == '13') {
			e.preventDefault();
			
			$('.input_river_name').blur()
			
			pageNum = 1 // 当前页数
			$('.table .table_body').empty()
			// 请求搜索接口
			fetchPatrolData()
		}
	})
	
	// 城市
	$('.select_city').off('change').on('change', function() {
		pageNum = 1 // 当前页数
		$('.table .table_body').empty()
		fetchPatrolData()
	})
	
	// 河长级别
	$('.select_person_level').off('change').on('change', function() {
		pageNum = 1 // 当前页数
		$('.table .table_body').empty()
		fetchPatrolData()
	})
}

/**
 * @function fetchPatrolData
 * @description 获取巡河统计数据
 */
const fetchPatrolData = function() {
	rootUrl = localStorage.getItem("str_url")
	token = localStorage.getItem('token')
	searchDate = $('.select_date').val()
	resParentname = $('.select_river_level').val()
	riverName = $('.input_river_name').val()
	cityCode = $('.select_city').val()
	personLevel = $('.select_person_level').val()
	
	let cachePostUrl // 接口请求地址
	
	switch (currentTab){
		case 1: // 时间
			cachePostUrl = rootUrl + 'api/v3/riverchief/inspectriver/date_statistics'
			$('.select_item_1').show()
			$('.select_item_2').hide()
			$('.select_item_3').show()
			$('.select_item_4').show()
			$('.select_item_5').hide()
			
			break;
		case 2: // 河长级别
			cachePostUrl = rootUrl + 'api/v3/riverchief/inspectriver/level_statistics'
			$('.select_item_1').show()
			$('.select_item_2').hide()
			$('.select_item_3').hide()
			$('.select_item_4').show()
			$('.select_item_5').show()
			
			break;
		default:
			cachePostUrl = rootUrl + 'api/v3/riverchief/inspectriver/river_statistics'
			$('.select_item_1').show()
			$('.select_item_2').show()
			$('.select_item_3').show()
			$('.select_item_4').hide()
			$('.select_item_5').hide()
			
			break;
	}

	plus.nativeUI.showWaiting("加载中...");

	mui.ajax(cachePostUrl, {
		data: handleRequestData({
			token: token,
			date: searchDate,
			resParentname: resParentname,
			riverName: riverName,
			code: cityCode,
			userLevel: personLevel,
			page: currentTab == 1 ? '' : pageNum,
			pageSize: currentTab == 1 ? '' : pageSize
		}),
		headers: {
			'Content-type': 'application/x-www-form-urlencoded'
		},
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(res) {
			plus.nativeUI.closeWaiting()
			// console.log(JSON.stringify(res))

			if (res.code == 1) {
				let response = res.data
				let searchList = response.info
				let searchDateList = response.date || [] // 日期查询列表
				let searchLevelList = response.level || [] // 河长级别
				let searchCityList = response.city || [] // 城市
				let searchParentList = response.resParentname || [] // 河流等级

				// html
				let cacheTableHtml = '' // 表格
				let dateSearchHtml = '<option value="">日期</option>'
				let riverLevelHtml = '<option value="">河流级别</option>'
				let citySearchHtml = '<option value="">全部地市</option>'
				let levelSearchHtml = '<option value="">河长级别</option>' 

				// 字符串拼接操作 - table
				searchList.forEach(item => {
					cacheTableHtml += `
						<div class="line">
							<div class="line_top" data-name="${item.resParentname}">
								<div class="item">${currentTab == 1 ? item.time : currentTab == 2 ? item.name + '/' + item.userLevel : item.resParentname}</div>
								<div class="item">${item.patrolReality}</div>
								<div class="item">${item.patrolPeriod}</div>
								<div class="item">${item.patrolDistance}</div>
								<div class="item">
									<span class="left">${item.questionReality}</span>
									/
									<span class="right">${item.questionFinish}</span>
								</div>
							</div>
							<div class="line_btm"></div>
						</div>`
				})

				// 字符串拼接操作 - 搜索 - 日期
				searchDateList.forEach(item => {
					dateSearchHtml += `<option value="${item.value}">${item.name}</option>`
				})

				// 字符串拼接操作 - 搜索 - 河流等级
				searchParentList.forEach(item => {
					riverLevelHtml += `<option value="${item.value}">${item.name}</option>`
				})
				
				// 字符串拼接操作 - 搜索 - 城市
				for (let key in searchCityList) {
					let item = searchCityList[key]
					
					citySearchHtml += `<option value="${item.value}">${item.name}</option>`
				}
				
				// 字符串拼接操作 - 搜索 - 河长级别
				searchLevelList.forEach(item => {
					levelSearchHtml += `<option value="${item.value}">${item.name}</option>`
				})
				
				// 搜索 option
				if (!$('.select_date').children('option').length) {
					$('.select_date').html(dateSearchHtml)
				}
				
				if (!$('.select_river_level').children('option').length) {
					$('.select_river_level').html(riverLevelHtml)
				}
				
				if (!$('.select_city').children('option').length) {
					$('.select_city').html(citySearchHtml)
				}
				
				if (!$('.select_person_level').children('option').length) {
					$('.select_person_level').html(levelSearchHtml)
				}

				if (currentTab == 1) {
					$('.time_sort .table .table_body').html(cacheTableHtml)
				} else if (currentTab == 2) {
					$('.level_sort .table .table_body').append(cacheTableHtml)
				} else {
					$('.river_sort .table .table_body').append(cacheTableHtml)
					
					// table line 点击监听
					tableExpandListener()
				}
			} else {
				mui.toast(res.msg)
			}
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting()
			mui.toast("网络异常，接口请求失败")
		}
	});
}

/**
 * @function tableExpandListener
 * @description 表格点击展开
 */
const tableExpandListener = function() {
	$('.river_sort .table .table_body .line .line_top').off('click').on('click', function() {
		// 如果点击的是当前 line，且已展开，直接关闭
		if (!$(this).siblings('.line_btm').is(":hidden")) {
			$(this).siblings('.line_btm').toggle()

			return
		}

		resParentname = $(this).attr('data-name')

		plus.nativeUI.showWaiting("加载中...");

		mui.ajax(rootUrl + 'api/v3/riverchief/inspectriver/ajax_river_statistics', {
			data: handleRequestData({
				token: token,
				date: searchDate,
				resParentname: resParentname,
				riverName: riverName,
				code: cityCode
			}),
			dataType: 'json',
			type: 'post',
			success: res => {
				plus.nativeUI.closeWaiting()

				if (res.code == 1) {
					let tableList = res.data.info
					let cacheHtml = ''

					tableList.forEach(item => {
						cacheHtml += `
							<div class="line">
								<div class="item">${item.riverName}</div>
								<div class="item">${item.patrolReality}</div>
								<div class="item">${item.patrolPeriod}</div>
								<div class="item">${item.patrolDistance}</div>
								<div class="item">
									<span class="left">${item.questionReality}</span>
									/
									<span class="right">${item.questionFinish}</span>
								</div>
							</div>`
					})

					$(this).siblings('.line_btm').html(cacheHtml).toggle()
					$(this).parents('.line').siblings().children('.line_btm').hide()
				} else {
					mui.toast(res.msg)
				}
			},
			error: function(xhr, type, errorThrown) {
				plus.nativeUI.closeWaiting()
				mui.toast("网络异常，接口请求失败")
			}
		})
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
