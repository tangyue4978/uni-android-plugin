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
var excelName;
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	
	excelName = self.item_excelName;
	plus.nativeUI.showWaiting("加载中...");
	obj_data.token = token;
	obj_data.tableName = self.item_tableName;
	obj_data.type = self.item_type;
	claerDetail(obj_data)
});

function claerDetail(obj) {
	console.log(excelName)
	console.log(JSON.stringify(obj))
	var _url = root + 'api/v3/collectdata/collect/tableShow';
	mui.ajax(_url, {
		data: obj_data,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			console.log(JSON.stringify(data))
			plus.nativeUI.closeWaiting();
			
			if (data.code == 1) {
				var head = data.data.head;
				var left = data.data.left;
				var body = data.data.body;
				var title = data.data.title;
				$('.content_titles').text(data.data.title)
				
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
				
				// 上左中
				if(left != ''){
					// 头部+主体部分
					var body_html = '';
					// 头部
					switch (excelName){
						case '1.1 全国水利信息化前期工作汇总表':
							// 主体
							$("#tabhead").append(head)
							$("#tabcontent").append(left)
							var init_tr_len = $('#tabcontent tr').length;
							var tr_length = 0;
							for(let i=0;i<init_tr_len;i++){
								var rowspan = $('#tabcontent tr').eq(i+tr_length).find('td').attr('rowspan');
								if(rowspan > 1){
									for(let j=0;j<rowspan;j++){
										var tr_index = i + tr_length + j;
										if(j == 0){
											body_html = '<td>'+body[tr_index].name+'</td><td>'+body[tr_index].releaseTime+'</td>'
											$('#tabcontent tr').eq(tr_index).append(body_html);
										}else{
											$('#tabcontent tr').eq(tr_index - 1).after('<tr><td>'+body[tr_index].name+'</td><td>'+body[tr_index].releaseTime+'</td></tr>')
										}
									}
									tr_length = parseInt(Number(tr_length) + (rowspan - 1));
								}else{
									body_html = '<td>'+body[(i+tr_length)].name+'</td><td>'+body[(i+tr_length)].releaseTime+'</td>'
									$('#tabcontent tr').eq(i+tr_length).append(body_html)
								}
							}
							break;
						case '1.5 年度新建项目及投资情况调查表':
							// 主体
							$("#tabhead").append(head)
							$("#tabcontent").append(left)
							var init_tr_len = $('#tabcontent tr').length;
							var tr_length = 0;
							for(let i=0;i<init_tr_len;i++){
								var rowspan = $('#tabcontent tr').eq(i+tr_length).find('td').attr('rowspan');
								if(rowspan > 1){
									for(let j=0;j<rowspan;j++){
										var tr_index = i + tr_length + j;
										if(j == 0){
											body_html = '<td>'+body[tr_index].projectName+'</td><td>'+body[tr_index].centreInvest+'</td><td>'+body[tr_index].placeInvest+'</td><td>'+body[tr_index].restInvest+'</td><td>'+body[tr_index].planTime+'</td><td>'+body[tr_index].isApprove+'</td>'
											$('#tabcontent tr').eq(tr_index).append(body_html);
										}else{
											$('#tabcontent tr').eq(tr_index - 1).after('<tr data-type="1"><td>'+body[tr_index].projectName+'</td><td>'+body[tr_index].centreInvest+'</td><td>'+body[tr_index].placeInvest+'</td><td>'+body[tr_index].restInvest+'</td><td>'+body[tr_index].planTime+'</td><td>'+body[tr_index].isApprove+'</td></tr>')
										}
									}
									tr_length = parseInt(Number(tr_length) + (rowspan - 1));
								}else{
									body_html = '<td>'+body[(i+tr_length)].projectName+'</td><td>'+body[(i+tr_length)].centreInvest+'</td><td>'+body[(i+tr_length)].placeInvest+'</td><td>'+body[(i+tr_length)].restInvest+'</td><td>'+body[(i+tr_length)].planTime+'</td><td>'+body[(i+tr_length)].isApprove+'</td>'
									$('#tabcontent tr').eq(i+tr_length).append(body_html)
								}
							}
							$('#tabcontent tr td,th').addClass('maxWidth');
							break;
						case '2.16 年度等级保护情况汇总表':
							// 主体
							$("#tabhead").append(head)
							$("#tabcontent").append(left)
							var init_tr_len = $('#tabcontent tr').length;
							var tr_length = 0;
							for(let i=0;i<init_tr_len;i++){
								var rowspan = $('#tabcontent tr').eq(i+tr_length).find('td').attr('rowspan');
								if(rowspan > 1){
									for(let j=0;j<rowspan;j++){
										var tr_index = i + tr_length + j;
										if(j == 0){
											body_html = '<td>'+body[tr_index].classify+'</td><td>'+body[tr_index].totalNum+'</td><td>'+body[tr_index].abarbeitung+'</td><td>'+body[tr_index].appraisal+'</td>'
											$('#tabcontent tr').eq(tr_index).append(body_html);
										}else{
											$('#tabcontent tr').eq(tr_index - 1).after('<tr data-type="1"><td>'+body[tr_index].classify+'</td><td>'+body[tr_index].totalNum+'</td><td>'+body[tr_index].abarbeitung+'</td><td>'+body[tr_index].appraisal+'</td></tr>')
										}
									}
									tr_length = parseInt(Number(tr_length) + (rowspan - 1));
								}else{
									body_html = '<td>'+body[(i+tr_length)].classify+'</td><td>'+body[(i+tr_length)].totalNum+'</td><td>'+body[(i+tr_length)].abarbeitung+'</td><td>'+body[(i+tr_length)].appraisal+'</td>'
									$('#tabcontent tr').eq(i+tr_length).append(body_html)
								}
							}
							$('#tabcontent tr td,th').addClass('maxWidth')
							break;
						default:
							break;
					}
					if(devInfo.h_w_pixel<=1.7){
						if(excelName == '1.5 年度新建项目及投资情况调查表'){
							$('.tables_head').before('<div class="fixed"></div>')
							setTimeout(function(){
								var absolute_htmlL = '';
								for(let j=0;j<$('#tabhead tr').length;j++){
									let thDomL = $('#tabhead tr').eq(j).find('th').eq(0);
									if($('#tabhead tr').eq(j).attr('data-type')) continue
									absolute_htmlL += '<div class="verCenter" style="width:'+thDomL.outerWidth()+'px;height:'+thDomL.outerHeight()+'px;border-bottom:1px solid #9A9A9A;">'+thDomL.html()+'</div>'
								}
								for(let i=0;i<$('#tabcontent tr').length;i++){
									let tdDomL = $('#tabcontent tr').eq(i).find('td').eq(0);
									if($('#tabcontent tr').eq(i).attr('data-type')) continue
									absolute_htmlL += '<div class="verCenter" style="width:'+tdDomL.outerWidth()+'px;height:'+(tdDomL.outerHeight()-0.35)+'px;border-bottom:1px solid #9A9A9A;">'+tdDomL.html()+'</div>'
								}
								$('.content_table .fixed').append(absolute_htmlL)
								// console.log($('.content_table .fixed').html())
							},500)
						}else if(excelName == '2.16 年度等级保护情况汇总表'){
							$('.tables_head').before('<div class="fixed"></div>')
							setTimeout(function(){
								var absolute_htmlL = '';
								for(let j=0;j<$('#tabhead tr').length;j++){
									let thDomL = $('#tabhead tr').eq(j).find('th').eq(0);
									if($('#tabhead tr').eq(j).attr('data-type')) continue
									absolute_htmlL += '<div class="verCenter" style="width:'+thDomL.outerWidth()+'px;height:'+(thDomL.outerHeight()-0.35)+'px;border-bottom:1px solid #9A9A9A;">'+thDomL.html()+'</div>'
								}
								for(let i=0;i<$('#tabcontent tr').length;i++){
									let tdDomL = $('#tabcontent tr').eq(i).find('td').eq(0);
									if($('#tabcontent tr').eq(i).attr('data-type')) continue
									absolute_htmlL += '<div class="verCenter" style="width:'+tdDomL.outerWidth()+'px;height:'+(tdDomL.outerHeight()+0.39)+'px;border-bottom:1px solid #9A9A9A;">'+tdDomL.html()+'</div>'
								}
								$('.content_table .fixed').append(absolute_htmlL)
								// console.log($('.content_table .fixed').html())
							},500)
						}
					}else{
						if(excelName !== '1.1 全国水利信息化前期工作汇总表')
						$('.tables_head').before('<div class="fixed"></div>')
						setTimeout(function(){
							var absolute_htmlL = '';
							for(let j=0;j<$('#tabhead tr').length;j++){
								let thDomL = $('#tabhead tr').eq(j).find('th').eq(0);
								if($('#tabhead tr').eq(j).attr('data-type')) continue
								absolute_htmlL += '<div class="verCenter" style="width:'+thDomL.outerWidth()+'px;height:'+thDomL.outerHeight()+'px;border-bottom:1px solid #9A9A9A;">'+thDomL.html()+'</div>'
							}
							for(let i=0;i<$('#tabcontent tr').length;i++){
								let tdDomL = $('#tabcontent tr').eq(i).find('td').eq(0);
								if($('#tabcontent tr').eq(i).attr('data-type')) continue
								absolute_htmlL += '<div class="verCenter" style="width:'+tdDomL.outerWidth()+'px;height:'+tdDomL.outerHeight()+'px;border-bottom:1px solid #9A9A9A;">'+tdDomL.html()+'</div>'
							}
							$('.content_table .fixed').append(absolute_htmlL)
							// console.log($('.content_table .fixed').html())
						},500)
					}
					
				}else{
					//上下
					var body_htmls = '';
					// 头部
					body_htmls = head;
					// 主体
					console.log(JSON.stringify(body))
					body.forEach( item =>{
						body_htmls += '<tr>'
						for(key in item){
							body_htmls += '<td>' + item[key] + '</td>'
						}
						body_htmls += '</tr>'
					})
					$('#tabcontent').html(body_htmls)
					$('.tables_head').before('<div class="fixed"></div>')
					if(excelName != '3.2 全国信息化监控系统及信息化监控点数量汇总表')
					if(devInfo.h_w_pixel<=1.7){
						setTimeout(function(){
							var absolute_html = '';
							for(let i=0;i<$('#tabcontent tr').length;i++){
								let thDom = $('#tabcontent tr').eq(i).find('th,td').eq(0);
								if($('#tabcontent tr').eq(i).attr('data-type')) continue
								absolute_html += '<div class="verCenter" style="width:'+thDom.outerWidth()+'px;height:'+(thDom.outerHeight()-0.4)+'px;">'+thDom.html()+'</div>'
							}
							// console.log(absolute_html)
							$('.content_table .fixed').append(absolute_html)
						},200)
					}else{
						setTimeout(function(){
							var absolute_html = '';
							for(let i=0;i<$('#tabcontent tr').length;i++){
								let thDom = $('#tabcontent tr').eq(i).find('th,td').eq(0);
								if($('#tabcontent tr').eq(i).attr('data-type')) continue
								absolute_html += '<div class="verCenter" style="width:'+thDom.outerWidth()+'px;height:'+thDom.outerHeight()+'px;">'+thDom.html()+'</div>'
							}
							// console.log(absolute_html)
							$('.content_table .fixed').append(absolute_html)
						},200)
					}
					
					
					
				}
				if(excelName != '7.1 全国水利物联网应用汇总表' && excelName != '7.2 全国水利云技术应用汇总表' && excelName != '7.3 全国水利大数据应用汇总表' && excelName != '7.4 全国水利移动应用汇总表'){
					if($('#tabcontent tr').eq(0).find('th').length >= 5 || $('#tabcontent tr').eq(3).find('td').length > 6){
						$('#tabcontent tr th,td').addClass('maxWidth')
					}
				}
				
			}
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
			console.log(type)
		}
	})
}