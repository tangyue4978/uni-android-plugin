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
	var _url = root + 'api/v3/riverchief/outlet/show';
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
			var infobox = data.data;
			if (data.code == 1) {
				//基础信息
				var baseInfo = data.data.baseInfo;
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
				$('.base_info_tables').html(tr_html)
				// 监测信息
				var monitor = data.data.monitor;
				console.log(JSON.stringify(monitor))
				for (let i = 0; i < monitor.length; i++) {
					if (i == 0) {
						for (let j = 0; j < monitor[0].length; j++) {
							$("#jcxx_table").append(
								'<tr><td class="texr">' + monitor[0][j].name + '</td><td class="texl">' + monitor[0][j].value + '</td></tr>'
							)
						}
					} else {
						for (let j = 0; j < monitor[i].length; j++) {
							$("#jcxx_table tr").eq(j).append(
								'<td class="texl texc">' + monitor[i][j].value + '</td>'
							)
						}
						
					}

				}
				var tr_len = $("#jcxx_table tr").eq(0).find("td").length;
				if(tr_len >=3){
					var tab_width = ((tr_len)*33)+"%";
					$("#jcxx_table").css("width",tab_width);
					console.log(tab_width);
				}else{
					$("#jcxx_table").css("width","100%")
				}

			}
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
}
