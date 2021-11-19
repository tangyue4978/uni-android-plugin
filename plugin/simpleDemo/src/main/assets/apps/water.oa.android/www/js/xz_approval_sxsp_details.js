var root = localStorage.getItem("str_url");
if(root == "" || root == undefined || root == null) {
	mui.openWindow({
		url: 'login.html?cid=1', //通过URL传参
		id: 'login.html?cid=1' //通过URL传参
	})
}
var token = localStorage.getItem("token");
var item_id, flow_id
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	console.log("id=" + self.item_id);
	console.log("item_type=" + self.item_type);
	//显示详情
	list( self.item_id ,self.item_type)
	
});
//监听语音下载
function onStateChanged(download, status) {
	if(download.state == 4 && status == 200){
		// 下载完成 
		$(this_self).text("正在播放...");
		plus.io.resolveLocalFileSystemURL( download.filename, function(entry){
			console.log("entry="+entry.toLocalURL());
			var _url = entry.toLocalURL();
			$(this_self).attr("data-local",_url);
			lcplayer = plus.audio.createPlayer(_url);
			lcplayer.play(function(e) {
				mui.toast("播放完成");   
				$(this_self).text("重新播放");
				$(this_self).attr("data-zt", 2);
			}, function(e) {
				mui.toast("播放异常");
				console.log("异常="+e.message);
			}, false);
		}, function(){
			
		})
		
	}  
}
// 创建下载任务
function createDownload(_this, _url) {
	var dtask = plus.downloader.createDownload(_url);
	dtask.addEventListener("statechanged", onStateChanged, false);
	dtask.start(); 
}
//流程播放
var lcplayer = null;
var this_self=null;
function lc_startPlay(_this, url) {
	//	alert(url);
	this_self=_this;
	var _url = localStorage.getItem("str_url") + url;
	console.log("网络地址_url="+_url);
	if($(_this).attr("data-local")==null||$(_this).attr("data-local")==undefined||$(_this).attr("data-local")==""){
		createDownload(_this, _url);
	}else{
		//已下载
		var _url = $(_this).attr("data-local"); 
		lcplayer = plus.audio.createPlayer(_url);
		
		if($(_this).attr("data-zt") == 1) {
			console.log(JSON.stringify(lcplayer));
			if(lcplayer) {
				lcplayer.stop();
				lcplayer = null;
			}
			//		 $(_this).attr("data-zt",2);
		} else {
			$(_this).text("正在播放...");
			$(_this).attr("data-zt", 1);
	
			lcplayer.play(function(e) {
				mui.toast("播放完成");   
				$(_this).text("重新播放");
				$(_this).attr("data-zt", 2);
			}, function(e) {
				mui.toast("播放异常");     
				console.log(e.message);    
			}, false);
		}
	}
}

