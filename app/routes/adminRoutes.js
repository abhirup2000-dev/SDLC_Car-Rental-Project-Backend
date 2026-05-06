const express = require('express');

const adminController = require('../controller/adminController');
const upload = require("../utils/CloudinaryStorage")
const adminAuthcheck = require("../middleware/adminAuthCheck")

const router = express.Router();


router.post("/register", adminController.adminRegister)
router.post("/login", adminController.adminLogin)




module.exports = router