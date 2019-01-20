/** Class implementing the bar chart view. */
class BarChart {

    /**
     * Create a bar chart instance and pass the other views in.
     * @param worldMap
     * @param infoPanel
     * @param allData
     */
    constructor(worldMap, infoPanel, allData) {
        this.worldMap = worldMap;
        this.infoPanel = infoPanel;
        this.allData = allData;
    }

    clearBarchart(){
      d3.select("svg")
        .selectAll("g")
        .remove()
      d3.selectAll('.axis')
        .remove()
    }
    /**
     * Render and update the bar chart based on the selection of the data type in the drop-down box
     */
    updateBarChart(selectedDimension) {

        // ******* TODO: PART I *******


        // Create the x and y scales; make
        // sure to leave room for the axes

        var years = this.allData.map(function(d){
            return d.year;
        })

        var w = d3.select("#barChart").attr("width");
        var h = d3.select("#barChart").attr("height");
        var margin = {top: 5, right: 5, bottom: 50, left: 55};
        var svg = d3.select('#barChart')
          .attr('width', w)
          .attr('height', h)
          .attr('transform', 'translate(' + margin.right + ',' + margin.top + ')');

        var yearScale = d3.scaleBand()
          .domain(years)
          .range([0, (w-margin.left-margin.right)])
          .paddingInner(0.1);


        // ******* TODO: PART II *******

        // Implement how the bars respond to click events
        // Color the selected bar to indicate is has been selected.
        // Make sure only the selected bar has this new color.

        // Call the necessary update functions for when a user clicks on a bar.
        // Note: think about what you want to update when a different bar is selected.

    }

    /**
     *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
     *
     *  There are 4 attributes that can be selected:
     *  goals, matches, attendance and teams.
     */
    chooseData() {
        // ******* TODO: PART I *******
        //Changed the selected data when a user selects a different
        // menu item from the drop down.
        this.clearBarchart()
        this.updateBarchart(selectedDimension)

    }
}
