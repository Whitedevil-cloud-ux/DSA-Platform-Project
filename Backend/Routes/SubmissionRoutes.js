const express = require("express");
const router = express.Router();

const { submitProblem, getProblemSubmissions, updateConfidence } = require("../Controllers/SubmissionController");
const authMiddleware = require("../Middlewares/AuthMiddleware");

router.post("/", authMiddleware, submitProblem);
router.get("/problem/:problemId", authMiddleware, getProblemSubmissions);
router.patch("/:submissionId/confidence", authMiddleware, updateConfidence);

module.exports = router;