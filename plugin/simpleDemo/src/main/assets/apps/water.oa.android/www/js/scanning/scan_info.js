var root = localStorage.getItem("str_url");
// if (root == "" || root == undefined || root == null) {
// 	mui.openWindow({
// 		url: 'login.html?cid=1', //通过URL传参
// 		id: 'login.html?cid=1', //通过URL传参
// 	})
// }
var token = localStorage.getItem("token");
var list_this = '';
var list_thiss = '';
var dataObj = {};
var codes;
var page = 1;
var pages = 1;
var serialsN;
var page_status = true;
var page_statuss = true;
mui.plusReady(function() {
	plus.nativeUI.showWaiting("加载中...");
	// 获取接口地址
	var self = plus.webview.currentWebview();
	codes = self.bar_code;
	console.log(codes)
	dataObj = {
		token: token,
		serial_number: codes
	}
	console.log(dataObj)
	getInfoFun("api/assets_manage/show")
	datePickerFun()
})
// 本页面接口
var deviceId;//设备id
//本页面接口
function getInfoFun(urls) {
	let _url = root + urls;
	console.log(_url);
	console.log(JSON.stringify(dataObj))
	mui.ajax(_url, {
		data: dataObj,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(res) {
			console.log(JSON.stringify(res))
			plus.nativeUI.closeWaiting();
			if (res.code == 1) {
				deviceId = res.data.serial_id;
				switch (urls) {
					case "api/assets_manage/show":
						serialsN = res.data.serial_number;
						//条码编号
						// $('.right.code_number').text(res.data.code_number)
						// 设备序列号
						$('.right.serial_number').text(res.data.serial_number)
						// 设备id
						$('.right.serial_id').text(res.data.serial_id)
						// 主机型号
						$('.right.host_model').text(res.data.computer_type)
						// 使用地点
						$('.right.use_site').text(res.data.use_site)
						// 使用方式
						$('.right.usage_mode').text(res.data.usage_mode)
						// 使用人
						$('.right.user').text(res.data.user)
						// 绑定日期
						$('.right.binding_date').text(res.data.binding_date)
						// 图片
						let imageArray = res.data.pic;
						console.log(imageArray.length)
						var img_html = ''
						if(imageArray.length > 0){
							$(".line.lines").css('display','flex');
							for(let i=0;i<imageArray.length;i++){
								img_html+=`<img src="${imageArray[i]}" >`
							}
							$(".lines .imgList").html(img_html)
						}
						break;
					case "api/assets_manage/disk":
						// CPU
						$(".extend_info .cpuName").text(res.data.cpuName)
						// MAC地址
						$(".extend_info .macName").text(res.data.mac)
						// 磁盘空间
						$(".extend_info .chart_wrap .chart_top .text").text(res.data.total);
						pie(res.data)
						break;
					case "api/assets_manage/process":
						// 找到多少个应用
						$(".process_info .title .text span").text(res.data.count)
						var listData = res.data.listData;
						if (listData.length > 0) {
							console.log(page)
							if (page > 1) {
								list_this.endPullupToRefresh(false);
							}
							if (page == 1 && page_status) {
								$('.process_info .lists').html('')
							}
							var listImg = "../../images/scanning/360.png"
							// 渲染进程列表
							for(let i=0;i<listData.length;i++){
								if(listData[i].img){
									listImg = listData[i].img
								}
								$(".process_info .process_list .lists").append(`
									<div class="line">
									    <img class="img" src="${listImg}" alt="">
									    <div class="name">${listData[i].process_name}</div>
									    <div class="detail">
									        <div class="text_t">${listData[i].size}</div>
									        <div class="text_b">${listData[i].date}</div>
									    </div>
									</div>
								`)
							}
						} else {
							if (page > 1) {
								list_this.endPullupToRefresh(true);
							} else {
								$('.process_info .lists').html(
									'<div style="font-size:0.35rpx;text-align:center;padding:1rem 0rem;display:block;">暂无数据</div>'
									)
							}
						}
						page_status = false
						break;
					case "api/assets_manage/up":
						// 渲染数量
						$(".startup_info .title .text span").text(res.data.count)
						var listDatas = res.data.listData;
						if (listDatas.length > 0) {
							console.log(pages)
							if (pages > 1) {
								list_thiss.endPullupToRefresh(false);
							}
							if (pages == 1 && page_statuss) {
								$('.startup_info .lists').html('')
							}
							// 渲染开机信息
							for(let i=0;i<listDatas.length;i++){
								$(".startup_info .startup_list .lists").append(`
									<div class="line">
									    <img class="img" src="../../images/scanning/on.png" alt="">
									    <div class="date">${listDatas[i].usageTime}</div>
									    <div class="state">${listDatas[i].status_text}</div>
									</div>
								`)
							}
							
						} else {
							if (pages > 1) {
								list_thiss.endPullupToRefresh(true);
							} else {
								$('.startup_info .lists').html(
									'<div style="font-size:0.35rpx;text-align:center;padding:1rem 0rem;display:block;">暂无数据</div>'
									)
							}
						}
						page_statuss = false
						break;
					default:
						break;
				}
			} else {
				if (page && page > 1) {
					list_this.endPullupToRefresh(true);
				}else if(pages && pages > 1){
					list_thiss.endPullupToRefresh(true);
				}
				plus.nativeUI.toast(res.msg)
			}
		},
		error: function(xhr, type, errorThrown) {
			console.log(errorThrown)
			plus.nativeUI.closeWaiting();
		}
	})
}

