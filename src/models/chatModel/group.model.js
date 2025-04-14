const mongoose = require("mongoose");

const groupModel = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model('Group', groupModel);
