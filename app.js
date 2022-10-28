const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const { reset } = require("nodemon");
require("dotenv").config();
const DB = process.env.DATABASE_URL;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log("DB connection succesful");
  });

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const articleSchema = {
  title: String,
  content: String,
};
const Article = mongoose.model("Article", articleSchema);

app
  .route("/articles")
  .get((req, res) => {
    Article.find({}, (err, foundArticles) => {
      if (err) {
        console.log(err);
      } else {
        res.send(foundArticles);
      }
    });
  })
  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save(function (err) {
      if (!err) {
        res.send("Successfully added");
      } else {
        res.send(err);
      }
    });
  })
  .delete((res, req) => {
    Article.deleteMany({}, (err) => {
      if (err) {
        res.send(err);
      } else {
        res.send("Succesfully Deleted");
      }
    });
  });

///////////////////////Request for specific articles//////////////////////////
app
  .route("/articles/:article")
  .get((req, res) => {
    Article.findOne({ title: req.params.article }, (err, result) => {
      if (!err) {
        res.send(result);
      } else {
        res.send(err);
      }
    });
  })
  .put(function (req, res) {
    Article.replaceOne(
      { title: req.params.article },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      function (err) {
        if (!err) {
          res.send("Updated Results");
        }
      }
    );
  })
  .patch((req, res) => {
    Article.updateOne(
      { title: req.params.article },
      { $set: req.body },
      (err) => {
        if (!err) {
          res.send("Succesfully updated");
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.article }).then((err) => {
      if (err) {
        res.send(err);
      } else {
        res.send("deleted");
      }
    });
  });
app.get("/articles");

app.post("/articles");

app.delete("/articles");

app.listen(process.env.PORT || 5000, () => {
  console.log("server is running");
});
