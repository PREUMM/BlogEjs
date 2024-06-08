//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const app = express();
var delall = 0;
var news = "No upcoming News!";
let posts = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.get("/", function(req, res) {
  console.log(req.protocol + '://' + req.get('host') + req.originalUrl);
  let css = ""
  posts.forEach((post) => {
    if (post.title == "[Content Deleted]")
      css += "." + post.title + " {color: red;}"
    });
  if (Math.random() > 0.9) {
    res.render("home", {
      title: "Home",
      content: "Sup",
      posts: posts,
      css: css,
      news: news
    });
  } else {
    res.render("home", {
      title: "Home",
      content: homeStartingContent,
      posts: posts,
      css: css,
      news: news
    });
  }
});
app.get("/admin", function(req, res) {
  console.log(req.protocol + '://' + req.get('host') + req.originalUrl);
  res.render("admin", {
    title: "Home",
    content: homeStartingContent,
    posts: posts
  });
});
app.get("/admin/delall", function(req, res) {
  console.log(req.protocol + '://' + req.get('host') + req.originalUrl);
  posts = [];
  delall+=1
  const post = {
    title: "[Mass deletion]",
    content: "All posts has been Deleted!",
    link: "/posts/" + _.lowerCase("massdeletion"+delall),
    score: ""
  };
  posts.push(post)
  res.redirect("/admin");
});
app.post("/admin/news-update", function(req, res) {
  console.log(req.protocol + '://' + req.get('host') + req.originalUrl);
  news = req.body.news;
  res.redirect("/admin");
});
app.get("/about", function(req, res) {
  console.log(req.protocol + '://' + req.get('host') + req.originalUrl);
  res.render("about", {
    title: "About",
    content: aboutContent
  });
});
app.get("/posts/:postName", function(req, res) {
  console.log(req.protocol + '://' + req.get('host') + req.originalUrl);
  const requestedTitle = _.lowerCase(req.params.postName);

  posts.forEach(function(post){
    const writtenTitle = _.lowerCase(post.title);

    if (writtenTitle == requestedTitle) {
      console.log("Matched!");
      res.render("post", {
        title: post.title,
        content: post.content,
      });
    };
  });
});
app.get("/posts/:postName/delete", function(req, res) {
  console.log(req.protocol + '://' + req.get('host') + req.originalUrl);
  const requestedTitle = _.lowerCase(req.params.postName);
  let modNote = req.body.modNote;
  posts.forEach(function(post){
    const writtenTitle = _.lowerCase(post.title);
    let today = new Date();
    let time = today.getHours() + ":" + today.getMinutes()

    if (writtenTitle == requestedTitle) {
      post.title = "[Content Deleted]";
      post.content = "[Content Deleted]";
      post.time = "[Moderated] " + time;
      post.score = 0;
      post.mod = "Moderator Note : " + modNote
      // posts.pop(writtenTitle);
      res.redirect("/");
    };
  });
});
app.get("/posts/:postName/edit", function(req, res) {
  console.log(req.protocol + '://' + req.get('host') + req.originalUrl);
  const requestedTitle = _.lowerCase(req.params.postName);

  posts.forEach(function(post){
    const writtenTitle = _.lowerCase(post.title);

    if (writtenTitle == requestedTitle) {
      const title = post.title;
      const content = post.content;
      posts.pop(writtenTitle);
        res.render("compose", {
          title: "",
          content: ""
        });
    };
  });
});
app.get("/contact", function(req, res) {
  console.log(req.protocol + '://' + req.get('host') + req.originalUrl);
  res.render("contact", {
    title: "Contact",
    content: contactContent
  });
});
app.get("/compose", function(req, res) {
  console.log(req.protocol + '://' + req.get('host') + req.originalUrl);
  fetch('https://baconipsum.com/api/?type=all-meat&paras=2&start-with-lorem=1#')
  .then(response => response.text())
  .then(data => {
    var response = data;
    res.render("compose", {
      title: "",
      content: response.slice(2, -2)
    });
  });
});
app.post("/", function(req, res) {
  console.log(req.protocol + '://' + req.get('host') + req.originalUrl);
  let today = new Date();
  let time = today.getHours() + ":" + today.getMinutes()
  const post = {
    title: req.body.postTitle,
    content: req.body.postContent,
    link: "/posts/" + _.lowerCase(req.body.postTitle),
    score: Math.ceil(Math.random(1,Math.random(1,100))*100),
    time: "on [" + time + "]"
  };
  posts.push(post)
  res.redirect("/")
});

// myString.substring(0,length);

app.listen(3000, function() {
  console.log("Server startd on port 3000");
});
