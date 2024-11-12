import express from 'express'
import { updateUserProfile,login, register,logout, getUserProfile, getSuggestedUsers, followorUnfollowUser } from '../controllers/user.controller.js';
import isAuthenticated from '../middleware/isAuthenticated.js';
import upload from '../middleware/multer.js';

const router=express.Router();

router.post('/register',register)
router.post('/login',login)
router.get('/logout',logout)
router.get('/:id/profile',isAuthenticated,getUserProfile)
router.post('/profile/edit',isAuthenticated,upload.single('profilePicture'),updateUserProfile);
router.get('/suggested',isAuthenticated,getSuggestedUsers)
router.post('/followOrUnfollow/:id',isAuthenticated,followorUnfollowUser)

export default router