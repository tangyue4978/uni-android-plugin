var root = localStorage.getItem("str_url");
if(root == "" || root == undefined || root == null){
		mui.openWindow({
		url: 'login.html?cid=1', //通过URL传参
		id: 'login.html?cid=1', //通过URL传参
	})
}
var token = localStorage.getItem("token");
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	plus.nativeUI.showWaiting("加载中...");
	getInfoData("",1);
	supplyWaterInformationFun();//供水工程信息汇总图表
	supplyWaterInformationFuns();//供水工程信息汇总表格
	
	// touzihuizong();//投资信息汇总
	touzihuizongs();//投资信息汇总图表
	
	situationDetails('');//工程情况图表
	
	facilitiesDetail();//设施情况
	facilitiesDetails();//设施情况图表
	
	manageDetail("");//管理情况
	manageDetails("");//管理情况图表
	
	workedDetail();//运行情况
	workedDetails();//运行情况图表
	
	qualityDetail();//水质情况
	qualityDetails();//水质情况图表
	
});
// 供水工程信息汇总图表
function supplyWaterInformationFun(){
	var _url = root + 'api/rural/informationsummary';
	mui.ajax(_url, {
		data: {
			"token": token
		},
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(res) {
			first_data = {
				id:"barChart_first",
				title:res.title,
				y_title:res.y_title,
				tooltip:res.tooltip,
				series:{
					name:res.name,
					data:res.data
				}
			}
			barChartFirst(first_data);
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
}
//供水工程信息汇总表格
function supplyWaterInformationFuns(){
	var _url = root + 'api/v2/summary/projectinfo';
	mui.ajax(_url, {
		data: {
			"token": token
		},
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(res) {
			console.log("----------"+JSON.stringify(res.data.countArr));
			rowsHeadData = res.data.countArr;
			for(let i=0;i<rowsHeadData.length;i++){
				var td_html = '';
				td_html += '<tr><td class="td_head">'+rowsHeadData[i].name+'</td><td>'+rowsHeadData[i].data+'</td></tr>'
				$('#xxhz').after(td_html)
			}
			
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
	
}

// 投资信息汇总
// 投资信息汇总图表
function touzihuizongs(){
	var _url = root + 'api/v2/summary/investment';
	mui.ajax(_url, {
		data: {
			"token": token
		},
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(res) {
			console.log(JSON.stringify(res.data.result.length))			
			//图表
			var tdata = ''
			touzihuizongs_data = {
				tdata : res.data.xArr,
				list :res.data.series
			}
			//表格
			var headArr = res.data.contType;
			var th_html = '';
			for(var i= 0;i<headArr.length;i++){
				th_html += `<td class="th_head">${headArr[i]}</td>`
			}
			$('#tzxxhz').append(th_html);
			
			var tbody = res.data.result;
			var tt_html = '';
			for(var j=0;j<tbody.length;j++){
				var td1 = tbody[j].data.sum_buildtotalinvestment.val.toFixed(2);
				var td2 = tbody[j].data.sum_buildCentralInvestment.val.toFixed(2);
				var td3 = tbody[j].data.sum_yearactualsupply.val.toFixed(2);
				var td4 = tbody[j].data.sum_watersupplypeople.val.toFixed(2);
				var td5 = tbody[j].data.sum_wellNumber.val.toFixed(2);
				var td6 = tbody[j].data.num.val.toFixed(2);
				tt_html += `<tr>
					<td class="th_head">${tbody[j].name}</td>
					<td>${td1}</td>
					<td>${td2}</td>
					<td>${td3}</td>
					<td>${td4}</td>
					<td>${td5}</td>
					<td>${td6}</td>
					</tr>`
			}
			$('#tzxxhzs').append(tt_html);
			colChartInvest('colChart_invest',touzihuizongs_data);
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
}


//条件查询
/**
 * @param {Object} city 地市
 */
function getInfoData(code,level){
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
			console.log("----------"+JSON.stringify(data));
			var city = "<option value=''>全部</option>";
			if(data.code == 1) {
				for (let key in data.data) {
					console.log(JSON.stringify(data.data[key]));
					city += "<option value='"+data.data[key].code+"'>"+data.data[key].name+"</option>";
				}
				$("#city").html(city);
			}
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
}

//农村饮水工程情况汇总表格
// 供水工程信息汇总图表
function situationDetails(){
	var _url = root + 'api/v2/summary/situation';
	mui.ajax(_url, {
		data: {
			"token": token
		},
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(res) {
			// console.log("----------"+JSON.stringify(res.data));
			// 图表
			situationDetails_data = {
				xDatas:res.data.xArr,
				lengend:res.data.chart[0].name,
				lengends:res.data.chart[1].name,
				yData:res.data.chart[0].data,
				yDatas:res.data.chart[1].data,
			}
			// 表格
			var data = JSON.stringify(res.data);
			// console.log(res.data.titleAttr[0].name);
			var titleAttr = res.data.titleAttr;//表格标题
			var contType = res.data.contType;//表格标题属性
			var dataArr = res.data.dataArr;
			var tb_html = '';
			for(let i=0;i<titleAttr.length;i++){
				var  tt_html = '';
				let rowspan = titleAttr[i].rowspan;
				let colspan = titleAttr[i].colspan;
				tt_html +='<td class="th_head" rowspan="'+rowspan+'" colspan="'+colspan+'">'+titleAttr[i].name+'</td>';
				$("#gcqkhz_tt").append(tt_html);
			}
			for(let i=0;i<contType.length;i++){
				var  th_html = '';
				// console.log(contType[i]);
				th_html +=`<td class="th_head">${contType[i]}</td>`;
				$("#gcqkhz_th").append(th_html);
			}
			var td_html = '';
			for(let i=0;i<dataArr.length;i++){
				var name  = dataArr[i].name;
				var data = dataArr[i].data;
				var rowspan_num  = data.length;
				var outside = ''
				for(let i=0;i<data.length;i++){
					// console.log(data[i])
					var datas = data[i];
					var inner ='';
					var rowspan_num2 = 0;
					if(i == 0){
						rowspan_num2 = rowspan_num;
						inner += `<td class="th_head" rowspan='${rowspan_num2}'>${name}</td>`;
					}
					for(let i=0;i<datas.length;i++){
						inner += `<td style="width:2rem;">${datas[i]}</td>`;
					}
					// console.log(inner)
					outside += `<tr>${inner}</tr>`;
				}
				// console.log(outside)
				td_html += outside;
			}
			// console.log(td_html);
			$('#gcqkhz').append(td_html);
			dcolChartInvest('dcolChart_invest',situationDetails_data);
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
}

//农村饮水工程设施情况汇总表图表
function facilitiesDetails(){
	var _url = root + 'api/v2/summary/facilities';
	mui.ajax(_url, {
		data: {
			"token": token
		},
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(res) {
			// console.log("----------"+JSON.stringify(res.data.list));
			var list = res.data.list;
			// 图表
			var listArr = [];
			var seriesArr = [];
			for(let i=0;i<list.length;i++){
				var name = list[i].name;
				listArr.push(name);
				var list_data = list[i].list[0];
				seriesArr.push(list_data);
			}
			facilitiesDetails_data = {
				seriesData : listArr,
				seriesDatas : seriesArr
			}
			console.log(facilitiesDetails_data.seriesDatas)
			barChartFirstT('barChartT',facilitiesDetails_data);
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
}
//农村饮水工程设施情况汇总表
function facilitiesDetail() {
	var _url = root + 'api/rural/facilitysummary';
	console.log(_url);
	mui.ajax(_url, {
		data: {
			"token": token,
			// "code":1401,
		},
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			// console.log("----------"+JSON.stringify(data));
			if(data.code == 1) {
				var namelist = data.namelist;//左侧表格参数
				var namelist_html = '<tr><td class="th_head">　</td></tr>';
				var datalist = data.data;//数据
				var datalist_list = data.data[0].list;//数据
				var datalist_html = "";
				namelist.forEach(function(item,index){
					namelist_html += '<tr>'+
									'<td>'+item+'</td>'+
									'</tr>';
				})
				$(".facilitiesTable .left").children("table").html(namelist_html);
				for (var i = -1; i < datalist_list.length; i++) {
					var html_td = "";
					for(var j = 0; j < datalist.length; j++){
						if(i<0){
							html_td += `<td>${datalist[j].name}</td>`;
						}else{
							html_td += `<td>${datalist[j].list[i]}</td>`;
						}
						
					}
					datalist_html += `<tr>${html_td}</tr>`
				}
				$(".facilitiesTable .right").children("table").html(datalist_html);
				
				$(".mui-loading").css("display", "none")
			}
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
}

//农村饮水工程管理情况汇总表图表
function manageDetails(){
	var _url = root + 'api/v2/summary/manage';
	mui.ajax(_url, {
		data: {
			"token": token
		},
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(res) {
			console.log("----------"+JSON.stringify(res.data.chartManagement));
			var list = res.data.chartProject;
			var lists = res.data.chartManagement;
			// 图表
			var names = '';
			var ys = '';
			var nameArrs = [];
			var yArrs = [];
			var name = '';
			var y = '';
			var nameArr = [];
			var yArr = [];
			for(n in list){
				nameArrs.push(list[n].name);
				yArrs.push(list[n].y)
			};
			for(k in lists){
				nameArr.push(lists[k].name);
				yArr.push(lists[k].y)
			}
			manageDetails_data = {
				names : nameArrs,
				ys : yArrs,
				name : nameArr,
				y : yArr,
			}
			pieChartFirst('pieChart',manageDetails_data);
			pieChartFirst('pieCharts',manageDetails_data);
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
}
//农村饮水工程管理情况汇总表
function manageDetail(city_id) {
	var _url = root + 'api/rural/managesummary';
	console.log(_url);
	mui.ajax(_url, {
		data: {
			"token": token,
			"code":city_id,
		},
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			// console.log("----------"+JSON.stringify(data));
			if(data.code == 1) {
				var namelist = data.namelist;//左侧表格参数
				var namelist_html = "";
				var datalist = data.data;//数据
				var datalist_list = data.data[0];//数据
				var datalist_html = "";
				for(var m = 0; m<namelist.length;m++){
					var item = namelist[m];
					if(item.option){
						for(var n = 0; n<item.option.length;n++){
							if(n==0){
								namelist_html += '<tr>'+
												'<td rowspan= "'+item.option.length+'"><div class="tdBox">'+item.name+'</div></td>'+
												'<td ><div class="tdBox">'+item.option[n].name+'</div></td>'+
												'</tr>';
							}else{
								// console.log(item.option[n].name);
								namelist_html += '<tr>'+
												'<td><div class="tdBox">'+item.option[n].name+'</div></td>'+
												'</tr>';
							}
							
						}
					}else{
						namelist_html += '<tr>'+
										'<td colspan="2"><div class="tdBox">'+item.name+'</div></td>'+
										'</tr>';
					}
				}
				
				$(".manageTable .left").children("table").append(namelist_html);
				for (var i = 0; i < datalist_list.length; i++) {
					var html_td = "";
					for(var j = 0; j < datalist.length; j++){
						html_td += `<td><div class="tdBox">${datalist[j][i]}</div></td>`;
					}
					datalist_html += `<tr>${html_td}</tr>`
				}
				$(".manageTable .right").children("table").html(datalist_html);
				
				$(".mui-loading").css("display", "none")
			}
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
}

// 农村饮水工程运行情况汇总图表
function workedDetails(){
	var _url = root + 'api/v2/summary/working';
	mui.ajax(_url, {
		data: {
			"token": token
		},
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(res) {
			// console.log("----------"+JSON.stringify(res.data.chart[0].data));
			var list = res.data.list;
			// 图表
			var seriesArr1 = [];
			var seriesArr2 = [];
			var seriesArr3 = [];
			for(let i=0;i<list.length;i++){
				var list_data1 = list[i].list[0];
				seriesArr1.push(Math.floor(list_data1));
				
				var list_data3 = list[i].list[1];
				seriesArr3.push(Math.floor(list_data3));
			}
			workedDetails_data = {
				zData : res.data.xArr,
				yName1: res.data.chart[0].name,
				yName2: res.data.chart[1].name,
				yName3: res.data.chart[2].name,
				yData1 :res.data.chart[0].data,
				yData2 :res.data.chart[1].data,
				yData3 :res.data.chart[2].data,
			}
			// console.log(JSON.stringify(workedDetails_data))
			lineChartFirst('lineChart',workedDetails_data);
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
}
//农村饮水工程运行情况汇总表
function workedDetail() {
	var _url = root + 'api/rural/runsummary';
	console.log(_url);
	mui.ajax(_url, {
		data: {
			"token": token,
			// "code":1401,
		},
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			// console.log("----------"+JSON.stringify(data));
			if(data.code == 1) {
				var namelist = data.namelist;//左侧表格参数
				var namelist_html = '<tr><td class="th_head">　</td></tr>';
				var datalist = data.data;//数据
				var datalist_list = data.data[0].list;//数据
				var datalist_html = "";
				namelist.forEach(function(item,index){
					namelist_html += '<tr>'+
									'<td style="white-space:nowrap">'+item+'</td>'+
									'</tr>';
				})
				$(".workedTable .left").children("table").html(namelist_html);
				for (var i = -1; i < datalist_list.length; i++) {
					var html_td = "";
					for(var j = 0; j < datalist.length; j++){
						if(i<0){
							html_td += `<td>${datalist[j].name}</td>`;
						}else{
							html_td += `<td>${datalist[j].list[i]}</td>`;
						}
					}
					datalist_html += `<tr>${html_td}</tr>`
				}
				$(".workedTable .right").children("table").html(datalist_html);
				$(".mui-loading").css("display", "none")
			}
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
}



//农村饮水工程水质情况汇总表图表
function qualityDetails(){
	var _url = root + 'api/v2/summary/quality';
	mui.ajax(_url, {
		data: {
			"token": token
		},
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(res) {
			// console.log("----------"+JSON.stringify(res.data.resultArr.length));
			var list = res.data.resultArr;
			// 图表
			var listArr = [];
			var seriesArr = [];
			for(var i=0;i<list.length;i++){
				var name = list[i].name;
				listArr.push(name)
				var data = list[i].data[0].project
				seriesArr.push(data)
			}
			qualityDetails_data = {
				seriesData : listArr,
				seriesDatas : seriesArr
			}
			barChartFirstC('barChartC',qualityDetails_data);
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
}
//农村饮水工程水质情况汇总
function qualityDetail(){
	var _url = root + 'api/rural/waterqualitysummary';
	console.log(_url);
	mui.ajax(_url, {
		data: {
			"token": token,
		},
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(data) {
			plus.nativeUI.closeWaiting();
			// console.log("----------"+JSON.stringify(data));
			if(data.code == 1) {
				var namelist = data.namelist;//左侧表格参数
				var namelist_html = "";
				var datalist = data.data;//数据
				var datalist_list = data.data[0];//数据
				var datalist_html = "";
				for(var m = 0; m<namelist.length;m++){
					var item = namelist[m];
					if(item.option){
						for(var n = 0; n<item.option.length;n++){
							if(n==0){
								namelist_html += '<tr>'+
												'<td rowspan= "'+item.option.length+'"><div class="tdBox">'+item.name+'</div></td>'+
												'<td ><div class="tdBox">'+item.option[n].name+'</div></td>'+
												'</tr>';
							}else{
								// console.log(item.option[n].name);
								namelist_html += '<tr>'+
												'<td><div class="tdBox">'+item.option[n].name+'</div></td>'+
												'</tr>';
							}
							
						}
					}else{
						namelist_html += '<tr>'+
										'<td colspan="2"><div class="tdBox">'+item.name+'</div></td>'+
										'</tr>';
					}
				}
				
				$(".qualityTable .left").children("table").append(namelist_html);
				for (var i = 0; i < datalist_list.length; i++) {
					var html_td = "";
					for(var j = 0; j < datalist.length; j++){
						html_td += `<td><div class="tdBox">${datalist[j][i]}</div></td>`;
					}
					datalist_html += `<tr>${html_td}</tr>`
				}
				$(".qualityTable .right").children("table").html(datalist_html);
				
				$(".mui-loading").css("display", "none")
			}
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
		}
	})
}