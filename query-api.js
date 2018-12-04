var url = "http://realtime.mbta.com/developer/api/v2.1/traveltimes?";
var key = "api_key=wX9NwuHnZU2ToO7GmGR9uw";
var format = "&format=json";
var fromStop = "&from_stop=70172";
var toStop = "&to_stop=70182";
var fromTime = "&from_datetime=";
var toTime = "&to_datetime=";
var fromStopText, toStopText, directionText;
var fromYear, fromMonth, fromDay, fromHour, fromMinute;
var toYear, toMonth, toDay, toHour, toMinute;
var fromEpoch, toEpoch;
var fromDateString, toDateString;
var times = [];
var json;
var benchmark;
var stopNames;
var stopsObject;
var color = "#ee352d";
var monthNames;
var currentMonthsObject;
var numberOfDays;
var titleString;

function resetApiResults(arr) {
  times = [];
  json = {};
}

function ajaxCall() {
  whichChecks();
  updateEpochTimes();
  if (times.length > 0) {
    times = [];
    for (var i=0; i < timesToQuery.length; i++) {
      $.ajax({
        type: "GET",
        async: false,
        url: url + key + format + fromStop + toStop + timesToQuery[i][0] + timesToQuery[i][1],
        success:
          function(data) {
            if (data.travel_times.length > 0) {
                json = data;
                benchmark = json.travel_times[0].benchmark_travel_time_sec;
                for (var j = 0; j < data.travel_times.length; j++) {
                  var time = parseFloat(data.travel_times[j].travel_time_sec);
                  times.push((time / 60));
                }
              }
            }
          });
        }
        refresh(times);
        refresh(times);
        $("#api-test").append(benchmark + ", ");
  } else {
    times = [];
    for (var i=0; i < timesToQuery.length; i++) {
      $.ajax({
        type: "GET",
        async: false,
        url: url + key + format + fromStop + toStop + timesToQuery[i][0] + timesToQuery[i][1],
        success:
          function(data) {
            if (data.travel_times.length > 0) {
                json = data;
                benchmark = json.travel_times[0].benchmark_travel_time_sec;
                for (var j = 0; j < data.travel_times.length; j++) {
                  var time = parseFloat(data.travel_times[j].travel_time_sec);
                  times.push((time / 60));
                }
                $("#api-test").append(benchmark + ", ");
              }
            }
          });
        }
        makeHistogram(times, color);
        $("#api-test").append(benchmark + ", ");

  }
  //getStartEndTimes();
  // call jquery ajax function
  /*
  $.ajax({
    // specify type of ajax call, in this case "GET"
    type: "GET",
    // specify the URL
    url: url + key + format + fromStop + toStop + fromTime + toTime,
    // function that defines what to do in the case of a successful 'get'
    success:
      // funciton takes in the data retrieved from the query
      function(data) {
        // checks to make sure the query returned some times
        if (data.travel_times.length > 0) {
          // checkes to see if a query has already been made
          if (times.length > 0) {
            // ABSTRACT THIS FROM HERE
            // updates json
            json = data;
            // clears out times variable to populate historgram
            times = [];
            // defines benchmark
            benchmark = json.travel_times[0].benchmark_travel_time_sec;
            // loop
            for (var i = 0; i < data.travel_times.length; i++) {
              // turn time into integer
              var time = parseFloat(data.travel_times[i].travel_time_sec);
              // make time be in minutes and add time to times variable
              times.push((time / 60));
            }
            // TO HERE
            // updates the histogram
            makeHistogramTitle();
            refresh(times);
            refresh(times);
            $("#api-test").append(benchmark + ", ");
          } else {
            // ABSTRACT THIS
            json = data;
            times = [];
            benchmark = json.travel_times[0].benchmark_travel_time_sec;
            for (var i = 0; i < data.travel_times.length; i++) {
              var time = parseFloat(data.travel_times[i].travel_time_sec);
              times.push((time / 60));
            }
            // TO HERE
            // makes the first histogram
            makeHistogramTitle();
            makeHistogram(times, color);

            $("#api-test").append(benchmark + ", ");
          }
        } else {
          // alert that the query was successful but no data was returned
          alert("This query returned no data! Please try a different one.");
        }
      }
  });
  */
}


