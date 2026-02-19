const express = require("express");
const router = express.Router();
const { getAllProblems, getProblemBySlug } = require("../Controllers/ProblemController");
const AuthMiddleware = require("../Middlewares/AuthMiddleware");

router.get("/", AuthMiddleware, getAllProblems);
router.get("/:slug", AuthMiddleware, getProblemBySlug);

module.exports = router;