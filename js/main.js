var articles = {};
$("#searchBtn").click(function (e) {
    e.preventDefault();
    keyword = $("#keyword").val().toLowerCase();
    if (keyword) {
        $("#loading").addClass("loading");
        $("#keyword").val("");

        var media = [];
        $(".newsChoice").each(function () {
            if (this.checked)
                media.push($(this).val());
        })
        media = media.map(function (i) {
            return "'" + i + "'";
        }).join(',');

        var date = new Date();
        date.setDate(date.getDate() - 14);
        dateInt = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();

        $.when(
            $.ajax("https://api.mlab.com/api/1/databases/stock_advisor/collections/news?apiKey=ag0Rk7g_YEg5Eq6tsmuQQdHjH7KlVm5t&q={'query':'" + keyword + "','time':{$gt:" + dateInt + "},'publisher':{$in:[" + media + "]}}"),
            $.ajax("https://api.mlab.com/api/1/databases/stock_advisor/collections/ticker?apiKey=ag0Rk7g_YEg5Eq6tsmuQQdHjH7KlVm5t&q={'company':'" + keyword + "','date':{$gt:" + dateInt + "}}")
        ).done(function (data1, data2) {
            var news = data1[0];
            var stock = data2[0];
            var data = {};
            articles = {};
            for (var i = 0; i < 14; i++) {
                date.setDate(date.getDate() + 1);
                var dStr = (date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()).toString();
                data[dStr] = {
                    positive: [],
                    negative: [],
                    close: -1
                };
                articles[dStr] = {
                    positive: '',
                    negative: ''
                };
            }
            for (var i = 0; i < news.length; i++) {
                var n = news[i];
                var dStr = n['time'].toString();
                var w = n['weight'];
                var article = {
                    id: n['_id']['$oid'],
                    url: n['url'],
                    title: n['title'],
                    weight: w
                };
                if (w >= 0)
                    data[dStr]['positive'].push(article);
                else
                    data[dStr]['negative'].push(article);
            }
            
            for (var i = 0; i < stock.length; i++) {
                s = stock[i];
                data[s['date'].toString()]['close'] = s['close'];
            }

            chart.dataProvider = [];
            for (var k in data) {
                data[k]['positive'].sort(function(a, b) {
                    return a.w - b.w;
                });
                for (var i = 0; i < data[k]['positive'].length; i++) {
                    var n = data[k]['positive'][i];
                    articles[k]['positive'] += '<p article-id="' + n['id'] + '"><span class="glyphicon glyphicon-thumbs-up upvote" aria-hidden="true"></span> <span class="glyphicon glyphicon-thumbs-down downvote" aria-hidden="true"></span> <a class="article-link" target="_blank" href="' + n['url'] + '">' + n['title'] + '</a></p>';
                }
                    
                data[k]['negative'].sort(function(a, b) {
                    return b.w - a.w;
                });
                for (var i = 0; i < data[k]['negative'].length; i++) {
                    var n = data[k]['negative'][i];
                    articles[k]['negative'] += '<p article-id="' + n['id'] + '"><span class="glyphicon glyphicon-thumbs-up upvote" aria-hidden="true"></span> <span class="glyphicon glyphicon-thumbs-down downvote" aria-hidden="true"></span> <a class="article-link" target="_blank" href="' + n['url'] + '">' + n['title'] + '</a></p>';
                }
                
                o = {
                    "date": k,
                    "positive": data[k]['positive'].length,
                    "negative": data[k]['negative'].length
                };
                if (data[k]['close'] > 0)
                    o['price'] = data[k]['close'];
                chart.dataProvider.push(o);
            }
            chart.validateData();
            $("#query").text(" - " + keyword);
            $("#loading").removeClass("loading");
        }).fail(function () {
            alert("Damn, something went wrong!");
        });
    }
});


var blurStart = 0;
$(window).focus(function () {
    if (articleClicked !== null) {
        var bounceTime = new Date().getTime() - blurStart;
        console.log(bounceTime);
        $.ajax({
            url: "https://api.mlab.com/api/1/databases/stock_advisor/collections/news/" + articleClicked + "?apiKey=ag0Rk7g_YEg5Eq6tsmuQQdHjH7KlVm5t",
            data: JSON.stringify({"$push": {"bounceTime": bounceTime}}),
            type: "PUT",
            contentType: "application/json"
        });
        articleClicked = null;
    }
}).blur(function () {
    blurStart = new Date().getTime();
});

$(document).ready(function () {
    $('.newsChoice').each(function () {
        this.checked = true;
    });
});