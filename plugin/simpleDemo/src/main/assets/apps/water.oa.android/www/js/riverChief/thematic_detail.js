// 选择框点击事件
$(".content .main .select").on("click", ".select_item", function () {
    $(this).addClass("active").siblings().removeClass("active");
    let index = $(this).index();
    let $dom = $(".content .main .content_wrap>div").eq(index);
    $dom.show().siblings().hide();
    $dom.find(".order_wrap .order").eq(0).addClass("active").siblings().removeClass("active");
	if(index > 1){
		//启用上拉刷新
		mui('.mui-content').pullRefresh().enablePullupToRefresh();
		//重置上拉刷新
		mui('.mui-content').pullRefresh().refresh(true);
	}else{
		//禁用上拉刷新
		mui('.mui-content').pullRefresh().disablePullupToRefresh();
	}
});

var root = localStorage.getItem("str_url");
if (root == "" || root == undefined || root == null) {
	mui.openWindow({
		url: 'login.html?cid=1', //通过URL传参
		id: 'login.html?cid=1', //通过URL传参
	})
}
var token = localStorage.getItem("token");
var list_this = '';
var pageStatus = true;
var data_info = {};
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	plus.nativeUI.showWaiting("加载中...");
	data_info.token = token;
	data_info.id = self.item_id;
	console.log(JSON.stringify(data_info))
	list(data_info);
});
var urlsNew,indexNew,paramsNew;//巡河记录的参数
var urlsNew2,indexNew2,paramsNew2;//发生事件的参数
var urlsNew3,indexNew3,paramsNew3;//清四乱的参数
function list(data_info) {
	var cityCode = startTime = endTime = '';
	var _url = root + 'api/v3/riverchief/riverchiefriver/map_more';
	console.log(_url);
	console.log(JSON.stringify(data_info));
	mui.ajax(_url, {
		data: data_info,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			console.log(JSON.stringify(data))
			if (data.code == 1) {
				//pullup-container为在mui.init方法中配置的pullRefresh节点中的container参数；
				mui('.mui-content').pullRefresh().disablePullupToRefresh();
				// 名称地址
				$(".head_texts").text(data.data.name_tb)
				$(".head_desc").text(data.data.name_bb)
				// 切换块
				let infos = data.data.data;
				infos.map(item =>{
					$(".main .select").append(`
						<div class="select_item">${item.text}</div>
					`)
				})
				$(".main .select .select_item:first-child").addClass('active')
				// 表格渲染
				infos.map((item,index) =>{
					$(".content_wrap").append(`
						<div class="base">
							<div class="title">
								<span class="blue"></span>
								<span class="text">${item.text}</span>
							</div>
							<div class="wrap">
								<div class="list">
								</div>
							</div>
						</div>
					`)
					if(item.type == 1){
						item.list.map((item2,index2) =>{
							$(".content_wrap .list").append(`
								<div class="line">
									<div class="left">${item2.name}</div>
									<div class="right">${item2.value}</div>
								</div>
							`)
						})
					}else{
						//处理巡河记录2，发生事件信息3，清四乱信息4
						// console.log('============='+index)
						switch (index){
							case 2:
								urlsNew = item.url;
								indexNew = index;
								paramsNew = item.param;
								inspectriver(item.url,item.param,index)
								break;
							case 3:
								urlsNew2 = item.url;
								indexNew2 = index;
								paramsNew2 = item.param;
								event(item.url,item.param,index)
								break;
							case 4:
								urlsNew3 = item.url;
								indexNew3 = index;
								paramsNew3 = item.param;
								fourchaosproblem(item.url,item.param,index)
								break;
							default:
								break;
						}
					}
					
				})
				$(".content .main .content_wrap>div:first-child").show().siblings().hide()
			}
			
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
}
//巡河记录信息
function inspectriver(urls,params,index){
	var _url = root + urls;
	console.log(_url);
	console.log(JSON.stringify(params));
	console.log('巡河记录'+index)
	mui.ajax(_url, {
		data: params,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			// console.log(JSON.stringify(data))
			if (data.code == 1) {
				$(".content .main .content_wrap>div").eq(index).find(".wrap .list").css("border","none")
				if(data.data.info.length > 0){
					if (params.page > 1) {
						list_this.endPullupToRefresh(false);
					}
					if (params.page == 1) {
						$(".content .main .content_wrap>div").eq(index).find(".wrap .list").html(`
							<ul class="lists lists${index}"></ul>`)
					}
					
					data.data.info.map(item =>{
						$(`.wrap .list .lists${index}`).append(`
							<li class="lists_li">
								<ul class="lists_data" onclick="xiangqing(${item.id},'riverPatrol_detail.html')">
									<li>
										<span class="weight">${item.riverName}</span>
									</li>
									<li class="position">
										<span class="region">${item.location}</span>
									</li>
									<li>
										<span>巡河人姓名：</span>
										<span>${item.userName}</span>
									</li>
									<li>
										<span>巡河时长：</span>
										<span>${item.period}</span>
									</li>
									<li>
										<span>巡河距离：</span>
										<span>${item.distance}</span>
									</li>
									<li>
										<span>巡河问题数量：</span>
										<span>${item.eventCount}</span>
									</li>
									<li class="titles">
										<span>巡河时间：</span>
										<span>${item.date_range}</span>
									</li>
								</ul>
							</li>
						`)
					})
				}else{
					if (params.page > 1) {
						list_this.endPullupToRefresh(true);
					} else {
						$(".lists").html(
							'<div style="width: 96%;height: 2.4rem;margin:0 auto;background-color: #ffffff;box-shadow: 2px 2px 6px 0px rgba(0, 0, 0, 0.06);border-radius: 0.2rem;font-size:0.3rem;text-align:center;line-height: 2.4rem;">暂无数据</div>'
						)
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
//发生事件信息
function event(urls,params,index){
	var _url = root + urls;
	console.log(_url);
	console.log(JSON.stringify(params));
	console.log('事件信息'+index)
	mui.ajax(_url, {
		data: params,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			// console.log(JSON.stringify(data))
			if (data.code == 1) {
				$(".content .main .content_wrap>div").eq(index).find(".wrap .list").css("border","none")
				if(data.data.info.length > 0){
					if (params.page > 1) {
						list_this.endPullupToRefresh(false);
					}
					if (params.page == 1) {
						$(".content .main .content_wrap>div").eq(index).find(".wrap .list").html(`
							<ul class="lists lists${index}"></ul>`)
					}
					
					data.data.info.map(item =>{
						$(`.wrap .list .lists${index}`).append(`
							<li class="lists_li">
								<ul class="lists_data" onclick="xiangqing(${item.id},'event_detail.html')">
									<li>
										<span class="weight">${item.enventType}</span>
									</li>
									<li class="position">
										<span class="region" style="color:${item.statusColor}">${item.status}</span>
									</li>
									<li>
										<span>所属河流：</span>
										<span>${item.riverName}</span>
									</li>
									<li>
										<span>上报人：</span>
										<span>${item.reporter}</span>
									</li>
									<li class="titles">
										<span>上报时间：</span>
										<span>${item.reportTime}</span>
									</li>
								</ul>
							</li>
						`)
					})
				}else{
					if (params.page > 1) {
						list_this.endPullupToRefresh(true);
					} else {
						$(".lists").html(
							'<div style="width: 96%;height: 2.4rem;margin:0 auto;background-color: #ffffff;box-shadow: 2px 2px 6px 0px rgba(0, 0, 0, 0.06);border-radius: 0.2rem;font-size:0.3rem;text-align:center;line-height: 2.4rem;">暂无数据</div>'
						)
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
//清四乱信息
function fourchaosproblem(urls,params,index){
	var _url = root + urls;
	console.log(_url);
	console.log(JSON.stringify(params));
	console.log('清四乱信息'+index)
	mui.ajax(_url, {
		data: params,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			// console.log(JSON.stringify(data))
			if (data.code == 1) {
				$(".content .main .content_wrap>div").eq(index).find(".wrap .list").css("border","none")
				if(data.data.info.length > 0){
					if (params.page > 1) {
						list_this.endPullupToRefresh(false);
					}
					if (params.page == 1) {
						$(".content .main .content_wrap>div").eq(index).find(".wrap .list").html(`
							<ul class="lists lists${index}"></ul>`)
					}
					
					data.data.info.map(item =>{
						$(`.wrap .list .lists${index}`).append(`
							<li class="lists_li">
								<ul class="lists_data" onclick="xiangqing(${item.id},'clear_four_mess_detail.html')">
									<li>
										<span class="weight">${item.title}</span>
									</li>
									<li class="position">
										<span class="region">${item.status}</span>
									</li>
									<li>
										<span>地址：</span>
										<span>${item.location}</span>
									</li>
									<li>
										<span>批次编码：</span>
										<span>${item.batchCode}</span>
									</li>
									<li class="titles">
										<span>河段地址：</span>
										<span>${item.specificLocation}</span>
									</li>
								</ul>
							</li>
						`)
					})
				}else{
					if (params.page > 1) {
						list_this.endPullupToRefresh(true);
					} else {
						$(".lists").html(
							'<div style="width: 96%;height: 2.4rem;margin:0 auto;background-color: #ffffff;box-shadow: 2px 2px 6px 0px rgba(0, 0, 0, 0.06);border-radius: 0.2rem;font-size:0.3rem;text-align:center;line-height: 2.4rem;">暂无数据</div>'
						)
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

//跳转详情
function xiangqing(item_id, item_url) {
	console.log("详情=" + item_id);
	mui.openWindow({
		url: item_url, //通过URL传参
		id: item_url, //通过URL传参
		extras: {
			item_id: item_id,
		}
	})
}


// 上拉加载
mui.init({
	pullRefresh: {
		container: ".mui-content", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
		up: {
			height: "50px", //可选.默认50.触发上拉加载拖动距离
			auto: false, //可选,默认false.自动上拉加载一次
			contentdown: "上拉显示更多",
			contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
			contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
			callback: up_fun //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
		}
	}
});

function up_fun() {
	console.log("上拉加载成功");
	switch ($(".select .select_item.active").index()){
		case 2:
			paramsNew.page++;
			inspectriver(urlsNew,paramsNew,indexNew)
			break;
		case 3:
			paramsNew2.page++;
			event(urlsNew2,paramsNew2,indexNew2)
			break;
		case 4:
			paramsNew3.page++;
			fourchaosproblem(urlsNew3,paramsNew3,indexNew3)
			break;
		default:
			break;
	}
	list_this = this;
}