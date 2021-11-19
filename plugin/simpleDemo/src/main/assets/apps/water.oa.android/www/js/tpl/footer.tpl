
<nav class="nav" id="nav">
	{{each list val i}}
		{{if val.show == true}}
			<a class="nav_a {{if active == i}} active {{else}}  {{/if}}" id="{{val.id}}" href="{{val.href}}">
				<span class="{{val.icon}}"></span>
				<span class="navwenzi">{{val.name}}</span>
			</a>
		{{else}}
			<a class="nav_a" id="a3" href="main.html">
				<img src="../../images/322.png" class="nav_img" alt="">
				<!--<span class=" navwenzi"></span>-->
			</a>
		{{/if}}
	{{/each}}
</nav>