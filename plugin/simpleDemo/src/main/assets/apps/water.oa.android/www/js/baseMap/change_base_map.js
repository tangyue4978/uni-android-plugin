$(function() {
	var change_base_map_html = `
	<!-- 切换底图 -->
				<div id="change_base_map_box_id" class="change_base_map_list">
					<div class="change_map_title" onclick="$('#change_map_mark').removeClass('active');$('#change_base_map_box_id').removeClass('active');">
						<span>切换底图</span>
						<span class="mui-icon mui-icon-arrowdown"></span>
					</div>
					<div class="change_map_cont">
						<div class="change_base_map_box">
							<div class="imglist active" data-source="yxMap_source">
								<img class="base_img" src="../../images/bg_map/base_map/base_map1.png" >
								<div class="base_label">晕渲图</div>
							</div>
							<div class="imglist" data-source="dzMap_source">
								<img class="base_img" src="../../images/bg_map/base_map/base_map2.png" >
								<div class="base_label">电子地图</div>
							</div>
							<div class="imglist" data-source="wxMap_source">
								<img class="base_img" src="../../images/bg_map/base_map/base_map3.png" >
								<div class="base_label">卫星地图</div>
							</div>
							<div class="imglist " data-source="ArcGISMap_source">
								<img class="base_img" src="../../images/bg_map/base_map/base_map4.png" >
								<div class="base_label">ArcGIS地图</div>
							</div>
						</div>
					</div>
				</div>
				<!-- 切换底图 end -->
				`;
	if ($("#change_base_map_box_id").length == 0) {
		$("body").append(change_base_map_html);
	}
	$("body").on("click","#change_map_mark",function(){
		console.log($(this).hasClass("active"));
		if($(this).hasClass("active")){
			$("#change_base_map_box_id").addClass("active");
		}else{
			$("#change_base_map_box_id").removeClass("active");
		}
	})
})
