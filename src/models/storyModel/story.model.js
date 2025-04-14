const mongoose = require("mongoose");

const StorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  imageUrl: String,
  mediaType: { type: String, enum: ["image", "video"] },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
});

module.exports = mongoose.model("Story", StorySchema);
