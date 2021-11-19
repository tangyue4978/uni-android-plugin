/**
 * @description 水利地图配置信息
 */

// 山西大水网总信息
var layersInfo = [
  // 管理对象
  {
    type_id: ["managementObjects"],
    group_id: "group_dsw",
    tname: "大水网",
    legendname: "两纵水网",
    legend_group: "lzshsw",
    legend_group_name: "两纵十横水网",
    listshow: true,
    // legend: "legend_dsw",
    legend_img: "../../images/icon_dsw/icon_dsw1.png",
    name: "dsw_lzsw",
    images: "../../images/big_water_network/icon_dsw.png",
    datatype: "WMTS",
    width: 5,
    visibility: false,
    color: "#61C679",
    serverInfo: {
      WMS: {
        // url:"http://www.zhuoyukeji.cn:8081/freexserver/wms",
        url: "http://192.168.1.251:8002/geoserver/sxjicheng/wms",
        type: "WMS",
        layers: "group_山西大水网_pc_dt",
      },
      WMTS: {
        url: "http://gis.sxjicheng.cn:8081/freexserver/htc/service/wmts",
        // url:"http://192.168.1.22:8088/freexserver/htc/service/wmts",
        type: "WMTS",
        layer: "group_山西大水网_pc_dt",
      },
    },
    legendStatus: "legend_dsw",
    legend_li: [{
        legend_names: '两纵十横水网',
        legend_imgs: '../../images/icon_dsw/icon_dsw1.png'
      },
      {
        legend_names: '泵站',
        legend_imgs: '../../images/icon_dsw/icon_dsw6.png'
      },
      {
        legend_names: '规划未开工程',
        legend_imgs: '../../images/icon_dsw/icon_dsw2.png'
      },
      {
        legend_names: '河道引水工程',
        legend_imgs: '../../images/icon_dsw/icon_dsw4.png'
      },
      {
        legend_names: '开工剩余工程',
        legend_imgs: '../../images/icon_dsw/icon_dsw3.png'
      },
      {
        legend_names: '应急水源供水工程',
        legend_imgs: '../../images/icon_dsw/icon_dsw5.png'
      },
    ]
  },
  {
    type_id: ["managementObjects"],
    group_id: "group_liuyu",
    tname: "流域",
    listshow: true,
    datatype: "WMTS",
    // datatype: "WFS",
    name: "liuyu-server",
    visibility: false,
    bgcolor: "rgba(115, 223, 255, 0.3)",
    color: "#ff0000",
    fontSize: 14,
    jsonUrl: "",
    images: "../../images/big_water_network/icon-liuyu2.png",
    serverInfo: {
      WMTS: {
        url: "http://gis.sxjicheng.cn:8081/freexserver/htc/service/wmts",
        // url:"http://www.zhuoyukeji.cn:8081/freexserver/htc/service/wmts",
        type: "WMTS",
        // layer: "shanxi山脉水系",
        layer: "group_sx_river",
      },
      WFS: {
        url: "http://gis.sxjicheng.cn:8081/freexserver/wfs?service=WFS&version=1.0.0&request=GetFeature&typename=group_sx_river&outputFormat=application/json&srsname=EPSG:4326&bbox=110.8552664995167,35.2170464974118,114.48931872382224,40.053696037564016,EPSG:4326",
        type: "WFS",
        layer: "group_sx_river",
      },
    },
  },

  // 大中型水库
  {
    type_id: ["managementObjects"],
    group_id: "group_sk_big",
    tname: "大型水库",
    listshow: true,
    datatype: "WMTS",
    // datatype: "WFS",
    name: "icon_13_dx1",
    visibility: false,
    bgcolor: "rgba(115, 223, 255, 0.3)",
    color: "#3672EE",
    fontSize: 14,
    jsonUrl: "",
    images: "../../images/yc/reservoir/dxsk_aa.png",
    serverInfo: {
      WMTS: {
        url: "http://gis.sxjicheng.cn:8081/freexserver/htc/service/wmts",
        // url:"http://www.zhuoyukeji.cn:8081/freexserver/htc/service/wmts",
        type: "WMTS",
        layer: "shp_daxingshuiku",
      },
      WFS: {
        url: "http://gis.sxjicheng.cn:8081/freexserver/wfs?service=WFS&version=1.0.0&request=GetFeature&typename=sxdata_bast&outputFormat=application/json&srsname=EPSG:4326&bbox=110.8552664995167,35.2170464974118,114.48931872382224,40.053696037564016,EPSG:4326",
        type: "WFS",
        layer: "sxdata_bast",
      },
    },
  },
  {
    type_id: ["managementObjects"],
    group_id: "group_sk_middle",
    tname: "中型水库",
    listshow: true,
    datatype: "WMTS",
    // datatype: "WFS",
    name: "icon_13_zx1",
    visibility: false,
    bgcolor: "rgba(115, 223, 255, 0.3)",
    color: "#3672EE",
    fontSize: 14,
    jsonUrl: "",
    images: "../../images/yc/2-2Mediumreservoir.png",
    serverInfo: {
      WMTS: {
        url: "http://gis.sxjicheng.cn:8081/freexserver/htc/service/wmts",
        type: "WMTS",
        layer: "shp_m_reservoir",
      },
      WFS: {
        url: "http://gis.sxjicheng.cn:8081/freexserver/wfs?service=WFS&version=1.0.0&request=GetFeature&typename=shp_m_reservoir&outputFormat=application/json&srsname=EPSG:4326&bbox=110.8552664995167,35.2170464974118,114.48931872382224,40.053696037564016,EPSG:4326",
        type: "WFS",
        layer: "shp_m_reservoir",
      },
    },
  },
  {
    type_id: ["managementObjects"],
    group_id: "group_sk_big",
    tname: "大型水库点",
    stroke: "#ff0000",
    stroke_width: 2,
    apiUrl: "api/v4/reservoir/map",
    apitype: 1,
    listshow: true,
    images: "../../images/yc/dxsk.png",
    name: "icon_13_dx2",
    width: 0,
    visibility: false,
    bgcolor: "rgba(115,178,255,0.5)",
    color: "red",
    datatype: "point",
  }, //,jsonUrl:"../../js/map/json/dashuiku.json"
  {
    type_id: ["managementObjects"],
    group_id: "group_sk_middle",
    tname: "中型水库点",
    apiUrl: "api/v4/reservoir/map",
    apitype: 2,
    listshow: true,
    images: "../../images/yc/2-2Mediumreservoir.png",
    name: "icon_13_zx2",
    width: 0,
    visibility: false,
    bgcolor: "rgba(115,178,255,0.5)",
    color: "#3672EE",
    datatype: "point",
  }, //,jsonUrl:"../../js/map/json/zhongshuiku.json"
  {
    type_id: ["managementObjects"],
    group_id: "group_dxgq",
    tname: "大型灌区",
    images: "../../images/big_water_network/icon-01.png",
    listshow: true,
    // datatype: "WMTS",
    datatype: "WFS",
    name: "shp_irrigation",
    visibility: false,
    fontSize: 14,
    bgcolor: "rgba(158,193,171,0.5)",
    color: "#297572",
    // planeImg:"../../images/bg_map/gqxx4.png",
    serverInfo: {
      WMTS: {
        url: "http://gis.sxjicheng.cn:8081/freexserver/htc/service/wmts",
        // url:"http://www.zhuoyukeji.cn:8081/freexserver/htc/service/wmts",
        type: "WMTS",
        // layer: "shanxi山脉水系",
        layer: "shp_irrigation_13",
      },
      WFS: {
        url: "http://gis.sxjicheng.cn:8081/freexserver/wfs?service=WFS&version=1.0.0&request=GetFeature&typename=shp_irrigation_13&outputFormat=application/json&srsname=EPSG:4326",
        type: "WFS",
        layer: "shp_irrigation_13",
      },
    },
  },
  {
    type_id: ["managementObjects"],
    group_id: "group_dxgq",
    tname: "大型灌区",
    listshow: true,
    datatype: "WMTS",
    images: "../../images/big_water_network/icon-01.png",
    // datatype: "WFS",
    name: "shp_irrigation2",
    visibility: false,
    fontSize: 14,
    bgcolor: "rgba(158,193,171,0.5)",
    color: "#297572",
    planeImg: "../../images/bg_map/gqxx4.png",
    serverInfo: {
      WMTS: {
        url: "http://gis.sxjicheng.cn:8081/freexserver/htc/service/wmts",
        // url:"http://www.zhuoyukeji.cn:8081/freexserver/htc/service/wmts",
        type: "WMTS",
        // layer: "shanxi山脉水系",
        layer: "shp_irrigation_13",
      },
      WFS: {
        url: "http://gis.sxjicheng.cn:8081/freexserver/wfs?service=WFS&version=1.0.0&request=GetFeature&typename=shp_irrigation&outputFormat=application/json&srsname=EPSG:4326&bbox=110.8552664995167,35.2170464974118,114.48931872382224,40.053696037564016,EPSG:4326",
        type: "WFS",
        layer: "shp_irrigation",
      },
    },
  },
  {
    type_id: ["managementObjects"],
    tname: "中型灌区",
    group_id: "group_zxgq",
    listshow: true,
    // datatype: "WMTS",
    datatype: "WFS",
    name: "shp_medium_irr",
    images: "../../images/big_water_network/icon_zxsk.png",
    visibility: false,
    fontSize: 14,
    bgcolor: "rgba(158,193,171,0.5)",
    color: "#297572",
    // planeImg: "../../images/bg_map/gqxx4.png",
    serverInfo: {
      WMTS: {
        url: "http://gis.sxjicheng.cn:8081/freexserver/htc/service/wmts",
        // url:"http://www.zhuoyukeji.cn:8081/freexserver/htc/service/wmts",
        type: "WMTS",
        // layer: "shanxi山脉水系",
        layer: "shp_medium_irr",
      },
      WFS: {
        url: "http://gis.sxjicheng.cn:8081/freexserver/wfs?service=WFS&version=1.0.0&request=GetFeature&typename=shp_medium_irr&outputFormat=application/json&srsname=EPSG:4326",
        type: "WFS",
        layer: "shp_medium_irr",
      },
    },
  },
  {
    type_id: ["managementObjects"],
    tname: "中型灌区",
    group_id: "group_zxgq",
    listshow: true,
    datatype: "WMTS",
    // datatype: "WFS",
    name: "shp_medium_irr2",
    visibility: false,
    fontSize: 14,
    bgcolor: "rgba(158,193,171,0.5)",
    color: "#297572",
    // planeImg: "../../images/bg_map/gqxx4.png",
    serverInfo: {
      WMTS: {
        url: "http://gis.sxjicheng.cn:8081/freexserver/htc/service/wmts",
        // url:"http://www.zhuoyukeji.cn:8081/freexserver/htc/service/wmts",
        type: "WMTS",
        // layer: "shanxi山脉水系",
        layer: "shp_medium_irr",
      },
      WFS: {
        url: "http://gis.sxjicheng.cn:8081/freexserver/wfs?service=WFS&version=1.0.0&request=GetFeature&typename=shp_irrigation&outputFormat=application/json&srsname=EPSG:4326&bbox=110.8552664995167,35.2170464974118,114.48931872382224,40.053696037564016,EPSG:4326",
        type: "WFS",
        layer: "shp_medium_irr",
      },
    },
  },
  {
    type_id: ["managementObjects"],
    tname: "中型灌区",
    group_id: "group_zxgq",
    apiUrl: "api/v3/rural_irrigation/mapNew",
    apitype: 2,
    listshow: true,
    images: "../../images/big_water_network/icon_zxsk.png",
    name: "icon_zxgq",
    datatype: "point",
    width: 0.6,
    visibility: false,
    color: "#ff9900",
  },
  // 七河五湖
  {
    type_id: ["managementObjects"],
    group_id: "group_qhwh",
    tname: "七河五湖",
    listshow: true,
    name: "qihe",
    images: "../../images/big_water_network/icon_qhwh.png",
    width: 2,
    visibility: false,
    bgcolor: "#53d5ff",
    color: "#53d5ff",
    jsonUrl: "../../js/map/json/qihe.json",
  },
  {
    type_id: ["managementObjects"],
    group_id: "group_qhwh",
    tname: "七河-字",
    listshow: true,
    stroke: "#ffffff",
    stroke_width: 2,
    name: "qihe-zi",
    datatype: "point",
    width: 0,
    visibility: false,
    bgcolor: null,
    color: "#73B2FF",
    fontSize: 14,
    jsonUrl: "../../js/map/json/qihe_zi.json",
  },
  {
    type_id: ["managementObjects"],
    group_id: "group_qhwh",
    tname: "五湖",
    listshow: true,
    name: "fivel_akes",
    width: 2,
    visibility: false,
    bgcolor: "rgba(83,213,255,0.5)",
    color: "#53d5ff",
    jsonUrl: "../../js/map/json/fivel_akes.json",
  },
  {
    type_id: ["managementObjects"],
    group_id: "group_qhwh",
    tname: "五湖-字",
    listshow: true,
    name: "fivel_akes-zi",
    datatype: "point",
    width: 0,
    visibility: false,
    bgcolor: null,
    color: "#73B2FF",
    jsonUrl: "../../js/map/json/wuhu_zi.json",
  },
  // 淤地坝
  {
    type_id: ["managementObjects"],
    tname: "淤地坝",
    apiUrl: "api/v3/fetchwater/backboneProjectNew",
    apitype: 0,
    listshow: true,
    images: "../../images/big_water_network/icon-22.png",
    name: "icon_22",
    datatype: "point",
    width: 0.6,
    visibility: false,
    color: "#ff9900",
  },
  // 千吨万人供水工程
  {
    type_id: ["managementObjects"],
    tname: "千吨万人供水工程",
    apiUrl: "api/v3/supply_project_information/thousands_people_tons",
    apitype: 0,
    listshow: true,
    images: "../../images/big_water_network/icon-16.png",
    name: "icon_16",
    datatype: "point",
    width: 0.6,
    visibility: false,
    color: "#ff9900",
  },
  // 流量站
  {
    type_id: ["managementObjects"],
    tname: "地下水测站",
    apiUrl: "api/v3/water_rain_condition/map",
    apitype: 2,
    listshow: true,
    images: "../../images/big_water_network/icon-04.png",
    name: "icon_04",
    datatype: "point",
    width: 0.6,
    visibility: false,
    color: "#ff9900",
  },
  {
    type_id: ["managementObjects"],
    tname: "河道水文站",
    apiUrl: "api/v3/water_rain_condition/map",
    apitype: 7,
    listshow: true,
    images: "../../images/big_water_network/hdcz_act.png",
    name: "icon_05",
    datatype: "point",
    width: 0.6,
    visibility: false,
    color: "#ff9900",
  },
  {
    type_id: ["managementObjects"],
    tname: "河道水位站",
    apiUrl: "api/v3/water_rain_condition/map",
    apitype: 6,
    listshow: true,
    images: "../../images/yc/icon_hdswz02.png",
    name: "hdcz_shuiweizhan",
    datatype: "point",
    width: 0.6,
    visibility: false,
    color: "#ff9900",
  },

  // 雨量站

  // 水质检测站
  {
    type_id: ["managementObjects"],
    tname: "水质站点",
    apiUrl: "api/v3/water_quality/index",
    apitype: 0,
    listshow: true,
    images: "../../images/big_water_network/icon-12.png",
    name: "icon_12",
    datatype: "point",
    width: 0.6,
    visibility: false,
    color: "#ff9900",
  },
  // 取水单位
  {
    type_id: ["managementObjects"],
    tname: "取水单位(国家级)",
    apiUrl: "api/v3/licence/mapNew",
    apitype: 5,
    listshow: true,
    images: "../../images/big_water_network/icon-02-gj.png",
    name: "icon_02_gj",
    datatype: "point",
    width: 0.6,
    visibility: false,
    color: "#ff9900",
  },
  {
    type_id: ["managementObjects"],
    tname: "取水单位(省级)",
    apiUrl: "api/v3/licence/mapNew",
    apitype: 4,
    listshow: true,
    images: "../../images/big_water_network/icon-03.png",
    name: "icon_03_sj",
    datatype: "point",
    width: 0.6,
    visibility: false,
    color: "#ff9900",
  },
  {
    type_id: ["managementObjects"],
    tname: "水电站",
    apiUrl: "api/v3/hydropower_station/map",
    apitype: 0,
    listshow: true,
    images: "../../images/big_water_network/icon-17.png",
    name: "icon_17",
    datatype: "point",
    width: 0.6,
    visibility: false,
    color: "#ff9900",
  },
  {
    type_id: ["managementObjects"],
    tname: "千人以上供水工程",
    apiUrl: "api/v3/supply_project_information/index",
    apitype: 0,
    listshow: true,
    images: "../../images/big_water_network/icon-15.png",
    name: "icon_15",
    datatype: "point",
    width: 0.6,
    visibility: false,
    color: "#ff9900",
  },
  {
    type_id: ["managementObjects"],
    tname: "泵站",
    apiUrl: "api/v4/water_gate_pump/pump",
    apitype: 0,
    listshow: true,
    images: "../../images/big_water_network/icon-23.png",
    name: "icon_23",
    datatype: "point",
    width: 0.6,
    visibility: false,
    color: "#ff9900",
  },
  {
    type_id: ["managementObjects"],
    tname: "水闸",
    apiUrl: "api/v4/water_gate_pump/gate",
    apitype: 0,
    listshow: true,
    images: "../../images/big_water_network/icon-24.png",
    name: "icon_24",
    datatype: "point",
    width: 0.6,
    visibility: false,
    color: "#ff9900",
  },
  {
    type_id: ["managementObjects"],
    tname: "河湖取水口",
    apiUrl: "api/v3/fetchwater/riverIntake",
    apitype: 0,
    listshow: true,
    images: "../../images/big_water_network/icon-25.png",
    name: "icon_25",
    datatype: "point",
    width: 0.6,
    visibility: false,
    color: "#ff9900",
  },
  {
    type_id: ["managementObjects"],
    tname: "入河排污口",
    apiUrl: "api/v3/fetchwater/rowDirt",
    apitype: 0,
    listshow: true,
    images: "../../images/big_water_network/icon-21.png",
    name: "icon_21",
    datatype: "point",
    width: 0.6,
    visibility: false,
    color: "#ff9900",
  },
  {
    type_id: ["managementObjects"],
    tname: "地表水水源地",
    apiUrl: "api/v3/licence/getsurfacewatersource",
    apitype: 1,
    listshow: true,
    images: "../../images/big_water_network/icon-18.png",
    name: "icon_18",
    datatype: "point",
    width: 0.6,
    visibility: false,
    color: "#ff9900",
  },
  {
    type_id: ["managementObjects"],
    tname: "河长公示牌",
    apiUrl: "api/v3/riverchief/map/",
    apitype: 3,
    listshow: true,
    images: "../../images/big_water_network/icon-07.png",
    name: "icon_07",
    datatype: "point",
    width: 0.6,
    visibility: false,
    color: "#ff9900",
  },
  {
    type_id: ["managementObjects"],
    group_id: "group_qy",
    tname: "泉域",
    listshow: true,
    images: "../../images/big_water_network/icon-19.png",
    name: "icon_19",
    width: 0.6,
    visibility: false,
    bgcolor: "rgba(149,187,234,0.5)",
    color: "#2EA2F5",
    datatype: "WMTS",
    serverInfo: {
      WMTS: {
        url: "http://gis.sxjicheng.cn:8081/freexserver/htc/service/wmts",
        type: "WMTS",
        layer: "app_dx_山西泉域",
      },
      WFS: {
        url: "http://gis.sxjicheng.cn:8081/freexserver/wfs?service=WFS&version=1.0.0&request=GetFeature&typename=shp_irrigation&outputFormat=application/json&srsname=EPSG:4326",
        type: "WFS",
        layer: "shp_irrigation",
      },
    },
  },
  {
    type_id: ["managementObjects"],
    tname: "超采区",
    listshow: true,
    images: "../../images/big_water_network/icon-20.png",
    name: "icon_20",
    width: 0.6,
    visibility: false,
    bgcolor: "rgba(252,104,100,0.5)",
    color: "#FC6864",
    jsonUrl: "../../js/map/json/chaocaiqu.json",
  },

  // 大水网 old
  // {type_id:["bigwaternetwork"],group_id:"group_dswgsq",tname:"大水网供水区",listshow:false,name:"big_water_network_1",visibility:false,bgcolor:"#FFFFCB",color:"#FFFFCB",jsonUrl:"../../js/shanxi_water_network/layers_json/big_water_network_1.json"},
  // {type_id:["bigwaternetwork"],group_id:"group_dswgsq",tname:"大水网供水区2",listshow:false,name:"big_water_network_2",visibility:false,bgcolor:"#FFE7FF",color:"#FFE7FF",jsonUrl:"../../js/shanxi_water_network/layers_json/big_water_network_2.json"},
  // {type_id:["bigwaternetwork"],group_id:"group_dswgsq",tname:"大水网供水区3",listshow:false,name:"big_water_network_3",visibility:false,bgcolor:"#E5F8FF",color:"#E5F8FF",jsonUrl:"../../js/shanxi_water_network/layers_json/big_water_network_3.json"},
  // {type_id:["bigwaternetwork"],group_id:"group_dswgsq",tname:"大水网供水区4",listshow:false,name:"big_water_network_4",datatype:"point",visibility:false,bgcolor:"#F0FFE0",color:"#F0FFE0",jsonUrl:"../../js/shanxi_water_network/layers_json/big_water_network_4.json"},
  // {type_id:["bigwaternetwork"],tname:"骨干供水工程",listshow:true,name:"backbone_water_supply",visibility:false,color:"#FC0203",jsonUrl:"../../js/shanxi_water_network/layers_json/backbone_water_supply.json"},
  // {type_id:["bigwaternetwork"],tname:"岩溶大泉供水工程",listshow:true,name:"karst_spring",visibility:false,color:"#0DFC0E",jsonUrl:"../../js/shanxi_water_network/layers_json/karst_spring.json"},
  // {type_id:["bigwaternetwork"],tname:"两纵",listshow:true,name:"two_vertical",width:5,visibility:false,color:"#0DFC0E",jsonUrl:"../../js/map/json/two_vertical.json"},
  // {type_id:["bigwaternetwork"],tname:"十横",listshow:true,name:"shiheng",width:5,visibility:false,color:"#0DFC0E",jsonUrl:"../../js/map/json/shiheng.json"},
  // {type_id:["bigwaternetwork"],group_id:"group_qh",tname:"七河",listshow:true,name:"qihe",width:1,visibility:false,bgcolor:"#73b2ff",color:"#73b2ff",jsonUrl:"../../js/map/json/qihe.json"},
  // {type_id:["bigwaternetwork"],group_id:"group_qh",tname:"七河-字",listshow:true,name:"qihe-zi",datatype:"point",width:0,visibility:false,bgcolor:"#73b2ff",color:"#73b2ff",jsonUrl:"../../js/map/json/qihe_zi.json"},
  // {type_id:["bigwaternetwork"],group_id:"group_wh",tname:"五湖",listshow:true,name:"fivel_akes",width:1,visibility:false,bgcolor:"rgba(83,213,255,0.5)",color:"#53d5ff",jsonUrl:"../../js/map/json/fivel_akes.json"},
  // {type_id:["bigwaternetwork"],group_id:"group_wh",tname:"五湖-字",listshow:true,name:"fivel_akes-zi",datatype:"point",width:0,visibility:false,bgcolor:"rgba(83,213,255,0.5)",color:"#53d5ff",jsonUrl:"../../js/map/json/wuhu_zi.json"},
  // {type_id:["bigwaternetwork"],tname:"泉水",listshow:true,name:"spring_water",datatype:"point",width:3,visibility:false,color:"#0086ff",jsonUrl:"../../js/shanxi_water_network/layers_json/spring_water.json"},
  // {type_id:["bigwaternetwork"],tname:"应急水源供水工程",listshow:true,name:"emergency_water_source",datatype:"point",width:5,visibility:false,color:"#fe0000",jsonUrl:"../../js/shanxi_water_network/layers_json/emergency_water_source.json"},

  // 大水网 new
  // {type_id:["bigwaternetwork"],tname:"两纵水网",listshow:true,name:"dsw_lzsw",datatype:"",width:5,visibility:false,color:"#61C679",jsonUrl:"../../js/map/json/dsw/dsw_lzsw.json"},
  // {type_id:["bigwaternetwork"],tname:"十横水网",listshow:true,name:"dsw_shsw",datatype:"",width:5,visibility:false,color:"#61C679",jsonUrl:"../../js/map/json/dsw/dsw_shsw.json"},
  // {type_id:["bigwaternetwork"],tname:"泵站",listshow:true,name:"dsw_bz",datatype:"point",width:0,visibility:false,color:"#000000",jsonUrl:"../../js/map/json/dsw/dsw_bz.json"},
  // {type_id:["bigwaternetwork"],tname:"供水工程标注",listshow:true,name:"dsw_gsgcbz",datatype:"point",width:0,visibility:false,color:"#902E5D",jsonUrl:"../../js/map/json/dsw/dsw_gsgcbz.json"},
  // {type_id:["bigwaternetwork"],tname:"规划未开工程",listshow:true,name:"dsw_ghwkgc",datatype:"",width:5,visibility:false,color:"#AF4844",jsonUrl:"../../js/map/json/dsw/dsw_ghwkgc.json"},
  // {type_id:["bigwaternetwork"],tname:"河道引水工程",listshow:true,name:"dsw_hdysgc",datatype:"",width:5,visibility:false,color:"#FCFC8F",jsonUrl:"../../js/map/json/dsw/dsw_hdysgc.json"},
  // {type_id:["bigwaternetwork"],tname:"开工剩余工程",listshow:true,name:"dsw_kgsygc",datatype:"",width:5,visibility:false,color:"#505353",jsonUrl:"../../js/map/json/dsw/dsw_kgsygc.json"},
  // {type_id:["bigwaternetwork"],tname:"两纵十横水网标注",listshow:true,name:"dsw_lzshswbz",datatype:"point",width:0,visibility:false,color:"#000000",jsonUrl:"../../js/map/json/dsw/dsw_lzshswbz.json"},
  // {type_id:["bigwaternetwork"],tname:"应急水源供水工程",listshow:true,name:"dsw_yjsygsgc",datatype:"point",width:4,visibility:false,color:"#AF4945",jsonUrl:"../../js/map/json/dsw/dsw_yjsygsgc.json"},

  // 防洪8
  {
    type_id: ["fanghongimportant"],
    group_id: "group_fhzddxx",
    tname: "防洪重点",
    legendname: "山洪地质灾害高发区及防御重点区域",
    // legend: "legend_fh",
    legend_img: "../../images/legend/idon-fh-shdzhhgfq.png",
    listshow: true,
    name: "fanghongzhongdian",
    visibility: false,
    bgcolor: "rgba(246,232,161,0.5)",
    color: "#F9DF82",
    datatype: "WMTS",
    serverInfo: {
      WMS: {
        url: "http://gis.sxjicheng.cn:8081/freexserver/wms",
        // url: "http://www.zhuoyukeji.cn:8081/freexserver/htc/service/wms",
        // url: "http://192.168.1.251:8002/geoserver/sxjicheng/wms",
        type: "WMS",
        layers: "group_防洪重点_新_pc_dt",
      },
      WMTS: {
        url: "http://gis.sxjicheng.cn:8081/freexserver/htc/service/wmts",
        // url: "http://www.zhuoyukeji.cn:8081/freexserver/htc/service/wmts",
        // url:"http://192.168.1.22:8088/freexserver/htc/service/wmts",
        type: "WMTS",
        layer: "group_防洪重点_新_pc_dt",
      },
    },
    legendStatus: "legend_fh",
    legend_li: [{
        legend_names: '山洪地质灾害高发区及防御重点区域',
        legend_imgs: '../../images/legend/idon-fh-shdzhhgfq.png'
      },
      {
        legend_names: '山洪灾害易发区',
        legend_imgs: '../../images/legend/icon-fh-fhzhyfq.png'
      },
      {
        legend_names: '重点淤地坝群',
        legend_imgs: '../../images/legend/icon-fh-zdydbq.png'
      },
      {
        legend_names: '小水库集中区',
        legend_imgs: '../../images/legend/icon-fh-xskjzq.png'
      },
      {
        legend_names: '重点防洪城市',
        legend_imgs: '../../images/legend/icon-fh-shdzhhgfq.png'
      },
      {
        legend_names: '重点防洪县城',
        legend_imgs: '../../images/legend/icon-fh-zdfhxc.png'
      },
      {
        legend_names: '重要河流防洪重点段',
        legend_imgs: '../../images/legend/icon-fhzdhlfhzdd.png'
      },
    ]
  },


  // 生态修复7
  {
    type_id: ["fanghongimportant"],
    group_id: "group_stxf",
    listImg: '../../../images/waterOA/special/1-4.png',
    tname: "生态修复",
    listshow: true,
    name: "qinriver",
    visibility: false,
    datatype: "WMTS",
    serverInfo: {
      "WMS": {
        url: "http://gis.sxjicheng.cn:8081/freexserver/wms",
        type: "WMS",
        layers: "group_生态修复_pc_dt"
      },
      "WMTS": {
        url: "http://gis.sxjicheng.cn:8081/freexserver/htc/service/wmts",
        type: "WMTS",
        layer: "group_生态修复_pc_dt"
      }
    },
    legendStatus: "legend_stxfxmjsx",
    legend_li: [{
        legend_names: '“两山”生态修复项目建设县',
        legend_imgs: '../../images/icon_dsw/light.png'
      },
      {
        legend_names: '“两山”生态修复项目建设重点县',
        legend_imgs: '../../images/icon_dsw/deep.png'
      },
      {
        legend_names: '“七河”生态修复流域',
        legend_imgs: '../../images/icon_dsw/qihe.png'
      },
    ]
  },
  //主体功能17
  //面7
  {
    type_id: ["fanghongimportant"],
    group_id: "group_ztgn",
    tname: "主体功能区",
    legendname: "国家级农产品主要产区",
    legend_group: "ztgn_gjjncpzycq",
    legend_group_name: "国家级农产品主要产区",
    // legend: "legend_ztgn",
    legend_img: "../../images/icon_ztgn/gjjncpzycq.png",
    listshow: true,
    name: "gjjncpzycq",
    width: 1,
    visibility: false,
    bgcolor: "rgba(244, 226, 146, 0.5)",
    color: "#A4A38F",
    datatype: "WMTS",
    serverInfo: {
      WMS: {
        url: "http://gis.sxjicheng.cn:8081/freexserver/wms",
        // url: "http://www.zhuoyukeji.cn:8081/freexserver/htc/service/wms",
        // url: "http://192.168.1.251:8002/geoserver/sxjicheng/wms",
        type: "WMS",
        layers: "group_主体功能区_pc_dt",
      },
      WMTS: {
        url: "http://gis.sxjicheng.cn:8081/freexserver/htc/service/wmts",
        // url: "http://www.zhuoyukeji.cn:8081/freexserver/htc/service/wmts",
        // url:"http://192.168.1.22:8088/freexserver/htc/service/wmts",
        type: "WMTS",
        layer: "group_主体功能区_pc_dt",
      },
    },
    legendStatus: "legend_ztgn",
    legend_li: [{
        legend_names: '国家级农产品主要产区',
        legend_imgs: '../../images/icon_ztgn/gjjncpzycq.png'
      },
      {
        legend_names: '国家级重点开发区域',
        legend_imgs: '../../images/icon_ztgn/gjjzdkfqy.png'
      },
      {
        legend_names: '国家级重点生态功能区',
        legend_imgs: '../../images/icon_ztgn/gjjzdstgnq.png'
      },
      {
        legend_names: '省级重点生态功能区',
        legend_imgs: '../../images/icon_ztgn/sjzdstgnq.png'
      },
      {
        legend_names: '省级重点开发区域',
        legend_imgs: '../../images/icon_ztgn/sjzdkfqy.png'
      },
      {
        legend_names: '省级农产品主产区',
        legend_imgs: '../../images/icon_ztgn/sjncpzcq.png'
      },
      {
        legend_names: '农业发展区域',
        legend_imgs: '../../images/icon_ztgn/nyfzqy.png'
      },
      {
        legend_names: '国土开发轴',
        legend_imgs: '../../images/icon_ztgn/gtkfz.png'
      },
      {
        legend_names: '生态屏障带',
        legend_imgs: '../../images/icon_ztgn/stpzd.png'
      },
      {
        legend_names: '生态治理带',
        legend_imgs: '../../images/icon_ztgn/stzld.png'
      },
      {
        legend_names: '世界遗产',
        legend_imgs: '../../images/icon_ztgn/sjyc.png'
      },
      {
        legend_names: '国家自然保护区',
        legend_imgs: '../../images/icon_ztgn/icon_1.png'
      },
      {
        legend_names: '国家重点风景名胜区',
        legend_imgs: '../../images/icon_ztgn/gjzdfjmsq.png'
      },
      {
        legend_names: '国家森林公园',
        legend_imgs: '../../images/icon_ztgn/icon_2.png'
      },
      {
        legend_names: '国家地质公园',
        legend_imgs: '../../images/icon_ztgn/gjdzgy.png'
      },
      {
        legend_names: '国家湿地公园',
        legend_imgs: '../../images/icon_ztgn/icon_3.png'
      },
    ]
  },

  //行政区划3
  {
    type_id: ["fanghongimportant"],
    group_id: "group_xzqh",
    listImg: '../../../images/waterOA/special/1-6.png',
    tname: "行政区划",
    listshow: true,
    name: "xzqh",
    visibility: false,
    datatype: "WMTS",
    serverInfo: {
      "WMS": {
        url: "http://gis.sxjicheng.cn:8081/freexserver/wms",
        type: "WMS",
        layers: "group_行政区划_pc_dt"
      },
      "WMTS": {
        url: "http://gis.sxjicheng.cn:8081/freexserver/htc/service/wmts",
        type: "WMTS",
        layer: "group_行政区划_pc_dt"
      }
    }
  },
  // {
  //     type_id: ["fanghongimportant"],
  //     group_id: "group_xzqh",
  //     tname: "行政区划市边界",
  //     listshow: true,
  //     name: "xingzhengquhua_shiline",
  //     width: 1,
  //     visibility: false,
  //     bgcolor: "rgba(255,255,255,0)",
  //     color: "#999999",
  //     jsonUrl: "../../js/map/json/line_shi.json",
  // },
  // 交通网络
  // {
  // 	type_id: ["fanghongimportant"],
  // 	group_id: "group_jtwl",
  // 	tname: "交通网络",
  // 	legendname: '交通网络',
  // 	legend_group: "icon_gsgl",
  // 	legend_group_name: "高速公路",
  // 	legend: "legend_jtwl",
  // 	legend_img: "../../images/icon_ztgn/stzld.png",
  // 	listshow: true,
  // 	name: "gsgl",
  // 	width: 3,
  // 	visibility: false,
  // 	bgcolor: null,
  // 	color: "#DAA04E",
  // 	jsonUrl: "../../js/map/json/traffic_network/icon_work_gsgl.json",
  // },
  // {
  // 	type_id: ["fanghongimportant"],
  // 	group_id: "group_jtwl",
  // 	tname: "铁路",
  // 	legendname: '铁路',
  // 	legend_group: "icon_tl",
  // 	legend_group_name: "铁路",
  // 	legend: "legend_jtwl",
  // 	legend_img: "../../images/icon_ztgn/stzld.png",
  // 	listshow: true,
  // 	name: "tl",
  // 	width: 2,
  // 	visibility: false,
  // 	bgcolor: null,
  // 	color: "#256E94",
  // 	jsonUrl: "../../js/map/json/traffic_network/icon_railway.json",
  // },
  // {
  // 	type_id: ["fanghongimportant"],
  // 	group_id: "group_jtwl",
  // 	tname: "国道",
  // 	legendname: '国道',
  // 	legend_group: "icon_gd",
  // 	legend_group_name: "国道",
  // 	legend: "legend_jtwl",
  // 	legend_img: "../../images/icon_ztgn/stzld.png",
  // 	listshow: true,
  // 	name: "guodao",
  // 	width: 2,
  // 	visibility: false,
  // 	bgcolor: null,
  // 	color: "#CC5877",
  // 	jsonUrl: "../../js/map/json/traffic_network/icon_guodao.json",
  // },

  //水利工程8

  // {
  // 	type_id: ["fanghongimportant"],
  // 	group_id: "group_slgc",
  // 	tname: "水利工程",
  // 	legend: "legend_slgc",
  // 	legendname: '水源分区',
  // 	listshow: true,
  // 	datatype: "WMS",
  // 	// datatype: "WMTS",
  // 	name: "szyfq",
  // 	visibility: false,
  // 	bgcolor: "rgba(255, 255, 255, 0.3)",
  // 	color: "#2EA2F5",
  // 	fontSize: 14,
  // 	jsonUrl: "../../js/map/json/szyfq.json",
  // 	legend_img: "../../images/icon_dsw/dxgq.png",
  // 	serverInfo:{
  // 		"WMS":{
  // 			// url:"http://www.zhuoyukeji.cn:8081/freexserver/wms",
  // 			url:"http://192.168.1.251:8002/geoserver/sxjicheng/wms",
  // 			type:"WMS",
  // 			layers:"export"
  // 		},
  // 		"WMTS":{
  // 			// url:"http://www.zhuoyukeji.cn:8081/freexserver/htc/service/wmts",
  // 			url:"http://192.168.1.22:8088/freexserver/htc/service/wmts",
  // 			type:"WMTS",
  // 			layer:"export"
  // 		}
  // 	}
  // },
  {
    type_id: ["fanghongimportant"],
    group_id: "group_slgc",
    tname: "水利工程",
    // legend: "legend_slgc",
    legendname: "两纵十横",
    listshow: true,
    // datatype: "WMS",
    datatype: "WMTS",
    name: "szyfq",
    visibility: false,
    bgcolor: "rgba(255, 255, 255, 0.3)",
    color: "#2EA2F5",
    fontSize: 14,
    legend_img: "../../images/icon_dsw/dxgq.png",
    serverInfo: {
      WMS: {
        // url:"http://www.zhuoyukeji.cn:8081/freexserver/wms",
        url: "http://gis.sxjicheng.cn:8081/freexserver/wms",
        type: "WMS",
        layers: "group_水利工程_pc_dt",
      },
      WMTS: {
        url: "http://gis.sxjicheng.cn:8081/freexserver/htc/service/wmts",
        // url:"http://192.168.1.22:8088/freexserver/htc/service/wmts",
        type: "WMTS",
        layer: "group_水利工程_pc_dt",
      },
    },
    legendStatus: "legend_slgc",
    legend_li: [{
        legend_names: '两纵十横',
        legend_imgs: '../../images/icon_dsw/dxgq.png'
      },
      {
        legend_names: '大、中型泵站',
        legend_imgs: '../../images/icon_dsw/dzxbz.png'
      },
      {
        legend_names: '应急水源工程',
        legend_imgs: '../../images/icon_dsw/yjsygc.png'
      },
      {
        legend_names: '电厂水源',
        legend_imgs: '../../images/icon_dsw/dcsy.png'
      },
    ]
  },
  // 面start
  // {
  // 	type_id: ["fanghongimportant"],
  // 	group_id: "group_slgc",
  // 	tname: "不适宜开发区",
  // 	legend: "legend_slgc",
  // 	listshow: true,
  // 	name: "bsykfq",
  // 	width: 1,
  // 	visibility: false,
  // 	bgcolor: "rgba(255,255,255,0.5)",
  // 	color: "#ABC6A3",
  // 	jsonUrl: "../../js/map/json/slgc/bsykfq.json",
  // },
  // {
  // 	type_id: ["fanghongimportant"],
  // 	group_id: "group_slgc",
  // 	tname: "难以开发区",
  // 	legend: "legend_slgc",
  // 	listshow: true,
  // 	name: "nykfq",
  // 	width: 1,
  // 	visibility: false,
  // 	bgcolor: "rgba(242,240,227,0.5)",
  // 	color: "#ABC6A3",
  // 	jsonUrl: "../../js/map/json/slgc/nykfq.json",
  // },
  // {
  // 	type_id: ["fanghongimportant"],
  // 	group_id: "group_slgc",
  // 	tname: "相对紧缺区",
  // 	legend: "legend_slgc",
  // 	listshow: true,
  // 	name: "xdjqq",
  // 	width: 1,
  // 	visibility: false,
  // 	bgcolor: "rgba(224,181,172,0.5)",
  // 	color: "#ABC6A3",
  // 	jsonUrl: "../../js/map/json/slgc/xdjqq.json",
  // },
  // {
  // 	type_id: ["fanghongimportant"],
  // 	group_id: "group_slgc",
  // 	tname: "相对富水区",
  // 	legend: "legend_slgc",
  // 	listshow: true,
  // 	name: "xdfsq",
  // 	width: 1,
  // 	visibility: false,
  // 	bgcolor: "rgba(165,192,222,0.5)",
  // 	color: "#ABC6A3",
  // 	jsonUrl: "../../js/map/json/slgc/xdfsq.json",
  // },
  // 面end
  //点

  // 交通网络3
  {
    //矢量底图
    type_id: ["fanghongimportant"],
    group_id: "group_jtwl",
    tname: "交通网络",
    legend: "legend_jtwl",
    legendname: "交通网络",
    listshow: true,
    // datatype: "WMS",
    datatype: "WMTS",
    // datatype: "TDT",
    name: "jtwl",
    visibility: false,
    bgcolor: "rgba(255, 255, 255, 0.3)",
    color: "#2EA2F5",
    fontSize: 14,
    // legend_img: "../../images/icon_dsw/dxgq.png",
    serverInfo: {
      WMS: {
        // url:"http://www.zhuoyukeji.cn:8081/freexserver/wms",
        url: "http://gis.sxjicheng.cn:8081/freexserver/wms",
        type: "WMS",
        layers: "group_交通网络_pc_dt",
      },
      WMTS: {
        url: "http://gis.sxjicheng.cn:8081/freexserver/htc/service/wmts",
        // url:"http://192.168.1.251:8088/freexserver/htc/service/wmts",
        type: "WMTS",
        layer: "group_交通网络_pc_dt",
      },
      // TDT: {
      //     url: "http://t0.tianditu.gov.cn/vec_c/wmts?tk=470a3cb94a3196e6c324a42bf6afcb77",
      //     // url:"http://192.168.1.251:8088/freexserver/htc/service/wmts",
      //     type: "TDT",
      //     layer: "vec",
      // },
    },
  },
  // {
  //     type_id: ["fanghongimportant"],
  //     group_id: "group_jtwl",
  //     tname: "行政区划市边界",
  //     listshow: true,
  //     name: "jtwl_shiline",
  //     width: 1,
  //     visibility: false,
  //     bgcolor: "rgba(255,255,255,0)",
  //     color: "#000000",
  //     jsonUrl: "../../js/map/json/line_shi.json",
  // },
  //山脉水系3
  {
    type_id: ["fanghongimportant"],
    group_id: "group_smsx",
    listImg: '../../../images/waterOA/special/1-9.png',
    tname: "山脉水系",
    listshow: true,
    name: "sxsmsx",
    visibility: false,
    datatype: "WMTS",
    serverInfo: {
      "WMS": {
        url: "http://gis.sxjicheng.cn:8081/freexserver/wms",
        type: "WMS",
        layers: "pc_dt_山脉水系标注"
      },
      "WMTS": {
        url: "http://gis.sxjicheng.cn:8081/freexserver/htc/service/wmts",
        type: "WMTS",
        layer: "pc_dt_山脉水系标注"
      }
    },
  },

  // {
  // 	type_id: ["fanghongimportant"],
  // 	group_id: "group_slgc",
  // 	tname: "水利工程",
  // 	legend: "legend_slgc",
  // 	legendname: '水源分区',
  // 	listshow: true,
  // 	datatype: "WMS",
  // 	// datatype: "WMTS",
  // 	name: "szyfq",
  // 	visibility: false,
  // 	bgcolor: "rgba(255, 255, 255, 0.3)",
  // 	color: "#2EA2F5",
  // 	fontSize: 14,
  // 	jsonUrl: "../../js/map/json/szyfq.json",
  // 	legend_img: "../../images/icon_dsw/dxgq.png",
  // 	serverInfo:{
  // 		"WMS":{
  // 			// url:"http://www.zhuoyukeji.cn:8081/freexserver/wms",
  // 			url:"http://192.168.1.251:8002/geoserver/sxjicheng/wms",
  // 			type:"WMS",
  // 			layers:"export"
  // 		},
  // 		"WMTS":{
  // 			// url:"http://www.zhuoyukeji.cn:8081/freexserver/htc/service/wmts",
  // 			url:"http://192.168.1.22:8088/freexserver/htc/service/wmts",
  // 			type:"WMTS",
  // 			layer:"export"
  // 		}

  // 	}
  // },
  //太原都市区9
  {
    //太原都市区范围
    type_id: ["fanghongimportant"],
    group_id: "group_tydsq",
    tname: "太原都市区",
    // legend: "legend_tydsq",
    legendname: "太原都市区",
    listshow: true,
    // datatype: "WMS",
    datatype: "WMTS",
    name: "tydsq_line",
    visibility: false,
    bgcolor: "rgba(255, 255, 255, 0.3)",
    color: "#2EA2F5",
    fontSize: 14,
    legend_img: "",
    serverInfo: {
      WMS: {
        // url:"http://www.zhuoyukeji.cn:8081/freexserver/wms",
        // url: "http://192.168.1.251:8002/geoserver/sxjicheng/wms",
        url:"http://gis.sxjicheng.cn:8081/freexserver/wms",
        type: "WMS",
        layers: "group_太原都市区_app_dx",
      },
      WMTS: {
        url: "http://gis.sxjicheng.cn:8081/freexserver/htc/service/wmts",
        type: "WMTS", //
        layer: "group_太原都市区_app_dx",
      },
    },
    legendStatus: "legend_tydsq",
    legend_li: [{
        legend_names: '生态廊道',
        legend_imgs: '../../images/icon_stld/stlf.png'
      },
      {
        legend_names: '生态隔离区',
        legend_imgs: '../../images/icon_stld/stglq.png'
      },
      {
        legend_names: '组团',
        legend_imgs: '../../images/icon_stld/tyzt.png'
      },
      {
        legend_names: '都市区培育中心',
        legend_imgs: '../../images/icon_stld/dsqpyzx.png'
      },
      {
        legend_names: '都市区提升中心',
        legend_imgs: '../../images/icon_stld/dsqtszx.png'
      },
      {
        legend_names: '新市镇',
        legend_imgs: '../../images/icon_stld/newshizhen.png'
      },
    ]
  },
];

console.log("============共加载" + layersInfo.length + "条数据==============");
