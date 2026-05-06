const express = require('express');

const AdminRoutes = require("./adminRoutes")
const UserRoutes = require("./userRoutes")

const router = express.Router();


router.use("/admin", AdminRoutes)
router.use("/user", UserRoutes)


module.exports = router