const { session } = require("passport");
const Post = require("./model/blog_Schema");
const ExpressError = require("./utils/ExpressError");

module.exports.IsLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must login first");
    return res.redirect("/login");
  }
  next();
};

module.exports.IsAuthor = async (req, res, next) => {
  let { id } = req.params;
  const post = await Post.findById(id);
  if (!post.author.equals(req.user.id)) {
    req.flash("error", "you can't delete this blog");
    return res.redirect(`/blog/${id}`);
  }
  next();
};
