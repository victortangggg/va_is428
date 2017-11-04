var width = window.innerWidth,
	height = window.innerHeight;

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
					.translate([width/2, height/2]);

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
					.translate([width/2, height/2]);

var pathGenerator = d3.geoPath()
						.projection(projection);

var geoJson1 = 'js/geomap/worldmap/world_map.json';
var geoJson2 = 'js/geomap/worldmap/land.geojson';
var geoJson3 = 'js/geomap/worldmap/countries.geo.json';

//draw geo map
var land;
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
					// shaping
					.attr('d', pathGenerator)
					// css styling
					.style('fill', '#88a3ce')
					.style('stroke', '#ffffff')
					.style('stroke-width', 1)
					.on('mouseover', function(d, i) {
						d3.select(this)
							.style('fill', '#c66b6b');
					})
					.on('mouseout', function(d, i) {
						d3.select(this)
							.style('fill', '#88a3ce');
					});
	land.exit()
		.remove();
});

// draw arrows arc
var singapore = {
	longitude: 103.8198,
	latitude: 1.3521
};

var arcs;
d3.csv('data/countries_location.csv', convertType, function(geoData) {

	arcs = svg.selectAll('path')
				.data(geoData, JSON.stringify)
				.enter()
				.append('path')
				.attr('class', 'arc')
				// shaping
				.attr('d', function(data) {
					return shapeArc(getCoordinates(data), singapore, 10);	
				})
				// css styling
				.style('fill', '#ff2323')
				.style('stroke', '#2b2b2b')
				.style('stroke-width', 0.5)
				.style('opacity', 0.4)
				.on('mouseover', function(d, i) {
					d3.select(this)
						.style('opacity', 1.0)
						.attr('d', function(d) {
							return shapeArc(getCoordinates(d), singapore, 30);
						});
				})
				.on('mouseout', function(d, i) {
					d3.select(this)
						.style('opacity', 0.4)
						.attr('d', function(d) {
							return shapeArc(getCoordinates(d), singapore, 10);
						});
				});
	arcs.exit()
		.remove();
});

var lens = svg.append('circle')
				.attr('class', 'lens')
				.attr('r', fisheye.radius() * 3.85);

// fisheye zoom
svg.on('mousemove', function() {
	fisheye.center(_projection.invert(d3.mouse(this)));
	land.attr('d', null)
		.attr('d', pathGenerator);
	arcs.attr('d', function(d) {
		return shapeArc(getCoordinates(d, true), getCoordinates(singapore, true));
	});
	lens.attr('cx', d3.mouse(this)[0])
		.attr('cy', d3.mouse(this)[1]);
});

/*

HELPER FUNCTIONS

*/

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
		longitude: parseFloat(d.longitude)
	};
}

function shapeArc(from, to, trade=10) {
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