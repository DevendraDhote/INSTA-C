const express = require("express");
const router = express.Router();
const User = require("../../models/userModel/user.models.js");
const chatController = require("../../controllers/chatsController/chat.controller.js");
const Chat = require("../../models/chatModel/chat.modal.js");
const Group = require("../../models/chatModel/group.model.js");

router.get("/chat-page", async (req, res) => {
  try {
    const { userId } = req.cookies;
    const user = await User.findById(userId).populate("followers");
    // console.log("user dekhle bhai->", user)
    res.render("chats/chatHome.ejs", { users: user, currentUser: userId });
  } catch (error) {
    res.send({ error: error });
  }
});

router.get("/room/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { userId } = req.cookies;
    console.log(".............", id);
    if (!id) return res.json("userId not found");
    const user = await User.findById(id);
    const chat = await Chat.find();
    res.render("chats/chatRoom.ejs", {
      chats: chat,
      user: user,
      sender: userId,
    });
  } catch (error) {
    console.log(error);
    res.send({ errororororo: error });
  }
});

router.get("/groupsPage", async (req, res) => {
  try {
    const findGroups = await Group.find();

    if (!findGroups) return res.send("group creation failed");
    res.render("chats/groupsHome.ejs", { groups: findGroups });
  } catch (error) {
    res.json({"error": error})
  }
});

router.post("/create-group", async (req, res) => {
  try {
    const { members, name } = req.body;

    const group = new Group({
      groupName: name,
      members,
    });

    await group.save();

    if (!group) return res.send("group cannot created");

    const findGroup = await Group.find();

    console.log("pop------->", group);
    res.redirect("/chats/groupsPage");
  } catch (error) {
    res.send(error);
  }
});

router.get("/group-room/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const {userId} = req.cookies;
    
    console.log(".............", id);
    if (!id) return res.json("userId not found");
    const grp = await Group.findById(id).populate('members');
    res.render("chats/groupRoom.ejs", {
      group: grp,
      sender:userId
    });
  } catch (error) {
    console.log(error);
    res.send({ "errororororo": error });
  }
});

router.post("/create-chat", chatController.saveMessage);

module.exports = router;
