if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

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
const ExpressError = require("./utils/ExpressError.js");
const { IsLoggedIn, IsAuthor } = require("./middleware.js");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "img")));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(methodOverride("_method"));
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Iblog");
}

app.use(
  session({
    secret: "hairy cat",
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/Iblog",
      dbName: "Iblog",
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 3600 * 24,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//main app
app.get("/", (req, res) => {
  res.render("main/index.ejs");
});
app.get("/about", (req, res) => {
  res.render("main/about");
});
app.get("/blog/:id/edit", IsLoggedIn, async (req, res, next) => {
  try {
    let { id } = req.params;
    let post = await Post.findById(id);
    res.render("main/updatePost", { post });
  } catch (error) {
    next(new ExpressError(500, "something went wrong"));
  }
});
app.get("/blog/:id", async (req, res, next) => {
  try {
    let { id } = req.params;
    let post = await Post.findById(id);
    res.render("main/details", { post });
  } catch (error) {
    next(new ExpressError(404, "something went wrong"));
  }
});
app.patch("/blog/:id", IsLoggedIn, async (req, res, next) => {
  try {
    let { id } = req.params;
    let post = await Post.findByIdAndUpdate(id, req.body);
    req.flash("success", "successfully updated!");
    res.redirect(`/blog/${id}`);
  } catch (error) {
    req.flash("error", "failed to update post");
    next(new ExpressError(500, "Try again!"));
  }
});
app.delete("/blog/:id", IsLoggedIn, IsAuthor, async (req, res, next) => {
  try {
    let { id } = req.params;
    await Post.findByIdAndDelete(id);
    res.redirect("/blog");
  } catch (error) {
    next(new ExpressError(403, "you can't delete this post"));
  }
});
app.get("/blog", async (req, res, next) => {
  try {
    let content = await Post.find({});
    res.render("main/blog", { content });
  } catch (error) {
    next(new ExpressError(404, "Page not found"));
  }
});
app.get("/contact", (req, res) => {
  res.render("main/contact");
});
app.get("/newblog", IsLoggedIn, (req, res) => {
  res.render("main/newblog");
});

app.post("/newpost", IsLoggedIn, async (req, res, next) => {
  try {
    let content = req.body;
    let today = new Date().toGMTString();
    content.date = today.substring(5, 16);
    let newpost = new Post(content);
    newpost.author = req.user._id;
    let saved = await newpost.save();
    res.redirect(`/blog/${saved.id}`);
  } catch (error) {
    next(new ExpressError(500, "couldn't post, please try again!"));
  }
});
app.get("/login", (req, res) => {
  res.render("main/login");
});
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    failureMessage: "please try again!",
  })
);

app.get("/register", (req, res) => {
  res.render("main/register");
});
app.post("/register", async (req, res, next) => {
  try {
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
  } catch (error) {
    new ExpressError(error.statusCode, "please try again!");
  }
});
app.get("/logout", IsLoggedIn, function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
app.get("/profile", (req, res) => {
  res.render("user/profile");
});
app.get("/search", async (req, res, next) => {
  try {
    const searchTerm = req.query;
    searchTerm.trim();
    console.log(searchTerm);
    query.or([{ color: "red" }, { status: "emergency" }]);
    const results = await Post.find({
      $or: [
        {
          title: { $regex: searchTerm, $options: "i" },
        },
        { content: { $regex: searchTerm, $options: "i" } },
      ],
    }); // MongoDB case-insensitive regex search
    res.send(results);
  } catch (error) {
    return next(new ExpressError(404, "no data found!"));
  }
});

app.use("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh, something went wrong!";
  res.status(statusCode).render("errors.ejs", { error: err });
});

app.listen(3000, () => {
  console.log("listening to the server...");
});
