var express = require('express');
var logger = require('morgan');
var mongoose = require('mongoose');
 
 // Our scraping tools
 // Axios is a promisedbased http library, similar to jQuery's Ajax method
 // It works on the client and on the server
var axios = require('axios');
var cheerio = require('cheerio');
 
 // Require all models
var db = require('./models');
 
var PORT = process.env.PORT || 3000;
 
var app = express();

 // Configure middleware
 
 // Use morgan logger for logging requests
app.use(logger('dev'));
 // Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
 // Make public a static folder
app.use(express.static("public"));
 
 // Connect to the Mongo DB
mongoose.connect(
  'mongodb://localhost/mongoHeadlines',
  {useNewUrlParser: true},
);
 
 // Routes
 
 // A GET route for scraping the LiveKindly website
app.get('/scrape', function(req, res) {
   // First, we grab the body of the html with axios
  axios.get('https://www.livekindly.co/').then(function(response) {
     // Then, we load that into cheerio and save it to $ for a shorthand selector
     var $ = cheerio.load(response.data);
 
     // Now, we grab every h2 within an article tag, and do the following:
    var articles = [];
    $('.td-image-wrap').each(function(i, element) {
       // Save an empty result object
       var result = {};
       // Add the text, href and summary of every article, and save them as properties of the result object

      result.link = $(this).attr('href');
      result.title = $(this).attr('title');
       // Get text containing img src
      var img = $(this)
        .children('span')
        .attr('style');
       // Dissect src
      img = img.split("(")[1];
      img = img.split(")")[0];

      const newArticle = db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
          return dbArticle;
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
      articles.push(newArticle);
     });

    Promise.all(articles).then(data => {
      res.json(data);
    });
  });
   // Send a message to the client
 });
 
// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for getting all saved articles
app.get("/saved", (req, res) => {
  db.Article.find({isSaved: true})
      .then(function (retrievedArticles) {
          // If we were able to successfully find Articles, send them back to the client
          let hbsObject;
          hbsObject = {
              articles: retrievedArticles
          };
          res.render("saved", hbsObject);
      })
      .catch(function (err) {
          // If an error occurred, send it to the client
          res.json(err);
      });
});

app.put("/save/:id", function (req, res) {
  db.Article.findOneAndUpdate({ _id: req.params.id }, { isSaved: true })
      .then(function (data) {
          // If we were able to successfully find Articles, send them back to the client
          res.json(data);
      })
      .catch(function (err) {
          // If an error occurred, send it to the client
          res.json(err);
      });;
});

app.put("/remove/:id", function (req, res) {
  db.Article.findOneAndUpdate({ _id: req.params.id }, { isSaved: false })
      .then(function (data) {
          // If we were able to successfully find Articles, send them back to the client
          res.json(data)
      })
      .catch(function (err) {
          // If an error occurred, send it to the client
          res.json(err);
      });
});

// Route for grabbing a specific Article by id, populate it with its comment
app.get("/articles/:id", function (req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.find({ _id: req.params.id })
      // ..and populate all of the comments associated with it
      .populate({
          path: 'comment',
          model: 'Comment'
      })
      .then(function (dbArticle) {
          // If we were able to successfully find an Article with the given id, send it back to the client
          res.json(dbArticle);
      })
      .catch(function (err) {
          // If an error occurred, send it to the client
          res.json(err);
      });
});

// Route for saving/updating an Article's associated Comment
app.post("/comment/:id", function (req, res) {
  // Create a new comment and pass the req.body to the entry
  db.Comment.create(req.body)
      .then(function (dbComment) {
          // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Comment
          // { new: true } tells the query that we want it to return the updated User  it returns the original by default
          // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
          return db.Article.findOneAndUpdate({ _id: req.params.id }, {$push: { comment: dbComment._id }}, { new: true });
      })
      .then(function (dbArticle) {
          // If we were able to successfully update an Article, send it back to the client
          res.json(dbArticle);
      })
      .catch(function (err) {
          // If an error occurred, send it to the client
          res.json(err);
      });
});

app.delete("/comment/:id", function (req, res) {
  // Create a new comment and pass the req.body to the entry
  db.Comment.findByIdAndRemove({ _id: req.params.id })
      .then(function (dbComment) {

          return db.Article.findOneAndUpdate({ comment: req.params.id }, { $pullAll: [{ comment: req.params.id }]});
      })
      .then(function (dbArticle) {
          // If we were able to successfully update an Article, send it back to the client
          res.json(dbArticle);
      })
      .catch(function (err) {
          // If an error occurred, send it to the client
          res.json(err);
      });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port "  + PORT + "!");
});
