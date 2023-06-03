import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const isUsed = await User.findOne({ email });

    if (isUsed) {
      return res.status(402).json({
        message: "The user already exists",
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = new User({
      email,
      password: hash,
    });

    const token = jwt.sign(
      {
        id: newUser._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    await newUser.save();

    res.json({
      token,
      message: "Registration is successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error registering user",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Incorrect email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    req.userId = user._id;

    res.json({
      token,
      user,
      message: "You are logged in",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error authorizing user",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    console.log(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Access denied",
    });
  }
};
