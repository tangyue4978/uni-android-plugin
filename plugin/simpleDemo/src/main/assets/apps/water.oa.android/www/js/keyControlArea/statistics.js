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
	obj_data.year = $('#date').val();
	claerDetail(obj_data)
});

function claerDetail(obj) {
	console.log(JSON.stringify(obj))
	var _url = root + 'api/v3/fetchwaters/backbone/statistics';
	mui.ajax(_url, {
		data: obj_data,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			console.log(JSON.stringify(data))
			plus.nativeUI.closeWaiting();
			
			if (data.code == 1) {
				// 标题
				// $('.title_text').text(data.data.title)
				//选择日期start
				// $('#date').html("<option value='"+data.data.year[0].value+"'>"+data.data.year[0].text+"</option>");
				// document.querySelector("#date").addEventListener("tap", function() {
				// 	var picker = new mui.PopPicker();
				// 	picker.setData(data.data.year);
				// 	picker.show(function(SelectedItem) {
				// 		console.log(JSON.stringify(SelectedItem[0].text));
				// 		var data = SelectedItem[0].text;
				// 		$('#date').html("<option value="+data+">"+data+"</option>");
				// 	})
				// })	
				//选择日期end
				
				// 淤地坝总座数
				// var totals  = data.data.provice_data[0];
				// $('.totals_data').text(totals.value);
				// $('.totals_name').text(totals.name);
				
				// 统计表格
				$('#tabhead').html('');
				$('#tabcontent').html('');
				var tabhead_hmlt = data.data.head;
				$('#tabhead').html(tabhead_hmlt);
				var tabcontent_html = '';
				var tabcontent = data.data.body;
				for(let i=0;i<tabcontent.length;i++){
					tabcontent_html += '<tr>';
					// console.log(tabcontent[i].city)
					var tabcontentCity = tabcontent[i].city 
					for(let j=0;j<tabcontentCity.length;j++){
						tabcontent_html += '<td>'+tabcontentCity[j]+'</td>'
					}
					tabcontent_html += '</tr>';
				}
				console.log(tabcontent_html)
				// $('#tabcontent').html(tabcontent_html);
			}
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
}
// 点击显示区县
// $('.statistics').on('click','.arrow',function(){
// 	if($(this).hasClass('active')){
// 		$(this).css('transform','rotate(0deg)');
// 		$(this).removeClass('active')
// 		$(this).parents("tbody").next("tbody").removeClass("active")
// 	}else{
// 		$(this).css('transform','rotate(180deg)');
// 		// console.log($(this).parents("tbody").next("tbody").html());
// 		$(this).parents("tbody").next("tbody").addClass("active")
// 		// $(this).parent().next().find('county').css('display','inline-block');
// 		$(this).addClass('active')
// 	}
// })