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
function xyb_spr() {
	var _url = root + 'api/document/getapproveuser';
	var token = localStorage.getItem("token");
	console.log("flowid="+$("#select_node option:selected").attr("flowid")+";sorting="+$("#select_node option:selected").attr("sorting"))
	mui.ajax(_url, {
		data: {
			"token": token,
			"flow_id": $("#select_node option:selected").attr("flowid"),
			"node_code": $("#select_node option:selected").attr("sorting")
		},
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型 
		success: function(data) {
			console.log("审批人数据：" + JSON.stringify(data));
			$(".isListBox .select_box").html("");
			if(data.data.list == "" || data.data.list == undefined || data.data.list == null) {
				$(".isListBox .select_box").append('<p>暂无信息</p>');
			} else {
				var html = "";
				data.data.list.forEach(function(v, index) {
					html += '<p style="text-align:left;padding-left:0.2rem;">' + v.departmentName + '</p><ul class="select_ul">';
					data.data.list[index].users.forEach(function(v2, index2) {
						html += '<li class="" data-id="' + v2.id + '">' + v2.trueName + '</li>';
					})
					html += '</ul>';
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