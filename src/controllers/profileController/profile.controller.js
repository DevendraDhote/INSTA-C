const User = require("../../models/userModel/user.models.js");
const Post = require("../../models/postModel/post.model.js");

const profileDetails = async (req, res) => {
  try {
    const { userId } = req.cookies;
    if (!userId) return res.json("userId not found");

    const user1 = await User.findById(userId);
    if (!user1) return res.json("User not found");

    const userPost = await Post.find({ user: userId });
    console.log("pop", userPost);

    const user = {
      username: user1.name,
      postsCount: user1.posts.length,
      followers: user1.followers.length,
      following: user1.following.length,
      profileImage:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=3164&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      posts: userPost,
    };

    // console.log("dekh be", user);

    res.render("Home/profile.ejs", { user });
  } catch (error) {
    res.json({ error: error });
  }
};

module.exports = { profileDetails };
