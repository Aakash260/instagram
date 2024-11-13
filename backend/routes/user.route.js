import express from 'express'
import { updateUserProfile,login, register,logout, getProfile, getSuggestedUsers, followorUnfollowUser } from '../controllers/user.controller.js';
import isAuthenticated from '../middleware/isAuthenticated.js';
import upload from '../middleware/multer.js';

const router=express.Router();

router.post('/register',register)
router.post('/login',login)
router.get('/logout',logout)
router.get('/:id/profile',isAuthenticated,getProfile)
router.post('/profile/edit',isAuthenticated,upload.single('profilePhoto'),updateUserProfile);
router.get('/suggested',isAuthenticated,getSuggestedUsers)
router.post('/followOrUnfollow/:id',isAuthenticated,followorUnfollowUser)

export default router