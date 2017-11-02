
var svg, 
width = window.innerWidth - 20, //window.screen.width -15,
height = window.innerHeight; // window.screen.height;

    // var projection = d3.geoMercator()
    //                     .rotate([-10, 0])
    //                     .scale(height / 5)
    //                     .translate([width / 2, height / 2])
    //                     .clipExtent([
    //                         [0, 0.1 * height],
    //                         [width, height * 0.85]   
    //                     ]);

    var projection = d3.geoMercator()
                        .center([0, 30]) // set centre to further North as we are cropping more off bottom of map
                        .scale([width / (2 * Math.PI)]) // scale to fit group width
                        .translate([width / 2, height / 2]); // ensure centred in group

    // define the map path
    var path = d3.geoPath()
                    .projection(projection);

    // set up the grid lines
    // var graticule = d3.geoGraticule();                    

    // function transform(t) {
    //     return function(d) {
    //         return "translate(" + t.apply(d) + ")";
    //     };
    // }

    var svg = d3.select('#geomap')
                .append('svg')
                .attr("width", width)
                .attr("height", height)
                .call(d3.zoom()
                    .scaleExtent([1, 8])
                    .on("zoom", zoom))
                .append('g');


    function zoom() {
        console.log(d3.event.transform);
        svg.attr("transform", /*transform*/(d3.event.transform));
    }

    function zoom_arc() {
        svg.attr("transform", _transform(d3.event.transform));
    }

    function _transform(t) {
        return function(d) {
            return 'translate(' + t.apply(d) + ')';
        }
    }

    function transform(t) {
        return function(d) {
            // let array = [];
            // array.push(d.destination.latitude);
            // array.push(d.destination.longitude);
            // console.log(array);
            console.log(d.destination.latitude + ', ' + d.destination.longitude + ' => ' + d.name);
            console.log(projection([d.destination.latitude, d.destination.longitude]));
            return "translate(" + t.apply(projection([d.destination.latitude, d.destination.longitude])) + ")";
        };
    }

    d3.json("js/geomap/worldmap/world_map.json", function(error, world) {

        // svg.append("path")
        //     // .datum(graticule)
        //     .attr("class", "graticule")
        //     .attr("d", path);

        // svg.selectAll('path')
        //     // .datum(topojson.feature(world, world.objects.land))
        //     .data(world.features.filter(d => d.properties.iso_a3 !== 'ATA' && d.properties.iso_a3 !== 'GRL'))
        //     .enter()
        //     .append('path')
        //     .attr("class", "land")
        //     .attr("d", path)
        //     .attr('stroke-width', 1.5)
        //     .attr('stroke', '#ffffff')
        //     .append("rect")
        //     .attr("fill", "none")
        //     .attr("pointer-events", "all")
        //     .attr("width", width)
        //     .attr("height", height)
        //     .call(d3.zoom()
        //         .scaleExtent([1, 8])
        //         .on("zoom", zoom_arc));

        // svg.selectAll('path')
        //     // .datum(topojson.mesh(world, world.objects.countries, function(a, b) {
        //     //     return a !== b;
        //     // }))
        //     .data(world.features)
        //     .enter()
        //     .append('path')
        //     .attr("class", "boundary")
        //     .attr("d", path);

        drawarcs(svg);

        // d3.select(self.frameElement).style("height", height + "px");

    });

    function drawarcs(svg) {

            var tradedata = [{
            destination: {
                latitude: -23.3, // south
                longitude: 132.2 // east
            },
            name: 'Australia',
            trade: 5
        }, {
            destination: {
                latitude: -28.5,
                longitude: 24.7
            },
            name: 'South Africa',
            trade: 6
        }, {
            destination: {
                latitude: 31.7,
                longitude: 106.2
            },
            name: 'China',
            trade: 6
        }, {
            destination: {
                latitude: 36.1,
                longitude: 127.7
            },
            name: 'S. Korea',
            trade: 5
        }, {
            destination: {
                latitude: 53.6,
                longitude: -2.3
            },
            name: 'Great Britain',
            trade: 2
        }, {
            destination: {
                latitude: 61.2,
                longitude: 9.7144087
            },
            name: 'Norway',
            trade: 2
        }, {
            destination: {
                latitude: 61.6,
                longitude: 15.4
            },
            name: 'Sweden',
            trade: 5
        }, {
            destination: {
                latitude: 64.93,
                longitude: -19.02
            },
            name: 'Iceland',
            trade: 15
        }, {
            destination: {
                latitude: 20.9,
                longitude: -101.5
            },
            name: 'Mexico',
            trade: 5
        }, {
            destination: {
                latitude: -14.0,
                longitude: -47.643501
            },
            name: 'Brazil',
            trade: 2
        }];

        var arcs = svg.append('g')
                    .selectAll('path.datamaps-arc')
                    .data(tradedata, JSON.stringify)
                    .enter()
                    .append('path')
                    .attr('class', 'arc')
                    .attr('d', function(datum) {
                        var origin = projection([datum.destination.longitude, datum.destination.latitude]);
                        var dest = projection([103.8, 1.35]);
                        var mid = [(origin[0] + dest[0]) / 2, (origin[1] + dest[1]) / 2];
                        var curveoffset = 20,
                        midcurve = [mid[0] + curveoffset, mid[1] - curveoffset]
                        scalar = Math.sqrt(
                                    Math.pow(dest[0], 2) - 2 * dest[0] * midcurve[0] 
                                    + Math.pow(midcurve[0], 2) 
                                    + Math.pow(dest[1], 2) - 2 * dest[1] * midcurve[1] 
                                    + Math.pow(midcurve[1], 2)
                                );
                        arrowpoint = [
                            dest[0] - (0.5 * datum.trade * (dest[0] - midcurve[0]) - datum.trade * (dest[1] - midcurve[1])) / scalar, 
                            dest[1] - (0.5 * datum.trade * (dest[1] - midcurve[1]) - datum.trade * (-dest[0] + midcurve[0])) / scalar
                        ];
                        return "M" + origin[0] + ',' + origin[1] + "S" + midcurve[0] + "," + midcurve[1] + "," + dest[0] + "," + dest[1] + "L" + arrowpoint[0] + "," + arrowpoint[1] + "l" + (0.3 * datum.trade * (-dest[1] + midcurve[1]) / scalar) + "," + (0.3 * datum.trade * (dest[0] - midcurve[0]) / scalar) + "S" + (midcurve[0]) + "," + (midcurve[1]) + "," + origin[0] + "," + origin[1]
                    })
                    .attr('transform', transform(d3.zoomIdentity));

        

        // arcs.exit()
        //     .transition()
        //     .style('opacity', 0)
        //     .remove();
    }
