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
	var _url = root + 'api/v3/riverchief/event/show';
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
				var baseInfo = data.data.baseInfo;
				$('.head_texts').text(baseInfo[1].value);
				$('.head_desc').text(baseInfo[2].value);
				var length = baseInfo.length;
				var tr_html = '';
				for(let i=2;i<length-2;i++){
					if(baseInfo[i].value == ''){
						baseInfo[i].value = '-'
					}
					tr_html += '<tr><td class="texr">' + baseInfo[i].name + '</td><td class="texl">' + baseInfo[i].value + '</td></tr>';
				}
				$('.base_info_tables').html(tr_html)
				// var item_html = '';
				// for(let i = 0;i<baseInfo.length-2;i++){
				// 	var item = baseInfo[i];
				// 	if(i != 1 && i != 2){
				// 		if(i%2 == 0){
				// 			item_html += "<tr>";
				// 			if(i == baseInfo.length -1){
				// 				item_html +="<td class='texr'>"+item.name+"</td>"+"<td colspan='3'>"+item.value+"</td>";
				// 			}else{
				// 				item_html +="<td class='texr'>"+item.name+"</td>"+"<td class='texl' >"+item.value+"</td>";
				// 			}
				// 		}else{
				// 			item_html +="<td class='texr'>"+item.name+"</td>"+"<td class='texl'>"+item.value+"</td>";
				// 		}
						
				// 		if((i > 0 && i%2 == 1 )||i == baseInfo.length - 1  ){
				// 			item_html +="</tr>";
				// 		}
				// 	}
					
				// 	$(".base_info_tables").html(item_html);
				// }
				//图片
				var photoLengh = baseInfo.length-2;
				console.log(photoLengh)
				var photos_html = "";
				for(let j = baseInfo.length-2;j<baseInfo.length;j++){
					if(baseInfo[j].value == ''){
						
					}else{
						photos_html +='<div class="photo_title">'+baseInfo[j].name+'</div>'
						for(let i = 0;i<baseInfo[j].value.length;i++){
							photos_html += '<img class="photo_img" src="'+baseInfo[j].value[i]+'">'
						}
					}
				}
				$('.photos').append(photos_html)
				// 监测信息
				var monitor = data.data.approveInfo;
				console.log(JSON.stringify(monitor))
				for(let i = 0;i<monitor.length;i++){
					$('.respect_table').append(
					'<tr><td>'+monitor[i].userName+'</td><td>'+monitor[i].desc+'</td><td style="color:'+monitor[i].color+'">'+monitor[i].type+'</td></tr>'
					)
					
				}
				
			}
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
}