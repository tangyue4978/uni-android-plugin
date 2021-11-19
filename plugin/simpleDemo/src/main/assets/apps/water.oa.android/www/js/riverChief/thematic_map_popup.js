function selectFun(layerName_arr) {
	var parameter = arguments;
	var scales = "";
	console.log(JSON.stringify(parameter));
	var lassname_select = "";
	var select = new ol.interaction.Select({
		condition: ol.events.condition.click,
		layers: function(feature) {
			lassname_select = feature.className_;
			console.log(feature.className_);
			// console.log(layerName_arr.indexOf(feature.className_));
			if (layerName_arr.indexOf(feature.className_) != -1) {
				console.log(feature);
				return true;
			} else {
				return false;
			}
		},
		hitTolerance: 2,
		style: function(feature, resolution) {
			// console.log(feature, resolution)
			var zoom = map.getView().getZoom();
			try {
				// console.log(feature.className_);
				var newStyle = new ol.style.Style({
					stroke: new ol.style.Stroke({
						// lineDash: [20, 20],
						color: "#f39b45",
						width: 5,
					})
				});
				return [newStyle];
				// }
			} catch (e) {
				//TODO handle the exception
				return null;
			}
		},
	});
	select.on("select", function(e) {
		// console.log(222222)
		map.getOverlays().clear();
		e.stopPropagation()
		var features = e.target.getFeatures().getArray();
		// console.log(lassname_select);
		var item_info = features[0];
		var vectorLayers = {
			className_: lassname_select
		};
		addPopup(item_info, vectorLayers, parameter[2]);
	});
	map.addInteraction(select);
}

// 地图点击弹出框start
function addPopup(item_info, vectorLayers, layers, showMarker) {
	console.log(item_info.values_.geometry.extent_);
	console.log(item_info.values_.name);
	console.log(item_info);
	// console.log(JSON.stringify(vectorLayers));
	// console.log(JSON.stringify(layers));
	// console.log(JSON.stringify(showMarker));


	addMapClickFun(item_info, vectorLayers)
}

function stopFunction() {
	event.stopPropagation();
	event.preventDefault();
}

function addMapClickFun(item_info, vectorLayers) {
	var root = localStorage.getItem("str_url");
	var token = localStorage.getItem("token");
	var _url = root + 'api/v3/riverchief/riverchiefriver/map_show';
	var data_info = {
		"token": token,
		"riverName": item_info.values_.name
	}
	console.log(_url);
	console.log(JSON.stringify(data_info));
	mui.ajax(_url, {
		data: data_info,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(res) {
			plus.nativeUI.closeWaiting();
			console.log(JSON.stringify(res))
			if (res.code == 1) {
				popFun(item_info, vectorLayers, res)
			} else {
				mui.toast(res.msg);
			}
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
			console.log("接口错误")
		}
	})


}

function popFun(item_info, vectorLayers, res) {

	var levelList = res.data.levelList;
	var baseInfo = res.data.baseInfo;
	var info_html = "";
	for (let index in levelList) {

		var info = `<div class="item">
						<div class="item_title">${levelList[index].value}</div>
						<div class="item_cont">${levelList[index].name}</div>
					</div>`;
		info_html += info;

	}
	var table_tr_html = "";
	for (var i = 0; i < baseInfo.length; i++) {
		var td_html_str = "";
		for (var j = 0; j < baseInfo[i].length; j++) {
			if (baseInfo[i].length == 1) {
				var td_html =
					`<th class="bt">${baseInfo[i][j].name}</th><td class="bc" colspan="3">${baseInfo[i][j].value}</td>`;
			} else {
				var td_html = `<th class="bt">${baseInfo[i][j].name}</th><td class="bc">${baseInfo[i][j].value}</td>`;
			}
			td_html_str += td_html;
		}
		var table_html = `<tr>
							${td_html_str}
						</tr>`;
		table_tr_html += table_html;
	}

	let new_id = "popup_" + item_info.values_.Id;
	// let lng = 112.2511243100727;
	// let lat = 37.39358137831349;
	let lng = ((item_info.values_.geometry.extent_[0] - 0) + (item_info.values_.geometry.extent_[2] - 0)) / 2;
	let lat = ((item_info.values_.geometry.extent_[1] - 0) + (item_info.values_.geometry.extent_[3] - 0)) / 2;
	console.log(lng, lat);
	// 提示框获取
	var aHtml = `
					<div id="${new_id}" class="thematic_popup_box" data-popup="${new_id}" onclick="stopFunction()">
						<div >
							<h2 class="h2">${item_info.values_.name}</h2>
							<div class="item_box">
								${info_html}
							</div>
							<div class="table_box" onclick="xiangqing(${res.data.id})">
								<table class="the_table" border="" cellspacing="" cellpadding="">
									
									${table_tr_html}
								</table>
							</div>
						</div>
					</div>
				`;
	$("#body").append(aHtml);
	var popup = new ol.Overlay({
		id: new_id,
		element: document.getElementById(new_id), // 将自己写的 html 内容添加到覆盖层，html 内容略
		position: [lng, lat], // 覆盖层位置
		positioning: "center-center", // 覆盖层位置
		//autoPan: true,             // 是否自动平移，当点击时对话框超出屏幕边距，会自动平移地图使其可见
		// autoPanMargin: 20,       // 设置自动平移边距
		dragging: false, //
		offset: [0, 0],
		shadeClose: false,
		className: new_id, // 覆盖物在覆盖层的类名
		stopEvent: true,
	});

	map.addOverlay(popup);
	map.getView().animate({
		center: [lng, lat],
		duration: 1200,
	});
}


function xiangqing(item_id) {
	console.log('详情参数' + item_id)
	mui.openWindow({
		url: "./thematic_detail.html", //通过URL传参
		id: "./thematic_detail.html", //通过URL传参
		extras: {
			item_id: item_id,
		},
	});
}
