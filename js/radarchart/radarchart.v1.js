////////////////////// Radar Chart ///////////////////////////
//////////////////////// Set-Up //////////////////////////////
//////////////////////////////////////////////////////////////

var margin = { top: 50, right: 80, bottom: 50, left: 80 },
  width = Math.min(700, window.innerWidth / 4) - margin.left - margin.right,
  height = Math.min(width, window.innerHeight - margin.top - margin.bottom);

//////////////////////////////////////////////////////////////
////////////////////////// Data //////////////////////////////
//////////////////////////////////////////////////////////////

var year = '2015';
var country = 'Indonesia'
var results = [];

var data = d3.csv("data/annual_tourism_receipts_by_country_and_major_components.csv", function (error, data) {
  //var popData = data.filter(function(element) {return element.Year == year});

  var yearData = data.filter(function (element) { return element.Year == year });
  var countryData =
    yearData.filter(function (element) { return (element.Country == country || element.Country == "Average") });
  // var selectedData = countryData.push(medianData);
  // selectedData.push(medianData);
  // selectedData.push(countryData);

  // console.log(popData);
  var obj = {};
  countryData.forEach(function (d) {
    // console.log(d);
    var newObj = {};
    newObj.name = d.Country;
    newObj.axes = [];
    newObj.axes.push({ axis: "Accommodation", value: +d.Accommodation });
    newObj.axes.push({ axis: "Food And Beverage", value: +d.FoodAndBeverage });
    newObj.axes.push({ axis: "Shopping", value: +d.Shopping });
    if (year != 2015) {
      newObj.axes.push({ axis: "Local Transport", value: +d.LocalTransport });
    }
    // newObj.axes.push({ axis: "Medical", value: +d.Medical });
    newObj.axes.push({ axis: "Others", value: +d.Others });
    results.push(newObj);
  });

  //////////////////////////////////////////////////////////////
  ////// First example /////////////////////////////////////////
  ///// (not so much options) //////////////////////////////////
  //////////////////////////////////////////////////////////////
  var radarChartOptions = {
    w: 290,
    h: 350,
    margin: margin,
    levels: 5,
    roundStrokes: true,
    // color: d3.scaleOrdinal(d3.schemeCategory20),//.range(["#AFC52F", "#ff6600"]),
    color: d3.scaleOrdinal().range(["#AFC52F", "#ff6600"]),
    legend: { title: 'Expenditure Breakdown (S$m)', translateX: 250, translateY: 40 },
    format: '.0f'
  };

  // Draw the chart, get a reference the created svg element :
  var svg_radar1 = RadarChart("#radarChart", results, radarChartOptions);

  // Remove and replot radarchart on change
  select_element = $("#dropDownCountry");
  $(select_element).on("change", function () {
    results = [];
    // console.log("current selection " + select_element.val());

    country = $("#dropDownCountry").val();
    // console.log(country);
    var yearData = data.filter(function (element) { return element.Year == year });

    var countryData =
      yearData.filter(function (element) { return (element.Country == country || element.Country == "Average") });

    var obj = {};
    countryData.forEach(function (d) {
      // console.log(d);
      var newObj = {};
      newObj.name = d.Country;
      newObj.axes = [];
      newObj.axes.push({ axis: "Accommodation", value: +d.Accommodation });
      newObj.axes.push({ axis: "Food And Beverage", value: +d.FoodAndBeverage });
      newObj.axes.push({ axis: "Shopping", value: +d.Shopping });
      if (year != 2015) {
        newObj.axes.push({ axis: "Local Transport", value: +d.LocalTransport });
      }
      // newObj.axes.push({ axis: "Medical", value: +d.Medical });
      newObj.axes.push({ axis: "Others", value: +d.Others });
      results.push(newObj);
    });

    var radarChartOptions = {
      w: 290,
      h: 350,
      margin: margin,
      levels: 5,
      roundStrokes: true,
      // color: d3.scaleOrdinal(d3.schemeCategory20),//.range(["#AFC52F", "#ff6600"]),
      color: d3.scaleOrdinal().range(["#AFC52F", "#ff6600"]),
      legend: { title: 'Expenditure Breakdown (S$m)', translateX: 250, translateY: 40 },
      format: '.0f'
    };

    //d3.selectAll(".radarChart").remove();
    // console.log(results);
    // Draw the chart, get a reference the created svg element :
    svg_radar1 = RadarChart("#radarChart", results, radarChartOptions);
  });

  $(document).ready(function () {
    $('input[name=options]').change(function () {
      // console.log($('input[name=options]:checked').val());
      var btnYearValue = $('input[name=options]:checked').val();

      results = [];

      var yearData = data.filter(function (element) { return element.Year == btnYearValue });

      var countryData =
        yearData.filter(function (element) { return (element.Country == country || element.Country == "Average") });

      var obj = {};
      countryData.forEach(function (d) {
        // console.log(d);
        var newObj = {};
        newObj.name = d.Country;
        newObj.axes = [];
        newObj.axes.push({ axis: "Accommodation", value: +d.Accommodation });
        newObj.axes.push({ axis: "Food And Beverage", value: +d.FoodAndBeverage });
        newObj.axes.push({ axis: "Shopping", value: +d.Shopping });
        if(btnYearValue != 2015){
          newObj.axes.push({ axis: "Local Transport", value: +d.LocalTransport });
        }
        // newObj.axes.push({ axis: "Medical", value: +d.Medical });
        newObj.axes.push({ axis: "Others", value: +d.Others });
        results.push(newObj);
      });

      var radarChartOptions = {
        w: 290,
        h: 350,
        margin: margin,
        levels: 5,
        roundStrokes: true,
        // color: d3.scaleOrdinal(d3.schemeCategory20),//.range(["#AFC52F", "#ff6600"]),
        color: d3.scaleOrdinal().range(["#AFC52F", "#ff6600"]),
        legend: { title: 'Expenditure Breakdown (S$m)', translateX: 250, translateY: 40 },
        format: '.0f'
      };

      //d3.selectAll(".radarChart").remove();
      //console.log(results);
      // Draw the chart, get a reference the created svg element :
      svg_radar1 = RadarChart("#radarChart", results, radarChartOptions);

    });

    /*  //changed from buttons to radiobutton
    $('#yearbtn-2013').click(function() {
      var btnYearValue = ($(this).attr("value"));
      results = [];

      var yearData = data.filter(function(element) {return element.Year == btnYearValue});
      
      var countryData = 
          yearData.filter(function(element) {return (element.Country == country || element.Country == "Average")});

      var obj = {};
      countryData.forEach(function(d){
        // console.log(d);
        var newObj = {};
        newObj.name = d.Country;
        newObj.axes = [];
        newObj.axes.push({axis: "Accommodation", value: +d.Accommodation});
        newObj.axes.push({axis: "Food And Beverage", value: +d.FoodAndBeverage});
        newObj.axes.push({axis: "Shopping", value: +d.Shopping});
        newObj.axes.push({axis: "Local Transport", value: +d.LocalTransport});
        newObj.axes.push({axis: "Medical", value: +d.Medical});
        newObj.axes.push({axis: "Others", value: +d.Others});
        results.push(newObj);
      });

      var radarChartOptions = {
        w: 290,
        h: 350,
        margin: margin,
        levels: 5,
        roundStrokes: true,
        // color: d3.scaleOrdinal(d3.schemeCategory20),//.range(["#AFC52F", "#ff6600"]),
        color: d3.scaleOrdinal().range(["#AFC52F", "#ff6600"]),
        legend: { title: 'Expenditure Breakdown (S$m)', translateX: 250, translateY: 40 },
        format: '.0f'
      };

      //d3.selectAll(".radarChart").remove();
      //console.log(results);
      // Draw the chart, get a reference the created svg element :
      svg_radar1 = RadarChart("#radarChart", results, radarChartOptions);
    });
    $('#yearbtn-2014').click(function() {
      var btnYearValue = ($(this).attr("value"));
      results = [];

      var yearData = data.filter(function(element) {return element.Year == btnYearValue});
      
      var countryData = 
          yearData.filter(function(element) {return (element.Country == country || element.Country == "Average")});

      var obj = {};
      countryData.forEach(function(d){
        // console.log(d);
        var newObj = {};
        newObj.name = d.Country;
        newObj.axes = [];
        newObj.axes.push({axis: "Accommodation", value: +d.Accommodation});
        newObj.axes.push({axis: "Food And Beverage", value: +d.FoodAndBeverage});
        newObj.axes.push({axis: "Shopping", value: +d.Shopping});
        newObj.axes.push({axis: "Local Transport", value: +d.LocalTransport});
        newObj.axes.push({axis: "Medical", value: +d.Medical});
        newObj.axes.push({axis: "Others", value: +d.Others});
        results.push(newObj);
      });

      var radarChartOptions = {
        w: 290,
        h: 350,
        margin: margin,
        levels: 5,
        roundStrokes: true,
        // color: d3.scaleOrdinal(d3.schemeCategory20),//.range(["#AFC52F", "#ff6600"]),
        color: d3.scaleOrdinal().range(["#AFC52F", "#ff6600"]),
        legend: { title: 'Expenditure Breakdown (S$m)', translateX: 250, translateY: 40 },
        format: '.0f'
      };

      //d3.selectAll(".radarChart").remove();
      //console.log(results);
      // Draw the chart, get a reference the created svg element :
      svg_radar1 = RadarChart("#radarChart", results, radarChartOptions);
    });
    $('#yearbtn-2015').click(function() {
      var btnYearValue = ($(this).attr("value"));
      results = [];

      var yearData = data.filter(function(element) {return element.Year == btnYearValue});
      
      var countryData = 
          yearData.filter(function(element) {return (element.Country == country || element.Country == "Average")});

      var obj = {};
      countryData.forEach(function(d){
        // console.log(d);
        var newObj = {};
        newObj.name = d.Country;
        newObj.axes = [];
        newObj.axes.push({axis: "Accommodation", value: +d.Accommodation});
        newObj.axes.push({axis: "Food And Beverage", value: +d.FoodAndBeverage});
        newObj.axes.push({axis: "Shopping", value: +d.Shopping});
        newObj.axes.push({axis: "Medical", value: +d.Medical});
        newObj.axes.push({axis: "Others", value: +d.Others});
        results.push(newObj);
      });

      var radarChartOptions = {
        w: 290,
        h: 350,
        margin: margin,
        levels: 5,
        roundStrokes: true,
        // color: d3.scaleOrdinal(d3.schemeCategory20),//.range(["#AFC52F", "#ff6600"]),
        color: d3.scaleOrdinal().range(["#AFC52F", "#ff6600"]),
        legend: { title: 'Expenditure Breakdown (S$m)', translateX: 250, translateY: 40 },
        format: '.0f'
      };

      //d3.selectAll(".radarChart").remove();
      //console.log(results);
      // Draw the chart, get a reference the created svg element :
      svg_radar1 = RadarChart("#radarChart", results, radarChartOptions);
    });
    */
  });
});


