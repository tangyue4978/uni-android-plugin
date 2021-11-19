document.addEventListener('plusready', function() {
	$.ajax({
		type:"GET",
		url:"https://api.sxjicheng.cn/?flag=wateroa_test",
		async:false,
		data:{},
		dataType:"json",
		success:function(data){
			str_url=data.data+'/';
			localStorage.setItem("str_url", str_url);
			//
			// str_url="http://wateroa.sxjicheng.com/";
			str_url="http://59.195.207.1:8081/";
			localStorage.setItem("str_url", str_url);
		},
		error:function(data){
			console.log(data);
		}
	});
	console.log("-----强制更改地址信息1------"+localStorage.getItem("str_url"));
},false)

