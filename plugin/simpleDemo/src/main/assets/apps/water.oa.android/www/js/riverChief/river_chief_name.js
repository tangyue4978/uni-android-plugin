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
var page = 1;
var list_this = '';
var pageStatus = true;
var data_info = {};
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	if (self.type_id == undefined) {
		self.type_id = 0;
	}
	plus.nativeUI.showWaiting("加载中...");
	data_info.page = page;
	data_info.token = token;
	data_info.code = $("#city").attr("data-code");
	data_info.userName = $('#userName').val();
	data_info.riverName = $('#riverName').val();
	list(data_info);
	
	var area_info = {"token": token}
	var itemObj = {"itemid":"#city"}
	getArea(data_info,itemObj)
});

function list(data_info) {
	var _url = root + 'api/v3/riverchief/riverchieflakechief/level_list';
	console.log(_url)
	console.log(JSON.stringify(data_info))
	mui.ajax(_url, {
		data:data_info,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			console.log(JSON.stringify(data))
			if (data.code == 1) {
				if(pageStatus){
					$("#city").html('<option value="">全部地市</option>');
					for (let index in data.data.cityList) {
						$("#city").append(`<option value="${data.data.cityList[index].value}">${data.data.cityList[index].name}</option>`)
					}
				}
				var infobox = data.data.list;
				if (infobox.length > 0) {
					if (page > 1) {
						list_this.endPullupToRefresh(false);
					}
					if (page == 1) {
						$(".list").html("");
						console.log(page);
						
						
					}

					// 列表
					for (let index in infobox) {
						var itemHtml = "";
						var infobox2 = infobox[index].list;
						for (let index2 in infobox2) {
							var strHtml = `<div class="line">
												<div class="top itemclick3" data-params1="${infobox2[index2].params.code}" data-params2="${infobox2[index2].params.county}" data-params3="${infobox2[index2].params.userTypeName}" data-params4="${infobox2[index2].params.userLevel}">
													<span class="title">${infobox2[index2].name}</span>
													<span class="text">共${infobox2[index2].count}人</span>
													<img class="img" src="../../images/riverChief/new/arrow.png" alt="">
												</div>
												<div class="btm item3box">
													<!-- <div class="line">
														<div class="top">
															<div class="title_name">罗清宇</div>
															<div class="item_span">行政职务：省委常委、太原市委书局</div>
															<div class="item_span">管辖河湖：萧河(含太榆水渠)</div>
														</div>
													</div>
													<div class="line">
														<div class="top">
															<div class="title_name">罗清宇</div>
															<div class="item_span">行政职务：省委常委、太原市委书局</div>
															<div class="item_span">管辖河湖：萧河(含太榆水渠)</div>
														</div>
													</div>
													<div class="load_more_box">
														<div class="load_more">加载更多</div>
													</div> -->
												</div>
											</div>`;
							itemHtml+=strHtml;
						}
						var lineHtml = `<div class="line">
											<div class="top itembox itemclick2">
												<span class="blue"></span>
												<span class="title">${infobox[index].name}</span>
												<span class="text">共${infobox[index].count}人</span>
												<img class="img" src="../../images/riverChief/new/arrow.png" alt="">
											</div>
											<div class="btm item2box">
												${itemHtml}
											</div>
										</div>`;
						$(".list").append(lineHtml);
					}
					
					
				} else {
					if (page > 1) {
						list_this.endPullupToRefresh(true);
					} else {
						$(".list").html(
							'<div style="width: 96%;height: 2.4rem;margin:0 auto;background-color: #ffffff;box-shadow: 2px 2px 6px 0px rgba(0, 0, 0, 0.06);border-radius: 0.2rem;font-size:0.3rem;text-align:center;line-height: 2.4rem;">暂无数据</div>'
						)
					}
				}
			}
			pageStatus = false;
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
}
// 上拉加载
// mui.init({
// 	pullRefresh: {
// 		container: ".mui-content", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
// 		up: {
// 			height: "50px", //可选.默认50.触发上拉加载拖动距离
// 			auto: false, //可选,默认false.自动上拉加载一次
// 			contentdown: "上拉显示更多",
// 			contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
// 			contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
// 			callback: up_fun //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
// 		}
// 	}
// });

function up_fun() {
	page++;
	console.log("上拉加载成功");
	var self = plus.webview.currentWebview();
	data_info.page = page;
	list(data_info);
	list_this = this;
}

// 上拉加载 end

function shaixuanFun() {
	// 重置上拉加载
	// mui('.mui-content').pullRefresh().refresh(true);
	plus.nativeUI.showWaiting("加载中...");
	page = 1;
	data_info.page = page;
	data_info.token = token;
	data_info.pageSize = 10;
	// data_info.code = $("#city").val();
	data_info.code = $("#city").attr("data-code");
	data_info.userName = $('#userName').val();
	data_info.riverName = $('#riverName').val();
	list(data_info);
}

$("#city").on("change", shaixuanFun);
// $("#userName").on("change", shaixuanFun);
// 放大镜按钮点击事件与键盘事件
$("#search_userName").on("click", function() {
	var search_value = $(this).prev().val();
	if (search_value == '') {
		$(this).prev().focus();
	}else{
		shaixuanFun();
	}
})
$("#search_riverName").prev().keypress(function(event) {
	var e = event || window.event || arguments.callee.caller.arguments[0];
	console.log(e.keyCode)
	if (e && e.keyCode == 13) { // 按 Enter 
		//要做的事情
		console.log(11);
		$("#search_riverName").prev().blur();
		var val_info = $("#search_riverName").prev().val();
		// if(val_info != '' && val_info != undefined){
			shaixuanFun();
		// }
	}
});

$("#userName").on("click", function() {
	var search_value = $(this).prev().val();
	if (search_value == '') {
		$(this).prev().focus();
	}else{
		shaixuanFun();
	}
})
$("#search_userName").prev().keypress(function(event) {
	var e = event || window.event || arguments.callee.caller.arguments[0];
	console.log(e.keyCode)
	if (e && e.keyCode == 13) { // 按 Enter 
		//要做的事情
		console.log(11);
		$("#search_userName").prev().blur();
		var val_info = $("#search_userName").prev().val();
		// if(val_info != '' && val_info != undefined){
			shaixuanFun();
		// }
	}
});

// 放大镜按钮点击事件与键盘事件


$(".list").on("click",".itemclick2",function(){
	if($(this).hasClass("active")){
		$(this).removeClass("active");
		$(this).next(".item2box").removeClass("active");
	}else{
		$(this).addClass("active");
		$(this).next(".item2box").addClass("active");
	}
})

$(".list").on("click",".itemclick3",function(){
	if($(this).hasClass("active")){
		$(this).removeClass("active");
		$(this).next(".item3box").removeClass("active");
		
	}else{
		console.log($(this).attr("data-params"));
		var obj_info = {
			"code": $(this).attr("data-params1"),
			"county": $(this).attr("data-params2"),
			"userTypeName": $(this).attr("data-params3"),
			"userLevel": $(this).attr("data-params4")
		}
		page = 1;
		data_info.page = page;
		var new_data_info = Object.assign(data_info, obj_info)
		console.log(new_data_info);
		plus.nativeUI.showWaiting("加载中...")
		ajax_list(new_data_info,$(this))
		$(this).addClass("active");
		$(this).next(".item3box").addClass("active");
	}
})

function ajax_list(data_info,self){
	
	var _url = root + 'api/v3/riverchief/riverchieflakechief/ajax_list';
	console.log(_url)
	console.log(JSON.stringify(data_info))
	mui.ajax(_url, {
		data:data_info,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			console.log(JSON.stringify(data))
			if (data.code == 1) {
				
				var infobox = data.data.info;
				if (infobox.length > 0) {
					
					if (page == 1) {
						self.closest(".line").find(".item3box").html("");
						console.log(page);
					}

					// 列表
					for (let index in infobox) {
						var itemHtml = "";
						var infobox2 = infobox[index].list;
						for (let index2 in infobox2) {
							var strHtml = `<div class="item_span">${infobox2[index2].name}：${infobox2[index2].value}</div>`;
							itemHtml+=strHtml;
						}
						var lineHtml = `<div class="line">
											<div class="top">
												<div class="title_name">${infobox[index].name}</div>
												${itemHtml}
											</div>
										</div>`;
						self.closest(".line").find(".item3box").append(lineHtml);
					}
					if(self.closest(".line").find(".item3box").find(".load_more_box").length <= 0){
						if(self.closest(".line").find(".item3box").find(".line").length < (data.data.count - 0)){
							self.closest(".line").find(".item3box").append(`<div class="load_more_box" onclick="moreFun(${JSON.stringify(data_info).replace(/\"/g,"\'")},this)" >
																				<div class="load_more">加载更多</div>
																			</div>`)
						}else{
							self.closest(".line").find(".item3box").find(".load_more_box").remove();
						}
					}else{
						if(self.closest(".line").find(".item3box").find(".line").length < (data.data.count - 0)){
							self.closest(".line").find(".item3box").append(`<div class="load_more_box" onclick="moreFun(${JSON.stringify(data_info).replace(/\"/g,"\'")},this)" >
																				<div class="load_more">加载更多</div>
																			</div>`)
							self.closest(".line").find(".item3box").find(".load_more_box").eq(0).remove();
						}else{
							self.closest(".line").find(".item3box").find(".load_more_box").remove();
						}
					}
					
					
				}else{
					console.log("暂无数据");
				}
			}
			pageStatus = false;
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
			console.log("接口错误");
		}
	})

}

function moreFun(data_info,self){
	console.log(JSON.stringify(data_info),self);
	var new_data_info = data_info;
	page++;
	new_data_info.page++;
	var _this = $(self);
	ajax_list(new_data_info,_this);
}