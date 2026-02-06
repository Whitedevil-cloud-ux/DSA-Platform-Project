const express = require("express");
const AuthMiddleware = require("../Middlewares/AuthMiddleware");
const { onboardingUser, getUserProfile } = require("../Controllers/UserController");
const router = express.Router();

router.post("/onboarding", AuthMiddleware, onboardingUser);
router.post("/profile", AuthMiddleware, getUserProfile);

module.exports = router;