const express = require("express");
const router = express.Router();
const Post = require("../../models/postModel/post.model.js");
const profileController = require('../../controllers/profileController/profile.controller.js')

router.get("/profile-page", profileController.profileDetails);

module.exports = router;
