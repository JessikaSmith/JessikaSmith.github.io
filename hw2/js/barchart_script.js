// const columns = [
//     { head: 'Name', cl: 'center', html: f('Name') },
//     { head: 'Continent', cl: 'center', html: f('Continent') },
//     { head: 'GDP', cl: 'right', html: f('GDP', d3.format(',.2s')) },
//     { head: 'Life Expectancy', cl: 'right', html: f('Life Expectancy', d3.format('.1f')) },
//     { head: 'Population', cl: 'right', html: f('Population', d3.format(',.0f')) },
//     { head: 'Year', cl: 'right', html: f('Year', d3.format('.0f')) }
// ];

function colors(n) {
  var colores_g = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
  return colores_g[n % colores_g.length];
}

// get information from nested json
function prepare_columns(columns){
  console.log(columns);
  return columns.map(function (t){
    return{
      'Name': t.name,
      'Continent': t.continent,
      'Years': t.years.map(function (y){
        return{
          'GDP': y.gdp,
          'Life Expectancy': y.life_expectancy,
          'Population': y.population,
          'Year': y.year
        }
      })
      };
    });
  };

  function getYear(data, year){
    var y = d3.select('input[type=range]').node().valueAsNumber;
    if (data === undefined) {
      data = tableData;
    }
    if (year === undefined) {
      year = y;
    }
    return data.map(function (t) {
      return {
          'Name': t.Name,
          'Continent': t.Continent,
          'GDP': t.Years[year-1995]['GDP'],
          'Life Expectancy': t.Years[year-1995]['Life Expectancy'],
          'Population': t.Years[year-1995]['Population'],
          'Year': year
      }
    });
  }

function initBarchartVars(data){
  margin = {top: 50, bottom: 10, left:300, right: 40};
  textW = 200;
  barH = 20;
  width = 900 - margin.left - margin.right;
  height = barH*data.length - margin.top - margin.bottom;
  xScale = d3.scaleLinear().range([0, width]);
  yScale = d3.scaleBand().rangeRound([0, height], .8, 0);
  svg = d3.select("body").append("svg")
              .attr("width", width+margin.left+margin.right)
              .attr("height", height+margin.top+margin.bottom);
};

function initBarchart(data){
  initBarchartVars(data);
  var encoder = d3.select('input[name=encoder]:checked').node().value;
  max = d3.max(data, function(d){
      return d[encoder];
  });
  min = 0;
  xScale = d3.scaleLinear().domain([0, max])
      .range([textW, width]);

  // Add normal length
  yScale = d3.scaleBand().range([0, data.length*barH]);
  svg.attr('height', yScale.range()[1]+25+'px');
  yAxis = d3.axisLeft()
    .scale(yScale);

  svg.append("g")
    .call(yAxis);
  var bar = svg.selectAll('g')
   .data(data)
   .enter()
   .append('g')
   .attr('transform', function(d, i) {
      return "translate(0," + i * barH + ")";
    });

   bar.append('rect').transition().duration(1000)
       .attr('width', function(d) {
         return xScale(d[encoder]); })
       .attr('height',  barH - 1)
       .attr('x', 150);
       // .attr('fill', function(d){
       //   return colors(d[encoder], max);
       // });

   bar.append('text')
       .text(function(d){
           return d['Name'];
       })
       .attr('y', function(d, i){
           return i + 9;
       })
       .attr('class', 'lable');

    var t = d3.selectAll('rect');
    t.attr("fill", function(d, i) {
      return colors(i);
    });
}

function updateBarchart(data){
  initBarchartVars(data);

}

var url = "http://localhost:8000/json_files/data.json"
d3.json(url, function(error, data){
  barchartData = prepare_columns(data);
  yearsData = getYear(barchartData);
  initBarchart(yearsData);
});
