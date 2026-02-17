const express = require("express");
const { getFeedback } = require("../Controllers/FeedbackController");
const authMiddleware = require("../Middlewares/AuthMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getFeedback);

module.exports = router;