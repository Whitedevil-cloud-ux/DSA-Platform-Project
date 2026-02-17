const express = require("express");
const router = express.Router();
const { fetchPatternInsights } = require("../Controllers/PatternInsightController");
const AuthMiddleware = require("../Middlewares/AuthMiddleware");

router.get(
    "/pattern-insights",
    AuthMiddleware,
    fetchPatternInsights
);

module.exports = router;