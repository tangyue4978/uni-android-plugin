		var root = localStorage.getItem("str_url");
		if(root == "" || root == undefined || root == null){
				mui.openWindow({
				url: 'login.html?cid=1', //通过URL传参
				id: 'login.html?cid=1', //通过URL传参
			})
		}
		var token = localStorage.getItem("token");
		var obj_data = {};
		mui.plusReady(function() {
			var self = plus.webview.currentWebview();
			plus.nativeUI.showWaiting("加载中...");
			
			obj_data.token = token;
			obj_data.id = self.item_id;

			vailageDetail(obj_data);
		});
		function vailageDetail(obj_data) {
			console.log(JSON.stringify(obj_data));
			var _url = root + 'api/v3/licence/getlicencesShow';
			console.log(_url);
			mui.ajax(_url, {
				data: obj_data,
				datatype: 'json', //服务器返回json格式数据
				type: 'post', //HTTP请求类型
				success: function(data) {
					plus.nativeUI.closeWaiting();
					console.log('12121212');
					console.log("----------"+JSON.stringify(data));
					if(data.code == 1) {
						$('.head_texts').text(data.data.show.name);
						var item_html = ''; 
						
						var head_html = '<div class="head_text head_texts">'+ data.data.show.name+
						'</div>'+
						'<div class="head_line"></div>'+
						'<div class="head_text">';
						data.data.show.type.forEach(function(item,index) {
							head_html += item;
						})
						head_html += '</div>'
						
						$('.head').append(head_html);
						
						var item_data= data.data.basic;
						for (var index = 0; index < item_data.length; index++) {
							var item = item_data[index];
							// console.log("----------"+JSON.stringify(item_data));
							item_html +="<tr><td class='texr'>"+item.name+"</td>"+"<td class='texl'>"+item.value+"</td></tr>";
						}
						$(".base_info_table").html(item_html);
						
						$("#year_zong_qsl").text(data.data.message.gross);
						$("#day_qsl").text(data.data.message.today_amount);
						$("#month_qsl").text(data.data.message.month_amount);
						$("#year_qsl").text(data.data.message.year_amount);
						$(".waterUse_th").html('<td>'+data.data.message.within+'</td>'+
								'<td>'+data.data.message.outer+'</td>'+
								'<td>'+data.data.message.up+'</td>'+
								'<td>'+data.data.message.down+'</td>');
						$(".mui-loading").css("display", "none")
					}else{
						plus.nativeUI.toast(data.msg)
					}
				},
				error: function(xhr, type, errorThrown) {
					console.log(errorThrown)
					plus.nativeUI.closeWaiting();
				}
			})
		}