function list(id,item_type) {
	var _url = root + 'api/matter/show';
	mui.ajax(_url, {
		data: {
			"token": token,
			"id": id,
			"is_show": item_type
		},
		datatype: 'json',
		type: 'post',
		success: function(data) {
			console.log("数据获取成功:"+JSON.stringify(data));
			var data = data.data;
			$(".mui-loading").css("display", "none")
			//基础信息
			$(".information").text(data.obj.name + '　' + data.obj.node + '　' + data.obj.time);
			$(".h2_bt").text(data.obj.title);
			$("#type_fr").text(data.obj.type);
			data.obj.sheet.forEach(function(item, index) {

				if(item.name == "附件") {
					//$("#item1 ul").append('<li class="fujian"><span>附件</span><div class="left div1"><i class="iconfont icon-wenjian"></i></div> <div class="left div2"> <p>附件.doc</p><span>5000kb</span></div> </li> ')
				} else {
					$("#item1 ul").append('<li><span>' + item.name + '</span><div class="gq_infor">' + item.value + '</div></li>')
				}
			})
			// 审查要点
			
			var scyd_node = data.reviewPoints;
			for (var i = 0; i < scyd_node.length; i++) {
				var scyd_html = "";
				var number = scyd_node[i].number;//序号
				var catalog = scyd_node[i].catalog;//提交材料
				var explain = scyd_node[i].explain;//说明
				var num = scyd_node[i].mainpoints.length;//
				var mainpoints = scyd_node[i].mainpoints;//审查要点
				var isComplete = scyd_node[i].isComplete;//是否齐全
				var mainpoints_cont = mainpoints[0].cont;
				var isComplete_list = isComplete[0].list;
				
				var label_tab = "";
				console.log("==============");
				isComplete[0].list.forEach(function(item,index){
					var checked_cd = (item.value == isComplete[0].active) ? true : false ;
					label_tab += `<label>
									<input type="radio" class="checked_cd" checked="${checked_cd}" name="${isComplete[0].name}" value="${item.value}"/>
									<span>${item.username}</span>
								</label>`;
				})
				
				scyd_html += `<tbody class="box_tbody">
								<tr>
									<td rowspan="${num}">${number}</td>
									<td rowspan="${num}">${catalog}</td>
									<td>${mainpoints_cont}</td>
									<td rowspan="${num}">${explain}</td>
									<td>`;
				scyd_html += label_tab;
				scyd_html += `</td></tr>`;
				if(num>1){
					
					for (var x = 1; x < num; x++) {
						var label_tab = "";
						isComplete[x].list.forEach(function(item,index){
							var checked_cd = (item.value == isComplete[0].active) ? true : false ;
							label_tab += `<label>
											<input type="radio" class="checked_cd" checked="${checked_cd}" name="${isComplete[x].name}" value="${item.value}"/>
											<span>${item.username}</span>
										</label>`;
						})
						var mainpoints_cont2 = mainpoints[x].cont;
						scyd_html += `<tr>
											<td>${mainpoints_cont2}</td>
											<td>`
						scyd_html += label_tab;
						scyd_html += `</td></tr>`;
					}
				}
				
				scyd_html +=`</tbody>`;
				$(".table_scyd").append(scyd_html);
			}
			// 初核信息
			
			var chxx_node = data.conditionsArr;
			var edit_status = data.conditionsArr.isDisabled == 1 ? "disabled = 'disabled'" : '' ;
			for (var i = 0; i < chxx_node.choices.length; i++) {
				var checked_status = chxx_node.choices[i].isChecked == 1 ? "checked = 'checked'" : '' ;
				var chxx_html =`<li class="chxx_li">
									<label class="chxx_label">
										<input class="chxx_input" type="checkbox" ${edit_status} ${checked_status} value="${chxx_node.choices[i].value}" />
										<span class="chxx_span">${chxx_node.choices[i].content}</span>
									</label>
								</li>`;
				$(".chxx_ul").append(chxx_html);
			}
			//收文签收
			if(data.isShowReceipt=='1'){
				var receiptArr = data.receiptArr;
				$(".receipt_ul").html("");
				if(receiptArr == ""||receiptArr == undefined||receiptArr == null) {
					$(".receipt_ul").append(
						'<li class="receipt_li">暂无信息</li>'
					)
				}else{
					receiptArr.forEach(function(item,index){
						var show_back = item.isBack;
						var show_opinion = item.isOpinion;
						if (show_back=="1") {
							var show_class = "back_show";
						} else{
							var show_class = "back_hidden";
						}
						if (show_opinion=="1") {
							var opinion_class = "back_show";
						} else{
							var opinion_class = "back_hidden";
						}
						$(".receipt_ul").append(
							'<li class="receipt_li">'+
								'<h3 class="p_h3">'+
									'<span class="p_s1">'+item.departmentName+'</span>'+
									'<span class="p_s2"></span>'+
									'<span class="p_s3 '+item.status_color+'">'+item.status+'</span>'+
								'</h3>'+
								'<p class="p_time">签收人　:'+item.receipter+'</p>'+
								'<p class="p_time">签收日期:'+item.receiptAt+'</p>'+
								'<p class="p_time '+opinion_class+'">申请退回:'+item.receiptOpinion+'</p>'+
								'<p class="p_time '+show_class+' back_box"><button id="btnBack" class="btn_back" onclick="agreeback('+item.id+')">同意退回</button></p>'+
							'</li>'
						)
					})
					
				}
				$(".receipt").show();
			}else{
				$(".receipt").hide();
			}
			
			//流程信息
			if(data.approvalRecords == "") {
				$(".process_ul").append(
					'<li class="process_li">暂无信息</li>'
				)
			} else {
				data.approvalRecords.forEach(function(item, index) {
					if(item.status == 1) {
						var str_color = " text-green";
					} else if(item.status == 2) {
						var str_color = " text-red";
					} else if(item.status == 3) {
						var str_color = " text-orange";
					} else {
						var str_color = " text-blue";
					}
					var html_voices = '';
					if(data.approvalRecords[index].voices != undefined && data.approvalRecords[index].voices != null && data.approvalRecords[index].voices != "") {
						data.approvalRecords[index].voices.forEach(function(item_v, index_v) {
							html_voices += '<p class="p_time" style="background-color:blue;border-radius:0.1rem;text-align:center;line-height:0.6rem;color:#ffffff;margin-bottom:0.15rem;" data-url="' + item_v.path + '" onclick="lc_startPlay(this,\'' + item_v.path + '\')">点击播放</p>';
						})
					}
					var opioion2 = "";
					if(item.opinion == null || item.opinion == undefined || item.opinion == "") {
						opioion2 = "";
					} else {
						opioion2 = item.opinion;
					}
					var html = "";
					html += '<li class="process_li">' +
						'<h3 class="p_h3">' +
						'<span class="p_s1">' + item.approver + '</span>';
					if(item.node.length <= 6) {
						
					html += '<span class="p_s2"> ' + item.department + " " + item.duty + '</span>'+
							'<span class="p_s3 ' + str_color + '">' + item.node + '</span>';
					}

					html += '</h3>';
					if(item.node.length > 6) {
						html += '<h3 class="p_h3">' +
							'<span class="p_s2"> ' + item.department + " " + item.duty + '</span>'+
							'<span class="p_s3 ' + str_color + '" style="flaot:right;">' + item.node + '</span>' +
							'</h3>';
					}
					html += '<p class="p_time">' + opioion2 + '</p>' + html_voices +
						'<p class="p_time">' + item.approve_at + '</p>' +
						'</li>';
					$(".process_ul").append(html)
				})
			}
			//文件属性
			var whetherOpens = data.whetherOpens;
			for(var prop in whetherOpens) {
				var status ="";
				if(whetherOpens[prop].status=="1"){
					status ="active"
				}else{
					status ="";
				}
				$(".whetherOpens_box .select_box .gklx").append('<li class="'+status+'" data-id="' + whetherOpens[prop].value + '">' + whetherOpens[prop].name + '</li>');
			}
			if($(".whetherOpens_box .select_box .gklx li.active").attr("data-id") == "3") {
				$(".secret").show();
			} else {
				$(".secret").hide();
			}
			//密级
			var classifications = data.classifications;
			for(var item in classifications) {
				var status ="";
				if(classifications[item].status=="1"){
					status ="active"
				}else{
					status ="";
				}
				$(".whetherOpens_box .select_box .miji").append('<li class="'+status+'" data-id="' + classifications[item].value + '">' + classifications[item].name + '</li>');
			}
			$(".whetherOpens_box .select_box .gklx li").on("click",r_active_gklx);
			$(".whetherOpens_box .select_box .miji li").on("click",r_active_xy);
			//会签
			var joinlyDepartmentArr = data.joinlyDepartmentArr;
			if(joinlyDepartmentArr!=""&&joinlyDepartmentArr!=undefined&&joinlyDepartmentArr!=null){
				for(var joinly in joinlyDepartmentArr) {
					var status ="";
					if(joinlyDepartmentArr[joinly].isSelected=="1"){
						status ="active"
					}else{
						status ="";
					}
					$(".jointly_sign_ul").append('<li class="'+status+'" data-id="' + joinlyDepartmentArr[joinly].value + '">' + joinlyDepartmentArr[joinly].name + '</li>');
					$(".csff_sign_ul").append('<li class="'+status+'" data-id="' + joinlyDepartmentArr[joinly].value + '">' + joinlyDepartmentArr[joinly].name + '</li>');
				}
				$(".jointly_sign_ul li").on("click",s_active);
				$(".csff_sign_ul li").on("click",s_active);
			}else{
				console.log("未获取到会签数据")
			}
			
			//选择节点
			if(data.isSelectNode != 0) {
				if(data.nextFlows==""||data.nextFlows==null||data.nextFlows==undefined){
					//mui.toast("节点为空");
				}else{
					$("#select_node").html("");
					data.nextFlows.forEach(function(item,index){
						$("#select_node").append('<option value="'+item.id+'" flowid="'+item.flow_id+'" approval_type="'+item.approval_type+'" sorting="'+item.sorting+'" ismany="'+item.is_many+'" isselectpeople="'+item.is_selectpeople+'">'+item.note+'</option>')
					})
					selectNode();
					$("#select_node").on("change",selectNode);
				}
				$(".selectNode").show();
			}else{
				$(".selectNode").hide();
//				$(".isListBox").hide();
			}
			function selectNode(){
				//是否显示下一步审批人
				if($("#select_node option:selected").attr("approval_type")=="1") {
					$(".csff_sign").show();
					if($("#select_node option:selected").attr("isselectpeople")=="1") {
						$(".isListBox").show();
					} else {
						$(".isListBox").hide();
					}
				}else{
					$(".csff_sign").hide();
					if($("#select_node option:selected").attr("isselectpeople")=="1") {
						$(".isListBox").show();
						var flow_id = $("#select_node option:selected").attr("flowid");
						var node_code = $("#select_node option:selected").attr("sorting");
						xyb_spr(flow_id,node_code);
					} else {
						$(".isListBox").hide();
					}
				}
				
			}
			//选择协助节点
			if(data.isAssist == true) {
				if(data.assistFlows==""||data.assistFlows==null||data.assistFlows==undefined){
					//mui.toast("节点为空");
				}else{
					$("#assistFlows").html("");
					$("#assistFlows").append('<option value="" flowid="" sorting="" ismany="" isselectpeople="0">不进行协助处理</option>')
					data.assistFlows.forEach(function(item,index){
						$("#assistFlows").append('<option value="'+item.id+'" flowid="'+item.flowId+'" sorting="'+item.sorting+'" ismany="'+item.isMany+'" isselectpeople="'+item.isSelectpeople+'">'+item.note+'</option>')
					})
					selectNode();
					$("#assistFlows").on("change",assistFlows);
				}
				$(".isAssist").show();
			}else{
				$(".isAssist").hide();
//				$(".isListBox").hide();
			}
			function assistFlows(){
				//是否显示下一步审批人
//				alert($("#assistFlows option:selected").attr("isselectpeople"));
				if($("#assistFlows option:selected").attr("isselectpeople")=="1") {
					$(".isListBox").show();
					var flow_id = $("#assistFlows option:selected").attr("flowid");
					var node_code = $("#assistFlows option:selected").attr("sorting");
					xyb_spr(flow_id,node_code);
				} else {
					$(".isListBox").hide();
				}
			}
			//console.log("pdf路径:" + data.obj.mainText);
			//查看正文
			//$("#item2").append('<div class="btn"><button onclick="chakanzhengwen(\'' + data.obj.mainText + '\')">查看正文</button></div>');
			// $("#item2").append('<div class="btn"><button onclick="seeFun(this)" data-href="'+data.obj.mainText+'" data-name="'+data.obj.mainName+'" data-ftype="'+data.obj.suffix+'">查看正文</button></div>');
			
			
			//主要附件
			console.log(JSON.stringify(data))
			var enclosure_atta = data.atta;
			console.log(JSON.stringify(enclosure_atta))
			if(enclosure_atta!=""&&enclosure_atta!=undefined&&enclosure_atta!=null){
				for(let i =0;i<enclosure_atta.length;i++){
					if(i == 0){$("#item2").append('<p class="title_enclosure">查看附件</p><ol class="ol_box"></ol>');}
					$("#item2 .ol_box").append('<li class="li_list"><p>'+enclosure_atta[i].name+'</p><a class="read" href="javascript:void(0);" data-href="'+enclosure_atta[i].url+'" data-name="'+enclosure_atta[i].name+'" data-ftype="'+enclosure_atta[i].suffix+'" onclick="seeFun(this)">查看</a></li>');
				}
			}
			//修改附件
			var edit_atta = data.updateAtta;
			if(edit_atta!=""&&edit_atta!=undefined&&edit_atta!=null){
				for(let i =0;i<edit_atta.length;i++){
					if($("#item2 .ol_box").length <=0){$("#item2").append('<p class="title_enclosure">查看附件</p><ol class="ol_box"></ol>');}
					$("#item2 .ol_box").append('<li class="li_list"><p>'+edit_atta[i].name+'</p><a class="read" href="javascript:void(0);" data-href="'+edit_atta[i].url+'" data-name="'+edit_atta[i].name+'" data-ftype="'+edit_atta[i].suffix+'" onclick="seeFun(this)">查看</a></li>')
				}
			}
				
			//通知书材料
			var notice_atta = data.noticeAtta;
			console.log(JSON.stringify(notice_atta))
			if(notice_atta!=""&&notice_atta!=undefined&&notice_atta!=null){
				for(let j =0;j<notice_atta.length;j++){
					console.log(notice_atta[j].name)
					console.log($("#item2 .ol_box").length);
					if($("#item2 .ol_box").length <=0){$("#item2").append('<p class="title_enclosure">查看附件</p><ol class="ol_box"></ol>');}
					$("#item2 .ol_box").append('<li class="li_list"><p>'+notice_atta[j].name+'</p><a class="read" href="javascript:void(0);" data-href="'+notice_atta[j].url+'" data-name="'+notice_atta[j].name+'" data-ftype="'+notice_atta[j].suffix+'" onclick="seeFun(this)">查看</a></li>')
				}
			}
					
			//选择文号
			if(data.numbersArr != undefined && data.numbersArr != null && data.numbersArr != "") {
				$("#symbol_input").html("");
				$("#year").val(data.numbersArr[0].year);
				$("#number_hao").val(data.numbersArr[0].number);
				data.numbersArr.forEach(function(item, index) {
					var selected="";
					if (item.isSelected=="1") {
						$("#year").val(item.year);
						$("#number_hao").val(item.number);
						selected='selected="selected"';
					}
					$("#symbol_input").append('<option value="'+item.name+'" data-id="'+item.value+'" data-year="'+item.year+'" data-number="'+item.number+'" '+selected+'>'+item.name+'</option>');
				})
				$("#symbol_input").on("change",function(){
					$("#year").val($("#symbol_input option:selected").attr("data-year"));
					$("#number_hao").val($("#symbol_input option:selected").attr("data-number"));
				})
				$(".symbol").show();
			} else {
				$(".symbol").hide();
			}
			
			/*
			 *控制显示不显示
			 */
			//是否显示审批
			if(data.isApprover == 1) {
				$(".approval").show();
			}else{
				$(".approval").hide();
			}
			//是否显示文件属性
			if(data.attribute != 0) {
				$(".isNeedToExamine").show();
			}else{
				$(".isNeedToExamine").hide();
			}
			
			//是否显示文号
			if(data.symbol != 0) {
				$(".symbol").show();
			}else{
				$(".symbol").hide();
			}
			//是否显示会签
			if(data.isJointly != 0) {
				$(".jointly_sign").show();
			}else{
				$(".jointly_sign").hide();
			}
			
			//是否审批意见
			if(data.isOpinion != 0) {
				$(".clyj_box").show();
				$(".clyj_box .btn_box .btn_span").on("click", function() {
					$(this).addClass("active");
					$(this).siblings().removeClass("active");
				})
			}else{
				$(".clyj_box").hide();
			}
			
			//是否显示会签审批意见
			if(data.isHandover != 0) {
				$(".isHandover").show();
				$(".isHandover .btn_box .btn_span").on("click", function() {
					$(this).addClass("active");
					$(this).siblings().removeClass("active");
				})
			}else{
				$(".isHandover").hide();
			}
			
			/*
			 *控制显示不显示
			 */
//			var self_this = plus.webview.currentWebview();
//			console.log("type_id==" + self_this.item_id + "==----==" + data.node);
//			if(self_this.item_id == 1) {
//				$(".clyj_box .btn_box").hide();
//			}
			// 提示信息
			if(data.remind !="" && data.remind != 'undefined'){
				$("#tips_item").html(data.remind);
				$("#tips_item").show();
			}else{
				$("#tips_item").hide();
			}
			//isJoint会审 //other处室
			var isJoint = $("#isJointExamination .radio_span.active").attr("data-status");
			var other = $("#otherDepartment .radio_span.active").attr("data-status");
			// 会审
			if(data.isJointExamination == 1){
				$("#isJointExamination").show();
			}else{
				$("#isJointExamination").hide();
			}
			
			// 处室
			if(data.otherDepartment == 1){
				$("#otherDepartment").show();
			}else{
				$("#otherDepartment").hide();
			}
		},
		error: function(xhr, type, errorThrown) {
			mui.toast("接口出错")
		}
	})

}


