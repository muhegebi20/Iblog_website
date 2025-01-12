if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

let express = require("express");
let path = require("path");
let app = express();
const mongoose = require("mongoose");
let methodOverride = require("method-override");
const passport = require("passport");
const localStrategy = require("./utils/localStrategy.js");
const session = require("express-session");
const ExpressError = require("./utils/ExpressError.js");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo");
const iblog = require("./routes/iblog.js");

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

app.use("/", iblog);

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
