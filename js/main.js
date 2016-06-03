var articles = {};
$("#searchBtn").click(function(e) {
    e.preventDefault();
    keyword = $("#keyword").val().toLowerCase();
    if (keyword) {
        $("#loading").addClass("loading");
        $("#keyword").val("");
        
        var media = [];
        $(".newsChoice").each(function() {
            if (this.checked)
                media.push($(this).val());
        })
        media = media.map(function(i) {
            return "'" + i + "'";
        }).join(',');
        
        var date = new Date();
        date.setDate(date.getDate() - 14);
        dateInt = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
        
        $.when(
            $.ajax("https://api.mlab.com/api/1/databases/stock_advisor/collections/news?apiKey=ag0Rk7g_YEg5Eq6tsmuQQdHjH7KlVm5t&q={'query':'" + keyword + "','timeInt':{$gt:" + dateInt + "},'publisher':{$in:[" + media + "]}}"),
            $.ajax("https://api.mlab.com/api/1/databases/stock_advisor/collections/ticker?apiKey=ag0Rk7g_YEg5Eq6tsmuQQdHjH7KlVm5t&q={'company':'" + keyword + "','date':{$gt:" + dateInt + "}}")
        ).done(function(data1, data2) {
            var news = data1[0];
            var stock = data2[0];
            var data = {};
            articles = {};
            for (var i = 0; i < 14; i++) {
                date.setDate(date.getDate() + 1);
                dStr = (date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()).toString();
                data[dStr] = {positive: 0, negative: 0, close: -1};
                articles[dStr] = {positive: '', negative: ''};
            }
            for (var i = 0; i < news.length; i++) {
                var n = news[i];
                if (n['sentiment']['type'] == 'neutral')
                    continue;
                var k1 = n['timeInt'].toString();
                var k2 = n['sentiment']['type'];
                data[k1][k2]++;
                articles[k1][k2] += '<p article-id="' + n['_id']['$oid'] + '"><span class="glyphicon glyphicon-thumbs-up vote" aria-hidden="true"></span> <a class="article-link" target="_blank" href="' + n['url'] + '">' + n['title'] + '</a></p>';
            }
            for (var i = 0; i < stock.length; i++) {
                s = stock[i];
                data[s['date'].toString()]['close'] = s['close'];
            }
            
            chart.dataProvider = [];
            for (var k in data) {
                o = {
                    "date": k,
                    "positive": data[k]['positive'],
                    "negative": data[k]['negative']
                };
                if (data[k]['close'] > 0)
                    o['price'] = data[k]['close'];
                chart.dataProvider.push(o);
            }
            chart.validateData();
            $("#query").text(" - " + keyword);
            $("#loading").removeClass("loading");
        }).fail(function() {
            alert("Damn, something went wrong!");
        });
    }
});


var blurStart = 0;
$(window).focus(function() {
    if (articleClicked !== null) {
        console.log(new Date().getTime() - blurStart);
        articleClicked = null;
    }
}).blur(function() {
    blurStart = new Date().getTime();
});

$('.newsChoice').each(function() {
    this.checked = true;
});