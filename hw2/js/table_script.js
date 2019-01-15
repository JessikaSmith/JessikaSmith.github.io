function f() {
    var entries = arguments;
    var i = 0;
    var l = entries.length;
    while (i < l) {
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
        l = entries.length;
        while (i++ < l) d = entries[i - 1].call(this, d);
        return d;
    };
}

// column definitions
const columns = [
    { head: 'Name', cl: 'title', html: f('Name') },
    { head: 'Continent', cl: 'center', html: f('Continent') },
    { head: 'GDP', cl: 'num', html: f('GDP', d3.format(',.3s')) },
    { head: 'Life Expectancy', cl: 'center', html: f('Life Expectancy', d3.format('.1f')) },
    { head: 'Population', cl: 'num', html: f('Population', d3.format(',.0f')) },
    { head: 'Year', cl: 'center', html: f('Year', d3.format('.0f')) }
];


function prepare_columns(columns){
  return columns.map(function (t){
    return{
      'Name': t.name,
      'Continent': t.continent,
      'GDP': t.gdp,
      'Life Expectancy': t.life_expectancy,
      'Population': t.population,
      'Year': t.year
      };
    });
  }

function table_show(data){

  const table = d3.select("body").append("table"),
  thead = table.append("thead")
              .attr("class", "thead");
  tbody = table.append("tbody");

  table.append("caption")
              .html("World Countries Ranking");

  const headers = thead.append("tr").selectAll("th")
    .data(columns)
    .enter()
    .append("th")
    .text(function(d) {
      return d.head;
    });
  headers.on("click", function(header) {
      tbody.selectAll("tr.row").sort(function(a, b) {
        return d3.descending(a[header.head], b[header.head]);
      })
    });

    var rows = tbody.selectAll("tr.row")
        .data(data)
        .enter()
        .append("tr")
        .attr("class", "row");

// according to https://www.vis4.net/blog/2015/04/making-html-tables-in-d3-doesnt-need-to-be-a-pain/
    var cells = rows.selectAll('td')
        .data(function(row, i) {
            return columns.map(function(c){
              var cell = {};
              d3.keys(c).forEach(function(k){
                cell[k] = typeof c[k] == 'function' ? c[k](row,i) : c[k];
              });
              return cell;
            });
          })
        .enter()
        .append('td')
        .html(f('html'))
        .attr('class', f('cl'));
  };

  function stringCompare(a, b) {
      return a > b ? 1 : a == b ? 0 : -1;
  }

d3.json("http://localhost:8000/json_files/countries_2012.json", function(error, data){
    table_show(prepare_columns(data));
  });
