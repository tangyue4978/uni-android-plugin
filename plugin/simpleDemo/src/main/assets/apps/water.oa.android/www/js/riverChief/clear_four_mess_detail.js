var root = localStorage.getItem("str_url");
if (root == "" || root == undefined || root == null) {
	mui.openWindow({
		url: 'login.html?cid=1', //通过URL传参
		id: 'login.html?cid=1', //通过URL传参
	})
}
var token = localStorage.getItem("token");

var obj_data = {};
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	plus.nativeUI.showWaiting("加载中...");

	obj_data.token = token;
	obj_data.id = self.item_id;
	
	claerDetail(obj_data)
});

function claerDetail(obj) {
	var _url = root + 'api/v3/riverchief/fourchaosproblem/show';
	console.log(_url);
	console.log(JSON.stringify(obj));
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
				//详情标题
				var title = data.data.head;
				$('.head_texts').text(title.type);
				$('.head_desc').html("<span class='head_explain_text'>"+title.desc+"</span><span class='head_explain_text2' style='display:none;'>"+title.long_desc+title.long_desc+title.long_desc+"</span><span class='head_explain_open'></span>");
				console.log(title.str_len > 15)
				if(title.str_len > 15){ 
					$('.head_explain_open').text('[展开]');
					$('.head_explain_open').on('click',function(){
						if($(this).text() == '[关闭]'){
							$(".head_explain_text").css("display","inline")
							$(".head_explain_text2").css("display","none")
							$(this).text('[展开]')
						}else{
							$(".head_explain_text").css("display","none")
							$(".head_explain_text2").css("display","inline")
							$(this).text('[关闭]')
						}
					})
				}


				//基础信息?????
				var baseInfo = data.data.baseInfo;
				var length = baseInfo.length;
				var tr_html = '';
				for(let i=2;i<length;i++){
					if(baseInfo[i].value == ''){
						baseInfo[i].value = '-'
					}
					if(baseInfo[i].name != '经度' && baseInfo[i].name != '纬度')
					tr_html += '<tr><td class="texr">' + baseInfo[i].name + '</td><td class="texl">' + baseInfo[i].value + '</td></tr>';
				}
				$('.base_info_table').html(tr_html)
				// var baseInfo = data.data.baseInfo;
				// for (let i = 0; i < baseInfo.length; i++) {
				// 	if (baseInfo[i].colspan == 1) {
				// 		$('.base_info_table').append(
				// 			'<tr><td class="texr">' + baseInfo[i].name + '</td><td class="texl">' + baseInfo[i].value +
				// 			'</td><td class="texr">' + baseInfo[i + 1].name + '</td><td class="texl">' + baseInfo[i + 1].value +
				// 			'</td></tr>'
				// 		)
				// 		i++;
				// 	} else {
				// 		$('.base_info_table').append(
				// 			'<tr><td class="texr">' + baseInfo[i].name + '</td><td class="texl" colspan="' + baseInfo[i].colspan + '">' +
				// 			baseInfo[i].value + '</td></tr>'
				// 		)
				// 	}
				// }

				//处理描述
				if(data.data.desc){
					$(".deal_with").show()
					$('.deal_with_text').text(data.data.desc);
				}
				//处理前后照片对比 before 处理前 after 处理后
				var photo = data.data.img;
				console.log(JSON.stringify(photo))
				if(photo.before || photo.after){
					$('.deal_photo').show()
				}
				if(photo.before != ''){
					$('.before').attr('src', photo.before);
				}else{
					$('.deal_photo_box_before').css('display','none')
				}
				if(photo.after != ''){
					$('.after').attr('src', photo.after);
				}else{
					$('.deal_photo_box_after').css('display','none')
				}
				// 列表
				// $('.all_num').text(infobox.length);
				// for (let i =0;i<infobox.length;i++) {
				// 	$('.lists').append(
				// 	'<li class="lists_li lists_lis"><ul class="lists_data lists_datas" onclick="xiangqing('+infobox[i].id+')">' + 
				// 	'<li><span>标题：</span><span>' + infobox[i].title + '</span></li>' +
				// 	'<li><span>处理状态：</span><span class="all_num">' + infobox[i].status + '</span></li>' +
				// 	'<li><span>地址：</span><span>' + infobox[i].location + '</span></li>' +
				// 	'<li><span>河段地址：</span><span>' + infobox[i].specificLocation + '</span></li>' +
				// 	'<li><span>批次编码：</span><span>' + infobox[i].batchCode + '</span></li>' +
				// 	'</ul></li>'
				// 	)
				// }
				// 城市编码
				// var code = data.data.city;
				// for(keys in code){
				// 	$('#city').append(
				// 	'<option value="'+keys+'">'+ code[keys] + '</option>')
				// }

			}
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
}
