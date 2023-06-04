import mongoose from "mongoose";

const TweetSchema = new mongoose.Schema(
  {
    email: { type: String },
    title: { type: String, required: true, maxlength: 20 },
    text: { type: String, required: true, maxlength: 280 },
    imageUrl: { type: String, default: "" },
    views: { type: Number, default: 0 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

export default mongoose.model("Tweets", TweetSchema);
