var clickStr = mui.os.ios ? 'tap' : "click";

// 管理对象显示隐藏
$("body").on(clickStr, ".nav_ul_box .isShow", function() {
	var objItem = $(this).attr("data-type");
	if (objItem && objItem !== undefined) {
		if ($(this).hasClass("active")) {
			$("#" + objItem).removeClass("active")
			$(this).removeClass("active")
		} else {
			$(".nav_ul_box .isShow").removeClass("active");
			$(".mapBox .list_box").removeClass("active");
			$("#" + objItem).addClass("active")
			$(this).addClass("active")
		}
	}
	// allIsLayers(false);//切换选项卡隐藏所有图层
	// isLayers(objItem);//显示当前选项卡下图层
})

var enetity = viewer.entities.add({
	name: '标点',
	position: Cesium.Cartesian3.fromDegrees(110,40,1000),
	billboard:{
		image: 'https://img0.baidu.com/it/u=4137924777,4215971248&fm=26&fmt=auto&gp=0.jpg',
		horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
		verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
		scale: 1,
		width: 50, // default: undefined
		height: 50,
	}
})

viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(112,37,1000),
    billboard: {
      image: "https://img2.baidu.com/it/u=1052437823,2294515059&fm=26&fmt=auto&gp=0.jpg", // default: undefined
      show: true, // default
      // pixelOffset: new Cesium.Cartesian2(0, -50), // default: (0, 0)
      eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0), // default
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // default
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // default: CENTER
      scale: 1.0, // default: 1.0
      // color: Cesium.Color.LIME, // default: WHITE
      // rotation: Cesium.Math.PI_OVER_FOUR, // default: 0.0
      // alignedAxis: Cesium.Cartesian3.ZERO, // default
      width: 50, // default: undefined
      height: 50, // default: undefined
    },
  });
  
  
  
  Cesium.Cartesian3.fromDegrees(115,37,10000)