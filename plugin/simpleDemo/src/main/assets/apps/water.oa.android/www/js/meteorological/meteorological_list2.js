// 列表渲染
var page_status = true;
// 获取基础信息
var root = localStorage.getItem("str_url");
if (root == "" || root == undefined || root == null) {
	// mui.openWindow({
	// 	url: 'login.html?cid=1', //通过URL传参
	// 	id: 'login.html?cid=1', //通过URL传参
	// })
}

var token = localStorage.getItem("token");
var page = 1;
var list_this = '';
var data_info = {};
var shaixuanindex = 0; //筛选蓝快index
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	plus.nativeUI.showWaiting("加载中...");
	
	data_info.token = token;
	data_info.page = page;
	data_info.type = self.type;
	data_info.status = self.status;
	data_info.areaCode = self.areaCode;
	switch (self.type) {
		case '2':
			$("#type_select option").eq(0).attr('selected',"selected")
			break;
		case '3':
			$("#type_select option").eq(1).attr('selected',"selected")
			break;
		case '4':
			$("#type_select option").eq(2).attr('selected',"selected")
			break;
		default:
			$("#type_select option").eq(0).attr('selected',"selected")
			break;
	}
	switch (self.status) {
		case '1':
			$("#status_select option").eq(0).attr('selected',"selected")
			break;
		case '3':
			$("#status_select option").eq(1).attr('selected',"selected")
			break;
		case '12':
			$("#status_select option").eq(2).attr('selected',"selected")
			break;
		case '24':
			$("#status_select option").eq(3).attr('selected',"selected")
			break;
		case '72':
			$("#status_select option").eq(4).attr('selected',"selected")
		break;
		default:
			$("#status_select option").eq(0).attr('selected',"selected")
			break;
	}
	$("#city_select option").eq(0).attr('value',self.areaCode)
	$("#city_select option").eq(0).text(self.areaname)
	data_info.pageSize = 15;
	list(data_info);
	
	var area_info = {"token": token}
	var itemObj = {
		"itemid" : "#city_select"
	}
	getArea(data_info, itemObj)
});

function list(data_info) {
	var _url = root + 'api/v3/weatherdata/weather/list';
	// var _url = root + 'api/v4/weather/list';
	console.log(_url);
	console.log(JSON.stringify(data_info));
	mui.ajax(_url, {
		data: data_info,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			
			console.log(JSON.stringify(data));
			plus.nativeUI.closeWaiting();
			if(data.code  == 1){
				$(".total_span").text(data.data.count);
				var info_arr = data.data.data;
				if(info_arr.length >0){
					if (page > 1) {
						list_this.endPullupToRefresh(false);
					}
					if(page == 1){
						$(".listBox").html("");
					}
					for (var i = 0; i < info_arr.length; i++) {
						var infoArr = info_arr[i];
						var val = infoArr.value;
						var status = $("#status_select").val();
						var selectval = $("#type_select").val();
						var select_obj = {"1":"降雨","2":"温度","3":"风速","4":"湿度"};
						if(data_info.type == 3){
							$(".listBox").append(`
								<li class="test_li" onclick="xiangqing('${selectval}','${status}','${infoArr[3].value}')">
									<div class="test_box">
										<div class="test_div"><span class="test_span">${infoArr[0].text}:</span>${infoArr[0].value}<div>
										<div class="test_div"><span class="test_span">${infoArr[1].text}　　:</span>${infoArr[1].value}<div>
										<div class="test_div"><span class="test_span">${infoArr[2].text}:</span>${infoArr[2].value}<div>
									</div>
								</li>
							`)
						}else{
							$(".listBox").append(`
								<li class="test_li" onclick="xiangqing('${selectval}','${status}','${infoArr[3].value}')">
									<div class="test_box">
										<div class="test_div"><span class="test_span">${infoArr[0].text}:</span>${infoArr[0].value}<div>
										<div class="test_div"><span class="test_span">${infoArr[1].text}　　:</span>${infoArr[1].value}<div>
										<div class="test_div"><span class="test_span">${infoArr[2].text}　　:</span>${infoArr[2].value}<div>
									</div>
								</li>
							`)
						}
						
					}
				
				}else{
					if (page > 1) {
						list_this.endPullupToRefresh(true);
					} else {
						$(".lists").html(
							'<a style="font-size:0.35rpx;text-align:center;padding:1rem 0rem;display:block;">暂无数据</a>'
						)
					}
				}
			}else{
				if (page > 1) {
					list_this.endPullupToRefresh(true);
				}
				plus.nativeUI.toast(data.msg);
			}
			
		},
		error: function(xhr, type, errorThrown) {
			console.log("获取失败")
			plus.nativeUI.closeWaiting();
		}
	})
}

function xiangqing(selectval,status,stationCode) {
	var self = plus.webview.currentWebview();
	mui.openWindow({
		url: 'detail.html', //通过URL传参
		id: 'detail.html', //通过URL传参
		extras: {
			selectval: selectval,
			status:status,
			station_code:stationCode
		}
	})
};

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
	page++;
	console.log("上拉加载成功");
	var self = plus.webview.currentWebview();
	data_info.page = page;
	list(data_info);
	list_this = this;
}

// 上拉加载 end


// 筛选信息
function shaixuanFun() {
	// 重置上拉加载
	mui('.mui-content').pullRefresh().refresh(true);
	plus.nativeUI.showWaiting("加载中...");
	$(document).scrollTop(0) //重置滚动条的top值为0
	page = 1;
	data_info.page = page;
	
	data_info.type = $("#type_select").val();
	data_info.status =$("#status_select").val();
	// data_info.areaCode = $("#city_select").val();
	data_info.areaCode = $("#city_select").attr("data-code");
	data_info.pageSize = 15;
	list(data_info);
}
$("#type_select").on("change", shaixuanFun)
$("#status_select").on("change", shaixuanFun)
$("#city_select").on("change", shaixuanFun)
