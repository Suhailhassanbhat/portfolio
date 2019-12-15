var stateFields = ['Alabama',
'Alaska',
'Arizona',
'Arkansas',
'California',
'Colorado',
'Connecticut',
'Delaware',
'DC',
'Florida',
'Georgia',
'Hawaii',
'Idaho',
'Illinois',
'Indiana',
'Iowa',
'Kansas',
'Kentucky',
'Louisiana',
'Maine',
'Maryland',
'Massachusetts',
'Michigan',
'Minnesota',
'Mississippi',
'Missouri',
'Montana',
'Nebraska',
'Nevada',
'New Hampshire',
'New Jersey',
'New Mexico',
'New York',
'North Carolina',
'North Dakota',
'Ohio',
'Oklahoma',
'Oregon',
'Pennsylvania',
'Rhode Island',
'South Carolina',
'South Dakota',
'Tennessee',
'Texas',
'Utah',
'Vermont',
'Virginia',
'Washington',
'West Virginia',
'Wisconsin',
'Wyoming'];

function Y0() {
    return yScale(0);
  }


d3.csv(require('/data/total-salaries.csv'), function(error, data) {

    var salaryMap = {};
    data.forEach(function(d) {
        var state = d.Year;
        salaryMap[state] = [];

        stateFields.forEach(function(field) {
            salaryMap[state].push( +d[field] );
        });
    });
    makeVis(salaryMap);
});

var makeVis = function(salaryMap) {
    // Define dimensions of vis
    var margin = { top: 30, right: 30, bottom: 30, left: 30 },
        width  = 800 - margin.left - margin.right,
        height = 600 - margin.top  - margin.bottom;

    // Make x scale
    var xScale = d3.scale.ordinal()
        .domain(stateFields)
        .rangeRoundBands([0, width], 0.1);

    // Make y scale, the domain will be defined on bar update
    var yScale = d3.scale.linear()
        .domain([-20, 30])
        .range([height, 0]);

    // Create canvas
    var canvas = d3.select("#vis-container")
      .append("svg")
        .attr("width",  width  + margin.left + margin.right)
        .attr("height", height + margin.top  + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Make x-axis and add to canvas
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

    canvas.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + yScale(0) + ")")
        .call(xAxis)
        .selectAll("text")	
        .style("text-anchor", "end")
        .style("alignment-baseline", 'start')
        .style("font-size", 9)
        .attr("dx", "-.8em")
        .attr("dy", function(d) { return d < 0 ? 7:-7})
        .attr("transform", "rotate(-90)");

    // Make y-axis and add to canvas
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    var yAxisHandleForUpdate = canvas.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .selectAll("text")	
        .style("text-anchor", "end")
        .style("alignment-baseline", 'start')
        .style("font-size", 10);
        // .attr("dx", "-.8em")
        // .attr("dy", function(d) { return d < 0 ? 7:-7})
        // .attr("transform", "rotate(-90)");

    yAxisHandleForUpdate.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style("font-size", 10)
        .text("Percent change");

    var updateBars = function(data) {

        yAxisHandleForUpdate.call(yAxis);

        var bars = canvas.selectAll(".bar").data(data);

        // Add bars for new data
        bars.enter()
          .append("rect")
            .attr("class", "bar")
            .attr("x", function(d,i) { return xScale( stateFields[i] ); })
            .attr("width", xScale.rangeBand())
            .attr("y", function(d, i) { return d < 0 ? yScale(0) : yScale(d); })
            .attr("height", function(d, i) { return Math.abs( yScale(d) - yScale(0) ); });
       

        // Update old ones, already have x / width from before
        bars
            .transition().duration(250)
            .attr("y", function(d, i) { return d < 0 ? yScale(0) : yScale(d); })
            .attr("height", function(d, i) { return Math.abs( yScale(d) - yScale(0) ); });

        // Remove old ones
        bars.exit().remove();
    };

    // Handler for dropdown value change
    var dropdownChange = function() {
        var newState = d3.select(this).property('value'),
            newData   = salaryMap[newState];

        updateBars(newData);
    };

    var salaries = Object.keys(salaryMap).sort();

    var dropdown = d3.select("#vis-container")
        .insert("select", "svg")
        .on("change", dropdownChange);

    dropdown.selectAll("option")
        .data(salaries)
      .enter().append("option")
        .attr("value", function (d) { return d; })
        .text(function (d) {    
            return d
        });

    var initialData = salaryMap[ salaries[0] ];
    updateBars(initialData);
};