function addStartStops(line) {
  var node = document.getElementById("selectStart");
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
  $("#fromButton").text("From: ");
  $("#endButton").text("To: ");
  switch (line) {
    case "oakgrovetoforesthills":
      color = "#f68a1f";
      $("#directionButton").text("Orange Line: Oak Grove to Forest Hills");
      buttonColorTransition();
      stopNames = [];
      stopsObject = {};
      stopNames = Object.keys(orangeLineStopOrder.Oak_Grove_to_Forest_Hills);
      stopsObject = orangeLineStopOrder.Oak_Grove_to_Forest_Hills;
      populateStartStops(stopNames);
      break;
    case "foresthillstooakgrove":
      color = "#f68a1f";
      $("#directionButton").text("Orange Line: Forest Hills to Oak Grove");
      buttonColorTransition();
      stopNames = [];
      stopsObject = {};
      stopNames = Object.keys(orangeLineStopOrder.Forest_Hills_to_Oak_Grove);
      stopsObject = orangeLineStopOrder.Forest_Hills_to_Oak_Grove;
      populateStartStops(stopNames);
      break;
    case "bowdointowonderland":
      color = "#305ea6";
      $("#directionButton").text("Blue Line: Bowdoin to Wonderland");
      buttonColorTransition();
      stopNames = [];
      stopsObject = {};
      stopNames = Object.keys(orangeLineStopOrder.Bowdoin_to_Wonderland);
      stopsObject = orangeLineStopOrder.Bowdoin_to_Wonderland;
      populateStartStops(stopNames);
      break;
    case "wonderlandtobowdoin":
      color = "#305ea6";
      $("#directionButton").text("Blue Line: Wonderland to Bowdoin");
      buttonColorTransition();
      stopNames = [];
      stopsObject = {};
      stopNames = Object.keys(orangeLineStopOrder.Wonderland_to_Bowdoin);
      stopsObject = orangeLineStopOrder.Wonderland_to_Bowdoin;
      populateStartStops(stopNames);
      break;
    case "alewifetobraintree":
      color = "#ee352d";
      $("#directionButton").text("Red Line: Alewife to Braintree");
      buttonColorTransition();
      stopNames = [];
      stopsObject = {};
      stopNames = Object.keys(orangeLineStopOrder.Alewife_to_Braintree);
      stopsObject = orangeLineStopOrder.Alewife_to_Braintree;
      populateStartStops(stopNames);
      break;
    case "braintreetoalewife":
      color = "#ee352d";
      $("#directionButton").text("Red Line: Braintree to Alewife");
      buttonColorTransition();
      stopNames = [];
      stopsObject = {};
      stopNames = Object.keys(orangeLineStopOrder.Braintree_to_Alewife);
      stopsObject = orangeLineStopOrder.Braintree_to_Alewife;
      populateStartStops(stopNames);
      break;
    case "alewifetoashmont":
      color = "#ee352d";
      $("#directionButton").text("Red Line: Alewife to Ashmont");
      buttonColorTransition();
      stopNames = [];
      stopsObject = {};
      stopNames = Object.keys(orangeLineStopOrder.Alewife_to_Ashmont);
      stopsObject = orangeLineStopOrder.Alewife_to_Ashmont;
      populateStartStops(stopNames);
      break;
    case "ashmonttoalewife":
      color = "#ee352d";
      $("#directionButton").text("Red Line: Ashmont to Alewife");
      buttonColorTransition();
      stopNames = [];
      stopsObject = {};
      stopNames = Object.keys(orangeLineStopOrder.Ashmont_to_Alewife);
      stopsObject = orangeLineStopOrder.Ashmont_to_Alewife;
      populateStartStops(stopNames);
      break;
    case "heathsttolechemere":
      color = "#00824e";
      $("#directionButton").text("Green E: Heath St to Lechemere");
      buttonColorTransition();
      stopNames = [];
      stopsObject = {};
      stopNames = Object.keys(orangeLineStopOrder.Heath_St_to_Lechemere);
      stopsObject = orangeLineStopOrder.Heath_St_to_Lechemere;
      populateStartStops(stopNames);
      break;
    case "lechemeretoheathst":
      color = "#00824e";
      $("#directionButton").text("Green E: Lechemere to Heath St");
      buttonColorTransition();
      stopNames = [];
      stopsObject = {};
      stopNames = Object.keys(orangeLineStopOrder.Lechemere_to_Heath_St);
      stopsObject = orangeLineStopOrder.Lechemere_to_Heath_St;
      populateStartStops(stopNames);
      break;
    case "clevelandcircletonorthstation":
      color = "#00824e";
      $("#directionButton").text("Green C: Cleveland Circle to North Station");
      buttonColorTransition();
      stopNames = [];
      stopsObject = {};
      stopNames = Object.keys(orangeLineStopOrder.Cleveland_Circle_to_North_Station);
      stopsObject = orangeLineStopOrder.Cleveland_Circle_to_North_Station;
      populateStartStops(stopNames);
      break;
    case "northstationtoclevelandcircle":
      color = "#00824e";
      $("#directionButton").text("Green C: North Station to Cleveland Circle");
      buttonColorTransition();
      stopNames = [];
      stopsObject = {};
      stopNames = Object.keys(orangeLineStopOrder.North_Station_to_Cleveland_Circle);
      stopsObject = orangeLineStopOrder.North_Station_to_Cleveland_Circle;
      populateStartStops(stopNames);
      break;
    case "riversidetogovernmentcenter":
      color = "#00824e";
      $("#directionButton").text("Green D: Riverside to Government Center");
      buttonColorTransition();
      stopNames = [];
      stopsObject = {};
      stopNames = Object.keys(orangeLineStopOrder.Riverside_to_Government_Center);
      stopsObject = orangeLineStopOrder.Riverside_to_Government_Center;
      populateStartStops(stopNames);
      break;
    case "governmentcentertoriverside":
      color = "#00824e";
      $("#directionButton").text("Green D: Government Center to Riverside");
      buttonColorTransition();
      stopNames = [];
      stopsObject = {};
      stopNames = Object.keys(orangeLineStopOrder.Government_Center_to_Riverside);
      stopsObject = orangeLineStopOrder.Government_Center_to_Riverside;
      populateStartStops(stopNames);
      break;
    case "bostoncollegetoparkst":
      color = "#00824e";
      $("#directionButton").text("Green B: Boston College to Park St");
      buttonColorTransition();
      stopNames = [];
      stopsObject = {};
      stopNames = Object.keys(orangeLineStopOrder.Boston_College_to_Park_St);
      stopsObject = orangeLineStopOrder.Boston_College_to_Park_St;
      populateStartStops(stopNames);
      break;
    case "parksttobostoncollege":
      color = "#00824e";
      $("#directionButton").text("Green B: Park St to Boston College");
      buttonColorTransition();
      stopNames = [];
      stopsObject = {};
      stopNames = Object.keys(orangeLineStopOrder.Park_St_to_Boston_College);
      stopsObject = orangeLineStopOrder.Park_St_to_Boston_College;
      populateStartStops(stopNames);
      break;
    default:
  }
}
// fix the lines
// change it to "flowed through station"
function addToStops(stop) {
  var node = document.getElementById("selectEnd");
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
  fromStopText = stop.split('_').join(' ');
  $("#fromButton").text("From: " + stop.split('_').join(' '));
  fromStop = "&from_stop=" + String(stopsObject[stop]);
  var index = stopNames.findIndex((s) => (s == stop));
  var possibleToStops = stopNames.slice(index + 1);
  populateEndStops(possibleToStops);
}

