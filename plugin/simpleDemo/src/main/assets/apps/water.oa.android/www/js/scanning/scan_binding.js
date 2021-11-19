var root = localStorage.getItem("str_url");
if (root == "" || root == undefined || root == null) {
	mui.openWindow({
		url: 'login.html?cid=1', //通过URL传参
		id: 'login.html?cid=1', //通过URL传参
	})
}
var token = localStorage.getItem("token");
var apis = '';
var dataObj = {};
mui.plusReady(function() {
	// 条形编码
	var self = plus.webview.currentWebview();
	// 获取接口地址
	apis = self.apiurl;
	// console.log(JSON.stringify(self.opener()))
	if (plus.webview.currentWebview().opener()) {
		plus.webview.currentWebview().opener().close();
	}
	console.log(self.bar_code)
	$('.bar .bar_code').val(self.bar_code)
	// plus.nativeUI.showWaiting("加载中...");
	// 获取当前日期
	var datatime = new Date();
	var data_tiem = datatime.getFullYear() + "-" + (String(datatime.getMonth() + 1).length < 2 ? '0' + ((
		datatime.getMonth() +
		1)) : (datatime.getMonth() + 1)) + "-" + (String(datatime.getDate()).length < 2 ? '0' + datatime
		.getDate() : datatime
		.getDate());
	$('#muiPicker').text(data_tiem)
	// 默认调用设备类型
	deviceFun()
})


// 提交按钮事件
function submitFun() {
	if ($('.infos_right .usePlace').val() == '') {
		mui.toast('请填写使用地点', {
			duration: 'long',
			type: 'div'
		})
		return false
	}
	if ($('.infos_right .user').text() == '' || $('.infos_right .user').text() == "选择部门/人员") {
		mui.toast('请选择使用人', {
			duration: 'long',
			type: 'div'
		})
		return false
	}
	if ($('.infos_right .deviceType').val() == '') {
		mui.toast('请选择设备类型', {
			duration: 'long',
			type: 'div'
		})
		return false
	}
	if ($('.infos_right #muiPicker').text() == '') {
		mui.toast('请选择绑定日期', {
			duration: 'long',
			type: 'div'
		})
		return false
	}

	// 图片判断
	jugeImg();
}


// 重新扫描事件
function jump_scann() {
	mui.openWindow({
		url: 'scan_index.html', //通过URL传参
		id: 'scan_index.html',
	})
}


// 部门人员选择
var currentValue; //使用人id
var currentMemeber; //使用人真实姓名
var partVlaue; //部门id
var partName; //部门名称
function department() {
	let _url = root + 'api/assets_manage/user';
	// _url = "http://10.14.5.64:8081/api/assets_manage/user"
	console.log(_url);
	mui.ajax(_url, {
		data: {
			token: token
		},
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(res) {
			// console.log(JSON.stringify(res))
			plus.nativeUI.closeWaiting();
			if (res.code == 1) {
				var picker = new mui.PopPicker({
					layer: 2
				});
				picker.setData(res.data)
				picker.pickers[0].setSelectedIndex(0);
				picker.pickers[1].setSelectedIndex(0);
				picker.show(function(e) {
					var department = picker.pickers[0].items[picker.pickers[0].lastIndex].text
					var memeber = picker.pickers[1].items[picker.pickers[1].lastIndex].text
					// console.log(department)
					// console.log(memeber)
					$('.infos_right .user').text(department + '-' + memeber)
					currentValue = picker.pickers[1].items[picker.pickers[1].lastIndex].value
					currentMemeber = memeber;
					partVlaue = picker.pickers[0].items[picker.pickers[0].lastIndex].value
					partName = department
				})
			} else {
				plus.nativeUI.toast(res.msg)
			}
		},
		error: function(xhr, type, errorThrown) {
			console.log(errorThrown)
			plus.nativeUI.closeWaiting();
		}
	})
}


// 设备类型
var typeStatus = true;

function deviceFun() {
	let _url = root + 'api/assets_manage/type';

	mui.ajax(_url, {
		data: {
			token: token
		},
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(res) {
			console.log(JSON.stringify(res))
			plus.nativeUI.closeWaiting();
			if (res.code == 1) {
				if (typeStatus) {
					for (let i = 0; i < res.data.length; i++) {
						$(".deviceType").append(`
							<option value="${res.data[i].value}">${res.data[i].type}</option>
						`)
					}
				}
				typeStatus = false
			} else {
				plus.nativeUI.toast(res.msg)
			}
		},
		error: function(xhr, type, errorThrown) {
			console.log(errorThrown)
			plus.nativeUI.closeWaiting();
		}
	})
}

