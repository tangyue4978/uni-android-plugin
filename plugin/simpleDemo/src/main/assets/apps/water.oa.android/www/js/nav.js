var isHeader = localStorage.getItem("isHeader");
if (isHeader=="0") {
	$("#a2").attr("href","handle.html");
} else{
	$("#a2").attr("href","handle_director.html");
}