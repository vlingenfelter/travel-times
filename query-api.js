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
  //whichChecks();
  //updateEpochTimes();
  // see if there is an existing histogram
  if (times.length > 0) {
    // clear travel times to be populated with new data
    times = [];
    // loop through each day time segement in the list to get the travel times
    for (var i = 0; i < timesToQuery.length; i++) {
      $.ajax({
        type: "GET",
        // async keeps the histogram from executing before the query loop is done
        async: false,
        url: url + key + format + fromStop + toStop + timesToQuery[i][0] + timesToQuery[i][1],
        success: function(data) {
          if (data.travel_times.length > 0) {
            json = data;
            benchmark = json.travel_times[0].benchmark_travel_time_sec;
            // parse each time and change it from seconds to minutes
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
    refreshDataTable();
    // $("#api-test").append(benchmark + ", ");
  } else {
    times = [];
    for (var i = 0; i < timesToQuery.length; i++) {
      $.ajax({
        type: "GET",
        async: false,
        url: url + key + format + fromStop + toStop + timesToQuery[i][0] + timesToQuery[i][1],
        success: function(data) {
          if (data.travel_times.length > 0) {
            json = data;
            benchmark = json.travel_times[0].benchmark_travel_time_sec;
            for (var j = 0; j < data.travel_times.length; j++) {
              var time = parseFloat(data.travel_times[j].travel_time_sec);
              times.push((time / 60));
            }
          //  $("#api-test").append(benchmark + ", ");
          }
        }
      });
    }
    makeHistogram(times, color);
    // $("#api-test").append(numberOfTimes + " results found");
    getDataTable();
  }
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
  $("#startTimeMonth").text("Month:");
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
  $("#startTimeDay").text("Day:");
  $("#dayType").text("Day Type:");
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

function addDayType(daytype) {
  switch (daytype) {
    case "week":
      dayType = "week";
      $("#dayType").text("Weekday");
      $("#daySeg").text("Segement:");
      var node = document.getElementById("selectDaySeg");
      while (node.firstChild) {
        node.removeChild(node.firstChild);
      }
      var data = ["AM_Peak", "PM_Peak", "Off_Peak"];
      var daySegButton = d3.select("#selectDaySeg");
      var a = daySegButton.selectAll("a").data(data);
      a.remove();
      a.enter()
        .append("a")
        .attr("href", "#")
        .attr("onclick", (d) => ("addDaySegs('" + d + "')"))
        .text((d) => (d.split('_').join(' ')));
      break;
    case "sat":
      dayType = 6;
      $("#dayType").text("Saturday");
      $("#daySeg").text("All Day");
      addDaySegs("All_Day");
      var node = document.getElementById("selectDaySeg");
      while (node.firstChild) {
        node.removeChild(node.firstChild);
      }
      break;
    case "sun":
      dayType = 0;
      $("#dayType").text("Sunday");
      $("#daySeg").text("All Day");
      addDaySegs("All_Day");
      var node = document.getElementById("selectDaySeg");
      while (node.firstChild) {
        node.removeChild(node.firstChild);
      }
      break;
    default:
  }
}


function addDaySegs(segement) {
  timesToQuery = [];
  switch (segement) {
    case "All_Day":
      for (var i = 0; i < 21; i++) {
        var day = parseFloat(fromDay);
        day += i;
        fromTime = "&from_datetime=";
        toTime = "&to_datetime=";
        var fromD = new Date(fromYear, fromMonth, day, 5);
        fromEpoch = fromD.getTime() / 1000;
        var toD = new Date(fromYear, fromMonth, (day+1), 2, 59);
        toEpoch = toD.getTime() / 1000;
        fromTime += fromEpoch;
        toTime += toEpoch;
        if (fromD.getDay() == dayType) {
          timesToQuery.push([fromTime, toTime]);
        }
      }
      break;
    case "AM_Peak":
      $("#daySeg").text("AM Peak");
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
      break;
    case "PM_Peak":
      $("#daySeg").text("PM Peak");
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
      break;
    case "Off_Peak":
      $("#daySeg").text("Off Peak");
      for (var i = 0; i < 7; i++) {
        var day = parseFloat(fromDay);
        day += i;
        fromTime = "&from_datetime=";
        toTime = "&to_datetime=";
        var fromD = new Date(fromYear, fromMonth, day, 18, 30);
        fromEpoch = fromD.getTime() / 1000;
        var toD = new Date(fromYear, fromMonth, (day+1), 6, 59);
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
      break;
    default:

  }
}
/*
UPDATE EPOCH TIMES
DOM State -> Array of time string pairs used to query api to get travel times
all segements are checked -> Array length 1, entire week (7 days) is queried
both peak segements are checked -> Array length 10, am & pm for all week days
am peak -> Array length 5, am peak for all week days
pm peak -> Array length 5, pm peak for all week days
off peak -> Array length 10, all times between am and pm peaks
*/
function updateEpochTimes() {
  // create empty array that will be populated with time string pairs
  timesToQuery = [];
  // if all times are checked
  // all times from start of day (5:00am) to 7 days later are returned\
  // possibly this should be changed and broken out by day type
  if (allTimesChecked) {
    // initialize fromTime and toTime
    fromTime = "&from_datetime=";
    toTime = "&to_datetime=";
    // fromD is the Date of the first day at 5 am
    var fromD = new Date(fromYear, fromMonth, fromDay, 5);
    // convert to epoch time
    fromEpoch = fromD.getTime() / 1000;
    var delta = 7;
    // number of seconds in 24 hours
    delta *= 86400;
    // calculate epoch time of 7 days later
    toEpoch = fromEpoch + delta;
    fromTime += fromEpoch;
    toTime += toEpoch;
    // add these times to the times to query variable
    timesToQuery.push([fromTime, toTime]);
  } else if (bothPeakChecked) {
    // loop through all 7 days of the week
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
    alert("Please select a time segement");
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
