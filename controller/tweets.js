import Comment from "../models/Comment.js";
import Tweets from "../models/Tweets.js";
import User from "../models/User.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

export const createTweets = async (req, res) => {
  try {
    const { title, text } = req.body;
    const user = await User.findById(req.userId);

    if (req.files) {
      let fileName = Date.now().toString() + req.files.image.name;
      const __dirname = dirname(fileURLToPath(import.meta.url));
      req.files.image.mv(path.join(__dirname, "..", "uploads", fileName));

      const newTweetWithImage = new Tweets({
        email: user.email,
        title,
        text,
        imageUrl: fileName,
        author: req.userId,
      });

      await newTweetWithImage.save();
      await User.findByIdAndUpdate(req.userId, {
        $push: { tweets: newTweetWithImage },
      });

      return res.json(newTweetWithImage);
    }

    
    const newTweetWithoutImage = new Tweets({
      email: user.email,
      title,
      text,
      imageUrl: "",
      author: req.userId,
    });
    await newTweetWithoutImage.save();
    await User.findByIdAndUpdate(req.userId, {
      $push: { tweets: newTweetWithoutImage },
    });

    return res.json(newTweetWithoutImage);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'InternalServerError' });
  }
};

export const getAll = async (req, res) => {
  try {
    const tweets = await Tweets.find().sort("-createdAt");
    const popularTweets = await Tweets.find().limit(5).sort("-views");
    if (!tweets) {
      return res.json({ message: 'NotFound' });
    }

    res.json({ tweets, popularTweets });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'InternalServerError' });
  }
};

export const getById = async (req, res) => {
  try {
    const tweet = await Tweets.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { views: 1 } }
    );
    if (!tweet) {
      return res.json({ message: 'NotFound' });
    }
    res.json(tweet);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'InternalServerError' });
  }
};

export const getMyTweets = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const list = await Promise.all(
      user.tweets.map((tweet) => {
        return Tweets.findById(tweet._id);
      })
    );
    res.json(list);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'InternalServerError' });
  }
};

export const removeTweet = async (req, res) => {
  try {
    const tweet = await Tweets.findByIdAndDelete(req.params.id);
    if (!tweet) {
      res.json({ message: 'NotFound' });
    }
    await User.findByIdAndUpdate(req.userId, {
      $pull: { tweets: req.params.id },
    });
    res.json({ message: 'Deletion completed' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'InternalServerError' });
  }
};

export const updateTweet = async (req, res) => {
  try {
    const { title, text, id } = req.body;
    const tweet = await Tweets.findById(id);

    if (req.files) {
      let fileName = Date.now().toString() + req.files.image.name;
      const __dirname = dirname(fileURLToPath(import.meta.url));
      req.files.image.mv(path.join(__dirname, "..", "uploads", fileName));
      tweet.imageUrl = fileName || "";
    }
    tweet.title = title;
    tweet.text = text;
    await tweet.save();

    res.json(tweet);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'InternalServerError' });
  }
};

export const getComments = async (req, res) => {
  try {
    const tweet = await Tweets.findById(req.params.id);
    const list = await Promise.all(
      tweet.comments.map((comment) => {
        return Comment.findById(comment);
      })
    );
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: 'InternalServerError' });
  }
};

// export const getTweetCountHour = async (req, res) => {
//   try {
//     // const previousDay = new Date();
//     // previousDay.setDate(previousDay.getDate() - 1);

//     const tweetCountHour = await Tweets.countDocuments({
//       createdAt: {$gte: ISODate('2023-06-02'), $lt:ISODate('2023-06-03')}
//     })

//     res.json({ tweetCountHour });
//   } catch (error) {
//     console.log(error);
//     // res.status(500).json({ message: "InternalServerError" });
//   }
// };


