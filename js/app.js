/**
 * Main function.
 * Loads data from JSON.
 * Defines D3 templates and interactions
 * @public
 * @function
 */
function runApp() {
    // Currently we use whole window
    var width = window.innerWidth,
        height = window.innerHeight;

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    var force = d3.layout.force()
        .gravity(0.05)
        .distance(100)
        .charge(-100)
        .size([width, height]);
    // Request data from json
    d3.json("votes2015.json", function(error, json) {
        if (error) throw error;

        force
            .nodes(json.nodes)
            .links(json.links)
            .start();

        var link = svg.selectAll(".link")
            .data(json.links)
            .enter().append("line")
            .attr("class", "link")
            .attr('marker-end','url(#arrowhead)');

        var node = svg.selectAll(".node")
            .data(json.nodes)
            .enter().append("g")
            .attr("class", "node")
            .call(force.drag);

        // Uncomment if simple circles are needed (then comment country flag)
        // node.append("circle")
        //     .attr("r", 15);

        node.append("image")
            .attr("xlink:href", function(d) { return "./images/country_flags/" + d.country + ".png"; })
            .attr("x", -15)
            .attr("y", -15)
            .attr("width", 30)
            .attr("height", 30);
        // Node labels
        node.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")
            .text(function(d) { return d.country });

            node.append("title")
                .text(function(d) { return d.country; });
        // Arrows
        svg.append('defs').append('marker')
            .attr({'id':'arrowhead',
                'viewBox':'-0 -5 10 10',
                'refX':25,
                'refY':0,
                'orient':'auto',
                'markerWidth':10,
                'markerHeight':8,
                'xoverflow':'visible'})
            .append('svg:path')
            .attr('d', 'M 0,-3 L 10 ,0 L 0,3')
            .attr('fill', 'rgb(67, 86, 192)')
            .attr('stroke','rgb(67, 86, 192)');

        force.on("tick", function() {
            link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        });
    });
}