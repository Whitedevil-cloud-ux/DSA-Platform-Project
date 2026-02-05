const { signup, login } = require("../Controllers/AuthController");
const { userVerification } = require("../Middlewares/AuthMiddleware");
const router = require("express").Router();

router.post("/signup", signup);
router.post("/login", login);

router.post("/", userVerification);

module.exports = router;