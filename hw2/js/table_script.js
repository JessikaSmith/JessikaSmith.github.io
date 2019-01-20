let tableData;

// column definitions
const columns = [
    { head: 'Name', cl: 'center', html: f('Name') },
    { head: 'Continent', cl: 'center', html: f('Continent') },
    { head: 'GDP', cl: 'right', html: f('GDP', d3.format(',.2s')) },
    { head: 'Life Expectancy', cl: 'right', html: f('Life Expectancy', d3.format('.1f')) },
    { head: 'Population', cl: 'right', html: f('Population', d3.format(',.0f')) },
    { head: 'Year', cl: 'right', html: f('Year', d3.format('.0f')) }
];

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

// TODO rewrite to loop
var sortVar = [
  { key: 'Name', order: d3.ascending },
  { key: 'Continent', order: d3.ascending },
  { key: 'GDP', order: d3.ascending },
  { key: 'Life Expectancy', order: d3.ascending },
  { key: 'Population', order: d3.ascending },
  { key: 'Year', order: d3.ascending }
];


var continentNames = [
"Africa", "Americas", "Asia", "Europe", "Oceania"
];

// set data format
function f() {
    var entries = arguments;
    var i = 0;
    var len = entries.length;
    while (i < len) {
        if (typeof(entries[i]) === 'string' || typeof(entries[i]) === 'number') {
            entries[i] = (function (str) {
                return function (d) {
                    return d[str];
                };
            })(entries[i]);
        }
        i++;
    }
    return function (d) {
        var i = 0;
        len = entries.length;
        while (i++ < len){
          d = entries[i - 1].call(this, d);
        }
        return d;
    };
}

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

function table_show(data){

  var table = d3.select("body").append("table")
              .attr("class", "newTable");
  var thead = table.append("thead")
              .attr("class", "thead");
  var tbody = table.append("tbody");

  table.append("caption")
              .html("World Countries Ranking");

  const headers = thead.append("tr")
    .selectAll("th")
    .data(columns)
    .enter()
    .append("th")
    .text(function(d) {
      return d.head;
    });

    headers.on("click", function(header) {
      headers.attr('class', 'header');
      var obj = sortVar.find(x => x.key === header.head);
        if (obj.order.toString()==d3.ascending.toString()){
          tbody.selectAll("tr.row").sort(function(a, b) {
            var result = d3.ascending(a[header.head], b[header.head]);
            obj.order = d3.descending;
            if (header.head==='Continent'){
              return d3.ascending(a[header.head], b[header.head]) || d3.ascending(a["Name"], b["Name"])
            }
            else{
              return result
            }
          });
            this.className = 'asc';
          }
        else{
          tbody.selectAll("tr.row").sort(function(a, b) {
            var result = d3.descending(a[header.head], b[header.head]);
            obj.order = d3.ascending;
            if (header.head==="Continent"){
              return d3.descending(a[header.head], b[header.head]) || d3.ascending(a["Name"], b["Name"])
            }
            else return result
        });
        this.ClassName = 'desc';
      };
    });

    var rows = tbody.selectAll("tr.row")
        .data(data)
        .enter()
        .append("tr")
        .attr("class", "row");

      // according to https://www.vis4.net/blog/2015/04/making-html-tables-in-d3-doesnt-need-to-be-a-pain/
    var cells = tbody.selectAll('tr.row')
        .selectAll('td')
        .data(fillFunc)
        .enter()
        .append('td')
        .html(f('html'))
        .attr('class', f('cl'));

  }

const fillFunc = function (row, i){
      return columns.map(function(c){
        var cell = {};
        d3.keys(c).forEach(function(k){
          cell[k] = typeof c[k] == 'function' ? c[k](row,i) : c[k];
        });
        return cell;
      });
};

// Filtering tools
function filterRows(data){
  if (data === undefined) {
        data = getYear(tableData, 2000);
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

// aggregation tools
function aggregator(data) {
  if (data === undefined) {
    data = getYear(tableData, 2000);
  }
  var agg = d3.select('input[name="aggregate"]:checked').node().value;
  var n = 0;
  if (agg == "agg"){
    nests = d3.nest()
    .key(function (d){
      return d.Continent
    })
    .rollup(function(d){
      return{
        'Name': d[0].Continent,
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

// Looking at the resulting table
var url = "/json_files/countries_1995_2012.json";
d3.json(url, function(error, data){
  tableData = prepare_columns(data);
  yearsData = getYear(tableData);
  table_show(yearsData);
// barchart
});

function update(data){
  tbody = d3.select('tbody')
  rows = tbody.selectAll("tr.row")
    .data(data);
  rows.exit().remove();
  rows = rows
    .enter()
    .append("tr")
    .attr("class", "row")
    .merge(rows);
  cells = rows.selectAll("td")
    .data(fillFunc);
  cells.exit()
    .remove();
  cells = cells.enter()
    .append("td");
  tbody.selectAll("td")
    .html(f("html"))
    .attr("class", f("cl"));
};

d3.selectAll("input[type=range]").on("change", function(){
  data = update(filterRows(aggregator(getYear())));
});

d3.selectAll('input[name="aggregate"]').on("change", function(){
    update(filterRows(aggregator(getYear())));
});

d3.selectAll("input[type=checkbox]").on("change", function(){
  update(filterRows(aggregator(getYear())));
});
