
var path_to_json = "https://raw.githubusercontent.com/mdn/learning-area/master/accessibility/aria/quotes.json";

var test = false;

several_test_quotes = [
  "Whatever the mind of man can conceive and believe, it can achieve.” – Napoleon Hill",
  "The most common way people give up their power is by thinking they don’t have any.” – Alice Walker",
  "The mind is everything. What you think you become.” – Buddha",
  "All successful men and women are big dreamers. They imagine what their future could be, ideal in every respect, and then they work every day toward their distant vision, that goal or purpose.” – Brian Tracy"
]

function testFunction() {
  var random = Math.floor(Math.random() * 2)
  document.getElementById("quote").innerHTML = several_test_quotes[random];
}

// load new random quote
function newQuoteFunction(){
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          var myObj = JSON.parse(this.responseText);
          var random = Math.floor(Math.random() * myObj.length)
          document.getElementById("quote").innerHTML = myObj[random].quote + '” –' + myObj[random].author;
      }
  };
  xmlhttp.open("GET", path_to_json, true);
  xmlhttp.send();
}

// author selection
function getAuthor(){
  var author_list = document.getElementById('dropdown-content');
  arr = ["html","css","java","javascript","php","c++","node.js","ASP","JSP","SQL"];

    for(var i = 0; i < arr.length; i++)
    {
      var option = document.createElement("OPTION"),
      txt = document.createTextNode(arr[i]);
      option.appendChild(txt);
      option.setAttribute("value",arr[i]);
      author_list.appendChild(option);
    }

}
