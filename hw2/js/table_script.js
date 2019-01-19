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

function table_show(data){

  var table = d3.select("body").append("table");
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

        console.log(rows);

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

// Filtering tools

d3.select('#checkbox')
  .selectAll('input')
  .data(continentNames)
  .enter()
  .append("label")
  .append("input")
  .attr("type", "checkbox")
  .attr("class","checkbox_check")
  .attr("value", function (d){
    return d
  })
  .attr("id", function (d){
    return d
  });

d3.selectAll("label")
  .data(continentNames)
  .attr("class", "checkbox")
  .append("text").text(function (d){
    return " " + d
  })

filterCol = 'Continent';

var checkBox = d3.selectAll(".checkbox_check");

function update(){
  var choices = [];
  d3.selectAll(".checkbox_check").each(function(d){
    box = d3.select(this);
    if (box.property("checked")){
      choices.push(box.property("value"));
    }
  });
  if (choices.length > 0){
    newData = table.filter(function(d, i){
      return choices.includes(d);
    })
  }
  else {
    newData = data;
  }

  newRows = table.selectAll(tr.row)
    .data(newData, function(d){
      return d;
    });
    newRows.enter()
      .append("tr.rows")
      .append("td")
      .text(function(d){
        return d;
      });
    newRows.exit()
      .remove();
}

checkBox.on("change", update);

// Looking at the resulting table
d3.json("http://localhost:8000/json_files/countries_2012.json", function(error, data){
    table_show(prepare_columns(data));
  });