var data = [
  {
    name: 'Indonesia',
    axes: [
      { axis: 'Accomodation', value: 604 },
      { axis: 'Food and Beverage', value: 242 },
      { axis: 'Shopping', value: 928 },
      { axis: 'Local Transport', value: 101 },
      { axis: 'Medical', value: 463 },
      { axis: 'Others', value: 641 }
    ]
  },
  {
    name: 'China',
    axes: [
      { axis: 'Accomodation', value: 654 },
      { axis: 'Food and Beverage', value: 265 },
      { axis: 'Shopping', value: 1399 },
      { axis: 'Local Transport', value: 90 },
      { axis: 'Medical', value: 28 },
      { axis: 'Others', value: 545 }
    ]
  },
  {
    name: 'Malaysia',
    axes: [
      { axis: 'Accomodation', value: 225 },
      { axis: 'Food and Beverage', value: 87 },
      { axis: 'Shopping', value: 252 },
      { axis: 'Local Transport', value: 39 },
      { axis: 'Medical', value: 79 },
      { axis: 'Others', value: 206 }
    ]
  },
  {
    name: 'India',
    axes: [
      { axis: 'Accomodation', value: 443 },
      { axis: 'Food and Beverage', value: 183 },
      { axis: 'Shopping', value: 218 },
      { axis: 'Local Transport', value: 83 },
      { axis: 'Medical', value: 21 },
      { axis: 'Others', value: 276 }
    ]
  },
  {
    name: 'Australia',
    axes: [
      { axis: 'Accomodation', value: 323 },
      { axis: 'Food and Beverage', value: 151 },
      { axis: 'Shopping', value: 157 },
      { axis: 'Local Transport', value: 46 },
      { axis: 'Medical', value: 4 },
      { axis: 'Others', value: 397 }
    ]
  },
  {
    name: 'Japan',
    axes: [
      { axis: 'Accomodation', value: 328 },
      { axis: 'Food and Beverage', value: 109 },
      { axis: 'Shopping', value: 113 },
      { axis: 'Local Transport', value: 43 },
      { axis: 'Medical', value: 1 },
      { axis: 'Others', value: 317 }
    ]
  },
  {
    name: 'Philippines',
    axes: [
      { axis: 'Accomodation', value: 288 },
      { axis: 'Food and Beverage', value: 98 },
      { axis: 'Shopping', value: 149 },
      { axis: 'Local Transport', value: 42 },
      { axis: 'Medical', value: 0 },
      { axis: 'Others', value: 106 }
    ]
  },
  {
    name: 'South Korea',
    axes: [
      { axis: 'Accomodation', value: 170 },
      { axis: 'Food and Beverage', value: 72 },
      { axis: 'Shopping', value: 54 },
      { axis: 'Local Transport', value: 26 },
      { axis: 'Medical', value: 0 },
      { axis: 'Others', value: 144 }
    ]
  },
  {
    name: 'USA',
    axes: [
      { axis: 'Accomodation', value: 263 },
      { axis: 'Food and Beverage', value: 126 },
      { axis: 'Shopping', value: 41 },
      { axis: 'Local Transport', value: 42 },
      { axis: 'Medical', value: 3 },
      { axis: 'Others', value: 150 }
    ]
  },
  {
    name: 'Thailand',
    axes: [
      { axis: 'Accomodation', value: 259 },
      { axis: 'Food and Beverage', value: 88 },
      { axis: 'Shopping', value: 149 },
      { axis: 'Local Transport', value: 33 },
      { axis: 'Medical', value: 1 },
      { axis: 'Others', value: 88 }
    ]
  },
  {
    name: 'UK',
    axes: [
      { axis: 'Accomodation', value: 174 },
      { axis: 'Food and Beverage', value: 82 },
      { axis: 'Shopping', value: 55 },
      { axis: 'Local Transport', value: 24 },
      { axis: 'Medical', value: 0 },
      { axis: 'Others', value: 180 }
    ]
  },
  {
    name: 'Hong Kong',
    axes: [
      { axis: 'Accomodation', value: 203 },
      { axis: 'Food and Beverage', value: 79 },
      { axis: 'Shopping', value: 64 },
      { axis: 'Local Transport', value: 25 },
      { axis: 'Medical', value: 1 },
      { axis: 'Others', value: 135 }
    ]
  },
  {
    name: 'Vietnam',
    axes: [
      { axis: 'Accomodation', value: 202 },
      { axis: 'Food and Beverage', value: 66 },
      { axis: 'Shopping', value: 135 },
      { axis: 'Local Transport', value: 43 },
      { axis: 'Medical', value: 81 },
      { axis: 'Others', value: 88 }
    ]
  },
  {
    name: 'Germany',
    axes: [
      { axis: 'Accomodation', value: 79 },
      { axis: 'Food and Beverage', value: 36 },
      { axis: 'Shopping', value: 19 },
      { axis: 'Local Transport', value: 11 },
      { axis: 'Medical', value: 0 },
      { axis: 'Others', value: 75 }
    ]
  },
  {
    name: 'Taiwan',
    axes: [
      { axis: 'Accomodation', value: 113 },
      { axis: 'Food and Beverage', value: 40 },
      { axis: 'Shopping', value: 56 },
      { axis: 'Local Transport', value: 16 },
      { axis: 'Medical', value: 0 },
      { axis: 'Others', value: 48 }
    ]
  },
];

