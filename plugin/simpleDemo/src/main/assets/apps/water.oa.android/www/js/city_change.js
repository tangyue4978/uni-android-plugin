//条件查询
/**
 * @param {Object} city 地市
 * @param {Object} county 县区
 * @param {Object} town 村
 */
function getInfoData(code, level) {
	console.log(code, level);
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
			var county = "";
			var town = "";
			var village = "";
			if (data.code == 1) {
				switch (level) {
					case 1:
						city += "<option value=''>全部</option>";
						for (let key in data.data) {
							// console.log(JSON.stringify(data.data[key]));
							city += "<option value='" + data.data[key].code + "'>" + data.data[key].name + "</option>";
						}

						county = "<option value=''>全部</option>";
						town = "<option value=''>全部</option>";
						village = "<option value=''>全部</option>";
						$("#city").html(city);
						$("#county").html(county);
						// $("#town").html(town);
						// $("#village").html(village);
						getInfoData($("#city").val(), 2);
						break;
					case 2:
						county += "<option value=''>全部</option>";
						for (let key in data.data) {
							console.log(JSON.stringify(data.data[key]));
							county += "<option value='" + data.data[key].code + "'>" + data.data[key].name + "</option>";
						}

						town = "<option value=''>全部</option>";
						village = "<option value=''>全部</option>";
						$("#county").html(county);
						// $("#town").html(town);
						// $("#village").html(village);
						// getInfoData($("#county").val(),3);
						break;
						// case 3:
						// 	for (let key in data.data) {
						// 		console.log(JSON.stringify(data.data[key]));
						// 		town += "<option value='"+data.data[key].code+"'>"+data.data[key].name+"</option>";
						// 	}
						// 	town += "<option value=''>全部</option>";
						// 	village = "<option value=''>全部</option>";
						// 	$("#town").html(town);
						// 	$("#village").html(village);
						// 	getInfoData($("#town").val(),4);
						// 	break;
						// case 4:
						// 	for (let key in data.data) {
						// 		console.log(JSON.stringify(data.data[key]));
						// 		village += "<option value='"+data.data[key].code+"'>"+data.data[key].name+"</option>";
						// 	}
						// 	village += "<option value=''>全部</option>";
						// 	$("#village").html(village);
						// 	break;
					default:
						for (let key in data.data) {
							console.log(JSON.stringify(data.data[key]));
							city += "<option value='" + data.data[key].code + "'>" + data.data[key].name + "</option>";
						}
						county = "<option value=''>全部</option>";
						town = "<option value=''>全部</option>";
						village = "<option value=''>全部</option>";
						$("#city").html(city);
						$("#county").html(county);
						// $("#town").html(town);
						// $("#village").html(village);
						break;
				}
			}
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
}

//查询
var $cityType = "";
//查询选择联动-地市
$("body").on("change", "#city", function() {
	$cityType = 2;
	var $cityVal = $("#city").val();
	if ($cityVal == "") {
		getInfoData("", 1);
	} else {
		getInfoData($cityVal, $cityType);
	}

})


/**
 * @description 追加筛选条件
 * @param {Object} id
 * @param {Object} obj 
 * 	// "listSearchConfig": [{
	// 		"name": "工程名称",
	// 		"key": "keywords",
	// 		"type": "input"
	// 	}, {
	// 		"name": "水源类型",
	// 		"key": "water_source_type",
	// 		"type": "select",
	// 		"options": {
	// 			"1": "地表水",
	// 			"2": "地下水",
	// 			"3": "联合水源"
	// 		}
	// 	}]
 */
function newHtmlAdd(id,obj){
	var new_search_html = "";
	for (var i = 0; i < obj.length; i++) {
		var item = obj[i];
		switch (item.type){
			
			case "input":
				var n_html = 	`<li>
									<label class = "label" > ${item.name} </label>
									<div class = "field" >
										<input class = "input submit_item" name="${item.key}" />
									</div>
								</li>`;
				break;
			case "select":
				var option_h = '<option value="">全部</option>';
				for (let var1 in item.options) {
					var k_val = item.options[var1];
					var k_key = var1;
					option_h += '<option value="'+k_key+'">'+k_val+'</option>';
				}
				var n_html = 	`<li>
									<label class = "label" > ${item.name} </label>
									<div class = "field" >
										<select class = "input submit_item" name="${item.key}" >${option_h}</select>
									</div>
								</li>`;
				break;
			default:
				console.log("无效的类型");
				var n_html ='';
				break;
		}
		
		new_search_html +=n_html;
	}
	$(id).append(new_search_html)
}
