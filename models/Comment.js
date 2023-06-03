import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    comments: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", CommentSchema);
