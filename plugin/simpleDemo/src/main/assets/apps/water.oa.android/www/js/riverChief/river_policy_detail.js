// 选择框点击事件
$(".content .main .select").on("click", ".select_item", function () {
    $(this).addClass("active").siblings().removeClass("active");
    let index = $(this).index();
    let $dom = $(".content .main .content_wrap>div").eq(index);
    $dom.show().siblings().hide();
    $dom.find(".order_wrap .order").eq(0).addClass("active").siblings().removeClass("active");
});
// 顺序倒叙点击事件
$(".content .main .content_wrap .order_wrap").on("click", ".order", function () {
    $(this).addClass("active").siblings().removeClass("active");
});

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
var pageStatus = true;
var data_info = {};
let urls = "";
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	urls = self.item_url;
	plus.nativeUI.showWaiting("加载中...");
	data_info.token = token;
	data_info.type = self.item_type;
	data_info.riverCode = self.item_code;
	list(data_info);
});

function list(data_info) {
	var cityCode = startTime = endTime = '';
	var _url = root + urls;
	console.log(_url);
	console.log(JSON.stringify(data_info));
	mui.ajax(_url, {
		data: data_info,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			console.log(JSON.stringify(data))
			if (data.code == 1) {
				// 名称地址
				$(".head_texts").text(data.data.name_tb)
				$(".head_desc").text(data.data.name_bb)
				// 切换块
				let infos = data.data.data;
				/* infos.map(item =>{
					$(".main .select").append(`
						<div class="select_item">${item.text}</div>
					`)
				}) */
				$(".main .select .select_item:first-child").addClass('active')
				// 表格渲染
				infos.map((item,index) =>{
					$(".content_wrap").append(`
						<div class="base">
							<div class="title">
								<span class="blue"></span>
								<span class="text">${item.text}</span>
							</div>
							<div class="wrap">
								<div class="list">
								</div>
							</div>
						</div>
					`)
					item.list.map((item2,index2) =>{
						$(".content_wrap .list").append(`
							<div class="line">
								<div class="left">${item2.name}</div>
								<div class="right">${item2.value}</div>
							</div>
						`)
					})
				})
				$(".content .main .content_wrap>div:first-child").show().siblings().hide()
			}
			
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
}
