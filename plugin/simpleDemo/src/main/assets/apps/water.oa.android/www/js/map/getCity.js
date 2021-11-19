function getInfoData(code, level ,id) {
	console.log(code, level);
	var root = localStorage.getItem("str_url");
	var token = localStorage.getItem("token");
	var _url = root + 'api/rural/citiestowns';
	mui.ajax(_url, {
		data: {
			"token": token,
			"code": code,
			"level": level
		},
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			console.log("----------" + JSON.stringify(data));
			var city = "";
			if (data.code == 1) {
				// city += "<option value=''>全部</option>";
				for (let key in data.data) {
					city += "<option value='" + data.data[key].code + "'>" + data.data[key].name + "</option>";
				}
				$(id).append(city);
			}
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
}


getInfoData("",1,".select_shi")



