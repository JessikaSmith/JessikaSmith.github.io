

var url = "http://localhost:8000/json_files/data.json"
d3.json(url, function(error, data){
  barchartData = prepare_columns(data);
  yearsData = getYear(tableData);
  table_show(yearsData);
});
