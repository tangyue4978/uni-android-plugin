requirejs.config({
  baseUrl: '../../',
  paths: {
    'art-template': 'js/art/template-web',
    'text': 'js/requirejs/lib/text',
    'css': 'js/requirejs/lib/css.min',
    'mui': 'css/mui.min',
    'header': 'js/tpl/header.tpl',
    'footer': 'js/tpl/footer.tpl'
  }
});

//初始化
var init_data = {
	/* 头部配置项 */
	back_show:true,
	bach_class:'mui-action-back mui-icon mui-icon-left-nav mui-pull-left',
	title_name:'标题',
	href: '#',
	href_name:'保存',
	href_show:false,
	/* end */
	active_menu:0,
}
//重置配置
if(page_data){
	for (var obj in page_data) {
    init_data[obj] = page_data[obj];
  }
}

 var header_data = {
    title: init_data.title_name,
    back: init_data.back_show,
    back_show:init_data.back_show,
    back_class:init_data.bach_class,
    href: init_data.href,
    href_name:init_data.href_name,
    href_show:init_data.href_show,
  };
  var footer_data = {
    list: [{
    	id:'defaultTab',
    	href:'news.html',
    	show:true,
    	name:'消息',
    	icon:'mui-icon iconfont icon-xiaoxi',
    },{
    	id:'a2',
    	href:'handle.html',
    	show:true,
    	name:'办理',
    	icon:'mui-icon iconfont icon-daiban',
    },{
    	id:'a3',
    	href:'main.html',
    	show:false,
    	name:' ',
    	icon:'mui-icon iconfont icon-xiaoxi',
    },{
    	id:'a4',
    	href:'addressBookone.html',
    	show:true,
    	name:'通讯录',
    	icon:'mui-icon iconfont icon-address-book-o',
    },{
    	id:'a5',
    	href:'my.html',
    	show:true,
    	name:'我的',
    	icon:'mui-icon icon-gerenzhongxin iconfont',
    }],
    active: init_data.active_menu
  };
requirejs(['css!mui','text!header','text!footer','art-template'],function(mui, header,footer,artTemplate){
 
  var header = artTemplate.render(header, header_data);
  document.getElementById('header').innerHTML = header;
   var footer = artTemplate.render(footer, footer_data);
  document.getElementById('footer').innerHTML = footer;
});