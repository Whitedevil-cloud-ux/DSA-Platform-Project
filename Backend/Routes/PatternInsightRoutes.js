const express = require("express");
const router = express.Router();
const { fetchPatternInsights } = require("../src/controllers/Controllers/PatternInsightController");
const AuthMiddleware = require("../Middlewares/AuthMiddleware");

router.get(
    "/pattern-insights",
    AuthMiddleware,
    fetchPatternInsights
);

module.exports = router;