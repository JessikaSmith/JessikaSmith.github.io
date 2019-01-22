
var path_to_json = "https://raw.githubusercontent.com/mdn/learning-area/master/accessibility/aria/quotes.json";

var test = false;

several_test_quotes = [
  "Whatever the mind of man can conceive and believe, it can achieve.” – Napoleon Hill",
  "The most common way people give up their power is by thinking they don’t have any.” – Alice Walker",
  "The mind is everything. What you think you become.” – Buddha",
  "All successful men and women are big dreamers. They imagine what their future could be, ideal in every respect, and then they work every day toward their distant vision, that goal or purpose.” – Brian Tracy"
]

// get selector object
var x = document.getElementById("authors");

// get list of authors and add them to selector
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
      var myObj = JSON.parse(this.responseText);
      for (let i = 0; i < myObj.length; i++){
        flag = true;
        m = document.getElementById('authors');
        for (let j = i - 1; j > 0; j--){
          if (myObj[i].author == m.options[j].value){
            flag = false;
            break;
          }
        }
        if (flag){
          option = document.createElement("option");
          option.text = myObj[i].author;
          option.value = myObj[i].author;
          x.add(option);
        }
      }
    }
  };
xmlhttp.open("GET", path_to_json, true);
xmlhttp.send();

// sort authors

function testFunction() {
  var random = Math.floor(Math.random() * 2)
  document.getElementById("quote").innerHTML = several_test_quotes[random];
}

// load new random quote
function newQuoteFunction(){
  document.getElementById("authors").selectedIndex = "0";
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
function getAuthorQuotes(){
  var author_list = document.getElementById('authors');
  console.log(author_list.options[author_list.selectedIndex].value);
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          var myObj = JSON.parse(this.responseText);
          for (let i = 0; i < myObj.length; i++){
            if (myObj[i].author === author_list.options[author_list.selectedIndex].value){
              document.getElementById("quote").innerHTML = myObj[i].quote + '” –' + myObj[i].author;
              break;
            }
        }
      };
  };
  xmlhttp.open("GET", path_to_json, true);
  xmlhttp.send();

}
