function selectFun(layerName_arr) {
    var parameter = arguments;
    var scales = "";
    console.log(JSON.stringify(parameter));
    var lassname_select = "";
    var select = new ol.interaction.Select({
        condition: ol.events.condition.click,
        layers: function (feature) {
            lassname_select = feature.className_;
            // console.log(feature.className_);
            // console.log(layerName_arr.indexOf(feature.className_));
            if (layerName_arr.indexOf(feature.className_) != -1) {
                return true;
            } else {
                return false;
            }
        },
        hitTolerance: 2,
        style: function (feature, resolution) {
            var zoom = map.getView().getZoom();
            try {
                console.log(feature.className_);
                // console.log(JSON.stringify(feature.values_));
                // console.log(feature.values_.item[parameter[3]]);
                // if (feature.values_.item.iconActive) {
                if (parameter[2] == "Circle") {
                    var newStyle = new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: 1,
                            fill: null,
                            stroke: new ol.style.Stroke({
                                color: feature.values_.item[parameter[3]],
                                width: map.getView().getZoom() * 1.2,
                            }),
                        }),
                    });
                } else if (parameter[2] == "Color") {
                    var newStyle = new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: 1,
                            fill: null,
                            stroke: new ol.style.Stroke({
                                color: parameter[3],
                                width: 5 * 2,
                            }),
                        }),
                    });
                } else {
                    console.log(layerName_arr);
                    if (layerName_arr == "guganba") {
                        scales = 0.11;
                    }else if(layerName_arr == "disaster"){
						scales = 0.35;
					}
                    var newStyle = new ol.style.Style({
                        image: new ol.style.Icon({
                            opacity: 1,
                            scale: scales || 0.6,
                            src: feature.values_.item.icon || feature.values_.item.image,
                        }),
                    });
                }
                return [newStyle];
                // }
            } catch (e) {
                //TODO handle the exception
                return null;
            }
        },
    });
    select.on("select", function (e) {
        map.getOverlays().clear();
        e.stopPropagation()
        var features = e.target.getFeatures().getArray();
        console.log(lassname_select);
        console.log(JSON.stringify(features));
        var item_info = features[0].values_;
        var vectorLayers = { className_: lassname_select };
        addPopup(item_info, vectorLayers, parameter[2]);
    });
    map.addInteraction(select);
}

// ?????????????????????start
function addPopup(item_info, vectorLayers, layers, showMarker) {
    var ids = "";
    if (layers == "layers") {
        xiangqing(vectorLayers.className_, 0);
        return false;
    }
    if (item_info != undefined) {
        let new_id = "popup_" + item_info.item.id;
        let marker_id = "marker_" + item_info.item.id;
        let lng = item_info.item.lng || item_info.item.lg;
        let lat = item_info.item.lat || item_info.item.lt;
        ids = item_info.item.id || item_info.item.station_code;
        // ???????????????
        let mapPopup = item_info.item.tips;
        var aHtml = `<div id="${new_id}" class="popup_box" data-popup="${new_id}" onclick="stopFunction()"><div onclick="xiangqing('${vectorLayers.className_}','${ids}','${item_info.item.type_id}')">`;
        for (let i = 0; i < mapPopup.length; i++) {
            if (i == 0) {
                if (mapPopup[i].image && mapPopup[i].image != undefined) {
                    aHtml += `<div class="popup_list"><a class="popup_a" >${mapPopup[i].value}</a><img src="${mapPopup[i].image}"></div>`;
                } else {
                    aHtml += `<div class="popup_list"><a class="popup_a" >${mapPopup[i].value}</a></div>`;
                }
            } else {
                // ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
                if (
                    vectorLayers.className_ == "dxsk" ||
                    vectorLayers.className_ == "zxsk" ||
                    vectorLayers.className_ == "xyxsk" ||
                    vectorLayers.className_ == "xexsk" ||
                    vectorLayers.className_ == "wjcsbsj" ||
                    vectorLayers.className_ == "yjcsbsj" ||
                    vectorLayers.className_ == "icon_13_dx2" ||
                    vectorLayers.className_ == "icon_13_zx2" ||
                    vectorLayers.className_ == "icon-14"
                ) {
                    if (mapPopup[i].image && mapPopup[i].image != undefined) {
                        aHtml += `<div class="popup_list" data-status="${mapPopup[i].status}">${mapPopup[i].name}???<span >${mapPopup[i].value}</span><img src="${mapPopup[i].image}"></div>`;
                    } else {
                        aHtml += `<div class="popup_list" data-status="${mapPopup[i].status}">${mapPopup[i].name}???<span>${mapPopup[i].value}</span></div>`;
                    }
                } else if(vectorLayers.className_ == "disaster"){
					if(i == 2){
						aHtml += `<div class="popup_list"><span>${mapPopup[i].value}</span></div>`;
					}else{
						aHtml += `<div class="popup_list">${mapPopup[i].name}???<span>${mapPopup[i].value}</span></div>`;
					}
				}else {
                    aHtml += `<div class="popup_list">${mapPopup[i].name}???<span>${mapPopup[i].value}</span></div>`;
                }
            }
        }

        // ??????????????????????????????
        if (showMarker === false) {
        } else {
            aHtml += `</div></div><div id="${marker_id}" class="marker" data-popup="${marker_id}"></div>`;
        }

        $("#body").append(aHtml);
        for (let i = 0; i < $("#body .popup_list").length; i++) {
            let dataStatus = $("#body .popup_list").eq(i).attr("data-status");
            if (dataStatus && dataStatus == 1) {
                $("#body .popup_list").eq(i).find("span").css("color", "red");
            }
        }
        var popup = new ol.Overlay({
            id: new_id,
            element: document.getElementById(new_id), // ??????????????? html ???????????????????????????html ?????????
            position: [lng, lat], // ???????????????
            positioning: "bottom-center", // ???????????????
            //autoPan: true,             // ????????????????????????????????????????????????????????????????????????????????????????????????
            // autoPanMargin: 20,       // ????????????????????????
            dragging: false, //
            offset: [0, -20],
            shadeClose:false,
            className: new_id, // ??????????????????????????????
            stopEvent: true,
        });

        map.addOverlay(popup);

        var marker = new ol.Overlay({
            id: marker_id,
            //????????????
            position: [lng, lat],
            //????????????????????????????????????
            positioning: "center-center",
            //??????????????????
            element: document.getElementById(marker_id), //ToDo
            className: marker_id, // ??????????????????????????????
            stopEvent: true,
        });
        map.addOverlay(marker);
        map.getView().animate({
            center: [lng, lat],
            duration: 1200,
        });
    }
}

function stopFunction() {
    event.stopPropagation();
    event.preventDefault();
}
