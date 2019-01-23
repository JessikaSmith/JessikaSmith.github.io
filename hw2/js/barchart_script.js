// #95d261 - Asia
// #64b7e7 - Africa
// #ed942e - America
// #ab40e8 - Oceania
// #ed2a1b - Europe

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

function initBarchartVars(data){
  margin = {top: 50, bottom: 5, left: 50, right: 10};
  // Fix this
  textW = 10;
  barH = 20;
  width = 900 - margin.left - margin.right;
  height = barH*data.length - margin.top - margin.bottom;
  console.log(height);
  xScale = d3.scaleLinear().range([0, width]);
  yScale = d3.scaleBand().range([0, barH*data.length]);
  encoder = d3.select('input[name=encoder]:checked').node().value;
  max = d3.max(data, function(d){
      return d[encoder];
  });
  min = 0;
  xScale = d3.scaleLinear().domain([0, max])
      .range([textW, width]);

  // Add normal length
  // yScale = d3.scaleBand()
  //   .rangeRound([0, height*data.length]).padding(.1);
  yAxis = d3.axisLeft()
    .scale(yScale);

  aggVar = d3.select('input[name="aggregate"]:checked').node().value;
  sortVar = d3.select('input[name=sort]:checked').node().value;

  if (aggVar === "continent" && sortVar === "Name"){
      sortVar = "Continent"
  };
};

function initBarchart(data){
  initBarchartVars(data);

  var yW = yScale.bandwidth();
  console.log(yW);

  var svg = d3.select("body").append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", yScale.range()[1]+25+'px');

  svg.append("g")
    .call(yAxis);


  data.sort(function(x, y){
     return d3.ascending(x[sortVar], y[sortVar]);
  })


  var bar = svg.selectAll('g')
   .data(data)
   .enter()
   .append('g')
   .attr('transform', function(d, i) {
      return "translate(0," + i * barH + ")";
    });

   bar.append('rect').transition().duration(800)
       .attr('width', function(d) {
         return xScale(d[encoder]); })
       .attr('height',  barH - 2)
       .attr('x', 300);
       // .attr('fill', function(d){
       //   return colors(d[encoder], max);
       // });

   bar.append('text')
       .text(function(d){
           return d[sortVar]
       })
       .attr('y', function(d, i){
           return i + 9;
       })
       .attr('class', 'lable');

    bar.selectAll("text")
      .attr("dx", "30px");

    var t = d3.selectAll('rect');
    t.attr("fill", function(d, i) {
      return colors(i);
    });
     d3.selectAll("path.domain").remove();
}

function updateBarchart(data){
  d3.select("svg")
    .selectAll("g")
    .remove()
  initBarchartVars(data);
  var svg = d3.select("svg");

  svg.attr("width", width+margin.left+margin.right)
      .attr("height", yScale.range()[1] + 25 + 'px');

  svg.append("g")
    .call(yAxis);

    if (sortVar == "Name"){
      data.sort(function(x, y){
         return d3.ascending(x[sortVar], y[sortVar]);
      })
    }
    else{
      data.sort(function(x, y){
        return d3.descending(x[sortVar], y[sortVar]);
      })
    };

    // Add animation by introducing prev bars

  var bar = svg.selectAll('g')
   .data(data)
   .enter()
   .append('g')
   .attr('transform', function(d, i) {
      return "translate(0," + i * barH + ")";
    });


   bar.append('rect').transition().duration(900)
       .attr('width', function(d) {
         console.log(d[encoder])
         return xScale(d[encoder]); })
       .attr('height',  barH - 2)
       .attr('x', 250);
       // .attr('fill', function(d){
       //   return colors(d[encoder], max);
       // });

   bar.append('text')
       .text(function(d){
           return d[aggVar];
       })
       .attr('y', function(d, i){
           return i + 9;
       })
       .attr('class', 'lable');

     bar.selectAll("text")
       .attr("dx", "15px")
       .attr("text-align","right");

    var t = d3.selectAll('rect');
    t.attr("fill", function(d, i) {
      return colors(i);
    });
     d3.selectAll("path.domain").remove();
};

var url = "json_files/countries_1995_2012.json"
d3.json(url, function(error, data){
  barchartData = prepare_columns(data);
  yearsData = getYear(barchartData);
  initBarchart(filterRows(aggregator(yearsData)));
});

function change(){
  updateBarchart(filterRows(aggregator(getYear(barchartData))));
}
