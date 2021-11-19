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

function claerDetail(obj) {
	var _url = root + 'api/v3/riverchief/riverchiefreach/show';
	mui.ajax(_url, {
		data: {
			"token": token,
			"id": obj.id,
		},
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			console.log(JSON.stringify(data.data))
			if (data.code == 1) {
				//详情标题
				// var title = data.data.head;
				// $('.head_texts').text(title.type);
				// $('.head_desc').text(title.desc);


				//基础信息?????
				var baseInfo = data.data.baseInfo;

				//详情标题
				$('.head_texts').text(baseInfo[0].value);
				$('.head_desc').text(baseInfo[1].value);
				var length = baseInfo.length;
				var tr_html = '';
				for(let i=2;i<length;i++){
					if(baseInfo[i].value == ''){
						baseInfo[i].value = '-'
					}
					tr_html += '<tr><td class="texr">' + baseInfo[i].name + '</td><td class="texl">' + baseInfo[i].value + '</td></tr>';
				}
				$('.base_info_table').html(tr_html)
				//处理描述
				// $('.deal_with_text').text(data.data.desc);
				//处理前后照片对比 before 处理前 after 处理后
				// var photo = data.data.img;
				// $('.before').attr('src',photo.before);
				// $('.after').attr('src',photo.after);	
			}
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
}
