let mongoose = require("mongoose");
let { Schema } = mongoose;

const post_schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: String,
  },
  author: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
});

const Post = mongoose.model("Post", post_schema);

module.exports = Post;
