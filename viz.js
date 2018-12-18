
// makeHistogram: Array of travel times, line color -> Histogram svg
// renders the histogram of travel times as well as the legend
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
  width = parseInt(d3.select('#histogram').style('width'), 10);
  //  width = histogramWidth - margin.left - margin.right;
  height = width * 0.6 - margin.top - margin.bottom;

  legendWidth = parseInt(d3.select('#legend').style('width'), 10);


  // Calculate stats
  max = d3.max(values);
  min = d3.min(values);
  med = d3.median(values);
  mean = d3.mean(values);
  // this is how many times were recorded
  numberOfTimes = values.length;
  // sort the times to find the percentiles
  sortedTimes = values.sort((a, b) => (a - b));
  // get 15th, 20th, and 25th percentile for use in deciding
  // new benchmark travel times
  var per15coeff = Math.floor(numberOfTimes * .15) - 1;
  var per20coeff = Math.floor(numberOfTimes * .2) - 1;
  var per25coeff = Math.floor(numberOfTimes * .25) - 1;
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
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "histogram")
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

  legend = d3.select("#legend").append("div")
    .style("height", height + margin.top + margin.bottom)
    .attr("class", "legend")
    .style("margin", "1em")
    .style("padding", "1em")
    .style("border", "10px solid #1fa898")
    .style("text-align", "center");


  legend.append("h3")
    .style("font-size", "2em")
    .style("font-family", 'Comfortaa')
    .style("text-decoration", "underline")
    .text("Summary");

  legend.append("p")
    .attr("class", "info perc15")
    .text("15th Percentile: " + String(perc15.toFixed(2)) + " min");

  legend.append("p")
    .attr("class", "info perc20")
    .text("20th Percentile: " + String(perc20.toFixed(2)) + " min");

  legend.append("p")
    .attr("class", "info perc25")
    .text("25th Percentile: " + String(perc25.toFixed(2)) + " min");

  legend.append("p")
    .attr("class", "info med")
    .text("Median: " + String(med.toFixed(2)) + " min");

  legend.append("p")
    .attr("class", "info num")
    .text("Entries: " + String(numberOfTimes));
}

function getDataTable() {
  tableValues = [];

  // populate table json array with histogram data
  for (var i = 0; i < data.length; i++) {
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
      tableValues.push({
        Minutes: bin,
        Count: count
      });
    }
  }

  // put this data into a data table
  function tabulate(data, columns) {
    var table = d3.select('#dataTableContainer')
      .append('table')
      .attr("id", "datatable")
      .style("display", "none")
    var thead = table.append('thead')
    var tbody = table.append('tbody');

    // append the header row
    table.append('caption')
      .text('Number of trips per histogram bin');

    thead.append('tr')
      .selectAll('th')
      .data(columns).enter()
      .append('th')
      .attr("scope", "col")
      .text(function(column) {
        return column;
      });

    // create a row for each object in the data
    var rows = tbody.selectAll('tr')
      .data(data)
      .enter()
      .append('tr')
      .attr('scope', 'row');

    // create a cell in each row for each column
    var cells = rows.selectAll('td')
      .data(function(row) {
        return columns.map(function(column) {
          return {
            column: column,
            value: row[column]
          };
        });
      })
      .enter()
      .append('td')
      .text(function(d) {
        return d.value;
      });

    return table;
  }

  tabulate(tableValues, ['Minutes', 'Count']);
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
  sortedTimes = values.sort((a, b) => (a - b));
  var per15coeff = Math.floor(numberOfTimes * .15) - 1;
  var per20coeff = Math.floor(numberOfTimes * .2) - 1;
  var per25coeff = Math.floor(numberOfTimes * .25) - 1;
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


  legend.select("p.info.perc15")
    .transition()
    .duration(500)
    .style("opacity", 0)
    .transition().duration(500)
    .style("opacity", 1)
    .text("15th Percentile: " + String(perc15.toFixed(2)) + " min");

  legend.select("p.info.perc20")
    .transition()
    .duration(500)
    .style("opacity", 0)
    .transition().duration(500)
    .style("opacity", 1)
    .text("20th Percentile: " + String(perc20.toFixed(2)) + " min");

  legend.select("p.info.perc25")
    .transition()
    .duration(500)
    .style("opacity", 0)
    .transition().duration(500)
    .style("opacity", 1)
    .text("25th Percentile: " + String(perc25.toFixed(2)) + " min");

  legend.select("p.info.med")
    .transition()
    .duration(500)
    .style("opacity", 0)
    .transition().duration(500)
    .style("opacity", 1)
    .text("Median: " + String(med.toFixed(2)) + " min");

  legend.select("p.info.num")
    .transition()
    .duration(500)
    .style("opacity", 0)
    .transition().duration(500)
    .style("opacity", 1)
    .text("Number of Entries: " + String(numberOfTimes));

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

d3.select(window).on('resize', resize);

function resize() {

  values = times;
  // update width
  width = parseInt(d3.select('#histogram').style('width'));
  width = width - margin.left - margin.right;

  legendWidth = parseInt(d3.select('#legend').style('width'), 10);

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

  d3.select("#histogram").select("svg.histogram")
    .transition()
    .duration(100)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)


  x = d3.scale.linear()
    .domain([min, max])
    .range([0, width]);


  xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat((d) => (d + " min"));

  svg.select("g.x.axis")
    .transition()
    .duration(100)
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);


  bar = svg.selectAll(".bar").data(data);

  // Remove object with data
  bar.exit().remove();


  bar.transition()
    .duration(100)
    .attr("transform", function(d) {
      return "translate(" + x(d.x) + "," + y(d.y) + ")";
    });

  bar.select("rect")
    .transition()
    .duration(100)
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
    .duration(100)
    .attr("dy", ".75em")
    .attr("y", -12)
    .attr("x", (x(data[0].dx) - x(0)) / 2)
    .attr("text-anchor", "middle")
    .text(function(d) {
      return formatCount(d.y);
    });

}
