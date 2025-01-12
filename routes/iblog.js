const { Router } = require("express");
const router = Router({}); //mergeParams
let Post = require("../model/blog_Schema.js");
const { IsLoggedIn, IsAuthor } = require("../middleware.js");

//main router
router.get("/", (req, res) => {
  res.render("main/index.ejs");
});
router.get("/about", (req, res) => {
  res.render("main/about");
});
router.get("/blog/:id/edit", IsLoggedIn, async (req, res, next) => {
  try {
    let { id } = req.params;
    let post = await Post.findById(id);
    res.render("main/updatePost", { post });
  } catch (error) {
    next(new ExpressError(500, "something went wrong"));
  }
});
router.get("/blog/:id", async (req, res, next) => {
  try {
    let { id } = req.params;
    let post = await Post.findById(id);
    res.render("main/details", { post });
  } catch (error) {
    next(new ExpressError(404, "something went wrong"));
  }
});
router.patch("/blog/:id", IsLoggedIn, async (req, res, next) => {
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
router.delete("/blog/:id", IsLoggedIn, IsAuthor, async (req, res, next) => {
  try {
    let { id } = req.params;
    await Post.findByIdAndDelete(id);
    res.redirect("/blog");
  } catch (error) {
    next(new ExpressError(403, "you can't delete this post"));
  }
});
router.get("/blog", async (req, res, next) => {
  try {
    let content = await Post.find({});
    res.render("main/blog", { content });
  } catch (error) {
    next(new ExpressError(404, "Page not found"));
  }
});
router.get("/contact", (req, res) => {
  res.render("main/contact");
});
router.get("/newblog", IsLoggedIn, (req, res) => {
  res.render("main/newblog");
});

router.post("/newpost", IsLoggedIn, async (req, res, next) => {
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
router.get("/search", async (req, res, next) => {
  try {
    const searchTerm = req.query.query;
    searchTerm.trim();
    console.log(searchTerm);
    const results = await Post.find({
      content: { $regex: searchTerm, $options: "i" },
    }); // MongoDB case-insensitive regex search
    console.log(results);
    res.status(200).render("main/blog", { content: results });
  } catch (error) {
    return next(new ExpressError(404, "no data found!"));
  }
});

module.exports = router;
