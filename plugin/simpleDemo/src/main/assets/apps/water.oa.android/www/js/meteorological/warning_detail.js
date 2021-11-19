var root = localStorage.getItem("str_url");
if (root == "" || root == undefined || root == null) {
	mui.openWindow({
		url: 'login.html?cid=1', //通过URL传参
		id: 'login.html?cid=1', //通过URL传参
	})
}
var token = localStorage.getItem("token");
var warningType;
var page = 1;
var data_info = {};
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	if(self.showHistory){
		$(".right").css("display","block")
	}
	plus.nativeUI.showWaiting("加载中...");
	data_info.token = token;
	data_info.id  = self.ids
	list(data_info);
});
// $("#city").on("change", submit_fun);

function list(data_info) {
	var _url = root + 'api/v4/disaster_warning/show';
	console.log(_url)
	console.log(JSON.stringify(data_info))
	//24小时预报
	mui.ajax(_url, {
		data: data_info,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			console.log(JSON.stringify(data));
			plus.nativeUI.closeWaiting();
			if(data.code == 1){
				// 标题
				$("header .detail_title").text(data.data.info.name)
				// 内容标题
				$(".lists_span_title.headline .headline_text").text(data.data.info.headline)
				$(".lists_span_title.headline .tagger").text(data.data.info.tagger)
				// 主体内容
				$(".lists_span.conent").text(data.data.info.conent);
				// 副标题内容
				$(".lists_span.subline .subline_left span").text(data.data.info.releaseAtStr)
				$(".lists_span.subline .subline_right span").text(data.data.info.releaseDep)
				// 防御指南
				if(data.data.info.defenseGuide && data.data.info.defenseGuide != undefined){
					$(".lists_span_box.box2").show()
					$(".lists_span_box .defenseGuide").html(data.data.info.defenseGuide)
				}else{
					$(".lists_span_box.box2").hide()
				}
				// 标准
				if(data.data.info.standard && data.data.info.standard != undefined){
					$(".lists_span_box.box3").show()
					$(".lists_span_box .standard").html(data.data.info.standard)
				}else{
					$(".lists_span_box.box3").hide()
				}
				
				// 预警类型
				warningType = data.data.info.type;
			}
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	});
}

function jump_list(){
	jump_new('warning_list.html',{type:warningType})
}