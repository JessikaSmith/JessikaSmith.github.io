/** Class implementing the map view. */
class Map {
    /**
     * Creates a Map Object
     */
    constructor() {
        window.projection = d3.geoConicConformal().scale(150).translate([400, 350]);
    }

    /**
     * Function that clears the map
     */
    clearMap() {

        // ******* TODO: PART V*******
        // Clear the map of any colors/markers; You can do this with inline styling or by
        // defining a class style in styles.css

        // Hint: If you followed our suggestion of using classes to style
        // the colors and markers for hosts/teams/winners, you can use
        // d3 selection and .classed to set these classes on and off here.

        var color = d3.select('#map').selectAll('.countries');
        color.attr('class', 'countries')
        color.classed('host', false);
        color.classed('team', false);
        color.classed('countries', true);
        d3.selectAll('#mapguys').remove();

    }

    /**
     * Update Map with info for a specific FIFA World Cup
     * @param wordcupData the data for one specific world cup
     */
    updateMap(worldcupData) {

        //Clear any previous selections;
        this.clearMap();

        // ******* TODO: PART V *******

        // Add a marker for the winner and runner up to the map.

        // Hint: remember we have a conveniently labeled class called .winner
        // as well as a .silver. These have styling attributes for the two
        // markers.

        // Iterate through all participating teams and change their color as well.

        // We strongly suggest using CSS classes to style the selected countries.

        // Select the host country and change it's color accordingly.

        var teams = worldcupData.teams_iso;
        var teamsList = worldcupData.TEAM_LIST.split(',');
        var name = worldcupData.TEAM_NAMES.split(',');
        var winner = worldcupData.winner;
        var i = name.indexOf(winner);
        var win = '#' + teamsList[i];

        var host = '#' + worldcupData.host_country_code;
        var color = d3.select('#map').select(host)
            .attr('class', 'countries host');
        for (i in teamsList){
            var col = d3.select(('#' + teamsList[i]))
                .classed('team', true);
        }

        // Add a marker for gold/silver medalists
        d3.select('#map').selectAll('circle')
          .data([worldcupData.WIN_LON, worldcupData.WIN_LAT]).enter().append("circle")
          .attr("r", '5px')
          .attr('class', 'gold')
          .attr('id', 'mapguys')
          .attr("transform", function(d) {
            return "translate(" +
            projection([worldcupData.WIN_LON, worldcupData.WIN_LAT]) + ")";
          });
        d3.select('#map').append("circle")
          .attr("r", '5px')
          .attr('class', 'silver')
          .attr('id', 'mapguys')
          .attr("transform", function(d) {
            return "translate(" +
            projection([worldcupData.RUP_LON, worldcupData.RUP_LAT]) + ")";
            });
    }

    /**
     * Renders the actual map
     * @param the json data with the shape of all countries
     */
    drawMap(world) {

        //(note that projection is a class member
        // updateMap() will need it to add the winner/runner_up markers.)

        // ******* TODO: PART IV *******

        // Draw the background (country outlines; hint: use #map)
        // Make sure and add gridlines to the map

        console.log(world)
        var geoPath = d3.geoPath()
            .projection(projection);
        var g = d3.select('#map')
            .attr('width', 1000)
            .attr('height', 500);

        // Hint: assign an id to each country path to make it easier to select afterwards
        // we suggest you use the variable in the data element's .id field to set the id

        g.selectAll('path')
            .data(topojson.feature(world, world.objects.countries).features)
            .enter()
            .append('path')
            .attr('class', 'countries')
            .attr('id', function(d){
                return d.id;})
            .attr('d', geoPath);

        g.append('path')
            .datum(d3.geoGraticule().stepMinor([10, 10]))
            .attr('id', 'grid')
            .attr('class', 'painting')
            .attr('d', geoPath);

    }


}
