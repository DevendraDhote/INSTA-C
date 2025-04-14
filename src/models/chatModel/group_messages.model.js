const mongoose = require("mongoose");

const groupMessageModel = new mongoose.Schema({
  group_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
  },
  sender_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  content: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("GroupMessage", groupMessageModel);
