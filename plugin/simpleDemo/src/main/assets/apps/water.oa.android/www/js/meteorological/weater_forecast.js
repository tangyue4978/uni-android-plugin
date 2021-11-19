$().ready(function () {
    $(".tab-menux li").mouseover(function () {
        var _index = $(this).index();
        $(".tab-box>div").eq(_index).css({ display: "flex" }).siblings().hide();
        $(this).addClass("change").siblings().removeClass("change");
    });
});

var root = localStorage.getItem("str_url");
// if (root == "" || root == undefined || root == null) {
// 	mui.openWindow({
// 		url: 'login.html?cid=1', //通过URL传参
// 		id: 'login.html?cid=1', //通过URL传参
// 	})
// }
var token = localStorage.getItem("token");
var obj_data = {};

//获取当前位置
var currentLon, currentLat;
var address = "";
var closeStatus = 0;
mui.plusReady(function () {
    var self = plus.webview.currentWebview();
    plus.nativeUI.showWaiting("加载中...");
	// 预警默认调用
	warningFun()
    plus.geolocation.getCurrentPosition(function (e) {
		console.log("位置信息：" + JSON.stringify(e));
        // address = e.address.district;
        // $(".address").text(address);
        currentLon = e.coords.longitude;
        currentLat = e.coords.latitude;

        console.log("当前位置：" + currentLon + "," + currentLat);
        // console.log(e.position.address)
        obj_data.token = token;
        obj_data.lon = currentLon;
        obj_data.lat = currentLat;
        list(obj_data);
    }, function(e) {
		console.log('获取位置信息异常：' + e.message);
		plus.nativeUI.toast('获取位置信息异常：' + e.message);
	}, {
		enableHighAccuracy: true,
		timeout: 30000,
		provider: 'system',
		coordsType: 'wgs84',
		// provider:'baidu',
		// coordsType:'gcj02',
		geocode: true
	});
});

function list(obj_data) {
    var _url = root + "api/v3/weatherdata/sxweather/index";
    console.log(JSON.stringify(obj_data));
    console.log(_url);
    console.log(token);
    mui.ajax(_url, {
        data: obj_data,
        dataType: "json", //服务器返回json格式数据
        type: "post", //HTTP请求类型
        lon: obj_data.lon,
        lat: obj_data.lat,
        success: function (data) {
            console.log(JSON.stringify(data));
			closeStatus++;
			if(closeStatus >= 2){
				plus.nativeUI.closeWaiting();
			}
			
            if (data.code == 1) {
				
                $(".classification").css("visibility", "visible");
                var arr = data.data.today;
				$(".address").text(arr.area);
                $(".temperature .number2").text(arr.now_temperature);
                $(".information #humidity").text(arr.humidity);
                $(".information #wind").text(arr.windscale);
                $(".information #quality").text(arr.airquality);
                $(".date span").text(arr.release_time);
                var item = data.data.twentyFourHours;
                var item2 = data.data.fifteenDays;
                var html = "";
                var html2 = "";
                for (var i = 0; i < item.length; i++) {
                    html +=
                        "<ul><li>" +
                        item[i].time +
                        '时</li><li class="img_box"><img src=' +
                        item[i].status_image +
                        "></li><li>" +
                        item[i].status +
                        "</li><li>" +
                        item[i].temperature +
                        "<span>&#176;</span></li></ul>";
                }
                for (var j = 0; j < item2.length; j++) {
                    html2 +=
                        "<ul><li>" +
                        item2[j].week +
                        "</li><li>" +
                        item2[j].data +
                        '</li><li class="img_box"><img src=' +
                        item2[j].fa_image +
                        '></li><li class="img_box"><img src=' +
                        item2[j].fb_image +
                        "></li><li><span>" +
                        item2[j].fc +
                        "</span>&#8451;/<span>" +
                        item2[j].fd +
                        "</span>&#8451;</li></ul>";
                }
                $(".prediction").append(html);
                $(".prediction2").append(html2);
            }else{
				mui.toast(data.msg);
			}
        },
        error: function (xhr, type, errorThrown) {
            //异常处理；
            console.log(type);
        },
    });
}

// 预警接口
function warningFun() {
    var _url = root + "api/v4/disaster_warning/remind";
	console.log(_url)
    mui.ajax(_url, {
        data: {
			token:token
		},
        dataType: "json", //服务器返回json格式数据
        type: "post", //HTTP请求类型
        success: function (res) {
            console.log(JSON.stringify(res));
			closeStatus++;
			if(closeStatus >= 2){
				plus.nativeUI.closeWaiting();
			}
			
            if (res.code == 1) {
				var listData = res.data.list
				if(listData.length > 0){
					$(".warning").css("display","flex")
					$(".warning .warnings_inner").html("");
					listData.map(item => {
						$(".warning .warnings_inner").append(`
							<div class="warning_text" data-id="${item.id}" onclick="xiangqing(${item.id})">${item.title} ${item.release_at_str}</div>
						`)
					})
					$(".warning .warnings_inner").append(`
						<div class="warning_text" data-id="${listData[0].id}" onclick="xiangqing(${listData[0].id})">${listData[0].title} ${listData[0].release_at_str}</div>
					`)
					// 渲染数据成功后调用预警的动画
					warningAnimation()
				}
				
            }else{
				mui.toast(data.msg);
			}
        },
        error: function (xhr, type, errorThrown) {
            //异常处理；
            console.log(type);
        },
    });
}
// 预警
function warningAnimation(){
	var warningItem = $(".warning .warning_text").length;
	console.log(warningItem)
	var warningN = 0;
	var warningTotal = 0;
	setInterval(function(){
		warningN++;
		$(".warning .warnings_inner").stop().animate({
		    top: -(warningN) * 0.5 + "rem"
		}, 1000,function() {
		    if (warningN == Number(warningItem)-1) {
		        warningN = 0;
		        $(".warning .warnings_inner").css('top', '0rem');
		    } 
		})
	},2000)
}


// 跳转预警详情页面
function xiangqing(ids){
	var params = {
		ids:ids,
		showHistory:true
	};
	jump_new("warning_detail.html", params)
}