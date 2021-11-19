var root = localStorage.getItem("str_url");
console.log(root);
// if (root == "" || root == undefined || root == null) {
// 	mui.openWindow({
// 		url: 'login.html?cid=1', //通过URL传参
// 		id: 'login.html?cid=1', //通过URL传参
// 	})
// }
var token = localStorage.getItem("token");
console.log(token);
var page = 1;
var list_this = "";
var pageStatus = true;
var data_info = {};
mui.plusReady(function () {
    var self = plus.webview.currentWebview();
    if (self.type_id == undefined) {
        self.type_id = 0;
    }
    plus.nativeUI.showWaiting("加载中...");
    data_info.token = token;
    data_info.page = page;
	data_info.pageSize = 10;
    data_info.code = $("#city").attr("data-code"); //code地区编码
    data_info.resParentname = $("#resParentname").val(); //上级河流
    data_info.riverName = $("#riverName").val(); //名称搜索
    list(data_info);
	
	var area_info = {"token": token}
	var itemObj = {"itemid":"#city"}
	getArea(data_info,itemObj)
});

function list(data_info) {
    var _url = root + "api/v3/riverchief/riverchiefreachmore/";
    console.log(_url);
    console.log(JSON.stringify(data_info));
    mui.ajax(_url, {
        data: data_info,
        datatype: "json", //服务器返回json格式数据
        type: "post", //HTTP请求类型
        success: function (data) {
            plus.nativeUI.closeWaiting();
            console.log(JSON.stringify(data));

            if (data.code == 1) {
                if (pageStatus) {
                   
                }
                if (data.data.info.length > 0) {
                    if (page > 1) {
                        list_this.endPullupToRefresh(false);
                    }
                    if (page == 1) {
                        $(".all_num").html("");
                        $(".list_box").html("");
                    }
                    var infobox = data.data.info;
                    $(".all_num").text(data.data.count);
                    for (let i = 0; i < infobox.length; i++) {
						var buttonItem = '';
						infobox[i].tag.map(item => {
							buttonItem += `<button type="button" onclick="xiangqing(${item.value},this)">${item.name}</button>`
						})
						
						$(".list_box").append(`
							<li class="list_box_item">
								<ul class="list_box_item_inner">
									<li class="titles">
										<span>${infobox[i].rvName}</span>
										<span>${infobox[i].adFullName}</span>
									</li>
									<li>
										<span>所属河流：${infobox[i].belongsRvname}</span>
										<span>等级：${infobox[i].resLevel}</span>
									</li>
									<li data-code="${infobox[i].rvCode}">
										${buttonItem}
									</li>
								</ul>
							</li>
						`);
                    }
                } else {
                    if (page > 1) {
                        list_this.endPullupToRefresh(true);
                    } else {
                        $(".all_num").text("0");
                        $(".list_box").html(
                            '<div style="width: 96%;height: 2.4rem;margin:0 auto;background-color: #ffffff;box-shadow: 2px 2px 6px 0px rgba(0, 0, 0, 0.06);border-radius: 0.2rem;font-size:0.3rem;text-align:center;line-height: 2.4rem;">暂无数据</div>'
                        );
                    }
                }
            }
            pageStatus = false;
        },
        error: function (xhr, type, errorThrown) {
            plus.nativeUI.closeWaiting();
        },
    });
}

function xiangqing(item_type,currentDom) {
	let item_code = currentDom.parentNode.getAttribute("data-code")
	console.log($('.main .nav .nav_item.active').attr("data-url"))
	mui.openWindow({
		url: "./river_policy_detail_new.html", //通过URL传参
		id: "./river_policy_detail_new.html", //通过URL传参
		extras: {
			item_url:$('.main .nav .nav_item.active').attr("data-url"),
			item_type: item_type,
			item_code: item_code,
			item_abc:"rvCode"
		},
	});
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
            contentnomore: "没有更多数据了", //可选，请求完毕若没有更多数据时显示的提醒内容；
            callback: up_fun, //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
        },
    },
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

function shaixuanFun() {
    // 重置上拉加载
    mui(".mui-content").pullRefresh().refresh(true);
    plus.nativeUI.showWaiting("加载中...");
    page = 1;
    data_info.page = page;
	data_info.pageSize = 10;
    data_info.code = $("#city").attr("data-code"); //code地区编码
    data_info.resParentname = $("#resParentname").val(); //上级河流
    data_info.riverName = $("#riverName").val(); //名称搜索
    list(data_info);
}

$("#city").on("change", shaixuanFun);
$("#resParentname").on("change", shaixuanFun);

// 放大镜按钮点击事件与键盘事件
$("#search_riverName").on("click", function () {
    var search_value = $(this).prev().val();
    if (search_value == "") {
        $(this).prev().focus();
    } else {
        shaixuanFun();
    }
});
$("#search_riverName")
    .prev()
    .keypress(function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        console.log(e.keyCode);
        if (e && e.keyCode == 13) {
            // 按 Enter
            //要做的事情
            console.log(11);
            $("#search_riverName").prev().blur();
            var val_info = $("#search_riverName").prev().val();
            if (val_info != "" && val_info != undefined) {
                shaixuanFun();
            }
        }
    });
// 放大镜按钮点击事件与键盘事件

