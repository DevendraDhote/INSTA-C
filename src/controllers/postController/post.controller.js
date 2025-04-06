const Post = require('../../models/postModel/post.model.js')
const User = require('../../models/userModel/user.models.js')

const createPostController = async (req, res) => {
    // console.log("req dekh", req.cookies.userId)
    try {
        const { imageUri, caption } = req.body;
        if (!imageUri) return res.status(401).json({ "message": "Image uri is missing" })

        const userId = req.cookies.userId;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const post = new Post({
            imageUri, caption, user: userId
        })
        await post.save();

        const allPost = await Post.find().populate('user')
        // res.status(201).json({ 'message': "Post Created Successfully" });
        res.render('Home/homepage.ejs', { posts: allPost, message: "Posts fetched successfully" });
        // res.send(allPost)
    } catch (error) {
        console.log("dekh be =>", error)
        res.status(501).json({ "error": error })
    }
}

const getPostController = async (req, res) => {
    try {
        const allPost = await Post.find();
        // res.status(201).json({ "message": "post fetched" });
        res.render('homepage.ejs', { posts: allPost, message: "Posts fetched successfully" });
    } catch (error) {
        res.status(501).json({ "error": error });
    }
}

const likesController = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.cookies.userId;

        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const post = await Post.findById(postId);

        if (!post) return res.status(404).json({ error: 'Post not found' });

        const hasLiked = post.likes.includes(userId);

        if (hasLiked) {
            post.likes = post.likes.filter(id => id.toString() !== userId);
        } else {
            post.likes.push(userId);
        }

        await post.save();

        res.redirect('/home/dashboard')
    } catch (error) {
        console.log("error:", error);
        res.json({ error: error.message });
    }x  
};

const followerController = async (req, res) => {
    try {   
        const userId = req.cookies.userId;
        const otherUserId = req.params.id;

        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const user = await User.findById(otherUserId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const hasFollowed = user.followers.includes(userId);
        
        if (hasFollowed) {
            user.followers = user.followers.filter(id => id.toString() !== userId);
        } else {
            user.followers.push(userId);
        }

        await user.save();

        res.redirect('/home/dashboard')

    } catch (error) {
        console.log("error:", error);
        res.status(500).json({ error: error.message });
    }
};


module.exports = { createPostController, getPostController, likesController, followerController};