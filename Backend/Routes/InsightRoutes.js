const express = require("express");
const { fetchUserInsights } = require("../Controllers/InsightController");
const AuthMiddleware = require("../Middlewares/AuthMiddleware");

const router = express.Router();

router.get("/insights", AuthMiddleware, fetchUserInsights);

module.exports = router;