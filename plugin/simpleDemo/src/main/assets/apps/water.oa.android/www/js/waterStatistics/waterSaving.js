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
	data_info.type = 7;
	data_info.search_status = 0;//控制条件查询 0插入条件，否则不插入;
	
	
	picker.pickers[0].setSelectedIndex(4, 2000);
	list(data_info);
});

function list(data_info) {
	console.log(JSON.stringify(data_info));
	var _url = root + 'api/v3/yearbooks/';
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
				// 数据来源start
				$('.main_source').html(data.data.source);
				// 数据来源end
				$(".river_lake_title_l #text1").html(data.data.title);
				$(".river_lake_title_l #text2").html(data.data.pie.series[0].name);
				$(".river_lake_title_l #text3").html(data.data.cityColumn.series[0].name);
				$(".river_lake_title_r").html(data.data.unit);
				
				// 表格重排
				let leftTable2 = '';
				let leftTable1 = '';
				let rightTable1 = '';
				let rightTable2 = '';
				leftTable1 += '<tr><th >单位</th></tr>'
				$('#left_table1').append(leftTable1)
				rightTable1 += data.data.head
				$('#right_table1').html('');
				$('#right_div1 #right_table1').append(rightTable1)
				$('#right_div1 #right_table1 tr').eq(0).find('th').eq(0).remove()
				$('#left_table2').html('');
				var listdata = data.data.body;
				$("#right_table3").html('');
				listdata.forEach(function(item, index) {
					rightTable3 = '<tr>';
					leftTable2 = '<tr>';
					item.forEach(function(td, index) {
						if (index !== 0) {
							rightTable3 += '<td>' + td + '</td>';
						}else{
							leftTable2 += '<td>' + td + '</td>';
						}
					});
					rightTable3 += '</tr>';
					leftTable2 += '</tr>'
					$("#right_table3").append(rightTable3);
					$('#left_table2').append(leftTable2)
				});
				document.querySelector("#muiPicker").addEventListener("tap", function() {
					picker.show(function(SelectedItem) {
						$("#muiPicker").text(SelectedItem[0].text);
						data_info.year = SelectedItem[0].value;
						console.log(data_info.year)
						list(data_info);
						$("#right_table3").html('');
					})
				});
				// 表格重排end
				
				picker.setData(data.data.year)
				for(let i = 0;i<data.data.year.length;i++){
					if(data_info.year == ''){
							$("#muiPicker").text(data.data.year[0].value+'年')
										
					}else{
							picker.pickers[0].setSelectedValue(data_info.year);
					}
				}
				
				pie(data.data.pie);
				column(data.data.column);
				$(".tab_li li").bind("click",{column: data.data.column, cityColumn: data.data.cityColumn}, liActive);
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