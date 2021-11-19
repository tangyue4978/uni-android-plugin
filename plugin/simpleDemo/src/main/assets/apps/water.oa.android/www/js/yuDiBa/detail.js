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
});
var obj_info={objname:[],objdateils:[]}
function claerDetail(obj) {
	console.log(JSON.stringify(obj))
	var _url = root + 'api/v3/fetchwaters/backbone/show';
	mui.ajax(_url, {
		data: obj_data,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			console.log(JSON.stringify(data))
			plus.nativeUI.closeWaiting();
			
			if (data.code == 1) {

				//基本信息
				$('#base_info_table').html("");
				var baseInfo = data.data.basic;
				console.log()
				switch (baseInfo[0].value){
					case 1:
						baseInfo[0].value = '骨干坝'
						break;
					case 2:
						baseInfo[0].value = '中型坝'
						break;
					case 3:
						baseInfo[0].value = '拦沙坝'
						break;
					default:
						break;
				}
				for (let i = 0; i < baseInfo.length; i++) {
					$('#base_info_table').append(
						`<tr>
							<td class="texr">${baseInfo[i].name} </td>
							<td class="texl">${baseInfo[i].value} </td>
						</tr>`
					)
				}		
				// 淤地情况
				$('#backbone').html("");
				var backbone = data.data.backbone;
				for (let i = 0; i < backbone.length; i++) {
					$('#backbone').append(
						`<tr>
							<td class="texr">${backbone[i].name} </td>
							<td class="texl">${backbone[i].value} </td>
						</tr>`
					)
				}
				// 蓄水情况
				$('#impound').html("");
				var impound = data.data.impound;
				for (let i = 0; i < impound.length; i++) {
					$('#impound').append(
						`<tr>
							<td class="texr">${impound[i].name} </td>
							<td class="texl">${impound[i].value} </td>
						</tr>`
					)
				}
				
				
				//详情标题
				var title = data.data;
				$('.head_texts').text(title.show);
				$('.head_desc').text(title.city);
			
			}
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
}
