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

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId).select('-password')
    
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {}
};

export const updateUserProfile = async (req, res) => {
  const imageUrl = 'https://m.media-amazon.com/images/I/91yuQ3m+cvL._AC_SX522_.jpg';
  
  // Fetch the image from the URL
  const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
  
  const pic = {
    file: {
      fieldname: 'profilePicture',
      originalname: '91yuQ3m+cvL._AC_SX522_.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      destination: '/uploads/',
      filename: '91yuQ3m+cvL._AC_SX522_.jpg',
      path: imageUrl,  // URL path of the image
      size: response.data.length,  // Size in bytes
      buffer: Buffer.from(response.data),  // Convert the image data to a buffer
    }
  };

  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = pic.file;
    let cloudResponse;

    if (profilePicture) {
      const fileuri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileuri);
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();
    return res
      .status(200)
      .json({ message: "profile updated successfully", success: true, user });
  } catch (error) {
    console.log(error);
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUser = await User.findOne({ _id: { $ne: req.id } }).select(
      "-password"
    );

    if (!suggestedUser) {
      return res.status(404).json({
        message: "No suggested users found",
        success: false,
      });
    }
    return res.status(200).json({
      suggestedUser,
      success: true,
    });
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
