var margin = {top: 50, right: 100, bottom: 30, left: 100},
    width = $('.slider').width() - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

/* 
 * value accessor - returns the value to encode for a given data object.
 * scale - maps value to a visual display encoding, such as a pixel position.
 * map function - maps from data value to display value
 * axis - sets up axis
 */ 

// setup x 
var xValue = function(d) { return d["Release Year"];}, // data -> value
    xScale = d3.scale.linear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    size = function(d) { return (+d["IMDB Rating"]); },
    sizeForThis = function(d) { return 3 + (1 * (+d["IMDB Rating"])); },
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
var yValue = function(d) { return d["Profit $"];}, // data -> value
    yScale = d3.scale.linear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");

// setup fill color
var cValue = function(d) { return d["Genre"];},
    color = d3.scale.category10();

// add the graph canvas to the body of the webpage
var svg = d3.select(".visual-one").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
var tooltip = d3.select(".visual-one").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// load data
d3.csv("movies.csv", function(error, data) {

  // change string (from CSV) into number format
  data.forEach(function(d) {
    d["Profit $"] = +d["Profit $"];
    d["Release Year"] = +d["Release Year"];
//    console.log(d);
  });

  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
  yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

  // x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Release Year");

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Profit $");

  // draw dots
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", sizeForThis)
      .attr("id", size)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", "#0a7a9a") // function(d) { return color(cValue(d));} 
      .on("mouseover", function(d) {
          $('.visual-one-info').html("<div class=\"details\">Movie Name: " + d["Movie"] + "<br/>Release Year: " + xValue(d) + "<br>Profit ($): " + yValue(d) + "<br>IMDB Rating: " + size(d) + "<div class=\"details\">");
      })
      .on("mouseout", function(d) {
          $('.visual-one-info').html("Item Information");
      });

  // draw legend
  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  // draw legend text
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d;})
});