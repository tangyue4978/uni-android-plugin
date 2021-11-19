function isIphoneX(){
			    return /iphone/gi.test(navigator.userAgent) && (screen.height == 812 && screen.width == 375)
			}
			if (isIphoneX()) {
				$(".news .pp").css("height","1.5rem");
				$(".news .pp").css("line-height","1.5rem");
				$(".news .pp").css("padding-top","0.4rem");
				$(".news .pp").css("background-size","135% auto");
				$(".mui-content  > div   > div   > div ").css("top","1.5rem");
				
				$(".my .p1").css("height","1.5rem");
				$(".my .p1").css("line-height","1.5rem");
				$(".my .p1").css("padding-top","0.4rem");
				
				$(".chioceNotice-sousuo").css("top","1.5rem");
				$(".head_portrait").css("margin-top","calc(1.5rem - 1px)");
				
				$(".main-header").css("padding-top","0.5rem");
//				$("body").css("padding-top","1rem");
//				alert(22)
			}