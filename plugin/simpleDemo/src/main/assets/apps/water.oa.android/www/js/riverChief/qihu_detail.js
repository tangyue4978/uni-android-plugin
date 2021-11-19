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
	console.log(obj)
	var _url = root + 'api/v3/riverchief/sevenriverfivelake/show';
	mui.ajax(_url, {
		data: {
			"token": token,
			"id": obj.id,
			"type":1
		},
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			console.log(JSON.stringify(data))
			plus.nativeUI.closeWaiting();
			
			if (data.code == 1) {
				//详情标题
				// var title = data.data.head;
				// $('.head_texts').text(title.type);
				// $('.head_desc').text(title.desc);


				//基础信息?????
				var baseInfo = data.data.baseInfo;
				console.log(JSON.stringify(baseInfo))
				//详情标题
				$('.head_texts').text(baseInfo[0].value);
				$('.head_desc').text(baseInfo[1].value);

				//概述
				if(data.data.outline != null && data.data.outline != "" && data.data.outline != "undefined" ){
					$('.deal_with_text1').text(data.data.outline)
				}else{
					$('#gs').hide();
				}
				
				//基本信息
				
				for (let i = 2; i < baseInfo.length - 2; i++) {
					if (baseInfo[i].colspan == 1) {
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
				//流经地
				console.log(baseInfo.length)
				if(data.data.riverFlow != null && data.data.riverFlow != "" && data.data.riverFlow != "undefined" ){
					$('.deal_with_text').text(data.data.riverFlow)
				}else{
					$('#ljd').hide();
				}
				//重要支流
				if(data.data.tributary != null && data.data.tributary != "" && data.data.tributary != "undefined" ){
					$('.base_info_table1').html(data.data.tributary);
					$('.base_info_table1 tr th').addClass("texr1")
					$('.base_info_table1 tr td').addClass("texl1")
				}else{
					$('#zyzl').hide();
				}
				
				//流域图片
				if(data.data.basin != null  && data.data.basin != "" && data.data.basin != "undefined" ){
					console.log(data.data.basin)
					var base_img_info = `<div class="base_info_title">
											<div class="base_info_title_line"></div>
											<span class="base_info_title_text">
												流域图片
											</span>
										</div>
										<div class="deal_photo_text">
											<img src="${data.data.basin}" class="deal_photo_text_img">
										</div>`;
								$('#base_info_img').html(base_img_info);
				}else{
					$('#lytp').hide();
				}
				//图片
				if(data.data.img != null && data.data.img != "" && data.data.img != "undefined"){
					var slider_html = '<div class="mui-slider-indicator">';
				    var slider_i = '<div class="mui-slider-indicator">';
				    for (let i = 0; i < data.data.img.length; i++) {
					slider_html += '<div class="mui-slider-item"><a href="#"><img src="' + data.data.img[i] +
					 '" class="monitoring_img"></ a></div>'
					 if(i == 0){
					  slider_i = '<div class="mui-indicator mui-active"></div>'
					 }else{
					  slider_i += '<div class="mui-indicator"></div>'
					 }
				   }
				   slider_html += '</div>';
				  slider_i +='</div>';
				   console.log("==================================")
				   console.log(slider_html)
				   console.log(slider_i)
				   $('.mui-slider-indicator').html(slider_html)
				   $('#slider').append(slider_i)
				   //获得slider插件对象
					var gallery = mui('.mui-slider');
					gallery.slider({
						interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
					});
				}else{
					$('#tp').hide();
				}
				
			}
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
}
