import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    tweets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweets",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
