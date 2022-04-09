const express = require('express')
const app = express()
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000

//app.use(express.json())
//app.use(express.urlencoded())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

const mongoose = require('mongoose')

const db = mongoose.connection
const url = "mongodb://127.0.0.1:27017/apod"

mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })

const Schema = mongoose.Schema
const apodSchema = Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  }
}, {collection: 'images'})

const APOD = mongoose.model('APOD', apodSchema)

var router = express.Router();

router.get("/", function (req, res) {
  // GET "/" should return a list of all APOD images stored in our database
});

router.get("/favorite", function (req, res) {
  // GET "/favorite" should return our favorite image by highest rating
    APOD.find().sort({'rating': 'desc'}).exec((error, images) => {
    if (error) {
      console.log(error)
      res.send(500)
    } else {
      res.json({favorite: images[0]})
    }
  })
})

router.post("/add", function (req, res) {
  // POST "/add" adds an APOD image to our database
  var apod = new APOD(req.body);
  try {
    apod.save();
    res.status(200).send("Image saved to DB");
  } catch(err) { 
      res.status(400).send(err);
  };
});

router.delete("/delete", function (req, res) {
  // DELETE "/delete" deletes an image according to the title

  console.log(req.body.title);
  var title = req.body.title;
  APOD.deleteMany({'title': title}).exec((error, images) => {
    if (error) {
        console.log(error);
        res.send(500);
    } else {
        //res.status(200);
    }
  })
  res.status(200).send("Record(s) with title: \""+title+"\" are deleted successfully");
    
});

app.use("/api", router); // API Root url at: http://localhost:3000/api

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})