//////////////////////////////////////////////////////////////
////// First example /////////////////////////////////////////
///// (not so much options) //////////////////////////////////
//////////////////////////////////////////////////////////////
// var radarChartOptions = {
//   w: 290,
//   h: 350,
//   margin: margin,
//   levels: 5,
//   roundStrokes: true,
//   color: d3.scaleOrdinal(d3.schemeCategory20),//.range(["#AFC52F", "#ff6600"]),
//   legend: { title: 'Expenditure Breakdown', translateX: 250, translateY: 40 },
//   format: '.0f'
// };

// // Draw the chart, get a reference the created svg element :
// let svg_radar1 = RadarChart(".radarChart", data, radarChartOptions);

// //////////////////////////////////////////////////////////////
// ///// Second example /////////////////////////////////////////
// ///// Chart legend, custom color, custom unit, etc. //////////
// //////////////////////////////////////////////////////////////
// var radarChartOptions2 = {
//   w: 290,
//   h: 350,
//   margin: margin,
//   maxValue: 60,
//   levels: 6,
//   roundStrokes: false,
//   color: d3.scaleOrdinal().range(["#AFC52F", "#ff6600"]),
//   format: '.0f',
//   legend: { title: 'Organization XYZ', translateX: 100, translateY: 40 },
//   unit: '$'
// };

