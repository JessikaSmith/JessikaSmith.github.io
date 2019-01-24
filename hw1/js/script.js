
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

myObj = [];
// get list of authors and add them to selector
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
      window.myObj = JSON.parse(this.responseText);
      console.log(myObj);
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
  console.log(myObj);
  getAuthorQuotes();
}

author_list = document.getElementById('authors');

// author selection
function getAuthorQuotes(){
  author_quotes = []
  var selected_author = author_list.options[author_list.selectedIndex].value;
  console.log(selected_author);
  if (selected_author != "All"){
    for (let i = 0; i < myObj.length; i++){
      if (myObj[i].author == selected_author){
        author_quotes.push(myObj[i].quote)
      }
    };
    var random = Math.floor(Math.random() * author_quotes.length);
    console.log(random);
    document.getElementById("quote").innerHTML = author_quotes[random] + '” –' + selected_author;
  }
  else{
    var random = Math.floor(Math.random() * myObj.length)
    document.getElementById("quote").innerHTML = myObj[random].quote + '” –' + myObj[random].author;
  }

}
