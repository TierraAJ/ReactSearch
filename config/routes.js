// Server Routes

var Article = require("../models/Article.js");
var Note = require("../models/Note.js");
var request = require("request");
var cheerio = require("cheerio");



module.exports = function(router) {

// GET request to scrape the NYT website
router.get("/scrape", function(req, res) {

 // First, we grab the body of the html with request
    request("http://www.nytimes.com", function (err, res, body) {
        var $ = cheerio.load(body);
    $(".story-heading").each(function(i, element) {
        if (i < 10) {

        var result = {};

     // Add the text and href of every link, and save them as properties of the result object
     result.title = $(this).children("a").text();
     result.link = $(this).children("a").attr("href");
        }
     // Using our Article model, create a new entry
     // This effectively passes the result object to the entry (and the title and link)
     var entry = new Article(result);

     // Now, save that entry to the db
     entry.save(function(err, doc) {
       // Log any errors
       if (err) {
         console.log(err);
       }
       // Or log the doc
       else {
         console.log(doc);
       }
     });
    });
   });
 // Tell the browser that we finished scraping the text
 res.redirect("/");
});

// This will get the articles we scraped from the mongoDB
router.get("/articles", function(req, res) {
  // Grab every doc in the Articles array
  Article.find({}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});

 router.get("/articles/:id", function(req, res) {
   Article.findOne({"_id": req.params.id})
   .populate("note")
   .exec(function(err, doc) {
    if (error) {
      console.log(error);
    }
     res.json(doc);
   });
});

 router.post("/articles/:id", function(req, res) {
   var newNote = new Note(req.body);
   newNote.save(function(error, doc) {
         if (error) {
      console.log(error);
    }
    else{
     Article.findOneAndUpdate({ "_id": req.params.id}, {"note": doc._id})
     .exec(function(err, doc) {
        if (err) {
          console.log(err);
        }
        else{
       res.send(doc);
        }
     });
    }
   });
});

 router.get("/", function(req,res) {
   Article.find({ saved: false })
     .sort({ date: -1 })
     .exec( function(error, doc) {
     if (error) throw error;
     res.render("home", {content: doc});
     });
 });
};
