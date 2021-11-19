// 获取基础信息
var root = localStorage.getItem("str_url");
var token = localStorage.getItem("token");
if (root == "" || root == undefined || root == null) {
	// mui.openWindow({
	// 	url: 'login.html?cid=1', //通过URL传参
	// 	id: 'login.html?cid=1', //通过URL传参
	// })
}
// 获取token
var new_token = '';
function tokenFun() {
	var _url = root + 'api/v2/meter_statistics/get_token';
	var data = {"token": token}
	console.log(_url);
	console.log(JSON.stringify(data));
	mui.ajax(_url, {
		data: data,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(res) {
			console.log("----------333" + JSON.stringify(res));
			new_token = res.token;
			getStatisticsData()
		},
		error: function(xhr, type, errorThrown) {
			console.log("请求错误");
			console.log(xhr, type, errorThrown);
		}
	})
}
mui.plusReady(function() {
	//			选择时间
	$("#seleDate").on("tap", function() {
		var dtpicker = new mui.DtPicker({
			"type": "month"
		});
		dtpicker.show(function(items) {
			$("#seleDate").val(items.text);
			dtpicker.dispose();
			plus.nativeUI.showWaiting("加载中");
			getStatisticsData()
			console.log(items.text);
		});
	});
	tokenFun()
	getInfoData("",1)
	$("select.dateWaterQuantity").on("change",function(){
		getStatisticsData()
	})
})
/**
 * @description 获取统计数据值
 * @param {type}  
 */
var getDataNum = 0;
function getStatisticsData(){
	plus.nativeUI.closeWaiting();
	var _url = 'http://rural_water.sxjicheng.com/api/v1/meter_statistics/get_data_ajax';
	var city_code =$("#city").val();
	var county_code =$("#county").val();
	var date =$("#seleDate").val();
	var water_number ="";
	var data = {
		"token": new_token,
		"city_code":city_code,		//所在地市
		"county_code":county_code,	//所在区县
		"date":date,				//查询日期
		"water_number":water_number	//水表表号
	}
	console.log(_url);
	console.log(JSON.stringify(data));
	mui.ajax(_url, {
		data: data,
		datatype: 'json', //服务器返回json格式数据
		type: 'GET', //HTTP请求类型
		success: function(res) {
			console.log("----------" + JSON.stringify(res));
			getChars(res)
			getDataNum++ ;//每次请求后增加一，用于判断是否是第一次请求
			
			// 表格插入
			var tableData = res.countTable;
			console.log(JSON.stringify(tableData))
			for (var i = 0; i < tableData.length; i++) {
				var tr_str =	`<tr>
									<td>${tableData[i].city}</td>
									<td>${tableData[i].county}</td>
									<td>${tableData[i].should_connected}</td>
									<td>${tableData[i].already_connected}</td>
								</tr>`;
				$("#waterTable").append(tr_str);
			}
			// 表格插入 end
		},
		error: function(xhr, type, errorThrown) {
			console.log("请求错误");
			console.log(xhr, type, errorThrown);
		}
	})
}

// 用水统计图
function chart(data){	var chart = Highcharts.chart(data.id, {
		chart:{
			marginTop:60
		},		title: {			text: "用水统计图",
			align:"left",
			style:{ "color": "#555555", "fontSize": "16px" },
			y:20		},		yAxis: {			title: {				text: null			}		},		legend: {			enabled:true,
			floating:true,
			align:"right",
			verticalAlign:"top",
			x:0,
			y:0		},		credits:{			enabled:false		},
		tooltip:{
			formatter:function(){
				var newY = this.y;
				if((String(newY).length-3)>String(newY).lastIndexOf('.')){
					return "<span>日　期:"+this.x+"</span><br><span>用水量:"+Highcharts.numberFormat(this.y,2,'.')+"</span>";
				}else{
					return "<span>日　期:"+this.x+"</span><br><span>用水量:"+this.y+"</span>";
				}
			}
		},		plotOptions: {			series: {				label: {					connectorAllowed: false				}			},			line:{				dataLabels: {					enabled: false,					allowOverlap: true, // 允许数据标签重叠
					style: {						fontSize: '12px',						color: '#7CB5EC',						textOutline:"none",						fontWeight: 100,					}				}			}		},		xAxis:{			crosshair: true,			categories:data.categories,			labels:{				style:{					color:'#666666',					fontSize:'14px'				}			},			tickWidth:0,		},		yAxis:{			// tickPositions:[0, 500, 1000, 1500, 2000, 2500],			title: {				enabled: false,			},			labels:{				format: '{value}',				style:{					color:'#666666',					fontSize:'14px'				}			}		},		series: [{			name: '用水量',			data: data.data,			marker: {
				enabled:false
			}		}],	});}

// 统计图调用
function getChars(res){
	var obj = {
		id:"statistical_chart",		data:res.data.dateUserStatisticsArr,		categories:res.data.dateArr	}
	if(getDataNum == 0){
		$("#citynum").text(res.data.cityNum);
		$("#countynum").text(res.data.countyNum);
		$("#totalnum").text(res.data.totalMeterNum);
		$("#waternum").text(res.data.totalUserWaterNum);
	}	$("#month").text(res.data.month);	$("#changetotalnum").text(res.data.totalMeterNum);	$("#changewaternum").text(res.data.totalUserWaterNum);	chart(obj)
}