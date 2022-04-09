const express = require('express');
const bodyParser = require('body-parser');
const port = 8080;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

const InitiateMongoServer = require("./config/db");

// Initiate Mongo Server
InitiateMongoServer();

const Image = require('./model/Image');

var router = express.Router();

// The method of the root url. Be friendly and welcome our user :)
router.get("/", function (req, res) {
  res.json({ message: "Welcome to the APOD app." });
});

router.get("/favorite", async (req, res) => {
  try {
    const cursor  = await Image.find();
    console.log(cursor);
    res.status(200).send(cursor);
  } catch (err) {
      res.status(400).send(err);
  }
  
});

router.post("/add", async (req, res)  => {
  // TODO:
  
  var image = new Image(req.body);
  try {
    await image.save();
    res.status(200).send("Image saved to DB");
  } catch(err) { 
      res.status(400).send(err);
  };
  

});

router.delete("/delete", async (req, res) => {
  console.log(req.body.date);
  var str = JSON.stringify(req.body.date);
  var date =  req.body.date.replace(/(..).(..).(....)/, "$3-$1-$2");
  date = date+"T08:00:00.000Z";
  console.log(date);
  
  try {
    const result = await Image.deleteMany({"date": date});
    console.log(result.deletedCount + " Record(s) deleted successfully");
    res.status(200).send(result.deletedCount + " Record(s) deleted successfully");
  } catch(err) {
      res.status(400).send(err);
  }
		
});

app.use("/api", router); // API Root url at: http://localhost:8080/api

app.listen(port);
console.log("Server listening on port " + port);

