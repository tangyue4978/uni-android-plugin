var root = localStorage.getItem("str_url");
if(root == "" || root == undefined || root == null) {
	mui.openWindow({
		url: 'login.html?cid=1', //通过URL传参
		id: 'login.html?cid=1' //通过URL传参
	})
}
var token = localStorage.getItem("token");
var item_id, flow_id, parent;
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	//显示详情
	list(self.item_id, self.item_parent);
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

function list(type_id, parent) {
	var _url = root + 'api/documentreceipt/show';
	mui.ajax(_url, {
		data: {
			"token": token,
			"item_id": type_id,
			"parent" : parent
		},
		datatype: 'json',
		type: 'post',
		success: function(data) {
			console.log("数据获取成功:"+JSON.stringify(data));
			var data = data.data;
			$(".mui-loading").css("display", "none")
			//基础信息
			if(data.obj==""||data.obj==null||data.obj==undefined){
				mui.toast("收文基础信息为空")
				return false;
			}
			$(".information").text(data.obj.name + '　' + data.obj.duty + '　' + data.obj.time);
			$(".h2_bt").text(data.obj.title);
			$("#type_fr").text(data.obj.type);
			data.obj.sheet.forEach(function(v, index) {

				if(v.name == "附件") {
					//$("#item1 ul").append('<li class="fujian"><span>附件</span><div class="left div1"><i class="iconfont icon-wenjian"></i></div> <div class="left div2"> <p>附件.doc</p><span>5000kb</span></div> </li> ')
				} else {
					$("#item1 ul").append('<li><span>' + v.name + '</span><div class="gq_infor">' + v.value + '</div></li>')
				}
			})
			
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
						'<span class="p_s1">' + item.approver + '</span>' +
						'<span class="p_s2"> ' + item.department + " " + item.duty + '</span>';
					if(item.node.length <= 6) {
						html += '<span class="p_s3 ' + str_color + '">' + item.node + '</span>';
					}

					html += '</h3>';
					if(item.node.length > 6) {
						html += '<h3 class="p_h3" style="text-align:right;">' +
							'<span class="p_s3 ' + str_color + '" style="float:none;">' + item.node + '</span>' +
							'</h3>';
					}
					html += '<p class="p_time">' + opioion2 + '</p>' + html_voices +
						'<p class="p_time">' + item.approve_at + '</p>' +
						'</li>';
					$(".process_ul").append(html)
				})
			}
			//选择节点
			if(data.isSelectNode != 0) {
				if(data.nextFlows==""||data.nextFlows==null||data.nextFlows==undefined){
					//mui.toast("节点为空");
				}else{
					$("#select_node").html("");
					data.nextFlows.forEach(function(item,index){
						$("#select_node").append('<option value="'+item.id+'" flowid="'+item.flow_id+'" submit_text="'+item.submit_text+'" sorting="'+item.sorting+'" ismany="'+item.is_many+'" isselectpeople="'+item.is_selectpeople+'">'+item.note+'</option>')
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
				if($("#select_node option:selected").attr("isselectpeople")=="1") {
					$(".isListBox").show();
					var flow_id = $("#select_node option:selected").attr("flowid");
					var node_code = $("#select_node option:selected").attr("sorting");
					xyb_spr(flow_id,node_code);
					$("#submit .button").text($("#select_node option:selected").attr("submit_text"));
				} else {
					$(".isListBox").hide();
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
						$("#assistFlows").append('<option value="'+item.id+'" flowid="'+item.flowId +'" submit_text="'+item.submit_text+'" sorting="'+item.sorting+'" ismany="'+item.isMany+'" isselectpeople="'+item.isSelectpeople+'">'+item.note+'</option>')
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
//			console.log("pdf路径:" + data.obj.mainText);
			//查看正文
			//$("#item2").append('<div class="btn"><button onclick="chakanzhengwen(\'' + data.obj.mainText + '\')">查看正文</button></div>');
			$("#item2").append('<div class="btn"><button onclick="seeFun(this)" data-href="'+data.obj.mainText+'" data-name="'+data.obj.mainName+'" data-ftype="'+data.obj.suffix+'">查看正文</button></div>');
			
			//查看附件
			var enclosure_atta = data.atta;
			if(enclosure_atta!=""&&enclosure_atta!=undefined&&enclosure_atta!=null){
				for(var i =0;i<enclosure_atta.length;i++){
					if(i == 0){$("#item2").append('<p class="title_enclosure">查看附件</p><ol class="ol_box"></ol>');}
					$("#item2 .ol_box").append('<li class="li_list"><p>'+enclosure_atta[i].name+'</p><a class="read" href="javascript:void(0);" data-href="'+enclosure_atta[i].url+'" data-name="'+enclosure_atta[i].name+'" data-ftype="'+enclosure_atta[i].suffix+'" onclick="seeFun(this)">查看</a></li>');
				}
			}
			
			
			/*
			 *控制显示不显示
			 */
			//是否显示审批
			if(data.isApprover == 1) {
				$(".approval").show();
			}else{
				$(".approval").hide();
				//isBack是否可以申请退回 1 是 0 否
				if(data.isBack==1){
					$(".approval").show();
					$(".approval .selectNode").hide();
					$(".approval .isAssist").hide();
					$(".approval .isListBox").hide();
					$(".approval .clyj_box").show();
					$("#submit").html('<button class="button" style="background-color:red;" data-status="4">申请退回</button><button class="button" data-status="5" style="margin-left: 2%;">办结</button>');
					$("#submit").css({"text-align":"center"});
					$("#submit .button").css({"width":"48%","height":"0.8rem","line-height":"0.8rem"});
				}
			}
			
			//是否审批意见
			if(data.isOpinion != 0) {
				$(".clyj_box").show();
				//$(".clyj_box .btn_box .btn_span").on("click", function() {
					//$(this).addClass("active");
					//$(this).siblings().removeClass("active");
				//})
			}else{
				$(".clyj_box").hide();
			}
			
			/*
			 *控制显示不显示 end
			 */
			
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

$("#submit").on("click",".button", submit_fun)

function submit_fun() {
	var w = plus.nativeUI.showWaiting("等待中...");
	var _url = root + 'api/documentreceipt/handle';
	var self = plus.webview.currentWebview();
	var autio_arr = [];
	for(var i = 0; i < $(".play_list_box .play_recording_centent").length; i++) {
		autio_arr.push($(".play_list_box .play_recording_centent").eq(i).attr("data-url"));
	}

	var autio = $(".play_list_box .play_recording_centent").attr("data-url");
	var autio_str_status = $(".img_box").attr("data-status");
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
		var spr_str_id = [];
		for(var i = 0; i < spr_obj.length; i++) {
			spr_str_id.push(spr_obj.eq(i).attr("data-id"));
		}
	}
	
	//节点
	if ($("#select_node option:selected").attr("sorting")!=""&&$("#select_node option:selected").attr("sorting")!=null&&$("#select_node option:selected").attr("sorting")!=undefined) {
		var node = $("#select_node option:selected").attr("sorting");
	} else{
		var node = "";
	}
	//审批意见
	if ($(".approval .clyj_box .textarea").val()!=""&&$(".approval .clyj_box .textarea").val()!=null&&$(".approval .clyj_box .textarea").val()!=undefined) {
		var option_yj=$(".approval .clyj_box .textarea").val();
	} else{
		var option_yj="";
	}
	
	//协助节点
	//if ($("#assistFlows option:selected").attr("sorting")!=""&&$("#assistFlows option:selected").attr("sorting")!=null&&$("#assistFlows option:selected").attr("sorting")!=undefined) {
		//var assist = $("#assistFlows option:selected").attr("sorting");
	//} else{
		//var assist = "";
	//}
	//申请退回 4 办结 5
	var _status = $(this).attr("data-status")
	if(_status!=""&&_status!=null&&_status!=undefined){
		var summit_status=_status;
	}else{
		var summit_status="";
	}
	// 是否发送短信
	if($("#send_msm_checkbox").prop("checked")){
		var isSendSms = 1;
		var userPhone = "";
		var phoneSMS = $(".phone_text_box .phone_text");
		for (var i = 0; i < phoneSMS.length; i++) {
			if(i>0){
				userPhone+=",";
			}
			userPhone+=phoneSMS.eq(i).attr("data-id")+":"+phoneSMS.eq(i).val()
		}
	}else{
		var isSendSms = 0;
		var userPhone = "";
	}
	console.log("token=" + token);
	console.log("self.item_id=" + self.item_id);
	console.log("parent=" + self.item_parent );
	console.log("voices=" + autio_arr);
	console.log("next=" + String(spr_str_id));
	console.log("node=" + node);
	console.log("opinion=" + option_yj);
	console.log("submit=" + summit_status);
	console.log("isSendSms=" + isSendSms);
	console.log("userPhone=" + userPhone);
	mui.ajax(_url, {
		data: {
			"token": token, 													// 用户令牌
			"item_id": self.item_id, 											// 申请类型 1 收文 2 发文 6 电话通知
			"parent": self.item_parent, 												// 申请类型 1 收文 2 发文 6 电话通知
			"voices": autio_arr, 												// 语音
			"next": String(spr_str_id),										// 下一步审批人
			"node":	node,														// 选择的节点
			//"assist": assist,													// 提交状态 1 同意 2 驳回
			"opinion": option_yj, 												// 审批意见
			"submit": summit_status, 												// 收文签收
			"isSendSms":isSendSms,		//是否发送短信
			"userPhone":userPhone			//具体短信号码
		},
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			console.log("返回值=" + JSON.stringify(data));
			mui.toast(data.msg);
			if(data.code == 1) {
				location.reload();
			}else{
				
			}
			plus.nativeUI.closeWaiting();
		},
		error: function(xhr, type, errorThrown) {
			console.log(JSON.stringify(xhr)+"----"+type+"----"+errorThrown);
			mui.toast(errorThrown);
			plus.nativeUI.closeWaiting();
		}
	})
}




//查看附件
function seeFun(self){
	plus.nativeUI.showWaiting();
	var _href = $(self).attr("data-href");
	var _name = $(self).attr("data-name");
	var type=$(self).attr("data-ftype");
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
			createEnclosureDownload(_href,_name)
			break;
	}
}

//监听附件下载
function onEnclosureStateChanged(download, status) {
	if(download.state == 4 && status == 200){
		plus.io.resolveLocalFileSystemURL( download.filename, function(entry){
			var _url = entry.toLocalURL();
			//console.log("下载完成:目录地址为:"+_url);
			//mui.alert(_url,"文件下载完成,文件地址:");
			plus.runtime.openFile(_url);
			plus.nativeUI.closeWaiting();
		}, function(){
			plus.nativeUI.closeWaiting();
		})
		
	}
}
// 附件下载
function createEnclosureDownload( _url,_name) {
	var filename = "_doc/download/"+new Date().getFullYear()+(new Date().getMonth()+1)+new Date().getDate()+"/"+_name;
	 plus.io.resolveLocalFileSystemURL( filename, function(entry){
	 	var _url = entry.toLocalURL();
	 	//console.log("获取成功:目录地址为:"+_url);
	 	//mui.alert(_url,_name+"文件地址");
	 	plus.runtime.openFile(_url);
	 	plus.nativeUI.closeWaiting();
	 }, function(){
	 	console.log("获取失败");
	 	var dtask = plus.downloader.createDownload(_url,{filename:filename});
		dtask.addEventListener("statechanged", onEnclosureStateChanged, false);
		dtask.start(); 
		plus.nativeUI.showWaiting("下载中...");
	})
}



$("body").on("click","#send_msm_checkbox",msmFun)
$("body").on("click",".isListBox .select_ul li",msmFun)

function msmFun(){
	var checked = $("#send_msm_checkbox").prop("checked");
	console.log(checked);
	var spr_checked_obj = $(".isListBox .select_box .select_ul li.active");
	var spr_checked_id = "";
	if(checked){
		if(spr_checked_obj.attr("data-id") == undefined) {
			spr_checked_id = "";
		} else {
			spr_checked_id = [];
			for(var i = 0; i < spr_checked_obj.length; i++) {
				spr_checked_id.push(spr_checked_obj.eq(i).attr("data-id"));
			}
		}
	}
	
	$(".phone_text_box").html("");
	if(checked && spr_checked_id != ""){
		msmCheckedFun(spr_checked_id)
	}
	
}
//phone信息
function msmCheckedFun(id){
	var w = plus.nativeUI.showWaiting("加载中...");
	var _url = root + 'api/document/getuserphone';
	var _id = id;
	console.log(_url);
	console.log(_id.toString());
	mui.ajax(_url, {
		data: {
			"token": token,
			"userIds": _id.toString()
		},
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			console.log(JSON.stringify(data));
			for (let index in data.data) {
				var msm_name = $(".isListBox .select_box .select_ul li.active[data-id = "+index+"]").text();
				console.log(msm_name);
				$(".phone_text_box").html(	`<div class="text_box">
												<span>${msm_name}</span>
												<input class="phone_text" type="text" data-id="${index}" value="${data.data[index]}" placeholder="请输入手机号"/>
											</div>`);
			}
		},
		error: function(xhr, type, errorThrown) {
			console.log(xhr+"----"+type+"----"+errorThrown);
			mui.toast(errorThrown);
			plus.nativeUI.closeWaiting();
		}
	})
}