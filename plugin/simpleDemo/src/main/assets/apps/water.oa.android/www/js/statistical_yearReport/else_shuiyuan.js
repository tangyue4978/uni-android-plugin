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
	data_info.year = 0;
	data_info.search_status = 0;//控制条件查询 0插入条件，否则不插入;
	
	
	picker.pickers[0].setSelectedIndex(4, 2000);
	list(data_info);
});

function list(data_info) {
	console.log(JSON.stringify(data_info));
	var _url = root + 'api/v3/waterresource/water_resource/surface_water_source';
	console.log(_url);
	mui.ajax(_url, {
		data: data_info,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			console.log("========="+JSON.stringify(data));
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
				picker.setData(data.data.year)
				for(let i = 0;i<data.data.year.length;i++){
					if(data_info.year == ''){
							$("#muiPicker").text(data.data.year[0].value+'年')
										
					}else{
							picker.pickers[0].setSelectedValue(data_info.year);
					}
				}
				// $("#tabhead").append("<tr><td class='river_lake_tabletd'>"+$("#tabcontent tr").eq(0).find("th").eq(0).html()+"</td></tr>")
				// $("#tabcontent tr").eq(0).find("th").eq(0).remove();
				$("#tabhead").append(data.data.left)
				data.data.body.forEach(function(item,index) {
					var tr_html = '<tr>';
					var tr_head_html = '<tr>';
					item.forEach(function(td,index) {
						// if(index == 0){
						// 	tr_head_html += '<td>' + td + '</td>';
						// }else{
							tr_html += '<td>' + td + '</td>';
						// }
						
					});
					tr_html += '</tr>';
					tr_head_html += '</tr>';
					$("#tabcontent").append(tr_html)
					// $("#tabhead").append(tr_head_html)
				}); 
				pie(data.data.pie);
				column(data.data.cityColumn);
				$(".tab_li li").bind("click",{column: data.data.column, cityColumn: data.data.cityColumn}, liActive);
				var tab_left = $("#tabhead tr");
				var tab_right = $("#tabcontent tr");
				tab_left.each(function(index,item){
					if(index == 0){
						$(item).find("td,th").outerHeight(tab_right.eq(0).find("td,th").outerHeight())
					}else{
						tab_right.eq(index).find("td,th").outerHeight($(item).outerHeight() - 1)
					}
				})
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