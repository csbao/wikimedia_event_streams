var w = 600,
    h = 600;

var colorscale = d3.scale.category10();

//Legend titles

var LegendOptions = ['en.wikipedia.org', 'commons.wikimedia.org', 'www.wikidata.org']; //'fr.wikipedia.org', 'de.wikipedia.org'];


//Options for the Radar chart, other than default
var mycfg = {
    w: w,
    h: h,
    levels: 5,
    ExtraWidthX: 200
};

var d = [];
LegendOptions.forEach(function(server) {
    d.push([
        {axis: "edit", value: 0},
        {axis: "categorize", value: 0},
        {axis: "new", value: 0},
        {axis: "log", value: 0},
        {axis: "external", value: 0}
    ]);
});

RadarChart.draw("#chart", d, mycfg);


////////////////////////////////////////////
/////////// Initiate legend ////////////////
////////////////////////////////////////////

var svg = d3.select('#container')
    .selectAll('svg')
    .append('svg')
    .attr("width", w+300)
    .attr("height", h);

//Create the title for the legend
var text = svg.append("text")
    .attr("class", "title")
    .attr('transform', 'translate(90,0)')
    .attr("x", w - 70)
    .attr("y", 10)
    .attr("font-size", "12px")
    .attr("fill", "#404040")
    .text("Wikis");

//Initiate Legend	
var legend = svg.append("g")
        .attr("class", "legend")
        .attr("height", 100)
        .attr("width", 200)
        .attr('transform', 'translate(90,20)')
    ;
//Create colour squares
legend.selectAll('rect')
    .data(LegendOptions)
    .enter()
    .append("rect")
    .attr("x", w - 65)
    .attr("y", function(d, i){ return i * 20;})
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", function(d, i){ return colorscale(i);})
;
//Create text next to squares
legend.selectAll('text')
    .data(LegendOptions)
    .enter()
    .append("text")
    .attr("x", w - 52)
    .attr("y", function(d, i){ return i * 20 + 9;})
    .attr("font-size", "11px")
    .attr("fill", "#737373")
    .text(function(d) { return d; })
;

var title = svg.append("text")
    .attr("class", "header")
    .attr('transform', 'translate(90,0)')
    .attr("x", -80)
    .attr("y", h/20)
    .attr("font-size", "20px")
    .attr("fill", "#d3d3d3")
    .text("Geometries of different wikis, created");

var title2 = svg.append("text")
    .attr("class", "header")
    .attr("transform", "translate(90,0)")
    .attr("x", 0)
    .attr("y", h/12)
    .attr("font-size", "20px")
    .attr("fill", "#d3d3d3")
    .text(" by user (non-bot) behavior")

var url = 'https://stream.wikimedia.org/v2/stream/recentchange';
var eventSource = new EventSource(url);
var mapping = {
    "edit": 0,
    "categorize": 1,
    "new": 2,
    "log": 3,
    "external": 4
}

function validateType(type) {
    return (["new", "edit", "categorize", "log", "external"].indexOf(type) >= 0);
}

function filterServer(server) {
    return (LegendOptions.indexOf(server) >=0);
}

eventSource.onmessage = function (event) {
    var obj = JSON.parse(event.data);
    if(!obj.bot && validateType(obj.type) && filterServer(obj.server_name)) {

        var index = LegendOptions.indexOf(obj.server_name);
        d[index][mapping[obj.type]].value++;

        RadarChart.update("#chart", d, mycfg);

    }
};
