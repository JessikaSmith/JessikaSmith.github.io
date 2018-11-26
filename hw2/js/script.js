var paragraphs = d3.select("p");
paragraphs.style("color", "steelblue");
d3.json("https://drive.google.com/file/d/0B5VL9rmGVa8XNFdZT0V1clp0WHc/view?usp=sharing", function(error, data){
  var columns = Object.keys(data[0]);

        var table = d3.select("body").append("table"),
          thead = table.append("thead")
                       .attr("class", "thead");
          tbody = table.append("tbody");

        table.append("caption")
          .html("World Countries Ranking");

        thead.append("tr").selectAll("th")
          .data(columns)
        .enter()
          .append("th")
          .text(function(d) { return d; })
          .on("click", function(header, i) {
            tbody.selectAll("tr").sort(function(a, b) {
              return d3.descending(a[header], b[header]);
            });
          });

        var rows = tbody.selectAll("tr.row")
          .data(data)
          .enter()
          .append("tr").attr("class", "row");

        var cells = rows.selectAll("td")
          .data(function(row) {
              return d3.range(Object.keys(row).length).map(function(column, i) {
                  return row[Object.keys(row)[i]];
              });
          })
          .enter()
          .append("td")
          .text(function(d) { return d; })
});