function addFinishStop(stop) {
  toStopText = stop.split('_').join(' ');
  $("#endButton").text("To: " + stop.split('_').join(' '));
  toStop = "&to_stop=" + String(stopsObject[stop]);
}

function populateStartStops(stopNames) {
  var data = stopNames;
  var startButton = d3.select("#selectStart");
  var a = startButton.selectAll("a").data(data);
  a.remove();
  a.enter()
    .append("a")
    .attr("href", "#")
    .attr("onclick", (d) => ("addToStops('" + d + "')"))
    .text((d) => (d.split('_').join(' ')));
}

function populateEndStops(possibleToStops) {
  var data = possibleToStops;
  var endButton = d3.select("#selectEnd");
  var a = endButton.selectAll("a").data(data);
  a.remove();
  a.enter()
    .append("a")
    .attr("href", "#")
    .attr("onclick", (d) => ("addFinishStop('" + d + "')"))
    .text((d) => (d.split('_').join(' ')));
}

function addFromYear(year) {
  $("#startTimeYear").text(year.split('_').join(' '));
  fromYear = parseInt(year);
  if (fromYear == 2015) {
    populateMonths(monthsObject.shortened);
  } else {
    populateMonths(monthsObject.regular);
  }
}

function populateMonths(months) {
  var node = document.getElementById("selectStartMonth");
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
  monthNames = Object.keys(months);
  currentMonthsObject = months;
  var data = monthNames;
  var startMonthButton = d3.select("#selectStartMonth");
  var a = startMonthButton.selectAll("a").data(data);
  a.remove();
  a.enter()
    .append("a")
    .attr("href", "#")
    .attr("onclick", (d) => ("addMonthDays('" + d + "')"))
    .text((d) => (d.split('_').join(' ')));
}

