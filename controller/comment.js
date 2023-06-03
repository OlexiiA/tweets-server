import Comment from '../models/Comment.js';
import Tweets from '../models/Tweets.js';

export const createComment = async (req, res) => {
  try {
    const { tweetId, comment } = req.body;

    if (!comment) {
      return res.status(400).json({ message: 'Comment should not be empty' });
    }

    const newComment = new Comment({ comments: comment });
    await newComment.save();

    try {
      await Tweets.findByIdAndUpdate(tweetId, {
        $push: { comments: newComment._id },
      });
    } catch (error) {
      console.log(error);
    }

    res.json(newComment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error creating comment' });
  }
};
