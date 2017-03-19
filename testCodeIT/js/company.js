"use strict";

// creating var from html
var $total = $('#total-comp'),
    $listcomp = $('#companyies ul'),
    $ChartComp = $('#charlocation'),
    $listChartComp = $('#listlocation ul'),
    $news = $('.carousel-inner'),
    $indicators = $('.carousel-indicators'),
    loader = '<div class="loader"></div>';


function compareNumeric(a, b) {
    if (a.value > b.value) return 1;
    if (a.value < b.value) return -1;
}

function compareName(a, b) {
    if (a.name > b.name) return 1;
    if (a.name < b.name) return -1;
}
// scroll
$('#companyies').slimscroll({
    height: '200px',
    color: '#330a2e',
    opacity: 0.8,
    size: '14px',
    alwaysVisible: true,
    railVisible: true,
    railColor: '#a24195',
    railOpacity: .9,
    wheelStep: 10
});
// scroll
$('#companyies').slimscroll({
    height: '200px',
    color: '#330a2e',
    opacity: 0.8,
    size: '14px',
    alwaysVisible: true,
    railVisible: true,
    railColor: '#a24195',
    railOpacity: .9,
    wheelStep: 10
});

$(function() {
    // companies
    $.getJSON("http://codeit.pro/frontTestTask/company/getList", function(data) {

        var items = [];
        $.each(data, function(key, val) {
            items.push({
                key: val
            });
        });
        var compArr = items[0]['key'];
        var name = compArr.map(item => item.name);
        // total companies
        var total = name.length;
        $total.text(total);
        $('.loader').hide();
        $('#total-comp').show();
        // companies list
        $.each(name, function(key, val) {
            items.push(`<a href="#" data-id="${key}"><li>${val}</li></a>`);
        });

        $listcomp.html(items);

        var comp_id, //id of company
            part_arr, //array of parners
            location_arr, //array of companies location
            loc_arr_ass = [], //associative array of companies location for chart
            chart, //Partners chart
            chart_loc, //Location chart
            partners, //partners array
            location; //location array

        // partners array
        partners = compArr.map(item => item.partners);

        $('#companyies a').on("click", function() {
            $('#partners').slideDown('600');
            $('#companyies a li').removeClass('active');
            $(this).find('li').addClass('active');

            comp_id = $(this).data('id');
            part_arr = partners[comp_id];

            part_arr.sort(compareNumeric).reverse();
            chart.dataProvider = part_arr;
            chart.validateData();
        });

        // sorting function

        function sorting(obj, func, way){
            $(obj).on("click", function() {
                if (way == 'up') part_arr.sort(func);
                if (way == 'down') part_arr.sort(func).reverse();
                chart.dataProvider = part_arr;
                chart.validateData();
            });
        }

        sorting('#percent-up', compareNumeric, 'up');
        sorting('#percent-down', compareNumeric, 'down');
        sorting('#name-up', compareName, 'up');
        sorting('#name-down', compareName, 'down');


        // Company partners charts
        chart = AmCharts.makeChart("chartpartners", {
            "type": "serial",
            "valueAxes": [{
                "gridColor": "#FFFFFF",
                "gridAlpha": 0.2,
                "dashLength": 0,
                "title": "Percents, %"
            }],
            "gridAboveGraphs": true,
            "startDuration": 1,
            "graphs": [{
                "balloonText": "[[category]]: <b>[[value]]</b>",
                "fillAlphas": 0.8,
                "lineAlpha": 0.2,
                "type": "column",
                "valueField": "value"
            }],
            "chartCursor": {
                "categoryBalloonEnabled": false,
                "cursorAlpha": 0,
                "zoomable": false
            },
            "categoryField": "name",
            "categoryAxis": {
                "gridPosition": "start",
                "gridAlpha": 0,
                "tickPosition": "start",
                "tickLength": 20
            }
        });

        /*--LOCATION--*/
        $('#listlocation').hide();
        $('#backtoform').hide();

        // Location chart
        chart_loc = AmCharts.makeChart("charlocation", {
            "type": "pie",
            "titleField": "country",
            "valueField": "value",
            "balloon": {
                "fixedPosition": true
            },
            "listeners": [{
                "event": "clickSlice",
                "method": function(e) {
                    var dp = e.dataItem.dataContext;
                    $('#charlocation').hide();
                    $('#listlocation').show();
                    $('#backtoform').show();

                    var getProp = prop => object => object[prop];
                    var getCompName = getProp('name');

                    var selCountry = local => local.location.name === dp.country; //filter country

                    var contryCompanies = compArr
                        .filter(selCountry)
                        .map(getCompName);

                    var selItems = [];

                    $.each(contryCompanies, function(key, val) {
                        selItems.push(`<a href="#"><li>${val}</li></a>`);
                    });

                    $listChartComp.html(selItems);

                    $('#backtoform').on("click", function() {
                        $('#listlocation').hide();
                        $('#backtoform').hide();
                        $('#charlocation').show();
                    });

                }
            }]
        });

        // location array
        location = compArr.map(item => item.location);

        // location array for chart
        location_arr = location.reduce((counts, country) => {
            counts[country.name] = (counts[country.name] || 0) + 1;
            return counts;
        }, {});

        for (let key in location_arr) {
            loc_arr_ass.push({
                'country': key,
                'value': location_arr[key]
            });
        }

        chart_loc.dataProvider = loc_arr_ass;
        chart_loc.validateData();

    });

    // news list
    $.getJSON("http://codeit.pro/frontTestTask/news/getList", function(data) {
        var items = [];
        $.each(data, function(key, val) {
            items.push({
                key: val
            });
        });

        var newsArr = items[0]['key'];
        $news.empty();

        // news block
        $.each(newsArr, function(i, val) {
            // cut news text
            var sliced = val.description.slice(0, 220);
            sliced = (sliced.length < val.description.length) ? sliced += '...' : sliced;

            $news.append(`
              <div class="row item">
                <div class="news-img col-xs-12 col-md-6 col-lg-5">
                  <img src="${val.img}" alt="">
                </div>
                <div class="news-body col-xs-12 col-md-6 col-lg-7">
                  <h3><a href="${val.link}" target="_blank">Title</a></h3>
                   <p>${sliced}</p>
                </div>
                <div class="news-footer col-xs-12">
                  <div class="col-xs-6 text-left">
                    <b>Author:</b> <span class="newsauthor">${val.author}</span>
                  </div>
                  <div class="col-xs-6 text-right">
                    <b>Date:</b> <span class="newsdate">${moment.unix(val.date).format("DD.MM.YYYY")}</span>
                  </div>
                </div>
              </div>
            `);

            $indicators.append(`<li data-target="#carousel-news" data-slide-to="${i}"></li>`);
        });
        // active class for first slide
        $($indicators).find("li").eq(0).addClass('active');
        $('.carousel-inner .item').eq(0).addClass('active');

    });

});
