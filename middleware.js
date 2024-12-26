const { session } = require("passport");

module.exports.IsLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "you need to login first!");
    return res.redirect("/login");
  }
  next();
};
