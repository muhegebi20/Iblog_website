const { Schema, default: mongoose } = require("mongoose");

const commentSchema = new Schema({
  body: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
