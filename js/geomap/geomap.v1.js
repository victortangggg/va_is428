var svg,
	width = window.innerWidth - 20,
	height = window.innerHeight;

var projection = d3.geoMercator()
					.center([0, 30])
					.scale([width / (2 * Math.PI)])
					.translate([(width / 2), (height / 2)]);


var path = d3.geoPath()
				.projection(projection);

var svg = d3.select('#geomap')
			.append('svg')
			.attr('width', width)
			.attr('height', height);
			/*.append('g');*/

var fisheye = d3.fisheye.circular()
						.radius(200)
						.distortion(2);

d3.json('js/geomap/worldmap/world_map.json', function(error, world) {
	if(error) {
		console.log(error);
	}

	var land = svg.selectAll('path')
		// world topo data excluding Antarctica & Greenland
		.data(world.features.filter(d => d.properties.iso_a3 !== 'ATA' && d.properties.iso_a3 !== 'GRL'))
		.enter()
		.append('path')
		.attr("class", "land")
		.attr("d", path)
		.attr('stroke-width', 1.5)
		.attr('stroke', '#ffffff')
		.on('mouseover', function(d) {
			let id = d.properties.sovereignt.split(' ').join('');
			d3.select('#'+id)
				.style('opacity', 1.0)
				.attr('d', function(d) {
					return shapeArc(d.longitude, d.latitude, 30);
				});
		})
		.on('mouseout', function(d) {
			let id = d.properties.sovereignt.split(' ').join('');
			d3.select('#'+id)
				.style('opacity', 0.3)
				.attr('d', function(d) {
					return shapeArc(d.longitude, d.latitude, 10);
				});
		})
		.append("rect")
		.attr("fill", "none")
		.attr("pointer-events", "all")
		.attr("width", width)
		.attr("height", height);

	drawArcs(svg, world);

	svg.on('mousemove', function() {
		fisheye.focus(d3.mouse(this));

		land.each(function(d) {
			d.fisheye - fisheye(d);
		})
		.attr('d', function(d) {
			
		});

	});
});


/*

HELPER FUNCTIONS

*/


function drawArcs(svg, world) {

	function convertType(d) {
		return {
			country: d.country,
			latitude: parseFloat(d.latitude),
			longitude: parseFloat(d.longitude)
		};
	}

	d3.csv('data/countries_location.csv', convertType, function(geoData) {

		var arcs = svg.append('g')
						.selectAll('path')
						.data(geoData, JSON.stringify)
						.enter()
						.append('path')
						.attr('class', 'arc')
						.attr('id', function(data) {
							return data.country.split(' ').join('');
						})
						.attr('d', function(data) {
							return shapeArc(data.longitude, data.latitude, 10);	
						})
						.on('mouseover', function(d, i) {
							d3.select(this)
								.style('opacity', 1.0)
								.attr('d', function(d) {
									return shapeArc(d.longitude, d.latitude, 30);
								});
						})
						.on('mouseout', function(d, i) {
							d3.select(this)
								.style('opacity', 0.3)
								.attr('d', function(d) {
									return shapeArc(d.longitude, d.latitude, 10);
								});
						});
	});
	
}

function shapeArc(longitude, latitude, trade) {
	var origin = projection([longitude, latitude]);
	var dest = projection([103.8198, 1.3521]);
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