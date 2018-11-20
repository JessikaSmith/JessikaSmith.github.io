
var path_to_json = "https://raw.githubusercontent.com/mdn/learning-area/master/accessibility/aria/quotes.json";

var test = false;
var xmlhttp = new XMLHttpRequest();

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
