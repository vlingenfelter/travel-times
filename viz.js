function makeHistogram(values, color) {

  // A formatter for counts.
  formatCount = d3.format(",.0f");

  // find the width of the histogram and the legend according to the size of viewport
  histogramWidth = document.getElementById("histogram").getBoundingClientRect().width;
  legendWidth = document.getElementById("legend").getBoundingClientRect().width;
  histogramHeight = document.getElementById("histogram").getBoundingClientRect().height;
  legendHeight = document.getElementById("legend").getBoundingClientRect().height;

  // create margin object
  margin = {
      top: 30,
      right: 30,
      bottom: 30,
      left: 30
    },
    // this tells us the width for use when creating the histogram bars
    width = histogramWidth - margin.left - margin.right;
    height = 500 - margin.top - margin.bottom;



  //legendWidth = svgWidth * .3;

  // Calculate stats
  max = d3.max(values);
  min = d3.min(values);
  med = d3.median(values);
  mean = d3.mean(values);
  // this is how many times were recorded
  numberOfTimes = values.length;
  // sort the times to find the percentiles
  sortedTimes = values.sort((a,b) => (a - b));
  // get 15th, 20th, and 25th percentile for use in deciding
  // new benchmark travel times
  var per15coeff =  Math.floor(numberOfTimes*.15) - 1;
  var per20coeff =  Math.floor(numberOfTimes*.2) - 1;
  var per25coeff =  Math.floor(numberOfTimes*.25) - 1;
  perc15 = sortedTimes[per15coeff];
  perc20 = sortedTimes[per20coeff];
  perc25 = sortedTimes[per25coeff];



  x = d3.scale.linear()
    .domain([min, max])
    .range([0, width]);

  // Generate a histogram using twenty uniformly-spaced bins.
  data = d3.layout.histogram()
    .bins(x.ticks(20))
    (values);

  yMax = d3.max(data, function(d) {
    return d.length
  });
  yMin = d3.min(data, function(d) {
    return d.length
  });
  colorScale = d3.scale.linear()
    .domain([yMin, yMax])
    .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

  y = d3.scale.linear()
    .domain([0, yMax])
    .range([(height), 20]);

  xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat((d) => (d + " min"));

  svg = d3.select("#histogram").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  bar = svg.selectAll(".bar")
    .data(data)
    .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d) {
      return "translate(" + x(d.x) + "," + y(d.y) + ")";
    });

  bar.append("rect")
    .attr("x", 1)
    .attr("width", (x(data[0].dx) - x(0)) - 1)
    .attr("height", function(d) {
      return height - y(d.y);
    })
    .attr("fill", function(d) {
      return colorScale(d.y)
    });

  bar.append("text")
    .attr("dy", ".75em")
    .attr("y", -12)
    .attr("x", (x(data[0].dx) - x(0)) / 2)
    .attr("text-anchor", "middle")
    .text(function(d) {
      return formatCount(d.y);
    });

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  legend = d3.select("#legend").append("svg")
    .attr("x", histogramWidth + margin.right)
    .attr("width", legendWidth + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  legend.append("rect")
    .attr("x", 1)
    .attr("width", legendWidth - margin.left - margin.right)
    .attr("height", height - margin.top - margin.bottom)
    .attr("fill", "#fff")
    .attr("stroke", "#1fa898")
    .attr("stroke-width", 10);

  legend.append("text")
    .attr("x", ((legendWidth - margin.left - margin.right) / 2))
    .attr("y", margin.top)
    .attr("text-anchor", "middle")
    .style("font-size", "2em")
    .style("font-family", 'Comfortaa')
    .style("text-decoration", "underline")
    .text("Summary");

  legend.append("text")
    .attr("class", "info perc15")
    .attr("x", margin.left)
    .attr("y", (margin.top + 40))
    .style("font-size", "1.5em")
    .style("font-family", 'Comfortaa')
    .text("15th Percentile: " + String(perc15.toFixed(2)) + " min");

  legend.append("text")
    .attr("class", "info perc20")
    .attr("x", margin.left)
    .attr("y", (margin.top + 70))
    .style("font-size", "1.5em")
    .style("font-family", 'Comfortaa')
    .text("20th Percentile: " + String(perc20.toFixed(2)) + " min");

  legend.append("text")
    .attr("class", "info perc25")
    .attr("x", margin.left)
    .attr("y", (margin.top + 100))
    .style("font-size", "1.5em")
    .style("font-family", 'Comfortaa')
    .text("25th Percentile: " + String(perc25.toFixed(2)) + " min");

  legend.append("text")
    .attr("class", "info med")
    .attr("x", margin.left)
    .attr("y", (margin.top + 150))
    .style("font-size", "1.5em")
    .style("font-family", 'Comfortaa')
    .text("Median: " + String(med.toFixed(2)) + " min");

  legend.append("text")
    .attr("class", "info num")
    .attr("x", margin.left)
    .attr("y", (margin.top + 200))
    .style("font-size", "1.5em")
    .style("font-family", 'Comfortaa')
    .text("Entries: " + String(numberOfTimes));

  /*
  legend.append("text")
    .attr("class", "info from")
    .attr("x", margin.left)
    .attr("y", (margin.top + 250))
    .style("font-size", "1.5em")
    .style("font-family", 'Comfortaa')
    .text("From: " + fromDateString);

  legend.append("text")
    .attr("class", "info to")
    .attr("x", margin.left)
    .attr("y", (margin.top + 280))
    .style("font-size", "1.5em")
    .style("font-family", 'Comfortaa')
    .text("To: " + toDateString);
    */
}

