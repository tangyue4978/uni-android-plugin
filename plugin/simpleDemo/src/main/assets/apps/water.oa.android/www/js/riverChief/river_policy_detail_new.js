// 获取基础信息
var root = localStorage.getItem("str_url");
if (root == "" || root == undefined || root == null) {
 mui.openWindow({
  url: 'login.html?cid=1', //通过URL传参
  id: 'login.html?cid=1', //通过URL传参
 })
}

var token = localStorage.getItem("token");
var list_this = '';
var data_info = {};
let urls = '';
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	console.log('================'+JSON.stringify(self))
	urls = self.item_url;
	plus.nativeUI.showWaiting("加载中...");
	data_info.token = token;
	if(self.item_abc!=undefined){
		data_info[self.item_abc] = self.item_code;
	}else{
		data_info.riverCode = self.item_code;
	}
	data_info.type = self.item_type;
	
	list(data_info);
});

function list(data_info) {
	var _url = root + urls;
	console.log(_url);
	console.log(JSON.stringify(data_info));
	mui.ajax(_url, {
		data: data_info,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			console.log("========="+JSON.stringify(data));
			plus.nativeUI.closeWaiting();
			if(data.code == 1) {
				$(".river_lake").css('display','flex');
				//标题
				$("#text1").html(data.data.title);
				
				initFixedTable('#tabhead', '#tabcontent', data.data.left, data.data.head, data.data.body);
			}
		},
		error: function(xhr, type, errorThrown) {
			console.log(errorThrown)
			plus.nativeUI.closeWaiting();
		}
	})
}

/**
 * @function initFixedTable
 * @description 初始化固定表头 table
 * @param {string} leftTarget 左侧表格选择器
 * @param {string} rightTarget 右侧表格选择器
 * @param {string} leftHtml 左侧表格 html
 * @param {string} rightHeadHtml 右侧表格 thead html
 * @param {array} rightData 右侧表格 tbody 数据
 */
const initFixedTable = function(leftTarget, rightTarget, leftHtml, rightHeadHtml, rightData) {
	let cacheLeftList = leftHtml.split('</tr>')
	let resultLeftHtml = ''
	
	cacheLeftList.pop()
	
	cacheLeftList.forEach(item => {
		if (item.includes('<th')) {
			resultLeftHtml += '<thead>' + item + '</tr></thead><tbody>'
		} else {
			resultLeftHtml += item + '</tr>'
		}
	})
	
	// 左侧固定表格
	$(leftTarget).html(resultLeftHtml + '</tbody>');
	
	// 右侧固定表格
	let rightColAppend = '<colgroup>'
	let rightHeadAppend = '<tr>'
	let rightTableAppend = ''
	
	rightData[0].forEach((trItem, trIndex) => {
		rightHeadAppend += `<th>${trIndex}</th>`
		rightColAppend += '<col style="width: 1.35rem;"></col>'
	})
	
	rightHeadAppend += '</tr>'
	rightColAppend += '</colgroup>'
	
	rightData.forEach((trItem, trIndex) => {
		let cacheHtml = ''
		
		trItem.forEach(tdItem => {
			cacheHtml += `<td>${tdItem}</td>`
		})
		
		rightTableAppend += `<tr>${cacheHtml}</tr>`
	})
	
	$(rightTarget).append('<tbody></tbody>').find('tbody').append('<tr><td><table class="inside_table"></table></td></tr>').find('table').append(rightTableAppend);
	$(rightTarget).prepend('<thead></thead>').find('thead').append('<tr><th><table class="inside_table"></table></th></tr>').find('table').append(rightHeadHtml)
	
	// 匹配左右表格高度
	let leftTableTr = $(leftTarget).find("tr")
	let rightTableTr = $(rightTarget).find(".inside_table tr")
	let numArr = [] // 左侧 tr 包含 th、td 长度数组
	let reg = /row="\d+"/g // 匹配 row 字符串正则
	let matchHtmlList = leftHtml.split('</tr>') // 匹配结果数组
	let cacheIndex = 0 // 计算到右侧 th/td 的 index
	let rightLength = rightTableTr.length // 右侧 tr 个数
	
	matchHtmlList.pop() // 去除最后一个
	
	// 左侧表头每个单元格所对应的 tr 个数
	matchHtmlList.forEach((item, index) => {
		if (index) {
			if (item.match(reg) != null) { // 如果当前包含 row
				let cacheItem = item.match(reg)[0]
				numArr.push(parseInt(cacheItem.replace('row="', '').replace('"', '')))
			} else { // 如果没有，push 1
				numArr.push(1)
			}
		} else { // 左侧首行 th，需要右侧所有 th 个数之和
			numArr.push(rightHeadHtml.split("</tr>").length - 1)
		}
	})
	
	// 左侧高度设置
	leftTableTr.each(function(index, elem){
		let lineLength = parseInt(numArr[index]) // 左侧 tr 包含的 th/td 个数
		let endLineIndex = cacheIndex + lineLength // 左侧 tr ，对应的右侧最后一个 tr
		
		let startTop = rightTableTr.eq(cacheIndex).offset().top // 对应右侧开始 tr 高度
		let endTop = endLineIndex >= rightLength ? $('#tabcontent').outerHeight() + $('#tabcontent').offset().top + 1 : rightTableTr.eq(endLineIndex).offset().top // 对应右侧结尾 tr 高度
		let cacheTop = endTop - startTop
		
		$(elem).find("th, td").outerHeight(cacheTop) // 左侧 tr 高度赋值
		
		cacheIndex += lineLength
	})
	
	$('.river_lake2').css({
		height: `calc(100vh - ${$('.river_lake_title').outerHeight()}px - 1.6rem)`
	})
	
	// 左侧滚动，右侧手动触发滚动
	$('.river_lake_head tbody').on('scroll', function(e) {
		let _scrollTop = $('.river_lake_head tbody').scrollTop()
		
		$('.river_lake_content tbody').scrollTop(_scrollTop)
	})
	
	// 右侧滚动，左侧手动触发滚动
	$('.river_lake_content tbody').on('scroll', function(e) {
		let _scrollTop = $('.river_lake_content tbody').scrollTop()
		
		$('.river_lake_head tbody').scrollTop(_scrollTop)
	})
	
	// 设置左侧、右侧 tbody 高度
	let tableHeight = $('.river_lake2').outerHeight()
	let theadHeight = $('.river_lake_content .river_lake_table thead').outerHeight()

	$('.river_lake_head .river_lake_table tbody').css({
		height: `calc(${tableHeight - theadHeight}px)`
	})
	
	$('.river_lake_content .river_lake_table tbody').css({
		height: `calc(${tableHeight - theadHeight}px)`
	})
}