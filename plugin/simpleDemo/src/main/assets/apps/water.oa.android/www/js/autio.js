// 录音操作
var r = null,SStime=null;

var recording_url="";
var fen = 0;//分钟
var miao = 0;//秒

document.addEventListener("plusready", function() {
	var r = plus.audio.getRecorder();

	$(".img_box").on("click", function() {
		var str = $(".img_box").attr("data-status");
		//	r = plus.audio.getRecorder();
		if(r == null) {
			mui.toast("未获取录音对象");
			return false;
		}
		if(str != 1) {
			$(".img_box").attr("data-status", "1");
			console.log("开始")
			$(".text_box").eq(0).text("正在录音");
			$(".audio_box .img_box").css("background-image","url(images/recording.gif)");
				fen = 0;//分钟
				miao = 0;//秒
				SStime = setInterval(function() {
					miao++;
					if(miao>=60){
						miao=0;
						fen++;
					}
					if(fen>=2){
						$(".img_box").attr("data-status", "2");
						console.log("完成");
						$(".text_box").eq(0).text("点击录音");
						$(".gray_color").text("录音时长：00:00");
						$(".audio_box .img_box").css("background-image","url(images/soundrecording.png)");
						r.stop();//停止录音
						clearInterval(SStime);
						SStime=null;
						return false;
					}
					$(".gray_color").text("录音时长："+str_length(fen)+":"+str_length(miao));
				}, 1000);
			r.record({
				filename: "_doc/audio/",
				format: "amr"
			}, function(recordFile) {
//				alert(recordFile);
				plus.io.resolveLocalFileSystemURL(recordFile, function(entry) {
//					alert(entry);
					recording_url=entry.toLocalURL();
					console.log(recording_url);
					var _url = root + 'api/upload/';
//					document.addEventListener( "plusready", function(){
//						mui.ajax(_url, {
//							data: {
//								"token": token,
//								"file": recording_url,
//								"type": "voice"
//							},
//							datatype: 'json', //服务器返回json格式数据
//							type: 'post', //HTTP请求类型
//							success: function(data) {
//								alert(data.msg)
//								console.log(JSON.stringify(data))
//								mui.toast(data.uri);
//							},
//							error: function(xhr, type, errorThrown) {
//								alert(3)
//								mui.toast(errorThrown);
//							}
//						})
//						 function createUpload() {
				                console.log(111111111);
				                var task = plus.uploader.createUpload( _url, 
				                    { method:"POST",blocksize:204800,priority:100 },
				                    function ( t, status ) {
				                        // 上传完成 
				                        console.log(JSON.stringify(t));
				                        if ( status == 200 ) {
				                        	console.log(t.responseText);
				                            var data=JSON.parse(t.responseText);
//				                            alert( "上传成功:" + data.data.url );
				                            var html=	'<div class="play_box">'+
															'<div class="play_left play_recording_start"></div>'+
																'<div class="play_center play_recording_centent" data-url="'+data.data.url+'" data-local="'+recording_url+'">点击播放</div>'+
															'<div class="play_right play_recording_end">'+
																'<span class="second">'+
																	'<span class="play_time">'+str_length(fen)+':'+str_length(miao)+'</span>'+
																	'<span class="clear_ly">删除</span>'+
																'</span>'+
															'</div>'+
														'</div>';
											$(".play_list_box").append(html);
											$(".clear_ly").off("click",clear_ly);
											$(".clear_ly").on("click",clear_ly);
											$(".play_box .play_recording_centent").off("click",play_ly);
											$(".play_box .play_recording_centent").on("click",play_ly);
				                            
				                        } else {
//				                            alert( "上传失败:" + status );
				                        }
				                    }
				                );
				                task.addFile(recording_url, {key:"file"} );
				                task.addData( "token", token );
				                task.addData( "type", "voice" );
				                task.start();
//				            }
//					}, false );
					
//					$(".play_box .play_recording_centent").attr("data-url",recording_url);
//					startPlay(entry.toLocalURL());
				}, function(e) {
					console.log('读取录音文件错误：' + e.message);
				});
			}, function(e) {
//				alert("未获取录音对象" + e.message);
			});
		} else {
			$(".img_box").attr("data-status", "2");
			console.log("完成");
			$(".text_box").eq(0).text("点击录音");
//			$(".play_time").text(str_length(fen)+":"+str_length(miao));
			$(".gray_color").text("录音时长：00:00");
			$(".audio_box .img_box").css("background-image","url(images/soundrecording.png)");
			r.stop();//停止录音
			clearInterval(SStime);
			SStime=null;
//			r=null;
		}
	})
	
	
	
	
	//clear_ly//取消录音
//	$(".clear_ly").on("click",clear_ly);
	function clear_ly(){
		$(this).parents(".play_box").remove();
	}
	
	
	/*
	 * 开始播放
	 */
	
//	$(".play_box .play_recording_centent").on("click",play_ly);
	function play_ly(){
		var _url=$(this).attr("data-local");
		$(this).text("正在播放...");
		startPlay(_url);
	}
	
	
		function startPlay(url) {
//			alert(url);
			  player = plus.audio.createPlayer(url);
		         player.play(function (e) {
		            console.log('播放完成后，运行代码');
					$(".play_box .play_recording_centent").text("点击播放");
					mui.toast("播放完成");
		        },function (e) {
					mui.toast("播放异常")
		            console.log(e.message);
		        },false);
			// 获取总时长
			var d = player.getDuration();
//			console.log(d);
		}
	// 停止播放
		function stopPlay() {
			// 操作播放对象
			if(p) {
				p.stop();
				p = null;
			}
		}
}, false);



//长度转换
function str_length(str){
	var ss="";
	if(str.toString().length<2){
		ss="0"+str;
		return ss;
	}else{
		ss=str;
		return ss;
	}
}
