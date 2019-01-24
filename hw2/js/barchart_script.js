// #95d261 - Asia
// #64b7e7 - Africa
// #ed942e - America
// #ab40e8 - Oceania
// #ed2a1b - Europe

// class Barchart{
//
// }


colores_g = ["#95d261", "#64b7e7", "#ed942e", "#ab40e8", "#ed2a1b"]
function colors(n) {
  var colores_g = ["#95d261", "#64b7e7", "#ed942e", "#ab40e8", "#ed2a1b"];
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

  function filterRows(data){
    console.log('Filter was called!');
    if (data === undefined) {
          data = getYear(barchartData, 2000);
      }
    cb = [];
    d3.selectAll("input[type=checkbox]").each(function(d){
      this_selected = d3.select(this)
      if (this_selected.property("checked")){
        cb.push(this_selected.property("value"));
      }
    });
    if (cb.length > 0){
      filteredData = data.filter(function(d, i){
        return cb.includes(d.Continent);
      })
    }
    else {
      filteredData = data;
    }
    return filteredData;
  }

  function getYear(data, year){
    var y = d3.select('input[type=range]').node().valueAsNumber;
    if (data === undefined) {
      data = barchartData;
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

function aggregator(data) {
  if (data === undefined) {
    data = getYear(BarchartData, 2000);
  }
  var agg = d3.select('input[name="aggregate"]:checked').node().value;
  var n = 0;
  if (agg == "Continent"){
    nests = d3.nest()
    .key(function (d){
      return d.Continent
    })
    .rollup(function(d){
      return{
        'Country': d[0].Continent,
        'Continent': d[0].Continent,
        'GDP': d3.sum(d, function(g){
          return +g.GDP;
        }),
        'Life Expectancy': d3.mean(d, function(g){
          return +g['Life Expectancy'];
        }),
        'Population': d3.sum(d, function (g){
          return +g.Population;
        }),
        'Year': d[0].Year
      };
    })
    .entries(data);
    arr = function (d){
      var tmp = [];
      for (let i = 0; i < d.length; i++){
        tmp.push(d[i].value)
      }
      return tmp;
    };
    return arr(nests);
  }
  else{
    return data;
  }
}

function updateBarchart(data){

  // sort data
  var sortVar = d3.select('input[name="sort"]:checked').node().value;
  data.sort(function(x, y){
     return d3.ascending(x[sortVar], y[sortVar]);
  })
  var aggVar = d3.select('input[name="aggregate"]:checked').node().value;
  if (aggVar === "continent" && sortVar === "Name"){
      sortVar = "Continent";
  }
  console.log(data);
  var encoder = d3.select('input[name=encoder]:checked').node().value;

  var width = d3.select('#barchart').attr("width"),
    height = d3.select('#barchart').attr("height"),
    margin = {top: 10, right: 10, bottom: 10, left: 10};
  var svg = d3.select('#barchart')
    .attr('width', width-margin.left-margin.right)
    .attr('height', height)
    .attr('transform', 'translate(' + margin.right + ',' + margin.top + ')');

  maxVal = d3.max(data, d => d[encoder])

  // define scales
  var xScale = d3.scaleLinear()
    .domain([0, maxVal])
    .range([0, width-margin.right]);

  // var variable = data.map(function(d){
  //   return d[aggVar]
  // })
  var yScale = d3.scaleBand()
    .range([height,0])
    .padding(0.1);

  yScale.domain(data.map(function(d){
      return d[aggVar];
    }))

  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  svg.select('#yAxis')
    // .attr('transform', 'translate(' + margin.left + ',' + 0 + ')')
    .call(yAxis);
    // .selectAll('text')
    // .style("text-anchor", "end")
    // .attr("dx", "-12px")
    // .attr("dy", "-5px");

  svg.select('#xAxis')
      .attr('transform', 'translate(' + margin.left + ',' + (height-150-margin.bottom) + ')')
      .call(xAxis)
      .selectAll('text')
      .style("text-anchor", "end")
      .attr("dx", "-12px")
      .attr("dy", "-5px")
      .attr("transform", "rotate(-90)" );

  // color = d3.scaleOrdinal(d3['schemeSet1'])
  //   .domain(continents);

  color = d3.scaleLinear()
      .domain([0, maxVal])
      .range([d3.rgb("#95B4E2"), d3.rgb('#092D62')]);

  var bars = svg.select('#bars')
    .selectAll('rect.bar')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('width', function(d){
      return xScale(d[encoder]);
    })
    .attr('height', yScale.bandwidth())
    .attr('x', function(d){
      return xScale(0);
    })
    .attr('y', function(d){
      return yScale(d[aggVar]);
    })
    .style('fill', function(d){
       return d3.rgb(colores_g[continents.indexOf(d.Continent)])
     })
     // yAxisG.selectAll('.tick line').remove();

     var old_bars = d3.select('#bars').selectAll('rect.bar')
       .transition().duration(350)
       .attr('class', 'bar')
       .attr('height', yScale.bandwidth())
       .attr('width', function(d){
         return xScale(d[encoder]);
       })
       .attr('x', function(d){
         return xScale(0);
       })
       .attr('y', function(d){
         return yScale(d[aggVar]);
       })
       // TODO: indexOf
       .style('fill', function(d){
         return d3.rgb(colores_g[continents.indexOf(d.Continent)])
       });

}

var url = "json_files/countries_1995_2012.json"
d3.json(url, function(error, data){
  barchartData = prepare_columns(data);
  continents = d3.map(barchartData, function(d){
    return d.Continent;}).keys()
  yearsData = getYear(barchartData);
  updateBarchart(filterRows(aggregator(yearsData)));
});

function change(){
  updateBarchart(filterRows(aggregator(getYear(barchartData))));
}
