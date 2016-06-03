var articleClicked = null;
var chart = AmCharts.makeChart("chartdiv", {
  "type": "serial",
  "theme": "light",
  "dataDateFormat": "YYYYMMDD",
  "precision": -1,
  "valueAxes": [{
    "id": "v1",
    "title": "Stock Price",
    "position": "left",
    "autoGridCount": false,
    "labelFunction": function(value) {
      return "$" + Math.round(value);
    }
  }, {
    "id": "v2",
    "title": "Number of News Articles",
    "gridAlpha": 0,
    "position": "right",
    "autoGridCount": false
  }],
  "graphs": [{
    "id": "g3",
    "valueAxis": "v2",
    "lineColor": "#62cf73",
    "fillColors": "#62cf73",
    "fillAlphas": 1,
    "type": "column",
    "title": "Positive Articles",
    "valueField": "positive",
    "clustered": true,
    "columnWidth": 0.6,
    "balloonText": "[[title]]<br/><b style='font-size: 130%'>[[value]]</b>"
  }, {
    "id": "g4",
    "valueAxis": "v2",
    "lineColor": "#ff4d4d",
    "fillColors": "#ff4d4d",
    "fillAlphas": 1,
    "type": "column",
    "title": "Negative Articles",
    "valueField": "negative",
    "clustered": true,
    "columnWidth": 0.6,
    "balloonText": "[[title]]<br/><b style='font-size: 130%'>[[value]]</b>"
  }, {
    "id": "g1",
    "valueAxis": "v1",
    "bullet": "round",
    "bulletBorderAlpha": 1,
    "bulletColor": "#FFFFFF",
    "bulletSize": 5,
    "hideBulletsCount": 50,
    "lineThickness": 2,
    "lineColor": "#20acd4",
    "type": "line",
    "title": "Stock Price",
    "useLineColorForBulletBorder": true,
    "valueField": "price",
    "legendValueText": "$[[value]]",
    "balloonText": "[[title]]<br/><b style='font-size: 130%'>$[[value]]</b>"
  }],
  "chartScrollbar": {
    "graph": "g1",
    "oppositeAxis": false,
    "offset": 30,
    "scrollbarHeight": 50,
    "backgroundAlpha": 0,
    "selectedBackgroundAlpha": 0.1,
    "selectedBackgroundColor": "#888888",
    "graphFillAlpha": 0,
    "graphLineAlpha": 0.5,
    "selectedGraphFillAlpha": 0,
    "selectedGraphLineAlpha": 1,
    "autoGridCount": true,
    "color": "#AAAAAA"
  },
  "chartCursor": {
      /*
    "pan": true,
    "valueLineEnabled": true,
    "valueLineBalloonEnabled": true,
    "cursorAlpha": 0.1,
    "valueLineAlpha": 0.2*/
    "cursorAlpha": 0.1,
    "cursorColor": "#000000",
    "fullWidth": true,
    "valueBalloonsEnabled": false,
    "zoomable": false
  },
  "categoryField": "date",
  "categoryAxis": {
    "parseDates": true,
    "dashLength": 1,
    "minorGridEnabled": true
  },
  "legend": {
    "useGraphSettings": true,
    "position": "top"
  },
  "balloon": {
    "borderThickness": 1,
    "shadowAlpha": 0
  },
  "export": {
    "enabled": true
  },
  "listeners": [{
    "event": "changed",
    "method": function(e) {
      if (e.index !== undefined && e.index !== null)
        chart.cursorDataContext = e.chart.dataProvider[e.index]['date'];
    }
  }, {
    "event": "rendered",
    "method": function(e) {
      e.chart.chartDiv.addEventListener('click', function() {
        var pos = articles[chart.cursorDataContext]['positive'];
        var neg = articles[chart.cursorDataContext]['negative'];
        if (pos)
          $("#positive").html(pos);
        else
          $("#positive").html("<p>Sorry... Nothing found</p>");
        if (neg)
          $("#negative").html(neg);
        else
          $("#negative").html("<p>Sorry... Nothing found</p>");

        $("span.vote").click(function(e) {
          if ($(this).hasClass('text-primary'))
            console.log("You unvoted " + e.target.parentElement.getAttribute("article-id"));
          else
            console.log("You voted " + e.target.parentElement.getAttribute("article-id"));
          $(this).toggleClass('text-primary');
        });

        $("a.article-link").click(function(e) {
          articleClicked = e.target.parentElement.getAttribute("article-id");
        })
      })
    }
  }],
  "dataProvider": []
});