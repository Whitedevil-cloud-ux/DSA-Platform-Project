const express = require("express");
const router = express.Router();

const { submitProblem, getProblemSubmissions } = require("../Controllers/SubmissionController");
const authMiddleware = require("../Middlewares/AuthMiddleware");

router.post("/", authMiddleware, submitProblem);
router.get("/problem/:problemId", authMiddleware, getProblemSubmissions);

module.exports = router;