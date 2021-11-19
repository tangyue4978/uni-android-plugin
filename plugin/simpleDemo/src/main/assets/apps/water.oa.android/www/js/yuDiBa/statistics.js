var root = localStorage.getItem("str_url");
console.log(root);
if (root == "" || root == undefined || root == null) {
    // mui.openWindow({
    // 	url: 'login.html?cid=1', //通过URL传参
    // 	id: 'login.html?cid=1', //通过URL传参
    // })
}
var token = localStorage.getItem("token");
console.log(token);
var obj_data = {};
var countObj = {};
mui.plusReady(function () {
    var self = plus.webview.currentWebview();
    plus.nativeUI.showWaiting("加载中...");
    obj_data.token = token;
    obj_data.year = $("#date").val();
    claerDetail(obj_data);
    countObj.token = token;
});

function claerDetail(obj) {
    console.log(JSON.stringify(obj));
    var _url = root + "api/v3/fetchwaters/backbone/statistics_new";
    mui.ajax(_url, {
        data: obj_data,
        datatype: "json", //服务器返回json格式数据
        type: "post", //HTTP请求类型
        success: function (data) {
            console.log(JSON.stringify(data));
            plus.nativeUI.closeWaiting();

            if (data.code == 1) {
                // 标题
                $(".title_text").text(data.data.title);
                //选择日期start
                $("#date").html(
                    "<option value='" +
                        data.data.year[0].value +
                        "'>" +
                        data.data.year[0].text +
                        "</option>"
                );
                document.querySelector("#date").addEventListener("tap", function () {
                    var picker = new mui.PopPicker();
                    picker.setData(data.data.year);
                    picker.show(function (SelectedItem) {
                        console.log(JSON.stringify(SelectedItem[0].text));
                        var data = SelectedItem[0].text;
                        $("#date").html("<option value=" + data + ">" + data + "</option>");
                    });
                });
                //选择日期end

                // 淤地坝总座数
                var totals = data.data.provice_data[0];
                $(".totals_data").text(totals.value);
                $(".totals_name").text(totals.name);
                var totals1 = data.data.provice_data[1];
                $(".color1").text(totals1.value);
                $(".color2").text(totals1.name);
                var totals2 = data.data.provice_data[2];
                $(".color3").text(totals2.value);
                $(".color4").text(totals2.name);
                var totals3 = data.data.provice_data[3];
                $(".color5").text(totals3.value);
                $(".color6").text(totals3.name);
                // var totals4 = data.data.provice_data[4];
                // $(".color7").text(totals4.value);
                // $(".color8").text(totals4.name);

                // 统计表格
                $("#tabhead").html("");
                $("#tabcontent").html("");
                var tabhead_hmlt = data.data.head;
                $("#tabhead").html(tabhead_hmlt);
                var tabcontent_html = "";
                var tabcontent = data.data.body;
                for (let i = 0; i < tabcontent.length; i++) {
                    tabcontent_html += '<tr class="active' + i + '">';
                    var tabcontentCity = tabcontent[i].city;
                    for (let j = 0; j < tabcontentCity.length - 1; j++) {
                        tabcontent_html +=
                            '<td data-code="' +
                            tabcontentCity[tabcontentCity.length - 1] +
                            '">' +
                            tabcontentCity[j] +
                            "</td>";
                    }
                    tabcontent_html += "</tr>";
                }
                $("#tabcontent").html(tabcontent_html);
                $("#tabhead tr").append("<th></th>");
                $("#tabcontent tr").append(
                    '<td class="arrow"><img class="arrowImg" src="../../images/riverChief/down.png" ></td>'
                );
                console.log($("#tabcontent").html());
            }
        },
        error: function (xhr, type, errorThrown) {
            plus.nativeUI.closeWaiting();
        },
    });
}

// 区县接口
var count_html;
function count(countObj, index) {
    console.log(JSON.stringify(countObj));
    var _url = root + "api/v3/fetchwaters/backbone/count_new";
    mui.ajax(_url, {
        data: countObj,
        datatype: "json", //服务器返回json格式数据
        type: "post", //HTTP请求类型
        success: function (data) {
            console.log(JSON.stringify(data));
            plus.nativeUI.closeWaiting();

            if (data.code == 1) {
                count_html = "";
                var bodys = data.data.body;
                for (let i = 0; i < bodys.length; i++) {
                    count_html += '<tr class="county' + index + ' county">';
                    for (let j = 0; j < bodys[i].length; j++) {
                        count_html += "<td>" + bodys[i][j] + "</td>";
                    }
                    count_html += "<td></td></tr>";
                }
                console.log("active" + index + "");
                // $('#tabcontent tr').eq(index).after(count_html)
                // $('#tabcontent .active'+index+'').after(count_html)
                $("#tabcontent")
                    .find(".active" + index + "")
                    .after(count_html);

                console.log($("#tabcontent ").html());
            }
        },
        error: function (xhr, type, errorThrown) {
            plus.nativeUI.closeWaiting();
        },
    });
}
// 点击显示区县
$("#tabcontent").on("click", ".arrow", function () {
    var active_index = $(this).parent().attr("class").slice(6);
    console.log(active_index);
    if ($(this).hasClass("actives" + active_index)) {
        $(this).css("transform", "rotate(0deg)");
        $(this).removeClass("actives" + active_index);
        // 隐藏对应的区县
        // $(this).parent('tr').nextAll('.county'+active_index+'').remove();
        $(this)
            .parent("tr")
            .nextAll(".county" + active_index + "")
            .css("display", "none");
        console.log($("#tabcontent ").html());
    } else {
        $(this).css("transform", "rotate(180deg)");
        $(this).addClass("actives" + active_index);
        // 调用区县接口，传入市编码和tr上面的0-10下标
        countObj.county = $(this).prev().attr("data-code");
        count(countObj, active_index);
    }
});
