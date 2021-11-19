
function getdata(info){
	var feArray = [];
	info.contours.forEach(function(item,index){
		var features = {
			"type": "Feature",
			// "id": "AFG2",
			"properties": {
				"name": "Afghanistan",
				"style": 'rgba('+item.color+')',
				"value": item.value,
				"color": item.color,
				"symbol": item.symbol
			},
			"geometry": {
				"type": "Polygon",
				"coordinates": [
					
				]
			},
			"style": 'rgba('+item.color+')'
			
		}
		
		item.latAndLong = item.latAndLong.map((item2,index2)=>{
			return item2.reverse()
		})
		features.geometry.coordinates.push(item.latAndLong)
		feArray.push(features);
	})
	var set = {
		"type": "FeatureCollection",
		"features": feArray
	}
	console.log(set);
	return set;
}

function qixingFun(info){
	var vectorSource = new ol.source.Vector({
		features: (new ol.format.GeoJSON()).readFeatures(getdata(info))
	});
	
	waterQualitylayers["vectorLayer"] = new ol.layer.Vector({
		source: vectorSource,
		className:"qixiang",
		opacity:0.4
	});
	waterQualitylayers["vectorLayer"].getSource().getFeatures().forEach(function(item,index){
		item.setStyle(new ol.style.Style({
			// stroke: new ol.style.Stroke({
			// 	color: '#ff4e00', //面的边界线颜色
			// 	width: 1         //边界线宽
			// }),
			fill: new ol.style.Fill({
				color: item.values_.style    //填充颜色，不透明度0
			})
		}))
	})
	map.addLayer(waterQualitylayers["vectorLayer"]);
}





