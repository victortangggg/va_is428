
var width = window.innerWidth-50,
	height = window.innerHeight-110;

var year = $("#geomap_year").val();
// console.log(year);

var div = d3.select('#geomap'),
	svg = div.append('svg');

svg.append('g')
	.classed('map', true);

svg.append('g')
	.classed('dots', true);

svg.attr('width', width)
	.attr('height', height);

var _projection = d3.geoEquirectangular()
					.scale([width / (2 * Math.PI)])
					.translate([width/2, height/2+50]);

var fisheye = d3.fisheye();

var DEG = 180 / Math.PI,
	JAPAN = [138, 36],
	RADIUS = 45,
	POWER = 4;

fisheye.center(JAPAN)
		.radius(RADIUS)
		.power(POWER);

var projection = d3.geoProjection(function(x, y) {
						x *= DEG, y *=DEG;
						[x, y] = fisheye([x, y]);
						var p = _projection([x, y]);
						return [p[0], -p[1]];
					})
					.scale(1)
					.translate([width/2, height/2+50]);

var pathGenerator = d3.geoPath()
						.projection(projection);

var geoJson1 = 'js/geomap/worldmap/world_map.json';
var geoJson2 = 'js/geomap/worldmap/land.geojson';
var geoJson3 = 'js/geomap/worldmap/countries.geo.json';

//draw geo map
var land = d3.select('none');
plotMap();
function plotMap() {
	d3.json(geoJson3, function(error, data) {

		if(error) {
			throw error;
		}

		land = svg.select('g.map')
						.selectAll('path.land')
						// .data(data.features) // geoJson2
						// .data(data.features.filter(d => d.properties.iso_a3 !== 'ATA' && d.properties.iso_a3 !== 'GRL')) //geoJson1
						.data(data.features.filter(d => d.id !== 'ATA' && d.id !== 'GRL')) //geoJson3
						.enter()
						.append('path')
						.classed('land', true)
						.attr('id', function(d) {
							return 'land'+d.id;
						})
						// shaping
						.attr('d', pathGenerator)
						// css styling
						.style('fill', '#88a3ce')
						.style('stroke', '#ffffff')
						.style('stroke-width', 1)
						.on('mouseover', function(d, i) {
							d3.select(this)
								.style('fill', '#c66b6b');

							let id = d.id;
							d3.select('#' + id)
								.style('opacity', 1.0);

						})
						.on('mouseout', function(d, i) {
							d3.select(this)
								.style('fill', '#88a3ce');

							let id = d.id;
							d3.select('#' + id)
								.style('opacity', 0.4);
						});
				
				// map title
				svg.append('text')
					.text('Top 13 Visitors to Singapore')
					.attr('x', 20)
					.attr('y', 500)
					.style('z-index', 999)
					.style('font-size', 30)
					.style('text-decoration', 'underline');
		land.exit()
			.remove();
	});
}

// draw arrows arc
var singapore = {
	longitude: 103.8198,
	latitude: 1.3521
};

var tooltip = d3.tip()
				.offset([-10, 0])
				.attr('class', 'd3-tip')
				.html(function(d) {
					// console.log(d);
					let visitorArrival = d['Y' + year];
					let departure = d['O' + year];
					let percentage = (parseFloat(visitorArrival)/departure * 100).toFixed(2);

					// console.log(d);
					// console.log(visitorArrival);
					// console.log(departure);
					// console.log(percentage);

					let content = '<label>Visitor Arrivals: </label><br> ' + visitorArrival.toLocaleString('en') +'<br><br>';
					content += '<label>Departure No.: </label><br> '+ departure.toLocaleString('en')+'<br><br>';
					content += '<label>% Market Captured: </label> <div style="color:red;">' + percentage + '% </div><br>';
					return content;
				})
				// .style(' -webkit-transform', 'translate(0, 8em)')
				.style('transform', 'translate(-100%, 100%)');

var arcs = labels = d3.select('none');
plotArcsLabels();
function plotArcsLabels(){
	d3.csv('data/countries_location.csv', convertType, function(geoData) {
		
		// console.log(geoData);

		arcs = svg.selectAll('path')
					.data(geoData, JSON.stringify)
					.enter()
					.append('path')
					.attr('class', 'arc')
					.attr('id', function(d) {
						return d.id;
					})
					// shaping
					.attr('d', function(data) {
						return shapeArc(getCoordinates(data), singapore, trade=convertVisitorArrivalValue(data.Y2016));	
					})
					// css styling
					.style('fill', '#ff2323')
					.style('stroke', '#2b2b2b')
					.style('stroke-width', 1.5)
					.style('opacity', 0.4)
					.on('mouseover', function(d, i) {
						d3.select(this)
							.style('opacity', 1.0);
							// .attr('d', function(d) {
							// 	return shapeArc(getCoordinates(d), singapore, 30);
							// });
						// tooltip.show(d);
					})
					.on('mouseout', function(d, i) {
						d3.select(this)
							.style('opacity', 0.4);
							// .attr('d', function(d) {
							// 	return shapeArc(getCoordinates(d), singapore);
							// });
						// tooltip.hide();
					});

		labels = svg.selectAll('text')
			.data(geoData, JSON.stringify)
			.enter()
			.append('text')
			.style('cursor', 'pointer')
			.style('font-size', function(d) {
				let value = Math.pow(d['Y'+year], 0.21);
				// console.log(value);
				return parseInt(value);
			})
			.attr('x', function(d) {
				return _projection([d.longitude, d.latitude])[0];
				// console.log(d);
			})
			.attr('y', function(d) {
				return _projection([d.longitude, d.latitude])[1];
			})
			.text(function(d) {
				return d.country;
			})
			.on('mouseover', function(d, i) {
				let id = d.id;
				d3.select('#' + id)
					.style('opacity', 1.0);

				d3.select('#land' + id)
					.style('fill', '#c66b6b');

				tooltip.show(d);
			})
			.on('mouseout', function(d, i) {
				let id = d.id;
				d3.select('#' + id)
					.style('opacity', 0.4);

				d3.select('#land' + id)
					.style('fill', '#88a3ce');

				tooltip.hide();
			});

		// arcs.call(tooltip);
		labels.call(tooltip);

		arcs.exit()
			.remove();
	});
}
// draw magnifying lens
var lens = svg.append('circle')
				.attr('class', 'lens')
				.attr('r', fisheye.radius() * 3.85);

