const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  dob: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  stories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  sockets: [
    {
      type: String,
      default: [],
    },
  ],
});

userSchema.methods.generateToken = async (user) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });
};

userSchema.pre("save", async function (next) {
  // console.log(this)
  // if (!this.isModified("password")) return next()
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    console.log("errororororor", error);
  }
});

userSchema.methods.comparePassword = async function (plainPass) {
  return await bcrypt.compare(plainPass, this.password);
};

userSchema.statics.findByEmail = async function (email) {
  return this.findOne({ email });
};

module.exports = mongoose.model("User", userSchema);
