const express = require('express');
const router = express.Router();
const postControllers = require('../../controllers/postController/post.controller.js')
const Post = require('../../models/postModel/post.model.js')


router.get('/create-post', async (req, res) => {
    res.render('post/createPost.ejs')
})

router.get('/dashboard', async (req, res) => {
    const allPosts = await Post.find().populate('user')

    res.render('Home/homepage.ejs', {posts:allPosts})
})
router.post('/createPost', postControllers.createPostController);
router.get('/getAllPost', postControllers.getPostController);
router.get('/like/:id', postControllers.likesController);
router.get('/follow/:id', postControllers.followerController);


module.exports = router;