function getDataTable() {
  tableValues = [];

  // populate table json array with histogram data
  for (var i=0; i < data.length; i++) {
    var max = parseFloat(d3.max(data[i])).toFixed(2);
    var min = parseFloat(d3.min(data[i])).toFixed(2);
    // check to see if min and max are the same value
    if (min != 'NaN') {
      if (min == max) {
        var bin = min;
      } else {
        var bin = min + " to " + max;
      }
      var count = data[i].length;
      tableValues.push({minutes: bin, count: count});
    }
  }

  // put this data into a data table
  function tabulate(data, columns) {
		var table = d3.select('#dataTableContainer')
                .append('table')
                .attr("id", "datatable")
                .style("display", "none")
		var thead = table.append('thead')
		var	tbody = table.append('tbody');

		// append the header row
    table.append('caption')
          .text('Number of trips per histogram bin');

		thead.append('tr')
		  .selectAll('th')
		  .data(columns).enter()
		  .append('th')
        .attr("scope", "col")
		    .text(function (column) { return column; });

		// create a row for each object in the data
		var rows = tbody.selectAll('tr')
		  .data(data)
		  .enter()
		  .append('tr')
      .attr('scope', 'row');

		// create a cell in each row for each column
		var cells = rows.selectAll('td')
		  .data(function (row) {
		    return columns.map(function (column) {
		      return {column: column, value: row[column]};
		    });
		  })
		  .enter()
		  .append('td')
		    .text(function (d) { return d.value; });

	  return table;
	}

  tabulate(tableValues, ['minutes', 'count']);
  var displayButton = d3.select("#dataTableButton").style("display", "block")
}

function refreshDataTable() {
  var parent = document.getElementById("dataTableContainer");
  var child = document.getElementById("datatable");
  parent.removeChild(child);
  getDataTable();
}

function displayDataTable() {
   d3.select("#datatable").style("display", "table")
}

/*
 * Adding refresh method to reload new data
 */
function refresh(values) {

  data = d3.layout.histogram()
    .bins(x.ticks(20))
    (values);

  // Reset y domain using new data
  yMax = d3.max(data, function(d) {
    return d.length
  });
  yMin = d3.min(data, function(d) {
    return d.length
  });
  y.domain([0, yMax]);
  colorScale = d3.scale.linear()
    .domain([yMin, yMax])
    .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

  max = d3.max(values);
  min = d3.min(values);
  med = d3.median(values);
  mean = d3.mean(values);
  numberOfTimes = values.length;
  sortedTimes = values.sort((a,b) => (a - b));
  var per15coeff =  Math.floor(numberOfTimes*.15) - 1;
  var per20coeff =  Math.floor(numberOfTimes*.2) - 1;
  var per25coeff =  Math.floor(numberOfTimes*.25) - 1;
  perc15 = sortedTimes[per15coeff];
  perc20 = sortedTimes[per20coeff];
  perc25 = sortedTimes[per25coeff];

  x = d3.scale.linear()
    .domain([min, max])
    .range([0, width]);

  xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat((d) => (d + " min"));

  svg.select("g.x.axis")
    .transition()
    .duration(1000)
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);


  legend.select("text.info.perc15")
    .transition()
    .duration(500)
    .style("opacity", 0)
    .transition().duration(500)
    .style("opacity", 1)
    .text("15th Percentile: " + String(perc15.toFixed(2)) + " min");

  legend.select("text.info.perc20")
    .transition()
    .duration(500)
    .style("opacity", 0)
    .transition().duration(500)
    .style("opacity", 1)
    .text("20th Percentile: " + String(perc20.toFixed(2)) + " min");

  legend.select("text.info.perc25")
    .transition()
    .duration(500)
    .style("opacity", 0)
    .transition().duration(500)
    .style("opacity", 1)
    .text("25th Percentile: " + String(perc25.toFixed(2)) + " min");

  legend.select("text.info.med")
    .transition()
    .duration(500)
    .style("opacity", 0)
    .transition().duration(500)
    .style("opacity", 1)
    .text("Median: " + String(med.toFixed(2)) + " min");

  legend.select("text.info.num")
    .transition()
    .duration(500)
    .style("opacity", 0)
    .transition().duration(500)
    .style("opacity", 1)
    .text("Number of Entries: " + String(numberOfTimes));

    /*
  legend.select("text.info.from")
    .transition()
    .duration(500)
    .style("opacity", 0)
    .transition().duration(500)
    .style("opacity", 1)
    .text("From: " + fromDateString);


  legend.select("text.info.to")
    .transition()
    .duration(500)
    .style("opacity", 0)
    .transition().duration(500)
    .style("opacity", 1)
    .text("To: " + toDateString);
  */



  bar = svg.selectAll(".bar").data(data);

  // Remove object with data
  bar.exit().remove();


  bar.transition()
    .duration(1000)
    .attr("transform", function(d) {
      return "translate(" + x(d.x) + "," + y(d.y) + ")";
    });

  bar.select("rect")
    .transition()
    .duration(1000)
    .attr("x", 1)
    .attr("width", (x(data[0].dx) - x(0)) - 1)
    .attr("height", function(d) {
      return height - y(d.y);
    })
    .attr("fill", function(d) {
      return colorScale(d.y)
    });

  bar.select("text")
    .transition()
    .duration(1000)
    .attr("dy", ".75em")
    .attr("y", -12)
    .attr("x", (x(data[0].dx) - x(0)) / 2)
    .attr("text-anchor", "middle")
    .text(function(d) {
      return formatCount(d.y);
    });

}

function buttonColorTransition() {
  d3.selectAll(".color-change").transition()
    .duration(500)
    .style("background-color", color);
}
