{{if isAdmin}}
		
		<h1>{{title}}</h1>
		<ul>
		    {{each list value i}}
		        <li>索引 {{i + 1}} ：{{value}}</li>
		    {{/each}}
		</ul>
		
		{{/if}}
		{{$data}}