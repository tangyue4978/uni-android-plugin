var area_list = {}


var pickerArea_pickers0 = 0;
var pickerArea_pickers1 = 0;
function getArea(data_info,obj) {
	var itemid = obj != undefined ? obj.itemid : "#city_sort";
	console.log(JSON.stringify(data_info));
	var _url = root + 'api/rural/citiestownstree';
	console.log(_url);
	mui.ajax(_url, {
		data: data_info,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(res) {
			console.log(JSON.stringify(res));
			area_list = res;
			
			$(itemid).on("click", function() {
				var pickerArea = new mui.PopPicker({
					layer: 2
				});
				pickerArea.setData(area_list.data)
				pickerArea.pickers[0].setSelectedIndex(pickerArea_pickers0);
				pickerArea.pickers[1].setSelectedIndex(pickerArea_pickers1);
				pickerArea.show(function(e) {
					console.log(pickerArea.pickers[0].lastIndex);
					console.log(pickerArea.pickers[1].lastIndex);
					pickerArea_pickers0 = pickerArea.pickers[0].lastIndex;
					pickerArea_pickers1 = pickerArea.pickers[1].lastIndex;
					var city_name = pickerArea.pickers[0].items[pickerArea.pickers[0].lastIndex].text;
					var county_name = pickerArea.pickers[1].items[pickerArea.pickers[1].lastIndex].text;
					var city_value = pickerArea.pickers[0].items[pickerArea.pickers[0].lastIndex].value;
					var county_value = pickerArea.pickers[1].items[pickerArea.pickers[1].lastIndex].value;
					console.log(city_name, county_name, city_value, county_value);
					if (county_value != "") {
						$(itemid).val(city_name + "-" + county_name);
						$(itemid).attr("data-code", city_value + "-" + county_value);
					} else {
						$(itemid).val(city_name);
						$(itemid).attr("data-code", city_value);
					}
					shaixuanFun()
					pickerArea.dispose()
				})
			})
		},
		error: function(xhr, type, errorThrown) {
			console.log(xhr, type, errorThrown)
			plus.nativeUI.closeWaiting();
		}
	})
}




