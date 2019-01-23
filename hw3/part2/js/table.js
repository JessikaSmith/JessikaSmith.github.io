/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(teamData, treeObject) {

        //Maintain reference to the tree Object;
        this.tree = null;

        // Create list of all elements that will populate the table
        // Initially, the tableElements will be identical to the teamData
        this.tableElements = null; //

        ///** Store all match data for the 2014 Fifa cup */
        this.teamData = teamData;

        //Default values for the Table Headers
        this.tableHeaders = ["Delta Goals", "Result", "Wins", "Losses", "TotalGames"];

        /** To be used when sizing the svgs in the table cells.*/
        this.cell = {
            "width": 70,
            "height": 20,
            "buffer": 15
        };

        this.bar = {
            "height": 20
        };

        /** Set variables for commonly accessed data columns*/
        this.goalsMadeHeader = 'Goals Made';
        this.goalsConcededHeader = 'Goals Conceded';

        /** Setup the scales*/
        this.goalScale = null;

        /** Used for games/wins/losses*/
        this.gameScale = null;

        /**Color scales*/
        /**For aggregate columns  Use colors '#ece2f0', '#016450' for the range.*/
        this.aggregateColorScale = null;

        /**For goal Column. Use colors '#cb181d', '#034e7b'  for the range.*/
        this.goalColorScale = null;
    }


    /**
     * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
     * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
     *
     */
    createTable() {

        // ******* TODO: PART II *******

        var table = d3.select('#matchTable');

        //Update Scale Domains

        var teamGoalsMax = this.teamData.reduce(function(i, j) {
            return i.value['Goals Made'] > j.value['Goals Made'] ? i : j;
        });

        var goalsMade = teamGoalsMax.value['Goals Made'];

        this.goalScale = d3.scaleLinear()
        .domain([0, goalsMade])
        .range([10, this.cell.width+30]);

        this.AxisScale = d3.scaleLinear()
          .domain([0, goalsMade])
          .range([0, this.cell.width+30]);

        var teamGamesMax = this.teamData.reduce(function(i, j) {
          return i.value['TotalGames'] > j.value['TotalGames'] ? i : j;
        });

        var totalGames = teamGamesMax.value['TotalGames'];

        this.gameScale = d3.scaleLinear()
          .domain([0, totalGames])
          .range([0, this.cell.width]);

        this.colorScale = d3.scaleLinear()
          .domain([0, totalGames])
          .range([d3.rgb("#ece2f0"), d3.rgb('#016450')]);

        // Create the x axes for the goalScale.
        var xAxis = d3.axisBottom(this.AxisScale);

        d3.select('#goalHeader').append('svg')
          .attr('width', this.cell.width+40)
          .attr('height', this.cell.height)
          .append('g')
          .style('font', '8px sans-serif')
          .attr('transform', 'translate(' + 5 + ',' + 5 + ')')
          .call(xAxis);


        //add GoalAxis to header of col 1.
        this.tableElements = this.teamData.slice(0);
        this.open_row = [];
        var sortAscending = false;
        var headers = d3.select('thead').select('.head').selectAll('td');


        // ******* TODO: PART V *******

        // Set sorting callback for clicking on headers

        // Clicking on headers should also trigger collapseList() and updateTable().


    }


    /**
     * Updates the table contents with a row for each element in the global variable tableElements.
     */
    updateTable() {
        // ******* TODO: PART III *******
        console.log(this.tableElements);

        //Create table rows
        var body = d3.select('tbody');
        var tr = body.selectAll('tr')
            .data(this.tableElements, function(d){
              console.log(d);
                return d;
            })
            .enter()
            .append('tr')
            .attr('class', 'row')
            .on('click', function(d, i){
                //console.log(i)
                if (d.value.type == 'aggregate'){
                    self.updateList(d, i);
                }
            })

        //Append th elements for the Team Names


        //Append td elements for the remaining columns.
        //Data for each cell is of the type: {'type':<'game' or 'aggregate'>, 'value':<[array of 1 or two elements]>}

        var td = body.selectAll('tr').selectAll('td');
        td.data(function(row){
          var name = {'open': false, 'type': row.value.type, 'vis': 'text1', 'value': row.key};
          var goals = {'type': row.value.type, 'vis': 'goal', 'value': {'made': row.value['Goals Made'], 'conc': row.value['Goals Conceded']}};
          var res = {'type': row.value.type, 'vis': 'text2', 'value': row.value.Result.label};
          var win = {'type': row.value.type, 'vis': 'bar', 'value': row.value.Wins};
          var lose = {'type': row.value.type, 'vis': 'bar', 'value': row.value.Losses};
          var total = {'type': row.value.type, 'vis': 'bar', 'value': row.value.TotalGames};
          return [name, goals, res, win, lose, total];
        })
          .enter()
          .append('td');

        //Add scores as title property to appear on hover

        //Populate cells (do one type of cell at a time )

        //Create diagrams in the goals column

        //Set the color of all games that tied to light gray



    };

    /**
     * Updates the global tableElements variable, with a row for each row to be rendered in the table.
     *
     */
    updateList(i) {
        // ******* TODO: PART IV *******

        //Only update list for aggregate clicks, not game clicks

    }

    /**
     * Collapses all expanded countries, leaving only rows for aggregate values per country.
     *
     */
    collapseList() {

        // ******* TODO: PART IV *******

    }


}
