const express = require("express");
const router = express.Router();
const { getConfidenceAnalytics } = require("../Controllers/AnalyticsController");
const AuthMiddleware = require("../Middlewares/AuthMiddleware");

router.get("/confidence", AuthMiddleware, getConfidenceAnalytics);

module.exports = router;