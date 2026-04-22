const express = require("express");
const { getFeedback } = require("../src/controllers/Controllers/FeedbackController");
const authMiddleware = require("../Middlewares/AuthMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getFeedback);

module.exports = router;