function addMonthDays(month) {
  $("#startTimeMonth").text(month.split('_').join(' '));
  fromMonth = monthNames.findIndex((m) => (m == month));


  if (fromYear == 2016) {
    populateDates(currentMonthsObject[month]);
  } else {
    populateDates(currentMonthsObject[month]);
  }

}


function populateDates(numberOfDays) {
  var node = document.getElementById("selectStartDay");
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
  var data = [];
  for (var i = 0; i < numberOfDays; i++) {
    data.push(i + 1);
  }
  var startDayButton = d3.select("#selectStartDay");
  var a = startDayButton.selectAll("a").data(data);
  a.remove();
  a.enter()
    .append("a")
    .attr("href", "#")
    .attr("onclick", (d) => ("chooseDay('" + d + "')"))
    .text((d) => String(d));
}

function chooseDay(n) {
  fromDay = n;
  $("#startTimeDay").text(String(n));

}

function updateEpochTimes() {
  timesToQuery = [];
  if (allTimesChecked) {
    fromTime = "&from_datetime=";
    toTime = "&to_datetime=";
    var fromD = new Date(fromYear, fromMonth, fromDay, 5);
    fromEpoch = fromD.getTime() / 1000;
    var delta = 7;
    // number of seconds in 24 hours
    delta *= 86400;
    toEpoch = fromEpoch + delta;
    fromTime += fromEpoch;
    toTime += toEpoch;
    timesToQuery.push([fromTime, toTime]);
  } else if (bothPeakChecked) {
    for (var i = 0; i < 7; i++) {
      var day = parseFloat(fromDay);
      day += i;
      fromTime = "&from_datetime=";
      toTime = "&to_datetime=";
      var fromD = new Date(fromYear, fromMonth, day, 7);
      fromEpoch = fromD.getTime() / 1000;
      var toD = new Date(fromYear, fromMonth, day, 8, 59);
      toEpoch = toD.getTime() / 1000;
      fromTime += fromEpoch;
      toTime += toEpoch;
      if (fromD.getDay() != 0 && fromD.getDay() != 6) {
        timesToQuery.push([fromTime, toTime]);
      }
    }
    for (var i = 0; i < 7; i++) {
      var day = parseFloat(fromDay);
      day += i;
      fromTime = "&from_datetime=";
      toTime = "&to_datetime=";
      var fromD = new Date(fromYear, fromMonth, day, 16);
      fromEpoch = fromD.getTime() / 1000;
      var toD = new Date(fromYear, fromMonth, day, 18, 29);
      toEpoch = toD.getTime() / 1000;
      fromTime += fromEpoch;
      toTime += toEpoch;
      if (fromD.getDay() != 0 && fromD.getDay() != 6) {
        timesToQuery.push([fromTime, toTime]);
      }
    }
  } else if (amPeakIsChecked) {
    for (var i = 0; i < 7; i++) {
      var day = parseFloat(fromDay);
      day += i;
      fromTime = "&from_datetime=";
      toTime = "&to_datetime=";
      var fromD = new Date(fromYear, fromMonth, day, 7);
      fromEpoch = fromD.getTime() / 1000;
      var toD = new Date(fromYear, fromMonth, day, 8, 59);
      toEpoch = toD.getTime() / 1000;
      fromTime += fromEpoch;
      toTime += toEpoch;
      if (fromD.getDay() != 0 && fromD.getDay() != 6) {
        timesToQuery.push([fromTime, toTime]);
      }
    }
  } else if (pmPeakIsChecked) {
    for (var i = 0; i < 7; i++) {
      var day = parseFloat(fromDay);
      day += i;
      fromTime = "&from_datetime=";
      toTime = "&to_datetime=";
      var fromD = new Date(fromYear, fromMonth, day, 16);
      fromEpoch = fromD.getTime() / 1000;
      var toD = new Date(fromYear, fromMonth, day, 18, 29);
      toEpoch = toD.getTime() / 1000;
      fromTime += fromEpoch;
      toTime += toEpoch;
      if (fromD.getDay() != 0 && fromD.getDay() != 6) {
        timesToQuery.push([fromTime, toTime]);
      }
    }
  } else if (offPeakIsChecked) {
    for (var i = 0; i < 7; i++) {
      var day = parseFloat(fromDay);
      day += i;
      fromTime = "&from_datetime=";
      toTime = "&to_datetime=";
      var fromD = new Date(fromYear, fromMonth, day, 18, 30);
      fromEpoch = fromD.getTime() / 1000;
      var toD = new Date(fromYear, fromMonth, day, 6, 59);
      toEpoch = toD.getTime() / 1000;
      fromTime += fromEpoch;
      toTime += toEpoch;
      if (fromD.getDay() != 0 && fromD.getDay() != 6 &&
      toD.getDay() != 0 && toD.getDay() != 6) {
        timesToQuery.push([fromTime, toTime]);
      }
    }
    for (var i = 0; i < 7; i++) {
      var day = parseFloat(fromDay);
      day += i;
      fromTime = "&from_datetime=";
      toTime = "&to_datetime=";
      var fromD = new Date(fromYear, fromMonth, day, 9);
      fromEpoch = fromD.getTime() / 1000;
      var toD = new Date(fromYear, fromMonth, day, 15, 59);
      toEpoch = toD.getTime() / 1000;
      fromTime += fromEpoch;
      toTime += toEpoch;
      if (fromD.getDay() != 0 && fromD.getDay() != 6 &&
      toD.getDay() != 0 && toD.getDay() != 6) {
        timesToQuery.push([fromTime, toTime]);
      }
    }
  } else {
    alert("Please select a time period");
  }

}

function getStartEndTimes() {
  var fromD = new Date(fromYear, fromMonth);
  fromEpoch = fromD.getTime() / 1000;
  var delta = numberOfDays;
  // number of seconds in 24 hours
  delta *= 86400;
  // add a week to the start time
  toEpoch = fromEpoch + delta;
  fromTime += fromEpoch;
  toTime += toEpoch;
}

function makeHistogramTitle() {
  var fromDate = new Date(fromEpoch * 1000);
  var toDate = new Date(toEpoch * 1000);
  titleString = "Travel Times: " +
    fromDate.toDateString() + " - " + toDate.toDateString();
  fromDateString = fromDate.toDateString();
  toDateString = toDate.toDateString();
}

function whichChecks() {
  amPeakIsChecked = document.getElementById("amPeak").checked;
  pmPeakIsChecked = document.getElementById("pmPeak").checked;
  offPeakIsChecked = document.getElementById("offPeak").checked;
  if (amPeakIsChecked && pmPeakIsChecked && offPeakIsChecked) {
    allTimesChecked = true;
  } else {
    allTimesChecked = false;
  }
  if (amPeakIsChecked && pmPeakIsChecked) {
    bothPeakChecked = true;
  } else {
    bothPeakChecked = false;
  }
};
