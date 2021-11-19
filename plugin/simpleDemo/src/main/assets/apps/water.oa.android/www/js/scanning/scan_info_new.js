var root = localStorage.getItem("str_url");
// if (root == "" || root == undefined || root == null) {
// 	mui.openWindow({
// 		url: 'login.html?cid=1', //通过URL传参
// 		id: 'login.html?cid=1', //通过URL传参
// 	})
// }
var token = localStorage.getItem("token");
var dataObj = {};
var hostSequence;
mui.plusReady(function() {
	plus.nativeUI.showWaiting("加载中...");
	// 获取接口地址
	var self = plus.webview.currentWebview();
	hostSequence = self.bar_code;
	console.log(hostSequence)
	dataObj = {
		token: token,
		hostSequence: hostSequence
	}
	console.log(JSON.stringify(dataObj))
	getInfoFun("api/v3/asset/assetRepairs/massage")
})
//本页面查看信息的接口
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
				$(".repair").show()
				res.data.data.map((item,index) => {
					$(".list .lists").append(`
						<div class="line">
						    <div class="left">${item.name}</div>
						    <div class="right">${item.value}</div>
						</div>
					`)
					if(item.name == "序列号"){
						$(".list .lists .line").eq(index).find(".right").append(`
							<img class="eye" src="../../images/scanning/eyes_dark.png" onclick="eyeFun(this)"/>
						`)
					}
				})
			}else{
				$(".list .lists").append(`
					<div style="width:100%;margin:0 auto;height:2rem;text-align:center;line-height:2rem;background-color: #f5f5f9;">
						<span style="font-size:0.3rem;color:#666;">暂无此设备</span>
					</div>
				`)
				$(".header .right").hide()
			}
		},
		error: function(xhr, type, errorThrown) {
			console.log(errorThrown)
			plus.nativeUI.closeWaiting();
		}
	})
}

// 点击按钮操作
$(".repair").on("click",function(){
	if($(this).text() === "我要报修"){
		$(this).text("确认报修");//按钮内容
		$(".remarks2").show();//显示报修说明
	}else{
		if($(".remarks2 .description").val() && $(".remarks2 .description").val() != "必填"){
			//确认报修的接口
			jumpSuccessFun("api/v3/asset/assetRepairs/new")
		}else{
			mui.toast('请填写报修说明', {
				duration: 'long',
				verticalAlign: 'top',
				type:'div'
			})
			return false
		}
	}
})
//报修说明的时候为空
$(".remarks2 .description").on('click',function(){
	if($(this).val() === "必填"){
		$(this).val('')
	}
	$(this).css('color','#666')
})
//确认报修跳转
function jumpSuccessFun(urls){
	let _url = root + urls;
	console.log(_url);
	dataObj = {
		token: token,
		hostSequence: hostSequence,
		content:$(".remarks2 .description").val()
	}
	console.log(JSON.stringify(dataObj))
	mui.ajax(_url, {
		data: dataObj,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(res) {
			console.log(JSON.stringify(res))
			plus.nativeUI.closeWaiting();
			if (res.code == 1) {
				mui.openWindow({
					url: 'submit_success.html', //通过URL传参
					id: 'submit_success.html',
				})
			}else if(res.code == 101){
				mui.toast(res.msg, {
					duration: 'long',
					verticalAlign: 'top',
					type:'div'
				})
				return false
			}
		},
		error: function(xhr, type, errorThrown) {
			console.log(errorThrown)
			plus.nativeUI.closeWaiting();
		}
	})
	
}
//报修记录跳转
function jumpHistory(){
	mui.openWindow({
		url: 'repair_history.html', //通过URL传参
		id: 'repair_history.html',
		extras:{
			hostSequence:hostSequence
		}
	})
}

// 序列号的显隐控制
function eyeFun(thisDom){
	if(thisDom.getAttribute('class') == 'eye'){
		thisDom.setAttribute('class','eye active');
		thisDom.setAttribute('src','../../images/scanning/eyes_light.png');
	}else{
		thisDom.setAttribute('class','eye');
		thisDom.setAttribute('src','../../images/scanning/eyes_dark.png');
	}
}