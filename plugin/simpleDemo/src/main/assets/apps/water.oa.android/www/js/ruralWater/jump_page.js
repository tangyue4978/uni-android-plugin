/**
 * @param {Object} new_url 跳转路径
 */
function jump_hide(new_url,de_param){
	var param = de_param || {}
	console.log(JSON.stringify(param));
	mui.openWindow({
		url: new_url, //通过URL传参
		id: new_url ,//通过URL传参
		extras:param
	})
	setTimeout(function(){
		plus.webview.currentWebview().hide();
	},200);
	setTimeout(function(){
		plus.webview.currentWebview().close();
	},280);
}

/**
 * @param {String} new_url 跳转路径
 * @param {String} de_param {'type':6};可不传，不传默认为空对象
 * jump_new('dataList.html',{'type':6})
 */
function jump_new(new_url,de_param){
	var param = de_param || {}
	console.log(JSON.stringify(param));
	mui.openWindow({
		url: new_url, //通过URL传参
		id: new_url ,//通过URL传参
		extras:param
	})
}