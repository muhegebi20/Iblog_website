const { Router } = require("express");
const User = require("./model/user.js");
const bcrypt = require("bcrypt");
const { IsLoggedIn } = require("./middleware.js");
const router = Router();

router.get("/register", (req, res) => {
  res.render("main/register");
});
router.post("/register", async (req, res, next) => {
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
router.get("/logout", IsLoggedIn, function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
router.get("/profile", (req, res) => {
  res.render("user/profile");
});

module.exports = router;
