var countriesData = [],
          yearData_ = [],
          visitorArrivalData =[],
          visitorsDepartedData = [];

      var dateParser = d3.timeParse("%Y");
      var dateFormat = d3.timeFormat("%Y");

      // var testData = d3.queue()
      //                  .defer(d3.csv, "data/num_visitor_arrivals_to_singapore.csv")
      //                  .defer(d3.csv, "data/num_departure_by_countries.csv")
      //                  .await(combine);

      // function combine(error, big_data_1, big_data_2) {
      //     if (error) {
      //         console.log(error);
      //     }
      //     console.log(d3.merge([big_data_1, big_data_2]));
      // }
      // console.log(d3.select('#select-year').node().value);

      d3.csv("data/comb_visitor_arrivals_vs_departed.csv", function(error,data){
        select_element = $("#select-year");
        $(select_element).on("change", function() {
          select_element = $("#select-year");
          countriesData = [];
          yearData__ = [];
          visitorArrivalData =[];
          visitorsDepartedData = [];
          //dataByYear = data.filter(function(element) {return element.Year == d3.select('#select-year').node().value;});
          // console.log("current selection " + select_element.val());
          //chart.series[0].setData(data,true);

          //to fix error here - if view same year twice, the third time will show nothing
          var dataByYear = data.filter(function(element) {return (dateFormat(element.Year) == d3.select('#select-year').node().value) || (element.Year == d3.select('#select-year').node().value);});

          console.log(d3.select('#select-year').node().value);
          console.log(data);

          dataByYear.forEach(function(d){
            d.Year = dateParser(d.Year);
            d.Country = d.Country; // '+' just to type cast to numeric
            d.VisitorArrival = +d.VisitorArrival;
            d.VisitorDeparted = +d.VisitorDeparted;
          });
          
          //sort in descending
          function sortByKey(array, key) {
              return array.sort(function(a, b) {
                  var x = a[key]; var y = b[key];
                  return ((x > y) ? -1 : ((x < y) ? 1 : 0));
              });
          }
          dataByYear = sortByKey(dataByYear, 'VisitorArrival');
          //end sort

          dataByYear.map(function(d){ 
              countriesData.push(d.Country);
              yearData_.push(d.Year);
              visitorArrivalData.push(d.VisitorArrival);
              visitorsDepartedData.push(d.VisitorDeparted);
          });

          console.log(countriesData);
          console.log(yearData_);
          console.log(visitorArrivalData);
          console.log(visitorsDepartedData);

          Highcharts.chart('barChartContainer', {
            credits: {
              enabled: false
            },
            chart: {
                type: 'column',
                width: 675
            },
            title: {
                text: null//'Proportion of Tourists Arriving to Singapore'
            },
            exporting: { enabled: false },
            xAxis: {
                categories: countriesData,
                // lineWidth: 0,
                gridLineWidth: 0.5
                // lineColor: 'transparent',
                // labels: {
                //     enabled: false
                // },
                // minorTickLength: 0,
                // tickLength: 0
            },
            yAxis: [{
                min: 0,
                gridLineWidth: 0.5,
                title: {
                  text: 'Arrived in Singapore',
                  style:{
                    color: 'rgba(126,86,134,.9)'
                  }
                },
                labels:{
                  style:{
                    color: 'rgba(126,86,134,.9)'   
                  }
                }
            }, {
                min: 0,
                title: {
                  text: 'Departed from Home Country,',
                  style:{
                    color: 'rgba(165,170,217,1)'
                  }
                },
                labels:{
                  style:{
                    color: 'rgba(165,170,217,1)'
                  }
                },
                opposite: false
            }],
            legend: {
                shadow: false
            },
            tooltip: {
                shared: true
            },
            plotOptions: {
                column: {
                    grouping: false,
                    shadow: false,
                    borderWidth: 0
                }
            },
            series: [{
                name: 'Departed from Home Country',
                color: 'rgba(165,170,217,1)',
                data: visitorsDepartedData,
                pointPadding: 0.1,
                pointPlacement: 0//,
                //yAxis: 1
            },{
                name: 'Arrived in Singapore',
                color: 'rgba(126,86,134,.9)',
                data: visitorArrivalData,
                pointPadding: 0.3,
                pointPlacement: 0
            },]
          });
        });


        var dataByYear = data.filter(function(element) {return element.Year == d3.select('#select-year').node().value;});

        dataByYear.forEach(function(d){
          d.Year = dateParser(d.Year);
          d.Country = d.Country; // '+' just to type cast to numeric
          d.VisitorArrival = +d.VisitorArrival;
          d.VisitorDeparted = +d.VisitorDeparted;
        });
        
        //sort in descending
        function sortByKey(array, key) {
            return array.sort(function(a, b) {
                var x = a[key]; var y = b[key];
                return ((x > y) ? -1 : ((x < y) ? 1 : 0));
            });
        }
        dataByYear = sortByKey(dataByYear, 'VisitorArrival');
        //end sort

        dataByYear.map(function(d){ 
            countriesData.push(d.Country);
            yearData_.push(d.Year);
            visitorArrivalData.push(d.VisitorArrival);
            visitorsDepartedData.push(d.VisitorDeparted);
        });

        // console.log(countriesData);
        // console.log(yearData_);
        // console.log(visitorArrivalData);
        // console.log(visitorsDepartedData);

        Highcharts.chart('barChartContainer', {
          credits: {
              enabled: false
          },
          chart: {
              type: 'column',
              width: 675
          },
          title: {
              text: null//'Proportion of Tourists Arriving to Singapore'
          },
          exporting: { enabled: false },
          xAxis: {
              categories: countriesData,
              // lineWidth: 0,
              gridLineWidth: 0.5
              // lineColor: 'transparent',
              // labels: {
              //     enabled: false
              // },
              // minorTickLength: 0,
              // tickLength: 0
          },
          yAxis: [{
              min: 0,
              gridLineWidth: 0.5,
              title: {
                text: 'Arrived in Singapore',
                style:{
                  color: 'rgba(126,86,134,.9)'
                }
              },
              labels:{
                style:{
                  color: 'rgba(126,86,134,.9)'   
                }
              }
          }, {
              min: 0,
              title: {
                text: 'Departed from Home Country,',
                style:{
                  color: 'rgba(165,170,217,1)'
                }
              },
              labels:{
                style:{
                  color: 'rgba(165,170,217,1)'
                }
              },
              opposite: false
          }],
          legend: {
              shadow: false
          },
          tooltip: {
              shared: true
          },
          plotOptions: {
              column: {
                  grouping: false,
                  shadow: false,
                  borderWidth: 0
              }
          },
          series: [{
              name: 'Departed from Home Country',
              color: 'rgba(165,170,217,1)',
              data: visitorsDepartedData,
              pointPadding: 0.1,
              pointPlacement: 0//,
              //yAxis: 1
          },{
              name: 'Arrived in Singapore',
              color: 'rgba(126,86,134,.9)',
              data: visitorArrivalData,
              pointPadding: 0.3,
              pointPlacement: 0
        }]
        });
      });

