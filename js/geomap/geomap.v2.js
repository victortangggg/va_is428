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
	RADIUS = 50,
	POWER = 1.5;

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

var land = d3.select('nada');
d3.json('js/geomap/worldmap/world_map.json' /*'js/geomap/worldmap/land.geojson'*/, function(error, data) {

	if(error) {
		throw error;
	}

	land = svg.select('g.map')
					.selectAll('path.land')
					// .data([data])
					.data(data.features.filter(d => d.properties.iso_a3 !== 'ATA' && d.properties.iso_a3 !== 'GRL'))
					.enter()
					.append('path')
					.classed('land', true)
					.attr('d', pathGenerator)
	land.exit()
		.remove();
});

svg.on('mousemove', function() {
	fisheye.center(_projection.invert(d3.mouse(this)));
	land.attr('d', pathGenerator);
});