import { generateTokenAndSetCookie } from "../lib/utils/generateTokenAndSetCookie.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"

export const signUp = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid Email" });
    }

    if (password.length <= 3) {
      return res.status(400).json({ error: "Password length must be greater than 3" })
    }

    const existingUser = await User.findOne({
      username,
    });
    if (existingUser) {
      return res.status(400).json({
        error: "Username is already taken",
      });
    }

    const existingEmail = await User.findOne({
      email,
    });
    if (existingEmail) {
      return res.status(400).json({
        error: "Email is already taken",
      });
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res)
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg
      })
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    console.log("Error in signup controller", error);
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      username
    })
    const isPasswordCorrect = await bcrypt.compare(password, user?.password || "") //if any case failed it will compare with empty string

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg
    })
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    console.log("Error in login controller", error);
  }
};

export const logout = async (req, res) => {
  res.json({
    data: "you hit the logout endpoint",
  });
};
