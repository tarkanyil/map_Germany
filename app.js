//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const fetch = require('node-fetch');
const schedule = require('node-schedule');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

let json;
let dataLoaded = false;

let getNewData = async () => {
  console.log("request started");

  const response = await fetch("https://opendata.arcgis.com/datasets/917fc37a709542548cc3be077a786c17_0.geojson");

  if (response.ok) {
    json = await response.json();
    console.log("success.");
    dataLoaded = true;
  }
}

//get fresh data when server starts
getNewData();

//get fresh data every midnight
schedule.scheduleJob('0 0 * * *', () => {getNewData()});

app.get("/", function (req, res) {
  res.sendFile("index.html");
});

app.get("/data", function (req, res) {
  res.connection.setTimeout(100000);
  let tryToSend = setInterval(sendData, 100);
  function sendData() {
    if (dataLoaded) {
      console.log(dataLoaded, "kééész");
      clearInterval(tryToSend);
      res.json(json);
    }
  }
});

let port = process.env.port || 3000;
app.listen(port, function () {
  console.log("Server started on a good port.");
});