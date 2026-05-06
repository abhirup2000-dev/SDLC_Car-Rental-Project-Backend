const express = require('express');

const userController = require('../controller/userController');
const upload = require("../utils/CloudinaryStorage")
const userAuthcheck = require("../middleware/userAuthCheck")

const router = express.Router();


router.post("/register", userController.userRegister)
router.post("/login", userController.userLogin)


module.exports = router