var root = localStorage.getItem("str_url");
console.log(root)
if(root == "" || root == undefined || root == null){
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
function claerDetail(obj){
	var _url = root + 'api/v3/riverchief/billboard/show';
	mui.ajax(_url, {
		data: {
			"token": token,
			"id":obj.id,
		},
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			console.log(JSON.stringify(data.data))
			var infobox = data.data;
			if(data.code == 1) {
				//基础信息
				var baseInfo = data.data;
				$('.head_texts').text(baseInfo[1].value);
				$('.head_desc').text(baseInfo[2].value);
				var length = baseInfo.length;
				var tr_html = '';
				for(let i=2;i<length-2;i++){
					if(baseInfo[i].value == ''){
						baseInfo[i].value = '-'
					}
					tr_html += '<tr><td class="texr">' + baseInfo[i].name + '</td><td class="texl" style="word-break:break-all;">' + baseInfo[i].value + '</td></tr>';
				}
				$('.base_info_tables').html(tr_html)
				
				//图片
				var photoLengh = baseInfo.length-2;
				console.log(photoLengh)
				for(let j = baseInfo.length-2;j<baseInfo.length;j++){
					if(baseInfo[j].value == ''){
						
					}else{
						$('.photos').append(
						'<div class="photo_title">'+baseInfo[j].name+'</div><img class="photo_img" src="'+baseInfo[j].value+'">'
						)
					}
				}
				
			}
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
}