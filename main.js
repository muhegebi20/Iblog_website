let express = require("express");
let path = require("path");
let app = express();
let body_parser = require("body-parser");
let Post = require("./model/blog_Schema.js");
const mongoose = require("mongoose");
let methodOverride = require("method-override");
const User = require("./model/user.js");
const bcrypt = require("bcrypt");
const passport = require("passport");
const localStrategy = require("./utils/localStrategy.js");
const session = require("express-session");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "img")));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Iblog");
}

app.use(
  session({
    secret: "hairy cat",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 3600 * 24,
      secure: true,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

//main app
app.get("/", (req, res) => {
  res.render("main/index.ejs");
});
app.get("/about", (req, res) => {
  res.render("main/about");
});
app.get("/blog/:id/edit", async (req, res) => {
  let { id } = req.params;
  let post = await Post.findById(id);
  res.render("main/updatePost", { post });
});
app.get("/blog/:id", async (req, res) => {
  let { id } = req.params;
  let post = await Post.findById(id);
  res.render("main/details", { post });
});
app.patch("/blog/:id", async (req, res) => {
  let { id } = req.params;
  let post = await Post.findByIdAndUpdate(id, req.body);
  console.log(post);
  res.redirect(`/blog/${id}`);
});
app.delete("/blog/:id", async (req, res) => {
  let { id } = req.params;
  await Post.findByIdAndDelete(id);
  res.redirect("/blog");
});
app.get("/blog", async (req, res) => {
  let content = await Post.find({});
  res.render("main/blog", { content });
});
app.get("/contact", (req, res) => {
  res.render("main/contact");
});
app.get("/newblog", (req, res) => {
  res.render("main/newblog");
});

app.post("/newpost", async (req, res) => {
  let content = req.body;
  let today = new Date().toGMTString();
  content.date = today.substring(5, 16);
  let newpost = new Post(content);
  let saved = await newpost.save();
  res.redirect(`/blog/${saved.id}`);
});
app.get("/login", (req, res) => {
  res.render("main/login");
});
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);
app.get("/register", (req, res) => {
  res.render("main/register");
});
app.post("/register", async (req, res, next) => {
  let { body } = req;
  let newUser = new User(body);
  newUser.password = bcrypt.hashSync(newUser.password, 10);
  await newUser.save();
  req.login(newUser, function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
app.listen(3000, () => {
  console.log("listening to the server...");
});
