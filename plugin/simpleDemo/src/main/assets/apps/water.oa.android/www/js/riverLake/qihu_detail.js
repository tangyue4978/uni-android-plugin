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
var obj_data = {};
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	plus.nativeUI.showWaiting("加载中...");
	obj_data.token = token;
	obj_data.id = self.item_id;
	claerDetail(obj_data)
});
var obj_info={objname:[],objdateils:[]}
function claerDetail(obj) {
	console.log(JSON.stringify(obj))
	var _url = root + 'api/v3/riverchief/sevenriverfivelake/show';
	mui.ajax(_url, {
		data: {
			"token": token,
			"id": obj.id,
			"type":1
		},
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			console.log(JSON.stringify(data))
			plus.nativeUI.closeWaiting();
			
			if (data.code == 1) {
				//详情标题
				var title = data.data;
				$('.head_texts').text(title.name);
				$('.head_desc').text(title.area);


				//基础信息?????
				
				//详情标题head_texts
				// $('.head_texts').text(data.name);
				// $('.head_desc').text(data.area);

				//概述
				if(data.data.outline != null && data.data.outline != "" && data.data.outline != "undefined" ){
					$('.deal_with_text1').text(data.data.outline)
				}else{
					$('#gs').hide();
				}
				
				// 循环显示
				var subLine = data.data.subLine;
				for (var i = 0; i < subLine.length; i++) {
					var newsubline = subLine[i];
					for (let key in newsubline) {
						obj_info.objname.push(key);
						obj_info.objdateils.push(newsubline[key]);
						if(subLine.length>1){
							if(i==0){
								$(".option_tab").append('<span class="option_span active" data-tab="'+i+'">'+key+'</span>');
							}else{
								$(".option_tab").append('<span class="option_span" data-tab="'+i+'">'+key+'</span>');
							}
							$(".option_tab").css("display","block");
						}else{
								$(".option_tab").css("display","none");
						}
					}
				}
				addBaseInfo(obj_info.objdateils[0])
			}
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
}

// tab切换
$("body").on("click",".option_tab .option_span",function(){
	$(".option_tab .option_span").removeClass("active");
	$(this).addClass("active");
	var index = $(this).index();
	var tabdata = obj_info.objdateils[index];
	addBaseInfo(tabdata);
})
//显示对应数据
function addBaseInfo(data){
	console.log(JSON.stringify(data));
	var baseInfo = data.baseInfo;
	console.log(JSON.stringify(baseInfo))
	console.log(data.basinReservoir.length)
	
	// 概述
	if(data.outline != null  && data.outline != "" && data.outline != "undefined" ){
		console.log(data.outline)
		var item_outline = data.outline;
		var base_img_info = `<div class="base_info_title">
								<div class="base_info_title_line"></div>
								<span class="base_info_title_text">
									概述
								</span>
							</div>
							<div class="deal_photo_text">
								${item_outline}
							</div>`;
					$('#base_info_outline').html(base_img_info);
					$("#base_info_outline").parent(".base_info").css("display","block");
	}else{
		$('#base_info_outline').html("");
		$("#base_info_outline").parent(".base_info").css("display","none");
	}
	//基本信息
	$('#base_info_table').html("");
	for (var i = 0; i < baseInfo.length; i++) {
		$('#base_info_table').append(
			`<tr>
				<td class="texr">${baseInfo[i].name} </td>
				<td class="texl">${baseInfo[i].value} </td>
			</tr>`
		)
	}
	//流域水库
	console.log(JSON.stringify(data.basinReservoir))
	$('#sk_info_table').html("");
	var sk_info_html = '';
	for (var i = 0; i < data.basinReservoir.length; i++) {
		if(i == 1){
			sk_info_html += '<tr><td class="texr" rowspan="2">' + data.basinReservoir[i].name +
			'</td><td class="texl">' + data.basinReservoir[i].value[0] + 
			'</td></tr><tr><td class="texl">'+data.basinReservoir[i].value[1] +'</td></tr>'
		}else{
			sk_info_html += '<tr><td class="texr">' + data.basinReservoir[i].name + 
			'</td><td class="texl">' + data.basinReservoir[i].value + '</td></tr>'
		}
	}
	$('#sk_info_table').append(sk_info_html)
	//干流流经市县
	$('#glljsx_info_table_head').html("");
	$('#glljsx_info_table_content').html(`<tr>
		<td class="texr text-center">市</td>
		<td class="texr text-center">县(市、区)数量</td> 
		<td class="texr text-center">县(市、区)</td>
	</tr>`);
	$('#glljsx_info_table_head').append(
		`<tr>
			<td class="texr">${data.flowThrough[0].name} </td>
			<td class="texl">${data.flowThrough[0].value} </td>
		</tr>`
	)
	for (var i = 1; i < data.flowThrough.length; i++) {
		$('#glljsx_info_table_content').append(
			`<tr>
				<td class="texl text-center">${data.flowThrough[i].name} </td>
				<td class="texl text-center">${data.flowThrough[i].value} </td>
				<td class="texl">${data.flowThrough[i].desc} </td>
			</tr>`
		)
	}
	
	//流域流经市县
	$('#lybhsx_info_table_head').html("");
	$('#lybhsx_info_table_content').html(`<tr>
		<td class="texr text-center">市</td>
		<td class="texr text-center">县(市、区)数量</td>
		<td class="texr text-center">县(市、区)</td>
	</tr>`);
	$('#lybhsx_info_table_head').append(
		`<tr>
			<td class="texr">${data.contain[0].name} </td>
			<td class="texl">${data.contain[0].value} </td>
		</tr>`
	)
	for (var i = 1; i < data.contain.length; i++) {
		$('#lybhsx_info_table_content').append(
			`<tr>
				<td class="texl text-center">${data.contain[i].name} </td>
				<td class="texl text-center">${data.contain[i].value} </td>
				<td class="texl">${data.contain[i].desc} </td>
			</tr>`
		)
	}
	//重要支流
	
	
	//流域图片
	if(data.basinImg != null  && data.basinImg != "" && data.basinImg != "undefined" ){
		console.log(data.basinImg)
		var item_img = '';
		for (var i = 0; i < data.basinImg.length; i++) {
			item_img += `<img src="${data.basinImg[i]}" class="deal_photo_text_img">`;
		}
		var base_img_info = `<div class="base_info_title">
								<div class="base_info_title_line"></div>
								<span class="base_info_title_text">
									流域图片
								</span>
							</div>
							<div class="deal_photo_text">
								${item_img}
							</div>`;
					$('#base_info_img').html(base_img_info);
	}else{
		$('#base_info_img').html("");
	}
	
	// 相关规划
	if(data.plan != null  && data.plan != "" && data.plan != "undefined" ){
		console.log(data.plan)
		var item_plan = data.plan;
		var base_img_info = `<div class="base_info_title">
								<div class="base_info_title_line"></div>
								<span class="base_info_title_text">
									相关规划
								</span>
							</div>
							<div class="deal_photo_text">
								${item_plan}
							</div>`;
					$('#base_info_plan').html(base_img_info);
	}else{
		$('#base_info_plan').html("");
	}
}