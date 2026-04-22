const express = require("express");
const { fetchUserInsights } = require("../src/controllers/Controllers/InsightController");
const AuthMiddleware = require("../Middlewares/AuthMiddleware");

const router = express.Router();

router.get("/insights", AuthMiddleware, fetchUserInsights);

module.exports = router;