var lineChartResults=[];

      d3.csv("data/comb_visitor_arrivals_vs_departed.csv", function(error,data){

        data.forEach(function(d){
          d.Year = dateParser(d.Year);
          d.Country = d.Country; // '+' just to type cast to numeric
          d.VisitorArrival = +d.VisitorArrival;
          d.VisitorDeparted = +d.VisitorDeparted;
        });

        data.forEach(function(d){
            var status = false;
            var lineChartObj = {};
            lineChartObj.data = [];
            for(i = 0; i < lineChartResults.length; i++){
              //console.log(lineChartResults[i].id);
              if((lineChartResults[i].name)==(d.Country)){
                lineChartObj = lineChartResults[i];
                status = true;
                break;
              }
            }
            lineChartObj.data.push(d.VisitorArrival);
            if (status == false){
              lineChartObj.name = d.Country;
              lineChartResults.push(lineChartObj); 
            }
          });

        console.log(lineChartResults);
        Highcharts.setOptions({
          colors: ['#000000', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4',
                    '#FF067E', '#E406E8', '#AF07FF', '#5B06E8', '#2C1BFF', '#F314FF', '#294268']
        });

        // Highcharts.setOptions(Highcharts.theme);

        Highcharts.chart('lineChartContainer', {
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
          exporting: { enabled: false },
          // subtitle: {
          //     text: 'Total Expenditure of Country (2013 - 2015)'
          //},
          xAxis: {
              categories: [2010,2011,2012,2013,2014,2015]
          },
          yAxis: {
              type: 'logarithmic',
              minorTickInterval: 0.1,
              title: {
                  text: 'Total Visitor Arrivals'
              }
          },
          plotOptions: {
              line: {
                  marker:{
                    enabled: false
                  },
                  dataLabels: {
                      enabled: false
                  },                    
                  enableMouseTracking: true
              },
              series:{
                events:{
                  legendItemClick: function(event) {
                    if (!this.visible)
                        return false;

                    var seriesIndex = this.index;
                    var series = this.chart.series;

                    for (var i = 0; i < series.length; i++)
                    {
                        if (series[i].index != seriesIndex)
                        {
                            series[i].visible ?
                            series[i].hide() :
                            series[i].show();
                        } 
                    }
                    return false;
                  }
                }
              }
          },
          series: lineChartResults
        });
      });