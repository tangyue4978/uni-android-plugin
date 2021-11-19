//token值修改
var defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4YjU3NmQwZC03MDhiLTQzY2QtYjJlYi0zYWY5ZmFmYWI2MzIiLCJpZCI6MjQ2MTMsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1ODU1MzUxNzd9.roCh8uKqdCN02qYfl3wEWrCMaGtSxLgyQkgcl3aRCUA";		
Cesium.Ion.defaultAccessToken = defaultAccessToken;
//通过修改相机在创建时将查看的默认矩形范围大小，来控制显示范围
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(80, 26, 150.0, 35.5);//控制球默认显示大小
var viewer = new Cesium.Viewer('map', {
	animation: false, //动画控制，默认true
	baseLayerPicker: false, //地图切换控件(底图以及地形图)是否显示,默认显示true
	fullscreenButton: false, //全屏按钮,默认显示true
	geocoder: false, //地名查找,默认true
	timeline: false, //时间线,默认true
	vrButton: false, //双屏模式,默认不显示false
	homeButton: false, //主页按钮，默认true
	infoBox: false, //点击要素之后显示的信息,默认true
	selectionIndicator: false, //选中元素显示,默认true
	navigationHelpButton: false, //如果设置为 false，则不会创建导航帮助按钮
	sceneModePicker: false //如果设置为false，则不会创建2D 3D小部件
});

//去除版权信息
viewer._cesiumWidget._creditContainer.style.display = "none";

setTimeout(function(){
	viewer.camera.setView({
	    destination : Cesium.Cartesian3.fromDegrees(-117.16, 32.71, 15000.0)
	});
},2000)
