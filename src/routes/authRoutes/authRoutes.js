const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController/auth.controller.js');


router.post('/register', authController.registerController);
router.post('/login', authController.loginController);
router.post('/verify-auth', authController.verifyAuth);
router.get('/logout', authController.logoutController)


module.exports = router;