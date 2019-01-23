/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(teamData, treeObject) {

        //Maintain reference to the tree Object;
        this.tree = treeObject;

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
        self = this;

        //Update Scale Domains
        var teamGoalsMax = this.teamData.reduce(function(i, j) {
            return i.value['Goals Made'] > j.value['Goals Made'] ? i : j;
        });

        var goalsMade = teamGoalsMax.value['Goals Made'];

        var teamGamesMax = this.teamData.reduce(function(i, j) {
          return i.value['TotalGames'] > j.value['TotalGames'] ? i : j;
        });

        var totalGames = teamGamesMax.value['TotalGames'];

        this.goalScale = d3.scaleLinear()
        .domain([0, goalsMade])
        .range([10, this.cell.width+30]);

        this.AxisScale = d3.scaleLinear()
          .domain([0, goalsMade])
          .range([0, this.cell.width+30]);

        this.gameScale = d3.scaleLinear()
          .domain([0, totalGames])
          .range([0, this.cell.width]);

        window.gameScale = d3.scaleLinear()
          .domain([0, totalGames])
          .range([0, this.cell.width]);

        window.colorScale = d3.scaleLinear()
          .domain([0, totalGames])
          .range([d3.rgb("#ece2f0"), d3.rgb('#016450')]);

        // Create the x axes for the goalScale.
        var xAxis = d3.axisBottom(this.AxisScale);

        //add GoalAxis to header of col 1.
        d3.select('#goalHeader').append('svg')
          .attr('width', this.cell.width+40)
          .attr('height', this.cell.height)
          .append('g')
          .style('font', '8px sans-serif')
          .attr('transform', 'translate(' + 5 + ',' + 5 + ')')
          .call(xAxis);

        // ******* TODO: PART V *******

        // Set sorting callback for clicking on headers
        // Clicking on headers should also trigger collapseList() and updateTable().

        window.tableElements = this.teamData.slice(0);
        window.data = tableElements
        window.open_row = [];
        var sortAscending = false;
        var headers = d3.select('thead').select('.head').selectAll('td');
        headers.on("click", function(){
        self.collapseList(); //check

                var temp = data;
                console.log(temp)
                var dn = d3.select(this).text();
                temp.sort(function(a, b) {
                    if (dn == 'Team'){
                        if (sortAscending){
                            return d3.ascending(a.key, b.key)
                        } else {
                            return d3.descending(a.key, b.key)
                        }
                    }
                    if (dn == 'Wins'){
                        if (sortAscending){
                            return d3.ascending(a.value.Wins, b.value.Wins)
                        } else {
                            return d3.descending(a.value.Wins, b.value.Wins)
                        }
                    }
                    if (dn == 'Losses'){
                        if (sortAscending){
                            return d3.ascending(a.value.Losses, b.value.Losses)
                        } else {
                            return d3.descending(a.value.Losses, b.value.Losses)
                        }
                    }
                    if (dn == 'Total Games'){
                        if (sortAscending){
                            return d3.ascending(a.value.TotalGames, b.value.TotalGames)
                        } else {
                            return d3.descending(a.value.TotalGames, b.value.TotalGames)
                        }
                    }
                    if (dn == ' Goals '){
                        if (sortAscending){
                            return d3.ascending((a.value['Delta Goals']), (b.value['Delta Goals']))
                        } else {
                            return d3.descending((a.value['Delta Goals']), (b.value['Delta Goals']))
                        }
                    }
                    if (dn == 'Round/Result'){
                        if (sortAscending){
                            return d3.ascending(a.value.Result.ranking, b.value.Result.ranking)
                        } else {
                            return d3.descending(a.value.Result.ranking, b.value.Result.ranking)
                        }
                    }
                });
                sortAscending = !sortAscending;
                data = temp;
                self.updateTable();
        })
    }


    /**
     * Updates the table contents with a row for each element in the global variable tableElements.
     */
    updateTable() {
        // ******* TODO: PART III *******
        var self = this;

        //Create table rows
        var body = d3.select('tbody');

        var tr_prev = body.selectAll('tr')
          .data(data, function(d){
            return d;
          })
          .attr('class', 'row');

        var tr = body.selectAll('tr')
            .data(data, function(d){
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
            .on('mouseover', function(d){
              self.tree.updateTree(d);
            })
            .on('mouseout', function(d){
              self.tree.clearTree(d);
            })
        var tt = body.selectAll('tr')
          .data(data);
        tt.exit()
          .remove();

        //Append th elements for the Team Names


        //Append td elements for the remaining columns.
        //Data for each cell is of the type: {'type':<'game' or 'aggregate'>, 'value':<[array of 1 or two elements]>}

        var td = body.selectAll('tr').selectAll('td');
        td.data(function(row){
          var name = {'open': false, 'type': row.value.type, 'vis': '1', 'value': row.key};
          var goals = {'type': row.value.type, 'vis': '4', 'value': {'made': row.value['Goals Made'], 'conc': row.value['Goals Conceded']}};
          var res = {'type': row.value.type, 'vis': '2', 'value': row.value.Result.label};
          var win = {'type': row.value.type, 'vis': '3', 'value': row.value.Wins};
          var lose = {'type': row.value.type, 'vis': '3', 'value': row.value.Losses};
          var total = {'type': row.value.type, 'vis': '3', 'value': row.value.TotalGames};
          return [name, goals, res, win, lose, total];
        })
          .enter()
          .append('td');

        //Add scores as title property to appear on hover

        //Populate cells (do one type of cell at a time )

        //Create diagrams in the goals column

        var gs = this.goalScale
        var g = this.gameScale

        //Set the color of all games that tied to light gray
        var vis = ['1', '2', '3', '4'];
        for (var i in vis){
          var type = body.selectAll('tr')
            .selectAll('td')
            .filter(function(d){
              return d.vis == vis[i];
            })
          switch(vis[i]){
            case '1':{
              type.text(function(d){
                return d.type == 'aggregate' ? d.value : ('x' + d.value);
              })
              .style('color', function(d){
                return d.type == 'aggregate' ? 'black' : 'gray';
              })
              break;
            }
            case '2':{
              type.text(function(d){
                return d.value;
              })
              break;
            }
            case '3':{
              type.select('svg').remove();
              var bar = type.append('svg')
                .attr('width', this.cell.width)
                .attr('height', this.cell.height);
              bar.append('rect')
                .attr('height', this.cell.height)
                .attr('width', function(d){
                  var val = g(d.value)
                  return val;
                })
                .attr('fill', function(d){
                  return colorScale(d.value);
                })
              bar.append('g')
                .append('text')
                .text(function(d){
                  return d.value;
                })
                .attr('text-anchor', 'end')
                .attr('fill', 'white')
                .attr('dy', '14px')
                .attr('dx', '10px')
            break;
            }
            case '4':{
              type.select('svg').remove();
              var goal = type.append('svg')
                .attr('width', this.cell.width + 100)
                .attr('height', this.cell.height)
              goal.append('rect')
                .attr('x', function(d){
                  console.log(d.value.made);
                  return gs(Math.min(d.value.made, d.value.conc));
                })
                .attr('y', function(d){
                  return d.type == 'aggregate' ? 5 : 8;
                })
                .attr('width', function(d){
                  return Math.abs(gs(d.value.made) - gs(d.value.conc))
                })
                .attr('height', function(d){
                  return d.type == 'aggregate' ? 10 : 3;
                })
                .attr('fill', function(d){
                  return (d.value.made > d.value.conc) ? '#363377' : '#AA3939';
                })
              goal.append('circle')
                .attr('cx', function(d){
                  return gs(d.value.made);
                })
                .attr('cy', this.cell.height/2)
                .attr('r', '5')
                .attr('class', function(d){
                  return d.type == 'aggregate' ? 'mg_l' : 'mg_r'
                })
              goal.append('circle')
                .attr('cx', function(d){
                  return gs(d.value.conc);
                })
                .attr('cy', this.cell.height/2)
                .attr('r', '5')
                .attr('class', function(d){
                  if (d.value.made == d.value.conc)
                    return d.type == 'aggregate' ? 'grey' : 'grey_f';
                  return d.type == 'aggregate' ? 'cg_l' : 'cg_r';
                })
              break;
            }
          }
        }

    };

    /**
     * Updates the global tableElements variable, with a row for each row to be rendered in the table.
     *
     */
    updateList(i, index) {
        // ******* TODO: PART IV *******

        //Only update list for aggregate clicks, not game clicks
        if (i.type == 'game'){
          this.updateTable();
        }
        else{
          if (open_row.indexOf(i.value) == -1){
            open_row.push(i.value);
            var began = data.slice(0,(index+1));
            var games = data[index].value.games;
            var end = data.slice((index+1))
          }
          else
          {
            open_row.splice(open_row.indexOf(i.value), 1);
            var began = data.slice(0,(index+1));
            var games_number = data[index].value.games.length;
            console.log(games_number)
            var games = [];
            var end = data.slice((index+games_number+1))
          }
          data = began.concat(games, end);
          this.updateTable();
        }

    }

    /**
     * Collapses all expanded countries, leaving only rows for aggregate values per country.
     *
     */
    collapseList() {

        // ******* TODO: PART IV *******
        data = tableElements;
        this.updateTable();

        }


}
