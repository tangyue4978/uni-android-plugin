(function(mui, doc) {
	window.addEventListener('refresh', function(e) { //执行刷新
		location.reload();
		list()
	});
	document.getElementById('portrait').addEventListener('click', function() {
		mui.openWindow({
			url: 'portrait.html', //通过URL传参
			id: 'portrait.html', //通过URL传参
		})
	});
	var sex = 0;
	$(".revise-content ul li .right .button1").click(function() {//女
		$(".revise-content ul li .right .button1").addClass("nv");
		$(".revise-content ul li .right .button2").removeClass("nan");
		sex = 1;
	})
	$(".revise-content ul li .right .button2").click(function() {//男
		$(".revise-content ul li .right .button2").addClass("nan");
		$(".revise-content ul li .right .button1").removeClass("nv");
		sex = 0;
	})
	//获取数据
	var root = localStorage.getItem("str_url");
	if(root == "" || root == undefined || root == null) {
		mui.openWindow({
			url: 'login.html?cid=1', //通过URL传参
			id: 'login.html?cid=1', //通过URL传参
		})
	}
	var token = localStorage.getItem("token");
	var department = [];
	//	获取数据	
	function list() {
		var _url = root + 'api/user/update'
		mui.ajax(_url, {
			data: {
				"token": token,
			},
			datatype: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			success: function(data) {
				console.log(JSON.stringify(data))
				if(data.code == 1) {
					var user = data.data.user;
					document.getElementById('imgId').src =  root+user.avatar;
					document.getElementById('name').value = user.truename;
					document.getElementById('duty').value = user.duty;
					document.getElementById('phone').value = user.phone;
					document.getElementById('email').value = user.email;
					document.getElementById('birthday').value = user.birthday;
					document.getElementById('department_name').value = user.department_name;
					localStorage.setItem("img", user.avatar);
					//					department = data.data.department;
					data.data.department.forEach(function(v) {
						var aa = {
							"value": v.id,
							"text": v.name,
						}
//						console.log(aa)
						department.push(aa);
						if(user.department_id == v.id) {
							console.log("1")
							$("#department").val(v.name)
							//							document.getElementById('department').val = v.name;
						}
					})
					console.log("性别"+user.sex);
					if(user.sex == 0) {
						$(".revise-content ul li .right .button2").addClass("nan");
						$(".revise-content ul li .right .button1").removeClass("nv");
					} else {
						$(".revise-content ul li .right .button2").removeClass("nan");
						$(".revise-content ul li .right .button1").addClass("nv");
						
					}
				}
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				//		console.log(type);
			}
		})
	}
	list()
	//选择岗位
//	var department_id = '';
//	document.querySelector('#department').addEventListener("click", function() {
//		console.log("1")
//		var roadPick = new mui.PopPicker(); //获取弹出列表组建，假如是二联则在括号里面加入{layer:2}
//		roadPick.setData(department);
//		roadPick.show(function(item) { //弹出列表并在里面写业务代码
//			var itemCallback = roadPick.getSelectedItems();
//			$('#department').val(itemCallback[0].text);
//			department_id = itemCallback[0].value;
//		});
//	});

	//选择生日
	//DtPicker选择器

	document.querySelector("#birthday").addEventListener("click", function() {
		var dtpicker = new mui.DtPicker({
			"type": "date",
			beginDate: new Date(1950, 0, 01),//设置开始日期 
	    	endDate: new Date(),//设置结束日期
		});
		dtpicker.setSelectedValue($('#birthday').val())
		dtpicker.show(function(items) {
			$("#birthday").val(items.text);
			dtpicker.dispose();
		});
	});
	//保存事件
	document.querySelector("#save").addEventListener("click", function() {
		var _url = root + 'api/user/save';
		//判断岗位id

		console.log("姓名="+$('#name').val()+"duty职务="+$('#duty').val()+"phone手机="+$('#phone').val()+"email邮箱="+$('#email').val()+"birthday生日="+$('#birthday').val()+"sex性别="+sex)

		mui.ajax(_url, {
			data: {
				"token": token,
				"truename": $('#name').val(),
//				"department_id": department_id,
				"duty": $('#duty').val(),
				"phone": $('#phone').val(),
				"email": $('#email').val(),
				"birthday": $('#birthday').val(),
				"sex": sex,

			},
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			success: function(data) {
				if(data.code == 1) {
					mui.toast('保存成功');
				}else{
					mui.toast(data.msg);
				}
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				//		console.log(type);
			}
		})
	});

	mui.init({
		beforeback: function() {
			//获得列表界面的webview
			var list = plus.webview.getWebviewById("my.html");　
						console.log(JSON.stringify(list))
						mui.fire(list, 'refresh');
						//返回true,继续页面关闭逻辑
						return true;
		}
	});

}(mui, document));