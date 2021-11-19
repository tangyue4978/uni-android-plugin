//$(function(){
	document.addEventListener("plusready",function(){
		var bi = plus.navigator.isImmersedStatusbar();
		console.log(bi)
		if(bi){
			try{
				document.getElementsByClassName("mui-content").item(0).style.paddingTop = "23px";
//				
			}catch(e){
				//TODO handle the exception
			}
		}else{
			try{
				document.getElementsByClassName("mui-content").item(0).style.paddingTop = "0px";
			}catch(e){
				//TODO handle the exception
			}
		}
	})
//})
