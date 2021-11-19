
var root = localStorage.getItem("str_url");
if (root == "" || root == undefined || root == null) {
	mui.openWindow({
		url: 'login.html?cid=1', //通过URL传参
		id: 'login.html?cid=1', //通过URL传参
	})
}
var token = localStorage.getItem("token");
var page = 1;
var list_this = '';
var data_info = {};
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	plus.nativeUI.showWaiting("加载中...");
	data_info.token = token;
	data_info.hostSequence = self.hostSequence;
	list(data_info);
});

function list(data_info) {
	var _url = root + 'api/v3/asset/assetRepairs/history';
	console.log(_url)
	console.log(data_info)
	mui.ajax(_url, {
		data: data_info,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			console.log(JSON.stringify(data))
			if (data.code == 1) {
				if(data.data.data.length > 0){
					data.data.data.map(item =>{
						$(".list .lists").append(`
							<li class="lists_li">
								<ul class="lists_data">
									<li>
										<span class="weight">${item.repairNumber}</span>
									</li>
									<li class="position">
										<span class="region" style="color:${item.statusColor}">${item.status}</span>
									</li>
									<li class="contents">
										<span>报修说明：</span>
										<span>${item.repairContent}</span>
									</li>
									<li class="titles">
										<span>报修上报时间：</span>
										<span>${item.repairDate}</span>
									</li>
								</ul>
							</li>
						`)
					})
				}else{
					$(".list .lists").append(`
						<div style="width:100%;margin:0 auto;height:2rem;text-align:center;line-height:2rem;background-color: #f5f5f9;">
							<span style="font-size:0.3rem;color:#666;">暂无报修</span>
						</div>
					`)
				}
				
			}
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
}

