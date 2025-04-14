const express = require('express');
const router = express.Router();
const postControllers = require('../../controllers/postController/post.controller.js')
const Post = require('../../models/postModel/post.model.js')
const Story = require('../../models/storyModel/story.model.js')
const User = require('../../models/userModel/user.models.js')


router.get('/create-post', async (req, res) => {
    res.render('post/createPost.ejs')
})

router.get('/dashboard', async (req, res) => {
    const {userId} = req.cookies
    const allPosts = await Post.find().populate('user')
    const allStory = await Story.find({ expiresAt: { $gt: new Date() } }).populate('user');
    const otherUsers = await User.find({ _id: { $ne: userId } });

    res.render('Home/homepage.ejs', {posts:allPosts, stories:allStory, followers:otherUsers})
})
router.post('/story', postControllers.storyController);
router.post('/createPost', postControllers.createPostController);
router.get('/getAllPost', postControllers.getPostController);
router.get('/like/:id', postControllers.likesController);
router.get('/follow/:id', postControllers.followerController);


module.exports = router;