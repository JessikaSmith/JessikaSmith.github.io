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

    /**
     * Render and update the bar chart based on the selection of the data type in the drop-down box
     */
    updateBarChart(selectedDimension) {

        // ******* TODO: PART I *******


        // Create the x and y scales; make
        // sure to leave room for the axes

        // sorting data by the year in ascending order
        this.allData.sort(function(x, y){
           return d3.ascending(x.year, y.year);
        })

        var year = this.allData.map(function(d){
            return d.year;
        })

        window.selectedDimension = selectedDimension;
        console.log(selectedDimension)
        console.log(this.allData);
        var w = d3.select("#barChart").attr("width");
        var h = d3.select("#barChart").attr("height");
        var margin = {top: 50, right: 10, bottom: 50, left: 60};
        var svg = d3.select('#barChart')
          .attr('width', w)
          .attr('height', h)
          .attr('transform', 'translate(' + margin.right + ',' + margin.top + ')');

        var xScale = d3.scaleBand()
          .domain(year)
          .range([0, (w-margin.left-margin.right)])
          .paddingInner(0.2);

        var maxVal = d3.max(this.allData, function(d){
          return d[selectedDimension];
        })
        var yScale = d3.scaleLinear()
          .domain([0, maxVal])
          .range([(h-margin.top-margin.bottom), 0]);
        var yW = xScale.bandwidth();
        var xAxis = d3.axisBottom(xScale);
        var yAxis = d3.axisLeft(yScale);

        // set text aligning
        svg.select('#xAxis')
          .attr('transform', 'translate(' + margin.left + ',' + (h-margin.top-margin.bottom) + ')')
          .call(xAxis)
          .selectAll('text')
          .style("text-anchor", "end")
          .attr("dx", "-12px")
          .attr("dy", "-5px")
          .attr("transform", "rotate(-90)" );

        svg.select('#yAxis')
            .attr('transform', 'translate(' + margin.left + ',' + 0 + ')')
            .call(yAxis);

        window.color = d3.scaleLinear()
            .domain([0, maxVal])
            .range([d3.rgb("#95B4E2"), d3.rgb('#092D62')]);

        d3.select('.selected')
          // classed for css add/removal
          .classed('selected', false)
          .classed('bar', true)
          .style('fill', function(d){
            return color(d[selectedDimension])
          });

        var bars = svg.select('#bars').selectAll('rect.bar')
          .data(this.allData)
          .enter().append('rect')
          .attr('class', 'bar')
          .attr('width', yW)
          .attr('height', function(d){ return h-margin.top-margin.bottom - yScale(d[selectedDimension]); })
          .attr('x', function(d){ return (margin.left + xScale(d.year));})
          .attr('y', function(d){ return xScale(d[selectedDimension]); })
          .style('fill', function(d){ return color(d[selectedDimension])})
          .on("click", barChart.chooseData)

        // d3.select('.selected')
        //   .classed('bar', false)
        //   .classed('selected', true)
        //   .style('fill','#06B900');

        var old_bars = svg.select('#bars').selectAll('rect.bar')
          .transition().duration(350)
          .attr('class', 'bar')
          .attr('width', yW)
          .attr('height', function(d){ return h-margin.top-margin.bottom - yScale(d[selectedDimension]); })
          .attr('x', function(d){ return (margin.left + xScale(d.year));})
          .attr('y', function(d){ return yScale(d[selectedDimension]); })
          .style('fill', function(d){ return color(d[selectedDimension])});
    }

    /**
     *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
     *
     *  There are 4 attributes that can be selected:
     *  goals, matches, attendance and teams.
     */
    chooseData(d) {
        // ******* TODO: PART I *******
        //Changed the selected data when a user selects a different
        // menu item from the drop down.
        infoPanel.updateInfo(d);
        worldMap.updateMap(d);
        console.log(d[selectedDimension])
        d3.select('.selected')
          // classed for css add/removal
          //.classed('bar', true)
          .classed('selected', false)
          .style('fill', function(d){
            return color(d[selectedDimension])
          });

        d3.select(this)
          .classed('bar', false)
          .classed('selected', true)
          .style('fill','#06B900');

    }
}
