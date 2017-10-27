
    var svg, width = 900,
    height = 700;
    var projection = d3.geoMercator().rotate([-10, 0]).scale(height / 5).translate([width / 2, height / 2]).clipExtent([
        [0, 0.1 * height],
        [width, height * 0.85]
        ]);
    var path = d3.geoPath().projection(projection);
    var graticule = d3.geoGraticule();
    var path = d3.geoPath().projection(projection);
    d3.json("js/geomap/worldmap/world-110m.json", function(error, world) {
        var svg = d3.select("#geomap").append("svg").attr("width", width).attr("height", height);
        svg.append("path").datum(graticule).attr("class", "graticule").attr("d", path);
        svg.insert("path", ".graticule").datum(topojson.feature(world, world.objects.land)).attr("class", "land").attr("d", path);
        svg.insert("path", ".graticule").datum(topojson.mesh(world, world.objects.countries, function(a, b) {
            return a !== b;
        })).attr("class", "boundary").attr("d", path);
        drawarcs(svg);
        d3.select(self.frameElement).style("height", height + "px");
    });
    var tradedata = [{
        destination: {
            latitude: -23.3,
            longitude: 132.2
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
        trade: 16
    }, {
        destination: {
            latitude: 36.1,
            longitude: 127.7
        },
        name: 'S. Korea',
        trade: 8
    }, {
        destination: {
            latitude: 53.6,
            longitude: -2.3
        },
        name: 'Great Britain',
        trade: 12
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
        trade: 15
    }, {
        destination: {
            latitude: -14.0,
            longitude: -47.643501
        },
        name: 'Brazil',
        trade: 12
    }, {
        destination: {
            latitude: 55.86,
            longitude: -112.1
        },
        name: 'Canada',
        trade: 32
    }];

    function drawarcs(svg) {
        var arcs = svg.append("g").selectAll('path.datamaps-arc').data(tradedata, JSON.stringify);
        arcs.enter().append('path').attr('class', 'arc').attr('d', function(datum) {
            var origin = projection([-69.445469, 45.253783]);
            var dest = projection([datum.destination.longitude, datum.destination.latitude]);
            var mid = [(origin[0] + dest[0]) / 2, (origin[1] + dest[1]) / 2];
            var curveoffset = 20,
            midcurve = [mid[0] + curveoffset, mid[1] - curveoffset]
            scalar = Math.sqrt(Math.pow(dest[0], 2) - 2 * dest[0] * midcurve[0] + Math.pow(midcurve[0], 2) + Math.pow(dest[1], 2) - 2 * dest[1] * midcurve[1] + Math.pow(midcurve[1], 2));
            arrowpoint = [dest[0] - (0.5 * datum.trade * (dest[0] - midcurve[0]) - datum.trade * (dest[1] - midcurve[1])) / scalar, dest[1] - (0.5 * datum.trade * (dest[1] - midcurve[1]) - datum.trade * (-dest[0] + midcurve[0])) / scalar];
            return "M" + origin[0] + ',' + origin[1] + "S" + midcurve[0] + "," + midcurve[1] + "," + dest[0] + "," + dest[1] + "L" + arrowpoint[0] + "," + arrowpoint[1] + "l" + (0.3 * datum.trade * (-dest[1] + midcurve[1]) / scalar) + "," + (0.3 * datum.trade * (dest[0] - midcurve[0]) / scalar) + "S" + (midcurve[0]) + "," + (midcurve[1]) + "," + origin[0] + "," + origin[1]
        });
        arcs.exit().transition().style('opacity', 0).remove();
    }