window.addEventListener('refresh', function(e) {
	//执行刷新
	location.reload();
});
//查看正文
function chakanzhengwen(url) {
	console.log("查看正文url:" + url);
	if(url == 0) {
		mui.toast("暂无数据");
		return false;
	}
	
	mui.openWindow({
		url: 'bumfDetailszhenwen.html', //通过URL传参
		id: 'bumfDetailszhenwen.html', //通过URL传参
		extras: {
			item_url: url
		}
	})
}


function r_active_xy() {
	$(this).attr("class", "active");
	$(this).siblings().attr("class", "");
}

function r_active_gklx() {
	$(this).attr("class", "active");
	$(this).siblings().attr("class", "");
	if($(this).attr("data-id") == "3") {
		$(".secret").show();
	} else {
		$(".secret").hide();
		$(".whetherOpens_box .select_box .miji li").attr("class","");
	}
}

function r_active() {
	$(".isListBox .select_box .select_ul li").attr("class", "");
	$(this).attr("class", "active");
}

function s_active() {
	if($(this).hasClass("active")) {
		$(this).removeClass("active");
	} else {
		$(this).addClass("active");
	}
}
 
//显示下一步审批人
function xyb_spr(flow_id,node_code) {
	var flow_id = flow_id;
	var node_code = node_code;
	var root = localStorage.getItem("str_url");
	var _url = root + 'api/document/getapproveuser';
	mui.ajax(_url, {
		data: {
			"token": token,
			"flow_id": flow_id,
			"node_code": node_code
		},
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型 
		success: function(data) {
			console.log("审批人数据：" + JSON.stringify(data));
			$(".isListBox .select_box").html("");
			if(data.data.list == "" || data.data.list == undefined || data.data.list == null) {
				$(".isListBox .select_box").append('<p>暂无信息</p>');
			} else {
				var html="";
				data.data.list.forEach(function(v, index) {
					html+='<p>'+v.departmentName+'</p><ul class="select_ul">';
						data.data.list[index].users.forEach(function(v2, index2) {
							html+='<li class="" data-id="' + v2.id + '">' + v2.trueName + '</li>';
						})
					html+='</ul>';
				})
				$(".isListBox .select_box").append(html);
			}
			if($("#select_node option:selected").attr("ismany") == 1) {
				//单选
				$(".isListBox .select_box .select_ul li").off("click", r_active);
				$(".isListBox .select_box .select_ul li").on("click", r_active);
			} else {
				//多选
				$(".isListBox .select_box .select_ul li").off("click", s_active);
				$(".isListBox .select_box .select_ul li").on("click", s_active);
			}
		},
		error: function(xhr, type, errorThrown) {
			console.log("xhr=" + JSON.stringify(xhr) + ";type=" + type + ";errorThrown=" + errorThrown);
			mui.toast(errorThrown)
		}
	})
}

