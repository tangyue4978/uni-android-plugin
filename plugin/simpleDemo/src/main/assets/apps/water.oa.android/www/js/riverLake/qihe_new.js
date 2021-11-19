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
var list_this = '';
var data_info = {};
var data_infos = {}
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	if (self.type_id == undefined) {
		self.type_id = 0;
	}
	plus.nativeUI.showWaiting("加载中...");
	data_info.token = token;
	data_infos.token = token;
	data_info.type = 1
	list(1,data_info,$('.tab_active').attr('data-url'));
});

//七河五湖切换
$('.tab_box').on('click','li',function(){
	if(!$(this).hasClass('tab_active')){
		$(this).addClass('tab_active').siblings().removeClass('tab_active')
		$('.all').addClass("ishide")
		if($(this).attr('data-id') == 1){
			data_info.type = $(this).attr('data-id')
			list(1,data_info,$(this).attr('data-url'));
			$('#qihenumber').removeClass("ishide")
		}else{
			list(2,data_infos,$(this).attr('data-url'));
			$('#wuhunumber').removeClass('ishide')
		}
		
	}
})


//七河五湖
function list(type,data_info,url) {
	var _url = root + url;
	console.log(_url)
	console.log(JSON.stringify(data_info))
	mui.ajax(_url, {
		data: data_info,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			console.log(JSON.stringify(data))
			plus.nativeUI.closeWaiting();
			if (data.code == 1) {
				var list_html = ''
				if(type == 1){
					var infobox = data.data.info;
					$('#qihenumber .all_num').text(data.data.total);
					for (let i = 0; i < infobox.length; i++) {
						list_html += '<li class="lists_li"><ul class="lists_data" onclick="xiangqing('+type+ ',' + infobox[i].id +
							')">' +
							'<li><span class="weight">' + infobox[i].name + '</span></li>' +
							'<li class="position"><span class="region">' + infobox[i].flowArea + '</span></li>' +
							'<li><span>源头：</span><span>' + infobox[i].source + '</span></li>' +
							'<li><span></span></li>' +
							'<li><span>河流长度(km)：</span><span>' + infobox[i].length + '</span></li>' +
							'<li><span>流域面积(km³)：</span><span>' + infobox[i].drainageArea + '</span></li>' +
							
							'</ul></li>'
					}
				}else{
					var infobox = data.data;
					$('#wuhunumber .all_num').text('5');
					for (let i = 0; i < infobox.length; i++) {
						list_html += '<li class="lists_li2"><ul class="lists_data2" onclick="xiangqing(' + type + ',' + infobox[i].id + ')">' +
							'<li><span class="weight">' + infobox[i].name + '</span></li>' +
							'<li><span>位于：</span><span class="region">' + infobox[i].source + '</span></li>' +
							'<li><span>类型：</span><span>' + infobox[i].type + '</span></li>' +
							'</ul></li>'
					}
				}
				$('.lists').html(list_html)
			}
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
}

function xiangqing(type,item_id) {
	console.log(type)
	console.log("详情=" + item_id);
	if(type == 1){
		mui.openWindow({
			url: 'qihu_detail.html', //通过URL传参
			id: 'qihu_detail.html', //通过URL传参
			extras: {
				item_id: item_id,
			}
		})
	}else{
		mui.openWindow({
			url: 'wuhu_detail.html', //通过URL传参
			id: 'wuhu_detail.html', //通过URL传参
			extras: {
				item_id: item_id,
			}
		})
	}
	
}