// fisheye zoom
svg.on('mousemove', function() {
	fisheye.center(_projection.invert(d3.mouse(this)));

	land.attr('d', null)
		.attr('d', pathGenerator);

	arcs.attr('d', function(d) {
		return shapeArc(getCoordinates(d, true), getCoordinates(singapore, true), trade=convertVisitorArrivalValue(d.Y2016));
	});

	labels.attr('x', function(d) {
				let coords = getCoordinates(d, true);
				return _projection([coords.longitude, coords.latitude])[0];
			})
			.attr('y', function(d) {
				let coords = getCoordinates(d, true);
				return _projection([coords.longitude, coords.latitude])[1];
			});

	lens.attr('cx', d3.mouse(this)[0])
		.attr('cy', d3.mouse(this)[1]);
});

$('#geomap_year').change(function() {
	year = $('#geomap_year').val();

	land.remove();
	labels.remove();
	arcs.remove();

	plotMap();
	plotArcsLabels();
});

/*

HELPER FUNCTIONS

*/

function convertVisitorArrivalValue(value) {
	return (value * 2) / 100000;
}

function getCoordinates(data, forFishEye=false) {
	if(forFishEye) {
		return {
			longitude: fisheye([data.longitude, data.latitude])[0],
			latitude: fisheye([data.longitude, data.latitude])[1]
		};
	} else {
		return {
			longitude: data.longitude,
			latitude: data.latitude
		};	
	}
}

function convertType(d) {
	return {
		country: d.country,
		latitude: parseFloat(d.latitude),
		longitude: parseFloat(d.longitude),
		id: d.id,
		Y2010: parseInt(d.Y2010),
		Y2011: parseInt(d.Y2011),
		Y2012: parseInt(d.Y2012),
		Y2013: parseInt(d.Y2013),
		Y2014: parseInt(d.Y2014),
		Y2015: parseInt(d.Y2015),
		Y2016: parseInt(d.Y2016),
		O2010: parseInt(d.O2010),
		O2011: parseInt(d.O2011),
		O2012: parseInt(d.O2012),
		O2013: parseInt(d.O2013),
		O2014: parseInt(d.O2014),
		O2015: parseInt(d.O2015)
	};
}

function shapeArc(from, to, trade=20) {
	var origin = _projection([from.longitude, from.latitude]);
	var dest = _projection([to.longitude, to.latitude]);
	var mid = [(origin[0] + dest[0]) / 2, (origin[1] + dest[1]) / 2];
	var curveoffset = 50;
	var midcurve = [(mid[0] + curveoffset), (mid[1] - curveoffset)];
	var scalar = Math.sqrt(
				Math.pow(dest[0], 2) - 2 * dest[0] * midcurve[0] +
				Math.pow(midcurve[0], 2) +
				Math.pow(dest[1], 2) - 2 * dest[1] * midcurve[1] +
				Math.pow(midcurve[1], 2)
			);
	var arrowpoint = [
				dest[0] - (0.5 * trade * (dest[0] - midcurve[0]) - trade * (dest[1] - midcurve[1])) / scalar,
				dest[1] - (0.5 * trade * (dest[1] - midcurve[1]) - trade * (-dest[0] + midcurve[0])) / scalar
			];

			// move cursor to origin
	return "M" + origin[0] + ',' + origin[1] 
			// smooth curve to offset midpoint
			+ "S" + midcurve[0] + "," + midcurve[1]
			//smooth curve to destination	
			+ "," + dest[0] + "," + dest[1]
			//straight line to arrowhead point
			+ "L" + arrowpoint[0] + "," + arrowpoint[1] 
			// straight line towards original curve along scaled orthogonal vector (creates notched arrow head)
			+ "l" + (0.5*trade*(-dest[1]+midcurve[1])/scalar) + "," + (0.5*trade*(dest[0]-midcurve[0])/scalar)
			// smooth curve to midpoint	
			+ "S" + (midcurve[0]) + "," + (midcurve[1]) 
			//smooth curve to origin	
			+ "," + origin[0] + "," + origin[1]
}