$("#submit .button").on("click", submit_fun)

function submit_fun() {
	var w = plus.nativeUI.showWaiting("等待中...");
	var _url = root + 'api/matter/handle';
	var self = plus.webview.currentWebview();
	var autio_arr = [];
	for(var i = 0; i < $(".play_list_box .play_recording_centent").length; i++) {
		autio_arr.push($(".play_list_box .play_recording_centent").eq(i).attr("data-url"));
	}

	var autio = $(".play_list_box .play_recording_centent").attr("data-url");
	var autio_str_status = $(".img_box").attr("data-status");
	console.log("autio=" + autio + ";self.item_id=" + self.item_id);
	if(autio_str_status == 1) {
		mui.toast("请先停止录音！");
		plus.nativeUI.closeWaiting();
		return false;
	}
	
	//下一步审批人
	if($(".isListBox .select_box .select_ul li.active").attr("data-id") == undefined) {
		var spr_str_id = "";
	} else {
		var spr_obj = $(".isListBox .select_box .select_ul li.active");
		//		var spr_str_id = $(".isListBox .select_box .select_ul li.active").attr("data-id");
		var spr_str_id = [];
		for(var i = 0; i < spr_obj.length; i++) {
			spr_str_id.push(spr_obj.eq(i).attr("data-id"));
		}
	}
	console.log("下一步审批人=" + spr_str_id);


	//审批意见/同意驳回
	
	var option_yj=$(".approval .clyj_box .textarea").val();
	var submit_status = $(".clyj_box .btn_box .btn_span.active").attr("data-status");
	
	//节点
	if ($("#select_node option:selected").attr("sorting")!=""&&$("#select_node option:selected").attr("sorting")!=null&&$("#select_node option:selected").attr("sorting")!=undefined) {
		var node = $("#select_node option:selected").attr("sorting");
	} else{
		var node = "";
	}
	//协助节点
	if ($("#assistFlows option:selected").attr("sorting")!=""&&$("#assistFlows option:selected").attr("sorting")!=null&&$("#assistFlows option:selected").attr("sorting")!=undefined) {
		var assist = $("#assistFlows option:selected").attr("sorting");
	} else{
		var assist = "";
	}
	// 初核id
	if($(".chxx_box .chxx_input:checked").length == 0){
		var conditions_id = "";
	}else{
		var conditions_item = $(".chxx_box .chxx_input:checked");
		var conditions_id = [];
		for (var i = 0; i < conditions_item.length; i++) {
			conditions_id.push(conditions_item.eq(i).val());
		}
		console.log(conditions_id);
	}
	var isJointExamination = $("#isJointExamination .radio_span.active").attr("data-status");
	var otherDepartment = $("#otherDepartment .radio_span.active").attr("data-status");
	var data_box = {
		"token": token, 													// 用户令牌
		"id": self.item_id, 												// 申请类型 1 收文 2 发文 6 电话通知
		"node":	node,														// 选择的节点
		"next": String(spr_str_id), 										// 下一步审批人
		"submit": submit_status,											// 提交状态 1 同意 2 驳回
		"opinion": option_yj, 												// 审批意见
		"conditions": String(conditions_id),								// 初核id
		"assist": assist,													// 协助节点
		"voices": autio_arr,												// 语音
		"joint_examination":isJointExamination,							// 会审
		"other_department":otherDepartment									// 处室
	}
	
	console.log(JSON.stringify(self));
	console.log(JSON.stringify(data_box));
	
	mui.ajax(_url, {
		data: data_box,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			console.log("返回值=" + JSON.stringify(data));
			mui.toast(data.msg);
			if(data.code == 1) {
				location.reload();
			}
			plus.nativeUI.closeWaiting();
		},
		error: function(xhr, type, errorThrown) {
			console.log(xhr+"----"+type+"----"+errorThrown);
			mui.toast(errorThrown);
			plus.nativeUI.closeWaiting();
		}
	})
}


