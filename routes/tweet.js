import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth.js";
import {
  createTweets,
  getAll,
  getById,
  getMyTweets,
  removeTweet,
  updateTweet,
  getComments,
  getTweetCountHour
} from "../controller/tweets.js";

const router = new Router();

router.post("/", checkAuth, createTweets);
router.get("/", getAll);
router.get("/:id", getById);
router.get("/user/me", checkAuth, getMyTweets);
router.delete("/:id", checkAuth, removeTweet);
router.put("/:id", checkAuth, updateTweet);
router.get("/comments/:id", getComments);
router.get("/count", getTweetCountHour);

export default router;
