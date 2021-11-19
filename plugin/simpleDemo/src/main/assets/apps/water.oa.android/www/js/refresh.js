mui.init({
			pullRefresh: {
				container: ".mui-content", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
				down: {
					style: 'circle', //必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
					color: '#2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
					height: '100px', //可选,默认50px.下拉刷新控件的高度,
					range: '100px', //可选 默认100px,控件可下拉拖拽的范围
					offset: '10px', //可选 默认0px,下拉刷新控件的起始位置
					auto: false, //可选,默认false.首次加载自动上拉刷新一次
					callback: down_fun //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
				}
//				,up: {
//					height: "50px", //可选.默认50.触发上拉加载拖动距离
//					auto: false, //可选,默认false.自动上拉加载一次
//					contentdown: "上拉显示更多",
//					contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
//					contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
//					callback: up_fun //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
//				}
			}
		});
		function down_fun() {
			location.reload();
		}
//		function up_fun(){
//			
//		}





			