// 进程信息的上拉加载 start
mui("#process_list").pullRefresh({
	up: {
		height: "50px", //可选.默认50.触发上拉加载拖动距离
		auto: false, //可选,默认false.自动上拉加载一次
		contentdown: "上拉显示更多",
		contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
		contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
		callback: up_fun //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
	}
})
function up_fun() {
	list_this = this;
	page++;
	dataObj = {
		token: token,
		// serial_number: serialsN,
		serial_id: deviceId,
		pageSize: 10,
		pageStatus: page,
	}
	getInfoFun("api/assets_manage/process")
}
// 上拉加载 end


// 开机信息的上拉加载 start
mui("#startup_list").pullRefresh({
	up: {
		height: "50px", //可选.默认50.触发上拉加载拖动距离
		auto: false, //可选,默认false.自动上拉加载一次
		contentdown: "上拉显示更多",
		contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
		contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
		callback: up_funs //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
	}
})
function up_funs() {
	list_thiss = this;
	pages++;
	console.log("上拉加载成功");
	var times = $("#muiPicker").text();
	if(times == "时间筛选"){
		times = ''
	}
	dataObj = {
		token: token,
		// serial_number: serialsN,
		serial_id: deviceId,
		status: $("#status").val(), //开机状态
		start_time: times, //开始时间
		pageSize: 10,
		pageStatus: pages,
	}
	getInfoFun("api/assets_manage/up")
}
// 上拉加载 end

// 月份筛选事件
function datePickerFun() {
	// 月份筛选
	var datatime = new Date();
	var data_tiem = datatime.getFullYear() + "-" + (String(datatime.getMonth() + 1).length < 2 ? '0' + ((datatime.getMonth() +
		1)) : (datatime.getMonth() + 1));
	console.log(data_tiem)
	// $("#muiPicker").text(data_tiem);
	var begin = '2020-04'.split('-');
	var end = data_tiem.split('-');
	document.querySelector("#muiPicker").addEventListener("tap", function() {
		var dtpicker = new mui.DtPicker({
			type: "month", //设置日历初始视图模式 
			beginDate: new Date(begin), //设置开始日期 
			endDate: new Date(end), //设置结束日期 
		})
		dtpicker.setSelectedValue($('#muiPicker').text())
		dtpicker.show(function(e) {
			console.log(e);
			$("#muiPicker").text(e.y.text + "-" + e.m.text);
			shaixuanFun()
		})
	})
}
// 导航栏点击事件
$(".bg .nav_bar .nav_item").on("click", function() {
	plus.nativeUI.showWaiting("加载中...");
	$(this).addClass("active").siblings().removeClass("active");
	let name = $(this).attr("data-name");
	$(".content .info_box").hide();
	$(`.content .${name}`).show();
	console.log(deviceId)
	switch (name) {
		case "base_info": //基本信息
			dataObj = {
				token: token,
				serial_number: codes
			}
			console.log(dataObj)
			getInfoFun("api/assets_manage/show")
			break;
		case "extend_info": //扩展信息
			dataObj = {
				token: token,
				// serial_number: serialsN,
				serial_id: deviceId
			}
			console.log(dataObj)
			getInfoFun("api/assets_manage/disk")
			break;
		case "process_info": //进程信息
			page = 1;
			dataObj = {
				token: token,
				// serial_number: serialsN,
				serial_id: deviceId,
				pageSize: 10,
				pageStatus: page,
			}
			console.log(dataObj)
			getInfoFun("api/assets_manage/process")
			break;
		case "startup_info": //开机信息
			pages = 1;
			dataObj = {
				token: token,
				// serial_number: serialsN,
				serial_id: deviceId,
				status: '', //开机状态
				start_time: '', //开始时间
				pageSize: 10,
				pageStatus: pages,
			}
			console.log(dataObj)
			getInfoFun("api/assets_manage/up")
			break;
		default:
			break;
	}
})

function shaixuanFun() {
    // 重置上拉加载
    mui(".startup_list").pullRefresh().refresh(true);
    plus.nativeUI.showWaiting("加载中...");
    $(".info_box .list").scrollTop(0); //重置滚动条的top值为0
    pages = 1;
	var times = $("#muiPicker").text();
	if(times == "时间筛选"){
		times = ''
	}
    dataObj = {
    	token: token,
    	// serial_number: serialsN,
		serial_id: deviceId,
    	status: $("#status").val(), //开机状态
    	start_time: times, //开始时间
    	pageSize: 10,
    	pageStatus: pages,
    }
    getInfoFun("api/assets_manage/up")
}
$("#status").on('change',shaixuanFun)
// 饼图方法
function pie(data) {
	let chart = Highcharts.chart("pie", {
		chart: {
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			type: "pie",
		},
		title: {
			text: "",
		},
		credits: {
			enabled: false,
		},
		tooltip: {
			pointFormat: "<b>{point.percentage:.1f}%</b>",
		},
		legend: {
			symbolRadius: 0,
			labelFormatter: function() {
				let {
					name,
					y
				} = this.options;
				return `${name}${y}${data.unit}`;
			},
		},
		plotOptions: {
			pie: {
				cursor: "pointer",
				dataLabels: {
					enabled: false,
				},
				showInLegend: true,
				states: {
					hover: {
						halo: {
							opacity: 0,
						},
					},
				},
			},
		},
		series: [{
			name: "硬盘使用情况",
			colorByPoint: true,
			data: data.data,
		}, ],
	});
}