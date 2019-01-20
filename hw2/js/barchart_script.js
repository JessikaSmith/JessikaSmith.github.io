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

function showBarchart(data){

}

var url = "http://localhost:8000/json_files/data.json"
d3.json(url, function(error, data){
  barchartData = prepare_columns(data);
  yearsData = getYear(tableData);
  showBarchart(yearsData);
});
