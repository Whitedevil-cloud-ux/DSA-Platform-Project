const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../Controllers/DashboardController");
const AuthMiddleware = require("../Middlewares/AuthMiddleware");

router.get("/stats", AuthMiddleware, getDashboardStats);

module.exports = router;