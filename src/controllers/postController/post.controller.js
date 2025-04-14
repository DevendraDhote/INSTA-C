const multer = require("multer");
const Post = require("../../models/postModel/post.model.js");
const User = require("../../models/userModel/user.models.js");
const Story = require("../../models/storyModel/story.model.js");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/data/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({
  storage: storage,
}).single("storyFile");

const createPostController = async (req, res) => {
  // console.log("req dekh", req.cookies.userId)
  try {
    const { imageUri, caption } = req.body;
    if (!imageUri)
      return res.status(401).json({ message: "Image uri is missing" });

    const userId = req.cookies.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const post = new Post({
      imageUri,
      caption,
      user: userId,
    });
    await post.save();

    const allPost = await Post.find().populate("user");
    // res.status(201).json({ 'message': "Post Created Successfully" });
    res.redirect('/home/dashboard')
    // res.send(allPost)
  } catch (error) {
    console.log("dekh be =>", error);
    res.status(501).json({ error: error });
  }
};

const getPostController = async (req, res) => {
  try {
    const allPost = await Post.find();
    // res.status(201).json({ "message": "post fetched" });
    res.render("homepage.ejs", {
      posts: allPost,
      message: "Posts fetched successfully",
    });
  } catch (error) {
    res.status(501).json({ error: error });
  }
};

const likesController = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.cookies.userId;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ error: "Post not found" });

    const hasLiked = post.likes.includes(userId);

    if (hasLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.redirect("/home/dashboard");
  } catch (error) {
    console.log("error:", error);
    res.json({ error: error.message });
  }
  x;
};

const followerController = async (req, res) => {
  try {
    const userId = req.cookies.userId;
    const otherUserId = req.params.id;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await User.findById(otherUserId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const hasFollowed = user.followers.includes(userId);

    if (hasFollowed) {
      user.followers = user.followers.filter((id) => id.toString() !== userId);
    } else {
      user.followers.push(userId);
    }

    await user.save();

    const currentUser = await User.findById(userId);
    console.log("cu", currentUser)
    if (!currentUser)
      return res.status(404).json({ error: "Current user not found" });

    const hasFollowing = currentUser.following.includes(otherUserId);

    if (hasFollowing) {
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== otherUserId
      );
    } else {
      currentUser.following.push(otherUserId);
    }

    await currentUser.save();

    res.redirect("/home/dashboard");
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ error: error.message });
  }
};

const storyController = (req, res) => {
  const { userId } = req.cookies;

  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const story = new Story({
        user: userId,
        imageUrl: `${file.filename}`,
        mediaType: file.mimetype.startsWith("video") ? "video" : "image",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      await story.save();
      console.log("stories", story)

      const allStory = await Story.find({ expiresAt: { $gt: new Date() } }).populate('user');


      const allPost = await Post.find().populate("user");
      res.redirect('/home/dashboard')
    } catch (error) {
      console.error("agyaa->", error);
      res.status(500).json({ error: error.message });
    }
  });
};

module.exports = {
  createPostController,
  getPostController,
  likesController,
  followerController,
  storyController,
};