// 备注说明聚焦清空
$('.remarks .remarks_area').on('focus', function() {
	$(this).val('')
})
//本页面的接口
function jumpSuccessFun() {
	let _url = root + apis;
	console.log(_url);
	dataObj = {
		token: token,
		serial_number: $('.bar .bar_code').val(), // 获取接口的条形编码
		// serial_number: $('.infos_right .serialNumber').val(), // 设备序列号
		// host_model: $('.infos_right .hostNum').val(), // 主机型号
		use_site: $('.infos_right .usePlace').val(), // 使用地点
		// usage_mode: $('.infos_right .usage input:checked').val(), // 使用方式   1公用,2私用
		user_id: currentValue, // 使用人id
		user_name: currentMemeber, // 使用人真实姓名
		department_id: partVlaue, // 所属部门id
		department_name: partName, // 所属部门名称
		computer_type: $('.infos_right .deviceType').val(), //设备类型
		binding_date: $("#muiPicker").text(), // 绑定日期
		remark: $('.remarks .remarks_area').val(), //备注
		pic:imgList,//上传图片数组
	}
	console.log(JSON.stringify(dataObj))
	mui.ajax(_url, {
		data: dataObj,
		datatype: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		success: function(res) {
			plus.nativeUI.closeWaiting();
			if (res.code == 1) {
				console.log(JSON.stringify(res))
				console.log($('.bar .bar_code').val())
				mui.openWindow({
					url: 'scan_success.html', //通过URL传参
					id: 'scan_success.html', //通过URL传参
					createNew: true,
					extras: {
						bar_code: $('.bar .bar_code').val(),
						ids: res.data
					},
				})
			} else {
				plus.nativeUI.toast(res.msg)
			}
		},
		error: function(xhr, type, errorThrown) {
			console.log(errorThrown)
			plus.nativeUI.closeWaiting();
		}
	})
}


// 图片上传功能
//上传图片
var fileArr = [];
document.getElementById('tupian').addEventListener('tap', function() {
	if (mui.os.plus) {
		var buttonTit = [{
			title: "拍照"
		}, {
			title: "从手机相册选择"
		}];

		plus.nativeUI.actionSheet({
			title: "上传图片",
			cancel: "取消",
			buttons: buttonTit
		}, function(b) {
			/*actionSheet 按钮点击事件*/
			switch (b.index) {
				case 0:
					break;
				case 1:
					getImage(); /*拍照*/
					break;
				case 2:
					galleryImg(); /*打开相册*/
					break;
				default:
					break;
			}
		})
	}
}, false);
// 拍照获取图片  
function getImage() {
	plus.camera.getCamera().captureImage(function(p) {
		plus.io.resolveLocalFileSystemURL(p, function(entry) {
			console.log(entry.toLocalURL());
			fileArr.push(entry.toLocalURL());
			$(".tupianlist").html("");
			//						setHtml(fileSrc);
			fileArr.forEach(function(v, index) {
				$(".tupianlist").append('<span><img src="' + v +
					'"  alt="" /><i onclick="shanchutupian(' + index +
					')" class="iconfont icon-guanbi"></i></span>')
			})
		}, function(e) {
			outLine("读取拍照文件错误：" + e.message);
		});

	});
}
// 从相册中选择图片   
function galleryImg() {
	// 从相册中选择图片  
	plus.gallery.pick(function(e) {
		console.log(JSON.stringify(e))
		e.files.forEach(function(v) {
			fileArr.push(v);
		})
		$(".tupianlist").html("");
		fileArr.forEach(function(v, index) {
			$(".tupianlist").append('<span><img src="' + v + '"  alt="" /><i onclick="shanchutupian(' +
				index + ')" class="iconfont icon-guanbi"></i></span>')
		})
	}, function(e) {
		console.log("取消选择图片");
	}, {
		filter: "image",
		multiple: true,
		//					maximum: 5,
		system: false,
		onmaxed: function() {
			plus.nativeUI.alert('最多只能选择5张图片');
		}
	});
}
//删除图片
function shanchutupian(i) {
	console.log(i)
	fileArr.forEach(function(v, index) {
		if (i == index) {
			fileArr.splice(fileArr.indexOf(fileArr[index]), 1);
			$(".tupianlist").html("");
			fileArr.forEach(function(v, index) {
				$(".tupianlist").append('<span><img src="' + v +
					'"  alt="" /><i onclick="shanchutupian(' + index +
					')" class="iconfont icon-guanbi"></i></span>')
			})
		}

	})
}

// 图片判断的方法
var imgList = [];
var imgIndex = 0;
function jugeImg() {
	plus.nativeUI.showWaiting("提交中...");
	var click_num = 0;
	if (fileArr == "" || fileArr == null || fileArr == undefined) {
		mui.toast("请选择图片")
		plus.nativeUI.closeWaiting();
	} else {
		fileArr.forEach(function(v, index) {
			var task = plus.uploader.createUpload(root + "api/upload/", {},
				function(t, status) {
					// 上传完成
					console.log(t + "------" + status);
					if (status == 200) {
						console.log(JSON.stringify(JSON.parse(t.responseText)));
						// var img_arr_list = new Array();
						// img_arr_list.push(JSON.parse(t.responseText).data.original_name);
						// img_arr_list.push(JSON.parse(t.responseText).data.url);
						var url = JSON.parse(t.responseText).data.uri;
						imgList.push(url)
						console.log(imgList);
						click_num++;
						console.log((fileArr.length - 1) + ";click_num=" + click_num);
						setTimeout(function() {
							console.log('===============调用接口了')
							imgIndex++
							// console.log(fileArr.length)
							// console.log(imgIndex)
							//成功后调用的接口
							if(imgIndex == fileArr.length){
								jumpSuccessFun()
							}
						}, 1500)
					} else {
						console.log("上传文件出错");
					}
				}
			);

			var str = "file";
			console.log("---------------" + v + "---------------" + str);
			task.addFile(v, {
				key: str
			});

			task.addData("token", token);
			task.addData("type", "image");
			task.start();
		})
	}
}