//申请退回
function agreeback(id){
	var w = plus.nativeUI.showWaiting("等待中...");
	var _url = root + 'api/document/agreeback';
	var _id = id;
	mui.ajax(_url, {
		data: {
			"token": token,
			"id": _id
		},
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			mui.toast(data.msg);
			plus.nativeUI.closeWaiting();
			location.reload();
		},
		error: function(xhr, type, errorThrown) {
			console.log(xhr+"----"+type+"----"+errorThrown);
			mui.toast(errorThrown);
			plus.nativeUI.closeWaiting();
		}
	})
}

//查看附件
function seeFun(self){
	plus.nativeUI.showWaiting();
	var _href = $(self).attr("data-href");
	console.log("===============================");
	console.log(_href);
	if(_href == ""||_href == 0||_href == 'undefined') {
		plus.nativeUI.closeWaiting();
		mui.toast("暂无数据");
		return false;
	}
	if(_href.indexOf("http") == -1){
		_href = root.slice(0,root.length - 1) + _href
	}
	var _name = $(self).attr("data-name");
	var type=$(self).attr("data-ftype");
	console.log(type)
	switch (type){
		case "pdf":
		case "PDF":
			chakanzhengwen(_href);
			plus.nativeUI.closeWaiting();
			break;
		case "png":
		case "jpg":
		case "jpeg":
		case "gif":
		case "PNG":
		case "JPG":
		case "JPEG":
		case "GIF":
			var img_preview = $("body div.img_preview");
			if(img_preview.length<1){
				$("body #item2").append("<div class='img_preview'><div/>");
			}else{}
			$("body #item2 div.img_preview").html("<img class='preview_src' src='"+_href+"' style='width:90%;'/>");
			$("body #item2 div.img_preview").css("top",$(".pp").outerHeight()+"px");
			var img_preview_height= $(window).height() - $(".pp").outerHeight();
			$("body #item2 div.img_preview").css("height",img_preview_height+"px");
			console.log(img_preview_height);
			setTimeout(function(){
				var preview_src_height= $("body #item2 div.img_preview .preview_src").outerHeight();
				$("body #item2 div.img_preview .preview_src").css("top",((img_preview_height - preview_src_height)/2)+"px");
			},100)
			$("body #item2 div.img_preview").fadeIn();
			plus.nativeUI.closeWaiting();
			$("body #item2 div.img_preview").one("click",function(){$(this).hide()});
			break;
		default:
			createEnclosureDownload(_href,_name,type)
			break;
	}
}

