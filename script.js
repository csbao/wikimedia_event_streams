var w = 500,
    h = 500;

var colorscale = d3.scale.category10();

//Legend titles
var servers = ["en.wikipedia.org", "ko.wikipedia.org", "fr.wikipedia.org", "de.wikipedia.org"];

var LegendOptions = servers;

//Data


// var d = [
//     [
//         {axis:"Email",value:0.04},
//         {axis:"Social Networks",value:0.23},
//         {axis:"Internet Banking",value:0.12},
//         {axis:"News Sportsites",value:0.24},
//         {axis:"Search Engine",value:0.18},
//         {axis:"View Shopping sites",value:0.14},
//         {axis:"Paying Online",value:0.11},
//         {axis:"Buy Online",value:0.05},
//         {axis:"Stream Music",value:0.07},
//         // {axis:"Online Gaming",value:0.12},
//         // {axis:"Navigation",value:0.27},
//         // {axis:"App connected to TV program",value:0.03},
//         // {axis:"Offline Gaming",value:0.12},
//         // {axis:"Photo Video",value:0.4},
//         // {axis:"Reading",value:0.03},
//         // {axis:"Listen Music",value:0.22},
//         // {axis:"Watch TV",value:0.03},
//         // {axis:"TV Movies Streaming",value:0.03},
//         // {axis:"Listen Radio",value:0.07},
//         // {axis:"Sending Money",value:0.18},
//         // {axis:"Other",value:0.07},
//         // {axis:"Use less Once week",value:0.08}
//     ],[
//         {axis:"Email",value:0.28},
//         {axis:"Social Networks",value:0.11},
//         {axis:"Internet Banking",value:0.27},
//         {axis:"News Sportsites",value:0.28},
//         {axis:"Search Engine",value:0.16},
//         {axis:"View Shopping sites",value:0.29},
//         {axis:"Paying Online",value:0.11},
//         {axis:"Buy Online",value:0.14},
//         {axis:"Stream Music",value:0.05},
//         // {axis:"Online Gaming",value:0.19},
//         // {axis:"Navigation",value:0.14},
//         // {axis:"App connected to TV program",value:0.06},
//         // {axis:"Offline Gaming",value:0.24},
//         // {axis:"Photo Video",value:0.17},
//         // {axis:"Reading",value:0.15},
//         // {axis:"Listen Music",value:0.12},
//         // {axis:"Watch TV",value:0.1},
//         // {axis:"TV Movies Streaming",value:0.14},
//         // {axis:"Listen Radio",value:0.06},
//         // {axis:"Sending Money",value:0.16},
//         // {axis:"Other",value:0.07},
//         // {axis:"Use less Once week",value:0.17}
//     ]
// ];

//Options for the Radar chart, other than default
var mycfg = {
    w: w,
    h: h,
    levels: 5,
    ExtraWidthX: 300
}

////////////////////////////////////////////
/////////// Initiate legend ////////////////
////////////////////////////////////////////

var svg = d3.select('#body')
    .selectAll('svg')
    .append('svg')
    .attr("width", w+300)
    .attr("height", h)

//Create the title for the legend
var text = svg.append("text")
    .attr("class", "title")
    .attr('transform', 'translate(90,0)')
    .attr("x", w - 70)
    .attr("y", 10)
    .attr("font-size", "12px")
    .attr("fill", "#404040")
    .text("What % of owners use a specific service in a week");

//Initiate Legend	
var legend = svg.append("g")
        .attr("class", "legend")
        .attr("height", 100)
        .attr("width", 200)
        .attr('transform', 'translate(90,20)')
    ;
//Create colour squares
legend.selectAll('rect')
    .data(servers)
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
    .data(servers)
    .enter()
    .append("text")
    .attr("x", w - 52)
    .attr("y", function(d, i){ return i * 20 + 9;})
    .attr("font-size", "11px")
    .attr("fill", "#737373")
    .text(function(d) { return d; })
;


//Text indicating at what % each level is
// d3.select("#chart").selectAll('text.work').transition().duration(1000).attr("transform", "translate(" + (w/2 + toRight) + ", " + (h/2-30) + ")scale(0)").remove();
// d3.select("#chart").selectAll('text.work').transition().duration(1000).remove();
var node;
function remove() {
    console.log(node);
    node.remove();
}
// for(var j=0; j<6; j++){
//     var levelFactor = 1*radius*((j+1)/3);
//     node = d3.select("#chart").selectAll("text.work").transition().duration(1000).attr("transform", "translate("+(w/2-35)+","+h/2+")");
//     setTimeout(remove, 1000); //node.remove();
        //.transition().duration(2000).attr("transform", "translate(" + (w/2 + toRight) + ", " + (h/2-30) + ")" ).remove()
        // .data([1]) //dummy data
        // .enter()
        // .append("svg:text")
        // .attr("x", function(d){return levelFactor*(1-1*Math.sin(0));})
        // .attr("y", function(d){return levelFactor*(1-1*Math.cos(0));})
        // .attr("class", "legend work")
        // .style("font-family", "sans-serif")
        // .style("font-size", "10px")
        // .attr("transform", "translate(" + (cfg.w/2-levelFactor + cfg.ToRight) + ", " + (cfg.h/2-levelFactor) + ")")
        // .attr("fill", "#737373")
        // .transition().duration(2000)
        // .text(Format((j+1)*cfg.maxValue/cfg.levels));

// }


var url = 'https://stream.wikimedia.org/v2/stream/recentchange';
var eventSource = new EventSource(url);
var mapping = {
    "en.wikipedia.org": 0,
    "ko.wikipedia.org": 1,
    "fr.wikipedia.org": 2,
    "de.wikipedia.org": 3
    // "log": 3
}

function validateType(type) {
    return (["new", "edit", "categorize"].indexOf(type) >= 0);
}
types = ["new", "edit", "categorize"];
function filterServer(server) {
    return (servers.indexOf(server) >=0);
}
var d = [];
types.forEach(function(server) {
   d.push([
       {axis: "en.wikipedia.org", value: 0},
       {axis: "ko.wikipedia.org", value: 0},
       {axis: "fr.wikipedia.org", value: 0},
       {axis: "de.wikipedia.org", value: 0}
   ]);
});

RadarChart.draw("#chart", d, mycfg);
// var servers = ["en.wikipedia.org", "ko.wikipedia.org", "fr.wikipedia.org", "de.wikipedia.org"];

eventSource.onmessage = function (event) {
    var obj = JSON.parse(event.data);
    if(validateType(obj.type) && filterServer(obj.server_name)) {

        var index = types.indexOf(obj.type);
        d[index][mapping[obj.server_name]].value++;

        RadarChart.update("#chart", d, mycfg);

    }
};

//en.wikipedia.org
    //wikidata.org

//commons.wikimedia.org

// setInterval(function(){
//     // var data = useData.map(function(d){return Math.random()})
//     d.forEach(function(obj) { obj.forEach(function(h) { h.value+=0.1; })});
//     RadarChart.update("#chart", d, mycfg);
//     // draw(data);
// }, 2000);
// update();