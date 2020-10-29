//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
  res.sendFile("index.html");
});


let port = process.end.PORT || 3000;
app.listen(port, function(){
  console.log("Server started on a good port.");
});

// Kukucs