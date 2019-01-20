// const columns = [
//     { head: 'Name', cl: 'center', html: f('Name') },
//     { head: 'Continent', cl: 'center', html: f('Continent') },
//     { head: 'GDP', cl: 'right', html: f('GDP', d3.format(',.2s')) },
//     { head: 'Life Expectancy', cl: 'right', html: f('Life Expectancy', d3.format('.1f')) },
//     { head: 'Population', cl: 'right', html: f('Population', d3.format(',.0f')) },
//     { head: 'Year', cl: 'right', html: f('Year', d3.format('.0f')) }
// ];

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
    console.log(data);
    console.log(year);
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
  width = 900 - margin.left - margin.right;
  height = 900 - margin.top - margin.bottom;

  xScale = d3.scaleLinear().range([0, width]);
  yScale = d3.scaleBand().rangeRound([0, height], .8, 0);
  svg = d3.select("body").append("svg")
              .attr("width", width+margin.left+margin.right)
              .attr("height", height+margin.top+margin.bottom);
  console.log(d3.select('input[name=encoder]:checked'));
  var encoder = d3.select('input[name=encoder]:checked').node().value;

  max = d3.max(data, function(d){
                  return d[encoder];
              })
  min = 0;
  xScale.domain([min, max]);
  yScale.domain(data.map(function(d){
    return d.name;
  }));

}

function initBarchart(data){
  initBarchartVars(data);
  yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .tickSize(0,0);
  svg.append("g")
    .call(yAxis);
  var bar = svg.selectAll('g')
           .data(data)
       .enter().append('g')
           .attr('transform', function(d, i) { return "translate(0," + i * bar_height + ")"; });

   bar.append('rect').transition().duration(1000)
       .attr('width', function(d) { return xScale(d.population); })
       .attr('height', bar_height - 1)
       .attr('x', 150)
       .attr('fill', function(d) { return getRandomColor(d.population, max); });

   bar.append('text')
       .text(function(d){
           return d.name;
       })
       .attr('y', function(d, i){
           return i + 9;
       })
       .attr('class', 'lable');
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
