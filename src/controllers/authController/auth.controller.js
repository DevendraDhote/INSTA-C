const User = require('../../models/userModel/user.models.js')
const cacheSystem = require('../../services/cache.services.js')
const Post= require('../../models/postModel/post.model.js');

const registerController = async (req, res) => {
    try {
        const { name, email, password, dob } = req.body;
        console.log("dekh =>", name, email, password, dob)

        const user = new User({
            name, email, dob, password
        })
        await user.save();

        const token = user.generateToken(user);
        res.cookie("token", token, { httpOnly: true });
        res.cookie("userId", user._id.toString(), { httpOnly: true, secure: true, maxAge: 60 * 60 * 1000 });
        // res.status(201).json({message:"User registered Successfully"});

        const allPost = await Post.find().populate('user')

        res.render('Home/homepage.ejs', {posts:allPost})
    } catch (error) {
        console.log("error hai bhai", error)
        res.status(501).json({ "error": error });
    }
}

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        // console.log("email", email)
        const user = await User.findByEmail(email)
        // console.log(user)
        if (!user) return res.status(401).json("user not found");
        const checkPass = await user.comparePassword(password)
        if (!checkPass) return res.status(401).json({ messsage: "User not found" });

        const token = user.generateToken(user)

        console.log("Token", token)

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 180000
        });


        res.cookie("userId", user._id.toString(), { httpOnly: true, secure: true, maxAge: 60 * 60 * 1000 });

        const allPost = await Post.find().populate('user')

        return res.render("Home/homepage.ejs", {posts:allPost});
        // res.json("logged in")
    } catch (error) {
        console.log(error)
        res.status(501).json({ "error": error })
    }
}

const verifyAuth = async (req, res) => {
    const { token } = req.cookies;
    if (!token) return res.status(400).json({ error: "Invalid request" });

    const session = await cacheSystem.get(`session:${token}`);
    if (!session) {
        return res.status(401).json({ error: "Session expired or logged out" });
    }

    res.json({ message: "Authentication successful!" });
};



const logoutController = async (req, res) => {
    try {
        const { signature } = req.cookies;
        console.log("signature", signature)
        if (!signature) return res.status(400).json({ error: "Signature required" });

        const deleted = await cacheSystem.del(`session:${signature}`);

        if (deleted === 0) {
            return res.status(401).json({ error: "Invalid or expired session" });
        }

        res.clearCookie('signature');
        res.clearCookie('challenge');
        res.clearCookie('userId');

        res.redirect('/')
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = { registerController, loginController, verifyAuth, logoutController };