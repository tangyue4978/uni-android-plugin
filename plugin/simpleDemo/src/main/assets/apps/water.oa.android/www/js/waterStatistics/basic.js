var page_status = true;
// 获取基础信息
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
var picker = new mui.PopPicker();
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	plus.nativeUI.showWaiting("加载中...");
	data_info.token = token;
	data_info.year = "";
	data_info.type = 1;
	data_info.search_status = 0;//控制条件查询 0插入条件，否则不插入;
	
	
	picker.pickers[0].setSelectedIndex(4, 2000);
	list(data_info);
});

function list(data_info) {
	console.log(JSON.stringify(data_info));
	var _url = root + 'api/v3/yearbookslist/information';
	console.log(_url);
	mui.ajax(_url, {
		data: data_info,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			console.log(JSON.stringify(data));
			plus.nativeUI.closeWaiting();
			page = data_info.page;
			if(data.code == 1) {
				<!-- 数据来源start -->
				$('.main_source').html(data.data.source);
				<!-- 数据来源end -->
				$(".river_lake_title_l #text1").html(data.data.title);
				$(".river_lake_title_l #text2").html(data.data.pie.series[0].name);
				$(".river_lake_title_l #text3").html(data.data.cityColumn.series[0].name);
				$(".river_lake_title_r").html(data.data.unit);
				$("#tabcontent").html("");
				$("#tabhead").html("");
				$("#tabcontent").append(data.data.head);
				// 时间选择器start
				if(page_status){
					$("#muiPicker").text(data.data.year[0].text);
				}
				picker.setData(data.data.year)
				picker.pickers[0].setSelectedValue(data_info.year);
				// 时间选择器end
				$("#tabhead").append("<tr><td>"+$("#tabcontent tr").eq(0).find("th").eq(0).html()+"</td></tr>")
				$("#tabcontent tr").eq(0).find("th").eq(0).remove();
				//头部高度相等
				$('#tabhead').find("td,th").outerHeight($('#tabcontent').find("td,th").outerHeight())
				
				data.data.body.forEach(function(item,index) {
					var tr_html = '<tr>';
					var tr_head_html = '<tr>';
					item.forEach(function(td,index) {
						if(index == 0){
							tr_head_html += '<td>' + td + '</td>';
						}else{
							tr_html += '<td>' + td + '</td>';
						}
						
					});
					tr_html += '</tr>';
					tr_head_html += '</tr>';
					$("#tabcontent").append(tr_html)
					$("#tabhead").append(tr_head_html)
				}); 
				
				pie(data.data.pie);
				column(data.data.cityColumn);
				// $(".tab_li li").bind("click",{column: data.data.column, cityColumn: data.data.cityColumn}, liActive);
			}else{
				if(page>1){
					list_this.endPullupToRefresh(true);
				}
				plus.nativeUI.toast(data.msg);
			}
			page_status = false;
		},
		error: function(xhr, type, errorThrown) {
			console.log(errorThrown)
			plus.nativeUI.closeWaiting();
		}
	})
}