// // Draw the chart, get a reference the created svg element :
// let svg_radar2 = RadarChart(".radarChart2", data, radarChartOptions2);

var dateParser = d3.timeParse("%Y");
// var dateFormat = d3.timeFormat("%Y%m%d");
country = 'Indonesia'
var lineChartResults1 = [];
var index = 0;
var colors = ["#AFC52F", "#ff6600"];
d3.csv("data/annual_tourism_receipts_by_country_and_major_components.csv", function (error, data) {
  select_element = $("#dropDownCountry");
  $(select_element).on("change", function () {
    var lineChartResults1 = [];

    data.forEach(function (d) {
      d.Year = dateParser(d.Year);
      // d.Year = dateFormat(d.Year);
      d.Year = +d.Year;
      d.Total = +d.Total;
    });

    var countryData =
      data.filter(function (element) { return (element.Country == country || element.Country == "Average") });

    countryData.forEach(function (d) {
      var status = false;
      var lineChartObj1 = {};
      lineChartObj1.data = [];
      for (i = 0; i < lineChartResults1.length; i++) {
        //console.log(lineChartResults[i].id);
        if ((lineChartResults1[i].name) == (d.Country)) {
          lineChartObj1 = lineChartResults1[i];
          status = true;
          break;
        }
      }
      lineChartObj1.data.push(d.Total);
      if (status == false) {
        lineChartObj1.name = d.Country;
        lineChartObj1.color = colors[index];
        lineChartResults1.push(lineChartObj1);
        index = index + 1;
        if (index == 2) {
          index = 0;
        }
      }
    });

    // console.log(lineChartResults1);

    Highcharts.chart('container', {
      credits: {
        enabled: false
      },
      chart: {
        type: 'line',
        width: 650
      },
      title: {
        text: null//'Overall Country Expenditure'
      },
      // subtitle: {
      //     text: 'Total Expenditure of Country (2013 - 2015)'
      //},
      xAxis: {
        categories: [2013, 2014, 2015]
      },
      yAxis: {
        title: {
          //align: 'low',
          //offset: 0,
          text: 'Overall Expenditure ($Sm)',
          //rotation: 0,
          //y: -10
        }
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: true
          },
          enableMouseTracking: true
        },
      },
      series: lineChartResults1
    });

  });

  data.forEach(function (d) {
    d.Year = dateParser(d.Year);
    // d.Year = dateFormat(d.Year);
    d.Year = +d.Year;
    d.Total = +d.Total;
  });

  var countryData =
    data.filter(function (element) { return (element.Country == country || element.Country == "Average") });

  countryData.forEach(function (d) {
    var status = false;
    var lineChartObj1 = {};
    lineChartObj1.data = [];
    for (i = 0; i < lineChartResults1.length; i++) {
      //console.log(lineChartResults[i].id);
      if ((lineChartResults1[i].name) == (d.Country)) {
        lineChartObj1 = lineChartResults1[i];
        status = true;
        break;
      }
    }
    lineChartObj1.data.push(d.Total);
    if (status == false) {
      lineChartObj1.name = d.Country;
      lineChartObj1.color = colors[index];
      lineChartResults1.push(lineChartObj1);
      index++;
      if (index == 2) {
        index = 0;
      }
    }
  });
  // console.log("linechartresults: ");
  // console.log(lineChartResults1);


  Highcharts.chart('container', {
    credits: {
      enabled: false
    },
    chart: {
      type: 'line',
      width: 650
    },
    title: {
      text: null//'Overall Country Expenditure'
    },
    // subtitle: {
    //     text: 'Total Expenditure of Country (2013 - 2015)'
    // },
    xAxis: {
      categories: [2013, 2014, 2015]
    },
    yAxis: {
      title: {
        //align: 'low',
        //offset: 0,
        text: 'Visitor Arrivals',
        type: 'logarithmic',
        minorTickInterval: 0.1
        //rotation: 0,
        //y: -10
      }
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: true
        },
        enableMouseTracking: true
      }
    },
    series: lineChartResults1
  });

});
