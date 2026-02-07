const express = require("express");
const router = express.Router();

const { submitProblem } = require("../Controllers/SubmissionController");
const authMiddleware = require("../Middlewares/AuthMiddleware");

router.post("/", authMiddleware, submitProblem);

module.exports = router;