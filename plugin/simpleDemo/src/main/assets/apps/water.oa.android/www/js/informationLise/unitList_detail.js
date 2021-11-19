var root = localStorage.getItem("str_url");
console.log(root)
if (root == "" || root == undefined || root == null) {
	// mui.openWindow({
	// 	url: 'login.html?cid=1', //通过URL传参
	// 	id: 'login.html?cid=1', //通过URL传参
	// })
}
var token = localStorage.getItem("token");
console.log(token);
var obj_data = {};
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	plus.nativeUI.showWaiting("加载中...");
	obj_data.token = token;
	obj_data.unitId = self.item_id;
	claerDetail(obj_data)
});

function claerDetail(obj) {
	console.log(JSON.stringify(obj))
	var _url = root + 'api/v3/collectdata/collect/unitShow';
	mui.ajax(_url, {
		data: obj_data,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			console.log(JSON.stringify(data))
			plus.nativeUI.closeWaiting();
			
			if (data.code == 1) {
				//选择日期start
				$('#date').html("<option value='"+data.data.timeData[0].value+"'>"+data.data.timeData[0].text+"</option>");
				document.querySelector("#date").addEventListener("tap", function() {
					var picker = new mui.PopPicker();
					picker.setData(data.data.timeData);
					picker.show(function(SelectedItem) {
						console.log(JSON.stringify(SelectedItem[0].text));
						var data = SelectedItem[0].text;
						$('#date').html("<option value="+data+">"+data+"</option>");
					})
				})	
				//选择日期end
				$('.content_titles').text(data.data.title)
				var datas = data.data.data;
				var content = '';
				for(let i=0;i<datas.length;i++){
						var htmls = ''
						// 创建表格
						content = '<div class="content_box"><div class="content_box_name content_box_name'+(i+1)+'"></div>'+
						'<table class="content_table content_table'+(i+1)+' content_table_full" border="1" cellspacing="0" cellpadding="0" style="border:1px solid #9A9A9A;"></table></div>'
						// console.log(content)
						$('.mui-content').append(content)
						// 表格名字和内容
						$('.content_box_name'+(i + 1)).text(data.data.data[i].title)
						$('.content_table' + (i + 1)).html(data.data.data[i].head)
						data.data.data[i].body.forEach( item =>{
							htmls += '<tr>'
							for(key in item){
								if(key != 'unitName'){
									htmls += '<th>' +item[key]+ '</th>'
								}
							}
							htmls += '</tr>'
							// console.log(htmls)
						})
					$('.content_table'  + (i + 1)).append(htmls)
					if(i == 0){
						$('.content_box').addClass('content_boxs')
					}
				}
				
			}
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
}