//监听附件下载
function onEnclosureStateChanged(download, status) {
	if(download.state == 4 && status == 200){
		plus.io.resolveLocalFileSystemURL( download.filename, function(entry){
			var _url = entry.toLocalURL();
			if (mui.os.ios) {
		 		plus.runtime.openFile(download.filename,{},function(e){
			 		mui.toast(JSON.stringify(e))
			 	});
		 	} else{
		 		plus.runtime.openFile(_url,{},function(e){
			 		mui.toast(JSON.stringify(e))
			 	});
		 	}
			plus.nativeUI.closeWaiting();
		}, function(e){
			console.log(JSON.stringify(e));
			mui.toast("文件获取失败");
			plus.nativeUI.closeWaiting();
		})
	}
	console.log(download.filename+"--------------------"+download.url);
}
// 附件下载
function createEnclosureDownload( _url,_name,type) {
	var filename = '';
	if(_name.indexOf('.') == -1){
		filename = "_doc/download/"+new Date().getFullYear()+(new Date().getMonth()+1)+new Date().getDate()+"/"+_name + '.' + type;
		console.log(filename)
	}else{
		filename = "_doc/download/"+new Date().getFullYear()+(new Date().getMonth()+1)+new Date().getDate()+"/"+_name;
	}
	plus.io.resolveLocalFileSystemURL( filename, function(entry){
	 	var _url = entry.toLocalURL();
	 	console.log("获取成功:目录地址为:"+_url);
	 	//mui.alert(_url,_name+"文件地址");
	 	if (mui.os.ios) {
	 		plus.runtime.openFile(filename,{},function(e){
		 		mui.toast(JSON.stringify(e))
		 	});
	 	} else{
	 		plus.runtime.openFile(_url,{},function(e){
		 		mui.toast(JSON.stringify(e))
		 	});
	 	}
	 	
	 	plus.nativeUI.closeWaiting();
	 }, function(){
	 	console.log("获取失败");
	 	var dtask = plus.downloader.createDownload(_url,{filename:filename});
		dtask.addEventListener("statechanged", onEnclosureStateChanged, false);
		plus.nativeUI.showWaiting("下载中...");
		dtask.start(); 
	})
}
