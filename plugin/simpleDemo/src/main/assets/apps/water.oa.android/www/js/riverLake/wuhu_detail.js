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
var obj_data = {};
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	plus.nativeUI.showWaiting("加载中...");

	obj_data.token = token;
	obj_data.id = self.item_id;
	claerDetail(obj_data)
	console.log(obj_data.id)
});

function claerDetail(obj) {
	console.log(JSON.stringify(obj))
	var _url = root + 'api/v3/riverchief/fivelake/show';
	mui.ajax(_url, {
		data: {
			"token": token,
			"id": obj.id,
			// "type":2
		},
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			console.log(JSON.stringify(data))
			plus.nativeUI.closeWaiting();
			
			if (data.code == 1) {
				var baseInfo = data.data.baseInfo;
				console.log(JSON.stringify(baseInfo))
				//详情标题
				$('.head').css('background',"url("+data.data.head.img+")"); //设置背景图的的地址
				$('.head').css('background-size',"100% 100%"); 
				$('.head_texts').text(baseInfo[0].value);
				$('.head_desc').text(baseInfo[1].value);

				//概述
				if(data.data.outline != null && data.data.outline != "" && data.data.outline != "undefined" ){
					$('.deal_with_text1').text(data.data.outline)
				}else{
					$('#gs').hide();
				}
				//基本信息
				for (let i = 0; i < baseInfo.length; i++) {
					if (baseInfo[i].colspan == 0) {
						$('.base_info_table').append(
							'<tr><td class="texr">' + baseInfo[i].name + '</td><td class="texl">' + baseInfo[i].value +
							'</td><td class="texr">' + baseInfo[i + 1].name + '</td><td class="texl">' + baseInfo[i + 1].value +
							'</td></tr>'
						)
						i++;
					} else {
						$('.base_info_table').append(
							'<tr><td class="texr">' + baseInfo[i].name + '</td><td class="texl" colspan="' + baseInfo[i].colspan + '">' +
							baseInfo[i].value + '</td></tr>'
						)
					}
				}
				//河流水系
				if(data.data.drainage != null && data.data.drainage != "" && data.data.drainage != "undefined" ){
					$('.deal_with_text2').text(data.data.drainage)
				}else{
					$('#hlsx').hide();
				}
				//水文水资源情况
				for (let i = 0; i < data.data.waterResources.length; i++) {
					if (data.data.waterResources[i].colspan == 0) {
						$('.base_info_table1').append(
							'<tr><td class="texr">' + data.data.waterResources[i].name + '</td><td class="texl">' + data.data.waterResources[i].value +
							'</td><td class="texr">' + data.data.waterResources[i + 1].name + '</td><td class="texl">' + data.data.waterResources[i + 1].value +
							'</td></tr>'
						)
						i++;
					} else {
						$('.base_info_table1').append(
							'<tr><td class="texr">' + data.data.waterResources[i].name + '</td><td class="texl" colspan="' + data.data.waterResources[i].colspan + '">' +
							data.data.waterResources[i].value + '</td></tr>'
						)
					}
				}
				//所在地区社会经济情况
				if(data.data.regionalEconomicSituation != null && data.data.regionalEconomicSituation != "" && data.data.regionalEconomicSituation != "undefined" ){
					$('.deal_with_text3').text(data.data.regionalEconomicSituation.content)
					$('#jjqk').css('background',"url("+data.data.regionalEconomicSituation.img+") 0% bottom / 100% 190px no-repeat "); //设置背景图的的地址
					$('#jjqk').css('padding-bottom',"150px"); 
				}else{
					$('#jjqk').hide();
				}
				//规划范围
				if(data.data.scopePlanning != null && data.data.scopePlanning != "" && data.data.scopePlanning != "undefined" ){
					$('.deal_with_text4').html(data.data.scopePlanning)
				}else{
					$('#ghfw').hide();
				}
			}
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
}
