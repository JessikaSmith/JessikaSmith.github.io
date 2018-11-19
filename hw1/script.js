
function myFunction() {
    document.getElementById("demo").style.color = "red";
}

var test = false;

var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var myObj = JSON.parse(this.responseText);
        document.getElementById("quote").innerHTML = myObj[1].quote;
    }
};
xmlhttp.open("GET", "https://raw.githubusercontent.com/mdn/learning-area/master/accessibility/aria/quotes.json", true);
xmlhttp.send();

function test(){
  document.getElementById("demo").innerHTML = "Hello JavaScript!;
}
