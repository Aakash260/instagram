import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";
import axios from "axios";
import { Post } from "../models/post.model.js";

export const register = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ msg: "All fields are required", success: false });
    }

    const user = await User.findOne({ email: email });
    if (user) {
      return res
        .status(400)
        .json({ msg: "Email already exists", success: false });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashPassword, username });
    return res.status(201).json({ msg: "Account created", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ msg: "All fields are required", success: false });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ msg: "User not found", success: false });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ msg: "Invalid credentials", success: false });
    }

 
    const populatedPosts = await Promise.all(
      user.posts.map( async (postId) => {
          const post = await Post.findById(postId);
          if(post.author.equals(user._id)){
              return post;
          }
          return null;
      })
  )

    const token = await jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d", // 1 hour
      }
    );
    delete user.password;
    user.posts=populatedPosts
    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: true,
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.username}`,
        success: true,
        user,
      });
  } catch (err) {
    console.log(err)
  }
};

export const logout = async (req, res) => {
  try {
    return res
      .cookie("token", "", {
        maxAge: 0,
      })
      .json({
        message: "Logged out successfully",
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

export const getProfile = async (req, res) => {
  try {
      const userId = req.params.id;
      let user = await User.findById(userId).populate({path:'posts', createdAt:-1}).populate('bookmarks');
      return res.status(200).json({
          user,
          success: true
      });
  } catch (error) {
      console.log(error);
  }
};

export const updateUserProfile = async (req, res) => {
  try {
      const userId = req.id;
      const { bio, gender } = req.body;
      const profilePicture = req.file;
      let cloudResponse;
 
      if (profilePicture) {
          const fileUri = getDataUri(profilePicture);
          cloudResponse = await cloudinary.uploader.upload(fileUri);
      }

      const user = await User.findById(userId).select('-password');
      if (!user) {
          return res.status(404).json({
              message: 'User not found.',
              success: false
          });
      };
      if (bio) user.bio = bio;
      if (gender) user.gender = gender;
      if (profilePicture) user.profilePicture = cloudResponse.secure_url;

      await user.save();

      return res.status(200).json({
          message: 'Profile updated.',
          success: true,
          user
      });

  } catch (error) {
      console.log(error);
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
      const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
      if (!suggestedUsers) {
          return res.status(400).json({
              message: 'Currently do not have any users',
          })
      };
      return res.status(200).json({
          success: true,
          users: suggestedUsers
      })
  } catch (error) {
      console.log(error);
  }
};

export const followorUnfollowUser = async (req, res) => {
  try {
    const followKrneWala = req.id;
    const jiskofollowKrunga = req.params.id;
    if (followKrneWala == jiskofollowKrunga) {
      return res.status(400).json({
        message: "You can not follow yourself",
        success: false,
      });
    }

    const user = await User.findById(followKrneWala);

    const targetUser = await User.findById(jiskofollowKrunga);

    if (!user || !targetUser) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // now check u that u have to follow or unfollow

    const isFollowing=user.following.includes(jiskofollowKrunga)
    if(isFollowing){
      await Promise.all([
        User.updateOne({_id:followKrneWala},{$pull:{following:jiskofollowKrunga}}),
        User.updateOne({_id:jiskofollowKrunga},{$pull:{followers:followKrneWala}})
       ])
       return res.status(200).json({ message: "Unfollowed successfully", success: true });
    }else{
       await Promise.all([
        User.updateOne({_id:followKrneWala},{$push:{following:jiskofollowKrunga}}),
        User.updateOne({_id:jiskofollowKrunga},{$push:{followers:followKrneWala}})
       ])
       return res.status(200).json({ message: "Followed successfully", success: true });
    }

  } catch (error) {

  }
};
