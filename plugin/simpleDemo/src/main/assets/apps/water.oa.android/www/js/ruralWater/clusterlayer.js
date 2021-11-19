var bxmap = bxmap || {};
bxmap.olClusterLayer = {
	map: null,
	isLoad: false,
	layer: null, //聚合图图层
	originalStyle: null, //聚合原始样式
	selectStyleFunction: null,
	Init: function(bmap) {
		//加载聚合图
		this.map = bmap.getMap();
		this.isLoad = true;
		//设置原始样式
		this.originalStyle = new ol.style.Style({
			image: new ol.style.Circle({
				radius: 5,
				stroke: new ol.style.Stroke({
					color: '#fff'
				}),
				fill: new ol.style.Fill({
					color: '#3399CC'
				})
			})
		});
		this.initClusterLayer(qy);
	},
	/**
	 * 初始化加载-聚合图
	 */
	initClusterLayer: function(data) {
		var num = data.features.length;
		if (num > 0) {
			var features = new Array(num);
			for (var i = 0; i < num; i++) {
				var geo = data.features[i].geometry;
				var coordinate = [geo.x, geo.y];
				features[i] = new ol.Feature({
					geometry: new ol.geom.Point(coordinate),
					weight: data.features[i].attributes[field_dz]
				});
			}
			this.loadClusterLayer(features, this.originalStyle);
		}
	},
	/**
	 * 创建聚合图层
	 * @method loadClusterLayer
	 * @param  features 渲染聚合图层的要素集
	 * @param  originalStyle图层的原始样式style
	 * @return null
	 */
	loadClusterLayer: function(features, originalStyle) {
		var self = bxmap.olClusterLayer;
		var maxFeatureCount, currentResolution;
		var textFill = new ol.style.Fill({
			color: '#fff'
		});
		var textStroke = new ol.style.Stroke({
			color: 'rgba(0, 0, 0, 0.6)',
			width: 3
		});

		var invisibleFill = new ol.style.Fill({
			color: 'rgba(255, 255, 255, 0.01)'
		});
		var earthquakeFill = new ol.style.Fill({
			color: 'rgba(255, 153, 0, 0.8)'
		});
		var earthquakeStroke = new ol.style.Stroke({
			color: 'rgba(255, 204, 0, 0.2)',
			width: 1
		});

		function createEarthquakeStyle(feature, style) {
			return new ol.style.Style({
				geometry: feature.getGeometry(),
				image: new ol.style.Circle({
					radius: 5,
					stroke: new ol.style.Stroke({
						color: '#fff'
					}),
					fill: new ol.style.Fill({
						color: '#3399CC'
					})
				})
			});
		}
		/*
		 *选中样式
		 */
		function selectStyleFunction(feature) {
			var styles = [new ol.style.Style({
				image: new ol.style.Circle({
					radius: feature.get('radius'),
					fill: invisibleFill
				})
			})];
			var originalFeatures = feature.get('features');
			var originalFeature;
			for (var i = originalFeatures.length - 1; i >= 0; --i) {
				originalFeature = originalFeatures[i];
				styles.push(createEarthquakeStyle(originalFeature, originalStyle));
			}
			return styles;
		}
		/*
		 *设置没有聚合效果的原始样式
		 */
		function createOriginalStyle(feature) {
			return new ol.style.Style({
				image: new ol.style.Circle({
					radius: 8,
					stroke: new ol.style.Stroke({
						color: '#fff'
					}),
					fill: new ol.style.Fill({
						color: '#3399CC'
					})
				})
			});
		}
		/*
		 *计算每个聚合点的半径大小
		 */
		function calculateClusterInfo(resolution) {
			maxFeatureCount = 0;
			var features = self.layer.getSource().getFeatures();
			var feature, radius;
			for (var i = features.length - 1; i >= 0; --i) {
				feature = features[i];
				var originalFeatures = feature.get('features');
				var extent = ol.extent.createEmpty();
				var j, jj;
				for (j = 0, jj = originalFeatures.length; j < jj; ++j) {
					ol.extent.extend(extent, originalFeatures[j].getGeometry().getExtent());
				}
				maxFeatureCount = Math.max(maxFeatureCount, jj);
				radius = 0.25 * (ol.extent.getWidth(extent) + ol.extent.getHeight(extent)) /
					resolution;
				feature.set('radius', radius);
			}
		}
		/*
		 *设置聚合样式
		 */
		function styleFunction(feature, resolution) {
			//计算每个聚合点的半径大小
			if (resolution != currentResolution) {
				calculateClusterInfo(resolution);
				currentResolution = resolution;
			}
			var style;
			var size = feature.get('features').length; //每个点当前的聚合点数
			if (size > 1) { //设置聚合效果样式
				style = new ol.style.Style({
					image: new ol.style.Circle({
						radius: feature.get('radius'), //获取聚合圆圈的半径大小，聚合的点数越多，圆圈的半径越大
						fill: new ol.style.Fill({
							color: [255, 153, 0, Math.min(0.8, 0.4 + (size / maxFeatureCount))]
						})
					}),
					text: new ol.style.Text({
						text: size.toString(),
						fill: textFill,
						stroke: textStroke
					})
				});
			} else { //设置没有聚合效果的原始样式
				style = originalStyle;
			}
			return style;
		}
		self.layer = new ol.layer.Vector({
			source: new ol.source.Cluster({ //矢量图层的数据源为聚合类型
				distance: 40, //聚合距离
				source: new ol.source.Vector({ //聚合数据来源
					features: features
				})
			}),
			style: styleFunction //聚合样式
		});
		self.selectStyleFunction = selectStyleFunction;
		self.map.addLayer(self.layer);
		//缩放至范围
		self.map.getView().setCenter([12637973.949997703, 2657176.0178779177]);
		self.map.getView().setZoom(10);
	},
	showClusterLayer: function() {
		var self = bxmap.olClusterLayer;
		if (self.layer) {
			self.layer.setVisible(true);
			//缩放至范围
			self.map.getView().setCenter([12637973.949997703, 2657176.0178779177]);
			self.map.getView().setZoom(10);
		}
	},
	hideClusterLayer: function() {
		var self = bxmap.olClusterLayer;
		if (self.layer) {
			self.layer.setVisible(false);
		}
	}

}
